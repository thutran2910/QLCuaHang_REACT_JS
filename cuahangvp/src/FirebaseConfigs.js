// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";

// Cấu hình Firebase lấy từ Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCtLG08MwIgyjMM4_dgoJcXl4_LHWJjqe0",
    authDomain: "quanlydiemsinhvien-21d17.firebaseapp.com",
    projectId: "quanlydiemsinhvien-21d17",
    storageBucket: "quanlydiemsinhvien-21d17.appspot.com",
    messagingSenderId: "498978869428",
    appId: "1:498978869428:web:4390184badaa9e575847e1",
    measurementId: "G-ETYQED9L6H"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, onSnapshot };
