import { useState, useEffect } from 'react';
import { collection, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, isMockEnabled } from '../services/firebase';

/**
 * Maps database/placeholder image URLs dynamically to valid local files.
 * This guarantees that even if the database has broken paths, the UI shows real images.
 */
export function sanitizeImagePaths(item: any): any {
  if (!item) return item;

  const fixPath = (src: string): string => {
    if (!src || typeof src !== 'string') return src;

    // 1. Fix menu items with missing /images/ai-generated/ folder
    if (src.includes('/images/ai-generated/')) {
      const name = (item.name || '').toLowerCase();
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

  // Clean values on the object
  if (item.image) {
    item.image = fixPath(item.image);
  }
  if (item.src) {
    item.src = fixPath(item.src);
  }
  if (item.bgImage) {
    item.bgImage = fixPath(item.bgImage);
  }
  if (item.ownerImage) {
    item.ownerImage = fixPath(item.ownerImage);
  }

  return item;
}

/**
 * Custom hook to listen to a Firestore collection in real-time.
 * Falls back to LocalStorage in Mock Mode, listening for custom DB update events.
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
      console.error(`Error in onSnapshot for collection ${collectionName}:`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, orderByField]);

  return { data, loading };
}

/**
 * Custom hook to listen to a single Firestore document in real-time.
 * Falls back to LocalStorage in Mock Mode, listening for custom DB update events.
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
      setLoading(false);
      return;
    }

    const docRef = doc(db, collectionName, documentId);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(sanitizeImagePaths(snapshot.data()) as T);
      } else {
        setData(defaultValue);
      }
      setLoading(false);
    }, (error) => {
      console.error(`Error in onSnapshot for document ${collectionName}/${documentId}:`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, documentId]);

  return { data, loading };
}

/**
 * Trigger helper to notify local listeners that database has updated.
 * Used strictly in Mock Mode.
 */
export function triggerMockUpdate(key: string) {
  window.dispatchEvent(new CustomEvent('sawariya_db_update', { detail: { key } }));
}
