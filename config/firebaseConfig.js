// config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcwiF94fN46lYTCG-c4qsPxhtWJlRxi8Q",
  authDomain: "dine-time-table-eebea.firebaseapp.com",
  projectId: "dine-time-table-eebea",
  storageBucket: "dine-time-table-eebea.firebasestorage.app",
  messagingSenderId: "783176417580",
  appId: "1:783176417580:web:7364d1193a49d9daac6c89",
  measurementId: "G-F6RB3YZRVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
