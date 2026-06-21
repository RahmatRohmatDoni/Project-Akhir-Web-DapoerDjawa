import type { Metadata } from "next";
// 1. Kita ganti Work_Sans menjadi Inter yang jauh lebih rapi dan langsing
import { Inter } from "next/font/google"; 
import "./globals.css";
import Navbar from "./components/Navbar"; 

// 2. Konfigurasi font Inter
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DapoerDjawa",
  description: "Toko Kue Kering DapoerDjawa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 3. Terapkan inter.className */}
      <body className={`${inter.className} font-normal text-gray-800 antialiased`} suppressHydrationWarning>
        <Navbar /> 
        {children}
      </body>
    </html>
  );
}