"use client";
import React, { useState } from "react";
import { 
  DollarSign, 
  ShoppingBag, 
  Tag, 
  TrendingUp, 
  TrendingDown,
  Truck, 
  Building, 
  CheckCircle, 
  BarChart3, 
  ArrowUpRight 
} from "lucide-react";

// IMPORT FOOTER DARI FILE NAVBAR
import { Footer } from "../components/Navbar";

// --- TYPESCRIPT INTERFACES ---
interface KPI {
  revenue: string;
  revenueTrend: string;
  revenueIsUp: boolean;
  orders: string;
  ordersTrend: string;
  ordersIsUp: boolean;
  aov: string;
  aovText: string;
  discount: string;
  discountText: string;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  percentage: number;
}

interface Logistics {
  name: string;
  count: number;
  type: string;
}

interface Promo {
  code: string;
  applied: number;
  totalDiscount: number;
}

interface Payment {
  name: string;
  share: string;
  count: number;
}

interface AnalyticsData {
  kpi: KPI;
  topProducts: TopProduct[];
  logisticsData: Logistics[];
  promoAnalytics: Promo[];
  paymentData: Payment[];
}

// --- MOCK DATA DINAMIS ---
const analyticsDataRecord: Record<string, AnalyticsData> = {
  "Hari Ini": {
    kpi: {
      revenue: "Rp178.000",
      revenueTrend: "+5% dari kemarin",
      revenueIsUp: true,
      orders: "2 Orders",
      ordersTrend: "Stabil (sama dgn kemarin)",
      ordersIsUp: true,
      aov: "Rp89.000",
      aovText: "Cenderung stabil",
      discount: "-Rp30.000",
      discountText: "Dari 1 transaksi",
    },
    topProducts: [
      { name: "Nastar Classic", sales: 1, revenue: 92000, percentage: 52 },
      { name: "Putri Salju", sales: 1, revenue: 86000, percentage: 48 },
      { name: "Lidah Kucing", sales: 0, revenue: 0, percentage: 0 },
      { name: "Choco Chip Cookies", sales: 0, revenue: 0, percentage: 0 },
      { name: "Bola Bola Rambutan Coklat", sales: 0, revenue: 0, percentage: 0 },
      { name: "Nastar Daun", sales: 0, revenue: 0, percentage: 0 },
      { name: "Vanila Choco Cookies", sales: 0, revenue: 0, percentage: 0 },
      { name: "Cookies Kacang", sales: 0, revenue: 0, percentage: 0 },
    ],
    logisticsData: [
      { name: "GoSend / GrabExpress (Instan)", count: 1, type: "Kurir Lokal" },
      { name: "J&T Express (Reguler)", count: 1, type: "Ekspedisi" },
    ],
    promoAnalytics: [
      { code: "IMLEK 2026", applied: 1, totalDiscount: 30000 },
    ],
    paymentData: [
      { name: "QRIS (GoPay/OVO/Dana/Shopee)", share: "50%", count: 1 },
      { name: "Bank BCA (Virtual Account)", share: "50%", count: 1 },
    ]
  },
  "Minggu Ini": {
    kpi: {
      revenue: "Rp1.204.000",
      revenueTrend: "+5.2% dari minggu lalu",
      revenueIsUp: true,
      orders: "14 Orders",
      ordersTrend: "+2 order dari minggu lalu",
      ordersIsUp: true,
      aov: "Rp86.000",
      aovText: "Cenderung stabil",
      discount: "-Rp120.000",
      discountText: "Dari 3 transaksi",
    },
    topProducts: [
      { name: "Nastar Classic", sales: 5, revenue: 460000, percentage: 38 },
      { name: "Putri Salju", sales: 4, revenue: 344000, percentage: 29 },
      { name: "Lidah Kucing", sales: 3, revenue: 264000, percentage: 22 },
      { name: "Choco Chip Cookies", sales: 2, revenue: 136000, percentage: 11 },
      { name: "Bola Bola Rambutan Coklat", sales: 0, revenue: 0, percentage: 0 },
      { name: "Nastar Daun", sales: 0, revenue: 0, percentage: 0 },
      { name: "Vanila Choco Cookies", sales: 0, revenue: 0, percentage: 0 },
      { name: "Cookies Kacang", sales: 0, revenue: 0, percentage: 0 },
    ],
    logisticsData: [
      { name: "GoSend / GrabExpress (Instan)", count: 5, type: "Kurir Lokal" },
      { name: "J&T Express (Reguler)", count: 4, type: "Ekspedisi" },
      { name: "Maxim Delivery (Hemat)", count: 3, type: "Kurir Lokal" },
      { name: "SiCepat (Reguler)", count: 2, type: "Ekspedisi" },
    ],
    promoAnalytics: [
      { code: "LEBARAN 2026", applied: 2, totalDiscount: 100000 },
      { code: "TAHUN BARU 2026", applied: 1, totalDiscount: 20000 },
    ],
    paymentData: [
      { name: "QRIS (GoPay/OVO/Dana/Shopee)", share: "57%", count: 8 },
      { name: "Bank BCA (Virtual Account)", share: "21%", count: 3 },
      { name: "Cash on Delivery (COD)", share: "21%", count: 3 },
    ]
  },
  "Bulan Ini": {
    kpi: {
      revenue: "Rp5.477.000",
      revenueTrend: "+8.1% dari bulan lalu",
      revenueIsUp: true,
      orders: "50 Orders",
      ordersTrend: "+4.5% dari bulan lalu",
      ordersIsUp: true,
      aov: "Rp109.540",
      aovText: "Meningkat tipis",
      discount: "-Rp380.000",
      discountText: "Dari 10 transaksi",
    },
    topProducts: [
      { name: "Nastar Classic", sales: 20, revenue: 1840000, percentage: 34 },
      { name: "Putri Salju", sales: 15, revenue: 1290000, percentage: 24 },
      { name: "Lidah Kucing", sales: 10, revenue: 880000, percentage: 16 },
      { name: "Choco Chip Cookies", sales: 8, revenue: 544000, percentage: 10 },
      { name: "Bola Bola Rambutan Coklat", sales: 5, revenue: 425000, percentage: 8 },
      { name: "Nastar Daun", sales: 2, revenue: 194000, percentage: 3 },
      { name: "Cookies Kacang", sales: 2, revenue: 160000, percentage: 3 },
      { name: "Vanila Choco Cookies", sales: 2, revenue: 144000, percentage: 2 },
    ],
    logisticsData: [
      { name: "GoSend / GrabExpress (Instan)", count: 20, type: "Kurir Lokal" },
      { name: "Maxim Delivery (Hemat)", count: 10, type: "Kurir Lokal" },
      { name: "J&T Express (Reguler)", count: 10, type: "Ekspedisi" },
      { name: "Shoope Express (Reguler)", count: 5, type: "Ekspedisi" },
      { name: "SiCepat (Reguler)", count: 5, type: "Ekspedisi" }
    ],
    promoAnalytics: [
      { code: "LEBARAN 2026", applied: 5, totalDiscount: 250000 },
      { code: "IMLEK 2026", applied: 3, totalDiscount: 90000 },
      { code: "TAHUN BARU 2026", applied: 2, totalDiscount: 40000 },
    ],
    paymentData: [
      { name: "QRIS (GoPay/OVO/Dana/Shopee)", share: "50%", count: 25 },
      { name: "Bank BCA (Virtual Account)", share: "20%", count: 10 },
      { name: "Cash on Delivery (COD)", share: "20%", count: 10 },
      { name: "Bank Mandiri (Virtual Account)", share: "10%", count: 5 },
    ]
  }
};

