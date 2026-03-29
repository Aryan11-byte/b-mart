// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 PASTE YOUR CONFIG HERE

const firebaseConfig = {
  apiKey: "AIzaSyC0GJdupZV9b6N4bURmxu8erm5X8_7qlTw",
  authDomain: "b-mart-c1785.firebaseapp.com",
  projectId: "b-mart-c1785",
  storageBucket: "b-mart-c1785.firebasestorage.app",
  messagingSenderId: "201443603534",
  appId: "1:201443603534:web:25f27ed4acc09506597f1f",
  measurementId: "G-WKQ8FPB9ZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export
export { db, collection, addDoc };
