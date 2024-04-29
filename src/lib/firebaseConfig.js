// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

export const firebaseConfig = {
    apiKey: "",
    authDomain: "mycarbonrecord.firebaseapp.com",
    projectId: "mycarbonrecord",
    storageBucket: "mycarbonrecord.appspot.com",
    messagingSenderId: "23721669447",
    appId: "1:23721669447:web:36584dd366f3654f3d5262"
};


// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592


// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);





