// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0v8Pue_3CoZ_HAuhqRA6jHFPDHDOuP2Q",
  authDomain: "fir-27651.firebaseapp.com",
  projectId: "fir-27651",
  storageBucket: "fir-27651.appspot.com",
  messagingSenderId: "1039301003747",
  appId: "1:1039301003747:web:4e1db8f523ae22f46db8d6",
  measurementId: "G-WG1CB142VK"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export {storage}