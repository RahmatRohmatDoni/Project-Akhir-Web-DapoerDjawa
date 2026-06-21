"use client";
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, LogIn } from "lucide-react"; 

// IMPORT FOOTER DARI FILE NAVBAR
import { Footer } from "../components/Navbar";

// --- TYPES ---
type CartItem = {
  id: string;
  name: string;
  img: string;
  price: number;
  qty: number;
};

// --- CONSTANTS ---
const carouselData = [
  { id: 1, img: "/Banner Idul Fitri.png", alt: "Promo Lebaran", prev: 3, next: 2 },
  { id: 2, img: "/Banner Imlek.png", alt: "Promo Imlek", prev: 1, next: 3 }, 
  { id: 3, img: "/Banner Nataru.png", alt: "Promo Nataru", prev: 2, next: 1 }, 
];

// --- MAIN CART PAGE COMPONENT ---
export default function CartPage() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [isMounted, setIsMounted] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // State Promo / Diskon
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState({ text: "", type: "" });

  // State Pop-up Login 
  const [showLoginModal, setShowLoginModal] = useState(false);

  // State Banner Auto Slide
  const [activeSlide, setActiveSlide] = useState(1);

  // --- EFFECTS ---
  
  // 1. Load Data Keranjang dari LocalStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      const savedCart = localStorage.getItem("dapoerdjawa_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. Timer Auto Slide Banner
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev >= carouselData.length ? 1 : prev + 1));
    }, 5000); 

    return () => clearInterval(slideTimer);
  }, [activeSlide]);

  // --- LOGIC FUNCTIONS ---

  // Handler untuk menyimpan dan me-render ulang data Cart
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("dapoerdjawa_cart", JSON.stringify(newCart));
  };

  // Handler untuk mengupdate jumlah qty pada item tertentu
  const updateQty = (id: string, delta: number) => {
    saveCart(
      cart.map((item) => 
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  // Handler untuk menghapus produk dari list
  const removeItem = (id: string) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  // Handler untuk menghapus keseluruhan isi keranjang
  const clearCart = () => saveCart([]);

  // Handler untuk mengecek dan mengaplikasikan Promo
  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    
    const promoCodes: { [key: string]: number } = {
      "LEBARAN 2026": 50000,
      "IMLEK 2026": 30000,
      "TAHUN BARU 2026": 20000,
    };

    if (promoCodes[code]) {
      setDiscount(promoCodes[code]);
      setPromoMessage({ 
        text: `Hore! Kode ${code} berhasil! Diskon Rp${promoCodes[code].toLocaleString("id-ID")} diterapkan.`, 
        type: "success" 
      });
    } else {
      setDiscount(0);
      setPromoMessage({ 
        text: "Maaf, kode promo tidak ditemukan.", 
        type: "error" 
      });
    }
  };

  // Handler Validasi Sesi Login Sebelum Checkout
  const handleCheckout = () => {
    const loggedInUser = localStorage.getItem("dapoerdjawa_logged_in_user");

    // Jika user belum login, batalkan checkout dan panggil modal pop-up
    if (!loggedInUser) {
      return setShowLoginModal(true);
    }

    // Jika sudah login, simpan nilai diskon terakhir dan lanjut ke checkout page
    localStorage.setItem("dapoerdjawa_discount", discount.toString());
    router.push("/checkoutpage");
  };

  // Handler tutup pop-up login
  const closeLoginModal = () => setShowLoginModal(false);

  // --- CALCULATIONS ---
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = Math.max(0, subtotal - discount);

  // Hydration Error Prevention
  if (!isMounted) return null; 

  return (
    <section className="bg-white text-gray-800 work-sans leading-normal text-base tracking-normal min-h-screen flex flex-col">
      {/* --- STYLING Bawaan & Custom Carousel --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Work+Sans:200,400,600&display=swap'); 
        html { scroll-behavior: smooth; overflow-y: scroll; } 
        .work-sans { font-family: 'Work Sans', sans-serif; }

        .carousel-open:checked + .carousel-item { position: static; opacity: 1; }
        .carousel-item { transition: opacity 0.6s ease-out; }
        
        #carousel-1:checked ~ .control-1,
        #carousel-2:checked ~ .control-2,
        #carousel-3:checked ~ .control-3 { display: flex; }
        
        #carousel-1:checked ~ .carousel-indicators li:nth-child(1) .carousel-bullet,
        #carousel-2:checked ~ .carousel-indicators li:nth-child(2) .carousel-bullet,
        #carousel-3:checked ~ .carousel-indicators li:nth-child(3) .carousel-bullet { color: #111827; }
      `}</style>

      <main className="container mx-auto max-w-7xl px-6 pt-25 pb-16 flex-1">
        
        {/* --- 1. HEADER KERANJANG --- */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
            <p className="text-gray-500 mt-1 font-medium">Anda memiliki {cart.length} produk di keranjang</p>
          </div>
          
          {/* Tombol Clear All Data */}
          {cart.length > 0 && (
            <button 
              onClick={clearCart} 
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-all w-fit"
            >
              <X className="w-4 h-4" /> Kosongkan Keranjang
            </button>
          )}
        </div>

        {/* --- 2. LAYOUT KONTEN UTAMA --- */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* === KOLOM KIRI: LIST PRODUK & BANNER === */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            
            {/* Bagian List Produk */}
            <div>
              {cart.length > 0 && (
                <div className="hidden md:flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4 gap-5">
                  <div className="flex-1">Produk</div>
                  <div className="flex items-center md:gap-6">
                    <div className="w-32 text-center">Kuantitas</div>
                    <div className="flex items-center justify-end gap-4 w-auto md:w-44">
                      <div className="text-right flex-1 md:w-32">Total Harga</div>
                      <div className="w-10 shrink-0"></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center p-4 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow gap-4 md:gap-0">
                    
                    {/* Item: Product Info */}
                    <div className="flex items-center gap-5 flex-1">
                      <div className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                        <Image 
                          src={item.img} 
                          alt={item.name} 
                          fill 
                          className="object-cover hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                        <p className="text-gray-500 font-medium">Rp{item.price.toLocaleString("id-ID")}</p>
                      </div>
                    </div>

                    <div className="h-px w-full bg-gray-100 md:hidden my-2"></div>

                    <div className="flex items-center justify-between md:w-auto md:gap-6">
                      
                      {/* Item: Quantity Control */}
                      <div className="w-32 flex justify-center">
                        <div className="flex items-center justify-between border border-gray-200 rounded-full p-1 w-28 bg-gray-50">
                          <button 
                            onClick={() => updateQty(item.id, -1)} 
                            className="w-8 h-8 flex justify-center items-center rounded-full bg-white shadow-sm text-gray-600 hover:text-black hover:bg-gray-100 transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-gray-900 text-sm">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.id, 1)} 
                            className="w-8 h-8 flex justify-center items-center rounded-full bg-white shadow-sm text-gray-600 hover:text-black hover:bg-gray-100 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item: Total Price & Delete Action */}
                      <div className="flex items-center justify-end gap-4 w-auto md:w-44">
                        <div className="text-right flex-1 md:w-32">
                          <span className="md:hidden text-xs text-gray-400 block mb-0.5">Total</span>
                          <span className="font-bold text-gray-900 text-lg">Rp{(item.price * item.qty).toLocaleString("id-ID")}</span>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}

                {/* Empty State Kiri (Jika Keranjang Kosong) */}
                {cart.length === 0 && (
                  <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl shadow-sm h-100 py-16">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Keranjang Belanja Kosong</h3>
                    <p className="text-gray-500 mb-6">Yuk, mulai pilih kue favoritmu sekarang!</p>
                    <Link 
                      href="/mainpage#shop" 
                      className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
                    >
                      Mulai Belanja
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Banner Promo (Sama dengan MainPage) */}
            <div className="carousel relative container mx-auto px-0 mt-2">
              <div className="carousel-inner relative w-full rounded-2xl shadow-md bg-gray-100 flex items-center justify-center overflow-hidden">
                {carouselData.map((c) => (
                  <Fragment key={c.id}>
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
                        className="w-full h-auto block" 
                      />
                    </div>
                    
                    {/* Tombol Kiri (Prev) */}
                    <label 
                      htmlFor={`carousel-${c.prev}`} 
                      onClick={() => setActiveSlide(c.prev)}
                      className={`prev control-${c.id} w-10 h-10 ml-2 md:ml-6 absolute cursor-pointer hidden items-center justify-center text-2xl font-bold text-gray-800 hover:text-white rounded-full bg-white/80 hover:bg-gray-900 transition duration-300 z-10 inset-y-0 left-0 my-auto shadow-md`}
                    >
                      ‹
                    </label>
                    
                    {/* Tombol Kanan (Next) */}
                    <label 
                      htmlFor={`carousel-${c.next}`} 
                      onClick={() => setActiveSlide(c.next)}
                      className={`next control-${c.id} w-10 h-10 mr-2 md:mr-6 absolute cursor-pointer hidden items-center justify-center text-2xl font-bold text-gray-800 hover:text-white rounded-full bg-white/80 hover:bg-gray-900 transition duration-300 z-10 inset-y-0 right-0 my-auto shadow-md`}
                    >
                      ›
                    </label>
                  </Fragment>
                ))}
                
                {/* Dots Indikator Slide */}
                <ol className="carousel-indicators list-none m-0 p-0 absolute bottom-2 left-0 right-0 text-center z-10">
                  {carouselData.map((c) => (
                    <li key={c.id} className="inline-block mr-3">
                      <label 
                        htmlFor={`carousel-${c.id}`} 
                        onClick={() => setActiveSlide(c.id)}
                        className="carousel-bullet cursor-pointer block text-3xl text-gray-400 hover:text-gray-800 drop-shadow-sm transition duration-200"
                      >
                        •
                      </label>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

          </div>
          
          {/* === KOLOM KANAN: RINGKASAN ORDER & CHECKOUT === */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm sticky top-24">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Ringkasan Pesanan</h2>

              <div className="space-y-4 mb-6">
                
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} Produk)</span>
                  <span className="font-semibold text-gray-900">Rp{subtotal.toLocaleString("id-ID")}</span>
                </div>
                
                {/* Form Input Promo */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Kode Promo / Diskon</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Contoh: LEBARAN 2026" 
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition uppercase text-sm"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition text-sm shrink-0"
                    >
                      Terapkan
                    </button>
                  </div>
                  
                  {/* Status Pesan Promo */}
                  {promoMessage.text && (
                    <p className={`mt-2 text-xs font-semibold ${promoMessage.type === "success" ? "text-green-600" : "text-red-500"}`}>
                      {promoMessage.text}
                    </p>
                  )}
                </div>

                {/* Indikator Nominal Diskon */}
                {discount > 0 && (
                  <div className="flex justify-between text-red-500 font-medium">
                    <span>Potongan Promo</span>
                    <span>-Rp{discount.toLocaleString("id-ID")}</span>
                  </div>
                )}

              </div>

              {/* Total Final Tagihan */}
              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Tagihan</span>
                  <span className="text-2xl font-extrabold text-gray-900">Rp{total.toLocaleString("id-ID")}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">Termasuk pajak. Ongkos kirim dihitung saat checkout.</p>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-md flex items-center justify-center gap-2 ${
                  cart.length === 0 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-black text-white hover:bg-gray-800 hover:shadow-lg"
                }`}
              >
                Lanjutkan Checkout
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <Footer />

      {/* --- MODAL POP-UP LOGIN ALERT --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Tombol Tutup Silang Pojok Kanan Atas */}
            <button 
              onClick={closeLoginModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ikon Warning Login */}
            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2 shadow-md">
              <LogIn className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Yuk, Login Dulu!</h3>
            <p className="text-gray-500 font-medium px-4 mb-6 leading-relaxed">
              Anda harus masuk ke akun Anda terlebih dahulu sebelum bisa melakukan checkout pesanan di DapoerDjawa.
            </p>

            {/* Aksi Button Modal */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => router.push("/loginpage")}
                className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition shadow-lg"
              >
                Login Sekarang
              </button>
              <button 
                onClick={closeLoginModal}
                className="w-full bg-white border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition"
              >
                Kembali Belanja
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}