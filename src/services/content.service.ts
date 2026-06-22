import {
  collection,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isMockEnabled } from './firebase';
import { triggerMockUpdate, sanitizeImagePaths } from '../hooks/useRealTime';

import defaultMenu from '../data/menu.json';
import defaultGallery from '../data/gallery.json';
import defaultBusiness from '../data/business.json';
import defaultOffers from '../data/offers.json';

// --- MENU TYPES ---
export interface MenuItem {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  category: string;
  image: string;
  popular: boolean;
  new: boolean;
  price?: number; // merged on read
  createdAt?: any;
}

export interface PriceDoc {
  id: string; // matches menuItem.id
  price: number;
}

// --- GALLERY TYPES ---
export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  captionHi: string;
  category: string;
  createdAt?: any;
}

// --- OFFERS TYPES ---
export interface OfferItem {
  id: string;
  type: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  discount: string;
  validity: string;
  badge: string;
  active: boolean;
  createdAt?: any;
}

// --- CONFIG TYPES ---
export interface HeroConfig {
  blessing: string;
  shopName: string;
  shopNameHi: string;
  subtitle: string;
  subtitleHi: string;
  bgImage: string;
}

export interface ContactConfig {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  addressHi: string;
  workingHours: {
    daily: string;
    dailyHi: string;
    festivals: string;
    festivalsHi: string;
    ekadashi: string;
    ekadashiHi: string;
  };
}

export interface AboutConfig {
  story: string;
  storyHi: string;
  ownerName: string;
  ownerNameHi: string;
  ownerTitle: string;
  ownerImage: string;
  stats: Array<{ icon: string; value: string; label: string; labelHi: string }>;
  coreValues: Array<{ icon: string; title: string; titleHi: string; description: string }>;
}

// --- MOCK STORAGE KEYS ---
const KEYS = {
  MENU_ITEMS: 'sawariya_menu_items',
  PRICES: 'sawariya_prices',
  GALLERY: 'sawariya_gallery',
  OFFERS: 'sawariya_offers',
  HERO: 'sawariya_config_hero',
  CONTACT: 'sawariya_config_contact',
  ABOUT: 'sawariya_config_about'
};

// --- HELPER TO CONVERT FILE TO BASE64 FOR MOCK STORAGE ---
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// --- GET MOCK DATA ---
const getMockData = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const saveMockData = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
  triggerMockUpdate(key);
};

