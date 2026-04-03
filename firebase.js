// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, doc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 YOUR CONFIG (PUT REAL VALUES)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
};

// ✅ INIT ONLY ONCE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// EXPORT
export { db, collection, addDoc, getDocs, doc, deleteDoc };
