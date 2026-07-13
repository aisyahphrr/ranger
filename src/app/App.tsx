import React, { useState, useEffect, useRef } from "react";
import {
  Home, Search, ShoppingBag, MessageCircle, User, Clock,
  Wallet, ChevronRight, Star, MapPin, Bell, ArrowLeft, Heart,
  Package, Truck, CheckCircle, X, Plus, Minus, Map,
  TrendingUp, Settings, LogOut, BarChart2, ShoppingCart,
  Tag, ChevronDown, Check, Filter, Wifi, Battery,
  Zap, Award, Send, Gift, HelpCircle, Shield, Phone,
  Navigation2, Edit3, Building2, Bike, Signal, QrCode,
  Banknote, AlertCircle, Camera, Info, Eye, EyeOff,
  Store, RefreshCw, CreditCard, Coffee, Shirt, Wind,
  Mic, SlidersHorizontal, LayoutGrid, Share
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Screen =
  | "splash" | "onboarding" | "login" | "otp" | "role"
  | "c_home" | "c_jelajah" | "c_pesanan" | "c_inbox" | "c_profil"
  | "c_marketplace" | "c_catering" | "c_laundry" | "c_kos"
  | "d_home" | "d_order" | "d_riwayat" | "d_pendapatan" | "d_profil";
type Role = "customer" | "driver";
type Nav = { navigate: (s: Screen) => void };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
const uImg = (id: string, w = 400, h = 300) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Nasi Timbel Komplit", store: "Warung Bu Siti", price: 25000, rating: 4.8, sold: 234, img: uImg("1565299624946-b28f40a0ae38", 300, 300), liked: false, cat: "Makanan" },
  { id: 2, name: "Batik Kawung Premium", store: "Batik Kamojang", price: 185000, rating: 4.9, sold: 87, img: uImg("1558618666-fcd25c85cd64", 300, 300), liked: true, cat: "Fashion" },
  { id: 3, name: "Keripik Singkong Pedas", store: "Cemilan Bu Eni", price: 15000, rating: 4.7, sold: 412, img: uImg("1551782450-a2132b4ba21d", 300, 300), liked: false, cat: "Makanan" },
  { id: 4, name: "Kopi Arabika Gunung", store: "Kopi Nusantara", price: 55000, rating: 4.9, sold: 156, img: uImg("1509042239860-f550ce710b93", 300, 300), liked: false, cat: "Minuman" },
  { id: 5, name: "Sabun Herbal Alami", store: "Herbalis Lokal", price: 22000, rating: 4.6, sold: 89, img: uImg("1607006483224-33f25b2f7fd7", 300, 300), liked: true, cat: "Kesehatan" },
  { id: 6, name: "Tas Anyaman Rotan", store: "Kerajinan Asep", price: 75000, rating: 4.8, sold: 63, img: uImg("1547949003-9792a18a2601", 300, 300), liked: false, cat: "Kerajinan" },
];
const RESTAURANTS = [
  { id: 1, name: "Saung Sunda Asli", cuisine: "Masakan Sunda", rating: 4.9, distance: "0.3 km", minOrder: 25000, img: uImg("1555939594-58d7cb561ad1", 400, 220), tags: ["Halal", "Populer"], open: true },
  { id: 2, name: "Catering Bu Haji Nani", cuisine: "Prasmanan & Nasi Box", rating: 4.7, distance: "1.2 km", minOrder: 50000, img: uImg("1563245372-f21724e3856d", 400, 220), tags: ["Halal", "Min. 10 Pax"], open: true },
  { id: 3, name: "Dapur Asri Kamojang", cuisine: "Masakan Rumahan", rating: 4.8, distance: "0.8 km", minOrder: 20000, img: uImg("1512621776951-a57141f2eefd", 400, 220), tags: ["Halal", "Sehat"], open: false },
];
const LAUNDRIES = [
  { id: 1, name: "Laundry Express Pak Dedi", address: "Jl. Raya Kamojang No. 12", price: 6000, rating: 4.8, open: true, distance: "0.5 km", type: "Ekspres", img: uImg("1517677208171-0bc6725a3e60", 400, 300) },
  { id: 2, name: "Bersih Kilat Laundry", address: "Jl. Geothermal No. 5", price: 7000, rating: 4.6, open: true, distance: "1.1 km", type: "Ekspres", img: uImg("1582734651339-b9a3db27f8a7", 400, 300) },
  { id: 3, name: "Laundry Ibu Rohani", address: "Gg. Mawar No. 3", price: 5500, rating: 4.9, open: true, distance: "0.2 km", type: "Biasa", img: uImg("1545173168988-24b2a5976b91", 400, 300) },
  { id: 4, name: "KlinKlin Laundry", address: "Jl. Puncak No. 9", price: 5000, rating: 4.7, open: true, distance: "1.5 km", type: "Biasa", img: uImg("1583845943265-f938c5fbf967", 400, 300) },
];
const KOS_LIST = [
  { id: 1, name: "Kos Putri Melati", address: "Jl. Aster No. 7, Kamojang", price: 750000, type: "Putri", facilities: ["WiFi", "AC", "KM Dalam", "Parkir"], available: true, img: uImg("1631049307264-da0ec9d70304", 400, 220) },
  { id: 2, name: "Kos Putra Garuda", address: "Jl. Raya Kamojang No. 20", price: 600000, type: "Putra", facilities: ["WiFi", "KM Dalam", "Dapur"], available: true, img: uImg("1555854877-bab0e564b8d5", 400, 220) },
  { id: 3, name: "Kos Campur Harmoni", address: "Jl. Mawar No. 15", price: 900000, type: "Campur", facilities: ["WiFi", "AC", "KM Dalam", "Laundry"], available: false, img: uImg("1502672260266-1c1ef2d93688", 400, 220) },
];
const ORDERS = [
  { id: "RNG001", type: "Marketplace", icon: Store, color: "#1B7A4E", item: "Nasi Timbel Komplit", detail: "Warung Bu Siti", status: "Dikirim", statusColor: "blue", date: "15 Jan 2024", total: 25000 },
  { id: "RNG002", type: "Laundry", icon: Wind, color: "#2196F3", item: "Laundry Express Pak Dedi", detail: "2.5 kg pakaian", status: "Selesai", statusColor: "green", date: "14 Jan 2024", total: 15000 },
  { id: "RNG003", type: "Catering", icon: Coffee, color: "#FF7043", item: "Nasi Box 20 Pax", detail: "Catering Bu Haji Nani", status: "Diproses", statusColor: "orange", date: "13 Jan 2024", total: 500000 },
  { id: "RNG004", type: "Kos", icon: Building2, color: "#9C27B0", item: "Kos Putri Melati", detail: "Jan – Mar 2024", status: "Aktif", statusColor: "green", date: "01 Jan 2024", total: 2250000 },
];
const NOTIFS = [
  { id: 1, type: "order", title: "Pesanan Dikirim 🚴", msg: "Pesanan #RNG001 sedang dalam perjalanan ke lokasi Anda", time: "5 mnt lalu", read: false },
  { id: 2, type: "promo", title: "🎉 Promo Spesial Hari Ini!", msg: "Diskon 20% untuk semua laundry. Gunakan kode BERSIH20", time: "1 jam lalu", read: false },
  { id: 3, type: "info", title: "Fitur Baru: Kos Online", msg: "Temukan kos-kosan di sekitar Kamojang dengan mudah di Rangers App", time: "2 jam lalu", read: true },
  { id: 4, type: "system", title: "Selamat Datang di Rangers 2.0!", msg: "Terima kasih telah bergabung. Nikmati layanan komunitas Kamojang", time: "Kemarin", read: true },
];
const NEWS = [
  { id: 1, title: "PGE Kamojang Dukung 120 UMKM Lokal lewat Dana CSR 2024", cat: "Berita", date: "15 Jan 2024", img: uImg("1560179707-f14e90ef3623", 400, 220) },
  { id: 2, title: "Festival Kuliner Ring 1 Sukses Digelar di Alun-Alun Kamojang", cat: "Komunitas", date: "12 Jan 2024", img: uImg("1555939594-58d7cb561ad1", 400, 220) },
];
const EARNINGS_DATA = [
  { day: "Sen", v: 75000 }, { day: "Sel", v: 92000 }, { day: "Rab", v: 58000 },
  { day: "Kam", v: 110000 }, { day: "Jum", v: 85000 }, { day: "Sab", v: 130000 }, { day: "Min", v: 45000 },
];
const DRIVER_ORDERS = [
  { id: "ORD-001", type: "Marketplace", from: "Warung Bu Siti", to: "Jl. Aster No. 7", dist: "1.2 km", pay: 12000, time: "5 mnt lalu" },
  { id: "ORD-002", type: "Laundry Pickup", from: "Kos Putri Melati", to: "Laundry Bersih Kilat", dist: "0.8 km", pay: 8000, time: "12 mnt lalu" },
];

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
function Stars({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      <Star size={size} className="fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-foreground">{rating}</span>
    </span>
  );
}

