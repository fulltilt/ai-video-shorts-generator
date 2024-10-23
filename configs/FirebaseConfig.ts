// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-shorts-e4688.firebaseapp.com",
  projectId: "ai-shorts-e4688",
  storageBucket: "ai-shorts-e4688.appspot.com",
  messagingSenderId: "1096178135327",
  appId: "1:1096178135327:web:ca6b5c0953a2baf766002a",
  measurementId: "G-Q4NZHRB5WW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
