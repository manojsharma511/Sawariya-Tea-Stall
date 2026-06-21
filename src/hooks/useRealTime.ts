import { useState, useEffect } from 'react';
import { collection, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, isMockEnabled } from '../services/firebase';

import defaultMenu from '../data/menu.json';
import defaultGallery from '../data/gallery.json';
import defaultOffers from '../data/offers.json';
import initialTestimonials from '../data/testimonials.json';

/**
 * Maps database/placeholder image URLs dynamically to valid local files.
 * Returns a NEW object — never mutates the input.
 * Safe to call on any document type (MenuItem, PriceDoc, GalleryItem, etc.).
 */
export function sanitizeImagePaths<T>(item: T): T {
  if (!item || typeof item !== 'object') return item;

  const obj = item as Record<string, any>;

  // Skip objects that have no image-related fields (e.g. PriceDoc)
  const hasImageField = obj.image || obj.src || obj.bgImage || obj.ownerImage;
  if (!hasImageField) return item;

  const fixPath = (src: string, itemName?: string): string => {
    if (!src || typeof src !== 'string') return src;

    // 1. Fix menu items with missing /images/ai-generated/ folder
    if (src.includes('/images/ai-generated/')) {
      const name = (itemName || '').toLowerCase();
      if (name.includes('masala') || name.includes('chai')) return '/images/masala-chai.jpg';
      if (name.includes('elaichi')) return '/images/elaichi-tea.jpg';
      if (name.includes('kulhad') || name.includes('tandoori')) return '/images/kulhad-tea.jpg';
      if (name.includes('kesar') || name.includes('saffron')) return '/images/special-tea.jpg';
      if (name.includes('adrak')) return '/images/masala-chai.jpg';
      if (name.includes('coffee')) return '/images/special-tea.jpg';
      if (name.includes('samosa') || name.includes('biscuit') || name.includes('rusk') || name.includes('bread') || name.includes('bun') || name.includes('toast') || name.includes('maggi')) {
        return '/images/snacks.jpg';
      }
      if (name.includes('lassi') || name.includes('drink')) return '/images/elaichi-tea.jpg';
      return '/images/masala-chai.jpg';
    }

    // 2. Map old /images/real-shop/ webp formats to actual JPG/png photos in public
    if (src.includes('/images/real-shop/')) {
      const parts = src.split('/');
      const filenameWithExt = parts[parts.length - 1];
      const filename = filenameWithExt.split('.')[0];
      
      const pngNames = ['336c8044-27f2-4c17-8a76-419fde413547', '44a932a8-1b25-4ab9-954c-37021b103281', '7a08f74a-2f4b-45d3-bd9b-9581045aa7a1', 'a251a44f-d0aa-4c88-894c-b0ccf80c16ad', 'cb5dc902-122f-49a9-a4f6-d03afe90cb10', 'f4aeda41-5550-46e3-8a88-a46e46a6769e'];
      const jpgNames = ['DSC_9368', 'DSC_9369', 'DSC_9370', 'DSC_9373', 'DSC_9374'];
      
      if (pngNames.includes(filename)) {
        return `/sawariya-photos/${filename}.png`;
      } else if (jpgNames.includes(filename)) {
        return `/sawariya-photos/${filename}.JPG`;
      }
      return `/sawariya-photos/cb5dc902-122f-49a9-a4f6-d03afe90cb10.png`;
    }

    // 3. Map missing /khatu-pics/ directory to /khatu-nagri/
    if (src.includes('/khatu-pics/')) {
      const parts = src.split('/');
      const filename = parts[parts.length - 1];
      if (filename.includes('2')) {
        return '/khatu-nagri/images (1).jpeg';
      }
      return '/khatu-nagri/download.jpeg';
    }

    // 4. Force placeholders /images/hero-bg.jpg and /images/about-bg.jpg to point to real stall photos
    if (src === '/images/hero-bg.jpg') {
      return '/sawariya-photos/cb5dc902-122f-49a9-a4f6-d03afe90cb10.png';
    }
    if (src === '/images/about-bg.jpg') {
      return '/sawariya-photos/a251a44f-d0aa-4c88-894c-b0ccf80c16ad.png';
    }

    return src;
  };

  // Build a new object with sanitized paths — never mutate input
  const itemName = typeof obj.name === 'string' ? obj.name : '';
  const result = { ...obj } as Record<string, any>;

  if (result.image) {
    result.image = fixPath(result.image, itemName);
  }
  if (result.src) {
    result.src = fixPath(result.src, itemName);
  }
  if (result.bgImage) {
    result.bgImage = fixPath(result.bgImage, itemName);
  }
  if (result.ownerImage) {
    result.ownerImage = fixPath(result.ownerImage, itemName);
  }

  return result as T;
}

