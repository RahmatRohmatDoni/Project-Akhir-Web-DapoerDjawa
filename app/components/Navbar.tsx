"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// --- 1. KOMPONEN FOOTER GLOBAL ---
// Data sosial media dipindahkan ke sini agar menyatu dengan Footer dan mengurangi hardcode di return
const socialLinks = [
  { href: "https://instagram.com/_dapoer_djawa", img: "/instagram.png", alt: "Instagram" },
  { href: "https://tiktok.com/@dapoer_djawa", img: "/tiktok.png", alt: "tiktok" },
  { href: "https://wa.me/62895383270632", img: "/wa.png", alt: "wa" },
];

export const Footer = () => (
  <footer className="w-full bg-gray-50 border-t border-gray-200 py-10 mt-auto">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
      <p className="text-gray-600 text-sm text-center md:text-left mb-4 md:mb-0">
        &copy; 2026 DapoerDjawa. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        {socialLinks.map(({ href, img, alt }) => (
          <a key={alt} href={href} target="_blank" rel="noopener noreferrer">
            <Image 
              src={img} 
              alt={alt} 
              width={32} 
              height={32} 
              className="w-8 h-8 hover:scale-110 transition" 
            />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

// --- 2. KOMPONEN NAVBAR UTAMA ---
export default function Navbar() {
  
  // --- STATE MANAGEMENT ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const pathname = usePathname();

  // --- EFFECTS ---
  useEffect(() => {
    // Fungsi untuk mengecek sesi user di LocalStorage
    const checkLoginStatus = () => {
      const loggedInUser = localStorage.getItem("dapoerdjawa_logged_in_user");
      
      // Timeout untuk memastikan status re-render aman di sisi client (hydration)
      setTimeout(() => {
        if (loggedInUser) {
          setIsLoggedIn(true); 
          try {
            const user = JSON.parse(loggedInUser);
            // Validasi hak akses Administrator
            if (user.email === "dapoerdjawa@gmail.com" && user.role === "admin") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } catch (error) {
            console.error("Gagal membaca data user", error);
          }
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      }, 0);
    };

    checkLoginStatus();
  }, [pathname]);

  // --- LOGIC FUNCTIONS ---
  
  // Handler untuk mengelola status hamburger menu mobile
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // --- RENDER COMPONENT ---
  return (
    <nav id="header" className="fixed w-full z-50 top-0 py-3 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="relative w-full container mx-auto flex flex-wrap items-center justify-between px-6">
        
        {/* --- KIRI: TOMBOL HAMBURGER MOBILE --- */}
        <button 
          onClick={toggleMenu} 
          className="cursor-pointer md:hidden block hover:text-black z-20"
          aria-label="Toggle Menu"
        >
          <svg className="fill-current text-gray-900" width="20" height="20" viewBox="0 0 20 20">
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>

        {/* --- MENU NAVIGASI (SHOP & ABOUT) --- */}
        <div className={`${isMenuOpen ? "block absolute top-14 left-0 w-full bg-white/95 p-4 shadow-md text-center" : "hidden"} md:flex flex-1 items-center z-10`}>
          <ul className="flex flex-col md:flex-row items-center gap-6 text-base text-gray-700">
            {["shop", "about"].map((item) => (
              <li key={item}>
                <Link 
                  onClick={closeMenu} 
                  className="font-semibold hover:text-black transition duration-200 capitalize" 
                  href={`/mainpage#${item}`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* --- TENGAH: LOGO --- */}
        <div className="flex-1 flex justify-center z-20">
          <Link href="/mainpage" className="flex items-center hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Logo DapoerDjawa" 
              width={48} 
              height={48} 
              className="h-12 w-auto mr-3" 
            />
            <span className="font-bold text-2xl text-gray-900">DapoerDjawa</span>
          </Link>
        </div>

        {/* --- KANAN: IKON (ANALYTIC, LOGIN, CART) --- */}
        <div className="flex-1 flex justify-end items-center gap-4 z-20">
          
          {/* ICON ANALYTIC (Hanya muncul jika role user adalah admin) */}
          {isAdmin && (
            <Link 
              href="/analyticspage"
              className="inline-block no-underline hover:text-black transition duration-200" 
              title="Dashboard Analytics"
            >
              <svg className="fill-current text-gray-600 hover:text-gray-900" width="24" height="24" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </Link>
          )}

          {/* ICON USER / LOGIN (Dinamis berdasarkan status login) */}
          <Link 
            href={isLoggedIn ? "/afterloginpage" : "/loginpage"}
            className="inline-block no-underline hover:text-black transition duration-200" 
            title={isLoggedIn ? "Profil Akun" : "Masuk / Daftar"}
          >
            <svg className="fill-current text-gray-600 hover:text-gray-900" width="24" height="24" viewBox="0 0 24 24">
              <circle fill="none" cx="12" cy="7" r="3" />
              <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5S14.757 2 12 2zM12 10c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3S13.654 10 12 10zM21 21v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h2v-1c0-2.757 2.243-5 5-5h4c2.757 0 5 2.243 5 5v1H21z" />
            </svg>
          </Link>

          {/* ICON KERANJANG (CART) */}
          <Link 
            href="/cartpage"
            className="inline-block no-underline hover:text-black transition duration-200" 
            title="Keranjang Belanja"
          >
            <svg className="fill-current text-gray-600 hover:text-gray-900" width="24" height="24" viewBox="0 0 24 24">
              <path d="M21,7H7.462L5.91,3.586C5.748,3.229,5.392,3,5,3H2v2h2.356L9.09,15.414C9.252,15.771,9.608,16,10,16h8 c0.4,0,0.762-0.238,0.919-0.606l3-7c0.133-0.309,0.101-0.663-0.084-0.944C21.649,7.169,21.336,7,21,7z M17.341,14h-6.697L8.371,9 h11.112L17.341,14z" />
              <circle cx="10.5" cy="18.5" r="1.5" />
              <circle cx="17.5" cy="18.5" r="1.5" />
            </svg>
          </Link>

        </div>
      </div>
    </nav>
  );
}