// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjG2vuMDwxFB7gNHnId0e2HZo6bL1Ar2s",
  authDomain: "webandmobilproject.firebaseapp.com",
  projectId: "webandmobilproject",
  storageBucket: "webandmobilproject.appspot.com",
  messagingSenderId: "958510699765",
  appId: "1:958510699765:android:3ca76a3564d7a305fae1bc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
