import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-uzXCZPQJbXx4mm3hZ5YDFYMLuHv7PrM",
  authDomain: "ucab-forms-db.firebaseapp.com",
  projectId: "ucab-forms-db",
  storageBucket: "ucab-forms-db.appspot.com",
  messagingSenderId: "322817264989",
  appId: "1:322817264989:web:b8c18d04bff02b0e4decb4",
  // measurementId: "G-8CGMPLSZWE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);

const db = initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED });
enableMultiTabIndexedDbPersistence(db);

export { auth, db, storage };
