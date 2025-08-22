import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyASWiLsScUONmrmlYMBPuVHeNJmXwpoPQs",
  authDomain: "cloneinstagram-94d38.firebaseapp.com",
  projectId: "cloneinstagram-94d38",
  storageBucket: "cloneinstagram-94d38.firebasestorage.app", 
  messagingSenderId: "542467892167",
  appId: "1:542467892167:web:ba168474f0a449215aefe2"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
if (typeof window !== "undefined") {
  (window as any).__auth = auth;
}
export const db = getFirestore(app);
export const storage = getStorage(app); 



// import { initializeApp } from 'firebase/app';

// const firebaseConfig = {
//   apiKey: "AIzaSyASWiLsScUONmrmlYMBPuVHeNJmXwpoPQs",
//   authDomain: "cloneinstagram-94d38.firebaseapp.com",
//   projectId: "cloneinstagram-94d38",
//   storageBucket: "cloneinstagram-94d38.firebasestorage.app",
//   messagingSenderId: "542467892167",
//   appId: "1:542467892167:web:ba168474f0a449215aefe2"

// };

// const app = initializeApp(firebaseConfig);

export default app;

