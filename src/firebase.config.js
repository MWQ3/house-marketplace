// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDsspCCOup9RS5lPKUbkstWSiVwQmvZlc",
  authDomain: "house-marketplace-app-fd97a.firebaseapp.com",
  projectId: "house-marketplace-app-fd97a",
  storageBucket: "house-marketplace-app-fd97a.appspot.com",
  messagingSenderId: "287147234467",
  appId: "1:287147234467:web:4e5b877ce22d818e04db16"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()