// --- MAIN PAGE COMPONENT ---
export default function AnalyticsPage() {
  // --- STATE MANAGEMENT ---
  // State untuk filter data jangka waktu analisis
  const [timeframe, setTimeframe] = useState("Bulan Ini");
  
  // Data yang akan dirender diambil berdasarkan pilihan state timeframe
  const currentData = analyticsDataRecord[timeframe];

  // Fungsi helper render class untuk trend panah up/down
  const getTrendColor = (isUp: boolean) => isUp ? "text-green-600" : "text-red-500";

  return (
    <section className="w-full bg-gray-50 text-gray-800 work-sans leading-normal text-base tracking-normal min-h-screen flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Work+Sans:200,400,600&display=swap'); 
        html { scroll-behavior: smooth; overflow-y: scroll; } 
        .work-sans { font-family: 'Work Sans', sans-serif; }
        
        /* Custom Scrollbar Styling untuk list panjang agar lebih estetik */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>

      <main className="container mx-auto max-w-7xl px-6 pt-32 pb-16 flex-1">
        
        {/* --- 1. PAGE HEADER & FILTER --- */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-1">
              <BarChart3 className="w-4 h-4" /> Owner Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Business Analytics</h1>
          </div>

          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-fit">
            {["Hari Ini", "Minggu Ini", "Bulan Ini"].map((item) => (
              <button 
                key={item}
                onClick={() => setTimeframe(item)}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                  timeframe === item 
                    ? "bg-black text-white shadow-md" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* --- 2. KPI CARDS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card: Total Pendapatan */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Pendapatan</p>
              <h3 className="text-2xl font-extrabold text-gray-900">{currentData.kpi.revenue}</h3>
              <p className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${getTrendColor(currentData.kpi.revenueIsUp)}`}>
                {currentData.kpi.revenueIsUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {currentData.kpi.revenueTrend}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 text-gray-900 shadow-sm">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card: Volume Pesanan */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pesanan Sukses</p>
              <h3 className="text-2xl font-extrabold text-gray-900">{currentData.kpi.orders}</h3>
              <p className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${getTrendColor(currentData.kpi.ordersIsUp)}`}>
                {currentData.kpi.ordersIsUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {currentData.kpi.ordersTrend}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 text-gray-900 shadow-sm">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Card: Rata-rata Nilai Keranjang (AOV) */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rata-rata Keranjang</p>
              <h3 className="text-2xl font-extrabold text-gray-900">{currentData.kpi.aov}</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">{currentData.kpi.aovText}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 text-gray-900 shadow-sm">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>

          {/* Card: Total Penggunaan Promo / Diskon */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Diskon Terklaim</p>
              <h3 className="text-2xl font-extrabold text-red-500">{currentData.kpi.discount}</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">{currentData.kpi.discountText}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 text-gray-900 shadow-sm">
              <Tag className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* --- 3. MIDDLE ROW: PRODUCTS & LOGISTICS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Section: Penjualan Produk Teratas */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2">
            <h2 className="font-bold text-gray-900 text-lg mb-6">Penjualan Produk Teratas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-150">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider w-1/2">Nama Produk</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-1/6">Terjual</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-1/6">Pendapatan</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-1/6">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentData.topProducts.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-sm font-bold text-gray-900">{prod.name}</td>
                      <td className="py-4 text-sm text-gray-600 text-right">{prod.sales}</td>
                      <td className="py-4 text-sm font-semibold text-gray-900 text-right">Rp{prod.revenue.toLocaleString('id-ID')}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-black rounded-full" style={{ width: `${prod.percentage}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-gray-500 w-8">{prod.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Distribusi Kurir / Logistik */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 shrink-0">
              <Truck className="w-5 h-5 text-gray-900" />
              <h2 className="font-bold text-gray-900 text-lg">Distribusi Kurir</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4">
                {currentData.logisticsData.map((courier, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-2xl bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{courier.name}</p>
                      <p className="text-xs text-gray-400 font-medium">{courier.type}</p>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-extrabold text-gray-900 shadow-sm shrink-0 ml-2">
                      {courier.count}x
                    </div>
                  </div>
                ))}
                
                {/* Fallback Jika Tidak Ada Data Kurir */}
                {(currentData.logisticsData.length === 0 || currentData.logisticsData.every((c) => c.count === 0)) && (
                  <div className="text-center py-6 text-xs text-gray-400 font-medium">Belum ada data pengiriman hari ini.</div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* --- 4. BOTTOM ROW: PROMO & PAYMENTS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section: Performa Kode Promo */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Tag className="w-5 h-5 text-gray-900" />
              <h2 className="font-bold text-gray-900 text-lg">Performa Kode Promo</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Kode Diskon</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Digunakan</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Potongan Diberikan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentData.promoAnalytics.map((promo, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-sm font-bold text-gray-900">{promo.code}</td>
                      <td className="py-4 text-sm font-semibold text-gray-600 text-center">{promo.applied}x</td>
                      <td className="py-4 text-sm font-bold text-red-500 text-right">-Rp{promo.totalDiscount.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  
                  {/* Fallback Jika Tidak Ada Promo */}
                  {currentData.promoAnalytics.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-xs text-gray-400 font-medium">Belum ada promo yang diklaim pada periode ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Metode Pembayaran */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Building className="w-5 h-5 text-gray-900" />
              <h2 className="font-bold text-gray-900 text-lg">Metode Pembayaran</h2>
            </div>

            <div className="space-y-4">
              {currentData.paymentData.map((pay, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 font-medium text-gray-600 truncate mr-2">
                    <CheckCircle className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">{pay.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-gray-400 text-xs">{pay.count} Trx</span>
                    <span className="font-bold text-gray-900 bg-gray-50 px-2.5 py-1 border border-gray-100 rounded-lg text-xs">{pay.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* --- FOOTER --- */}
      <Footer />
      
    </section>
  );
}