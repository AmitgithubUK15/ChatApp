// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chatapp-477a0.firebaseapp.com",
  projectId: "chatapp-477a0",
  storageBucket: "chatapp-477a0.appspot.com",
  messagingSenderId: "302916171070",
  appId: "1:302916171070:web:db4309ca8c4e0ad797a86f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;