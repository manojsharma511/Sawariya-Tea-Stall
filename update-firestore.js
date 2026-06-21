import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection, updateDoc } from "firebase/firestore";
import fs from "fs";

// Setup config from .env
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Updating hero config...");
  const heroRef = doc(db, "site_content", "hero");
  await setDoc(heroRef, { bgImage: "/sawariya-photos/cb5dc902-122f-49a9-a4f6-d03afe90cb10.png" }, { merge: true });

  console.log("Updating about config...");
  const aboutRef = doc(db, "site_content", "about");
  await setDoc(aboutRef, { ownerImage: "/sawariya-photos/a251a44f-d0aa-4c88-894c-b0ccf80c16ad.png" }, { merge: true });

  console.log("Updating gallery images...");
  const galleryRef = collection(db, "gallery");
  const snap = await getDocs(galleryRef);
  
  for (const document of snap.docs) {
    const data = document.data();
    if (data.src.startsWith("/images/") || data.src.startsWith("/khatu-nagri/")) {
      // Replace with a valid sawariya photo if it's not
      await updateDoc(doc(db, "gallery", document.id), {
        src: "/sawariya-photos/7a08f74a-2f4b-45d3-bd9b-9581045aa7a1.png"
      });
    }
  }
  
  console.log("Done.");
  process.exit(0);
}

run().catch(console.error);
