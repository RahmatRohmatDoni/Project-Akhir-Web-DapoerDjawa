"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// IMPORT FOOTER DARI FILE NAVBAR
import { Footer } from "../components/Navbar";

// --- TYPES ---
type UserData = {
  name?: string;
  displayName?: string;
  email?: string;
  role?: string;
  photoURL?: string; // Menambahkan foto dari Google
};

export default function AfterLoginPage() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    const loggedInUser = localStorage.getItem("dapoerdjawa_logged_in_user");
    
    // Timeout digunakan untuk memastikan eksekusi aman di environment client-side
    setTimeout(() => {
      setIsMounted(true);
      if (loggedInUser) {
        try {
          setUserData(JSON.parse(loggedInUser));
        } catch (e) {
          console.error("Gagal membaca session user", e);
        }
      } else {
        router.push("/loginpage");
      }
    }, 0);
    
  }, [router]);

  // --- LOGIC FUNCTIONS ---

  // Handler untuk integrasi logout Firebase & penghapusan sesi lokal
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out dari layanan Firebase
    } catch (error) {
      console.error("Gagal signout dari Firebase:", error);
    }
    
    // Hapus data sesi dari LocalStorage
    localStorage.removeItem("dapoerdjawa_logged_in_user");
    router.push("/loginpage");
  };

  // Mencegah render UI / Hydration error sebelum client siap
  if (!isMounted || !userData) return null;

  // Variabel penampung fallback untuk data profil
  const finalName = userData.name || userData.displayName || "Pengguna DapoerDjawa";
  const finalEmail = userData.email || "Email tidak terdeteksi";
  const finalRole = userData.role || "user";

  return (
    <section className="w-full bg-gray-50 text-gray-800 leading-normal text-base tracking-normal min-h-screen flex flex-col pt-24">
      <style>{`html { overflow-y: scroll; }`}</style>

      {/* --- MAIN CONTENT: PROFILE CARD --- */}
      <main className="w-full flex-1 flex items-center justify-center p-6 my-10">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
          
          {/* --- HEADER PROFIL --- */}
          <div className="text-center mb-8">
            {/* Tampilkan Foto Profil Google jika ada, jika tidak, pakai ikon bawaan */}
            {userData.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={userData.photoURL} 
                alt="Profile" 
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md border-4 border-gray-100 object-cover" 
              />
            ) : (
              <div className="w-24 h-24 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-4 border-gray-100">
                <User className="w-12 h-12" />
              </div>
            )}
            
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Profil Akun Anda</h1>
            <p className="text-sm text-gray-500 mt-1">Detail informasi akun DapoerDjawa aktif</p>
          </div>

          {/* --- BOX DETAIL INFORMASI --- */}
          <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8">
            
            {/* Item: Nama Lengkap */}
            <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
              <User className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</p>
                <p className="text-gray-900 font-bold text-base mt-0.5">{finalName}</p>
              </div>
            </div>

            {/* Item: Alamat Email */}
            <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
              <Mail className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alamat Email</p>
                <p className="text-gray-900 font-semibold text-base mt-0.5">{finalEmail}</p>
              </div>
            </div>

            {/* Item: Hak Akses / Role */}
            <div className="flex items-center gap-4">
              <Shield className="w-5 h-5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hak Akses / Role</p>
                <span 
                  className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 border capitalize ${
                    finalRole === "admin" 
                      ? "bg-red-50 text-red-600 border-red-200" 
                      : "bg-green-50 text-green-600 border-green-200"
                  }`}
                >
                  {finalRole}
                </span>
              </div>
            </div>

          </div>

          {/* --- TOMBOL AKSI --- */}
          <div className="space-y-3">
            <button 
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Keluar dari Akun
            </button>
            
            <Link 
              href="/mainpage" 
              className="w-full border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" /> Kembali Belanja
            </Link>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <Footer />
      
    </section>
  );
}