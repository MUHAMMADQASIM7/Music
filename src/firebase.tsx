import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebase = {
    
    apiKey: "AIzaSyA71hn2K-Tnw04pcJomFKR1DIOVCClYudM",
    authDomain: "music-f1f92.firebaseapp.com",
    projectId: "music-f1f92",
    storageBucket: "music-f1f92.appspot.com",
    messagingSenderId: "518465661093",
    appId: "1:518465661093:web:6738a088c1d87451e9454c",
    measurementId: "G-9KR6DJG0K8"
      
};

// Initialize Firebase
export const app = initializeApp(firebase);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app)
export default firebase;