function Pill({ children, color = "green" }: { children: React.ReactNode; color?: string }) {
  const cls: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    red: "bg-red-100 text-red-600",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${cls[color] || cls.green}`}>
      {children}
    </span>
  );
}

function StatusBar({ light = false }: { light?: boolean }) {
  const t = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  const c = light ? "text-white" : "text-foreground";
  return (
    <div className={`flex items-center justify-between px-6 h-11 shrink-0 text-xs font-semibold ${c}`}>
      <span>{t}</span>
      <div className="flex items-center gap-1 opacity-90">
        <Signal size={12} />
        <Wifi size={12} />
        <Battery size={14} />
      </div>
    </div>
  );
}

function BackHeader({ title, onBack, right }: { title: string; onBack: () => void; right?: React.ReactNode }) {
  return (
    <div className="flex items-center px-4 h-14 shrink-0 border-b border-border bg-white">
      <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors -ml-1">
        <ArrowLeft size={20} />
      </button>
      <span className="flex-1 text-center text-base font-bold text-foreground -ml-9">{title}</span>
      <div className="w-9 flex justify-end">{right}</div>
    </div>
  );
}

function CustomerNav({ screen, navigate }: { screen: Screen; navigate: (s: Screen) => void }) {
  const items: { id: Screen; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "c_home", label: "Beranda", icon: Home },
    { id: "c_jelajah", label: "Jelajah", icon: Map },
    { id: "c_pesanan", label: "Pesanan", icon: ShoppingBag, badge: 1 },
    { id: "c_inbox", label: "Inbox", icon: MessageCircle, badge: 2 },
    { id: "c_profil", label: "Profil", icon: User },
  ];
  return (
    <div className="flex items-stretch border-t border-border bg-white shrink-0 pb-1">
      {items.map((item) => {
        const active = screen === item.id;
        const Icon = item.icon;
        return (
          <button key={item.id} onClick={() => navigate(item.id)}
            className="flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5 relative">
            <div className={`relative p-1.5 rounded-2xl transition-all ${active ? "bg-secondary" : ""}`}>
              <Icon size={20} className={active ? "text-primary" : "text-muted-foreground"} />
              {item.badge && !active && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DriverNav({ screen, navigate }: { screen: Screen; navigate: (s: Screen) => void }) {
  const items: { id: Screen; label: string; icon: React.ElementType }[] = [
    { id: "d_home", label: "Beranda", icon: Home },
    { id: "d_order", label: "Order", icon: Package },
    { id: "d_riwayat", label: "Riwayat", icon: Clock },
    { id: "d_pendapatan", label: "Pendapatan", icon: Wallet },
    { id: "d_profil", label: "Profil", icon: User },
  ];
  return (
    <div className="flex items-stretch border-t border-border bg-white shrink-0 pb-1">
      {items.map((item) => {
        const active = screen === item.id;
        const Icon = item.icon;
        return (
          <button key={item.id} onClick={() => navigate(item.id)}
            className="flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5">
            <div className={`p-1.5 rounded-2xl transition-all ${active ? "bg-secondary" : ""}`}>
              <Icon size={20} className={active ? "text-primary" : "text-muted-foreground"} />
            </div>
            <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── ONBOARDING ILLUSTRATIONS ─────────────────────────────────────────────────
function IlloUMKM() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="160" cy="120" r="105" fill="#E8F5EE" />
      <ellipse cx="160" cy="215" rx="90" ry="20" fill="#C8E6C9" opacity="0.5" />
      {/* hills */}
      <ellipse cx="95" cy="190" rx="80" ry="50" fill="#66BB6A" />
      <ellipse cx="235" cy="200" rx="75" ry="45" fill="#4CAF50" />
      {/* sun */}
      <circle cx="255" cy="65" r="24" fill="#FFF59D" />
      <circle cx="255" cy="65" r="16" fill="#FFD54F" />
      {/* stall roof */}
      <polygon points="95,95 225,95 215,128 105,128" fill="#FF7043" />
      <line x1="95" y1="95" x2="105" y2="128" stroke="#E64A19" strokeWidth="2" />
      <line x1="225" y1="95" x2="215" y2="128" stroke="#E64A19" strokeWidth="2" />
      {/* pole */}
      <rect x="103" y="128" width="5" height="55" rx="2" fill="#795548" />
      <rect x="212" y="128" width="5" height="55" rx="2" fill="#795548" />
      {/* counter */}
      <rect x="90" y="143" width="140" height="10" rx="5" fill="#BCAAA4" />
      {/* products */}
      <circle cx="118" cy="136" r="8" fill="#FF8F00" />
      <circle cx="140" cy="134" r="10" fill="#F57F17" />
      <circle cx="163" cy="136" r="8" fill="#E65100" />
      <rect x="177" y="129" width="18" height="16" rx="3" fill="#2E7D32" />
      <rect x="199" y="131" width="15" height="14" rx="3" fill="#388E3C" />
      {/* person */}
      <circle cx="158" cy="188" r="13" fill="#FFCC80" />
      <rect x="146" y="201" width="24" height="28" rx="5" fill="#1B7A4E" />
      {/* trees */}
      <ellipse cx="55" cy="165" rx="18" ry="22" fill="#388E3C" />
      <rect x="52" y="182" width="6" height="15" rx="2" fill="#795548" />
      <ellipse cx="275" cy="170" rx="15" ry="18" fill="#43A047" />
      <rect x="272" y="184" width="5" height="12" rx="2" fill="#795548" />
      {/* decorative dots */}
      <circle cx="40" cy="90" r="5" fill="#A5D6A7" opacity="0.7" />
      <circle cx="290" cy="110" r="7" fill="#C8E6C9" opacity="0.7" />
      <circle cx="70" cy="60" r="4" fill="#DCEDC8" opacity="0.8" />
    </svg>
  );
}

function IlloServices() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="160" cy="120" r="105" fill="#EDE7F6" />
      {/* phone */}
      <rect x="130" y="70" width="60" height="105" rx="12" fill="white" stroke="#1B7A4E" strokeWidth="2.5" />
      <rect x="140" y="82" width="40" height="65" rx="6" fill="#E8F5EE" />
      <circle cx="160" cy="163" r="4" fill="#1B7A4E" opacity="0.4" />
      {/* 4 service cards */}
      {/* Marketplace TL */}
      <rect x="38" y="42" width="58" height="58" rx="16" fill="#1B7A4E" />
      <rect x="50" y="63" width="34" height="4" rx="2" fill="white" opacity="0.5" />
      <rect x="54" y="71" width="26" height="4" rx="2" fill="white" opacity="0.5" />
      <circle cx="67" cy="57" r="9" fill="white" opacity="0.3" />
      <text x="56" y="61" fontSize="14" fill="white">🛒</text>
      <text x="44" y="112" fontSize="8" fill="#1B7A4E" fontWeight="600">Marketplace</text>
      {/* Catering TR */}
      <rect x="224" y="42" width="58" height="58" rx="16" fill="#FF7043" />
      <text x="242" y="77" fontSize="22" fill="white">🍱</text>
      <text x="232" y="112" fontSize="8" fill="#FF7043" fontWeight="600">Catering</text>
      {/* Laundry BL */}
      <rect x="38" y="148" width="58" height="58" rx="16" fill="#2196F3" />
      <text x="54" y="183" fontSize="22" fill="white">👕</text>
      <text x="46" y="218" fontSize="8" fill="#2196F3" fontWeight="600">Laundry</text>
      {/* Kos BR */}
      <rect x="224" y="148" width="58" height="58" rx="16" fill="#FF9800" />
      <text x="240" y="183" fontSize="22" fill="white">🏠</text>
      <text x="236" y="218" fontSize="8" fill="#FF9800" fontWeight="600">Kos</text>
      {/* connection lines */}
      <line x1="96" y1="71" x2="130" y2="105" stroke="#1B7A4E" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
      <line x1="224" y1="71" x2="190" y2="105" stroke="#FF7043" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
      <line x1="96" y1="177" x2="130" y2="145" stroke="#2196F3" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
      <line x1="224" y1="177" x2="190" y2="145" stroke="#FF9800" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" />
      {/* dots */}
      <circle cx="160" cy="25" r="6" fill="#CE93D8" opacity="0.5" />
      <circle cx="25" cy="130" r="8" fill="#B39DDB" opacity="0.4" />
      <circle cx="305" cy="100" r="6" fill="#FFCC80" opacity="0.6" />
    </svg>
  );
}

function IlloDriver() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="160" cy="120" r="105" fill="#FFF3E0" />
      {/* road */}
      <ellipse cx="160" cy="200" rx="110" ry="18" fill="#E0E0E0" />
      <rect x="50" y="195" width="220" height="8" rx="4" fill="#BDBDBD" />
      <rect x="95" y="196" width="30" height="4" rx="2" fill="white" />
      <rect x="155" y="196" width="30" height="4" rx="2" fill="white" />
      <rect x="215" y="196" width="20" height="4" rx="2" fill="white" />
      {/* motorbike body */}
      <ellipse cx="160" cy="178" rx="55" ry="16" fill="#FF7043" />
      <rect x="118" y="165" width="85" height="22" rx="10" fill="#FF5722" />
      {/* wheels */}
      <circle cx="105" cy="192" r="17" fill="#424242" />
      <circle cx="105" cy="192" r="10" fill="#616161" />
      <circle cx="105" cy="192" r="4" fill="#9E9E9E" />
      <circle cx="218" cy="192" r="17" fill="#424242" />
      <circle cx="218" cy="192" r="10" fill="#616161" />
      <circle cx="218" cy="192" r="4" fill="#9E9E9E" />
      {/* rider */}
      <circle cx="163" cy="145" r="16" fill="#FFCC80" />
      {/* helmet */}
      <ellipse cx="163" cy="140" rx="16" ry="14" fill="#1B7A4E" />
      <rect x="150" y="148" width="26" height="10" rx="3" fill="#388E3C" />
      <rect x="153" y="143" width="20" height="8" rx="3" fill="#81C784" opacity="0.5" />
      {/* body/jacket */}
      <rect x="148" y="158" width="30" height="22" rx="6" fill="#1B7A4E" />
      {/* package on back */}
      <rect x="174" y="155" width="26" height="22" rx="6" fill="#FFB74D" />
      <rect x="177" y="158" width="20" height="16" rx="4" fill="#FF9800" />
      <rect x="185" y="155" width="4" height="22" rx="2" fill="#F57C00" />
      <rect x="174" y="164" width="26" height="4" rx="2" fill="#F57C00" />
      {/* coins / earnings */}
      <circle cx="75" cy="95" r="16" fill="#FFD54F" />
      <circle cx="75" cy="95" r="11" fill="#FFC107" />
      <text x="69" y="100" fontSize="12" fill="#E65100" fontWeight="800">Rp</text>
      <circle cx="260" cy="75" r="13" fill="#FFD54F" />
      <circle cx="260" cy="75" r="9" fill="#FFC107" />
      <text x="255" y="79" fontSize="10" fill="#E65100" fontWeight="800">Rp</text>
      <circle cx="240" cy="120" r="10" fill="#FFE082" />
      <circle cx="240" cy="120" r="7" fill="#FFD54F" />
      {/* stars */}
      <text x="86" y="58" fontSize="14" fill="#FFD54F">★</text>
      <text x="65" y="50" fontSize="10" fill="#FFD54F">★</text>
      <text x="100" y="44" fontSize="11" fill="#FFD54F">★</text>
      {/* speed lines */}
      <line x1="65" y1="165" x2="40" y2="165" stroke="#FF7043" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="60" y1="175" x2="30" y2="175" stroke="#FF7043" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="68" y1="185" x2="45" y2="185" stroke="#FF7043" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

// ─── SCREENS: AUTH FLOW ───────────────────────────────────────────────────────
function SplashScreen() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0D5C36] to-[#1B7A4E] items-center justify-center gap-4 relative overflow-hidden">
      {/* decorative circles */}
      <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute bottom-[-80px] left-[-40px] w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute top-1/3 left-[-30px] w-32 h-32 rounded-full bg-white/5" />
      {/* logo */}
      <div className="w-24 h-24 rounded-[28px] bg-white flex items-center justify-center shadow-2xl">
        <svg viewBox="0 0 80 80" className="w-16 h-16">
          <circle cx="40" cy="40" r="35" fill="#E8F5EE" />
          <path d="M20 50 Q40 20 60 50" stroke="#1B7A4E" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M28 50 Q40 28 52 50" stroke="#4CAF50" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="48" r="6" fill="#1B7A4E" />
          <path d="M35 35 L40 25 L45 35" fill="#FF7043" />
        </svg>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">Rangers App</h1>
        <div className="inline-flex items-center gap-1.5 mt-1.5">
          <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">2.0</span>
          <span className="text-green-200 text-sm">by PGE Kamojang</span>
        </div>
      </div>
      <p className="text-green-200 text-sm text-center mt-2 px-8 leading-relaxed">
        Untuk Komunitas, Dari Komunitas
      </p>
      {/* loading */}
      <div className="absolute bottom-16 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

const SLIDES = [
  { title: "Belanja Lokal,\nDukung UMKM", desc: "Temukan produk UMKM terbaik dari komunitas Ring 1–3 Kamojang. Kualitas lokal, harga bersahabat.", Illo: IlloUMKM },
  { title: "Semua Layanan\ndi Satu Tempat", desc: "Marketplace, catering, laundry, dan kos tersedia dalam satu aplikasi. Praktis dan mudah!", Illo: IlloServices },
  { title: "Bergabung &\nBerpenghasilan", desc: "Daftar sebagai driver Rangers dan mulai berpenghasilan dari komunitas Anda sendiri.", Illo: IlloDriver },
];

function OnboardingScreen({ navigate }: Nav) {
  const [slide, setSlide] = useState(0);
  const { title, desc, Illo } = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-end p-4">
        <button onClick={() => navigate("login")} className="text-muted-foreground text-sm font-semibold px-3 py-1">
          Lewati
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center px-6">
        <div className="w-full max-w-xs h-56 mb-6">
          <Illo />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground text-center whitespace-pre-line leading-tight mb-3">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm text-center leading-relaxed max-w-xs">
          {desc}
        </p>
      </div>
      <div className="px-6 pb-8 flex flex-col gap-4">
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-300 ${i === slide ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-gray-200"}`} />
          ))}
        </div>
        <button
          onClick={() => isLast ? navigate("login") : setSlide(slide + 1)}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base"
        >
          {isLast ? "Mulai Sekarang" : "Lanjut"}
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ navigate }: Nav) {
  const [phone, setPhone] = useState("");
  const [tab, setTab] = useState<"login" | "daftar">("login");
  const [name, setName] = useState("");
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="bg-gradient-to-b from-[#0D5C36] to-[#1B7A4E] pt-12 pb-10 px-6 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-[20px] bg-white flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 80 80" className="w-12 h-12">
            <circle cx="40" cy="40" r="35" fill="#E8F5EE" />
            <path d="M20 50 Q40 20 60 50" stroke="#1B7A4E" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M28 50 Q40 28 52 50" stroke="#4CAF50" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="48" r="6" fill="#1B7A4E" />
            <path d="M35 35 L40 25 L45 35" fill="#FF7043" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-white font-extrabold text-xl">Rangers App 2.0</p>
          <p className="text-green-200 text-xs mt-0.5">PGE Kamojang Community</p>
        </div>
      </div>

      <div className="flex mx-6 mt-6 bg-muted rounded-2xl p-1 gap-1">
        {(["login", "daftar"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t ? "bg-white shadow text-primary" : "text-muted-foreground"}`}>
            {t === "login" ? "Masuk" : "Daftar"}
          </button>
        ))}
      </div>

      <div className="px-6 mt-6 flex flex-col gap-4">
        {tab === "daftar" && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Nama Lengkap</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-3.5 rounded-2xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Nomor HP</label>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 px-3 py-3.5 bg-muted rounded-2xl text-sm font-semibold text-muted-foreground shrink-0">
              🇮🇩 +62
            </div>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="812-xxxx-xxxx"
              type="tel" className="flex-1 px-4 py-3.5 rounded-2xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
        </div>
        {tab === "daftar" && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Alamat</label>
            <input placeholder="Kampung / Desa di Ring 1-3 Kamojang"
              className="w-full px-4 py-3.5 rounded-2xl bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
        )}
        <button onClick={() => navigate("otp")}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base mt-1">
          {tab === "login" ? "Kirim Kode OTP" : "Daftar Sekarang"}
        </button>
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">atau</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <button className="w-full py-3.5 rounded-2xl border border-border flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
          <span className="text-lg">🔵</span> Lanjutkan dengan Google
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground px-8 pb-8 mt-6 leading-relaxed">
        Dengan masuk, Anda menyetujui <span className="text-primary font-semibold">Syarat & Ketentuan</span> serta <span className="text-primary font-semibold">Kebijakan Privasi</span> Rangers App.
      </p>
    </div>
  );
}

function OTPScreen({ navigate }: Nav) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const id = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const handleDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (!v && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <div className="px-6 pt-2">
        <button onClick={() => navigate("login")} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted -ml-1">
          <ArrowLeft size={20} />
        </button>
      </div>
      <div className="flex-1 px-6 pt-8 flex flex-col">
        <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center mb-6">
          <Phone size={28} className="text-primary" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground mb-2">Verifikasi OTP</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Kode 6 digit telah dikirim ke <span className="font-semibold text-foreground">+62 812-xxxx-xxxx</span>
        </p>
        <div className="flex gap-3 mb-6">
          {digits.map((d, i) => (
            <input key={i} ref={el => { refs.current[i] = el; }} value={d}
              onChange={e => handleDigit(i, e.target.value)} maxLength={1} type="tel"
              className="flex-1 h-14 rounded-2xl bg-muted text-center text-xl font-bold outline-none focus:ring-2 focus:ring-primary/40 focus:bg-secondary transition-all" />
          ))}
        </div>
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm text-muted-foreground">
            {timer > 0 ? `Kirim ulang dalam ${timer}s` : "Tidak terima kode?"}
          </span>
          {timer === 0 && (
            <button onClick={() => setTimer(59)} className="text-sm font-bold text-primary">Kirim Ulang</button>
          )}
        </div>
        <button onClick={() => navigate("role")}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base">
          Verifikasi
        </button>
      </div>
    </div>
  );
}

function RoleScreen({ navigate, setRole }: Nav & { setRole: (r: Role) => void }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-extrabold text-foreground">Saya ingin...</h2>
          <p className="text-muted-foreground text-sm mt-2">Pilih peran Anda di Rangers App</p>
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={() => { setRole("customer"); navigate("c_home"); }}
            className="p-6 rounded-3xl border-2 border-primary bg-secondary flex items-center gap-5 text-left group hover:bg-primary/10 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0">
              <ShoppingBag size={28} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-lg text-foreground">Memesan Layanan</p>
              <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">Belanja produk UMKM, pesan catering, laundry, & kos</p>
            </div>
          </button>
          <button onClick={() => { setRole("driver"); navigate("d_home"); }}
            className="p-6 rounded-3xl border-2 border-border flex items-center gap-5 text-left hover:border-accent hover:bg-orange-50 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shrink-0">
              <Bike size={28} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-lg text-foreground">Menjadi Driver</p>
              <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">Antar pesanan & raih penghasilan dari komunitas Kamojang</p>
            </div>
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8 px-4 leading-relaxed">
          Anda dapat beralih peran kapan saja melalui menu Profil
        </p>
      </div>
    </div>
  );
}

// ─── CUSTOMER HOME ────────────────────────────────────────────────────────────
function CustomerHome({ navigate }: Nav) {
  const [liked, setLiked] = useState<Set<number>>(new Set([2, 5]));
  const toggleLike = (id: number) => setLiked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const services = [
    { label: "Marketplace", icon: Store, color: "#1B7A4E", bg: "#E8F5EE", screen: "c_marketplace" as Screen },
    { label: "Catering", icon: Coffee, color: "#FF7043", bg: "#FFF3E0", screen: "c_catering" as Screen },
    { label: "Laundry", icon: Wind, color: "#2196F3", bg: "#E3F2FD", screen: "c_laundry" as Screen },
    { label: "Kos", icon: Building2, color: "#9C27B0", bg: "#F3E5F5", screen: "c_kos" as Screen },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-b from-[#0D5C36] to-[#1B7A4E] pt-0 pb-6 shrink-0">
        <StatusBar light />
        <div className="px-5 flex items-start justify-between">
          <div>
            <p className="text-green-200 text-sm">Halo, selamat datang 👋</p>
            <h2 className="text-white font-extrabold text-xl">Budi Santoso</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-green-300" />
              <span className="text-green-200 text-xs">Kamojang, Kab. Garut</span>
            </div>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mt-1">
            <Bell size={20} className="text-white" />
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-accent rounded-full border border-[#1B7A4E]" />
          </button>
        </div>
        {/* search */}
        <button onClick={() => navigate("c_jelajah")} className="mx-5 mt-4 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 w-[calc(100%-40px)]">
          <Search size={16} className="text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Cari layanan atau produk...</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#F7FAF8]" style={{ scrollbarWidth: "none" }}>
        {/* promo banner */}
        <div className="mx-4 mt-4 rounded-3xl overflow-hidden relative h-36 bg-gradient-to-r from-[#0D5C36] to-[#2E7D32]">
          <img src={uImg("1560179707-f14e90ef3623", 600, 280)} alt="Promo" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="relative p-5">
            <Pill color="orange">🔥 Promo Hari Ini</Pill>
            <h3 className="text-white font-extrabold text-lg mt-2 leading-tight">Diskon 20% Laundry<br/>untuk Member Baru!</h3>
            <p className="text-green-200 text-xs mt-1">Kode: <span className="font-bold text-white">BERSIH20</span></p>
          </div>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/10 rounded-tl-[60px]" />
          <Zap size={32} className="absolute right-5 bottom-5 text-yellow-300 opacity-60" />
        </div>

        {/* services */}
        <div className="px-4 mt-5">
          <h3 className="font-bold text-foreground text-sm mb-3">Layanan Utama</h3>
          <div className="grid grid-cols-4 gap-3">
            {services.map(({ label, icon: Icon, color, bg, screen }) => (
              <button key={label} onClick={() => navigate(screen)} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: bg }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <span className="text-xs font-semibold text-foreground text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular products */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="font-bold text-foreground text-sm">Produk Terpopuler</h3>
            <button onClick={() => navigate("c_marketplace")} className="text-primary text-xs font-bold">Lihat Semua</button>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4">
            {PRODUCTS.slice(0, 4).map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm relative">
                <img src={p.img} alt={p.name} className="w-full h-28 object-cover bg-muted" />
                <button onClick={() => toggleLike(p.id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                  <Heart size={13} className={liked.has(p.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                </button>
                <div className="p-3">
                  <p className="text-[10px] text-muted-foreground truncate">{p.store}</p>
                  <p className="text-xs font-bold text-foreground leading-tight mt-0.5 line-clamp-2">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Stars rating={p.rating} />
                    <span className="text-[10px] text-muted-foreground">{p.sold} terjual</span>
                  </div>
                  <p className="text-primary font-extrabold text-sm mt-1">{rp(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby laundry */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="font-bold text-foreground text-sm">Laundry Terdekat</h3>
            <button onClick={() => navigate("c_laundry")} className="text-primary text-xs font-bold">Lihat Semua</button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
            {LAUNDRIES.map((l) => (
              <button key={l.id} onClick={() => navigate("c_laundry")}
                className="bg-white rounded-2xl p-4 shadow-sm shrink-0 w-48 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                  <Wind size={18} className="text-blue-600" />
                </div>
                <p className="text-xs font-bold text-foreground leading-tight">{l.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{l.distance}</p>
                <div className="flex items-center justify-between mt-2">
                  <Stars rating={l.rating} />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.open ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {l.open ? "Buka" : "Tutup"}
                  </span>
                </div>
                <p className="text-primary font-bold text-xs mt-1.5">{rp(l.price)}/kg</p>
              </button>
            ))}
          </div>
        </div>

        {/* Community News */}
        <div className="mt-6 pb-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="font-bold text-foreground text-sm">Berita Komunitas</h3>
            <button className="text-primary text-xs font-bold">Lihat Semua</button>
          </div>
          <div className="flex flex-col gap-3 px-4">
            {NEWS.map((n) => (
              <div key={n.id} className="bg-white rounded-2xl overflow-hidden shadow-sm flex">
                <img src={n.img} alt={n.title} className="w-24 h-20 object-cover shrink-0 bg-muted" />
                <div className="p-3 flex flex-col justify-center">
                  <Pill color="green">{n.cat}</Pill>
                  <p className="text-xs font-bold text-foreground mt-1.5 leading-tight line-clamp-2">{n.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CUSTOMER SUB-SCREENS ─────────────────────────────────────────────────────
const CATS = ["Semua", "Makanan", "Minuman", "Fashion", "Kesehatan", "Kerajinan"];

function MarketplaceScreen({ navigate }: Nav) {
  const [cat, setCat] = useState("Semua");
  const [liked, setLiked] = useState<Set<number>>(new Set([2, 5]));
  const toggleLike = (id: number) => setLiked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const filtered = cat === "Semua" ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-white shrink-0">
        <StatusBar />
        <BackHeader title="Marketplace UMKM" onBack={() => navigate("c_home")}
          right={<button onClick={() => navigate("c_pesanan")} className="relative"><ShoppingCart size={20} /><span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span></button>} />
        <div className="px-4 py-3 flex items-center gap-2 bg-muted mx-4 mb-3 rounded-2xl">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input placeholder="Cari produk UMKM..." className="flex-1 bg-transparent text-sm outline-none" />
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: "none" }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all ${cat === c ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4" style={{ scrollbarWidth: "none" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <ShoppingBag size={40} className="text-muted-foreground opacity-40" />
            <p className="text-muted-foreground text-sm">Belum ada produk di kategori ini</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm relative">
                <img src={p.img} alt={p.name} className="w-full h-32 object-cover bg-muted" />
                <button onClick={() => toggleLike(p.id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                  <Heart size={13} className={liked.has(p.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                </button>
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Store size={10} className="text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground truncate">{p.store}</p>
                  </div>
                  <p className="text-xs font-bold text-foreground leading-tight line-clamp-2">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Stars rating={p.rating} />
                    <span className="text-[10px] text-muted-foreground">{p.sold}x</span>
                  </div>
                  <p className="text-primary font-extrabold text-sm mt-1">{rp(p.price)}</p>
                  <button className="w-full mt-2 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-xl">
                    + Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CateringScreen({ navigate }: Nav) {
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-white shrink-0">
        <StatusBar />
        <BackHeader title="Catering" onBack={() => navigate("c_home")} />
        <div className="mx-4 mb-3 flex items-center gap-2 bg-muted px-4 py-3 rounded-2xl">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input placeholder="Cari restoran atau menu..." className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>
      {/* promo */}
      <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-4 flex items-center gap-4 shrink-0">
        <div>
          <p className="text-white font-extrabold text-sm">Pesan Catering Sekarang!</p>
          <p className="text-orange-100 text-xs mt-0.5">Min. 10 pax, antar ke lokasi Anda</p>
        </div>
        <Coffee size={32} className="text-white/80 shrink-0" />
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        {RESTAURANTS.map(r => (
          <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-32">
              <img src={r.img} alt={r.name} className="w-full h-full object-cover bg-muted" />
              <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${r.open ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                {r.open ? "● Buka" : "● Tutup"}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-foreground text-sm">{r.name}</h4>
                  <p className="text-muted-foreground text-xs mt-0.5">{r.cuisine}</p>
                </div>
                <Stars rating={r.rating} />
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {r.tags.map(t => <Pill key={t} color="orange">{t}</Pill>)}
                <Pill color="gray">📍 {r.distance}</Pill>
                <Pill color="gray">Min {rp(r.minOrder)}</Pill>
              </div>
              <button className={`w-full mt-3 py-2.5 rounded-xl text-sm font-bold ${r.open ? "bg-primary text-white" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
                {r.open ? "Pesan Sekarang" : "Sedang Tutup"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LaundryScreen({ navigate }: Nav) {
  const [filter, setFilter] = useState("Semua");
  const [selectedLaundry, setSelectedLaundry] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [chatLaundry, setChatLaundry] = useState<any>(null);
  const [trackingStep, setTrackingStep] = useState(0);

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const types = ["Semua", "Biasa", "Ekspres"];
  const filtered = LAUNDRIES.filter(l => {
    const matchType = filter === "Semua" || l.type === filter;
    const matchSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  useEffect(() => {
    if (trackingStep > 0 && trackingStep < 5) {
      const t = setTimeout(() => {
        setTrackingStep(prev => prev + 1);
      }, 3000); // 3 seconds per step for demo purposes
      return () => clearTimeout(t);
    }
  }, [trackingStep]);

  useEffect(() => {
    if (chatLaundry) {
      setChatMessages([
        { id: 1, sender: "laundry", text: `Halo! Ada yang bisa kami bantu seputar layanan ${chatLaundry.name}?`, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }
      ]);
    }
  }, [chatLaundry]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { id: Date.now(), sender: "user", text: chatInput, time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const replyMsg = { id: Date.now() + 1, sender: "laundry", text: "Baik kak, pesanannya sudah kami terima dan akan segera diproses ya! Mohon ditunggu kelanjutannya di aplikasi.", time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) };
      setChatMessages(prev => [...prev, replyMsg]);
    }, 1200);
  };

  const handlePesan = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setTrackingStep(1);
    }, 400); // Wait for drawer animation to finish
  };

  if (chatLaundry) {
    return (
      <div className="flex flex-col h-full bg-[#F7FAF8] relative overflow-hidden">
        <div className="bg-white shrink-0 z-10 shadow-sm relative pb-2 rounded-b-3xl">
          <StatusBar />
          <BackHeader 
            title={chatLaundry.name} 
            onBack={() => setChatLaundry(null)} 
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
          <div className="self-center bg-gray-200 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full mt-2">Hari Ini</div>
          
          <AnimatePresence initial={false}>
            {chatMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex gap-3 max-w-[85%] mt-1 ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
              >
                {msg.sender === "laundry" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Store size={14} className="text-blue-600" />
                  </div>
                )}
                <div className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender === "user" ? "bg-primary text-white rounded-tr-none" : "bg-white text-gray-700 rounded-tl-none border border-gray-50"}`}>
                  {msg.text}
                  <div className={`text-[9px] mt-1.5 text-right ${msg.sender === "user" ? "text-green-200" : "text-gray-400"}`}>{msg.time}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-white p-4 border-t border-gray-100 flex gap-3 items-center z-10 pb-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <input 
            type="text" 
            placeholder="Ketik pesan..." 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-gray-400" 
          />
          <button onClick={handleSendChat} className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shrink-0 active:scale-95 shadow-lg shadow-green-500/30 transition-transform">
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    );
  }

  if (trackingStep > 0) {
    const steps = [
      { id: 1, title: "Menunggu Driver", desc: "Driver sedang menuju ke lokasi Anda", icon: Bike, color: "orange" },
      { id: 2, title: "Proses Pencucian", desc: "Pakaian Anda sedang dicuci dengan sepenuh hati", icon: Wind, color: "blue" },
      { id: 3, title: "Selesai Dicuci", desc: "Menunggu kurir untuk pengantaran", icon: Package, color: "purple" },
      { id: 4, title: "Pengantaran", desc: "Driver sedang menuju ke lokasi Anda", icon: Truck, color: "orange" },
      { id: 5, title: "Pesanan Selesai", desc: "Pakaian bersih siap digunakan!", icon: CheckCircle, color: "green" },
    ];
    return (
      <div className="flex flex-col h-full bg-[#F7FAF8] relative overflow-hidden">
        <div className="bg-white shrink-0 z-10 shadow-sm relative pb-2 rounded-b-3xl">
          <StatusBar />
          <BackHeader title="Tracking Pesanan" onBack={() => { setTrackingStep(0); setSelectedLaundry(null); }} />
        </div>
        <div className="flex-1 overflow-y-auto p-6 relative" style={{ scrollbarWidth: "none" }}>
          <div className="bg-white rounded-[24px] shadow-sm p-6 mb-6">
            <h2 className="font-extrabold text-xl mb-1 text-center text-foreground">Pesanan {selectedLaundry?.name}</h2>
            <p className="text-muted-foreground text-sm text-center mb-6">Estimasi Selesai: Besok, 10:00</p>
            <div className="relative mt-2">
              <div className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-gray-200 z-0" />
              {steps.map((s, idx) => {
                const isActive = trackingStep === s.id;
                const isPassed = trackingStep > s.id;
                const Icon = s.icon;
                return (
                  <div key={s.id} className="relative flex gap-4 mb-8 last:mb-0 z-10">
                    <div className="relative z-10 flex flex-col items-center shrink-0">
                      <div className="bg-white py-1">
                        <motion.div 
                          initial={{ scale: 0.8 }}
                          animate={{ scale: isActive ? 1.2 : 1, backgroundColor: isPassed || isActive ? "#1B7A4E" : "#E5E7EB" }}
                          className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm relative z-10"
                        >
                           {isPassed ? <Check size={14} className="text-white" /> : <span className="text-white text-[11px] font-bold">{s.id}</span>}
                        </motion.div>
                      </div>
                    </div>
                    <div className={`flex-1 pt-1.5 ${isActive ? 'opacity-100' : isPassed ? 'opacity-70' : 'opacity-40'} transition-opacity duration-500`}>
                      <h4 className={`font-bold text-sm ${isActive ? 'text-primary' : 'text-gray-800'}`}>{s.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 bg-green-50 rounded-xl p-3 flex items-center gap-3 overflow-hidden border border-green-100/50">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                              <Icon size={20} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-green-900">Status Aktif</p>
                              <p className="text-[10px] text-green-700">Pembaruan otomatis...</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <AnimatePresence>
            {trackingStep === 5 && (
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => { setTrackingStep(0); setSelectedLaundry(null); }} className="w-full bg-primary text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                Kembali ke Beranda
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Header */}
      <div className="bg-white shrink-0 z-20 sticky top-0 pt-2 pb-2">
        <StatusBar />
        <div className="px-5 flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("c_home")} className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-colors shrink-0">
              <ArrowLeft size={20} className="text-gray-800" />
            </button>
            <div>
              <h1 className="text-[20px] font-black text-gray-900 tracking-tight leading-tight">Laundry</h1>
              <p className="text-[11px] font-semibold text-gray-400">Temukan laundry terbaik di sekitarmu</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Search size={18} className="text-gray-700" />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors relative">
              <SlidersHorizontal size={18} className="text-gray-700" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-5 mt-4">
          <div className="relative flex items-center rounded-2xl bg-white border border-gray-200 overflow-hidden focus-within:border-primary transition-colors">
            <Search size={18} className="text-gray-400 absolute left-4" />
            <input 
              type="text" 
              placeholder="Cari laundry terdekat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 pl-11 pr-12 bg-transparent text-[13px] font-semibold text-gray-800 focus:outline-none placeholder:text-gray-400" 
            />
            <button className="absolute right-4 text-primary hover:text-green-700 transition-colors">
              <Mic size={18} />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-5 mt-4 flex gap-2.5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          <button 
            onClick={() => setFilter("Semua")}
            className={`flex items-center gap-2 px-4 py-2 rounded-[14px] text-[12px] font-bold transition-all shrink-0 ${filter === "Semua" ? "bg-primary text-white shadow-md shadow-green-500/20" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <LayoutGrid size={14} className={filter === "Semua" ? "text-white" : "text-gray-400"} /> Semua
          </button>
          <button 
            onClick={() => setFilter("Biasa")}
            className={`flex items-center gap-2 px-4 py-2 rounded-[14px] text-[12px] font-bold transition-all shrink-0 ${filter === "Biasa" ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <Shirt size={14} className={filter === "Biasa" ? "text-blue-500" : "text-blue-500"} /> Biasa
          </button>
          <button 
            onClick={() => setFilter("Ekspres")}
            className={`flex items-center gap-2 px-4 py-2 rounded-[14px] text-[12px] font-bold transition-all shrink-0 ${filter === "Ekspres" ? "bg-orange-50 text-orange-600 border border-orange-200" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            <Zap size={14} className={filter === "Ekspres" ? "text-orange-500" : "text-orange-500"} /> Ekspres
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-12 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
        {/* Promo Banner */}
        <div className="bg-green-50 rounded-[20px] p-4 flex items-center justify-between relative overflow-hidden mb-2 border border-green-100">
          <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10">
            <X size={16} />
          </button>
          <div className="z-10 w-2/3">
            <h3 className="font-extrabold text-primary text-[14px] mb-1">Gratis Antar Jemput</h3>
            <p className="text-[11px] font-semibold text-gray-600 mb-3">Untuk pesanan di atas Rp30.000</p>
            <button className="text-[11px] font-black text-primary flex items-center gap-1 hover:underline">
              Lihat detail <ChevronRight size={12} />
            </button>
          </div>
          <div className="absolute -right-4 bottom-0 h-24 opacity-80 pointer-events-none drop-shadow-sm">
            {/* Menggunakan emoji 🛵 sebagai pengganti sementara */}
            <div className="text-[60px]">🛵</div>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 opacity-60">
              <Search size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold text-sm">Tidak ada laundry ditemukan</p>
            </motion.div>
          ) : filtered.map(l => (
            <motion.div 
              key={l.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedLaundry(l); setIsDrawerOpen(true); }}
              className="bg-white rounded-[20px] p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex gap-3 cursor-pointer group"
            >
              {/* Left Image */}
              <div className="w-[110px] h-[130px] shrink-0 bg-gray-100 rounded-[14px] relative overflow-hidden">
                <img src={l.img} alt={l.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badge Ekspres on Image */}
                {l.type === "Ekspres" && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    <Zap size={8} className="fill-white" />
                    <span className="text-[8px] font-black tracking-wide">EKSPRES</span>
                  </div>
                )}
                {l.type === "Biasa" && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    <Shirt size={8} className="fill-white" />
                    <span className="text-[8px] font-black tracking-wide">BIASA</span>
                  </div>
                )}

                {/* Status Bottom Image */}
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-md border border-white/10">
                  <span className="text-[8px] font-bold">{l.open ? "Buka - Tutup 21.00" : "Tutup"}</span>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex-1 flex flex-col pt-1">
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="font-extrabold text-gray-900 text-[14px] leading-tight pr-2 line-clamp-1">{l.name}</h4>
                  <button 
                    onClick={(e) => toggleFavorite(e, l.id)} 
                    className="shrink-0 p-1 -mt-1 -mr-1"
                  >
                    <Heart size={16} className={favorites.includes(l.id) ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-400"} />
                  </button>
                </div>
                
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-[11px] text-gray-700">{l.rating}</span>
                  <span className="text-gray-400 font-semibold text-[10px]">(1.2k)</span>
                  <div className="w-[1px] h-2 bg-gray-300 mx-0.5" />
                  <MapPin size={10} className="text-primary" />
                  <span className="text-[10px] font-semibold text-gray-500">{l.distance}</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-auto">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                    <Truck size={10} /> Antar Jemput
                  </div>
                  {l.type === "Ekspres" && (
                    <div className="flex items-center gap-1 text-[9px] font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                      <Zap size={10} /> Ekspres 3 Jam
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-between mt-3 pt-2 border-t border-gray-50">
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold mb-0.5">Mulai dari</p>
                    <div className="flex items-baseline gap-0.5 text-primary">
                      <span className="font-black text-[14px] leading-none">{rp(l.price)}</span>
                      <span className="text-[9px] font-semibold text-gray-500">/kg</span>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-primary border border-primary/30 bg-green-50/50 px-2.5 py-1.5 rounded-lg flex items-center gap-0.5 hover:bg-green-100 transition-colors">
                    Lihat Detail <ChevronRight size={10} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isDrawerOpen && selectedLaundry && (
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-white flex flex-col z-50 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {/* Header on Image */}
              <div className="relative h-72 w-full bg-gray-100">
                <img src={selectedLaundry.img} alt={selectedLaundry.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                
                {/* Top Nav */}
                <div className="absolute top-0 left-0 right-0 pt-10 px-5 flex items-center justify-between z-10">
                  <button onClick={() => setIsDrawerOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
                    <ArrowLeft size={20} className="text-gray-800" />
                  </button>
                  <div className="flex items-center gap-3">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
                      <Heart size={20} className="text-gray-800" />
                    </button>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
                      <Share size={20} className="text-gray-800" />
                    </button>
                  </div>
                </div>

                {/* Overlays */}
                <div className="absolute bottom-6 left-5">
                   <div className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 mb-2 w-max shadow-sm">
                     <Zap size={12} className="fill-white" /> EKSPRES 3 JAM
                   </div>
                   <div className="bg-black/60 backdrop-blur-md text-white px-3 py-2 rounded-xl flex items-center gap-2 border border-white/10 w-max">
                     <Bike size={16} />
                     <div>
                       <p className="text-[10px] font-bold leading-none">GRATIS ANTAR JEMPUT</p>
                       <p className="text-[8px] text-gray-300 mt-0.5">Min. order Rp30.000</p>
                     </div>
                   </div>
                </div>

                <div className="absolute bottom-6 right-5 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-[14px]">
                    <Star size={14} className="fill-amber-400" /> {selectedLaundry.rating}
                  </div>
                  <p className="text-[8px] text-gray-300 mt-0.5">(256 ulasan)</p>
                </div>
              </div>

              {/* Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-4 mb-4">
                <div className="w-4 h-1.5 bg-primary rounded-full" />
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
              </div>

              <div className="px-5 pb-6 border-b border-gray-100">
                <h2 className="text-[24px] font-black text-gray-900 leading-tight mb-2 flex items-center gap-2">
                  {selectedLaundry.name} <CheckCircle size={20} className="text-primary fill-primary/10" />
                </h2>
                <div className="flex items-center gap-1.5 text-gray-500 text-[13px] font-medium">
                  <MapPin size={14} className="text-primary" />
                  <span>{selectedLaundry.address} <span className="mx-1">•</span> {selectedLaundry.distance}</span>
                </div>
              </div>

              {/* 4 Features */}
              <div className="px-5 py-6 flex gap-3 border-b border-gray-100">
                {[
                  { n: "Gratis Antar Jemput", i: Bike },
                  { n: "Express 3 Jam", i: Clock },
                  { n: "Pakaian Aman & Wangi", i: Shield },
                  { n: "Bersih & Rapi", i: Shirt }
                ].map(f => {
                  const FIcon = f.i;
                  return (
                    <div key={f.n} className="flex-1 flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white">
                        <FIcon size={18} className="text-primary" />
                      </div>
                      <p className="text-[9px] font-bold text-gray-600 leading-tight px-1">{f.n}</p>
                    </div>
                  )
                })}
              </div>

              {/* Pilihan Layanan */}
              <div className="px-5 py-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-extrabold text-gray-900">Pilih Layanan</h3>
                  <button className="text-[12px] font-bold text-primary flex items-center gap-0.5">
                    Lihat semua <ChevronRight size={14} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { n: "Cuci Komplit", d: "Cuci, kering, setrika, dan lipat", p: selectedLaundry.price, i: Shirt },
                    { n: "Setrika Saja", d: "Setrika rapi siap pakai", p: selectedLaundry.price - 2000, i: Zap },
                    { n: "Cuci Kering", d: "Cuci kering tanpa disetrika", p: selectedLaundry.price - 1000, i: Wind },
                    { n: "Cuci Sepatu", d: "Bersih menyeluruh, cepat kering", p: 25000, i: Package },
                  ].map(s => {
                    const SIcon = s.i;
                    return (
                      <div key={s.n} className="bg-white border border-gray-200 rounded-[20px] p-4 flex flex-col relative active:border-primary transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-green-50 transition-colors">
                          <SIcon size={20} className={s.n.includes("Setrika") ? "text-orange-500" : s.n.includes("Sepatu") ? "text-purple-500" : "text-primary"} />
                        </div>
                        <h4 className="font-extrabold text-gray-900 text-[13px] mb-1">{s.n}</h4>
                        <p className="text-[10px] text-gray-500 leading-tight mb-4 min-h-[24px]">{s.d}</p>
                        
                        <div className="mt-auto flex items-end justify-between">
                          <p className="font-black text-[13px] text-primary">{rp(s.p)}<span className="text-[9px] font-semibold text-gray-500">/{s.n.includes("Sepatu") ? "pasang" : "kg"}</span></p>
                          <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-gray-400">
                            <ChevronRight size={14} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Banner Garansi */}
                <div className="bg-green-50 border border-green-100 rounded-[16px] p-4 flex items-center gap-3">
                  <Shield size={24} className="text-primary shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-extrabold text-gray-900 text-[13px]">Garansi Pakaian Aman</h4>
                    <p className="text-[11px] text-gray-600 font-medium">Jika pakaian rusak atau hilang, kami ganti 100%</p>
                  </div>
                  <ChevronRight size={16} className="text-primary shrink-0" />
                </div>
              </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="bg-white border-t border-gray-100 shrink-0 px-5 pt-4 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] relative z-20">
              <div className="flex gap-3 mb-5">
                <button 
                  onClick={() => { setIsDrawerOpen(false); setTimeout(() => setChatLaundry(selectedLaundry), 300); }} 
                  className="w-14 shrink-0 bg-green-50 text-primary border border-green-100 rounded-[16px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
                >
                  <MessageCircle size={20} className="fill-primary/20" />
                  <span className="text-[9px] font-extrabold">Chat</span>
                </button>
                <button onClick={handlePesan} className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-[16px] p-3 shadow-lg shadow-green-500/30 flex items-center gap-3 active:scale-95 transition-transform">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/20">
                    <Bike size={20} className="text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-black text-[14px] leading-tight">Pesan Pickup Sekarang</p>
                    <p className="text-[10px] text-green-100 font-medium">Gratis antar jemput ke lokasi Anda</p>
                  </div>
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex justify-between border-t border-gray-100 pt-4 px-1">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-700">Buka Setiap Hari</p>
                    <p className="text-[8px] text-gray-400">07.00 - 21.00</p>
                  </div>
                </div>
                <div className="w-[1px] h-6 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gray-400" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-700">+1000</p>
                    <p className="text-[8px] text-gray-400">Pelanggan Puas</p>
                  </div>
                </div>
                <div className="w-[1px] h-6 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-gray-400" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-700">Aman & Terpercaya</p>
                    <p className="text-[8px] text-gray-400">Berpengalaman</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KosScreen({ navigate }: Nav) {
  const [filter, setFilter] = useState("Semua");
  const types = ["Semua", "Putra", "Putri", "Campur"];
  const filtered = filter === "Semua" ? KOS_LIST : KOS_LIST.filter(k => k.type === filter);
  const typeColor: Record<string, string> = { Putra: "blue", Putri: "purple", Campur: "orange" };
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-white shrink-0">
        <StatusBar />
        <BackHeader title="Kos-kosan" onBack={() => navigate("c_home")}
          right={<Filter size={18} className="text-muted-foreground" />} />
        <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: "none" }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all ${filter === t ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        {filtered.map(k => (
          <div key={k.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-36">
              <img src={k.img} alt={k.name} className="w-full h-full object-cover bg-muted" />
              <Pill color={typeColor[k.type] as "blue" | "purple" | "orange"}>
                {k.type === "Putra" ? "👨 Putra" : k.type === "Putri" ? "👩 Putri" : "👥 Campur"}
              </Pill>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h4 className="font-bold text-foreground">{k.name}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${k.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {k.available ? "Tersedia" : "Penuh"}
                </span>
              </div>
              <p className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1">
                <MapPin size={10} /> {k.address}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {k.facilities.map(f => (
                  <span key={f} className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-full flex items-center gap-0.5">
                    {f === "WiFi" && <Wifi size={9} />}
                    {f}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground">Per bulan</p>
                  <p className="text-primary font-extrabold">{rp(k.price)}</p>
                </div>
                <button className={`text-xs font-bold px-4 py-2 rounded-xl ${k.available ? "bg-primary text-white" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
                  {k.available ? "Hubungi Pemilik" : "Bergabung Antrean"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CUSTOMER TABS ────────────────────────────────────────────────────────────
function JelajahScreen({ navigate }: Nav) {
  const cats = [
    { label: "Marketplace", icon: Store, color: "#1B7A4E", bg: "#E8F5EE", screen: "c_marketplace" as Screen },
    { label: "Catering", icon: Coffee, color: "#FF7043", bg: "#FFF3E0", screen: "c_catering" as Screen },
    { label: "Laundry", icon: Wind, color: "#2196F3", bg: "#E3F2FD", screen: "c_laundry" as Screen },
    { label: "Kos", icon: Building2, color: "#9C27B0", bg: "#F3E5F5", screen: "c_kos" as Screen },
    { label: "Rangers Delivery", icon: Truck, color: "#FF9800", bg: "#FFF8E1", screen: "c_marketplace" as Screen },
    { label: "Voucher", icon: Tag, color: "#E91E63", bg: "#FCE4EC", screen: "c_marketplace" as Screen },
  ];
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-white shrink-0">
        <StatusBar />
        <div className="px-5 pb-3 pt-1">
          <h2 className="font-extrabold text-lg text-foreground">Jelajah Layanan</h2>
          <p className="text-muted-foreground text-xs mt-0.5">Temukan semua yang Anda butuhkan</p>
        </div>
        <div className="mx-4 mb-3 flex items-center gap-2 bg-muted px-4 py-3 rounded-2xl">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input placeholder="Cari apa saja..." className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4" style={{ scrollbarWidth: "none" }}>
        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">Semua Layanan</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {cats.map(({ label, icon: Icon, color, bg, screen }) => (
            <button key={label} onClick={() => navigate(screen)}
              className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-xs font-semibold text-foreground text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">Pencarian Populer</h3>
        <div className="flex flex-wrap gap-2">
          {["Nasi Box", "Catering 50 Pax", "Laundry Kiloan", "Kos Dekat Kantor PGE", "Batik Kamojang", "Kopi Lokal"].map(q => (
            <button key={q} className="px-3.5 py-2 bg-white rounded-full text-xs font-semibold text-foreground shadow-sm border border-border">
              🔍 {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const statusColor: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-600",
};

function PesananScreen({ navigate }: Nav) {
  const [tab, setTab] = useState(0);
  const tabs = ["Aktif", "Selesai", "Dibatalkan"];
  const filtered = [
    ORDERS.filter(o => o.status === "Dikirim" || o.status === "Diproses" || o.status === "Aktif"),
    ORDERS.filter(o => o.status === "Selesai"),
    [],
  ][tab];
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-white shrink-0">
        <StatusBar />
        <div className="px-5 pb-2 pt-1">
          <h2 className="font-extrabold text-lg text-foreground">Pesanan Saya</h2>
        </div>
        <div className="flex mx-4 mb-3 bg-muted rounded-2xl p-1 gap-1">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === i ? "bg-white shadow text-primary" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4" style={{ scrollbarWidth: "none" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <ShoppingBag size={40} className="text-muted-foreground opacity-40" />
            <p className="text-muted-foreground text-sm font-semibold">Belum ada pesanan</p>
            <button onClick={() => navigate("c_home")} className="text-primary text-sm font-bold">Mulai Belanja</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(o => {
              const Icon = o.icon;
              return (
                <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: o.color + "20" }}>
                      <Icon size={18} style={{ color: o.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground font-semibold">#{o.id} · {o.type}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[o.statusColor]}`}>{o.status}</span>
                      </div>
                      <p className="font-bold text-sm text-foreground mt-0.5 truncate">{o.item}</p>
                      <p className="text-muted-foreground text-xs">{o.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground">{o.date}</p>
                      <p className="font-extrabold text-sm text-foreground">{rp(o.total)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs font-bold px-3 py-1.5 rounded-xl border border-border text-muted-foreground">Detail</button>
                      <button className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary/10 text-primary">Beli Lagi</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function InboxScreen({ navigate }: Nav) {
  const notifColors: Record<string, string> = {
    order: "bg-blue-100", promo: "bg-orange-100", info: "bg-green-100", system: "bg-gray-100",
  };
  const notifTextColors: Record<string, string> = {
    order: "text-blue-600", promo: "text-orange-600", info: "text-green-600", system: "text-gray-600",
  };
  const notifIcons: Record<string, React.ElementType> = {
    order: Package, promo: Tag, info: Info, system: Bell,
  };
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-white shrink-0">
        <StatusBar />
        <div className="flex items-center justify-between px-5 pb-3 pt-1">
          <h2 className="font-extrabold text-lg text-foreground">Notifikasi</h2>
          <button className="text-xs font-bold text-primary">Tandai semua dibaca</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
        {NOTIFS.map((n) => {
          const Icon = notifIcons[n.type];
          return (
            <div key={n.id} className={`flex gap-3 px-4 py-3.5 border-b border-border relative ${!n.read ? "bg-white" : "bg-transparent"}`}>
              {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${notifColors[n.type]}`}>
                <Icon size={16} className={notifTextColors[n.type]} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm leading-tight ${!n.read ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>{n.title}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.msg}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfilCustomer({ navigate }: Nav) {
  const menuSections = [
    {
      title: "Akun",
      items: [
        { icon: Edit3, label: "Edit Profil", color: "#1B7A4E", bg: "#E8F5EE" },
        { icon: MapPin, label: "Alamat Tersimpan", color: "#2196F3", bg: "#E3F2FD" },
        { icon: CreditCard, label: "Metode Pembayaran", color: "#9C27B0", bg: "#F3E5F5" },
      ],
    },
    {
      title: "Lainnya",
      items: [
        { icon: Gift, label: "Voucher & Promo", color: "#FF7043", bg: "#FFF3E0" },
        { icon: HelpCircle, label: "Bantuan & FAQ", color: "#FF9800", bg: "#FFF8E1" },
        { icon: Shield, label: "Privasi & Keamanan", color: "#607D8B", bg: "#ECEFF1" },
        { icon: Settings, label: "Pengaturan", color: "#78909C", bg: "#F5F5F5" },
      ],
    },
  ];
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-gradient-to-b from-[#0D5C36] to-[#1B7A4E] shrink-0">
        <StatusBar light />
        <div className="flex flex-col items-center pb-8 pt-2 px-4">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow">
              <Camera size={12} className="text-primary" />
            </button>
          </div>
          <p className="text-white font-extrabold text-lg">Budi Santoso</p>
          <p className="text-green-200 text-sm">+62 812-3456-7890</p>
          <div className="flex items-center gap-4 mt-4">
            {[{ v: "12", l: "Pesanan" }, { v: "5", l: "Wishlist" }, { v: "4.9★", l: "Rating" }].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center">
                <span className="text-white font-extrabold text-base">{v}</span>
                <span className="text-green-200 text-xs">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4" style={{ scrollbarWidth: "none" }}>
        {menuSections.map(sec => (
          <div key={sec.title} className="mb-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-2 px-1">{sec.title}</p>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {sec.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted transition-colors ${i > 0 ? "border-t border-border" : ""}`}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                      <Icon size={16} style={{ color: item.color }} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-foreground">{item.label}</span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <button onClick={() => navigate("role")} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <LogOut size={16} className="text-red-500" />
            </div>
            <span className="flex-1 text-sm font-semibold text-red-500">Keluar</span>
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-5">Rangers App v2.0 · PGE Kamojang</p>
      </div>
    </div>
  );
}

// ─── DRIVER SCREENS ───────────────────────────────────────────────────────────
function DriverHome({ navigate }: Nav) {
  const [online, setOnline] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className={`shrink-0 transition-colors duration-500 ${online ? "bg-gradient-to-b from-[#0D5C36] to-[#1B7A4E]" : "bg-gradient-to-b from-gray-700 to-gray-600"}`}>
        <StatusBar light />
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Halo, selamat pagi 🌿</p>
              <h2 className="text-white font-extrabold text-xl">Pak Rahman</h2>
            </div>
            <button className="relative w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Bell size={20} className="text-white" />
            </button>
          </div>
          {/* online toggle */}
          <div className="mt-4 flex items-center justify-between bg-white/15 rounded-2xl p-3">
            <div>
              <p className="text-white font-bold text-sm">{online ? "🟢 Anda Sedang Online" : "⚫ Anda Sedang Offline"}</p>
              <p className="text-white/70 text-xs mt-0.5">{online ? "Menunggu pesanan masuk..." : "Aktifkan untuk menerima pesanan"}</p>
            </div>
            <button onClick={() => setOnline(!online)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${online ? "bg-green-400" : "bg-gray-400"}`}>
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${online ? "translate-x-7" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#F7FAF8]" style={{ scrollbarWidth: "none" }}>
        {/* stats */}
        <div className="grid grid-cols-3 gap-3 px-4 pt-4">
          {[
            { label: "Pendapatan Hari Ini", value: rp(85000), icon: Banknote, color: "#1B7A4E", bg: "#E8F5EE" },
            { label: "Order Selesai", value: "5", icon: CheckCircle, color: "#2196F3", bg: "#E3F2FD" },
            { label: "Rating", value: "4.87 ★", icon: Award, color: "#FF9800", bg: "#FFF8E1" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-3 shadow-sm text-center">
              <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: bg }}>
                <Icon size={16} style={{ color }} />
              </div>
              <p className="font-extrabold text-xs text-foreground">{value}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {online ? (
          <div className="px-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-foreground">Pesanan Tersedia</h3>
              <Pill color="green">2 baru</Pill>
            </div>
            {DRIVER_ORDERS.map(o => (
              <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                <div className="flex items-center justify-between mb-3">
                  <Pill color="green">{o.type}</Pill>
                  <span className="text-[10px] text-muted-foreground">{o.time}</span>
                </div>
                <div className="flex flex-col gap-1.5 mb-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <p className="text-xs text-foreground font-semibold">{o.from}</p>
                  </div>
                  <div className="ml-1 h-4 border-l border-dashed border-muted-foreground" />
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                    <p className="text-xs text-foreground font-semibold">{o.to}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">📍 {o.dist}</span>
                    <span className="font-extrabold text-sm text-primary">{rp(o.pay)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-bold px-3 py-1.5 rounded-xl border border-border text-muted-foreground">Tolak</button>
                    <button className="text-xs font-bold px-4 py-1.5 rounded-xl bg-primary text-white">Terima</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 px-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bike size={32} className="text-gray-400" />
            </div>
            <p className="font-bold text-foreground mb-1">Anda Sedang Offline</p>
            <p className="text-muted-foreground text-sm leading-relaxed">Aktifkan status online untuk mulai menerima pesanan dari komunitas Kamojang</p>
            <button onClick={() => setOnline(true)} className="mt-5 bg-primary text-white font-bold px-6 py-3 rounded-2xl text-sm">
              Mulai Kerja
            </button>
          </div>
        )}

        <div className="px-4 mt-2 pb-6">
          <h3 className="font-bold text-sm text-foreground mb-3">Penghasilan Minggu Ini</h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={EARNINGS_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={false} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [rp(v), "Pendapatan"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Bar dataKey="v" fill="#1B7A4E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Total Minggu Ini</p>
              <p className="font-extrabold text-primary">{rp(EARNINGS_DATA.reduce((s, d) => s + d.v, 0))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriverOrder({ navigate }: Nav) {
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-white shrink-0">
        <StatusBar />
        <div className="px-5 pb-3 pt-1">
          <h2 className="font-extrabold text-lg text-foreground">Pesanan Masuk</h2>
          <p className="text-muted-foreground text-xs mt-0.5">Terakhir diperbarui beberapa detik lalu</p>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: "none" }}>
          {["Semua", "Marketplace", "Laundry", "Catering"].map((f, i) => (
            <button key={f} className={`shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full ${i === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        {DRIVER_ORDERS.map(o => (
          <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Pill color="green">{o.type}</Pill>
              <span className="text-[10px] text-muted-foreground">{o.id} · {o.time}</span>
            </div>
            <div className="bg-muted rounded-xl p-3 mb-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <p className="text-xs font-semibold text-foreground">{o.from}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                <p className="text-xs font-semibold text-foreground">{o.to}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Navigation2 size={11} /> {o.dist}</span>
              <span className="font-extrabold text-primary">{rp(o.pay)}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-bold">Tolak</button>
              <button className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold">Terima Pesanan</button>
            </div>
          </div>
        ))}
        <div className="flex flex-col items-center py-8 gap-2">
          <RefreshCw size={20} className="text-muted-foreground opacity-50" />
          <p className="text-xs text-muted-foreground">Mencari pesanan baru...</p>
        </div>
      </div>
    </div>
  );
}

function DriverRiwayat({ navigate }: Nav) {
  const history = [
    { id: "ORD-099", type: "Marketplace", from: "Warung Bu Siti", to: "Jl. Aster No. 7", pay: 12000, date: "15 Jan 2024", time: "14:32", status: "Selesai" },
    { id: "ORD-098", type: "Laundry Pickup", from: "Kos Putri Melati", to: "Laundry Bersih Kilat", pay: 8000, date: "15 Jan 2024", time: "11:15", status: "Selesai" },
    { id: "ORD-097", type: "Catering", from: "Saung Sunda Asli", to: "Kantor PGE Ring 1", pay: 20000, date: "14 Jan 2024", time: "12:00", status: "Selesai" },
    { id: "ORD-096", type: "Marketplace", from: "Cemilan Bu Eni", to: "Jl. Raya Kamojang No. 20", pay: 10000, date: "14 Jan 2024", time: "09:45", status: "Dibatalkan" },
  ];
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-white shrink-0">
        <StatusBar />
        <div className="px-5 pb-3 pt-1">
          <h2 className="font-extrabold text-lg text-foreground">Riwayat Pengiriman</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        {history.map(h => (
          <div key={h.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Pill color="green">{h.type}</Pill>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${h.status === "Selesai" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{h.status}</span>
            </div>
            <p className="text-xs text-muted-foreground">{h.from} → {h.to}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">{h.date} · {h.time}</span>
              <span className="font-extrabold text-sm text-primary">{rp(h.pay)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DriverPendapatan({ navigate }: Nav) {
  const summary = [
    { label: "Hari Ini", value: 85000, change: "+12%" },
    { label: "Minggu Ini", value: 595000, change: "+8%" },
    { label: "Bulan Ini", value: 2340000, change: "+15%" },
  ];
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-gradient-to-b from-[#0D5C36] to-[#1B7A4E] shrink-0">
        <StatusBar light />
        <div className="px-5 pb-6">
          <h2 className="text-white font-extrabold text-lg">Pendapatan Saya</h2>
          <div className="mt-4 bg-white/15 rounded-2xl p-4 text-center">
            <p className="text-green-200 text-xs mb-1">Total Pendapatan Bulan Ini</p>
            <p className="text-white font-extrabold text-3xl">{rp(2340000)}</p>
            <p className="text-green-300 text-xs mt-1">↑ 15% dari bulan lalu</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4" style={{ scrollbarWidth: "none" }}>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {summary.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 shadow-sm text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
              <p className="font-extrabold text-xs text-foreground">{rp(s.value)}</p>
              <p className="text-[10px] text-green-600 font-bold mt-0.5">{s.change}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-foreground">Grafik Harian</h3>
            <span className="text-xs text-muted-foreground">7 hari terakhir</span>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={EARNINGS_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={false} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [rp(v), "Pendapatan"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
              <Bar dataKey="v" fill="#1B7A4E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <h3 className="font-bold text-sm text-foreground mb-3">Transaksi Terbaru</h3>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[
            { label: "Antar Marketplace #ORD-099", date: "15 Jan · 14:32", val: 12000 },
            { label: "Pickup Laundry #ORD-098", date: "15 Jan · 11:15", val: 8000 },
            { label: "Antar Catering #ORD-097", date: "14 Jan · 12:00", val: 20000 },
          ].map((t, i) => (
            <div key={t.label} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
              <div>
                <p className="text-xs font-semibold text-foreground">{t.label}</p>
                <p className="text-[10px] text-muted-foreground">{t.date}</p>
              </div>
              <span className="text-sm font-extrabold text-primary">+{rp(t.val)}</span>
            </div>
          ))}
        </div>
        <button className="w-full mt-3 py-3 rounded-2xl border border-border text-sm font-bold text-muted-foreground flex items-center justify-center gap-2">
          <QrCode size={16} /> Tarik Saldo ke Rekening
        </button>
      </div>
    </div>
  );
}

function DriverProfil({ navigate }: Nav) {
  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-gradient-to-b from-[#0D5C36] to-[#1B7A4E] shrink-0">
        <StatusBar light />
        <div className="flex flex-col items-center pb-8 pt-2 px-4">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center">
              <span className="text-3xl">🏍️</span>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <p className="text-white font-extrabold text-lg">Rahman Hakim</p>
          <p className="text-green-200 text-sm">+62 813-5678-9012</p>
          <div className="flex items-center gap-4 mt-4">
            {[{ v: "4.87★", l: "Rating" }, { v: "234", l: "Trip" }, { v: "8 Bln", l: "Bergabung" }].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center">
                <span className="text-white font-extrabold text-base">{v}</span>
                <span className="text-green-200 text-xs">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4" style={{ scrollbarWidth: "none" }}>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          {[
            { icon: Bike, label: "Data Kendaraan", color: "#1B7A4E", bg: "#E8F5EE" },
            { icon: CreditCard, label: "Rekening Bank", color: "#2196F3", bg: "#E3F2FD" },
            { icon: Award, label: "Pencapaian & Badge", color: "#FF9800", bg: "#FFF8E1" },
            { icon: Shield, label: "Dokumen & Verifikasi", color: "#9C27B0", bg: "#F3E5F5" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                  <Icon size={16} style={{ color: item.color }} />
                </div>
                <span className="flex-1 text-sm font-semibold text-foreground">{item.label}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            );
          })}
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <button onClick={() => navigate("role")} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <LogOut size={16} className="text-red-500" />
            </div>
            <span className="flex-1 text-sm font-semibold text-red-500">Keluar</span>
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground">Rangers App v2.0 · PGE Kamojang</p>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [role, setRole] = useState<Role | null>(null);
  const navigate = (s: Screen) => setScreen(s);

  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("onboarding"), 2600);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const isCustomerTab = ["c_home", "c_jelajah", "c_pesanan", "c_inbox", "c_profil"].includes(screen);
  const isDriverTab = ["d_home", "d_order", "d_riwayat", "d_pendapatan", "d_profil"].includes(screen);
  const isCustomerSub = ["c_marketplace", "c_catering", "c_laundry", "c_kos"].includes(screen);

  const renderContent = () => {
    // Auth flow
    if (screen === "splash") return <SplashScreen />;
    if (screen === "onboarding") return <OnboardingScreen navigate={navigate} />;
    if (screen === "login") return <LoginScreen navigate={navigate} />;
    if (screen === "otp") return <OTPScreen navigate={navigate} />;
    if (screen === "role") return <RoleScreen navigate={navigate} setRole={setRole} />;

    // Customer sub-screens (no bottom nav)
    if (screen === "c_marketplace") return <MarketplaceScreen navigate={navigate} />;
    if (screen === "c_catering") return <CateringScreen navigate={navigate} />;
    if (screen === "c_laundry") return <LaundryScreen navigate={navigate} />;
    if (screen === "c_kos") return <KosScreen navigate={navigate} />;

    // Customer tabs
    if (screen === "c_home") return <CustomerHome navigate={navigate} />;
    if (screen === "c_jelajah") return <JelajahScreen navigate={navigate} />;
    if (screen === "c_pesanan") return <PesananScreen navigate={navigate} />;
    if (screen === "c_inbox") return <InboxScreen navigate={navigate} />;
    if (screen === "c_profil") return <ProfilCustomer navigate={navigate} />;

    // Driver tabs
    if (screen === "d_home") return <DriverHome navigate={navigate} />;
    if (screen === "d_order") return <DriverOrder navigate={navigate} />;
    if (screen === "d_riwayat") return <DriverRiwayat navigate={navigate} />;
    if (screen === "d_pendapatan") return <DriverPendapatan navigate={navigate} />;
    if (screen === "d_profil") return <DriverProfil navigate={navigate} />;

    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#062B1A] via-[#0D5C36] to-[#1B4332] p-4 lg:p-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Desktop hint */}
      <div className="hidden lg:flex flex-col items-start gap-6 mr-10 max-w-xs">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <svg viewBox="0 0 80 80" className="w-5 h-5">
                <circle cx="40" cy="40" r="35" fill="#E8F5EE" />
                <path d="M20 50 Q40 20 60 50" stroke="#1B7A4E" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M28 50 Q40 28 52 50" stroke="#4CAF50" strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="40" cy="48" r="6" fill="#1B7A4E" />
              </svg>
            </div>
            <span className="text-white font-extrabold">Rangers App 2.0</span>
          </div>
          <p className="text-green-200/80 text-sm leading-relaxed">Super app komunitas lokal oleh PGE Kamojang — melayani masyarakat Ring 1–3.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-green-200/70">
          {[
            ["🛒", "Marketplace UMKM"],
            ["🍱", "Catering Lokal"],
            ["👕", "Laundry Pickup"],
            ["🏠", "Cari Kos-kosan"],
            ["🏍️", "Jadi Driver Rangers"],
          ].map(([e, l]) => (
            <div key={l} className="flex items-center gap-2">
              <span>{e}</span><span>{l}</span>
            </div>
          ))}
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-white/90 text-xs font-semibold mb-1">Demo Cepat</p>
          <p className="text-green-200/70 text-xs leading-relaxed">Gunakan tombol navigasi di dalam layar untuk menjelajahi semua fitur. Tersedia mode Customer & Driver.</p>
        </div>
      </div>

      {/* Phone frame */}
      <div className="relative shrink-0" style={{ width: 390, height: 844 }}>
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-full z-20" />
        {/* Frame */}
        <div className="absolute inset-0 rounded-[44px] border-[8px] border-gray-900 shadow-[0_60px_120px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden bg-white flex flex-col z-10">
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderContent()}
          </div>
          {/* Bottom nav */}
          {isCustomerTab && !isCustomerSub && (
            <CustomerNav screen={screen} navigate={navigate} />
          )}
          {isDriverTab && (
            <DriverNav screen={screen} navigate={navigate} />
          )}
        </div>
        {/* Side buttons */}
        <div className="absolute right-[-10px] top-28 w-1.5 h-10 bg-gray-800 rounded-r-full" />
        <div className="absolute right-[-10px] top-44 w-1.5 h-14 bg-gray-800 rounded-r-full" />
        <div className="absolute left-[-10px] top-36 w-1.5 h-8 bg-gray-800 rounded-l-full" />
        <div className="absolute left-[-10px] top-48 w-1.5 h-14 bg-gray-800 rounded-l-full" />
        <div className="absolute left-[-10px] top-64 w-1.5 h-14 bg-gray-800 rounded-l-full" />
      </div>
    </div>
  );
}
