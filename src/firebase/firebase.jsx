import { initializeApp } from "firebase/app";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendSignInLinkToEmail
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  or,
  limit,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  child,
  onValue,
  update
} from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDXEQhdNyJkZpliy0V4AJQoxYOh13KEgJg",
    authDomain: "fierfier.firebaseapp.com",
    databaseURL: "https://fierfier-default-rtdb.firebaseio.com",
    projectId: "fierfier",
    storageBucket: "fierfier.appspot.com",
    messagingSenderId: "876611807213",
    appId: "1:876611807213:web:f9e4dcb492e4af7202a9e4",
    measurementId: "G-1J2E50QYKR"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const dbR = getDatabase(app);

// Action Code Settings

const actionCodeSettings = {
    url: 'https://fierfier.firebaseapp.com/__/auth/action?mode=action&oobCode=code',
    handleCodeInApp: true,
  }


export { 


  auth,
  db,
  dbR,
  actionCodeSettings,

  // ((((((((((((((((((((((((((((( %%  Auth Functions %%)))))))))))))))))))))))))))))

  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendSignInLinkToEmail,

  // ((((((((((((((((((((((((((((( %% Firestore %%)))))))))))))))))))))))))))))

  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  or,
  limit,
  orderBy,
  onSnapshot,
  // ((((((((((((((((((((((((((((( %% Realtime Database %%)))))))))))))))))))))))))))))
  ref,
  set,
  push,
  get,
  child,
  onValue,
  update
  
};