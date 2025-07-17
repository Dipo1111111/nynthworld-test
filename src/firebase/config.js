// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgxR6Wwdy08tWzmlTbchCbfowsa7PEcP4",
  authDomain: "nynth-world-test.firebaseapp.com",
  projectId: "nynth-world-test",
  storageBucket: "nynth-world-test.firebasestorage.app",
  messagingSenderId: "527436476919",
  appId: "1:527436476919:web:b206c35258530e9aabfef2",
  measurementId: "G-7RJ2VDLHJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (database)
export const db = getFirestore(app);