import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db, isMockEnabled } from './firebase';
import initialTestimonials from '../data/testimonials.json';
import { triggerMockUpdate } from '../hooks/useRealTime';

export interface Testimonial {
  id: string;
  name: string;
  nameHi?: string;
  location: string;
  review: string;
  reviewHi?: string;
  rating: number;
  avatar: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

const MOCK_STORAGE_KEY = 'sawariya_testimonials';

// Initialize mock testimonials if not present in localStorage
const getMockTestimonials = (): Testimonial[] => {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!data) {
    const formatted: Testimonial[] = initialTestimonials.map((t, index) => ({
      id: `static_${index}`,
      name: t.name,
      nameHi: t.nameHi,
      location: t.location,
      review: t.review,
      reviewHi: t.reviewHi || '',
      rating: t.rating,
      avatar: t.avatar,
      email: '',
      status: 'approved',
      createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
    }));
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(formatted));
    return formatted;
  }
  return JSON.parse(data);
};

const saveMockTestimonials = (items: Testimonial[]) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(items));
  // Dispatch reactive update for mock listeners
  triggerMockUpdate(MOCK_STORAGE_KEY);
};

export const testimonialService = {
  /**
   * Get all approved testimonials for public display (fallback check)
   */
  async getApproved(): Promise<Testimonial[]> {
    if (isMockEnabled) {
      const items = getMockTestimonials();
      return items.filter(t => t.status === 'approved');
    }

    try {
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(
        testimonialsRef, 
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const list: Testimonial[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
        } as Testimonial);
      });
      return list;
    } catch (error) {
      console.error('Error fetching approved testimonials, falling back:', error);
      const items = getMockTestimonials();
      return items.filter(t => t.status === 'approved');
    }
  },

  /**
   * Submit a new testimonial (defaults to pending)
   */
  async submit(testimonial: Omit<Testimonial, 'id' | 'status' | 'createdAt'>): Promise<Testimonial> {
    const newDoc = {
      ...testimonial,
      status: 'pending' as const,
      createdAt: isMockEnabled ? new Date().toISOString() : Timestamp.now()
    };

    if (isMockEnabled) {
      const items = getMockTestimonials();
      const createdItem: Testimonial = {
        id: `mock_${Date.now()}`,
        ...newDoc
      };
      items.unshift(createdItem);
      saveMockTestimonials(items);
      return createdItem;
    }

    const docRef = await addDoc(collection(db, 'testimonials'), newDoc);
    return {
      id: docRef.id,
      ...newDoc,
      createdAt: new Date()
    } as Testimonial;
  },

  /**
   * Admin: Get all testimonials
   */
  async getAll(): Promise<Testimonial[]> {
    if (isMockEnabled) {
      return getMockTestimonials();
    }

    try {
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(testimonialsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list: Testimonial[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
        } as Testimonial);
      });
      return list;
    } catch (error) {
      console.error('Error fetching all testimonials:', error);
      return getMockTestimonials();
    }
  },

  /**
   * Admin: Update testimonial status or details
   */
  async update(id: string, updates: Partial<Testimonial>): Promise<void> {
    if (isMockEnabled) {
      const items = getMockTestimonials();
      const updated = items.map(t => t.id === id ? { ...t, ...updates } : t);
      saveMockTestimonials(updated);
      return;
    }

    try {
      const docRef = doc(db, 'testimonials', id);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.error('Firestore testimonial update failed:', err);
      throw err;
    }
  },

  /**
   * Admin: Delete testimonial
   */
  async delete(id: string): Promise<void> {
    if (isMockEnabled) {
      const items = getMockTestimonials();
      const filtered = items.filter(t => t.id !== id);
      saveMockTestimonials(filtered);
      return;
    }

    try {
      const docRef = doc(db, 'testimonials', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Firestore testimonial delete failed:', err);
      throw err;
    }
  }
};
