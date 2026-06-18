import { useState, useEffect } from 'react';
import { collection, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, isMockEnabled } from '../services/firebase';

/**
 * Custom hook to listen to a Firestore collection in real-time.
 * Falls back to LocalStorage in Mock Mode, listening for custom DB update events.
 * 
 * @param collectionName Name of the firestore collection
 * @param orderByField Optional field name to order the collection
 * @param defaultValue Optional default list to return if empty
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
            setData(JSON.parse(local));
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
        list.push({ id: doc.id, ...doc.data() });
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
 * 
 * @param collectionName Name of the firestore collection
 * @param documentId Document ID
 * @param defaultValue Default value to return if document does not exist
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
            setData(JSON.parse(local));
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
        setData(snapshot.data() as T);
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
