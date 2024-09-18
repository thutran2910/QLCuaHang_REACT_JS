import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtLG08MwIgyjMM4_dgoJcXl4_LHWJjqe0",
  authDomain: "quanlydiemsinhvien-21d17.firebaseapp.com",
  projectId: "quanlydiemsinhvien-21d17",
  storageBucket: "quanlydiemsinhvien-21d17.appspot.com",
  messagingSenderId: "498978869428",
  appId: "1:498978869428:web:4390184badaa9e575847e1",
  measurementId: "G-ETYQED9L6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics only if the window object is available
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, analytics, signInWithEmailAndPassword, signInWithPopup, db, Timestamp };