import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_APIKEY,
  projectId: process.env.NEXT_PUBLIC_APIKEY,
  storageBucket: process.env.NEXT_PUBLIC_APIKEY,
  messagingSenderId: process.env.NEXT_PUBLIC_APIKEY,
  appId: process.env.NEXT_PUBLIC_APIKEY,
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };
