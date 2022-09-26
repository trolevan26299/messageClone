import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChCWAbLD8z8CkMAOeKHIt6drU90gBM1fc",
  authDomain: "whatapp-clone-2-e6b94.firebaseapp.com",
  projectId: "whatapp-clone-2-e6b94",
  storageBucket: "whatapp-clone-2-e6b94.appspot.com",
  messagingSenderId: "911306185330",
  appId: "1:911306185330:web:7a7217e7ba803c084ec0eb",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };
