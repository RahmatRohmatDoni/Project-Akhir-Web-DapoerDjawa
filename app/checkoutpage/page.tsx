"use client";
import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronRight, MapPin, Truck, Banknote, 
  Loader2, CheckCircle 
} from "lucide-react";

// IMPORT FOOTER DARI FILE NAVBAR
import { Footer } from "../components/Navbar";

// --- TYPES ---
type ShippingCourier = { id: string; name: string; price: number; estimasi: string; img: string };
type PaymentMethod = { id: string; name: string; desc: string; img: string };
type CartItem = { id: string; name: string; img: string; price: number; qty: number; };
type ApiRegion = { id: string; name: string };

// --- CONSTANTS & DUMMY DATA ---
const shippingCouriers: ShippingCourier[] = [
  { id: "gojek", name: "GoSend", price: 35000, estimasi: "1-3 Jam (Balikpapan)", img: "https://cdn.simpleicons.org/gojek" },
  { id: "maxim", name: "Maxim", price: 25000, estimasi: "1-6 Jam (Balikpapan)", img: "https://logos.hunter.io/taximaxim.com" },
  { id: "jnt", name: "J&T Express", price: 18000, estimasi: "2-3 Hari", img: "https://logos.hunter.io/jtexpress.com" },
  { id: "sicepat", name: "SiCepat", price: 16000, estimasi: "2-4 Hari", img: "https://logos.hunter.io/sicepat.com" },
  { id: "anteraja", name: "AnterAja", price: 17000, estimasi: "2-3 Hari", img: "https://logos.hunter.io/anteraja.id" },
  { id: "spx", name: "Shopee Express", price: 19000, estimasi: "2-4 Hari", img: "https://cdn.simpleicons.org/shopee" },
  { id: "jne", name: "JNE Reguler", price: 32000, estimasi: "1 Hari", img: "https://logos.hunter.io/jne.co.id" }
];

