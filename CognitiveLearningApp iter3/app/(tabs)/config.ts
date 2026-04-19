import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRQONoNniBNWQ8Js1i-hVe9TAz62yqPzc",
  authDomain: "squares-f9b8a.firebaseapp.com",
  projectId: "squares-f9b8a",
  storageBucket: "squares-f9b8a.firebasestorage.app",
  messagingSenderId: "185241002523",
  appId: "1:185241002523:web:95a89a7dc3c2509c644ebe",
  measurementId: "G-V2L0REVJYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { app, auth, db };

