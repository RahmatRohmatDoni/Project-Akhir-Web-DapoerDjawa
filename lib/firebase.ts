import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// --- FIREBASE CONFIGURATION ---
// Konfigurasi asli layanan Firebase milik Dapoer Djawa
const firebaseConfig = {
  apiKey: "AIzaSyD-Jot_RZQNJ0dQWNrGUvBCl090HOSJh3s",
  authDomain: "dapoer-djawa.firebaseapp.com",
  projectId: "dapoer-djawa",
  storageBucket: "dapoer-djawa.firebasestorage.app",
  messagingSenderId: "427524809379",
  appId: "1:427524809379:web:f80318b7f1022a74999516",
  measurementId: "G-X24L92YC9Y"
};

// --- INITIALIZATION ---
// Mencegah error inisialisasi ganda saat Next.js melakukan hot-reload (Fast Refresh)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- EXPORTS ---
// Menyiapkan fitur Autentikasi dan Google Provider untuk digunakan pada halaman login & pendaftaran
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();