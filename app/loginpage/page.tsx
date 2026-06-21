"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

// IMPORT FOOTER DARI FILE NAVBAR
import { Footer } from "../components/Navbar";

// --- CONSTANTS ---
// Ekstraksi class CSS untuk input agar konsisten, lebih rapi, dan mengurangi duplikasi kode
const INPUT_CLASS = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all";

export default function LoginPage() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  // State untuk form input login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State untuk loading pop-up Google Sign In
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // State terpusat untuk konfigurasi Modal pop-up (Sukses/Error)
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    isError: false,
    title: "",
    message: "",
    redirectOnClose: false,
  });

  // --- LOGIC FUNCTIONS ---

  // Handler untuk proses login manual dengan Email & Password
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi pencegahan jika ada kolom yang kosong
    if (!email || !password) {
      return setModalConfig({
        isOpen: true,
        isError: true,
        title: "Ups, Perhatian!",
        message: "Email dan Password wajib diisi untuk melakukan login.",
        redirectOnClose: false,
      });
    }

    // --- VALIDASI AKUN ADMIN ---
    if (email === "dapoerdjawa@gmail.com" && password === "admin123") {
      localStorage.setItem("dapoerdjawa_logged_in_user", JSON.stringify({ 
        email, 
        role: "admin", 
        name: "Owner",
        displayName: "Owner" 
      }));
      
      return setModalConfig({
        isOpen: true,
        isError: false,
        title: "Login Berhasil!",
        message: "Selamat datang kembali, Owner! Anda akan diarahkan ke halaman utama.",
        redirectOnClose: true,
      });
    }

    // --- VALIDASI AKUN REGULER ---
    // Ambil Data dari Local Storage (User Reguler)
    const savedUserData = localStorage.getItem("dapoerdjawa_registered_user");
    
    if (savedUserData) {
      const registeredUser = JSON.parse(savedUserData);
      
      // Jika email dan password cocok
      if (email === registeredUser.email && password === registeredUser.password) {
        localStorage.setItem("dapoerdjawa_logged_in_user", JSON.stringify({ 
          email: registeredUser.email, 
          role: "user", 
          name: registeredUser.name,
          displayName: registeredUser.name
        }));
        
        setModalConfig({
          isOpen: true,
          isError: false,
          title: "Login Berhasil!",
          message: `Selamat datang kembali, ${registeredUser.name}! Anda akan diarahkan ke halaman utama.`,
          redirectOnClose: true,
        });
      } else {
        // Jika password atau email salah
        setModalConfig({
          isOpen: true,
          isError: true,
          title: "Login Gagal",
          message: "Email atau Password yang Anda masukkan salah. Silakan coba lagi.",
          redirectOnClose: false,
        });
      }
    } else {
      // Jika akun tidak ditemukan sama sekali di LocalStorage
      setModalConfig({
        isOpen: true,
        isError: true,
        title: "Akun Tidak Ditemukan",
        message: "Email yang Anda masukkan belum terdaftar di sistem kami. Silakan Sign Up terlebih dahulu.",
        redirectOnClose: false,
      });
    }
  };

  // Handler untuk menutup Modal
  const closeModal = () => {
    if (modalConfig.redirectOnClose) {
      router.push("/mainpage");
    } else {
      setModalConfig({ ...modalConfig, isOpen: false });
    }
  };

  // --- INTEGRASI LOGIN GOOGLE FIREBASE ---
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    // Workaround: Menangkap event jika user menutup pop-up Google di luar jendela browser
    const handleWindowFocus = () => {
      setTimeout(() => {
        setIsGoogleLoading(false);
        window.removeEventListener('focus', handleWindowFocus);
      }, 500); 
    };
    
    window.addEventListener('focus', handleWindowFocus);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Hapus event listener jika berhasil masuk
      window.removeEventListener('focus', handleWindowFocus);

      const user = result.user;

      // Simpan sesi login dari Google ke LocalStorage
      localStorage.setItem(
        "dapoerdjawa_logged_in_user",
        JSON.stringify({
          email: user.email,
          role: "user",
          name: user.displayName,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      );

      router.push("/mainpage");
    } catch (error) {
      window.removeEventListener('focus', handleWindowFocus);
      
      const err = error as { code?: string; message?: string };

      // Pengecekan apabila user membatalkan persetujuan di pop-up Google secara eksplisit
      if (
        err.code === "auth/popup-closed-by-user" || 
        err.code === "auth/cancelled-popup-request" ||
        err.code === "auth/user-cancelled"
      ) {
        setIsGoogleLoading(false); 
        return; // Menghentikan loading secara transparan tanpa memunculkan error
      }

      console.error("Google Sign-In Error:", error);

      // Jika error selain dari pembatalan (misal: koneksi terputus)
      setModalConfig({
        isOpen: true,
        isError: true,
        title: "Login Gagal",
        message: "Terjadi kesalahan jaringan saat mencoba login dengan Google.",
        redirectOnClose: false,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="w-full bg-gray-50 text-gray-800 leading-normal text-base tracking-normal min-h-screen flex flex-col pt-24">
      <style>{`html { overflow-y: scroll; }`}</style>
      
      {/* --- MAIN CONTENT: FORM LOGIN --- */}
      <main className="w-full flex-1 flex items-center justify-center p-6 my-10">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
          
          {/* Overlay Loading Google */}
          {isGoogleLoading && (
            <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold text-gray-800">Menyambungkan ke Google...</p>
              <p className="text-xs text-gray-500 mt-1">Silakan pilih akun pada pop-up</p>
            </div>
          )}

          {/* Header Form */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Login To Your Account</h1>
            <p className="text-sm text-gray-500">Enter your email below to login to your account</p>
          </div>

          {/* Form Input Manual */}
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input 
                type="email" 
                placeholder="johndoe@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={INPUT_CLASS} 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold">Password</label>
                <Link href="/forgotpasspage" className="text-sm text-gray-500 hover:text-black hover:underline transition-colors">
                  Forgot your password?
                </Link>
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={INPUT_CLASS} 
              />
            </div>

            <button type="submit" className="w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors mt-2">
              Login
            </button>
          </form>

          {/* Divider / Garis Pemisah "Or" */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Tombol Google Sign In */}
          <button onClick={handleGoogleLogin} type="button" className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign In With Google
          </button>

          {/* Tautan ke Halaman Sign Up */}
          <div className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account? <Link href="/signuppage" className="font-semibold text-black hover:underline">Sign Up</Link>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <Footer />

      {/* --- MODAL POP-UP NOTIFIKASI --- */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${modalConfig.isError ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"}`}>
              {modalConfig.isError ? <AlertCircle className="w-10 h-10" /> : <CheckCircle className="w-10 h-10" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{modalConfig.title}</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">{modalConfig.message}</p>
            <button onClick={closeModal} className="w-full font-bold py-3.5 rounded-xl transition shadow-sm bg-black text-white hover:bg-gray-800">
              {modalConfig.redirectOnClose ? "Lanjutkan" : "Mengerti"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}