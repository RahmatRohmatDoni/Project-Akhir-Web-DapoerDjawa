"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Star, CheckCircle, AlertCircle, X } from "lucide-react";

// IMPORT FOOTER DARI FILE NAVBAR
import { Footer } from "../components/Navbar";

// --- CONSTANTS ---
// Data dummy untuk produk terkait
const relatedProducts = [
  { id: "1", name: "Vanila Choco Cookies", price: 72000, image: "/Cookies Vanila & Coklat.png", link: "/detailpage7" },
  { id: "2", name: "Bola Bola Rambutan Coklat", price: 85000, image: "/Bola Bola Rambutan Coklat.png", link: "/detailpage5" },
  { id: "3", name: "Cookies Kacang", price: 80000, image: "/Kue Kacang.png", link: "/detailpage8" },
  { id: "4", name: "Lidah Kucing", price: 88000, image: "/Lidah Kucing.png", link: "/detailpage4" },
  { id: "5", name: "Putri Salju", price: 86000, image: "/Putri Salju.png", link: "/detailpage3" },
];

export default function DetailPage() {
  // --- STATE MANAGEMENT ---
  // State untuk jumlah (quantity) barang yang akan dibeli
  const [qty, setQty] = useState(0);
  
  // State terpusat untuk konfigurasi Modal pop-up (Sukses/Error)
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    isError: false,
    title: "",
    message: "",
  });

  // --- LOGIC FUNCTIONS ---

  // Handler untuk menambah kuantitas barang
  const handleIncreaseQty = () => {
    setQty((prev) => prev + 1);
  };

  // Handler untuk mengurangi kuantitas barang (tidak boleh di bawah 0)
  const handleDecreaseQty = () => {
    setQty((prev) => Math.max(0, prev - 1));
  };

  // Handler terpusat untuk menutup Modal
  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Handler untuk proses tambah produk ke keranjang
  const handleAddToCart = () => {
    // Validasi pencegahan jika qty masih 0
    if (qty === 0) {
      return setModalConfig({
        isOpen: true,
        isError: true,
        title: "Ups, Perhatian!",
        message: "Silakan tentukan jumlah barang terlebih dahulu sebelum menambahkan ke keranjang.",
      });
    }

    // 1. Siapkan data produk yang mau dimasukkan
    const newProduct = {
      id: "2", 
      name: "Choco Chip Cookies",
      price: 68000,
      img: "/choco chip cookies.png", 
      qty: qty
    };

    // 2. Ambil keranjang dari localStorage (jika kosong, inisialisasi sebagai array)
    const existingCart = JSON.parse(localStorage.getItem("dapoerdjawa_cart") || "[]");

    // 3. Cek apakah produk ini sudah ada di dalam keranjang sebelumnya
    const productIndex = existingCart.findIndex((item: { id: string }) => item.id === newProduct.id);

    if (productIndex >= 0) {
      // Jika sudah ada, tambahkan quantity-nya saja
      existingCart[productIndex].qty += qty;
    } else {
      // Jika belum ada, masukkan sebagai data produk baru
      existingCart.push(newProduct);
    }

    // 4. Simpan pembaruan data keranjang ke localStorage
    localStorage.setItem("dapoerdjawa_cart", JSON.stringify(existingCart));
    
    // Tampilkan pop-up notifikasi sukses
    setModalConfig({
      isOpen: true,
      isError: false,
      title: "Berhasil!",
      message: "Produk berhasil ditambahkan ke keranjang belanja Anda.",
    });
    
    // Reset qty ke 0 setelah berhasil dimasukkan
    setQty(0);
  };

  return (
    <section className="min-h-screen bg-white work-sans selection:bg-[#111111] selection:text-white">
      {/* Styling Bawaan */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Work+Sans:200,400,600&display=swap'); 
        .work-sans { font-family: 'Work Sans', sans-serif; } 
        html { scroll-behavior: smooth; }
      `}</style>
      
      <main className="mx-auto max-w-360 px-6 pt-32 pb-16">
        
        {/* --- 1. PRODUCT DETAIL SECTION --- */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16 mb-10">
          
          {/* Kolom Kiri: Gambar Produk Utama */}
          <div className="flex w-full items-start justify-start lg:w-[51%]">
            <div className="relative group -ml-4 -mt-6 w-full aspect-square overflow-hidden rounded-[20px] bg-[#F5F5F5] shadow-sm transition-shadow duration-300 hover:shadow-xl lg:-ml-12">
              <Image 
                src="/Choco Chip Cookies 2.png" 
                alt="Choco Chip Cookies" 
                fill 
                priority 
                sizes="(max-width: 768px) 100vw, 50vw" 
                className="object-cover transition-all duration-700 ease-out group-hover:scale-105" 
              />
            </div>
          </div>

          {/* Kolom Kanan: Detail & Tombol Beli */}
          <div className="-ml-4 -mt-1 flex w-full flex-col justify-start lg:w-[50%] lg:-ml-20">
            <h1 className="mb-4 text-4xl font-bold text-[#111111] md:text-5xl">Choco Chip Cookies</h1>
            <p className="mb-6 text-3xl font-bold text-[#111111]">Rp68.000</p>

            {/* Rating Bintang */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex text-[#FACC15]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-sm text-[#666666]">4.6/5 (20 Ulasan)</span>
            </div>

            <p className="mb-6 text-sm font-medium text-[#DC2626]">
              Ketersediaan: Stok Terbatas (Tersisa 15 Toples)
            </p>
            
            <p className="mb-8 text-lg leading-relaxed text-[#666666] text-justify">
              Kue kering favorit sepanjang masa yang dipanggang sempurna. Dibuat menggunakan mentega premium dengan taburan chocolate chip berkualitas yang melimpah. Menawarkan perpaduan tekstur pinggiran yang garing renyah, berpadu dengan bagian tengah yang empuk (chewy) dan lelehan cokelat di setiap gigitannya. Manisnya pas, nyoklat banget, dan 100% tanpa pengawet. Pilihan tepat untuk camilan keluarga dan hari raya!
            </p>

            {/* Kontrol Jumlah Barang */}
            <div className="mb-8 flex items-center gap-6">
              <span className="text-lg font-medium text-[#666666]">Jumlah:</span>
              <div className="flex h-12 w-36 items-center rounded-lg border border-gray-200 bg-white shadow-sm">
                <button 
                  onClick={handleDecreaseQty} 
                  className="flex h-full w-11 items-center justify-center rounded-l-lg text-gray-500 hover:bg-gray-50 hover:text-black active:bg-gray-100 transition-colors"
                >
                  <Minus className="h-5 w-5" />
                </button>
                
                <div className="flex h-full flex-1 items-center justify-center border-x border-gray-100 text-lg font-semibold text-[#111111]">
                  {qty}
                </div>
                
                <button 
                  onClick={handleIncreaseQty} 
                  className="flex h-full w-11 items-center justify-center rounded-r-lg text-gray-500 hover:bg-gray-50 hover:text-black active:bg-gray-100 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tombol Tambah ke Keranjang */}
            <button 
              onClick={handleAddToCart} 
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#111111] text-sm font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#2a2a2a] hover:shadow-lg active:scale-[0.98] transition-all duration-300"
            >
              <Image 
                src="/shopping-cart.svg" 
                alt="Cart" 
                width={20} 
                height={20} 
                className="h-5 w-5 invert brightness-0" 
              />
              <span>Tambahkan Ke Keranjang</span>
            </button>
          </div>
        </div>

        {/* --- 2. RELATED PRODUCTS SECTION --- */}
        <div className="mt-10">
          <h2 className="-ml-4 mb-6 text-2xl font-bold text-[#111111] lg:-ml-12">Anda Mungkin Juga Suka</h2>
          
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6 -ml-4 lg:-ml-12">
            
            {/* List Produk Terkait */}
            {relatedProducts.map((p) => (
              <Link key={p.id} href={p.link} className="group relative flex grow flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="relative block aspect-square overflow-hidden">
                  <Image 
                    src={p.image} 
                    alt={p.name} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 16vw" 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="flex grow flex-col p-5">
                  <h3 className="mb-2 text-base font-semibold text-gray-900 group-hover:text-gray-600 transition">{p.name}</h3>
                  <p className="mt-auto text-lg font-bold text-gray-900">Rp{p.price.toLocaleString("id-ID")}</p>
                </div>
              </Link>
            ))}
            
            {/* Card "Lihat Semua" */}
            <Link href="/mainpage#shop" className="group flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-[#F5F5F5] transition-all duration-300 min-h-64 aspect-square lg:aspect-auto">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm mb-4 group-hover:shadow-md transition-shadow">
                <Image 
                  src="/chevrons-right.png" 
                  alt="Lihat Lebih Banyak" 
                  width={32} 
                  height={32} 
                  className="w-8 h-8 opacity-70" 
                />
              </div>
              <span className="text-sm font-semibold tracking-wide text-gray-500 group-hover:text-gray-900 transition-colors">Lihat Semua</span>
            </Link>
          </div>
        </div>
      </main>
      
      {/* --- FOOTER --- */}
      <Footer />

      {/* --- MODAL POPUP KERANJANG --- */}
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
            <p className="text-gray-500 mb-8 leading-relaxed">
              {modalConfig.message}
            </p>
            
            {/* Aksi Button berdasarkan State Modal */}
            <div className="flex gap-3">
              <button 
                onClick={closeModal}
                className={`block w-full font-bold py-3.5 rounded-xl transition shadow-sm ${modalConfig.isError ? "bg-black text-white hover:bg-gray-800" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
              >
                {modalConfig.isError ? "Mengerti" : "Lanjut Belanja"}
              </button>
              
              {!modalConfig.isError && (
                <Link 
                  href="/cartpage" 
                  className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition shadow-md flex items-center justify-center"
                >
                  Lihat Keranjang
                </Link>
              )}
            </div>

          </div>
        </div>
      )}

    </section>
  );
}