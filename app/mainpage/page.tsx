"use client";
import React, { Fragment, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// IMPORT FOOTER DARI FILE NAVBAR
import { Footer } from "../components/Navbar"; 

// --- DATA DUMMY & CONSTANTS ---
const products = [
  { id: "1", name: "Nastar Classic", price: 92000, img: "/Nastar Classic.png", link: "/detailpage1" },
  { id: "2", name: "Choco Chip Cookies", price: 68000, img: "/Choco Chip Cookies.png", link: "/detailpage2" },
  { id: "3", name: "Putri Salju", price: 86000, img: "/Putri Salju.png", link: "/detailpage3" },
  { id: "4", name: "Lidah Kucing", price: 88000, img: "/Lidah Kucing.png", link: "/detailpage4" },
  { id: "5", name: "Bola Bola Rambutan Coklat", price: 85000, img: "/Bola Bola Rambutan Coklat.png", link: "/detailpage5" },
  { id: "6", name: "Nastar Daun", price: 97000, img: "/Nastar Daun.png", link: "/detailpage6" },
  { id: "7", name: "Vanila Choco Cookies", price: 72000, img: "/Cookies Vanila & Coklat.png", link: "/detailpage7" },
  { id: "8", name: "Cookies Kacang", price: 80000, img: "/Kue Kacang.png", link: "/detailpage8" },
];

const carouselData = [
  { id: 1, prev: 3, next: 2, img: "/Banner Idul Fitri.png", alt: "Banner Idul Fitri" },
  { id: 2, prev: 1, next: 3, img: "/Banner Nataru.png", alt: "Banner Nataru" },
  { id: 3, prev: 2, next: 1, img: "/Banner Imlek.png", alt: "Banner Imlek" },
];

// Konstanta untuk opsi sorting agar lebih mudah dimaintenance
const SORT_OPTIONS = [
  { id: "asc", label: "Termurah - Termahal", iconPath: "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" },
  { id: "desc", label: "Termahal - Termurah", iconPath: "M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" }
];

// --- MAIN PAGE ---
export default function MainPage() {
  // --- STATE MANAGEMENT ---
  // State untuk mengontrol slide banner yang aktif
  const [activeSlide, setActiveSlide] = useState(1);

  // State untuk pencarian produk
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  
  // State untuk filter harga (asc/desc)
  const [sortOrder, setSortOrder] = useState(""); 
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // --- EFFECTS ---
  // Menjalankan auto-slide pada banner setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev >= carouselData.length ? 1 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [activeSlide]);

  // --- LOGIC FUNCTIONS ---
  // Menggunakan useMemo agar proses filter/sort hanya berjalan jika data atau state berubah (optimasi performa)
  const filteredAndSortedProducts = useMemo(() => {
    return [...products]
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortOrder === "asc") return a.price - b.price;
        if (sortOrder === "desc") return b.price - a.price;
        return 0;
      });
  }, [searchQuery, sortOrder]);

  // Handler untuk toggle input pencarian
  const handleToggleSearch = () => {
    if (showSearchInput) setSearchQuery(""); // Reset pencarian jika ditutup
    setShowSearchInput(!showSearchInput);
  };

  // Handler untuk merubah urutan harga
  const handleSortChange = (order: string) => {
    setSortOrder(order);
    setShowFilterDropdown(false);
  };

  return (
    <section className="bg-gray-50 text-gray-800 work-sans leading-normal text-base tracking-normal pt-24 min-h-screen">
      {/* --- STYLING KHUSUS UNTUK CAROUSEL --- */}
      <style>{`
        html { scroll-behavior: smooth; }
        .carousel-open:checked + .carousel-item { position: static; opacity: 100; transition: opacity 0.6s ease-out; }
        .carousel-item { transition: opacity 0.6s ease-out; }
        #carousel-1:checked ~ .control-1, #carousel-2:checked ~ .control-2, #carousel-3:checked ~ .control-3 { display: flex; }
        #carousel-1:checked ~ .carousel-indicators li:nth-child(1) .carousel-bullet,
        #carousel-2:checked ~ .carousel-indicators li:nth-child(2) .carousel-bullet,
        #carousel-3:checked ~ .carousel-indicators li:nth-child(3) .carousel-bullet { color: #1f2937; }
      `}</style>

      {/* --- 1. HERO CAROUSEL --- */}
      <div className="carousel relative container mx-auto px-4 sm:px-0 max-w-[1600px]">
        <div className="carousel-inner relative w-full rounded-2xl shadow-md bg-gray-100 flex items-center justify-center overflow-hidden">
          {carouselData.map((c) => (
            <Fragment key={c.id}>
              {/* Radio button untuk mengontrol slide (disembunyikan) */}
              <input 
                className="carousel-open" 
                type="radio" 
                id={`carousel-${c.id}`} 
                name="carousel" 
                aria-hidden="true" 
                hidden 
                checked={activeSlide === c.id} 
                onChange={() => setActiveSlide(c.id)} 
              />
              <div className="carousel-item absolute top-0 left-0 opacity-0 w-full h-full flex items-center justify-center">
                <Image 
                  src={c.img} 
                  alt={c.alt} 
                  width={1600} 
                  height={600} 
                  priority={c.id === 1} 
                  sizes="100vw"
                  className="w-full h-auto block" 
                />
              </div>
              
              {/* Tombol Navigasi Kiri (Prev) */}
              <label 
                htmlFor={`carousel-${c.prev}`} 
                onClick={() => setActiveSlide(c.prev)}
                className={`prev control-${c.id} w-10 h-10 ml-2 md:ml-6 absolute cursor-pointer hidden items-center justify-center text-2xl font-bold text-gray-800 hover:text-white rounded-full bg-white/80 hover:bg-gray-900 transition duration-300 z-10 inset-y-0 left-0 my-auto shadow-md`}>
                ‹
              </label>
              
              {/* Tombol Navigasi Kanan (Next) */}
              <label 
                htmlFor={`carousel-${c.next}`} 
                onClick={() => setActiveSlide(c.next)}
                className={`next control-${c.id} w-10 h-10 mr-2 md:mr-6 absolute cursor-pointer hidden items-center justify-center text-2xl font-bold text-gray-800 hover:text-white rounded-full bg-white/80 hover:bg-gray-900 transition duration-300 z-10 inset-y-0 right-0 my-auto shadow-md`}>
                ›
              </label>
            </Fragment>
          ))}
          
          {/* Indikator Dot Carousel (Bawah) */}
          <ol className="carousel-indicators list-none m-0 p-0 absolute bottom-2 left-0 right-0 text-center z-10">
            {carouselData.map((c) => (
              <li key={c.id} className="inline-block mr-3">
                <label 
                  htmlFor={`carousel-${c.id}`} 
                  onClick={() => setActiveSlide(c.id)}
                  className="carousel-bullet cursor-pointer block text-3xl text-gray-400 hover:text-gray-800 drop-shadow-sm transition duration-200">
                  •
                </label>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* --- 2. SHOP SECTION --- */}
      <section id="shop" className="bg-gray-50 pt-16 pb-12 scroll-mt-20 min-h-[60vh]">
        <div className="container mx-auto px-6">
          
          {/* --- HEADER SHOP: Judul, Search, & Filter --- */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-300 mb-10 gap-4">
            
            <div className="flex-1 w-full relative">
              {showSearchInput ? (
                <input
                  type="text"
                  autoFocus
                  placeholder="Cari nama produk..."
                  className="w-full sm:max-w-md bg-white border border-gray-300 text-gray-900 text-lg rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              ) : (
                <h2 className="uppercase tracking-wide font-bold text-gray-900 text-2xl">Our Products</h2>
              )}
            </div>

            <div className="flex items-center gap-4 relative">
              {/* TOMBOL FILTER */}
              <div className="relative">
                <button 
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)} 
                  className={`hover:bg-gray-200 p-2 rounded-full transition duration-200 ${showFilterDropdown ? "bg-gray-200" : ""}`}
                  title="Filter Harga"
                >
                  <svg className="fill-current text-gray-600" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M7 11H17V13H7zM4 7H20V9H4zM10 15H14V17H10z" />
                  </svg>
                </button>

                {/* Dropdown Menu Filter */}
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 overflow-hidden animate-fade-in origin-top-right">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                      <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest">Urutkan Harga</p>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                      {/* Mapping Opsi Sorting */}
                      {SORT_OPTIONS.map((option) => (
                        <button 
                          key={option.id}
                          onClick={() => handleSortChange(option.id)} 
                          className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all flex items-center justify-between group ${sortOrder === option.id ? 'bg-black text-white font-semibold shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                        >
                          <span className="flex items-center gap-2">
                            <svg className={`w-4 h-4 ${sortOrder === option.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.iconPath} />
                            </svg>
                            {option.label}
                          </span>
                          {sortOrder === option.id && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}

                      {/* Tombol Reset Filter */}
                      {sortOrder !== "" && (
                        <>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <button 
                            onClick={() => handleSortChange("")} 
                            className="w-full text-left px-4 py-3 text-sm rounded-xl text-red-500 hover:bg-red-50 transition-all flex items-center gap-2 font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reset Filter
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* TOMBOL PENCARIAN */}
              <button 
                onClick={handleToggleSearch} 
                className={`hover:bg-gray-200 p-2 rounded-full transition duration-200 ${showSearchInput ? "bg-gray-200 text-gray-900" : "text-gray-600"}`}
                title="Cari Produk"
              >
                <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
                  {showSearchInput ? (
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  ) : (
                    <path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* --- GRID PRODUK & EMPTY STATE --- */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredAndSortedProducts.map((p) => (
                <Link key={p.id} href={p.link} className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="relative block overflow-hidden aspect-square">
                    <Image src={p.img} alt={p.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition">{p.name}</h3>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mt-auto">Rp{p.price.toLocaleString("id-ID")}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // UI Ketika produk yang dicari tidak ada
            <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl shadow-sm py-20 px-6 text-center animate-fade-in">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Waduh, produknya nggak ketemu nih!</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto mb-6">
                Maaf, sepertinya produk <strong>&quot;{searchQuery}&quot;</strong> yang kamu cari belum tersedia. Coba gunakan kata kunci lain, ya!
              </p>
              <button 
                onClick={handleToggleSearch}
                className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition shadow-md"
              >
                Kembali ke Semua Produk
              </button>
            </div>
          )}

        </div>
      </section>

      {/* --- 3. ABOUT SECTION --- */}
      <section id="about" className="bg-white py-16 border-t border-gray-200 scroll-mt-20 min-h-[60vh]">
        <div className="container mx-auto px-6 max-w-4xl text-center md:text-left">
          <h2 className="uppercase tracking-wide font-bold text-gray-900 text-2xl mb-6">About Us</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6 text-justify">
            Dapoer Djawa adalah UMKM rumahan yang bermula di Perum BDS 2, Balikpapan, pada awal 2020. Saat pandemi membatasi aktivitas, langkah kecil ini dimulai dari dapur rumah kami untuk menyajikan kue kering bagi keluarga. Tanpa pabrik atau mesin canggih, operasional kami jalankan dengan ketekunan dalam menimbang, menguleni, dan memanggang adonan secara manual setiap hari. Walau berskala kecil, kejujuran rasa dan kualitas bahan selalu menjadi prioritas utama. Baik itu Nastar, Putri Salju, atau varian cookies lainnya, semua diracik layaknya sajian untuk keluarga di ruang tamu.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-6 text-justify">
            Kini, pesanan yang berawal dari tetangga sekitar telah meluas menjangkau lebih banyak pelanggan secara online. Pertumbuhan ini mendorong kami untuk terus bertransformasi menjadi lebih profesional dalam melayani Anda, tanpa pernah meninggalkan kehangatan resep asli rumahan kami. Terima kasih telah mendukung perjalanan dan karya Dapoer Djawa.
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
      
    </section>
  );
}