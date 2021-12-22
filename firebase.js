// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChsphUAr79vo97Ht34DpwRVR3fw6fE5Is",
  authDomain: "twitter-clone-13e83.firebaseapp.com",
  projectId: "twitter-clone-13e83",
  storageBucket: "twitter-clone-13e83.appspot.com",
  messagingSenderId: "1024274728151",
  appId: "1:1024274728151:web:1d5385c5944c1465e81c92",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
