// Import the functions you need from the SDKs you need
<<<<<<< HEAD
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
=======
import {initializeApp} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getDatabase, ref, set, get, push} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
>>>>>>> c19c99047d5e98d4cfbefc819941ac51ac967e33

// Initialize Firebase
const app = initializeApp(firebaseConfig);

<<<<<<< HEAD
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
=======
// Initialize Firebase Authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
>>>>>>> c19c99047d5e98d4cfbefc819941ac51ac967e33

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

<<<<<<< HEAD
export { auth, db };
=======
// Initialize Realtime Database
const database = getDatabase(app);

// Add a car to the database
const addCar = async carData => {
  try {
    // Generate a new car reference with auto-id
    const carsRef = ref(database, 'cars');
    const newCarRef = push(carsRef);

    // Add timestamp and ID to the car data
    const timestamp = new Date().toISOString();
    const enhancedCarData = {
      ...carData,
      id: newCarRef.key,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Set the data
    await set(newCarRef, enhancedCarData);
    console.log('Araç başarıyla eklendi, ID:', newCarRef.key);
    return newCarRef.key;
  } catch (error) {
    console.error('Araç eklenirken hata oluştu:', error);
    throw error;
  }
};

// Get a car by ID
const getCarById = async carId => {
  try {
    const carRef = ref(database, `cars/${carId}`);
    const snapshot = await get(carRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('Bu ID ile araç bulunamadı:', carId);
      return null;
    }
  } catch (error) {
    console.error('Araç bilgisi alınırken hata oluştu:', error);
    throw error;
  }
};

// Get all cars
const getAllCars = async () => {
  try {
    const carsRef = ref(database, 'cars');
    const snapshot = await get(carsRef);

    if (snapshot.exists()) {
      const carsData = snapshot.val();
      return Object.keys(carsData).map(key => ({
        ...carsData[key],
        id: key,
      }));
    } else {
      console.log('Hiç araç bulunamadı');
      return [];
    }
  } catch (error) {
    console.error('Araçlar alınırken hata oluştu:', error);
    throw error;
  }
};

export {auth, db, database, addCar, getCarById, getAllCars};
>>>>>>> c19c99047d5e98d4cfbefc819941ac51ac967e33
