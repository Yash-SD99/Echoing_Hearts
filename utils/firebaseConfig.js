// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOiHFUmb1vPUoc9ftIhrduvT9i6AWHync",
  authDomain: "echoing--hearts.firebaseapp.com",
  projectId: "echoing--hearts",
  storageBucket: "echoing--hearts.firebasestorage.app",
  messagingSenderId: "379293483534",
  appId: "1:379293483534:web:09be855f989d2953e6725f",
  measurementId: "G-XMC4CKM2XQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);
export { app, auth, db, firebaseConfig };