export const contentService = {
  // ==========================================
  // MENU & PRICES OPERATIONS
  // ==========================================
  async getMenu(): Promise<MenuItem[]> {
    if (isMockEnabled) {
      const items = getMockData<MenuItem[]>(KEYS.MENU_ITEMS, defaultMenu.map((m, idx) => {
        const { price, ...rest } = m;
        return { ...rest, id: `menu_${idx}` };
      }));
      const prices = getMockData<PriceDoc[]>(KEYS.PRICES, defaultMenu.map((m, idx) => ({
        id: `menu_${idx}`,
        price: m.price
      })));

      return items.map(item => {
        const priceObj = prices.find(p => p.id === item.id);
        return { ...item, price: priceObj ? priceObj.price : 0 };
      });
    }

    try {
      // Fetch menu items
      const snapshot = await getDocs(collection(db, 'menu_items'));
      const items: MenuItem[] = [];
      snapshot.forEach(doc => {
        items.push({ ...doc.data(), id: doc.id } as MenuItem);
      });

      // Fetch prices
      const pricesSnapshot = await getDocs(collection(db, 'prices'));
      const prices: PriceDoc[] = [];
      pricesSnapshot.forEach(doc => {
        prices.push({ ...doc.data(), id: doc.id } as PriceDoc);
      });

      // If empty, seed
      if (items.length === 0) {
        console.log('Firestore menu_items empty, seeding defaults...');
        for (const defaultItem of defaultMenu) {
          const { price, ...rest } = defaultItem;
          const docRef = await addDoc(collection(db, 'menu_items'), {
            ...rest,
            createdAt: Timestamp.now()
          });
          // Save price separately in prices collection with matching ID
          await setDoc(doc(db, 'prices', docRef.id), {
            price: Number(price)
          });
        }
        return this.getMenu();
      }

      return items.map(item => {
        const priceObj = prices.find(p => p.id === item.id);
        return sanitizeImagePaths({ ...item, price: priceObj ? priceObj.price : 0 });
      });

    } catch (e) {
      console.error('Firestore getMenu failed, falling back to local fallback:', e);
      // Clean fallback using the defaultMenu to prevent stack overflow recursion
      const items = defaultMenu.map((m, idx) => {
        const { price, ...rest } = m;
        return { ...rest, id: `menu_${idx}`, price };
      });
      return items;
    }
  },

  async saveMenuItem(item: Omit<MenuItem, 'id' | 'price'> & { id?: string; price?: number }, imageFile?: File): Promise<MenuItem> {
    let imageUrl = item.image;

    if (imageFile && !isMockEnabled && storage) {
      try {
        const fileRef = ref(storage, `menu_items/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(fileRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.error('Error uploading menu image:', err);
        throw new Error(`Image upload failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else if (imageFile && isMockEnabled) {
      try {
        imageUrl = await fileToBase64(imageFile);
      } catch (err) {
        throw new Error(`File conversion failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const itemData = {
      name: item.name,
      nameHi: item.nameHi,
      description: item.description,
      category: item.category,
      image: imageUrl,
      popular: !!item.popular,
      new: !!item.new,
      updatedAt: isMockEnabled ? new Date().toISOString() : Timestamp.now()
    };

    const targetPrice = item.price;

    if (isMockEnabled) {
      const items = getMockData<MenuItem[]>(KEYS.MENU_ITEMS, []);
      const prices = getMockData<PriceDoc[]>(KEYS.PRICES, []);
      let activeId = item.id || `menu_${Date.now()}`;
      let finalPrice = targetPrice !== undefined ? Number(targetPrice) : 0;

      if (item.id) {
        // Edit Existing
        const index = items.findIndex(m => m.id === item.id);
        if (index > -1) {
          items[index] = { ...items[index], ...itemData } as MenuItem;
        }
        if (targetPrice !== undefined) {
          const priceIdx = prices.findIndex(p => p.id === item.id);
          if (priceIdx > -1) {
            prices[priceIdx] = { id: item.id, price: finalPrice };
          } else {
            prices.push({ id: item.id, price: finalPrice });
          }
        } else {
          const existingPrice = prices.find(p => p.id === item.id);
          finalPrice = existingPrice ? existingPrice.price : 0;
        }
      } else {
        // Add New
        const newItem = { id: activeId, ...itemData, createdAt: new Date().toISOString() } as MenuItem;
        items.push(newItem);
        prices.push({ id: activeId, price: finalPrice });
      }

      saveMockData(KEYS.MENU_ITEMS, items);
      saveMockData(KEYS.PRICES, prices);
      return { id: activeId, ...itemData, price: finalPrice } as MenuItem;
    }

    try {
      if (item.id) {
        // Edit
        const docRef = doc(db, 'menu_items', item.id);
        await updateDoc(docRef, itemData);

        let finalPrice = 0;
        if (targetPrice !== undefined) {
          finalPrice = Number(targetPrice);
          await setDoc(doc(db, 'prices', item.id), { price: finalPrice }, { merge: true });
        } else {
          // Fetch existing price to return correct merged MenuItem
          const priceDocRef = doc(db, 'prices', item.id);
          const priceSnap = await getDoc(priceDocRef);
          if (priceSnap.exists()) {
            finalPrice = priceSnap.data()?.price || 0;
          }
        }
        return { id: item.id, ...itemData, price: finalPrice } as MenuItem;
      } else {
        // Add
        const finalPrice = targetPrice !== undefined ? Number(targetPrice) : 0;
        const fullNewDoc = { ...itemData, createdAt: Timestamp.now() };
        const docRef = await addDoc(collection(db, 'menu_items'), fullNewDoc);

        // Write Price
        await setDoc(doc(db, 'prices', docRef.id), { price: finalPrice });
        return { id: docRef.id, ...fullNewDoc, price: finalPrice } as MenuItem;
      }
    } catch (err) {
      console.error('Firestore saveMenuItem failed:', err);
      throw err;
    }
  },

  async updateItemPrice(itemId: string, newPrice: number): Promise<void> {
    if (isMockEnabled) {
      const prices = getMockData<PriceDoc[]>(KEYS.PRICES, []);
      const index = prices.findIndex(p => p.id === itemId);
      if (index > -1) {
        prices[index].price = Number(newPrice);
      } else {
        prices.push({ id: itemId, price: Number(newPrice) });
      }
      saveMockData(KEYS.PRICES, prices);
      return;
    }

    try {
      const priceDocRef = doc(db, 'prices', itemId);
      await setDoc(priceDocRef, { price: Number(newPrice) }, { merge: true });
    } catch (err) {
      console.error('Firestore updateItemPrice failed:', err);
      throw err;
    }
  },

  async deleteMenuItem(id: string): Promise<void> {
    if (isMockEnabled) {
      const items = getMockData<MenuItem[]>(KEYS.MENU_ITEMS, []);
      const prices = getMockData<PriceDoc[]>(KEYS.PRICES, []);

      saveMockData(KEYS.MENU_ITEMS, items.filter(m => m.id !== id));
      saveMockData(KEYS.PRICES, prices.filter(p => p.id !== id));
      return;
    }

    try {
      await deleteDoc(doc(db, 'menu_items', id));
      await deleteDoc(doc(db, 'prices', id));
    } catch (err) {
      console.error('Firestore deleteMenuItem failed:', err);
      throw err;
    }
  },

  // ==========================================
  // GALLERY OPERATIONS
  // ==========================================
  async getGallery(): Promise<GalleryItem[]> {
    if (isMockEnabled) {
      return getMockData<GalleryItem[]>(KEYS.GALLERY, defaultGallery.map((g, idx) => ({ ...g, id: `gallery_${idx}` })));
    }

    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items: GalleryItem[] = [];
      snapshot.forEach(doc => {
        items.push({ ...doc.data(), id: doc.id } as GalleryItem);
      });

      if (items.length === 0) {
        console.log('Seeding gallery defaults...');
        for (const defaultImg of defaultGallery) {
          await addDoc(collection(db, 'gallery'), {
            ...defaultImg,
            createdAt: Timestamp.now()
          });
        }
        return this.getGallery();
      }

      // Auto-sync missing gallery defaults (for migrating existing databases)
      const existingSrcs = new Set(items.map(item => item.src));
      let addedAny = false;
      for (const defaultImg of defaultGallery) {
        if (!existingSrcs.has(defaultImg.src)) {
          await addDoc(collection(db, 'gallery'), {
            ...defaultImg,
            createdAt: Timestamp.now()
          });
          addedAny = true;
        }
      }
      if (addedAny) {
        const updatedSnapshot = await getDocs(q);
        const updatedItems: GalleryItem[] = [];
        updatedSnapshot.forEach(doc => {
          updatedItems.push({ ...doc.data(), id: doc.id } as GalleryItem);
        });
        return updatedItems;
      }

      return items.map(item => sanitizeImagePaths(item));
    } catch (e) {
      console.error('Firestore getGallery failed, falling back:', e);
      return getMockData<GalleryItem[]>(KEYS.GALLERY, defaultGallery.map((g, idx) => ({ ...g, id: `gallery_${idx}` })));
    }
  },

  async addGalleryItem(item: Omit<GalleryItem, 'id' | 'src'>, imageFile: File): Promise<GalleryItem> {
    let imageUrl = '';

    if (!isMockEnabled && storage) {
      try {
        const fileRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(fileRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.error('Error uploading gallery image:', err);
        throw new Error(`Image upload failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      try {
        imageUrl = await fileToBase64(imageFile);
      } catch (err) {
        throw new Error(`File conversion failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const newItemData = {
      ...item,
      src: imageUrl,
      createdAt: isMockEnabled ? new Date().toISOString() : Timestamp.now()
    };

    if (isMockEnabled) {
      const gallery = await this.getGallery();
      const created: GalleryItem = { id: `gallery_${Date.now()}`, ...newItemData };
      gallery.unshift(created);
      saveMockData(KEYS.GALLERY, gallery);
      return created;
    }

    try {
      const docRef = await addDoc(collection(db, 'gallery'), newItemData);
      return { id: docRef.id, ...newItemData } as GalleryItem;
    } catch (err) {
      console.error('Firestore addGalleryItem failed:', err);
      throw err;
    }
  },

  async deleteGalleryItem(id: string): Promise<void> {
    if (isMockEnabled) {
      const gallery = await this.getGallery();
      const filtered = gallery.filter(g => g.id !== id);
      saveMockData(KEYS.GALLERY, filtered);
      return;
    }

    try {
      const docRef = doc(db, 'gallery', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Firestore deleteGalleryItem failed:', err);
      throw err;
    }
  },

  // ==========================================
  // OFFERS OPERATIONS
  // ==========================================
  async getOffers(): Promise<OfferItem[]> {
    if (isMockEnabled) {
      return getMockData<OfferItem[]>(KEYS.OFFERS, defaultOffers.map((o, idx) => ({
        ...o,
        id: o.id || `offer_${idx}`,
        active: true
      })));
    }

    try {
      const snapshot = await getDocs(collection(db, 'offers'));
      const items: OfferItem[] = [];
      snapshot.forEach(doc => {
        items.push({ ...doc.data(), id: doc.id } as OfferItem);
      });

      if (items.length === 0) {
        console.log('Seeding offers defaults...');
        for (const defaultOffer of defaultOffers) {
          const { id, ...rest } = defaultOffer;
          await addDoc(collection(db, 'offers'), {
            ...rest,
            active: true,
            createdAt: Timestamp.now()
          });
        }
        return this.getOffers();
      }
      return items;
    } catch (e) {
      console.error('Firestore getOffers failed:', e);
      return getMockData<OfferItem[]>(KEYS.OFFERS, defaultOffers.map((o, idx) => ({
        ...o,
        id: o.id || `offer_${idx}`,
        active: true
      })));
    }
  },

  async saveOffer(offer: Omit<OfferItem, 'id'> & { id?: string }): Promise<OfferItem> {
    const payload = {
      type: offer.type,
      title: offer.title,
      titleHi: offer.titleHi,
      description: offer.description,
      descriptionHi: offer.descriptionHi,
      discount: offer.discount,
      validity: offer.validity,
      badge: offer.badge,
      active: !!offer.active,
      updatedAt: isMockEnabled ? new Date().toISOString() : Timestamp.now()
    };

    if (isMockEnabled) {
      const list = await this.getOffers();
      let activeId = offer.id || `offer_${Date.now()}`;

      if (offer.id) {
        const index = list.findIndex(o => o.id === offer.id);
        if (index > -1) {
          list[index] = { ...list[index], ...payload } as OfferItem;
        }
      } else {
        const newItem = { id: activeId, ...payload, createdAt: new Date().toISOString() } as OfferItem;
        list.push(newItem);
      }

      saveMockData(KEYS.OFFERS, list);
      return { id: activeId, ...payload } as OfferItem;
    }

    try {
      if (offer.id) {
        const docRef = doc(db, 'offers', offer.id);
        await updateDoc(docRef, payload);
        return { id: offer.id, ...payload } as OfferItem;
      } else {
        const fullDoc = { ...payload, createdAt: Timestamp.now() };
        const docRef = await addDoc(collection(db, 'offers'), fullDoc);
        return { id: docRef.id, ...fullDoc } as OfferItem;
      }
    } catch (err) {
      console.error('Firestore saveOffer failed:', err);
      throw err;
    }
  },

  async deleteOffer(id: string): Promise<void> {
    if (isMockEnabled) {
      const list = await this.getOffers();
      saveMockData(KEYS.OFFERS, list.filter(o => o.id !== id));
      return;
    }

    try {
      await deleteDoc(doc(db, 'offers', id));
    } catch (err) {
      console.error('Firestore deleteOffer failed:', err);
      throw err;
    }
  },

  // ==========================================
  // CONFIG / HERO / CONTACT / ABOUT SETTINGS
  // ==========================================
  async getHeroConfig(): Promise<HeroConfig> {
    const defaultHero: HeroConfig = {
      blessing: defaultBusiness.blessing,
      shopName: defaultBusiness.shopName,
      shopNameHi: defaultBusiness.shopNameHi,
      subtitle: 'Serving the finest spiced tea and warm snacks to devotees at Khatu Shyam Ji',
      subtitleHi: 'खाटू श्याम जी आओ, साँवरिया की स्पेशल चाय का मज़ा लो',
      bgImage: '/sawariya-photos/cb5dc902-122f-49a9-a4f6-d03afe90cb10.png'
    };

    if (isMockEnabled) {
      return getMockData<HeroConfig>(KEYS.HERO, defaultHero);
    }

    try {
      const docRef = doc(db, 'site_content', 'hero');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as HeroConfig;
        return sanitizeImagePaths(data);
      } else {
        try {
          await setDoc(docRef, defaultHero);
        } catch (e) {
          console.warn('Guest user cannot seed default hero config in Firestore (this is expected):', e);
        }
        return defaultHero;
      }
    } catch (e) {
      console.error('Firestore getHeroConfig failed, falling back:', e);
      return getMockData<HeroConfig>(KEYS.HERO, defaultHero);
    }
  },

  async saveHeroConfig(config: HeroConfig, bgImageFile?: File): Promise<HeroConfig> {
    let bgImageUrl = config.bgImage;

    if (bgImageFile && !isMockEnabled && storage) {
      try {
        const fileRef = ref(storage, `site_content/hero_bg_${Date.now()}`);
        const snapshot = await uploadBytes(fileRef, bgImageFile);
        bgImageUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.error('Error uploading hero background:', err);
        throw new Error(`Background upload failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else if (bgImageFile && isMockEnabled) {
      try {
        bgImageUrl = await fileToBase64(bgImageFile);
      } catch (err) {
        throw new Error(`File conversion failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const updated = { ...config, bgImage: bgImageUrl };

    if (isMockEnabled) {
      saveMockData(KEYS.HERO, updated);
      return updated;
    }

    const docRef = doc(db, 'site_content', 'hero');
    try {
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.error('Firestore saveHeroConfig failed:', err);
      throw err;
    }
    return updated;
  },

  async getContactConfig(): Promise<ContactConfig> {
    const defaultContact: ContactConfig = {
      phone: defaultBusiness.phone,
      whatsapp: defaultBusiness.whatsapp,
      email: defaultBusiness.email,
      address: defaultBusiness.address,
      addressHi: defaultBusiness.addressHi,
      workingHours: {
        daily: defaultBusiness.workingHours.daily,
        dailyHi: defaultBusiness.workingHours.dailyHi,
        festivals: defaultBusiness.workingHours.festivals,
        festivalsHi: defaultBusiness.workingHours.festivalsHi,
        ekadashi: defaultBusiness.workingHours.ekadashi,
        ekadashiHi: defaultBusiness.workingHours.ekadashiHi
      }
    };

    if (isMockEnabled) {
      return getMockData<ContactConfig>(KEYS.CONTACT, defaultContact);
    }

    try {
      const docRef = doc(db, 'site_content', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as ContactConfig;
      } else {
        await setDoc(docRef, defaultContact);
        return defaultContact;
      }
    } catch (e) {
      console.error('Firestore getContactConfig failed, falling back:', e);
      return getMockData<ContactConfig>(KEYS.CONTACT, defaultContact);
    }
  },

  async saveContactConfig(config: ContactConfig): Promise<ContactConfig> {
    if (isMockEnabled) {
      saveMockData(KEYS.CONTACT, config);
      return config;
    }

    try {
      const docRef = doc(db, 'site_content', 'contact');
      await setDoc(docRef, config, { merge: true });
      return config;
    } catch (err) {
      console.error('Firestore saveContactConfig failed:', err);
      throw err;
    }
  },

  async getAboutConfig(): Promise<AboutConfig> {
    const defaultAbout: AboutConfig = {
      story: 'Welcome to Sawariya Tea Stall, located at the heart of the holy town of Khatu Shyam Ji, right near the iconic Toran Gate. We have been serving the most refreshing and flavorful spiced tea to thousands of devotees and visitors who come to seek blessings at the revered Khatu Shyam Ji Temple.\n\nRun by Mukesh Kumar, our tea stall is more than just a place for chai — it\'s a warm sanctuary where pilgrims rest after long journeys, seek refreshments, and leave feeling revitalized. Every single cup is brewed with pure dedication, using fresh premium Assam leaves, fresh milk, and hand-ground ginger, cardamom, and secret spices.',
      storyHi: 'साँवरिया टी स्टॉल में स्वागत है। हम खाटू श्याम जी के तोरण गेट के पास स्थित हैं। बाबा श्याम के दर्शन के बाद हमारी कुल्हड़ चाय का स्वाद आपके सफर को हमेशा के लिए यादगार बना देगा। मनोज जी द्वारा संचालित यह दुकान केवल चाय की दुकान नहीं, बल्कि भक्तों की थकान मिटाने और आराम करने की जगह है। 🙏',
      ownerName: defaultBusiness.ownerName,
      ownerNameHi: defaultBusiness.ownerNameHi,
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

    if (isMockEnabled) {
      return getMockData<AboutConfig>(KEYS.ABOUT, defaultAbout);
    }

    try {
      const docRef = doc(db, 'site_content', 'about');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as AboutConfig;
        return sanitizeImagePaths(data);
      } else {
        try {
          await setDoc(docRef, defaultAbout);
        } catch (e) {
          console.warn('Guest user cannot seed default about config in Firestore (this is expected):', e);
        }
        return defaultAbout;
      }
    } catch (e) {
      console.error('Firestore getAboutConfig failed, falling back:', e);
      return getMockData<AboutConfig>(KEYS.ABOUT, defaultAbout);
    }
  },

  async saveAboutConfig(config: AboutConfig, ownerImageFile?: File): Promise<AboutConfig> {
    let ownerImageUrl = config.ownerImage;

    if (ownerImageFile && !isMockEnabled && storage) {
      try {
        const fileRef = ref(storage, `site_content/owner_image_${Date.now()}`);
        const snapshot = await uploadBytes(fileRef, ownerImageFile);
        ownerImageUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.error('Error uploading owner image:', err);
        throw new Error(`Image upload failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else if (ownerImageFile && isMockEnabled) {
      try {
        ownerImageUrl = await fileToBase64(ownerImageFile);
      } catch (err) {
        throw new Error(`File conversion failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    const updated = { ...config, ownerImage: ownerImageUrl };

    if (isMockEnabled) {
      saveMockData(KEYS.ABOUT, updated);
      return updated;
    }

    try {
      const docRef = doc(db, 'site_content', 'about');
      await setDoc(docRef, updated, { merge: true });
      return updated;
    } catch (err) {
      console.error('Firestore saveAboutConfig failed:', err);
      throw err;
    }
  }
};
