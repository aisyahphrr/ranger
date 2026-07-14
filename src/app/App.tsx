import React, { useState, useEffect, useRef } from "react";
import {
  Home, Search, ShoppingBag, MessageCircle, User, Clock, MessageSquare,
  Wallet, ChevronRight, Star, MapPin, Bell, ArrowLeft, Heart,
  Package, Truck, CheckCircle, X, Plus, Minus, Map,
  TrendingUp, Settings, LogOut, BarChart2, ShoppingCart,
  Tag, ChevronDown, Check, Filter, Wifi, Battery,
  Zap, Award, Send, Gift, HelpCircle, Shield, Phone,
  Navigation2, Edit3, Building2, Bike, Signal, QrCode,
  Banknote, AlertCircle, Camera, Info, Eye, EyeOff,
  Store, RefreshCw, CreditCard, Coffee, Shirt, Wind,
  Mic, SlidersHorizontal, LayoutGrid, Share, Users, Percent, Bath, Utensils, Headphones, Download
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
  | "d_home" | "d_order" | "d_riwayat" | "d_pendapatan" | "d_profil"
  | "c_cart" | "c_qris" | "c_tracking" | "c_rating" | "c_driver_chat" | "c_support_chat" | "c_catering_chat"
  | "mitra_reg";
type Role = "customer" | "driver";
type Nav = { navigate: (s: Screen) => void };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const rp = (n: any) => {
  if (n === undefined || n === null || isNaN(Number(n))) return "Rp 0";
  return "Rp " + Number(n).toLocaleString("id-ID");
};
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
  { id: 1, name: "Saung Sunda Asli", cuisine: "Masakan Sunda", rating: 4.9, distance: 0.3, minOrder: 25000, img: uImg("1555939594-58d7cb561ad1", 400, 220), tags: ["Halal", "Populer"], open: true, priceStarts: 25000 },
  { id: 2, name: "Catering Bu Haji Nani", cuisine: "Prasmanan & Nasi Box", rating: 4.7, distance: 1.2, minOrder: 50000, img: uImg("1563245372-f21724e3856d", 400, 220), tags: ["Halal", "Min. 10 Pax"], open: true, priceStarts: 22000 },
  { id: 3, name: "Dapur Asri Kamojang", cuisine: "Masakan Rumahan", rating: 4.8, distance: 0.8, minOrder: 20000, img: uImg("1512621776951-a57141f2eefd", 400, 220), tags: ["Halal", "Sehat"], open: true, priceStarts: 27500 },
  { id: 4, name: "Bento Box & Snack Kamojang", cuisine: "Jepang & Snack Box", rating: 4.6, distance: 1.5, minOrder: 30000, img: uImg("1546069901-ba9599a7e63c", 400, 220), tags: ["Halal", "Bento"], open: true, priceStarts: 18000 },
  { id: 5, name: "Warung Prasmanan Bu Edi", cuisine: "Aneka Nasi Box & Lauk", rating: 4.5, distance: 2.1, minOrder: 40000, img: uImg("1565299624946-b28f40a0ae38", 400, 220), tags: ["Promo", "Murah"], open: true, priceStarts: 15000 },
  { id: 6, name: "Tumpeng Premium Kamojang", cuisine: "Tumpeng & Prasmanan", rating: 4.9, distance: 0.5, minOrder: 150000, img: uImg("1563245372-f21724e3856d", 400, 220), tags: ["Best Seller", "Premium"], open: true, priceStarts: 450000 },
  { id: 7, name: "Healthy Diet Catering", cuisine: "Healthy Clean Eating", rating: 4.8, distance: 1.9, minOrder: 35000, img: uImg("1512621776951-a57141f2eefd", 400, 220), tags: ["Organik", "Diet"], open: true, priceStarts: 32000 },
  { id: 8, name: "Snack Box & Jajanan Bu Tini", cuisine: "Snack & Jajanan Pasar", rating: 4.7, distance: 0.4, minOrder: 15000, img: uImg("1509042239860-f550ce710b93", 400, 220), tags: ["Murah", "Lengkap"], open: true, priceStarts: 10000 },
  { id: 9, name: "Dapur Mini Nasi Box", cuisine: "Nasi Box Nusantara", rating: 4.4, distance: 2.5, minOrder: 25000, img: uImg("1555939594-58d7cb561ad1", 400, 220), tags: ["Halal"], open: true, priceStarts: 20000 },
  { id: 10, name: "Catering Nasi Liwet Sunda", cuisine: "Nasi Liwet Sunda", rating: 4.9, distance: 0.9, minOrder: 60000, img: uImg("1563245372-f21724e3856d", 400, 220), tags: ["Tradisional", "Lengkap"], open: true, priceStarts: 35000 },
  { id: 11, name: "Dapur Selera Kita", cuisine: "Prasmanan & Catering", rating: 4.2, distance: 3.2, minOrder: 50000, img: uImg("1512621776951-a57141f2eefd", 400, 220), tags: ["Halal"], open: false, priceStarts: 25000 }
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
    <div className="flex items-center px-4 h-14 shrink-0 border-b border-border bg-white relative">
      <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors -ml-1 relative z-10 cursor-pointer">
        <ArrowLeft size={20} />
      </button>
      <span className="flex-1 text-center text-base font-bold text-foreground -ml-9 pointer-events-none select-none">{title}</span>
      <div className="w-9 flex justify-end relative z-10">{right}</div>
    </div>
  );
}

