"use client";
import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertCircle, X, ArrowLeft } from "lucide-react";

// IMPORT FOOTER DARI FILE NAVBAR
import { Footer } from "../components/Navbar";

// --- CONSTANTS ---
// Ekstraksi class CSS untuk input agar konsisten, lebih rapi, dan mengurangi duplikasi kode (jika ke depannya ada input tambahan)
const INPUT_CLASS = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all";

export default function ForgotPassPage() {
  // --- STATE MANAGEMENT ---
  // State untuk form input email
  const [email, setEmail] = useState("");
  
  // State terpusat untuk konfigurasi Modal pop-up (Sukses/Error)
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    isError: false,
    title: "",
    message: "",
  });

  // --- LOGIC FUNCTIONS ---

  // Handler untuk proses simulasi reset password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi jika email kosong
    if (!email) {
      return setModalConfig({
        isOpen: true,
        isError: true,
        title: "Ups, Perhatian!",
        message: "Alamat email wajib diisi untuk melakukan reset password.",
      });
    }

    // Ambil Data dari Local Storage (Simulasi Database User)
    const savedUserData = localStorage.getItem("dapoerdjawa_registered_user");

    if (savedUserData) {
      const registeredUser = JSON.parse(savedUserData);

      // Pengecekan apakah email cocok dengan data yang terdaftar
      if (email === registeredUser.email) {
        // Simulasi berhasil mengirim email reset
        setModalConfig({
          isOpen: true,
          isError: false,
          title: "Email Terkirim!",
          message: `Instruksi untuk mengatur ulang password telah dikirim ke ${email}. (Simulasi: Password Anda adalah "${registeredUser.password}")`,
        });
      } else {
        // Jika email tidak cocok
        setModalConfig({
          isOpen: true,
          isError: true,
          title: "Email Tidak Ditemukan",
          message: "Email yang Anda masukkan tidak terdaftar di sistem kami.",
        });
      }
    } else {
      // Jika tidak ada data user sama sekali di sistem (Local Storage kosong)
      setModalConfig({
        isOpen: true,
        isError: true,
        title: "Sistem Kosong",
        message: "Belum ada akun yang terdaftar sama sekali. Silakan Sign Up terlebih dahulu.",
      });
    }
  };

  // Handler terpusat untuk menutup Modal
  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <section className="bg-gray-50 text-gray-800 work-sans leading-normal text-base tracking-normal min-h-screen flex flex-col">
      {/* Style bawaan dari halaman */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Work+Sans:200,400,600&display=swap'); 
        html { scroll-behavior: smooth; overflow-y: scroll; }
        .work-sans { font-family: 'Work Sans', sans-serif; } 
      `}</style>

      {/* --- MAIN CONTENT: FORM RESET PASSWORD --- */}
      <main className="flex-1 flex items-center justify-center p-4 mt-24 mb-10">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
          
          {/* Header Form */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            <p className="text-sm text-gray-500">Enter your email address to receive reset instructions</p>
          </div>

          {/* Form Input Manual */}
          <form className="space-y-5" onSubmit={handleResetPassword}>
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

            <button 
              type="submit" 
              className="w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors mt-2"
            >
              Send Reset Link
            </button>
          </form>

          {/* Tautan Kembali ke Login */}
          <div className="mt-8 text-center">
            <Link 
              href="/loginpage" 
              className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-black transition-colors gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <Footer />

      {/* --- MODAL POP-UP NOTIFIKASI --- */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-100 transform transition-transform animate-in fade-in zoom-in duration-300 relative">
            
            {/* Tombol Close di Pojok Kanan Atas */}
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ikon Status (Success/Error) */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${modalConfig.isError ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"}`}>
              {modalConfig.isError ? <AlertCircle className="w-10 h-10" /> : <CheckCircle className="w-10 h-10" />}
            </div>

            {/* Teks Konten Modal */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{modalConfig.title}</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">{modalConfig.message}</p>

            {/* Aksi Button berdasarkan State Modal */}
            <div className="flex gap-3">
              {modalConfig.isError ? (
                <button 
                  onClick={closeModal} 
                  className="block w-full font-bold py-3.5 rounded-xl transition shadow-sm bg-black text-white hover:bg-gray-800"
                >
                  Coba Lagi
                </button>
              ) : (
                <Link 
                  href="/loginpage" 
                  className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition shadow-md flex items-center justify-center"
                >
                  Kembali Login
                </Link>
              )}
            </div>
            
          </div>
        </div>
      )}
    </section>
  );
}