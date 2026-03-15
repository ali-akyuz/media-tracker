// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmKHMQIh-iGhjZgwBzDwxR0DbJc4b8rzU",
  authDomain: "deneme-d9358.firebaseapp.com",
  projectId: "deneme-d9358",
  storageBucket: "deneme-d9358.firebasestorage.app",
  messagingSenderId: "606284235405",
  appId: "1:606284235405:web:28b83f8ba9f9076a5958c4",
  measurementId: "G-KKQXXK5PJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