/**
 * Returns static fallback array for any collection name.
 */
function getLocalFallbackForCollection(collectionName: string): any[] {
  switch (collectionName) {
    case 'menu_items':
      return defaultMenu.map((m, idx) => {
        const { price, ...rest } = m;
        return { ...rest, id: `menu_${idx}` };
      });
    case 'prices':
      return defaultMenu.map((m, idx) => ({
        id: `menu_${idx}`,
        price: m.price
      }));
    case 'gallery':
      return defaultGallery.map((g, idx) => ({
        ...g,
        id: `gallery_${idx}`
      }));
    case 'offers':
      return defaultOffers.map((o, idx) => ({
        ...o,
        id: o.id || `offer_${idx}`,
        active: true
      }));
    case 'testimonials':
      return initialTestimonials.map((t, idx) => ({
        ...t,
        id: `static_${idx}`,
        status: 'approved',
        createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString()
      }));
    default:
      return [];
  }
}

/**
 * Returns static fallback object for single document paths.
 */
function getLocalFallbackForDocument(collectionName: string, documentId: string): any {
  if (collectionName === 'site_content') {
    if (documentId === 'hero') {
      return {
        blessing: '🙏 श्री खाटू श्याम जी की जय 🙏',
        shopName: 'Sawariya Tea Stall',
        shopNameHi: 'साँवरिया टी स्टॉल',
        subtitle: 'Serving the finest spiced tea and warm snacks to devotees at Khatu Shyam Ji',
        subtitleHi: 'खाटू श्याम जी आओ, साँवरिया की स्पेशल चाय का मज़ा लो',
        bgImage: '/sawariya-photos/cb5dc902-122f-49a9-a4f6-d03afe90cb10.png'
      };
    }
    if (documentId === 'contact') {
      return {
        phone: '7340030949',
        whatsapp: '917340030949',
        email: 'mukeshsharma.khatu@gmail.com',
        address: 'Near Toran Gate, Khatu Shyam Ji, Rajasthan, India',
        addressHi: 'तोरण गेट के पास, खाटू श्याम जी, सीकर, राजस्थान',
        workingHours: {
          daily: '6:00 AM - 10:00 PM',
          dailyHi: 'सुबह 6 बजे से रात 10 बजे तक',
          festivals: 'Extended Hours',
          festivalsHi: 'त्योहारों के दिनों में अतिरिक्त समय तक खुली',
          ekadashi: 'Open Early',
          ekadashiHi: 'श्याम एकादशी पर जल्दी खुलती है'
        }
      };
    }
    if (documentId === 'about') {
      return {
        story: 'Welcome to Sawariya Tea Stall, located at the heart of the holy town of Khatu Shyam Ji, right near the iconic Toran Gate. We have been serving the most refreshing and flavorful spiced tea to thousands of devotees and visitors who come to seek blessings at the revered Khatu Shyam Ji Temple.\n\nRun by Mukesh Kumar, our tea stall is more than just a place for chai — it\'s a warm sanctuary where pilgrims rest after long journeys, seek refreshments, and leave feeling revitalized. Every single cup is brewed with pure dedication, using fresh premium Assam leaves, fresh milk, and hand-ground ginger, cardamom, and spices.',
        storyHi: 'साँवरिया टी स्टॉल में स्वागत है। हम खाटू श्याम जी के तोरण गेट के पास स्थित हैं। बाबा श्याम के दर्शन के बाद हमारी कुल्हड़ चाय का स्वाद आपके सफर को हमेशा के लिए यादगार बना देगा। मनोज जी द्वारा संचालित यह दुकान केवल चाय की दुकान नहीं, बल्कि भक्तों की थकान मिटाने और आराम करने की जगह है। 🙏',
        ownerName: 'Mukesh Sharma',
        ownerNameHi: 'मुकेश शर्मा',
        ownerTitle: 'Owner & Tea Master',
        ownerImage: '/sawariya-photos/a251a44f-d0aa-4c88-894c-b0ccf80c16ad.png',
        stats: [
          { icon: 'Coffee', value: '1000+', label: 'Cups Daily', labelHi: 'कप प्रतिदिन' },
          { icon: 'Users', value: '10K+', label: 'Happy Customers', labelHi: 'खुश ग्राहक' },
          { icon: 'Clock', value: '6AM - 10PM', label: 'Open Hours', labelHi: 'खुलने का समय' },
          { icon: 'Award', value: 'Premium', label: 'Near Toran Gate', labelHi: 'तोरण गेट पर' }
        ],
        coreValues: [
          {
            icon: 'ShieldCheck',
            title: 'Uncompromised Purity',
            titleHi: 'शुद्धता की गारंटी',
            description: 'We use premium Assam tea leaves, fresh thick milk, and pure spices. We never use artificial flavors or colors.'
          },
          {
            icon: 'Star',
            title: 'Consistency of Taste',
            titleHi: 'स्वाद में निरंतरता',
            description: 'Every cup is prepared with exact measurements of spices, ginger, and cardamom, ensuring the same rich taste every single day.'
          },
          {
            icon: 'Heart',
            title: 'Service with Devotion',
            titleHi: 'सेवा भाव',
            description: 'As we serve devotees visiting Khatu Shyam Ji, we treat our service as an offering to Shyam Baba, welcoming everyone with warmth.'
          }
        ]
      };
    }
  }
  return null;
}

