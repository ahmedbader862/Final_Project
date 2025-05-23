import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  or,
  limit,
  orderBy,
  onSnapshot,
  arrayUnion // Added arrayUnion for Firestore operations
} from "firebase/firestore";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  child,
  onValue,
  update,
  serverTimestamp
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

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
const storage = getStorage(app);
const providerG = new GoogleAuthProvider();
const providerF = new FacebookAuthProvider();

// Action Code Settings
const actionCodeSettings = {
  url: 'https://fierfier.firebaseapp.com/__/auth/action?mode=action&oobCode=code',
  handleCodeInApp: true,
};

export {
  auth,
  db,
  dbR,
  storage,  // ✅ تمت إضافة التخزين السحابي (Firebase Storage)
  actionCodeSettings,
  providerG,
  providerF,
  GoogleAuthProvider, // Added for Signin component
  FacebookAuthProvider, // Added for consistency

  // ((((((((((((((((((((((((((((( %%  Auth Functions %%)))))))))))))))))))))))))))))))
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendSignInLinkToEmail,
  signInWithPopup,

  // ((((((((((((((((((((((((((((( %% Firestore %%)))))))))))))))))))))))))))))))
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  or,
  limit,
  orderBy,
  onSnapshot,
  arrayUnion, // Added arrayUnion for Firestore operations

  // ((((((((((((((((((((((((((((( %% Realtime Database %%)))))))))))))))))))))))))))))))
  ref,
  set,
  push,
  get,
  child,
  onValue,
  update,
  serverTimestamp,

  // ((((((((((((((((((((((((((((( %% Firebase Storage %%)))))))))))))))))))))))))))))))
  storageRef,  // لإنشاء مراجع التخزين
  uploadBytesResumable,  // لرفع الملفات بعملية تدريجية
  getDownloadURL  // لجلب رابط التحميل بعد رفع الصورة
};