function CustomerNav({ screen, navigate, unreadChatCount, unreadSupportCount, unreadCateringCount }: { screen: Screen; navigate: (s: Screen) => void; unreadChatCount: number; unreadSupportCount: number; unreadCateringCount: number }) {
  const unreadNotifs = NOTIFS.filter(n => !n.read).length;
  const inboxBadge = unreadChatCount + unreadSupportCount + unreadCateringCount + unreadNotifs;
  const items: { id: Screen; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "c_home", label: "Beranda", icon: Home },
    { id: "c_jelajah", label: "Jelajah", icon: Map },
    { id: "c_pesanan", label: "Pesanan", icon: ShoppingBag, badge: 1 },
    { id: "c_inbox", label: "Inbox", icon: MessageCircle, badge: inboxBadge },
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
          <button onClick={() => { setRole("driver"); navigate("mitra_reg"); }}
            className="p-6 rounded-3xl border-2 border-border flex items-center gap-5 text-left hover:border-accent hover:bg-orange-50 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shrink-0">
              <Bike size={28} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-lg text-foreground">Menjadi Mitra & Driver</p>
              <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">Antar pesanan & kelola usaha (Kos/Laundry) dari komunitas Kamojang</p>
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
function CustomerHome({ navigate, dompetBalance, addToCart }: Nav & { dompetBalance: number; addToCart: (p: typeof PRODUCTS[0]) => void }) {
  const [liked, setLiked] = useState<Set<number>>(new Set([2, 5]));
  const toggleLike = (id: number) => setLiked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const getProductPhotos = (p: typeof PRODUCTS[0]) => {
    const list = [p.img];
    if (p.id === 1) {
      list.push(uImg("1546069901-ba9599a7e63c", 300, 300));
      list.push(uImg("1606787366850-de6330128bfc", 300, 300));
    } else if (p.id === 2) {
      list.push(uImg("1523381210434-271e8be1f52b", 300, 300));
      list.push(uImg("1597983073492-70b925b42d76", 300, 300));
    } else if (p.id === 3) {
      list.push(uImg("1618331835737-f58889acacf1", 300, 300));
      list.push(uImg("1599490656923-5e2697843079", 300, 300));
    } else {
      list.push(uImg("1512621776951-a57141f2eefd", 300, 300));
      list.push(uImg("1563245372-f21724e3856d", 300, 300));
    }
    return list;
  };

  const getProductReviews = (p: typeof PRODUCTS[0]) => {
    if (p.id === 1) {
      return [
        { id: 1, name: "Anita Wijaya", rating: 5, date: "Kemarin", text: "Porsinya pas banget untuk makan siang, ayam bakar timbelnya empuk pol dan sambel goang-nya seger bgt!" },
        { id: 2, name: "Rian Hidayat", rating: 4, date: "3 hari lalu", text: "Nasi timbelnya pulen, dibungkus daun pisang jadi wangi. Sayang tahu tempe-nya agak kecil." },
        { id: 3, name: "Dewi Lestari", rating: 5, date: "5 hari lalu", text: "Langganan kantor nih kalau makan siang, bersih dan pengiriman driver Rangers cepet banget." }
      ];
    }
    if (p.id === 2) {
      return [
        { id: 1, name: "Yanto Kusuma", rating: 5, date: "2 hari lalu", text: "Bahannya dingin dan motif kawungnya rapi banget. Jahitan kuat dan fit-nya pas di badan." },
        { id: 2, name: "Sari Wulandari", rating: 5, date: "1 minggu lalu", text: "Kado buat suami, dia suka banget. Warna batiknya tidak luntur saat dicuci pertama kali." }
      ];
    }
    return [
      { id: 1, name: "Budi Santoso", rating: 5, date: "Kemarin", text: "Kualitas barang juara, sangat direkomendasikan untuk dibeli!" },
      { id: 2, name: "Aisyah Putri", rating: 4, date: "4 hari lalu", text: "Bagus sekali, respon seller ramah dan pengirimannya super cepat." }
    ];
  };
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
        
        {/* WALLET CARD */}
        <div className="mx-5 mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Wallet size={16} className="text-yellow-300" />
            </div>
            <div>
              <p className="text-[9px] text-green-200 font-semibold uppercase tracking-wider">Dompet Rangers</p>
              <p className="text-sm font-extrabold">{rp(dompetBalance)}</p>
            </div>
          </div>
          <button onClick={() => navigate("c_qris")} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 transition-colors rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer">
            <QrCode size={11} />
            <span>Bayar</span>
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
              <div 
                key={p.id} 
                onClick={() => {
                  setSelectedProduct(p);
                  setActivePhotoIndex(0);
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm relative cursor-pointer border border-black/[0.02] hover:border-primary/10 transition-all"
              >
                <img src={p.img} alt={p.name} className="w-full h-28 object-cover bg-muted" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(p.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
                >
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

      {/* Product Detail Modal */}
      {selectedProduct && (() => {
        const photos = getProductPhotos(selectedProduct);
        const reviews = getProductReviews(selectedProduct);
        return (
          <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
            <style>{`
              @keyframes slide-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              .animate-slide-up {
                animation: slide-up 0.28s cubic-bezier(0.25, 1, 0.5, 1) forwards;
              }
            `}</style>
            <div className="flex-1" onClick={() => setSelectedProduct(null)} />
            <div className="bg-white rounded-t-[28px] max-h-[82%] flex flex-col overflow-hidden shadow-2xl relative animate-slide-up">
              
              {/* Close & Like float overlays */}
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm z-10 cursor-pointer hover:bg-black/60 transition-colors"
              >
                <X size={16} />
              </button>
              <button 
                onClick={() => toggleLike(selectedProduct.id)} 
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow-md z-10 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                <Heart size={14} className={liked.has(selectedProduct.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
              </button>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {/* Hero Product Photo */}
                <div className="w-full h-56 relative bg-muted shrink-0">
                  <img src={photos[activePhotoIndex]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>

                {/* Gallery Thumbnails */}
                <div className="flex gap-2.5 px-4 mt-3">
                  {photos.map((ph, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActivePhotoIndex(idx)} 
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${activePhotoIndex === idx ? "border-primary scale-105" : "border-transparent opacity-75"}`}
                    >
                      <img src={ph} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Product Name & Price */}
                <div className="px-4 mt-4 flex flex-col gap-1">
                  <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full w-max uppercase tracking-wider">
                    {selectedProduct.cat}
                  </span>
                  <h3 className="text-base font-extrabold text-foreground leading-tight mt-1">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Stars rating={selectedProduct.rating} size={12} />
                    <span className="text-xs text-muted-foreground font-semibold">· {selectedProduct.sold}x Terjual</span>
                  </div>
                  <p className="text-lg font-black text-primary mt-1">{rp(selectedProduct.price)}</p>
                </div>

                <div className="h-px bg-border/60 mx-4 my-4" />

                {/* Merchant Store Profile Card */}
                <div className="mx-4 bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-base shrink-0">
                      🏪
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-foreground truncate leading-normal">{selectedProduct.store}</p>
                      <p className="text-[9px] text-muted-foreground truncate leading-tight">Kamojang Ring 1 · Buka 08:00 - 18:00</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="bg-amber-50 text-amber-700 text-[8px] font-black border border-amber-200 px-1 py-0.2 rounded-full whitespace-nowrap">
                          ★ 4.8 / 5.0
                        </span>
                        <span className="text-[8px] text-muted-foreground font-semibold whitespace-nowrap">50+ Ulasan</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setMarketplaceSearch(selectedProduct.store);
                      setSelectedProduct(null);
                      navigate("c_marketplace");
                    }}
                    className="text-[9px] font-extrabold text-primary border border-primary/20 bg-white px-2.5 py-1.5 rounded-xl hover:bg-primary/5 active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    Profil Toko
                  </button>
                </div>

                <div className="h-px bg-border/60 mx-4 my-4" />

                {/* Community Reviews Section */}
                <div className="px-4 pb-6 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-foreground">Ulasan Komunitas</h4>
                  <div className="flex flex-col gap-2.5">
                    {reviews.map(rev => (
                      <div key={rev.id} className="bg-white border border-border/80 rounded-xl p-3 shadow-sm flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center uppercase">
                              {rev.name[0]}
                            </div>
                            <span className="text-[10px] font-extrabold text-foreground">{rev.name}</span>
                          </div>
                          <span className="text-[8px] text-muted-foreground font-semibold">{rev.date}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={8} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-[10px] font-medium text-foreground leading-normal">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Sticky Footer */}
              <div className="p-4 border-t border-border bg-white flex items-center justify-between gap-4 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
                <div>
                  <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">Total Harga</p>
                  <p className="text-base font-black text-primary leading-tight mt-0.5">{rp(selectedProduct.price)}</p>
                </div>
                <button 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart size={13} />
                  <span>Masukkan Keranjang</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── CUSTOMER SUB-SCREENS ─────────────────────────────────────────────────────
const CATS = ["Semua", "Makanan", "Minuman", "Fashion", "Kesehatan", "Kerajinan"];

function MarketplaceScreen({ 
  navigate, 
  addToCart, 
  cart,
  marketplaceSearch,
  setMarketplaceSearch
}: Nav & { 
  addToCart: (p: typeof PRODUCTS[0]) => void; 
  cart: any[];
  marketplaceSearch: string;
  setMarketplaceSearch: (s: string) => void;
}) {
  const [cat, setCat] = useState("Semua");
  const searchQuery = marketplaceSearch;
  const setSearchQuery = setMarketplaceSearch;
  const [liked, setLiked] = useState<Set<number>>(new Set([2, 5]));
  const toggleLike = (id: number) => setLiked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const filtered = PRODUCTS.filter(p => {
    const matchesCat = cat === "Semua" || p.cat === cat;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.store.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getProductPhotos = (p: typeof PRODUCTS[0]) => {
    const list = [p.img];
    if (p.id === 1) {
      list.push(uImg("1546069901-ba9599a7e63c", 300, 300));
      list.push(uImg("1606787366850-de6330128bfc", 300, 300));
    } else if (p.id === 2) {
      list.push(uImg("1523381210434-271e8be1f52b", 300, 300));
      list.push(uImg("1597983073492-70b925b42d76", 300, 300));
    } else if (p.id === 3) {
      list.push(uImg("1618331835737-f58889acacf1", 300, 300));
      list.push(uImg("1599490656923-5e2697843079", 300, 300));
    } else {
      list.push(uImg("1512621776951-a57141f2eefd", 300, 300));
      list.push(uImg("1563245372-f21724e3856d", 300, 300));
    }
    return list;
  };

  const getProductReviews = (p: typeof PRODUCTS[0]) => {
    if (p.id === 1) {
      return [
        { id: 1, name: "Anita Wijaya", rating: 5, date: "Kemarin", text: "Porsinya pas banget untuk makan siang, ayam bakar timbelnya empuk pol dan sambel goang-nya seger bgt!" },
        { id: 2, name: "Rian Hidayat", rating: 4, date: "3 hari lalu", text: "Nasi timbelnya pulen, dibungkus daun pisang jadi wangi. Sayang tahu tempe-nya agak kecil." },
        { id: 3, name: "Dewi Lestari", rating: 5, date: "5 hari lalu", text: "Langganan kantor nih kalau makan siang, bersih dan pengiriman driver Rangers cepet banget." }
      ];
    }
    if (p.id === 2) {
      return [
        { id: 1, name: "Yanto Kusuma", rating: 5, date: "2 hari lalu", text: "Bahannya dingin dan motif kawungnya rapi banget. Jahitan kuat dan fit-nya pas di badan." },
        { id: 2, name: "Sari Wulandari", rating: 5, date: "1 minggu lalu", text: "Kado buat suami, dia suka banget. Warna batiknya tidak luntur saat dicuci pertama kali." }
      ];
    }
    return [
      { id: 1, name: "Budi Santoso", rating: 5, date: "Kemarin", text: "Kualitas barang juara, sangat direkomendasikan untuk dibeli!" },
      { id: 2, name: "Aisyah Putri", rating: 4, date: "4 hari lalu", text: "Bagus sekali, respon seller ramah dan pengirimannya super cepat." }
    ];
  };

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8] relative">
      <div className="bg-white shrink-0">
        <StatusBar />
        <BackHeader title="Marketplace UMKM" onBack={() => navigate("c_home")}
          right={
            <button onClick={() => navigate("c_cart")} className="relative p-1 cursor-pointer">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          } 
        />
        <div className="px-4 py-3 flex items-center gap-2 bg-muted mx-4 mb-3 rounded-2xl border border-border focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk UMKM..." 
            className="flex-1 bg-transparent text-sm outline-none" 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <X size={14} />
            </button>
          )}
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
            <ShoppingBag size={40} className="text-muted-foreground opacity-40 animate-bounce" />
            <p className="text-muted-foreground text-sm font-semibold">Produk tidak ditemukan</p>
            <p className="text-muted-foreground/60 text-xs text-center px-6">Coba kata kunci lain atau bersihkan filter pencarian Anda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => (
              <div 
                key={p.id} 
                onClick={() => {
                  setSelectedProduct(p);
                  setActivePhotoIndex(0);
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm relative border border-black/[0.03] hover:border-primary/20 transition-all cursor-pointer"
              >
                <img src={p.img} alt={p.name} className="w-full h-32 object-cover bg-muted" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(p.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-transform"
                >
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
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                    className="w-full mt-2 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-xl active:bg-primary active:text-white transition-all hover:bg-primary/25 cursor-pointer"
                  >
                    + Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (() => {
        const photos = getProductPhotos(selectedProduct);
        const reviews = getProductReviews(selectedProduct);
        return (
          <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
            <style>{`
              @keyframes slide-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              .animate-slide-up {
                animation: slide-up 0.28s cubic-bezier(0.25, 1, 0.5, 1) forwards;
              }
            `}</style>
            <div className="flex-1" onClick={() => setSelectedProduct(null)} />
            <div className="bg-white rounded-t-[28px] max-h-[82%] flex flex-col overflow-hidden shadow-2xl relative animate-slide-up">
              
              {/* Close & Like float overlays */}
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-sm z-10 cursor-pointer hover:bg-black/60 transition-colors"
              >
                <X size={16} />
              </button>
              <button 
                onClick={() => toggleLike(selectedProduct.id)} 
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow-md z-10 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                <Heart size={14} className={liked.has(selectedProduct.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
              </button>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {/* Hero Product Photo */}
                <div className="w-full h-56 relative bg-muted shrink-0">
                  <img src={photos[activePhotoIndex]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>

                {/* Gallery Thumbnails */}
                <div className="flex gap-2.5 px-4 mt-3">
                  {photos.map((ph, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActivePhotoIndex(idx)} 
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${activePhotoIndex === idx ? "border-primary scale-105" : "border-transparent opacity-75"}`}
                    >
                      <img src={ph} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Product Name & Price */}
                <div className="px-4 mt-4 flex flex-col gap-1">
                  <span className="text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full w-max uppercase tracking-wider">
                    {selectedProduct.cat}
                  </span>
                  <h3 className="text-base font-extrabold text-foreground leading-tight mt-1">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Stars rating={selectedProduct.rating} size={12} />
                    <span className="text-xs text-muted-foreground font-semibold">· {selectedProduct.sold}x Terjual</span>
                  </div>
                  <p className="text-lg font-black text-primary mt-1">{rp(selectedProduct.price)}</p>
                </div>

                <div className="h-px bg-border/60 mx-4 my-4" />

                {/* Merchant Store Profile Card */}
                <div className="mx-4 bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-base shrink-0">
                      🏪
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-foreground truncate leading-normal">{selectedProduct.store}</p>
                      <p className="text-[9px] text-muted-foreground truncate leading-tight">Kamojang Ring 1 · Buka 08:00 - 18:00</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="bg-amber-50 text-amber-700 text-[8px] font-black border border-amber-200 px-1 py-0.2 rounded-full whitespace-nowrap">
                          ★ 4.8 / 5.0
                        </span>
                        <span className="text-[8px] text-muted-foreground font-semibold whitespace-nowrap">50+ Ulasan</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSearchQuery(selectedProduct.store);
                      setSelectedProduct(null);
                    }}
                    className="text-[9px] font-extrabold text-primary border border-primary/20 bg-white px-2.5 py-1.5 rounded-xl hover:bg-primary/5 active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    Profil Toko
                  </button>
                </div>

                <div className="h-px bg-border/60 mx-4 my-4" />

                {/* Community Reviews Section */}
                <div className="px-4 pb-6 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-foreground">Ulasan Komunitas</h4>
                  <div className="flex flex-col gap-2.5">
                    {reviews.map(rev => (
                      <div key={rev.id} className="bg-white border border-border/80 rounded-xl p-3 shadow-sm flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center uppercase">
                              {rev.name[0]}
                            </div>
                            <span className="text-[10px] font-extrabold text-foreground">{rev.name}</span>
                          </div>
                          <span className="text-[8px] text-muted-foreground font-semibold">{rev.date}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={8} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-[10px] font-medium text-foreground leading-normal">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Sticky Footer */}
              <div className="p-4 border-t border-border bg-white flex items-center justify-between gap-4 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
                <div>
                  <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">Total Harga</p>
                  <p className="text-base font-black text-primary leading-tight mt-0.5">{rp(selectedProduct.price)}</p>
                </div>
                <button 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart size={13} />
                  <span>Masukkan Keranjang</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}


const CATERING_PACKAGES: Record<number, { id: number; name: string; desc: string; price: number; img: string; cat: "Nasi Box" | "Tumpeng" | "Snack Box" | "Bento" }[]> = {
  1: [
    { id: 101, name: "Paket A - Timbel Ayam Bakar", desc: "Nasi timbel wangi daun pisang, ayam bakar madu empuk, tahu tempe goreng, lalapan segar & sambal terasi.", price: 25000, img: uImg("1565299624946-b28f40a0ae38", 150, 150), cat: "Nasi Box" },
    { id: 102, name: "Paket B - Liwet Kakap Bakar", desc: "Nasi liwet gurih teri pete, kakap bakar bumbu kuning, bakwan jagung, sambal cobek terasi.", price: 35000, img: uImg("1546069901-ba9599a7e63c", 150, 150), cat: "Nasi Box" },
    { id: 103, name: "Tumpeng Sunda Tampah Premium", desc: "Tumpeng dengan nasi kuning/liwet tampah, ayam bakar 10 potong, urap sayur, tempe oreg, sambal.", price: 450000, img: uImg("1563245372-f21724e3856d", 150, 150), cat: "Tumpeng" },
  ],
  2: [
    { id: 201, name: "Paket Nasi Box Syukuran", desc: "Nasi kuning wangi, ayam goreng lengkuas, sambal goreng kentang ati, telur balado, kerupuk udang.", price: 30000, img: uImg("1546069901-ba9599a7e63c", 150, 150), cat: "Nasi Box" },
    { id: 202, name: "Tumpeng Kuning Premium Bu Haji", desc: "Tumpeng ukuran besar lengkap dengan hiasan, ayam kuning 20 potong, perkedel kentang, mie goreng, kering tempe.", price: 650000, img: uImg("1563245372-f21724e3856d", 150, 150), cat: "Tumpeng" },
    { id: 203, name: "Paket Bento Box Ayam Teriyaki", desc: "Nasi putih, chicken teriyaki premium, salad kol wortel, crispy eggroll, buah potong.", price: 22000, img: uImg("1512621776951-a57141f2eefd", 150, 150), cat: "Bento" },
  ],
  3: [
    { id: 301, name: "Bento Diet Sehat Kenyang", desc: "Nasi merah organik, ayam suwir sambal matah rendah kalori, pepes tahu jamur tiram, tumis buncis bawang putih.", price: 27500, img: uImg("1512621776951-a57141f2eefd", 150, 150), cat: "Bento" },
    { id: 302, name: "Paket Lauk Keluarga Box", desc: "1 box lauk pauk (pilihan ayam bakar/ikan nila goreng), sayur lodeh mangkuk besar, sambal tomat & tempe bacem.", price: 85000, img: uImg("1563245372-f21724e3856d", 150, 150), cat: "Nasi Box" },
  ],
  4: [
    { id: 401, name: "Bento Chicken Katsu Premium", desc: "Nasi pulen, chicken katsu renyah saus curry khas jepang, sup miso hangat.", price: 24000, img: uImg("1512621776951-a57141f2eefd", 150, 150), cat: "Bento" },
    { id: 402, name: "Snack Box Manis Asin", desc: "Kue sus vla vanila, risoles mayo, lemper ayam premium, air mineral botol mini.", price: 18000, img: uImg("1509042239860-f550ce710b93", 150, 150), cat: "Snack Box" }
  ],
  5: [
    { id: 501, name: "Nasi Box Sederhana Lezat", desc: "Nasi putih, telor balado/dadar, oseng kacang panjang, tempe mendoan, sambal hijau.", price: 15000, img: uImg("1565299624946-b28f40a0ae38", 150, 150), cat: "Nasi Box" },
    { id: 502, name: "Snack Box Rapat Kantoran", desc: "Pastel telur, dadar gulung pandan, bolu gulung coklat, air mineral.", price: 16000, img: uImg("1509042239860-f550ce710b93", 150, 150), cat: "Snack Box" }
  ],
  6: [
    { id: 601, name: "Tumpeng Mini Nasi Uduk", desc: "Tumpeng ukuran personal (untuk 1 orang), ayam suwir bumbu bali, kering tempe, irisan dadar tipis, sambal.", price: 45000, img: uImg("1563245372-f21724e3856d", 150, 150), cat: "Tumpeng" },
    { id: 602, name: "Tumpeng Raksasa Premium (30 Pax)", desc: "Tumpeng mewah dengan hiasan kelapa dan janur, 30 porsi komplit aneka lauk pendamping.", price: 950000, img: uImg("1563245372-f21724e3856d", 150, 150), cat: "Tumpeng" }
  ],
  7: [
    { id: 701, name: "Bento Salmon Panggang Sehat", desc: "Nasi coklat, fillet salmon panggang omega-3, edamame rebus, wortel & brokoli steam.", price: 48000, img: uImg("1512621776951-a57141f2eefd", 150, 150), cat: "Bento" },
    { id: 702, name: "Nasi Box Diet Karbo", desc: "Shirataki rice, ayam panggang tanpa kulit, scrambled egg whites, tumis sayur buncis.", price: 32000, img: uImg("1512621776951-a57141f2eefd", 150, 150), cat: "Nasi Box" }
  ],
  8: [
    { id: 801, name: "Snack Box Jajanan Pasar Tradisional", desc: "Kue mangkok merah, talam pandan, lapis legit, klepon gula merah asli.", price: 10000, img: uImg("1509042239860-f550ce710b93", 150, 150), cat: "Snack Box" },
    { id: 802, name: "Snack Box Modern Premium", desc: "Macaron pelangi, eclair coklat belgian, mini quiche lorraine, fruit tartlet.", price: 25000, img: uImg("1509042239860-f550ce710b93", 150, 150), cat: "Snack Box" }
  ],
  9: [
    { id: 901, name: "Nasi Box Ayam Geprek Kamojang", desc: "Nasi putih hangat, ayam geprek krispi sambal korek level 1-5, lalapan timun.", price: 20000, img: uImg("1555939594-58d7cb561ad1", 150, 150), cat: "Nasi Box" }
  ],
  10: [
    { id: 1001, name: "Nasi Liwet Box Tradisional", desc: "Nasi liwet teri, ayam goreng serundeng, tahu tempe, sambal lalap lengkap.", price: 35000, img: uImg("1563245372-f21724e3856d", 150, 150), cat: "Nasi Box" },
    { id: 1002, name: "Tumpeng Liwet Sunda (15 Pax)", desc: "Tumpeng nasi liwet gurih dengan lauk ayam goreng, ikan asin peda, pepes tahu, pencok kacang panjang.", price: 550000, img: uImg("1563245372-f21724e3856d", 150, 150), cat: "Tumpeng" }
  ],
  11: [
    { id: 1101, name: "Prasmanan Paket Gold (Min. 50 Pax)", desc: "Menu buffet prasmanan mewah: nasi goreng, soup iga, rendang daging sapi premium, puding saus vanilla.", price: 55000, img: uImg("1512621776951-a57141f2eefd", 150, 150), cat: "Nasi Box" }
  ]
};

function CateringScreen({
  navigate,
  setCateringChatMessages,
  setUnreadCateringCount,
  setCateringStoreName,
  myOrders,
  setMyOrders,
  showToast,
  dompetBalance,
  setDompetBalance
}: Nav & {
  setCateringChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setUnreadCateringCount: React.Dispatch<React.SetStateAction<number>>;
  setCateringStoreName: (n: string) => void;
  myOrders: any[];
  setMyOrders: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (m: string) => void;
  dompetBalance: number;
  setDompetBalance: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [selectedMerchant, setSelectedMerchant] = useState<typeof RESTAURANTS[0] | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [paxCount, setPaxCount] = useState(10);
  const [bookingDate, setBookingDate] = useState("");
  const [note, setNote] = useState("");

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortOption, setSortOption] = useState("default");
  const [activeTab, setActiveTab] = useState<"menu" | "review" | "info">("menu");
  const [isLoading, setIsLoading] = useState(false);

  // Payment PO States
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentOption, setPaymentOption] = useState<"full" | "dp30" | "dp50">("full");

  // Autocomplete Suggestions
  const suggestions = ["Nasi Box", "Tumpeng", "Bento", "Murah", "Lengkap", "Diet"];

  // Skeleton loading effect when search or filter options change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortOption]);

  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleOpenMerchant = (m: typeof RESTAURANTS[0]) => {
    setSelectedMerchant(m);
    const pkgs = CATERING_PACKAGES[m.id] || [];
    setSelectedPackage(pkgs[0] || null);
    setPaxCount(pkgs[0]?.cat === "Tumpeng" ? 1 : 10);
    setBookingDate(getTomorrowString());
    setNote("");
    setActiveTab("menu");
    setShowPaymentDialog(false);
  };

  const handleChatAdmin = () => {
    if (!selectedMerchant) return;
    const storeName = selectedMerchant.name;
    setCateringStoreName(storeName);
    setCateringChatMessages([
      { id: "1", sender: "catering", text: `Halo kak Budi! Terima kasih sudah menghubungi kami. Ada yang bisa kami bantu terkait rencana pesanan katering Anda di ${storeName}?`, time: "Baru saja" }
    ]);
    setUnreadCateringCount(0);
    setSelectedMerchant(null);
    navigate("c_catering_chat");
  };

  const validateAndTriggerPO = () => {
    if (!selectedMerchant || !selectedPackage) return;
    const isTumpeng = selectedPackage.cat === "Tumpeng";

    if (!isTumpeng && paxCount < 10) {
      alert("Pemesanan katering Nasi Box/Bento minimal 10 pax.");
      return;
    }
    if (isTumpeng && paxCount < 1) {
      alert("Pemesanan tumpeng minimal 1 unit.");
      return;
    }
    if (!bookingDate) {
      alert("Silakan pilih tanggal pengiriman.");
      return;
    }

    const chosenDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    chosenDate.setHours(0, 0, 0, 0);
    if (chosenDate.getTime() <= today.getTime()) {
      alert("Tanggal pengiriman minimal H-1 (mulai besok).");
      return;
    }

    // Open Payment Option modal
    setShowPaymentDialog(true);
  };

  const handleConfirmPO = () => {
    if (!selectedMerchant || !selectedPackage) return;
    const totalPrice = selectedPackage.price * paxCount;
    const isTumpeng = selectedPackage.cat === "Tumpeng";

    let paidAmount = totalPrice;
    let dpPercent = 100;
    if (paymentOption === "dp30") {
      paidAmount = Math.round(totalPrice * 0.3);
      dpPercent = 30;
    } else if (paymentOption === "dp50") {
      paidAmount = Math.round(totalPrice * 0.5);
      dpPercent = 50;
    }
    const sisaAmount = totalPrice - paidAmount;

    if (dompetBalance < paidAmount) {
      alert("Saldo Dompet Rangers Anda tidak mencukupi untuk melakukan pembayaran!");
      return;
    }

    // Deduct balance
    setDompetBalance(prev => prev - paidAmount);

    const newOrderId = `RNG-PO${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = {
      id: newOrderId,
      type: "Catering",
      icon: Coffee,
      color: "#FF7043",
      item: `${selectedPackage.name} (${paxCount} ${isTumpeng ? 'Unit' : 'Pax'})`,
      detail: selectedMerchant.name,
      status: sisaAmount > 0 ? "Menunggu Pelunasan" : "Diproses",
      statusColor: "orange",
      date: bookingDate,
      total: totalPrice,
      sisaAmount: sisaAmount,
      paymentType: sisaAmount > 0 ? "DP" : "Full",
      paymentHistory: [
        { 
          label: sisaAmount > 0 ? `DP ${dpPercent}%` : "Pembayaran Lunas", 
          amount: paidAmount, 
          date: "Hari Ini", 
          method: "Dompet Rangers" 
        }
      ],
      items: [{ id: selectedPackage.id, name: selectedPackage.name, price: selectedPackage.price, quantity: paxCount, img: selectedPackage.img, store: selectedMerchant.name }],
      progressState: 0,
      payMethod: sisaAmount > 0 ? `DP ${dpPercent}% (Dompet)` : "Dompet Rangers",
      reviewText: "",
      reviewRating: 0,
      address: "Jl. Aster No. 7, Kamojang (Kos Putri Melati)",
      driverNote: note,
      voucherCode: null,
      discount: 0,
      tip: 0,
      subtotal: totalPrice,
      shippingFee: 0
    };

    setMyOrders(prev => [newOrder, ...prev]);

    // Setup chat room with welcome details
    setCateringStoreName(selectedMerchant.name);
    setCateringChatMessages([
      { id: "1", sender: "catering", text: `Halo kak Budi! Booking Pre-Order (${newOrderId}) Anda untuk ${selectedPackage.name} sebanyak ${paxCount} ${isTumpeng ? 'Unit' : 'Pax'} telah kami terima.\n\nStatus Pembayaran: ${sisaAmount > 0 ? `DP ${dpPercent}% Dibayar (${rp(paidAmount)}). Sisa Pelunasan: ${rp(sisaAmount)}` : `Lunas (${rp(totalPrice)})`}.\n\nTanggal Pengiriman: ${bookingDate}.\n\nApakah ada detail pesanan atau request menu khusus yang ingin disesuaikan?`, time: "Baru saja" }
    ]);
    setUnreadCateringCount(1);
    
    showToast(`Booking PO Berhasil! ${sisaAmount > 0 ? "DP Berhasil dibayar." : "Pembayaran Lunas."}`);
    setShowPaymentDialog(false);
    setSelectedMerchant(null);
    navigate("c_inbox");
  };

  // Fuzzy Search & Kategori Filtering
  const filteredRestaurants = RESTAURANTS.filter(r => {
    const pkgs = CATERING_PACKAGES[r.id] || [];
    const matchesCategory = selectedCategory === "Semua" || pkgs.some(p => p.cat === selectedCategory);
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatches = r.name.toLowerCase().includes(q);
    const cuisineMatches = r.cuisine.toLowerCase().includes(q);
    const tagsMatches = r.tags.some(t => t.toLowerCase().includes(q));
    const menuMatches = pkgs.some(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    return nameMatches || cuisineMatches || tagsMatches || menuMatches;
  });

  // Sorting
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortOption === "rating") return b.rating - a.rating;
    if (sortOption === "distance") return a.distance - b.distance;
    if (sortOption === "price-asc") return a.priceStarts - b.priceStarts;
    if (sortOption === "price-desc") return b.priceStarts - a.priceStarts;
    return 0;
  });

  // Helper text highlighter
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-amber-100 text-amber-900 font-extrabold rounded px-0.5">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Mock Reviews
  const getMockReviews = (merchantName: string) => [
    { name: "Budi Santoso", initial: "B", rating: 5, date: "2 hari lalu", text: `Pesanan katering di ${merchantName} sangat memuaskan. Rasa nasinya gurih, ayam bakarnya bumbu meresap sampai ke dalam!` },
    { name: "Rina Wijaya", initial: "R", rating: 4, date: "1 minggu lalu", text: "Porsi katering pas, lauk pauk bervariasi dan bersih. Sangat direkomendasikan untuk katering kantor." },
    { name: "Agus Setiawan", initial: "A", rating: 5, date: "3 minggu lalu", text: "Admin katering sangat ramah. Pengiriman tepat waktu 30 menit sebelum acara dimulai. Top!" }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8] relative">
      {/* Top Header & Search Bar */}
      <div className="bg-white shrink-0 shadow-sm z-10 pb-3">
        <StatusBar />
        <BackHeader title="Catering" onBack={() => navigate("c_home")} />
        
        {/* Search Input */}
        <div className="mx-4 mt-1 flex items-center gap-2 bg-muted px-4 py-2.5 rounded-2xl border border-transparent focus-within:border-primary/20 transition-all">
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari catering, paket, atau menu..." 
            className="flex-1 bg-transparent text-xs outline-none text-foreground font-semibold"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto px-4 mt-2.5" style={{ scrollbarWidth: "none" }}>
          {suggestions.map(s => (
            <button 
              key={s}
              onClick={() => setSearchQuery(s)}
              className="shrink-0 text-[10px] font-bold px-3 py-1 bg-muted hover:bg-primary/5 text-muted-foreground hover:text-primary rounded-full transition-all border border-border/40"
            >
              🔍 {s}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sort Horizontal Bar */}
      <div className="bg-white border-b border-border py-2 px-4 flex gap-2 overflow-x-auto shrink-0 z-10" style={{ scrollbarWidth: "none" }}>
        {/* Categories */}
        {["Semua", "Nasi Box", "Tumpeng", "Snack Box", "Bento"].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition-all ${selectedCategory === cat ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-slate-100"}`}
          >
            {cat}
          </button>
        ))}

        <div className="w-px bg-border my-1 mx-1 shrink-0" />

        {/* Sorting selection */}
        {[
          { label: "📍 Terdekat", val: "distance" },
          { label: "⭐ Rating Terbaik", val: "rating" },
          { label: "💸 Termurah", val: "price-asc" },
          { label: "📈 Termahal", val: "price-desc" }
        ].map(opt => (
          <button
            key={opt.val}
            onClick={() => setSortOption(sortOption === opt.val ? "default" : opt.val)}
            className={`shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all border ${sortOption === opt.val ? "bg-primary/10 border-primary text-primary" : "bg-white border-border text-muted-foreground"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* List / Skeleton Loading Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        
        {isLoading ? (
          /* Skeleton Loader layout */
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border animate-pulse">
              <div className="h-36 bg-gray-200" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="flex gap-2 mt-2">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-9 bg-gray-200 rounded-xl mt-2" />
              </div>
            </div>
          ))
        ) : sortedRestaurants.length === 0 ? (
          /* Empty State Gojek/Grab Level */
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-4">
            <div className="w-20 h-20 bg-orange-100/50 rounded-full flex items-center justify-center text-orange-500 shadow-inner">
              <Search size={36} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-foreground">Yah, Catering Tidak Ditemukan</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                Kami tidak menemukan catering "{searchQuery}" di wilayah Kamojang. Coba cari dengan kata kunci lain atau gunakan kategori di atas.
              </p>
            </div>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
                setSortOption("default");
              }}
              className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-dark transition-all cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          /* Render sorted & filtered results */
          sortedRestaurants.map(r => {
            const hasPromo = r.tags.includes("Promo") || r.tags.includes("Best Seller") || r.id % 3 === 0;
            return (
              <div 
                key={r.id} 
                onClick={() => handleOpenMerchant(r)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/[0.02] hover:border-primary/20 hover:shadow-md transition-all cursor-pointer"
              >
                {/* Image layout 16:9 */}
                <div className="relative h-36 bg-muted shrink-0">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-sm text-white ${r.open ? "bg-green-600" : "bg-gray-500"}`}>
                    {r.open ? "● Buka" : "● Tutup"}
                  </span>
                  {hasPromo && (
                    <span className="absolute top-3 right-3 text-[9px] font-black px-2.5 py-1 rounded-full shadow-sm bg-gradient-to-r from-orange-500 to-red-500 text-white uppercase tracking-wider">
                      Promo PO 20%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-foreground text-sm leading-snug">
                        {highlightText(r.name, searchQuery)}
                      </h4>
                      <p className="text-muted-foreground text-xs mt-0.5">{r.cuisine}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/50 px-2 py-0.5 rounded-lg text-xs font-bold whitespace-nowrap">
                      ★ {r.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {r.tags.map(t => <Pill key={t} color={t === "Promo" ? "orange" : "green"}>{t}</Pill>)}
                    <Pill color="gray">📍 {r.distance} km</Pill>
                    <Pill color="gray">Min {rp(r.minOrder)}</Pill>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/60">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Mulai Dari</p>
                      <p className="text-primary font-black text-sm">{rp(r.priceStarts)} <span className="text-muted-foreground text-[9px] font-medium">/ pax</span></p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMerchant(r);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm ${r.open ? "bg-primary text-white hover:bg-primary-dark" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Catering Merchant Popup Modal (Slide Up) */}
      {selectedMerchant && (() => {
        const packages = CATERING_PACKAGES[selectedMerchant.id] || [];
        const isTumpeng = selectedPackage?.cat === "Tumpeng";
        return (
          <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
            <style>{`
              @keyframes slide-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              .animate-slide-up {
                animation: slide-up 0.28s cubic-bezier(0.25, 1, 0.5, 1) forwards;
              }
            `}</style>
            <div className="flex-1" onClick={() => setSelectedMerchant(null)} />
            <div className="bg-white rounded-t-[28px] max-h-[88%] flex flex-col overflow-hidden shadow-2xl relative animate-slide-up">
              
              {/* Header Modal */}
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-white shadow-sm z-10">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🍱</span>
                  <div>
                    <h3 className="text-xs font-black text-foreground leading-tight">{selectedMerchant.name}</h3>
                    <p className="text-[9px] text-muted-foreground font-semibold">Detail PO & Booking Catering</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMerchant(null)} 
                  className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-gray-200"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Tabs selector */}
              <div className="flex border-b border-border shrink-0 bg-white z-10">
                {[
                  { label: "Menu Katering", val: "menu" },
                  { label: "Ulasan Komunitas", val: "review" },
                  { label: "Informasi Toko", val: "info" }
                ].map(t => (
                  <button
                    key={t.val}
                    onClick={() => setActiveTab(t.val as any)}
                    className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === t.val ? "border-primary text-primary font-black" : "border-transparent text-muted-foreground"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
                
                {activeTab === "menu" && (
                  /* TAB 1: MENU PACKAGES */
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-bold text-foreground">Daftar Paket Menu PO</h4>
                      <span className="text-[10px] text-muted-foreground font-medium">{packages.length} paket tersedia</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {packages.map(p => {
                        const isSelected = selectedPackage?.id === p.id;
                        return (
                          <div 
                            key={p.id}
                            onClick={() => {
                              setSelectedPackage(p);
                              if (p.cat === "Tumpeng") {
                                setPaxCount(1);
                              } else {
                                setPaxCount(10);
                              }
                            }}
                            className={`flex gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer bg-white ${isSelected ? "border-primary shadow-sm ring-1 ring-primary/10" : "border-border hover:bg-slate-50"}`}
                          >
                            <img src={p.img} alt={p.name} className="w-16 h-16 rounded-xl object-cover bg-muted shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1">
                                <p className="text-xs font-extrabold text-foreground leading-tight truncate">{p.name}</p>
                                {isSelected && <span className="bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0 uppercase">Pilihan</span>}
                              </div>
                              <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">{p.desc}</p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{p.cat}</span>
                                <p className="text-primary font-black text-xs">{rp(p.price)} <span className="text-muted-foreground text-[8px] font-medium">{p.cat === "Tumpeng" ? "/ unit" : "/ pax"}</span></p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pre-Order Configuration Panel inside Modal */}
                    {selectedPackage && (
                      <div className="mt-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-4">
                        <h4 className="text-xs font-black text-foreground border-b border-border pb-2 -mt-1">Kustomisasi Pre-Order (PO)</h4>
                        
                        {/* Portion Counter */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-foreground">{isTumpeng ? "Jumlah Unit" : "Jumlah Pax (Porsi)"}</p>
                            <p className="text-[9px] text-muted-foreground mt-0.5">{isTumpeng ? "Minimal pemesanan 1 unit" : "Minimal pemesanan katering box 10 porsi"}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setPaxCount(prev => Math.max(isTumpeng ? 1 : 10, prev - (isTumpeng ? 1 : 5)))}
                              className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-foreground hover:bg-slate-100 cursor-pointer shadow-sm active:scale-95 transition-transform"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-xs font-extrabold text-foreground w-8 text-center">{paxCount}</span>
                            <button 
                              onClick={() => setPaxCount(prev => prev + (isTumpeng ? 1 : 5))}
                              className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-foreground hover:bg-slate-100 cursor-pointer shadow-sm active:scale-95 transition-transform"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Native date picker with H-1 validation */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-foreground">Pilih Hari Pengiriman</p>
                            <span className="text-[9px] text-red-500 font-bold">*Min. H-1</span>
                          </div>
                          <input 
                            type="date"
                            min={getTomorrowString()}
                            value={bookingDate}
                            onChange={e => setBookingDate(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-foreground cursor-pointer"
                          />
                        </div>

                        {/* Catatan */}
                        <div className="flex flex-col gap-1.5">
                          <p className="text-xs font-bold text-foreground">Catatan untuk Penjual</p>
                          <input 
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Contoh: Minta sendok plastik, sambal dipisah, dll."
                            className="w-full px-3 py-2.5 bg-white border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "review" && (
                  /* TAB 2: REVIEWS */
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-foreground mb-1">Ulasan Pelanggan</h4>
                    <div className="flex flex-col gap-2.5">
                      {getMockReviews(selectedMerchant.name).map((rev, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex flex-col gap-2 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center uppercase">
                                {rev.initial}
                              </div>
                              <span className="text-[11px] font-extrabold text-foreground">{rev.name}</span>
                            </div>
                            <span className="text-[9px] text-muted-foreground font-semibold">{rev.date}</span>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-[10px] font-medium text-foreground leading-relaxed">"{rev.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "info" && (
                  /* TAB 3: MERCHANT INFO */
                  <div className="flex flex-col gap-3.5">
                    <h4 className="text-xs font-bold text-foreground">Informasi Toko</h4>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Cuisine & Kategori</p>
                        <p className="text-xs font-bold text-foreground mt-0.5">{selectedMerchant.cuisine}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Jarak dari Lokasi Anda</p>
                        <p className="text-xs font-bold text-foreground mt-0.5">📍 {selectedMerchant.distance} km</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Minimum Pembelian</p>
                        <p className="text-xs font-bold text-foreground mt-0.5">{rp(selectedMerchant.minOrder)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Jam Operasional</p>
                        <p className="text-xs font-bold text-foreground mt-0.5">⏰ 08:00 - 19:00 WIB</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Deskripsi Layanan</p>
                        <p className="text-xs font-medium text-foreground leading-relaxed mt-0.5">
                          Menyediakan aneka sajian katering sehat dan bersih yang diolah secara higienis oleh chef berpengalaman di Kamojang. Cocok untuk hidangan syukuran, rapat kantor, gathering komunitas, maupun konsumsi harian keluarga.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Sticky Footer */}
              {selectedPackage && activeTab === "menu" && (
                <div className="p-4 border-t border-border bg-white flex items-center justify-between gap-3 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-10">
                  <div>
                    <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">Total Pembayaran PO</p>
                    <p className="text-base font-black text-primary leading-tight mt-0.5">{rp(selectedPackage.price * paxCount)}</p>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <button 
                      onClick={handleChatAdmin}
                      className="px-3.5 py-3 border-2 border-primary text-primary hover:bg-primary/5 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare size={13} />
                      <span>Chat Admin</span>
                    </button>
                    <button 
                      onClick={validateAndTriggerPO}
                      className="flex-1 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Pesan Sekarang (PO)</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* Down Payment Option Dialog (Popup Modal) */}
      {showPaymentDialog && selectedMerchant && selectedPackage && (() => {
        const totalPrice = selectedPackage.price * paxCount;
        return (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-5">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-border relative flex flex-col max-h-[85%]">
              
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-slate-50">
                <span className="text-xs font-black text-foreground">Metode Pembayaran PO</span>
                <button 
                  onClick={() => setShowPaymentDialog(false)}
                  className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
                
                {/* Order Summary box */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
                    <span>Menu Paket PO</span>
                    <span>Qty / Porsi</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-foreground font-extrabold border-b border-dashed border-border pb-2 mb-1.5">
                    <span className="truncate pr-4">{selectedPackage.name}</span>
                    <span className="shrink-0">{paxCount} {selectedPackage.cat === "Tumpeng" ? "Unit" : "Pax"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-foreground font-bold">
                    <span>Total Harga PO</span>
                    <span className="text-primary font-black text-sm">{rp(totalPrice)}</span>
                  </div>
                </div>

                {/* DP Choices Option */}
                <div className="flex flex-col gap-2.5">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wide">Pilih Opsi Pembayaran</p>
                  
                  {/* Option 1: Bayar Full */}
                  <div 
                    onClick={() => setPaymentOption("full")}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 bg-white ${paymentOption === "full" ? "border-primary bg-primary/[0.02]" : "border-border hover:bg-slate-50"}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentOption === "full" ? "border-primary" : "border-gray-300"}`}>
                      {paymentOption === "full" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-foreground">Bayar Lunas (100%)</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Dapatkan garansi prioritas pengantaran.</p>
                      <p className="text-primary font-extrabold text-xs mt-1">{rp(totalPrice)}</p>
                    </div>
                  </div>

                  {/* Option 2: DP 30% */}
                  <div 
                    onClick={() => setPaymentOption("dp30")}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 bg-white ${paymentOption === "dp30" ? "border-primary bg-primary/[0.02]" : "border-border hover:bg-slate-50"}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentOption === "dp30" ? "border-primary" : "border-gray-300"}`}>
                      {paymentOption === "dp30" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <p className="text-xs font-extrabold text-foreground">Bayar DP 30%</p>
                        <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">DP</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Sisa pelunasan dibayar paling lambat H-1.</p>
                      <div className="flex justify-between items-center mt-1 flex-wrap gap-1">
                        <p className="text-primary font-extrabold text-xs">DP: {rp(Math.round(totalPrice * 0.3))}</p>
                        <p className="text-muted-foreground text-[9px] font-semibold">Sisa: {rp(totalPrice - Math.round(totalPrice * 0.3))}</p>
                      </div>
                    </div>
                  </div>

                  {/* Option 3: DP 50% */}
                  <div 
                    onClick={() => setPaymentOption("dp50")}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 bg-white ${paymentOption === "dp50" ? "border-primary bg-primary/[0.02]" : "border-border hover:bg-slate-50"}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentOption === "dp50" ? "border-primary" : "border-gray-300"}`}>
                      {paymentOption === "dp50" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <p className="text-xs font-extrabold text-foreground">Bayar DP 50%</p>
                        <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">DP</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Sisa pelunasan dibayar paling lambat H-1.</p>
                      <div className="flex justify-between items-center mt-1 flex-wrap gap-1">
                        <p className="text-primary font-extrabold text-xs">DP: {rp(Math.round(totalPrice * 0.5))}</p>
                        <p className="text-muted-foreground text-[9px] font-semibold">Sisa: {rp(totalPrice - Math.round(totalPrice * 0.5))}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Dompet Rangers Wallet Info */}
                <div className="bg-slate-100 border border-slate-200/50 p-3 rounded-2xl flex items-center justify-between mt-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🪙</span>
                    <div className="text-[10px]">
                      <p className="font-extrabold text-foreground">Dompet Rangers</p>
                      <p className="text-muted-foreground">Saldo Anda</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-primary">{rp(dompetBalance)}</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-border bg-white flex gap-2.5 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
                <button 
                  onClick={() => setShowPaymentDialog(false)}
                  className="flex-1 py-3 border border-border text-muted-foreground font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-50 text-center"
                >
                  Kembali
                </button>
                <button 
                  onClick={handleConfirmPO}
                  className="flex-[2] py-3 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer text-center"
                >
                  Bayar & Buat PO
                </button>
              </div>

            </div>
          </div>
        );
      })()}

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

  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedServicesOrder, setSelectedServicesOrder] = useState<any[]>([]);
  const [pickupAddress, setPickupAddress] = useState("");

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

  const availableServices = selectedLaundry ? [
    { n: "Cuci Komplit", d: "Cuci, kering, setrika, dan lipat", p: selectedLaundry.price, i: Shirt },
    { n: "Setrika Saja", d: "Setrika rapi siap pakai", p: selectedLaundry.price - 2000, i: Zap },
    { n: "Cuci Kering", d: "Cuci kering tanpa disetrika", p: selectedLaundry.price - 1000, i: Wind },
    { n: "Cuci Sepatu", d: "Bersih menyeluruh, cepat kering", p: 25000, i: Package },
  ] : [];

  const handlePesan = () => {
    setIsOrderFormOpen(true);
    if (selectedServicesOrder.length === 0) {
      setSelectedServicesOrder([availableServices[0]]);
    }
  };

  const handleServiceClick = (s: any) => {
    setSelectedServicesOrder([s]);
    setIsOrderFormOpen(true);
  };

  const handleKonfirmasiPesanan = () => {
    if (selectedServicesOrder.length === 0) {
      alert("Mohon pilih setidaknya satu layanan.");
      return;
    }
    if (!pickupAddress.trim()) {
      alert("Mohon isi alamat penjemputan terlebih dahulu!");
      return;
    }
    setIsOrderFormOpen(false);
    setIsDrawerOpen(false);
    setTimeout(() => {
      setTrackingStep(1);
    }, 400);
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
                  {availableServices.map(s => {
                    const SIcon = s.i;
                    return (
                      <div key={s.n} onClick={() => handleServiceClick(s)} className="bg-white border border-gray-200 rounded-[20px] p-4 flex flex-col relative active:border-primary transition-colors cursor-pointer group">
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

      {/* Order Form Bottom Sheet */}
      <AnimatePresence>
        {isOrderFormOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsOrderFormOpen(false)}
              className="absolute inset-0 bg-black/40 z-[60] backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[36px] flex flex-col z-[70] shadow-2xl max-h-[85%]"
            >
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mt-4 mb-2" />
              <div className="p-5 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[20px] font-black text-gray-900">Detail Pesanan</h3>
                  <button onClick={() => setIsOrderFormOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-gray-500">✕</span>
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="font-extrabold text-[13px] text-gray-900 mb-3">Pilih Layanan</h4>
                  <div className="flex flex-col gap-2">
                    {availableServices.map((s) => {
                      const isSelected = selectedServicesOrder.some(selected => selected.n === s.n);
                      const SIcon = s.i;
                      return (
                        <div 
                          key={s.n} 
                          onClick={() => {
                            if (isSelected) {
                              setSelectedServicesOrder(prev => prev.filter(selected => selected.n !== s.n));
                            } else {
                              setSelectedServicesOrder(prev => [...prev, s]);
                            }
                          }}
                          className={`border rounded-[16px] p-3 flex items-center gap-3 cursor-pointer transition-colors ${isSelected ? 'bg-green-50/50 border-primary' : 'bg-white border-gray-200'}`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {isSelected ? <Check size={20} /> : <SIcon size={20} />}
                          </div>
                          <div className="flex-1">
                            <h5 className={`font-bold text-[13px] ${isSelected ? 'text-primary' : 'text-gray-900'}`}>{s.n}</h5>
                            <p className="text-[11px] text-gray-500 line-clamp-1">{s.d}</p>
                          </div>
                          <p className="font-black text-[13px] text-gray-900">{rp(s.p)}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-extrabold text-[13px] text-gray-900 mb-3">Alamat Penjemputan</h4>
                  <textarea 
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Contoh: Jl. Mawar No. 12, RT 01/02 (Rumah cat hijau)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[16px] p-4 text-[13px] text-gray-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] resize-none"
                  />
                </div>

                <div className="border-t border-gray-100 pt-5 pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[13px] font-bold text-gray-500">Estimasi Biaya</span>
                    <span className="font-black text-[16px] text-gray-900">{rp(selectedServicesOrder.reduce((acc, curr) => acc + (curr.p * 2), 0))}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 text-right mb-5">*Berdasarkan asumsi berat 2kg per layanan</p>
                  
                  <button 
                    onClick={handleKonfirmasiPesanan}
                    disabled={selectedServicesOrder.length === 0}
                    className={`w-full font-black py-4 rounded-[16px] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all ${selectedServicesOrder.length === 0 ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-white shadow-green-500/30'}`}
                  >
                    Konfirmasi & Pesan <CheckCircle size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function KosScreen({ navigate }: Nav) {
  const [filter, setFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedKos, setSelectedKos] = useState<typeof KOS_LIST[0] | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { text: "Halo, apakah kamar masih tersedia?", sender: "me", time: "10:00" },
    { text: "Halo, iya masih ada sisa kamar. Silakan booking via aplikasi ya.", sender: "owner", time: "10:02" }
  ]);
  
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [bookingName, setBookingName] = useState("Rahman Hakim");
  const [bookingPhone, setBookingPhone] = useState("081356789012");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingDuration, setBookingDuration] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<"idle"|"payment_method"|"processing"|"success">("idle");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("GoPay");

  const handleBookingSubmit = () => {
    setPaymentStatus("payment_method");
  };

  const handlePaymentConfirm = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setPaymentStatus("idle");
    setIsBookingFormOpen(false);
    setSelectedKos(null);
  };

  const types = [
    { id: "Semua", icon: LayoutGrid },
    { id: "Putra", icon: User },
    { id: "Putri", icon: User },
    { id: "Campur", icon: Users }
  ];
  
  const filtered = KOS_LIST.filter(k => {
    const matchType = filter === "Semua" || k.type === filter;
    const matchSearch = k.name.toLowerCase().includes(searchQuery.toLowerCase()) || k.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8] relative overflow-hidden">
      {/* Header */}
      <div className="bg-white shrink-0 z-20 sticky top-0 pt-2 pb-2">
        <StatusBar />
        <div className="px-5 flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("c_home")} className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-colors shrink-0">
              <ArrowLeft size={20} className="text-gray-800" />
            </button>
            <div>
              <h1 className="text-[20px] font-black text-gray-900 tracking-tight leading-tight">Kos-kosan</h1>
              <p className="text-[11px] font-semibold text-gray-400">Temukan kos terbaik sesuai kebutuhanmu</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Map size={18} className="text-gray-700" />
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
              placeholder="Cari lokasi, nama kos, atau fasilitas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 pl-11 pr-28 bg-transparent text-[13px] font-semibold text-gray-800 focus:outline-none placeholder:text-gray-400" 
            />
            <div className="absolute right-2 bg-green-50 text-primary px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer">
              <MapPin size={12} className="fill-primary/20" />
              <span className="text-[10px] font-bold">Dekat saya</span>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-5 mt-4 flex gap-2.5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {types.map(t => {
            const TIcon = t.icon;
            const isAll = t.id === "Semua";
            const isPutra = t.id === "Putra";
            const isPutri = t.id === "Putri";
            const isCampur = t.id === "Campur";
            
            const activeColor = isAll ? "bg-primary text-white shadow-md shadow-green-500/20" : 
                               isPutra ? "bg-blue-50 text-blue-600 border border-blue-200" :
                               isPutri ? "bg-pink-50 text-pink-600 border border-pink-200" :
                               "bg-orange-50 text-orange-600 border border-orange-200";
            const inactiveColor = "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50";
            const isActive = filter === t.id;

            return (
              <button 
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[14px] text-[12px] font-bold transition-all shrink-0 ${isActive ? activeColor : inactiveColor}`}
              >
                <TIcon size={14} className={isActive ? (isAll ? "text-white" : "") : "text-gray-400"} /> {t.id}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6 flex flex-col gap-5" style={{ scrollbarWidth: "none" }}>
        
        {/* Banner Promo */}
        <div className="bg-[#E8F5EE] rounded-[20px] p-4 flex items-center gap-4 relative overflow-hidden shrink-0">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm relative z-10 rotate-[-10deg]">
            <Percent size={28} className="text-primary" />
          </div>
          <div className="flex-1 relative z-10">
            <div className="flex items-start justify-between">
              <h3 className="font-extrabold text-gray-900 text-[14px] mb-1">Diskon Spesial!</h3>
              <button className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
            </div>
            <p className="text-[11px] font-medium text-gray-600 mb-2.5 leading-tight">Dapatkan potongan harga hingga 15% untuk pemesanan bulan ini</p>
            <button className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 w-max">
              Lihat Promo <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Kos Cards */}
        {filtered.map(k => {
          const typeColorInfo = k.type === "Putra" ? { bg: "bg-blue-50", text: "text-blue-600", i: User } :
                                k.type === "Putri" ? { bg: "bg-pink-50", text: "text-pink-600", i: User } :
                                { bg: "bg-orange-50", text: "text-orange-600", i: Users };
          const TypeIcon = typeColorInfo.i;

          return (
            <div key={k.id} onClick={() => setSelectedKos(k)} className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col active:scale-[0.98] transition-transform cursor-pointer shrink-0">
              
              <div className="flex gap-3 p-3">
                {/* Left Image */}
                <div className="w-[140px] h-[180px] shrink-0 bg-gray-100 rounded-[18px] relative overflow-hidden group">
                  <img src={k.img} alt={k.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Heart Icon */}
                  <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 text-white hover:bg-black/40">
                    <Heart size={16} />
                  </button>
                  
                  {/* Camera Label */}
                  <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md text-white px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                    <Camera size={10} />
                    <span className="text-[9px] font-bold">8 Foto</span>
                  </div>

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    <div className="w-3 h-1.5 bg-white rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                  </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${typeColorInfo.bg} ${typeColorInfo.text}`}>
                      <TypeIcon size={10} />
                      <span className="text-[9px] font-bold tracking-wide">{k.type}</span>
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${k.available ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                      {k.available ? "Tersedia" : "Penuh"}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-gray-900 text-[15px] leading-tight mb-1 line-clamp-1">{k.name}</h4>
                  
                  <div className="flex items-center gap-1 text-gray-500 mb-1.5">
                    <MapPin size={12} className="text-gray-400 shrink-0" />
                    <span className="text-[11px] font-medium line-clamp-1">{k.address}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] mb-3">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-900">4.8</span>
                    <span className="text-gray-400">(120 ulasan)</span>
                  </div>

                  {/* Facilities Icons */}
                  <div className="flex flex-wrap gap-1.5 mb-auto">
                    {k.facilities.map((f, i) => {
                      let FIcon = Wifi;
                      if (f.includes("AC")) FIcon = Wind;
                      if (f.includes("KM")) FIcon = Bath;
                      if (f.includes("Dapur")) FIcon = Utensils;
                      if (f.includes("Parkir")) FIcon = Bike;
                      if (f.includes("Laundry")) FIcon = Shirt;
                      
                      return (
                        <div key={i} className="flex items-center gap-1 border border-gray-200 rounded-lg px-1.5 py-1 text-primary bg-white">
                          <FIcon size={10} className={k.type === "Putra" ? "text-blue-500" : k.type === "Putri" ? "text-pink-500" : "text-orange-500"} />
                          <span className="text-[8px] font-bold text-gray-600 whitespace-nowrap">{f}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Price */}
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-medium text-gray-400 mb-0.5">Mulai dari</p>
                      <p className="font-black text-primary text-[15px] leading-none">{rp(k.price)} <span className="text-[10px] font-medium text-gray-400">/ bulan</span></p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-primary shrink-0">
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Trust Badges Footer */}
        <div className="flex justify-between border-t border-gray-100 pt-5 pb-2 px-1 shrink-0 mt-2">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <div>
              <p className="text-[9px] font-bold text-gray-700">Aman & Terverifikasi</p>
              <p className="text-[8px] text-gray-400">Semua kos telah diverifikasi</p>
            </div>
          </div>
          <div className="w-[1px] h-6 bg-gray-200" />
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-500" />
            <div>
              <p className="text-[9px] font-bold text-gray-700">+2.000 Kos</p>
              <p className="text-[8px] text-gray-400">Pilihan terbaik untukmu</p>
            </div>
          </div>
          <div className="w-[1px] h-6 bg-gray-200" />
          <div className="flex items-center gap-2">
            <Headphones size={16} className="text-orange-500" />
            <div>
              <p className="text-[9px] font-bold text-gray-700">Layanan 24/7</p>
              <p className="text-[8px] text-gray-400">Kami siap membantu</p>
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {/* FULLSCREEN KOS DETAIL */}
        {selectedKos && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-30 bg-white flex flex-col"
          >
            {/* Header Image */}
            <div className="h-[280px] shrink-0 relative bg-gray-100">
              <img src={selectedKos.img} alt={selectedKos.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              
              <button 
                onClick={() => setSelectedKos(null)} 
                className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="absolute top-5 right-5 flex gap-2">
                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Share size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Heart size={18} />
                </button>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${selectedKos.type === "Putra" ? "bg-blue-500 text-white" : selectedKos.type === "Putri" ? "bg-pink-500 text-white" : "bg-orange-500 text-white"}`}>
                      {selectedKos.type}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${selectedKos.available ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                      {selectedKos.available ? "Sisa 2 Kamar" : "Penuh"}
                    </span>
                  </div>
                  <h2 className="text-[24px] font-black text-white leading-tight">{selectedKos.name}</h2>
                </div>
              </div>
            </div>

            {/* Scrollable Detail Content */}
            <div className="flex-1 overflow-y-auto px-5 pt-5 pb-24 bg-white" style={{ scrollbarWidth: "none" }}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[13px] text-gray-500 font-medium flex items-center gap-1 mb-1">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    {selectedKos.address}
                  </p>
                  <div className="flex items-center gap-1.5 text-[12px]">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-900">4.8</span>
                    <span className="text-gray-400">(120 ulasan)</span>
                    <span className="text-gray-300 mx-1">•</span>
                    <span className="text-blue-500 font-bold">Pemilik Responsif</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-extrabold text-[15px] text-gray-900 mb-3">Fasilitas Kos</h3>
                <div className="grid grid-cols-4 gap-3">
                  {selectedKos.facilities.map((f, i) => {
                    let FIcon = Wifi;
                    if (f.includes("AC")) FIcon = Wind;
                    if (f.includes("KM")) FIcon = Bath;
                    if (f.includes("Dapur")) FIcon = Utensils;
                    if (f.includes("Parkir")) FIcon = Bike;
                    if (f.includes("Laundry")) FIcon = Shirt;
                    return (
                      <div key={i} className="flex flex-col items-center justify-center gap-2 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                        <FIcon size={20} className="text-primary" />
                        <span className="text-[9px] font-bold text-gray-600 text-center">{f}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-extrabold text-[15px] text-gray-900 mb-2">Deskripsi</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  Kos {selectedKos.type} eksklusif dengan fasilitas lengkap, bersih, dan aman. Lokasi strategis dekat dengan area perkantoran PGE dan pusat makanan. Harga sudah termasuk air, sampah, dan WiFi.
                </p>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 flex items-center gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 font-medium mb-0.5">Harga sewa</p>
                <p className="text-[18px] font-black text-primary leading-none">{rp(selectedKos.price)} <span className="text-[11px] font-medium text-gray-400">/ bln</span></p>
              </div>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-12 h-12 rounded-2xl border-2 border-primary text-primary flex items-center justify-center shrink-0 hover:bg-green-50 transition-colors"
              >
                <MessageCircle size={20} />
              </button>
              <button 
                onClick={() => setIsBookingFormOpen(true)}
                disabled={!selectedKos.available}
                className={`flex-[1.5] h-12 rounded-2xl font-black text-[14px] flex items-center justify-center transition-transform active:scale-95 ${selectedKos.available ? "bg-primary text-white shadow-lg shadow-green-500/30" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                {selectedKos.available ? "Booking & DP" : "Kamar Penuh"}
              </button>
            </div>
          </motion.div>
        )}

        {/* CHAT DRAWER */}
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-sm flex flex-col justify-end"
          >
            <div className="flex-1" onClick={() => setIsChatOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-t-[32px] h-[75%] flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-primary font-bold">
                    P
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[15px] text-gray-900">Pemilik {selectedKos?.name}</h3>
                    <p className="text-[11px] text-green-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Sedang Online
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#F7FAF8]">
                {chatHistory.map((chat, idx) => (
                  <div key={idx} className={`max-w-[80%] rounded-2xl p-3 ${chat.sender === "me" ? "bg-primary text-white self-end rounded-br-sm shadow-md shadow-green-500/10" : "bg-white text-gray-800 border border-gray-100 self-start rounded-bl-sm shadow-sm"}`}>
                    <p className="text-[13px] font-medium leading-relaxed">{chat.text}</p>
                    <p className={`text-[9px] mt-1 text-right ${chat.sender === "me" ? "text-green-100" : "text-gray-400"}`}>{chat.time}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200">
                  <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                    <Plus size={18} />
                  </button>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    className="flex-1 bg-transparent text-[13px] font-medium focus:outline-none placeholder:text-gray-400"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && chatMessage.trim()) {
                        setChatHistory([...chatHistory, { text: chatMessage, sender: "me", time: "10:05" }]);
                        setChatMessage("");
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (chatMessage.trim()) {
                        setChatHistory([...chatHistory, { text: chatMessage, sender: "me", time: "10:05" }]);
                        setChatMessage("");
                      }
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${chatMessage.trim() ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}
                  >
                    <Send size={14} className={chatMessage.trim() ? "ml-0.5" : ""} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* BOOKING FORM DRAWER */}
        {isBookingFormOpen && selectedKos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end"
          >
            <div className="flex-1" onClick={() => paymentStatus === "idle" && setIsBookingFormOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white rounded-t-[32px] overflow-hidden"
            >
              {paymentStatus === "idle" && (
                <>
                  <div className="p-5 pb-3 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h3 className="font-extrabold text-[18px] text-gray-900">Form Booking Kos</h3>
                      <p className="text-[11px] font-medium text-gray-500">Amankan kamar dengan DP 20%</p>
                    </div>
                    <button onClick={() => setIsBookingFormOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors rounded-full">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-5 max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    <div className="flex items-center gap-3 p-3 bg-[#E8F5EE] rounded-2xl mb-5">
                      <img src={selectedKos.img} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-extrabold text-[13px] text-gray-900">{selectedKos.name}</p>
                        <p className="text-[11px] text-primary font-bold">{rp(selectedKos.price)} / bln</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">Nama Penyewa</label>
                        <input type="text" value={bookingName} onChange={e => setBookingName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[13px] font-bold text-gray-800 focus:outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">No WhatsApp Aktif</label>
                        <input type="tel" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[13px] font-bold text-gray-800 focus:outline-none focus:border-primary transition-colors" />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">Tgl. Masuk Kos</label>
                          <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[13px] font-bold text-gray-800 focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="flex-[0.5]">
                          <label className="text-[11px] font-bold text-gray-500 mb-1.5 block">Durasi (Bln)</label>
                          <div className="relative">
                            <input type="number" min="1" max="12" value={bookingDuration} onChange={e => setBookingDuration(parseInt(e.target.value) || 1)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-8 text-[13px] font-bold text-gray-800 focus:outline-none focus:border-primary transition-colors" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400 pointer-events-none">bln</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-gray-100 border-dashed">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[12px] text-gray-500 font-medium">Total Harga Sewa</span>
                        <span className="text-[12px] text-gray-900 font-bold">{rp(selectedKos.price * bookingDuration)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl border border-green-100 mt-3">
                        <span className="text-[13px] font-extrabold text-gray-900 flex items-center gap-1.5">
                          <Wallet size={16} className="text-primary" /> DP (20%)
                        </span>
                        <span className="text-[16px] font-black text-primary">{rp(selectedKos.price * bookingDuration * 0.2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-2 border-t border-gray-100 bg-white">
                    <button 
                      onClick={handleBookingSubmit}
                      disabled={!bookingDate}
                      className={`w-full py-4 rounded-[16px] font-black text-[14px] flex items-center justify-center gap-2 transition-all active:scale-95 ${bookingDate ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-green-500/30' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      Bayar DP {rp(selectedKos.price * bookingDuration * 0.2)} <ChevronRight size={16} />
                    </button>
                  </div>
                </>
              )}

              {/* Payment Processing/Success */}
              {paymentStatus !== "idle" && (
                <div className="p-5 flex flex-col min-h-[350px]">
                  {paymentStatus === "payment_method" ? (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => setPaymentStatus("idle")} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                          <ArrowLeft size={16} className="text-gray-600" />
                        </button>
                        <h3 className="font-extrabold text-[16px] text-gray-900">Pilih Pembayaran</h3>
                      </div>
                      
                      <div className="space-y-3 flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                        {[
                          { id: "GoPay", desc: "Bayar instan dengan GoPay", color: "text-blue-500", bg: "bg-blue-50" },
                          { id: "BCA Virtual Account", desc: "Transfer otomatis", color: "text-blue-600", bg: "bg-blue-50" },
                          { id: "OVO", desc: "Cashback hingga 10k", color: "text-purple-500", bg: "bg-purple-50" },
                          { id: "ShopeePay", desc: "Gratis biaya admin", color: "text-orange-500", bg: "bg-orange-50" },
                        ].map(m => (
                          <div 
                            key={m.id}
                            onClick={() => setSelectedPaymentMethod(m.id)}
                            className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${selectedPaymentMethod === m.id ? "border-primary bg-green-50/50" : "border-gray-100 bg-white"}`}
                          >
                            <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center`}>
                              <Wallet size={18} className={m.color} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-extrabold text-[13px] text-gray-900">{m.id}</h4>
                              <p className="text-[10px] text-gray-500">{m.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === m.id ? "border-primary bg-primary" : "border-gray-200"}`}>
                              {selectedPaymentMethod === m.id && <Check size={12} className="text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button 
                          onClick={handlePaymentConfirm}
                          className="w-full py-4 rounded-[16px] font-black text-[14px] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                        >
                          Lanjutkan Pembayaran <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ) : paymentStatus === "processing" ? (
                    <div className="flex flex-col items-center justify-center flex-1 h-full py-10">
                      <div className="w-16 h-16 border-4 border-gray-100 border-t-primary rounded-full animate-spin mb-4" />
                      <p className="font-extrabold text-[15px] text-gray-900">Memproses Pembayaran...</p>
                      <p className="text-[11px] text-gray-500 mt-1">Menghubungkan ke {selectedPaymentMethod}</p>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col h-full"
                    >
                      <div className="bg-[#E8F5EE] rounded-[24px] p-6 flex flex-col items-center text-center relative overflow-hidden mb-5">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
                        <div className="w-16 h-16 bg-white text-green-500 rounded-full flex items-center justify-center mb-4 shadow-sm relative z-10">
                          <Check size={32} className="stroke-[4px]" />
                        </div>
                        <h3 className="font-black text-[20px] text-gray-900 mb-1 relative z-10">Booking Berhasil!</h3>
                        <p className="text-[12px] text-gray-600 relative z-10">Kamar Anda telah diamankan.</p>
                      </div>

                      {/* E-Bill Card */}
                      <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm mb-5 relative">
                        <div className="absolute top-0 left-5 right-5 h-[1px] border-t-2 border-dashed border-gray-200 -mt-[1px]" />
                        <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#F7FAF8] rounded-full border-r border-b border-transparent" />
                        <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#F7FAF8] rounded-full border-l border-b border-transparent" />

                        <div className="text-center mb-5">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">E-Receipt</p>
                          <p className="font-extrabold text-[14px] text-gray-900">INV/KOS/{Math.floor(Math.random()*10000)}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-gray-500">Kos</span>
                            <span className="text-[11px] font-bold text-gray-900 text-right max-w-[120px] truncate">{selectedKos.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-gray-500">Tanggal Masuk</span>
                            <span className="text-[11px] font-bold text-gray-900">{bookingDate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-gray-500">Metode</span>
                            <span className="text-[11px] font-bold text-gray-900">{selectedPaymentMethod}</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-3 mt-3">
                            <span className="text-[12px] font-bold text-gray-900">Total DP (20%)</span>
                            <span className="text-[16px] font-black text-primary">{rp(selectedKos.price * bookingDuration * 0.2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex flex-col gap-3">
                        <button 
                          onClick={() => {
                            const btn = document.getElementById("download-btn");
                            if (btn) {
                              btn.innerHTML = "<span class='flex items-center gap-2 justify-center'><svg class='animate-spin h-4 w-4 text-primary' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'><circle class='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' stroke-width='4'></circle><path class='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path></svg> Mengunduh...</span>";
                              setTimeout(() => {
                                btn.innerHTML = "<span class='flex items-center gap-2 justify-center text-primary'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-check'><path d='M20 6 9 17l-5-5'/></svg> Tersimpan!</span>";
                              }, 1500);
                            }
                          }}
                          id="download-btn"
                          className="w-full py-3.5 rounded-[16px] font-black text-[13px] bg-green-50 text-primary border border-green-100 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                          <Download size={16} /> Unduh Invoice
                        </button>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setIsChatOpen(true)}
                            className="flex-1 py-3.5 rounded-[16px] font-black text-[13px] bg-white border-2 border-gray-100 text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
                          >
                            <MessageCircle size={16} className="text-primary" /> Chat Pemilik
                          </button>
                          <button 
                            onClick={handleCloseSuccess}
                            className="flex-1 py-3.5 rounded-[16px] font-black text-[13px] bg-gray-900 text-white hover:bg-gray-800 transition-all active:scale-95"
                          >
                            Selesai & Kembali
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

function PesananScreen({ 
  navigate, 
  myOrders, 
  setMyOrders,
  setActiveTrackingOrderId,
  dompetBalance,
  setDompetBalance,
  showToast
}: Nav & { 
  myOrders: any[]; 
  setMyOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTrackingOrderId: (id: string | null) => void; 
  dompetBalance: number;
  setDompetBalance: React.Dispatch<React.SetStateAction<number>>;
  showToast: (m: string) => void;
}) {
  const [tab, setTab] = useState(0);
  const tabs = ["Aktif", "Selesai", "Dibatalkan"];
  const filtered = [
    myOrders.filter(o => o.status === "Dikirim" || o.status === "Diproses" || o.status === "Aktif" || o.status === "Menunggu Pelunasan"),
    myOrders.filter(o => o.status === "Selesai"),
    [],
  ][tab];

  const handleLunasi = (order: any) => {
    const sisa = order.sisaAmount;
    if (dompetBalance < sisa) {
      showToast("Saldo Dompet Rangers tidak mencukupi untuk pelunasan!");
      return;
    }

    const confirm = window.confirm(`Apakah Anda yakin ingin melunasi sisa pembayaran sebesar ${rp(sisa)} untuk ${order.item} menggunakan Dompet Rangers?`);
    if (!confirm) return;

    setDompetBalance(prev => prev - sisa);
    setMyOrders(prev => prev.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: "Diproses",
          statusColor: "orange",
          sisaAmount: 0,
          paymentType: "Full",
          paymentHistory: [
            ...o.paymentHistory,
            { label: "Pelunasan PO", amount: sisa, date: "Hari Ini", method: "Dompet Rangers" }
          ]
        };
      }
      return o;
    }));

    showToast("Pelunasan PO Katering berhasil!");
  };

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
                <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm border border-black/[0.02]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: o.color + "20" }}>
                      <Icon size={18} style={{ color: o.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground font-semibold">#{o.id} · {o.type}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[o.statusColor] || statusColor.green}`}>{o.status}</span>
                      </div>
                      <p className="font-bold text-sm text-foreground mt-0.5 truncate">{o.item}</p>
                      <p className="text-muted-foreground text-xs">{o.detail}</p>
                    </div>
                  </div>

                  {/* Payment History and Installment timeline */}
                  {o.paymentHistory && o.paymentHistory.length > 0 && (
                    <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1.5">
                      <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wide">Riwayat Pembayaran PO</p>
                      {o.paymentHistory.map((h: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] text-foreground font-semibold">
                          <span className="text-muted-foreground">✓ {h.label} ({h.method})</span>
                          <span className="text-primary font-bold">{rp(h.amount)}</span>
                        </div>
                      ))}
                      {o.sisaAmount > 0 && (
                        <div className="flex justify-between items-center text-[10px] text-amber-700 font-bold border-t border-dashed border-border pt-1.5 mt-1">
                          <span>○ Sisa Pembayaran PO</span>
                          <span>{rp(o.sisaAmount)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Down Payment (DP) warning banner & payment trigger */}
                  {o.status === "Menunggu Pelunasan" && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-amber-800 font-bold">⚠️ Menunggu Pelunasan PO</span>
                        <span className="text-amber-900 font-extrabold">{rp(o.sisaAmount)}</span>
                      </div>
                      <button 
                        onClick={() => handleLunasi(o)}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer text-center"
                      >
                        Lunasi Sekarang
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground">{o.date}</p>
                      <p className="font-extrabold text-sm text-foreground">{rp(o.total)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setActiveTrackingOrderId(o.id);
                          if (o.status === "Selesai" && !o.reviewRating) {
                            navigate("c_rating");
                          } else {
                            navigate("c_tracking");
                          }
                        }}
                        className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer"
                      >
                        {o.status === "Selesai" ? (o.reviewRating ? "Lacak / Detail" : "Beri Ulasan") : "Lacak"}
                      </button>
                    </div>
                  </div>
                  {o.reviewRating > 0 && (
                    <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-dashed border-border flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground">Rating Anda:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} size={10} className={star <= o.reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      {o.reviewText && (
                        <p className="text-[10px] text-muted-foreground italic leading-relaxed">"{o.reviewText}"</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function InboxScreen({
  navigate,
  driverChatMessages,
  unreadChatCount,
  setUnreadChatCount,
  supportChatMessages,
  unreadSupportCount,
  setUnreadSupportCount,
  cateringChatMessages,
  unreadCateringCount,
  setUnreadCateringCount,
  cateringStoreName
}: Nav & {
  driverChatMessages: { id: string; sender: "driver" | "user"; text: string; time: string }[];
  unreadChatCount: number;
  setUnreadChatCount: (c: number) => void;
  supportChatMessages: { id: string; sender: "support" | "user"; text: string; time: string }[];
  unreadSupportCount: number;
  setUnreadSupportCount: (c: number) => void;
  cateringChatMessages: { id: string; sender: "catering" | "user"; text: string; time: string }[];
  unreadCateringCount: number;
  setUnreadCateringCount: (c: number) => void;
  cateringStoreName: string;
}) {
  const [activeTab, setActiveTab] = useState<"chat" | "notif">("chat");

  const notifColors: Record<string, string> = {
    order: "bg-blue-100", promo: "bg-orange-100", info: "bg-green-100", system: "bg-gray-100",
  };
  const notifTextColors: Record<string, string> = {
    order: "text-blue-600", promo: "text-orange-600", info: "text-green-600", system: "text-gray-600",
  };
  const notifIcons: Record<string, React.ElementType> = {
    order: Package, promo: Tag, info: Info, system: Bell,
  };
  
  const unreadNotifs = NOTIFS.filter(n => !n.read).length;
  const totalUnreadChats = unreadChatCount + unreadSupportCount + unreadCateringCount;

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <div className="bg-white shrink-0">
        <StatusBar />
        <div className="px-5 pb-1 pt-1">
          <h2 className="font-extrabold text-lg text-foreground">Inbox</h2>
        </div>
        <div className="flex border-b border-border">
          <button 
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-3 text-xs font-extrabold text-center border-b-2 transition-all relative cursor-pointer ${activeTab === "chat" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          >
            Chat
            {totalUnreadChats > 0 && (
              <span className="ml-1.5 bg-green-500 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">
                {totalUnreadChats}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("notif")}
            className={`flex-1 py-3 text-xs font-extrabold text-center border-b-2 transition-all relative cursor-pointer ${activeTab === "notif" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          >
            Notifikasi
            {unreadNotifs > 0 && (
              <span className="ml-1.5 bg-accent text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">
                {unreadNotifs}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {activeTab === "chat" ? (
          <div className="flex flex-col">
            {/* Real-time Driver Chat Row */}
            <div 
              onClick={() => {
                setUnreadChatCount(0);
                navigate("c_driver_chat");
              }}
              className={`flex gap-3 px-4 py-4 border-b border-border relative bg-white cursor-pointer hover:bg-muted/30 transition-colors`}
            >
              {unreadChatCount > 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-lg relative">
                🏍️
                {unreadChatCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs ${unreadChatCount > 0 ? "font-extrabold text-foreground" : "font-bold text-foreground"}`}>
                    Pak Rahman (Rangers Driver)
                  </p>
                  <span className="text-[9px] text-muted-foreground shrink-0">
                    {driverChatMessages[driverChatMessages.length - 1]?.time || "Baru saja"}
                  </span>
                </div>
                <p className={`text-xs truncate mt-1 leading-normal ${unreadChatCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                  {driverChatMessages[driverChatMessages.length - 1]?.text || "Mulai chat..."}
                </p>
              </div>
            </div>

            {/* Real-time Catering Admin Chat Row */}
            {cateringChatMessages.length > 0 && (
              <div 
                onClick={() => {
                  setUnreadCateringCount(0);
                  navigate("c_catering_chat");
                }}
                className={`flex gap-3 px-4 py-4 border-b border-border relative bg-white cursor-pointer hover:bg-muted/30 transition-colors`}
              >
                {unreadCateringCount > 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-lg relative">
                  🍱
                  {unreadCateringCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs ${unreadCateringCount > 0 ? "font-extrabold text-foreground" : "font-bold text-foreground"}`}>
                      Admin {cateringStoreName || "Catering"}
                    </p>
                    <span className="text-[9px] text-muted-foreground shrink-0">
                      {cateringChatMessages[cateringChatMessages.length - 1]?.time || "Baru saja"}
                    </span>
                  </div>
                  <p className={`text-xs truncate mt-1 leading-normal ${unreadCateringCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                    {cateringChatMessages[cateringChatMessages.length - 1]?.text || "Mulai chat..."}
                  </p>
                </div>
              </div>
            )}

            {/* Real-time Support Chat Row */}
            <div 
              onClick={() => {
                setUnreadSupportCount(0);
                navigate("c_support_chat");
              }}
              className={`flex gap-3 px-4 py-4 border-b border-border relative bg-white cursor-pointer hover:bg-muted/30 transition-colors`}
            >
              {unreadSupportCount > 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-lg relative">
                🛡️
                {unreadSupportCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs ${unreadSupportCount > 0 ? "font-extrabold text-foreground" : "font-bold text-foreground"}`}>
                    Rangers Care (Bantuan)
                  </p>
                  <span className="text-[9px] text-muted-foreground shrink-0">
                    {supportChatMessages[supportChatMessages.length - 1]?.time || "Kemarin"}
                  </span>
                </div>
                <p className={`text-xs truncate mt-1 leading-normal ${unreadSupportCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                  {supportChatMessages[supportChatMessages.length - 1]?.text || "Mulai chat..."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Notifications Tab Content */
          <div className="flex flex-col">
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
                      <p className={`text-xs leading-tight ${!n.read ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>{n.title}</p>
                      <span className="text-[9px] text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.msg}</p>
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

// ─── NEW CUSTOMER SCREENS ──────────────────────────────────────────────────────
function CartScreen({
  navigate,
  cart,
  setCart,
  dompetBalance,
  setDompetBalance,
  myOrders,
  setMyOrders,
  setActiveTrackingOrderId,
  showToast,
  setTempCheckout,
  setDriverChatMessages,
  setUnreadChatCount
}: {
  navigate: (s: Screen) => void;
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  dompetBalance: number;
  setDompetBalance: React.Dispatch<React.SetStateAction<number>>;
  myOrders: any[];
  setMyOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTrackingOrderId: (id: string | null) => void;
  showToast: (m: string) => void;
  setTempCheckout: (data: any) => void;
  setDriverChatMessages: (msgs: any[]) => void;
  setUnreadChatCount: (c: number) => void;
}) {
  const [payMethod, setPayMethod] = useState<"dompet" | "qris">("dompet");
  const [address, setAddress] = useState("Jl. Aster No. 7, Kamojang, Kab. Garut (Kos Putri Melati)");
  const [driverNote, setDriverNote] = useState("");
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);
  const [promoError, setPromoError] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? 8000 : 0;
  const total = Math.max(0, subtotal + shippingFee + tip - discount);

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as any[]);
  };

  const handleApplyPromo = () => {
    const code = voucherInput.toUpperCase().trim();
    if (code === "BERSIH20") {
      setAppliedVoucher(code);
      setDiscount(Math.round(subtotal * 0.2));
      setPromoError("");
      showToast("Voucher BERSIH20 berhasil diterapkan (Diskon 20%)!");
    } else if (code === "KAMOJANG") {
      setAppliedVoucher(code);
      setDiscount(Math.min(subtotal, 10000));
      setPromoError("");
      showToast("Voucher KAMOJANG berhasil diterapkan (Potongan Rp 10.000)!");
    } else {
      setPromoError("Kode voucher tidak valid!");
      setAppliedVoucher(null);
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const checkoutData = {
      address,
      driverNote,
      voucherCode: appliedVoucher,
      discount,
      tip,
      subtotal,
      shippingFee,
      total
    };

    if (payMethod === "dompet") {
      if (dompetBalance < total) {
        showToast("Saldo Dompet Rangers tidak mencukupi!");
        return;
      }
      setDompetBalance(prev => prev - total);
      const newOrderId = `RNG${Math.floor(100 + Math.random() * 900)}`;
      const firstItem = cart[0];
      const detailStr = cart.length > 1 ? `${firstItem.name} + ${cart.length - 1} item lainnya` : firstItem.name;
      
      const newOrder = {
        id: newOrderId,
        type: "Marketplace",
        icon: Store,
        color: "#1B7A4E",
        item: detailStr,
        detail: firstItem.store,
        status: "Diproses",
        statusColor: "orange",
        date: "Hari Ini",
        total: total,
        items: [...cart],
        progressState: 0,
        payMethod: "Dompet Rangers",
        reviewText: "",
        reviewRating: 0,
        address,
        driverNote,
        voucherCode: appliedVoucher,
        discount,
        tip,
        subtotal,
        shippingFee
      };

      setMyOrders(prev => [newOrder, ...prev]);
      setActiveTrackingOrderId(newOrderId);
      setCart([]);
      
      // Reset Chat states for Gojek chat integration
      setDriverChatMessages([
        { id: "1", sender: "driver", text: "Halo kak, pesanan sudah saya terima ya. Sedang disiapkan toko.", time: "Baru saja" }
      ]);
      setUnreadChatCount(1);
      
      showToast("Pembayaran Berhasil! Mengalihkan ke tracking...");
      navigate("c_tracking");
    } else {
      setTempCheckout(checkoutData);
      navigate("c_qris");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <StatusBar />
      <BackHeader title="Keranjang Belanja" onBack={() => navigate("c_marketplace")} />
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground opacity-50">
              <ShoppingCart size={32} />
            </div>
            <p className="text-muted-foreground text-sm font-semibold">Keranjang Anda Kosong</p>
            <p className="text-muted-foreground/60 text-xs text-center max-w-xs">Ayo telusuri Marketplace UMKM Kamojang dan temukan produk favoritmu!</p>
            <button onClick={() => navigate("c_marketplace")} className="mt-4 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer">
              Cari Produk
            </button>
          </div>
        ) : (
          <>
            {/* Alamat Pengiriman (Gojek-style) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                <MapPin size={15} className="text-primary" />
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Alamat Pengiriman</h3>
              </div>
              <textarea 
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Tulis alamat pengiriman secara detail..."
                className="w-full h-14 p-2.5 bg-muted rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none border border-transparent font-medium"
              />
              <div className="flex items-center gap-2 bg-muted px-3 py-2.5 rounded-xl">
                <Edit3 size={12} className="text-muted-foreground shrink-0" />
                <input 
                  value={driverNote}
                  onChange={e => setDriverNote(e.target.value)}
                  placeholder="Catatan untuk driver (contoh: Pagar hitam, titip satpam)"
                  className="flex-1 bg-transparent text-[11px] outline-none font-medium"
                />
              </div>
            </div>

            {/* List items */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-1">Daftar Produk</h3>
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground leading-tight truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{item.store}</p>
                    <p className="text-primary font-bold text-xs mt-1">{rp(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-gray-200 cursor-pointer">
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-bold text-foreground w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-gray-200 cursor-pointer">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Voucher / Promo (Gojek-style) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag size={15} className="text-primary" />
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Makin Hemat Pakai Promo</h3>
              </div>
              <div className="flex gap-2">
                <input 
                  value={voucherInput}
                  onChange={e => setVoucherInput(e.target.value)}
                  placeholder="Masukkan kode voucher (BERSIH20 / KAMOJANG)"
                  className="flex-1 px-3 py-2 bg-muted rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium border border-transparent"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
              {appliedVoucher && (
                <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
                  ✓ Voucher {appliedVoucher} berhasil digunakan! Potongan {rp(discount)}.
                </p>
              )}
              {promoError && (
                <p className="text-[10px] text-red-600 font-bold mt-2">
                  ✗ {promoError}
                </p>
              )}
            </div>

            {/* Tip Driver (Gojek-style) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <Gift size={15} className="text-primary" />
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">Kasi Tip Apresiasi ke Driver</h3>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed -mt-1">
                Tip 100% akan diteruskan kepada Rangers Driver untuk mengapresiasi jasanya.
              </p>
              <div className="flex gap-2">
                {[0, 2000, 5000, 10000].map(val => (
                  <button 
                    key={val} 
                    onClick={() => setTip(val)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${tip === val ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-muted-foreground border-border hover:bg-muted"}`}
                  >
                    {val === 0 ? "Tanpa Tip" : `+${val.toLocaleString("id-ID")}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-3">Pilih Metode Pembayaran</h3>
              <div className="flex flex-col gap-2.5">
                <button 
                  onClick={() => setPayMethod("dompet")}
                  className={`w-full p-3 rounded-xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${payMethod === "dompet" ? "border-primary bg-secondary/30" : "border-border hover:bg-muted"}`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet size={20} className={payMethod === "dompet" ? "text-primary" : "text-muted-foreground"} />
                    <div>
                      <p className="text-xs font-bold text-foreground">Dompet Rangers</p>
                      <p className="text-[10px] text-muted-foreground">Saldo: {rp(dompetBalance)}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "dompet" ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                    {payMethod === "dompet" && <Check size={12} className="text-white" />}
                  </div>
                </button>

                <button 
                  onClick={() => setPayMethod("qris")}
                  className={`w-full p-3 rounded-xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${payMethod === "qris" ? "border-primary bg-secondary/30" : "border-border hover:bg-muted"}`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode size={20} className={payMethod === "qris" ? "text-primary" : "text-muted-foreground"} />
                    <div>
                      <p className="text-xs font-bold text-foreground">Scan QRIS Otomatis</p>
                      <p className="text-[10px] text-muted-foreground">Bayar aman instan lewat e-wallet/bank</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${payMethod === "qris" ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                    {payMethod === "qris" && <Check size={12} className="text-white" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
              <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-1">Rincian Pembayaran</h3>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Subtotal Produk</span>
                <span className="text-foreground font-semibold">{rp(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Ongkos Kirim Kurir</span>
                <span className="text-foreground font-semibold">{rp(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-green-600 font-medium">
                  <span>Diskon Voucher ({appliedVoucher})</span>
                  <span>-{rp(discount)}</span>
                </div>
              )}
              {tip > 0 && (
                <div className="flex justify-between text-xs text-foreground font-medium">
                  <span>Apresiasi Tip Kurir</span>
                  <span>+{rp(tip)}</span>
                </div>
              )}
              <div className="h-px bg-border my-1" />
              <div className="flex justify-between text-sm">
                <span className="font-bold text-foreground">Total Pembayaran</span>
                <span className="font-extrabold text-primary">{rp(total)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 bg-white border-t border-border flex flex-col gap-3">
          {payMethod === "dompet" && dompetBalance < total && (
            <div className="px-3 py-2 bg-red-50 rounded-xl text-[10px] text-red-600 font-semibold flex items-center gap-1.5">
              <AlertCircle size={12} />
              <span>Saldo Dompet Rangers kurang {rp(total - dompetBalance)}</span>
            </div>
          )}
          <button 
            onClick={handleCheckout}
            disabled={payMethod === "dompet" && dompetBalance < total}
            className="w-full py-4 bg-primary text-white font-bold text-base rounded-2xl disabled:bg-muted disabled:text-muted-foreground cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Bayar Sekarang ({rp(total)})</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function QrisScreen({
  navigate,
  cart,
  setCart,
  myOrders,
  setMyOrders,
  setActiveTrackingOrderId,
  showToast,
  tempCheckout,
  setDriverChatMessages,
  setUnreadChatCount
}: {
  navigate: (s: Screen) => void;
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  myOrders: any[];
  setMyOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTrackingOrderId: (id: string | null) => void;
  showToast: (m: string) => void;
  tempCheckout: any;
  setDriverChatMessages: (msgs: any[]) => void;
  setUnreadChatCount: (c: number) => void;
}) {
  const total = tempCheckout ? tempCheckout.total : (cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 8000);

  const handleQrisSuccess = () => {
    const newOrderId = `RNG${Math.floor(100 + Math.random() * 900)}`;
    const firstItem = cart[0];
    const detailStr = cart.length > 1 ? `${firstItem.name} + ${cart.length - 1} item lainnya` : firstItem.name;

    const newOrder = {
      id: newOrderId,
      type: "Marketplace",
      icon: Store,
      color: "#1B7A4E",
      item: detailStr,
      detail: firstItem.store,
      status: "Diproses",
      statusColor: "orange",
      date: "Hari Ini",
      total: total,
      items: [...cart],
      progressState: 0,
      payMethod: "QRIS Otomatis",
      reviewText: "",
      reviewRating: 0,
      address: tempCheckout?.address || "Jl. Aster No. 7, Kamojang, Kab. Garut (Kos Putri Melati)",
      driverNote: tempCheckout?.driverNote || "",
      voucherCode: tempCheckout?.voucherCode || null,
      discount: tempCheckout?.discount || 0,
      tip: tempCheckout?.tip || 0,
      subtotal: tempCheckout?.subtotal || (total - 8000),
      shippingFee: tempCheckout?.shippingFee || 8000
    };

    setMyOrders(prev => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrderId);
    setCart([]);

    // Reset Chat states for QRIS checkout
    setDriverChatMessages([
      { id: "1", sender: "driver", text: "Halo kak, pesanan sudah saya terima ya. Sedang disiapkan toko.", time: "Baru saja" }
    ]);
    setUnreadChatCount(1);

    showToast("Pembayaran QRIS Sukses!");
    navigate("c_tracking");
  };

  return (
    <div className="flex flex-col h-full bg-[#1B7A4E]">
      <StatusBar light />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-white text-center">
        <h2 className="text-xl font-extrabold mb-1">Pembayaran QRIS</h2>
        <p className="text-green-200 text-xs mb-6">PGE Kamojang Community Payment Gate</p>

        <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-xs text-foreground flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">QRIS STANDAR NASIONAL</span>
            <span className="text-[10px] font-bold text-primary">RANGERS APP</span>
          </div>
          
          <div className="text-xs text-muted-foreground mb-1">Jumlah Tagihan</div>
          <div className="text-xl font-extrabold text-foreground mb-4">{rp(total)}</div>
          
          <div className="w-48 h-48 border-4 border-gray-100 p-2 rounded-2xl flex items-center justify-center relative mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full text-foreground fill-current">
              <rect x="0" y="0" width="25" height="25" fill="#000" />
              <rect x="5" y="5" width="15" height="15" fill="#fff" />
              <rect x="9" y="9" width="7" height="7" fill="#000" />
              
              <rect x="75" y="0" width="25" height="25" fill="#000" />
              <rect x="75" y="5" width="15" height="15" fill="#fff" />
              <rect x="79" y="9" width="7" height="7" fill="#000" />

              <rect x="0" y="75" width="25" height="25" fill="#000" />
              <rect x="5" y="75" width="15" height="15" fill="#fff" />
              <rect x="9" y="79" width="7" height="7" fill="#000" />

              <rect x="35" y="10" width="10" height="20" />
              <rect x="55" y="5" width="15" height="10" />
              <rect x="40" y="40" width="20" height="20" />
              <rect x="10" y="45" width="15" height="15" />
              <rect x="70" y="40" width="15" height="15" />
              <rect x="30" y="70" width="20" height="15" />
              <rect x="65" y="70" width="15" height="20" />
              <rect x="45" y="85" width="15" height="10" />
              
              <circle cx="50" cy="50" r="12" fill="#fff" />
              <circle cx="50" cy="50" r="9" fill="#1B7A4E" />
              <path d="M47 52 L50 47 L53 52" fill="#fff" />
            </svg>
            <div className="absolute inset-0 bg-black/5 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="bg-white px-2 py-1 rounded text-[9px] font-bold shadow">Simulasi QRIS</span>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground text-center">
            Pindai QR di atas menggunakan aplikasi perbankan or e-wallet Anda
          </p>
        </div>

        <button 
          onClick={handleQrisSuccess}
          className="w-full max-w-xs mt-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold rounded-2xl text-sm transition-all shadow-md cursor-pointer"
        >
          ✅ Simulasikan Bayar Sukses
        </button>

        <button 
          onClick={() => navigate("c_cart")}
          className="text-xs text-green-200 mt-4 hover:underline cursor-pointer"
        >
          Batal & Kembali ke Keranjang
        </button>
      </div>
    </div>
  );
}

function TrackingScreen({
  navigate,
  activeTrackingOrderId,
  myOrders,
  setMyOrders,
  showToast,
  unreadChatCount,
  addDriverMessage
}: {
  navigate: (s: Screen) => void;
  activeTrackingOrderId: string | null;
  myOrders: any[];
  setMyOrders: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (m: string) => void;
  unreadChatCount: number;
  addDriverMessage: (text: string) => void;
}) {
  const order = myOrders.find(o => o.id === activeTrackingOrderId);
  const [phase, setPhase] = useState(0); 
  const [tick, setTick] = useState(0);

  const triggerDriverMessage = (nextPhase: number) => {
    let msg = "";
    if (nextPhase === 1) msg = "Saya sedang menuju ke toko ya kak.";
    if (nextPhase === 2) msg = "Makanan sudah serah terima, ini saya bersiap jalan ke alamat kakak.";
    if (nextPhase === 3) msg = "Saya sudah dekat di area tujuan kak, mohon ditunggu.";
    if (nextPhase === 4) msg = "Saya sudah di depan lokasi pengiriman ya kak.";
    
    if (msg) {
      setTimeout(() => {
        addDriverMessage(msg);
      }, 1500); // Realistic 1.5s delay
    }
  };

  useEffect(() => {
    if (!order) return;
    
    const interval = setInterval(() => {
      setTick(prevTick => {
        if (prevTick >= 100) {
          setPhase(prevPhase => {
            if (prevPhase < 4) {
              const nextPhase = prevPhase + 1;
              triggerDriverMessage(nextPhase);
              setMyOrders(prevOrders => prevOrders.map(o => {
                if (o.id === activeTrackingOrderId) {
                  let newStatus = o.status;
                  let newColor = o.statusColor;
                  if (nextPhase === 1) { newStatus = "Dikirim"; newColor = "blue"; }
                  if (nextPhase === 4) { newStatus = "Selesai"; newColor = "green"; }
                  return { ...o, status: newStatus, statusColor: newColor, progressState: nextPhase };
                }
                return o;
              }));
              return nextPhase;
            }
            clearInterval(interval);
            return prevPhase;
          });
          return 0;
        }
        
        const step = (phase === 0 || phase === 2) ? 6 : 3;
        return Math.min(100, prevTick + step);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [phase, order, activeTrackingOrderId]);

  if (!order) {
    return (
      <div className="flex flex-col h-full bg-[#F7FAF8] items-center justify-center p-6 text-center">
        <StatusBar />
        <AlertCircle size={40} className="text-red-500 mb-2" />
        <p className="font-bold text-foreground text-sm">Pesanan Tidak Ditemukan</p>
        <button onClick={() => navigate("c_pesanan")} className="mt-4 bg-primary text-white px-4 py-2 rounded-xl text-xs cursor-pointer">
          Kembali
        </button>
      </div>
    );
  }

  const homeX = 60, homeY = 150;
  const storeX = 140, storeY = 50;
  const startX = 100, startY = 180;

  let driverX = startX;
  let driverY = startY;

  if (phase === 0) {
    driverX = startX;
    driverY = startY;
  } else if (phase === 1) {
    const ratio = tick / 100;
    driverX = startX + (storeX - startX) * ratio;
    driverY = startY + (storeY - startY) * ratio;
  } else if (phase === 2) {
    driverX = storeX;
    driverY = storeY;
  } else if (phase === 3) {
    const ratio = tick / 100;
    driverX = storeX + (homeX - storeX) * ratio;
    driverY = storeY + (homeY - storeY) * ratio;
  } else {
    driverX = homeX;
    driverY = homeY;
  }

  const phaseDetails = [
    { title: "Pesanan Diterima", desc: "Toko sedang menyiapkan & memasak makanan Anda", icon: Coffee, color: "text-orange-500" },
    { title: "Kurir Menuju Toko", desc: "Rangers Driver sedang menjemput pesanan Anda", icon: Bike, color: "text-blue-500" },
    { title: "Pesanan Diambil", desc: "Driver telah menerima makanan dari toko dan bersiap berangkat", icon: Package, color: "text-purple-500" },
    { title: "Dalam Perjalanan", desc: "Kurir sedang mengantarkan pesanan ke alamat rumah Anda", icon: Truck, color: "text-primary" },
    { title: "Sampai di Lokasi", desc: "Pesanan Anda telah tiba! Selamat menikmati hidangan Anda", icon: CheckCircle, color: "text-green-500" }
  ];

  const currentPhase = phaseDetails[phase];

  const handleFastForward = () => {
    if (phase < 4) {
      const nextPhase = phase + 1;
      setPhase(nextPhase);
      setTick(0);
      triggerDriverMessage(nextPhase);
      setMyOrders(prevOrders => prevOrders.map(o => {
        if (o.id === activeTrackingOrderId) {
          let newStatus = o.status;
          let newColor = o.statusColor;
          if (nextPhase === 1) { newStatus = "Dikirim"; newColor = "blue"; }
          if (nextPhase === 4) { newStatus = "Selesai"; newColor = "green"; }
          return { ...o, status: newStatus, statusColor: newColor, progressState: nextPhase };
        }
        return o;
      }));
      if (nextPhase === 4) {
        showToast("Pesanan disimulasikan selesai!");
      }
    }
  };

  const etaMins = [15, 12, 9, 5, 0][phase];

  return (
    <div className="flex flex-col h-full bg-white relative">
      <StatusBar />
      <BackHeader title={`Lacak Order: #${order.id}`} onBack={() => navigate("c_pesanan")} />
      
      <div className="w-full h-64 bg-slate-100 relative overflow-hidden border-b border-border">
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          {/* Slate map base */}
          <rect x="0" y="0" width="200" height="200" fill="#F8FAFC" />
          
          {/* Faint block layouts representing urban buildings */}
          <rect x="15" y="10" width="70" height="30" fill="#F1F5F9" rx="3" />
          <rect x="115" y="10" width="70" height="25" fill="#F1F5F9" rx="3" />
          <rect x="15" y="70" width="70" height="60" fill="#F1F5F9" rx="3" />
          <rect x="115" y="70" width="70" height="60" fill="#F1F5F9" rx="3" />
          <rect x="15" y="160" width="30" height="30" fill="#F1F5F9" rx="3" />
          <rect x="115" y="160" width="70" height="30" fill="#F1F5F9" rx="3" />
          <rect x="55" y="160" width="45" height="30" fill="#ECFDF5" rx="3" /> {/* Park */}
          
          {/* Kamojang River representation */}
          <path d="M 0,110 Q 50,115 100,105 T 200,120" stroke="#E0F2FE" strokeWidth="5" fill="none" opacity="0.8" />
          
          {/* Base roads layout */}
          <path d="M 100,0 L 100,200" stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M 100,0 L 100,200" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
          
          <path d="M 100,50 L 140,50" stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M 100,50 L 140,50" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />

          <path d="M 100,150 L 60,150" stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M 100,150 L 60,150" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />

          <path d="M 100,180 L 60,150" stroke="#FFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M 100,180 L 60,150" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />

          {/* Active Navigation Route Highlights */}
          {phase === 1 && (
            <path d="M 100,180 L 100,50 L 140,50" stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="4 2" />
          )}
          {phase >= 3 && (
            <path d="M 140,50 L 100,50 L 100,150 L 60,150" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}

          {/* Merchant Location Pin */}
          <polygon points={`${storeX - 3.5},${storeY - 4} ${storeX + 3.5},${storeY - 4} ${storeX},${storeY}`} fill="#EF4444" />
          <circle cx={storeX} cy={storeY - 11} r="7.5" fill="#EF4444" stroke="#FFF" strokeWidth="1.5" />
          <rect x={storeX - 2.5} y={storeY - 13} width="5" height="4" fill="#FFF" rx="0.5" />
          <polygon points={`${storeX - 3.5},${storeY - 13} ${storeX + 3.5},${storeY - 13} ${storeX + 2},${storeY - 15} ${storeX - 2},${storeY - 15}`} fill="#FFF" />
          <g transform={`translate(${storeX}, ${storeY - 24})`}>
            <rect x="-32" y="-7" width="64" height="14" fill="white" rx="3" stroke="#E2E8F0" strokeWidth="1" />
            <text x="0" y="3" fontSize="7" fontWeight="extrabold" fill="#1E293B" textAnchor="middle">
              {order.detail || "Merchant"}
            </text>
          </g>

          {/* Home Location Pin */}
          <polygon points={`${homeX - 3.5},${homeY - 4} ${homeX + 3.5},${homeY - 4} ${homeX},${homeY}`} fill="#2563EB" />
          <circle cx={homeX} cy={homeY - 11} r="7.5" fill="#2563EB" stroke="#FFF" strokeWidth="1.5" />
          <polygon points={`${homeX},${homeY - 15} ${homeX - 3},${homeY - 12} ${homeX + 3},${homeY - 12}`} fill="#FFF" />
          <rect x={homeX - 2} y={homeY - 12} width="4" height="4" fill="#FFF" />
          <g transform={`translate(${homeX}, ${homeY + 15})`}>
            <rect x="-26" y="-7" width="52" height="14" fill="white" rx="3" stroke="#E2E8F0" strokeWidth="1" />
            <text x="0" y="3" fontSize="7" fontWeight="extrabold" fill="#1E293B" textAnchor="middle">
              Lokasi Anda
            </text>
          </g>

          {/* Driver Locator GPS Indicator */}
          {phase < 4 && (
            <g>
              <circle cx={driverX} cy={driverY} r="10" fill="#10B981" opacity="0.35" className="animate-pulse" />
              <circle cx={driverX} cy={driverY} r="6.5" fill="#10B981" stroke="#FFF" strokeWidth="1.5" />
              <polygon points={`${driverX},${driverY - 3.5} ${driverX - 2.5},${driverY + 2.5} ${driverX},${driverY + 1} ${driverX + 2.5},${driverY + 2.5}`} fill="#FFF" />
            </g>
          )}
        </svg>

        <div className="absolute bottom-3 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-md border border-border flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
            <span>Progress Pengiriman</span>
            <span className="text-primary">{phase * 25}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(phase / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        
        {/* Gojek-style ETA Card */}
        <div className="flex gap-3 items-center bg-primary text-white rounded-2xl p-3.5 shadow-sm relative overflow-hidden">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-green-200 font-extrabold uppercase tracking-wider">Estimasi Waktu Tiba</p>
            <h3 className="text-sm font-extrabold mt-0.5 leading-tight">
              {phase === 4 ? "Pesanan Tiba!" : `Tiba dalam ${etaMins} - ${etaMins + 5} menit`}
            </h3>
            <p className="text-[9px] text-green-100/90 mt-0.5 leading-tight truncate">{currentPhase.title} · {currentPhase.desc}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-lg font-bold shrink-0">
            {phase === 4 ? "🎉" : "⏱️"}
          </div>
        </div>

        {/* Address and driver note */}
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-2.5">
          <div>
            <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider">Alamat Pengiriman</span>
            <p className="text-xs font-bold text-foreground leading-snug mt-0.5">
              {order.address || "Jl. Aster No. 7, Kamojang, Kab. Garut (Kos Putri Melati)"}
            </p>
          </div>
          {order.driverNote && (
            <div className="p-2.5 bg-muted rounded-xl border border-dashed border-border flex items-start gap-1.5">
              <span className="text-[11px] leading-none mt-0.5">📝</span>
              <div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">Catatan Driver</span>
                <p className="text-[11px] font-medium text-foreground leading-normal mt-0.5">"{order.driverNote}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Courier Info Card */}
        <div className="bg-white border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg shrink-0">
              🏍️
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Pak Rahman (Rangers Driver)</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-muted-foreground font-semibold">Supra H 4251 AA</span>
                {order.tip > 0 && (
                  <span className="bg-green-100 text-green-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                    Tip {rp(order.tip)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Gojek-style Chat Button & Call Button */}
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => navigate("c_driver_chat")} 
              className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 cursor-pointer relative"
            >
              <MessageSquare size={14} />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-extrabold text-[8px] w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  {unreadChatCount}
                </span>
              )}
            </button>
            <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 cursor-pointer">
              <Phone size={14} />
            </button>
          </div>
        </div>

        {/* Payment Detail breakdown or Invoice Receipt */}
        {phase === 4 ? (
          /* Gojek-style Paper Invoice Receipt */
          <div className="bg-white border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden">
            <div className="flex flex-col items-center text-center gap-1 pb-3 border-b border-dashed border-border">
              <span className="text-[9px] font-black text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                LUNAS / COMPLETED
              </span>
              <h4 className="text-xs font-black text-foreground uppercase tracking-widest mt-1.5">Rangers App Receipt</h4>
              <p className="text-[9px] text-muted-foreground font-semibold">Order ID: #{order.id} · {order.date || "Hari Ini"}</p>
            </div>

            {/* Purchased Items List */}
            <div className="flex flex-col gap-2 py-0.5">
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block">Rincian Item</span>
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground truncate pr-3">{item.quantity}x {item.name}</span>
                    <span className="text-foreground shrink-0">{rp(item.price * item.quantity)}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{order.item}</span>
                  <span className="text-foreground">{rp(order.subtotal || (order.total - 8000))}</span>
                </div>
              )}
            </div>

            {/* Financial Details */}
            <div className="border-t border-dashed border-border pt-3 flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Subtotal Belanja</span>
                <span className="text-foreground font-semibold">{rp(order.subtotal || (order.total - 8000))}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Ongkos Kirim</span>
                <span className="text-foreground font-semibold">{rp(order.shippingFee || 8000)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-green-600 font-semibold">
                  <span>Diskon Promo ({order.voucherCode || "VOUCHER"})</span>
                  <span>-{rp(order.discount)}</span>
                </div>
              )}
              {order.tip > 0 && (
                <div className="flex justify-between text-xs text-foreground font-semibold">
                  <span>Apresiasi Tip Kurir</span>
                  <span>+{rp(order.tip)}</span>
                </div>
              )}
              <div className="border-t border-dashed border-border my-1" />
              <div className="flex justify-between text-xs font-bold">
                <span className="text-foreground">Metode Pembayaran</span>
                <span className="text-primary">{order.payMethod || "Dompet Rangers"}</span>
              </div>
              <div className="flex justify-between text-sm mt-0.5">
                <span className="font-extrabold text-foreground">Total Pembayaran</span>
                <span className="font-black text-primary">{rp(order.total)}</span>
              </div>
            </div>

            {/* Footer paper receipt jagged visual */}
            <div className="border-t border-dashed border-border pt-2.5 text-center">
              <p className="text-[9px] text-muted-foreground font-bold tracking-wide">
                Terima kasih telah berbelanja! 🌿
              </p>
              <p className="text-[8px] text-muted-foreground/60 font-semibold mt-0.5">
                Rangers App PGE Kamojang Community Care
              </p>
            </div>
          </div>
        ) : (
          /* Normal Payment Detail breakdown (while in progress) */
          <div className="bg-white border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Rincian Pembayaran Akhir</h4>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Subtotal Belanja</span>
              <span className="text-foreground font-medium">{rp(order.subtotal || (order.total - 8000))}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Ongkir Kurir</span>
              <span className="text-foreground font-medium">{rp(order.shippingFee || 8000)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-xs text-green-600 font-medium">
                <span>Promo Voucher</span>
                <span>-{rp(order.discount)}</span>
              </div>
            )}
            {order.tip > 0 && (
              <div className="flex justify-between text-xs text-foreground font-medium">
                <span>Tip Driver</span>
                <span>+{rp(order.tip)}</span>
              </div>
            )}
            <div className="h-px bg-border my-1" />
            <div className="flex justify-between text-xs">
              <span className="font-bold text-foreground">Metode Pembayaran</span>
              <span className="font-semibold text-primary">{order.payMethod || "Dompet Rangers"}</span>
            </div>
            <div className="flex justify-between text-sm mt-0.5">
              <span className="font-bold text-foreground">Total Dibayar</span>
              <span className="font-extrabold text-primary">{rp(order.total)}</span>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex flex-col gap-2 mt-2">
          {phase === 4 ? (
            <button 
              onClick={() => navigate("c_rating")}
              className="w-full py-3.5 bg-primary text-white font-bold text-sm rounded-2xl shadow-md cursor-pointer animate-pulse text-center"
            >
              ⭐ Beri Review & Rating
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleFastForward}
                className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-xs rounded-2xl cursor-pointer text-center"
              >
                ⏩ Percepat Pengiriman
              </button>
              <button 
                onClick={() => navigate("c_pesanan")}
                className="flex-1 py-3 border border-border text-muted-foreground font-bold text-xs rounded-2xl cursor-pointer text-center"
              >
                Pantau Nanti
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RatingScreen({
  navigate,
  activeTrackingOrderId,
  myOrders,
  setMyOrders,
  showToast
}: {
  navigate: (s: Screen) => void;
  activeTrackingOrderId: string | null;
  myOrders: any[];
  setMyOrders: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (m: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const order = myOrders.find(o => o.id === activeTrackingOrderId);

  const handleSubmit = () => {
    if (!order) return;
    
    setMyOrders(prevOrders => prevOrders.map(o => {
      if (o.id === activeTrackingOrderId) {
        return {
          ...o,
          status: "Selesai",
          statusColor: "green",
          reviewText: comment,
          reviewRating: rating
        };
      }
      return o;
    }));

    showToast("Terima kasih atas ulasan Anda!");
    navigate("c_pesanan");
  };

  if (!order) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <StatusBar />
        <AlertCircle size={40} className="text-red-500 mb-2" />
        <p className="font-bold text-foreground text-sm">Pesanan Tidak Ditemukan</p>
        <button onClick={() => navigate("c_pesanan")} className="mt-4 bg-primary text-white px-4 py-2 rounded-xl text-xs cursor-pointer">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <StatusBar />
      <div className="flex items-center px-4 h-14 shrink-0 border-b border-border bg-white justify-between">
        <span className="text-base font-bold text-foreground">Review & Rating</span>
        <button onClick={() => navigate("c_pesanan")} className="text-xs text-muted-foreground font-semibold px-2 py-1 cursor-pointer">
          Lewati
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-between" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-secondary flex items-center justify-center text-2xl shadow-sm">
            ⭐
          </div>
          <div>
            <h3 className="font-extrabold text-base text-foreground">Bagaimana hidangan & layanan Anda?</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">Berikan masukan Anda untuk membantu Toko dan Driver meningkatkan kualitas pelayanan mereka</p>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} 
                onClick={() => setRating(star)} 
                className="w-11 h-11 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              >
                <Star 
                  size={36} 
                  className={star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                />
              </button>
            ))}
          </div>

          <div className="w-full flex flex-col items-start gap-1.5 mt-2">
            <label className="text-xs font-bold text-muted-foreground">Tulis Ulasan Anda</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Bagikan pengalaman Anda tentang rasa makanan, kemasan, atau keramahan kurir..."
              className="w-full h-24 p-3 bg-white border border-border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-primary text-white font-bold text-sm rounded-2xl shadow-md cursor-pointer text-center mt-8"
        >
          Kirim Ulasan
        </button>
      </div>
    </div>
  );
}

function DriverChatScreen({
  navigate,
  driverChatMessages,
  setDriverChatMessages,
  setUnreadChatCount
}: {
  navigate: (s: Screen) => void;
  driverChatMessages: any[];
  setDriverChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setUnreadChatCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUnreadChatCount(0);
  }, [setUnreadChatCount]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [driverChatMessages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setDriverChatMessages(prev => [
      ...prev,
      { id: String(prev.length + 1), sender: "user", text, time }
    ]);
    setInputText("");
  };

  const quickReplies = [
    "Sesuai aplikasi ya pak",
    "Ditunggu ya pak",
    "Saya sudah di depan pagar",
    "Titip di pos satpam saja pak"
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <StatusBar />
      <div className="flex items-center px-4 h-14 shrink-0 border-b border-border bg-white justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("c_tracking")} className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-lg">
            🏍️
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-foreground leading-tight">Pak Rahman</h3>
            <p className="text-[9px] text-muted-foreground font-semibold">Supra H 4251 AA · Rangers Driver</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 cursor-pointer">
          <Phone size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <p className="text-center text-[9px] text-muted-foreground font-semibold bg-gray-200/50 py-1 px-3 rounded-full self-center mb-2">
          Percakapan Anda dengan driver dimulai
        </p>

        {driverChatMessages.map(msg => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[75%] ${isUser ? "self-end items-end" : "self-start items-start"}`}
            >
              <div 
                className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${isUser ? "bg-primary text-white rounded-tr-none" : "bg-white text-foreground rounded-tl-none border border-border"}`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-muted-foreground font-medium mt-1 px-1">
                {msg.time}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
        {quickReplies.map(reply => (
          <button
            key={reply}
            onClick={() => handleSend(reply)}
            className="shrink-0 px-3 py-1.5 bg-white border border-border hover:bg-muted text-[10px] font-bold text-muted-foreground rounded-full transition-all cursor-pointer shadow-sm"
          >
            {reply}
          </button>
        ))}
      </div>

      <div className="p-3 bg-white border-t border-border flex items-center gap-2.5">
        <input 
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend(inputText)}
          placeholder="Kirim pesan ke driver..."
          className="flex-1 px-4 py-3 bg-muted rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium border border-transparent"
        />
        <button 
          onClick={() => handleSend(inputText)}
          className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary/95 transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

function SupportChatScreen({
  navigate,
  supportChatMessages,
  setSupportChatMessages,
  setUnreadSupportCount
}: {
  navigate: (s: Screen) => void;
  supportChatMessages: any[];
  setSupportChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setUnreadSupportCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUnreadSupportCount(0);
  }, [setUnreadSupportCount]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [supportChatMessages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setSupportChatMessages(prev => [
      ...prev,
      { id: String(prev.length + 1), sender: "user", text, time }
    ]);
    setInputText("");

    // Simulate real-time support response after 1.5s
    setTimeout(() => {
      const responseTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const lower = text.toLowerCase();
      let reply = "Baik kak Budi, keluhan Anda telah kami catat. Tim Rangers Care akan segera menindaklanjuti dan mengabari Anda kembali.";
      if (lower.includes("pesanan") || lower.includes("kirim") || lower.includes("belum")) {
        reply = "Mohon maaf atas keterlambatan pesanan Anda, kak Budi. Kami sedang menghubungi Rangers Driver Pak Rahman untuk mempercepat pengantaran ke Jl. Aster No. 7.";
      } else if (lower.includes("bayar") || lower.includes("saldo") || lower.includes("dompet")) {
        reply = "Terkait kendala saldo/pembayaran, kami bantu cek mutasi transaksi Dompet Rangers Anda. Mohon tunggu 1-2 menit ya kak.";
      } else if (lower.includes("laundry") || lower.includes("catering")) {
        reply = "Keluhan terkait mitra UMKM telah kami teruskan. Kami akan memastikan kualitas layanan mitra kami tetap terjaga.";
      }
      setSupportChatMessages(prev => [
        ...prev,
        { id: String(prev.length + 1), sender: "support", text: reply, time: responseTime }
      ]);
    }, 1500);
  };

  const quickReplies = [
    "Pesanan saya belum sampai",
    "Bagaimana cara bayar?",
    "Aplikasi bermasalah",
    "Terima kasih Rangers Care"
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <StatusBar />
      <div className="flex items-center px-4 h-14 shrink-0 border-b border-border bg-white justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("c_inbox")} className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-lg">
            🛡️
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-foreground leading-tight">Rangers Care (Bantuan)</h3>
            <p className="text-[9px] text-muted-foreground font-semibold">Pusat Bantuan Pelanggan Kamojang</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <p className="text-center text-[9px] text-muted-foreground font-semibold bg-gray-200/50 py-1 px-3 rounded-full self-center mb-2">
          Pusat Bantuan Rangers Care siap melayani Anda
        </p>

        {supportChatMessages.map(msg => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[75%] ${isUser ? "self-end items-end" : "self-start items-start"}`}
            >
              <div 
                className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${isUser ? "bg-primary text-white rounded-tr-none" : "bg-white text-foreground rounded-tl-none border border-border"}`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-muted-foreground font-medium mt-1 px-1">
                {msg.time}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
        {quickReplies.map(reply => (
          <button
            key={reply}
            onClick={() => handleSend(reply)}
            className="shrink-0 px-3 py-1.5 bg-white border border-border hover:bg-muted text-[10px] font-bold text-muted-foreground rounded-full transition-all cursor-pointer shadow-sm"
          >
            {reply}
          </button>
        ))}
      </div>

      <div className="p-3 bg-white border-t border-border flex items-center gap-2.5">
        <input 
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend(inputText)}
          placeholder="Tulis pesan bantuan..."
          className="flex-1 px-4 py-3 bg-muted rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium border border-transparent"
        />
        <button 
          onClick={() => handleSend(inputText)}
          className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary/95 transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

function CateringChatScreen({
  navigate,
  cateringChatMessages,
  setCateringChatMessages,
  setUnreadCateringCount,
  cateringStoreName
}: {
  navigate: (s: Screen) => void;
  cateringChatMessages: any[];
  setCateringChatMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setUnreadCateringCount: React.Dispatch<React.SetStateAction<number>>;
  cateringStoreName: string;
}) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUnreadCateringCount(0);
  }, [setUnreadCateringCount]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [cateringChatMessages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setCateringChatMessages(prev => [
      ...prev,
      { id: String(prev.length + 1), sender: "user", text, time }
    ]);
    setInputText("");

    // Simulate real-time catering admin response after 1.5s
    setTimeout(() => {
      const responseTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const lower = text.toLowerCase();
      let reply = `Baik kak Budi, pesan Anda telah diterima oleh Admin ${cateringStoreName || "Catering"}. Kami akan segera mengonfirmasi pesanan/pertanyaan Anda ya.`;
      
      if (lower.includes("pax") || lower.includes("porsi") || lower.includes("jumlah")) {
        reply = `Untuk perubahan jumlah pax (porsi), minimal dilakukan H-2 dari tanggal acara ya kak. Kami bantu catat terlebih dahulu.`;
      } else if (lower.includes("sendok") || lower.includes("alat makan") || lower.includes("plastik")) {
        reply = `Tentu bisa kak Budi! Paket catering sudah dilengkapi dengan sendok, garpu, dan tisu gratis.`;
      } else if (lower.includes("jam") || lower.includes("antar") || lower.includes("pagi") || lower.includes("siang")) {
        reply = `Siap kak, pengantaran katering akan kami jadwalkan agar tiba 30 menit sebelum jam acara yang ditentukan.`;
      } else if (lower.includes("menu") || lower.includes("ganti") || lower.includes("custom")) {
        reply = `Kakak bisa mengganti menu sayur atau lauk pendamping dengan harga setara. Ada yang ingin disesuaikan dari menu paket katering Anda?`;
      } else if (lower.includes("harga") || lower.includes("diskon") || lower.includes("potongan")) {
        reply = `Untuk pemesanan di atas 100 pax, kami ada potongan harga khusus 5% kak Budi!`;
      }
      
      setCateringChatMessages(prev => [
        ...prev,
        { id: String(prev.length + 1), sender: "catering", text: reply, time: responseTime }
      ]);
    }, 1500);
  };

  const quickReplies = [
    "Bisa request sendok plastik?",
    "Apakah bisa antar jam 10 pagi?",
    "Saya ingin mengubah pesanan PO",
    "Terima kasih Admin Catering"
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      <StatusBar />
      <div className="flex items-center px-4 h-14 shrink-0 border-b border-border bg-white justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("c_inbox")} className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-lg">
            🍱
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-foreground leading-tight">Admin {cateringStoreName || "Catering"}</h3>
            <p className="text-[9px] text-muted-foreground font-semibold">Mitra Catering PGE Kamojang</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <p className="text-center text-[9px] text-muted-foreground font-semibold bg-gray-200/50 py-1 px-3 rounded-full self-center mb-2">
          Diskusikan pesanan Booking/PO Catering Anda di sini
        </p>

        {cateringChatMessages.map(msg => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[75%] ${isUser ? "self-end items-end" : "self-start items-start"}`}
            >
              <div 
                className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${isUser ? "bg-primary text-white rounded-tr-none" : "bg-white text-foreground rounded-tl-none border border-border"}`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-muted-foreground font-medium mt-1 px-1">
                {msg.time}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
        {quickReplies.map(reply => (
          <button
            key={reply}
            onClick={() => handleSend(reply)}
            className="shrink-0 px-3 py-1.5 bg-white border border-border hover:bg-muted text-[10px] font-bold text-muted-foreground rounded-full transition-all cursor-pointer shadow-sm"
          >
            {reply}
          </button>
        ))}
      </div>

      <div className="p-3 bg-white border-t border-border flex items-center gap-2.5">
        <input 
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend(inputText)}
          placeholder="Tulis pesan ke admin..."
          className="flex-1 px-4 py-3 bg-muted rounded-2xl text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium border border-transparent"
        />
        <button 
          onClick={() => handleSend(inputText)}
          className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary/95 transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── MITRA REGISTRATION SCREEN ────────────────────────────────────────────────
function MitraRegistrationScreen({ navigate, setActiveMitraRoles }: Nav & { setActiveMitraRoles: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { id: "driver", title: "Kurir / Driver", icon: Bike, color: "text-orange-500", bg: "bg-orange-100" },
    { id: "kos", title: "Pemilik Kos", icon: Building2, color: "text-purple-500", bg: "bg-purple-100" },
    { id: "laundry", title: "Pemilik Laundry", icon: Wind, color: "text-blue-500", bg: "bg-blue-100" },
    { id: "catering", title: "Pemilik Catering", icon: Coffee, color: "text-yellow-600", bg: "bg-yellow-100" }
  ];

  const handleNext = () => {
    if (step === 1 && roles.length === 0) return;
    setStep(s => s + 1);
  };

  const handleKirim = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  const finish = () => {
    setActiveMitraRoles(roles);
    navigate("d_home");
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="bg-white shrink-0 shadow-sm z-10">
        <StatusBar />
        <div className="flex items-center px-4 pb-3 pt-1">
          {step < 4 && (
            <button onClick={() => step === 1 ? navigate("role") : setStep(s => s - 1)} className="p-2 -ml-2 text-foreground">
              <ArrowLeft size={24} />
            </button>
          )}
          <h2 className="font-extrabold text-lg text-foreground ml-2">Daftar Mitra</h2>
        </div>
        {/* Progress Bar */}
        {step < 4 && (
          <div className="w-full bg-gray-100 h-1.5 flex">
            <div className={`h-full bg-primary transition-all duration-300 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {step === 1 && (
          <div className="p-6">
            <h3 className="text-xl font-black text-gray-900 mb-2">Pilih Peran Anda</h3>
            <p className="text-sm text-gray-500 mb-6">Anda bisa memilih lebih dari satu peran. Dashboard akan menyesuaikan dengan pilihan Anda.</p>
            
            <div className="flex flex-col gap-3">
              {roleOptions.map(r => {
                const isSelected = roles.includes(r.id);
                return (
                  <button key={r.id}
                    onClick={() => setRoles(prev => isSelected ? prev.filter(x => x !== r.id) : [...prev, r.id])}
                    className={`flex items-center p-4 rounded-2xl border-2 transition-all ${isSelected ? "border-primary bg-primary/5" : "border-gray-100 bg-white"}`}>
                    <div className={`w-12 h-12 rounded-full ${r.bg} ${r.color} flex items-center justify-center shrink-0`}>
                      <r.icon size={24} />
                    </div>
                    <div className="flex-1 text-left ml-4">
                      <p className="font-bold text-gray-900">{r.title}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? "bg-primary border-primary" : "border-gray-300"}`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <button 
              onClick={handleNext}
              disabled={roles.length === 0}
              className={`w-full mt-8 py-4 rounded-2xl font-bold text-white transition-all ${roles.length > 0 ? "bg-primary shadow-lg shadow-primary/30" : "bg-gray-300"}`}
            >
              Lanjutkan
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="p-6">
            <h3 className="text-xl font-black text-gray-900 mb-2">Data Diri & NIK</h3>
            <p className="text-sm text-gray-500 mb-6">Pastikan data sesuai dengan kartu identitas Anda yang berlaku.</p>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Nama Lengkap Sesuai KTP</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Budi Santoso" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Nomor Induk Kependudukan (NIK)</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="320xxxxxxxxxxxxx" />
              </div>
              
              <div className="mt-2">
                <label className="text-xs font-bold text-gray-700 mb-2 block">Upload Foto KTP</label>
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                  <Camera size={32} className="mb-2" />
                  <span className="text-xs font-medium">Ambil Foto KTP</span>
                </div>
              </div>
            </div>

            <button onClick={handleNext} className="w-full mt-8 py-4 rounded-2xl font-bold text-white bg-primary shadow-lg shadow-primary/30">
              Lanjutkan
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="p-6">
            <h3 className="text-xl font-black text-gray-900 mb-2">Detail Usaha / Kendaraan</h3>
            <p className="text-sm text-gray-500 mb-6">Lengkapi informasi spesifik untuk peran yang Anda pilih.</p>
            
            <div className="flex flex-col gap-6">
              {roles.includes("driver") && (
                <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-2 mb-3"><Bike size={16} /> Data Kendaraan (Driver)</h4>
                  <div className="flex flex-col gap-3">
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Plat Nomor Kendaraan (Cth: D 1234 ABC)" />
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Tipe Kendaraan (Cth: Honda Beat)" />
                    <div className="w-full h-24 border border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white text-gray-400">
                      <span className="text-xs font-medium">+ Upload Foto SIM C</span>
                    </div>
                  </div>
                </div>
              )}

              {(roles.includes("kos") || roles.includes("laundry") || roles.includes("catering")) && (
                <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-2 mb-3"><Store size={16} /> Data Usaha</h4>
                  <div className="flex flex-col gap-3">
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Nama Usaha (Cth: Kos Putri Melati)" />
                    <textarea className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm h-24 resize-none" placeholder="Alamat Lengkap Usaha..." />
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleKirim} className="w-full mt-8 py-4 rounded-2xl font-bold text-white bg-primary shadow-lg shadow-primary/30 relative overflow-hidden flex items-center justify-center">
              {loading ? (
                <RefreshCw className="animate-spin text-white" />
              ) : (
                "Kirim Pendaftaran"
              )}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center h-full">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={48} className="text-green-500" />
            </motion.div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Pendaftaran Disetujui!</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Selamat! Akun Mitra Anda sudah aktif. Anda sekarang memiliki akses ke 
              <span className="font-bold text-gray-900"> {roles.length} jenis layanan</span> di Rangers App.
            </p>
            <button onClick={finish} className="w-full py-4 rounded-2xl font-bold text-white bg-primary shadow-lg shadow-primary/30">
              Masuk Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DRIVER SCREENS ───────────────────────────────────────────────────────────

// ─── DRIVER SCREENS ───────────────────────────────────────────────────────────
function DriverHome({ navigate, activeMitraRoles }: Nav & { activeMitraRoles: string[] }) {
  const [online, setOnline] = useState(false);
  const [dashboardMode, setDashboardMode] = useState<"driver"|"mitra">(activeMitraRoles.includes("driver") ? "driver" : "mitra");
  
  const hasDriver = activeMitraRoles.includes("driver");
  const hasBusiness = activeMitraRoles.some(r => ["kos", "laundry", "catering"].includes(r));

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
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
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
          </div>
          
          {/* Tabs - Only show if they have both driver and business roles */}
          {hasDriver && hasBusiness && (
            <div className="flex mt-6 bg-white/15 p-1 rounded-[20px]">
              <button 
                onClick={() => setDashboardMode("driver")}
                className={`flex-1 py-2.5 rounded-[16px] text-sm font-bold transition-colors ${dashboardMode === "driver" ? "bg-white text-gray-900 shadow-sm" : "text-white/70 hover:text-white"}`}
              >
                🛵 Tugas Driver
              </button>
              <button 
                onClick={() => setDashboardMode("mitra")}
                className={`flex-1 py-2.5 rounded-[16px] text-sm font-bold transition-colors ${dashboardMode === "mitra" ? "bg-white text-gray-900 shadow-sm" : "text-white/70 hover:text-white"}`}
              >
                🏪 Kelola Usaha
              </button>
            </div>
          )}

          {/* online toggle - only show for driver */}
          {dashboardMode === "driver" && hasDriver && (
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
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {dashboardMode === "driver" ? (
          <>
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
        </>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {/* mitra stats */}
            <div className="grid grid-cols-2 gap-3">
              {activeMitraRoles.includes("kos") && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3">
                    <Store size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium mb-1">Pendapatan Kos</p>
                    <p className="font-black text-lg text-gray-900">{rp(4500000)}</p>
                  </div>
                </div>
              )}
              {activeMitraRoles.includes("laundry") && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                    <Shirt size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium mb-1">Pendapatan Laundry</p>
                    <p className="font-black text-lg text-gray-900">{rp(350000)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Pending Kos Booking */}
            {activeMitraRoles.includes("kos") && (
              <div>
              <div className="flex items-center justify-between mb-3 mt-2">
                <h3 className="font-bold text-sm text-gray-900">Booking Kos Baru</h3>
                <Pill color="orange">1 perlu diproses</Pill>
              </div>
              <div className="bg-white rounded-[20px] p-4 border border-orange-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400" />
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0">
                    <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-[14px] text-gray-900">Budi Santoso</h4>
                    <p className="text-[11px] text-gray-500 mb-2">Mengajukan booking Kos Putra Garuda</p>
                    <div className="bg-gray-50 rounded-lg p-2.5 mb-3 border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-500">Durasi</span>
                        <span className="text-[11px] font-bold text-gray-900">6 Bulan</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500">Total DP (20%)</span>
                        <span className="text-[12px] font-black text-primary">{rp(720000)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 text-xs font-bold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Tolak</button>
                      <button className="flex-[2] py-2 text-xs font-bold rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-colors">Terima & Chat</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Laundry Orders */}
            {activeMitraRoles.includes("laundry") && (
              <div className="mb-6">
              <div className="flex items-center justify-between mb-3 mt-2">
                <h3 className="font-bold text-sm text-gray-900">Pesanan Laundry Aktif</h3>
                <Pill color="blue">2 pesanan</Pill>
              </div>
              
              <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm mb-3">
                <div className="flex justify-between items-center mb-3 border-b border-dashed border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                      <Shirt size={14} />
                    </div>
                    <div>
                      <p className="font-extrabold text-[13px] text-gray-900">Order #LND-924</p>
                      <p className="text-[10px] text-gray-500">Siti Aminah • Ekstra Cepat</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md">Diproses</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-400">Total Harga</p>
                    <p className="font-black text-[14px] text-gray-900">{rp(45000)}</p>
                  </div>
                  <button className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">Selesai Dicuci</button>
                </div>
              </div>

              <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-3 border-b border-dashed border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                      <Shirt size={14} />
                    </div>
                    <div>
                      <p className="font-extrabold text-[13px] text-gray-900">Order #LND-925</p>
                      <p className="text-[10px] text-gray-500">Ahmad Faisal • Biasa</p>
                    </div>
                  </div>
                  <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-md">Mng. Pickup</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-400">Total Harga</p>
                    <p className="font-black text-[14px] text-gray-900">{rp(15000)}</p>
                  </div>
                  <button className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed border border-gray-200">Driver OTW</button>
                </div>
              </div>
            </div>
            )}
          </div>
        )}
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

  const [marketplaceSearch, setMarketplaceSearch] = useState("");
  const [cart, setCart] = useState<{ id: number; name: string; store: string; price: number; img: string; quantity: number }[]>([]);
  const [dompetBalance, setDompetBalance] = useState(500000);
  const [myOrders, setMyOrders] = useState(ORDERS);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null);
  const [tempCheckout, setTempCheckout] = useState<{
    address: string;
    driverNote: string;
    voucherCode: string | null;
    discount: number;
    tip: number;
    subtotal: number;
    shippingFee: number;
    total: number;
  } | null>(null);
  const [driverChatMessages, setDriverChatMessages] = useState<{ id: string; sender: "driver" | "user"; text: string; time: string }[]>([
    { id: "1", sender: "driver", text: "Halo kak, pesanan sudah saya terima ya. Sedang disiapkan toko.", time: "Baru saja" }
  ]);
  const [unreadChatCount, setUnreadChatCount] = useState(1);
  const [supportChatMessages, setSupportChatMessages] = useState<{ id: string; sender: "support" | "user"; text: string; time: string }[]>([
    { id: "1", sender: "support", text: "Halo kak Budi, ada yang bisa kami bantu terkait pesanan Anda hari ini?", time: "Kemarin" }
  ]);
  const [unreadSupportCount, setUnreadSupportCount] = useState(1);
  const [cateringChatMessages, setCateringChatMessages] = useState<{ id: string; sender: "catering" | "user"; text: string; time: string }[]>([]);
  const [unreadCateringCount, setUnreadCateringCount] = useState(0);
  const [cateringStoreName, setCateringStoreName] = useState("");
  const [activeMitraRoles, setActiveMitraRoles] = useState<string[]>([]);

  const addDriverMessage = (text: string) => {
    setDriverChatMessages(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        sender: "driver",
        text,
        time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setUnreadChatCount(prev => prev + 1);
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} dimasukkan ke keranjang`);
  };

  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("onboarding"), 2600);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const isCustomerTab = ["c_home", "c_jelajah", "c_pesanan", "c_inbox", "c_profil"].includes(screen);
  const isDriverTab = ["d_home", "d_order", "d_riwayat", "d_pendapatan", "d_profil"].includes(screen);
  const isCustomerSub = ["c_marketplace", "c_catering", "c_laundry", "c_kos", "c_cart", "c_qris", "c_tracking", "c_rating", "c_driver_chat", "c_support_chat", "c_catering_chat"].includes(screen);

  const renderContent = () => {
    // Auth flow
    if (screen === "splash") return <SplashScreen />;
    if (screen === "onboarding") return <OnboardingScreen navigate={navigate} />;
    if (screen === "login") return <LoginScreen navigate={navigate} />;
    if (screen === "otp") return <OTPScreen navigate={navigate} />;
    if (screen === "role") return <RoleScreen navigate={navigate} setRole={setRole} />;

    // Customer sub-screens (no bottom nav)
    if (screen === "c_marketplace") return (
      <MarketplaceScreen 
        navigate={navigate} 
        addToCart={addToCart} 
        cart={cart} 
        marketplaceSearch={marketplaceSearch}
        setMarketplaceSearch={setMarketplaceSearch}
      />
    );
    if (screen === "c_catering") return (
      <CateringScreen 
        navigate={navigate} 
        setCateringChatMessages={setCateringChatMessages}
        setUnreadCateringCount={setUnreadCateringCount}
        setCateringStoreName={setCateringStoreName}
        myOrders={myOrders}
        setMyOrders={setMyOrders}
        showToast={showToast}
        dompetBalance={dompetBalance}
        setDompetBalance={setDompetBalance}
      />
    );
    if (screen === "c_laundry") return <LaundryScreen navigate={navigate} />;
    if (screen === "c_kos") return <KosScreen navigate={navigate} />;
    
    if (screen === "c_cart") return (
      <CartScreen 
        navigate={navigate} 
        cart={cart} 
        setCart={setCart} 
        dompetBalance={dompetBalance} 
        setDompetBalance={setDompetBalance} 
        myOrders={myOrders}
        setMyOrders={setMyOrders}
        setActiveTrackingOrderId={setActiveTrackingOrderId}
        showToast={showToast}
        setTempCheckout={setTempCheckout}
        setDriverChatMessages={setDriverChatMessages}
        setUnreadChatCount={setUnreadChatCount}
      />
    );
    
    if (screen === "c_qris") return (
      <QrisScreen 
        navigate={navigate} 
        cart={cart} 
        setCart={setCart} 
        myOrders={myOrders}
        setMyOrders={setMyOrders}
        setActiveTrackingOrderId={setActiveTrackingOrderId}
        showToast={showToast}
        tempCheckout={tempCheckout}
        setDriverChatMessages={setDriverChatMessages}
        setUnreadChatCount={setUnreadChatCount}
      />
    );
    
    if (screen === "c_tracking") return (
      <TrackingScreen 
        navigate={navigate} 
        activeTrackingOrderId={activeTrackingOrderId} 
        myOrders={myOrders} 
        setMyOrders={setMyOrders}
        showToast={showToast}
        unreadChatCount={unreadChatCount}
        addDriverMessage={addDriverMessage}
      />
    );
    
    if (screen === "c_rating") return (
      <RatingScreen 
        navigate={navigate} 
        activeTrackingOrderId={activeTrackingOrderId} 
        myOrders={myOrders} 
        setMyOrders={setMyOrders}
        showToast={showToast}
      />
    );

    if (screen === "c_driver_chat") return (
      <DriverChatScreen
        navigate={navigate}
        driverChatMessages={driverChatMessages}
        setDriverChatMessages={setDriverChatMessages}
        setUnreadChatCount={setUnreadChatCount}
      />
    );
    
    if (screen === "c_support_chat") return (
      <SupportChatScreen
        navigate={navigate}
        supportChatMessages={supportChatMessages}
        setSupportChatMessages={setSupportChatMessages}
        setUnreadSupportCount={setUnreadSupportCount}
      />
    );
    if (screen === "c_catering_chat") return (
      <CateringChatScreen
        navigate={navigate}
        cateringChatMessages={cateringChatMessages}
        setCateringChatMessages={setCateringChatMessages}
        setUnreadCateringCount={setUnreadCateringCount}
        cateringStoreName={cateringStoreName}
      />
    );

    // Customer tabs
    if (screen === "c_home") return <CustomerHome navigate={navigate} dompetBalance={dompetBalance} addToCart={addToCart} setMarketplaceSearch={setMarketplaceSearch} />;
    if (screen === "c_jelajah") return <JelajahScreen navigate={navigate} />;
    if (screen === "c_pesanan") return (
      <PesananScreen 
        navigate={navigate} 
        myOrders={myOrders} 
        setMyOrders={setMyOrders}
        setActiveTrackingOrderId={setActiveTrackingOrderId}
        dompetBalance={dompetBalance}
        setDompetBalance={setDompetBalance}
        showToast={showToast}
      />
    );
    if (screen === "c_inbox") return (
      <InboxScreen 
        navigate={navigate} 
        driverChatMessages={driverChatMessages}
        unreadChatCount={unreadChatCount}
        setUnreadChatCount={setUnreadChatCount}
        supportChatMessages={supportChatMessages}
        unreadSupportCount={unreadSupportCount}
        setUnreadSupportCount={setUnreadSupportCount}
        cateringChatMessages={cateringChatMessages}
        unreadCateringCount={unreadCateringCount}
        setUnreadCateringCount={setUnreadCateringCount}
        cateringStoreName={cateringStoreName}
      />
    );
    if (screen === "c_profil") return <ProfilCustomer navigate={navigate} />;

    // Driver tabs
    if (screen === "mitra_reg") return <MitraRegistrationScreen navigate={navigate} setActiveMitraRoles={setActiveMitraRoles} />;
    if (screen === "d_home") return <DriverHome navigate={navigate} activeMitraRoles={activeMitraRoles} />;
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
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {renderContent()}
            {toast?.show && (
              <div className="absolute top-16 left-4 right-4 bg-gray-900/95 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50 animate-bounce">
                <span className="text-sm">🔔</span>
                <span className="flex-1 text-[11px] font-bold">{toast.message}</span>
              </div>
            )}
          </div>
          {/* Bottom nav */}
          {isCustomerTab && !isCustomerSub && (
            <CustomerNav screen={screen} navigate={navigate} unreadChatCount={unreadChatCount} unreadSupportCount={unreadSupportCount} unreadCateringCount={unreadCateringCount} />
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