/**
 * Custom hook to listen to a Firestore collection in real-time.
 * Falls back to LocalStorage in Mock Mode or static defaults if offline/uninitialized.
 */
export function useRealTimeCollection<T>(
  collectionName: string, 
  orderByField?: string,
  defaultValue: T[] = []
) {
  const [data, setData] = useState<T[]>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockKey = `sawariya_${collectionName}`;

    if (isMockEnabled) {
      const loadMockData = () => {
        const local = localStorage.getItem(mockKey);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) {
              setData(parsed.map(x => sanitizeImagePaths(x)));
            } else {
              setData(defaultValue);
            }
          } catch (e) {
            console.error('Error parsing mock collection:', mockKey, e);
          }
        } else {
          setData(defaultValue);
        }
        setLoading(false);
      };

      loadMockData();

      // Listen for custom trigger update events
      const handleMockUpdate = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.key === mockKey) {
          loadMockData();
        }
      };

      window.addEventListener('sawariya_db_update', handleMockUpdate);
      return () => {
        window.removeEventListener('sawariya_db_update', handleMockUpdate);
      };
    }

    if (!db) {
      console.warn(`Firestore not initialized. Loading local fallback for collection: ${collectionName}`);
      const fallback = getLocalFallbackForCollection(collectionName);
      setData(fallback.map(x => sanitizeImagePaths(x)));
      setLoading(false);
      return;
    }

    const colRef = collection(db, collectionName);
    const q = orderByField ? query(colRef, orderBy(orderByField, 'desc')) : query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(sanitizeImagePaths({ id: doc.id, ...doc.data() }));
      });
      setData(list);
      setLoading(false);
    }, (error) => {
      console.error(`Error in onSnapshot for collection ${collectionName}, loading local fallback:`, error);
      const fallback = getLocalFallbackForCollection(collectionName);
      setData(fallback.map(x => sanitizeImagePaths(x)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, orderByField]);

  return { data, loading, setData };
}

/**
 * Custom hook to listen to a single Firestore document in real-time.
 * Falls back to LocalStorage or static defaults if offline/uninitialized.
 */
export function useRealTimeDocument<T>(
  collectionName: string, 
  documentId: string, 
  defaultValue: T
) {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockKey = `sawariya_config_${documentId}`;

    if (isMockEnabled) {
      const loadMockData = () => {
        const local = localStorage.getItem(mockKey);
        if (local) {
          try {
            setData(sanitizeImagePaths(JSON.parse(local)));
          } catch (e) {
            console.error('Error parsing mock document:', mockKey, e);
          }
        } else {
          setData(defaultValue);
        }
        setLoading(false);
      };

      loadMockData();

      // Listen for custom trigger update events
      const handleMockUpdate = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.key === mockKey) {
          loadMockData();
        }
      };

      window.addEventListener('sawariya_db_update', handleMockUpdate);
      return () => {
        window.removeEventListener('sawariya_db_update', handleMockUpdate);
      };
    }

    if (!db) {
      console.warn(`Firestore not initialized. Loading local fallback for document: ${collectionName}/${documentId}`);
      const fallback = getLocalFallbackForDocument(collectionName, documentId) || defaultValue;
      setData(sanitizeImagePaths(fallback));
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, documentId);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(sanitizeImagePaths(snapshot.data()) as T);
      } else {
        const fallback = getLocalFallbackForDocument(collectionName, documentId) || defaultValue;
        setData(sanitizeImagePaths(fallback));
      }
      setLoading(false);
    }, (error) => {
      console.error(`Error in onSnapshot for document ${collectionName}/${documentId}, loading local fallback:`, error);
      const fallback = getLocalFallbackForDocument(collectionName, documentId) || defaultValue;
      setData(sanitizeImagePaths(fallback));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, documentId]);

  return { data, loading, setData };
}

/**
 * Trigger helper to notify local listeners that database has updated.
 * Used strictly in Mock Mode.
 */
export function triggerMockUpdate(key: string) {
  window.dispatchEvent(new CustomEvent('sawariya_db_update', { detail: { key } }));
}