const paymentMethods: PaymentMethod[] = [
  { id: "qris", name: "QRIS", desc: "GoPay, OVO, Dana, ShopeePay", img: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" },
  { id: "bca", name: "Bank BCA", desc: "Virtual Account", img: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" },
  { id: "mandiri", name: "Bank Mandiri", desc: "Virtual Account", img: "https://logos.hunter.io/bankmandiri.co.id" },
  { id: "bri", name: "Bank BRI", desc: "BRIVA", img: "https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg" },
  { id: "bni", name: "Bank BNI", desc: "Virtual Account", img: "https://logos.hunter.io/bni.co.id" },
  { id: "bsi", name: "Bank BSI", desc: "Virtual Account", img: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Bank_Syariah_Indonesia.svg" },
  { id: "minimarket", name: "Indomaret / Alfamart", desc: "Bayar di kasir terdekat", img: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Indomaret.png" },
  { id: "cod", name: "Cash on Delivery", desc: "Bayar di tempat saat sampai", img: "https://img.icons8.com/color/512/get-cash.png" }
];

// --- MAIN CHECKOUT PAGE COMPONENT ---
export default function CheckoutPage() {
  
  // --- STATE MANAGEMENT ---
  
  // State Dasar & Keranjang
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  
  // State Pilihan User
  const [selectedCourier, setSelectedCourier] = useState<ShippingCourier | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [address, setAddress] = useState({
    name: "", phone: "", street: "", 
    province: "", city: "", district: "", village: ""
  });

  // State Data Wilayah API
  const [provinces, setProvinces] = useState<ApiRegion[]>([]);
  const [cities, setCities] = useState<ApiRegion[]>([]);
  const [districts, setDistricts] = useState<ApiRegion[]>([]);
  const [villages, setVillages] = useState<ApiRegion[]>([]);

  // State ID Wilayah Terpilih
  const [selectedProvId, setSelectedProvId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedDistId, setSelectedDistId] = useState("");

  // State UI Indikator
  const [apiStatus, setApiStatus] = useState("Memuat data...");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- EFFECTS ---

  // 1. Load Data Keranjang & API Provinsi Awal
  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
      const savedCart = JSON.parse(localStorage.getItem("dapoerdjawa_cart") || "[]");
      setCart(savedCart);
      
      const savedDiscount = localStorage.getItem("dapoerdjawa_discount");
      if (savedDiscount) setDiscount(parseInt(savedDiscount, 10));
    }, 0);

    fetch("https://izzulabadi.github.io/api-wilayah-indonesia-2026/api/provinces.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data dari server");
        return res.json();
      })
      .then((data: ApiRegion[]) => {
        setProvinces(data);
        setApiStatus("");
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setApiError("Koneksi API Terblokir/Bermasalah");
      });
  }, []);

  // 2. Fetch API Kota berdasarkan Provinsi
  useEffect(() => {
    if (selectedProvId) {
      fetch(`https://izzulabadi.github.io/api-wilayah-indonesia-2026/api/regencies/${selectedProvId}.json`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data: ApiRegion[]) => setCities(data))
        .catch((err) => console.error("Gagal load kota:", err));
    }
  }, [selectedProvId]);

  // 3. Fetch API Kecamatan berdasarkan Kota
  useEffect(() => {
    if (selectedCityId) {
      fetch(`https://izzulabadi.github.io/api-wilayah-indonesia-2026/api/districts/${selectedCityId}.json`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data: ApiRegion[]) => setDistricts(data))
        .catch((err) => console.error("Gagal load kecamatan:", err));
    }
  }, [selectedCityId]);

  // 4. Fetch API Desa berdasarkan Kecamatan
  useEffect(() => {
    if (selectedDistId) {
      fetch(`https://izzulabadi.github.io/api-wilayah-indonesia-2026/api/villages/${selectedDistId}.json`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data: ApiRegion[]) => setVillages(data))
        .catch((err) => console.error("Gagal load desa:", err));
    }
  }, [selectedDistId]);


  // --- LOGIC FUNCTIONS (HANDLERS) ---

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = provinces.find((p) => p.id === id)?.name || "";
    setSelectedProvId(id);
    setSelectedCityId(""); setSelectedDistId("");
    setCities([]); setDistricts([]); setVillages([]);
    setAddress({ ...address, province: name, city: "", district: "", village: "" });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = cities.find((c) => c.id === id)?.name || "";
    setSelectedCityId(id);
    setSelectedDistId("");
    setDistricts([]); setVillages([]);
    setAddress({ ...address, city: name, district: "", village: "" });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = districts.find((d) => d.id === id)?.name || "";
    setSelectedDistId(id);
    setVillages([]);
    setAddress({ ...address, district: name, village: "" });
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = villages.find((v) => v.id === id)?.name || "";
    setAddress({ ...address, village: name });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name;
    let value = e.target.value;

    // Filter format input
    if (name === "name") value = value.replace(/[^a-zA-Z\s]/g, "");
    else if (name === "phone") value = value.replace(/\D/g, "");

    setAddress({ ...address, [name]: value });
  };

  const handlePlaceOrder = () => {
    if (!selectedPayment) return alert("Pilih metode pembayaran!");
    setIsLoading(true);
    
    // Simulasi Proses Order API
    setTimeout(() => {
      setIsLoading(false);
      localStorage.removeItem("dapoerdjawa_cart"); 
      localStorage.removeItem("dapoerdjawa_discount");
      setShowSuccessModal(true);
    }, 2000);
  };


  // --- CALCULATIONS ---
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shippingCost = selectedCourier ? selectedCourier.price : 0;
  const grandTotal = Math.max(0, cartTotal - discount) + shippingCost;

  const isShippingValid = address.name && address.phone && address.street && 
                          address.province && address.city && address.district && 
                          address.village && selectedCourier;

  // Hydration Error Prevention
  if (!isMounted) return null;

  return (
    <section className="bg-gray-50 text-gray-800 work-sans leading-normal text-base tracking-normal min-h-screen flex flex-col selection:bg-[#111111] selection:text-white w-full">
      
      {/* --- STYLING Bawaan --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Work+Sans:200,400,600&display=swap'); 
        html { scroll-behavior: smooth; } 
        .work-sans { font-family: 'Work Sans', sans-serif; }
      `}</style>

      <main className="container mx-auto max-w-7xl px-6 pt-32 pb-16 flex-1 w-full">
        
        {/* --- 1. PROGRESS BAR / STEPPER --- */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 text-sm">
            {[ 
              { s: 1, n: "Pengiriman" }, 
              { s: 2, n: "Pembayaran" } 
            ].map((item) => (
              <Fragment key={item.s}>
                <div className={`flex items-center gap-2 ${step >= item.s ? "font-bold text-gray-900" : "text-gray-400"}`}>
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                    step >= item.s ? "border-black bg-black text-white" : "border-gray-300 bg-white text-gray-400"
                  }`}>
                    {item.s}
                  </span>
                  {item.n}
                </div>
                {item.s === 1 && <ChevronRight className="w-5 h-5 text-gray-300" />}
              </Fragment>
            ))}
          </div>
        </div>

        {/* --- 2. LAYOUT KONTEN UTAMA --- */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* === KOLOM KIRI: FORM ALAMAT & METODE === */}
          <div className="w-full lg:w-[65%] space-y-10">
            
            {/* STEP 1: PENGIRIMAN */}
            {step === 1 && (
              <Fragment>
                {/* Form Alamat Lengkap */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <MapPin className="w-7 h-7 text-black" />
                    <h2 className="text-xl font-semibold">Alamat Lengkap Penerima</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    
                    {/* Input Nama & Nomor HP */}
                    {[ 
                      { label: "Nama Lengkap", name: "name", type: "text", holder: "John Doe" },
                      { label: "Nomor HP (WhatsApp)", name: "phone", type: "tel", holder: "08123..." } 
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block text-sm font-semibold mb-1.5">{f.label}</label>
                        <input 
                          name={f.name} 
                          type={f.type} 
                          placeholder={f.holder} 
                          value={address[f.name as keyof typeof address]} 
                          onChange={handleAddressChange} 
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all" 
                        />
                      </div>
                    ))}
                    
                    {/* Input Alamat Textarea */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-1.5">Alamat Jalan, No Rumah, RT/RW</label>
                      <textarea 
                        name="street" 
                        rows={3} 
                        placeholder="Jl. Raya No. 123..." 
                        value={address.street} 
                        onChange={handleAddressChange} 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all resize-none"
                      ></textarea>
                    </div>

                    {/* Select Provinsi */}
                    <div>
                      <label className="flex text-sm font-semibold mb-1.5 justify-between">
                        Provinsi 
                        {apiError && <span className="text-red-500 text-xs italic">{apiError}</span>}
                      </label>
                      <select 
                        value={selectedProvId} 
                        onChange={handleProvinceChange}
                        disabled={provinces.length === 0}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>
                          {provinces.length === 0 ? (apiError ? "Error: Data terblokir" : apiStatus) : "Pilih Provinsi..."}
                        </option>
                        {provinces.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Select Kota/Kabupaten */}
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Kota / Kabupaten</label>
                      <select 
                        value={selectedCityId} 
                        onChange={handleCityChange}
                        disabled={!selectedProvId || cities.length === 0}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>
                          {selectedProvId && cities.length === 0 ? "Memuat Kota..." : "Pilih Kota/Kabupaten..."}
                        </option>
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Select Kecamatan */}
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Kecamatan</label>
                      <select 
                        value={selectedDistId} 
                        onChange={handleDistrictChange}
                        disabled={!selectedCityId || districts.length === 0}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>
                          {selectedCityId && districts.length === 0 ? "Memuat Kecamatan..." : "Pilih Kecamatan..."}
                        </option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Select Desa/Kelurahan */}
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Kelurahan / Desa</label>
                      <select 
                        value={villages.find((v) => v.name === address.village)?.id || ""}
                        onChange={handleVillageChange}
                        disabled={!selectedDistId || villages.length === 0}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>
                          {selectedDistId && villages.length === 0 ? "Memuat Desa..." : "Pilih Kelurahan/Desa..."}
                        </option>
                        {villages.map((v) => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                {/* Pilih Jasa Kurir */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <Truck className="w-7 h-7 text-black" />
                    <h2 className="text-xl font-semibold">Pilih Jasa Kurir</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-75 overflow-y-auto pr-2">
                    {shippingCouriers.map((courier) => (
                      <button 
                        key={courier.id} 
                        onClick={() => setSelectedCourier(courier)} 
                        className={`flex flex-col p-4 border-2 rounded-2xl w-full text-left transition ${
                          selectedCourier?.id === courier.id ? "border-black bg-gray-50/50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3 w-full">
                          
                          {/* Logo Kurir */}
                          <div className="relative w-16 h-10 bg-white border border-gray-200 rounded shrink-0 flex justify-center items-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={courier.img} alt={courier.name} className="w-full h-full object-contain p-1.5" />
                          </div>

                          {/* Radio Dot Selector */}
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0">
                            {selectedCourier?.id === courier.id && <div className="w-2.5 h-2.5 bg-black rounded-full"></div>}
                          </div>
                          
                        </div>
                        <p className="font-bold text-gray-900 pr-2">{courier.name}</p>
                        <p className="text-sm text-gray-500 mb-2 flex-1">{courier.estimasi}</p>
                        <p className="text-lg font-bold text-gray-900 mt-auto">Rp{courier.price.toLocaleString("id-ID")}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </Fragment>
            )}

            {/* STEP 2: PEMBAYARAN */}
            {step === 2 && (
              <Fragment>
                {/* Metode Pembayaran */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <Banknote className="w-7 h-7 text-black" />
                    <h2 className="text-xl font-semibold">Pilih Metode Pembayaran</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 max-h-75 overflow-y-auto pr-2">
                    {paymentMethods.map((method) => (
                      <button 
                        key={method.id} 
                        onClick={() => setSelectedPayment(method)} 
                        className={`flex items-center gap-4 p-4 border-2 rounded-2xl w-full text-left transition ${
                          selectedPayment?.id === method.id ? "border-black bg-gray-50/50 shadow-sm" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {/* Logo Metode Pembayaran */}
                        <div className="relative w-16 h-10 bg-white border border-gray-200 rounded shrink-0 flex justify-center items-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={method.img} alt={method.name} className="w-full h-full object-contain p-1.5" />
                        </div>

                        <div className="flex-1 pr-4">
                          <p className="font-bold text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-500 leading-snug">{method.desc}</p>
                        </div>

                        {/* Radio Dot Selector */}
                        <div className="ml-auto flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded-full shrink-0">
                          {selectedPayment?.id === method.id && <div className="w-2.5 h-2.5 bg-black rounded-full"></div>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Ringkasan Alamat & Pengiriman Di Step Pembayaran */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Informasi Pengiriman</h3>
                  <div className="p-5 bg-gray-50 rounded-xl space-y-1.5 text-gray-600 border border-gray-100">
                    <p className="font-bold text-gray-900">{address.name} ({address.phone})</p>
                    <p className="text-sm leading-relaxed">
                      {address.street}, Kel. {address.village}, Kec. {address.district}, {address.city}, Prov. {address.province}
                    </p>
                    <div className="text-sm font-semibold pt-3 border-t border-gray-200 text-gray-800 mt-3 flex items-center gap-3">
                      <span>Kurir:</span> 
                      {selectedCourier ? (
                         <span className="flex items-center gap-2 bg-white px-2 py-1 border border-gray-200 rounded">
                           <span className="relative w-8 h-4 shrink-0 flex justify-center items-center">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={selectedCourier.img} alt="kurir" className="w-full h-full object-contain" />
                           </span>
                           <span>{selectedCourier.name} (Rp{shippingCost.toLocaleString("id-ID")})</span>
                         </span>
                      ) : (
                        "Belum dipilih"
                      )}
                    </div>
                  </div>
                </div>
              </Fragment>
            )}

          </div>

          {/* === KOLOM KANAN: RINGKASAN PESANAN & CHECKOUT BUTTON === */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-white border border-gray-100 rounded-2xl p-7 sticky top-28 shadow-sm">
              <h2 className="uppercase tracking-wide font-bold text-gray-900 text-lg mb-6 pb-2 border-b border-gray-100">Ringkasan Pesanan</h2>
              
              {/* List Produk Keranjang */}
              <div className="space-y-4 max-h-56 overflow-y-auto mb-6 pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <Image 
                      src={item.img} 
                      alt={item.name} 
                      width={56} 
                      height={56} 
                      className="h-14 w-14 rounded-lg bg-gray-100 object-cover" 
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-gray-500">{item.qty} Pcs x Rp{item.price.toLocaleString("id-ID")}</p>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">Rp{(item.price * item.qty).toLocaleString("id-ID")}</p>
                  </div>
                ))}
              </div>

              {/* Rincian Harga & Diskon */}
              <div className="space-y-4 border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between text-gray-600">
                  Subtotal <span className="text-gray-900 font-semibold">Rp{cartTotal.toLocaleString("id-ID")}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    Voucher Diskon <span>- Rp{discount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  Biaya Pengiriman 
                  <span className={`text-gray-900 font-semibold ${!selectedCourier && "text-gray-400 font-normal italic"}`}>
                    {selectedCourier ? `Rp${shippingCost.toLocaleString("id-ID")}` : "Belum dihitung"}
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center text-gray-900 mb-8 border-t border-gray-200 pt-5">
                <span className="text-lg font-bold">Total Bayar</span>
                <span className="text-2xl font-bold text-gray-900">Rp{grandTotal.toLocaleString("id-ID")}</span>
              </div>

              {/* Tombol Navigasi Action */}
              {step === 1 ? (
                <button 
                  onClick={() => setStep(2)}
                  disabled={!isShippingValid}
                  className="w-full flex items-center justify-center gap-2.5 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition shadow disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Masuk Ke Pembayaran <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isLoading || !selectedPayment}
                  className="w-full flex items-center justify-center gap-3.5 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition shadow disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Fragment>
                      <Loader2 className="w-5 h-5 animate-spin" /> Sedang Memproses...
                    </Fragment>
                  ) : (
                    <Fragment>
                      <CheckCircle className="w-5 h-5" /> Bayar Sekarang
                    </Fragment>
                  )}
                </button>
              )}
              
              {/* Tombol Back */}
              {step === 2 && (
                <button 
                  onClick={() => setStep(1)} 
                  className="w-full text-center mt-5 text-sm text-gray-500 hover:text-black transition"
                >
                  Kembali ke Pengiriman
                </button>
              )}

            </div>
          </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <Footer />

      {/* --- MODAL SUCCESS ORDER --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-100 transform transition-transform animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Terima kasih telah berbelanja di Dapoer Djawa. Pesanan Anda sedang diproses.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-500 mb-1">Total Dibayar</p>
              <p className="text-xl font-bold text-gray-900">Rp{grandTotal.toLocaleString("id-ID")}</p>
            </div>
            <Link 
              href="/mainpage" 
              className="block w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition shadow-md"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}

    </section>
  );
}