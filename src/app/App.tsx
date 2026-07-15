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
  Mic, SlidersHorizontal, LayoutGrid, Share, Users, Percent, Bath, Utensils, Headphones, Download, Scale, FileText, Loader, CheckSquare, MoreVertical, Monitor, MoreHorizontal, Calendar, Copy, Trash2, Image as ImageIcon,
  ArrowUp, ArrowDown, ClipboardList, AlertTriangle, BellRing
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
  const [payMethod, setPayMethod] = useState<"dompet" | "qris">("dompet");
  const [showQrisSim, setShowQrisSim] = useState(false);

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

    if (payMethod === "dompet") {
      if (dompetBalance < paidAmount) {
        alert("Saldo Dompet Rangers Anda tidak mencukupi untuk melakukan pembayaran!");
        return;
      }
      // Deduct balance
      setDompetBalance(prev => prev - paidAmount);
    }

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
          method: payMethod === "dompet" ? "Dompet Rangers" : "QRIS" 
        }
      ],
      items: [{ id: selectedPackage.id, name: selectedPackage.name, price: selectedPackage.price, quantity: paxCount, img: selectedPackage.img, store: selectedMerchant.name }],
      progressState: 0,
      payMethod: sisaAmount > 0 ? `DP ${dpPercent}% (${payMethod === "dompet" ? "Dompet" : "QRIS"})` : (payMethod === "dompet" ? "Dompet Rangers" : "QRIS"),
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
      { id: "1", sender: "catering", text: `Halo kak Budi! Booking Pre-Order (${newOrderId}) Anda untuk ${selectedPackage.name} sebanyak ${paxCount} ${isTumpeng ? 'Unit' : 'Pax'} telah kami terima.\n\nStatus Pembayaran: ${sisaAmount > 0 ? `DP ${dpPercent}% Dibayar via ${payMethod === 'dompet' ? 'Dompet' : 'QRIS'} (${rp(paidAmount)}). Sisa Pelunasan: ${rp(sisaAmount)}` : `Lunas via ${payMethod === 'dompet' ? 'Dompet' : 'QRIS'} (${rp(totalPrice)})`}.\n\nTanggal Pengiriman: ${bookingDate}.\n\nApakah ada detail pesanan atau request menu khusus yang ingin disesuaikan?`, time: "Baru saja" }
    ]);
    setUnreadCateringCount(1);
    
    showToast(`Booking PO Berhasil! ${sisaAmount > 0 ? "DP Berhasil dibayar." : "Pembayaran Lunas."}`);
    setShowPaymentDialog(false);
    setShowQrisSim(false);
    setSelectedMerchant(null);
    navigate("c_pesanan");
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

                {/* Payment Method Selector */}
                <div className="flex flex-col gap-2 mt-1">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wide">Pilih Metode Pembayaran</p>
                  <div className="flex gap-2">
                    {/* Option Dompet */}
                    <button 
                      type="button"
                      onClick={() => setPayMethod("dompet")}
                      className={`flex-1 py-2 rounded-xl border flex gap-1.5 items-center justify-center transition-all cursor-pointer ${payMethod === "dompet" ? "border-primary bg-primary/[0.03] text-primary" : "border-border bg-white text-muted-foreground hover:bg-slate-50"}`}
                    >
                      <span className="text-xs">🪙</span>
                      <span className="text-[10px] font-bold">Dompet Rangers</span>
                    </button>
                    {/* Option QRIS */}
                    <button 
                      type="button"
                      onClick={() => setPayMethod("qris")}
                      className={`flex-1 py-2 rounded-xl border flex gap-1.5 items-center justify-center transition-all cursor-pointer ${payMethod === "qris" ? "border-primary bg-primary/[0.03] text-primary" : "border-border bg-white text-muted-foreground hover:bg-slate-50"}`}
                    >
                      <span className="text-xs">📱</span>
                      <span className="text-[10px] font-bold">QRIS Barcode</span>
                    </button>
                  </div>
                </div>

                {/* Wallet Info conditional on selected method */}
                {payMethod === "dompet" ? (
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
                ) : (
                  <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-2xl flex items-center justify-between mt-1 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📱</span>
                      <div className="text-[10px]">
                        <p className="font-extrabold text-foreground">QRIS (Rangers Pay)</p>
                        <p className="text-muted-foreground">Bayar instan via barcode scan</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-primary text-white px-2 py-0.5 rounded font-black uppercase">Aktif</span>
                  </div>
                )}

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
                  onClick={() => {
                    if (payMethod === "qris") {
                      setShowQrisSim(true);
                    } else {
                      handleConfirmPO();
                    }
                  }}
                  className="flex-[2] py-3 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer text-center"
                >
                  Bayar & Buat PO
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* QRIS Simulation Dialog for PO checkout */}
      {showQrisSim && selectedMerchant && selectedPackage && (() => {
        const totalPrice = selectedPackage.price * paxCount;
        let paidAmount = totalPrice;
        if (paymentOption === "dp30") {
          paidAmount = Math.round(totalPrice * 0.3);
        } else if (paymentOption === "dp50") {
          paidAmount = Math.round(totalPrice * 0.5);
        }
        return (
          <div className="absolute inset-0 bg-[#1B7A4E] z-50 flex flex-col items-center justify-center p-6 text-white text-center">
            <h2 className="text-xl font-extrabold mb-1">Pembayaran QRIS PO</h2>
            <p className="text-green-200 text-xs mb-6">PGE Kamojang Community Payment Gate</p>

            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-xs text-foreground flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider">QRIS STANDAR NASIONAL</span>
                <span className="text-[10px] font-bold text-primary">RANGERS APP</span>
              </div>
              
              <div className="text-xs text-muted-foreground mb-1">Jumlah Tagihan PO</div>
              <div className="text-xl font-extrabold text-foreground mb-4">{rp(paidAmount)}</div>
              
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
                  <span className="bg-white px-2 py-1 rounded text-[9px] font-bold shadow">Simulasi QRIS PO</span>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground text-center">
                Pindai QR di atas menggunakan aplikasi perbankan atau e-wallet Anda untuk menyelesaikan pembayaran PO
              </p>
            </div>

            <button 
              onClick={handleConfirmPO}
              className="w-full max-w-xs mt-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold rounded-2xl text-sm transition-all shadow-md cursor-pointer"
            >
              ✅ Simulasikan Bayar PO Sukses
            </button>

            <button 
              onClick={() => setShowQrisSim(false)}
              className="text-xs text-green-200 mt-4 hover:underline cursor-pointer"
            >
              Kembali
            </button>
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
  const [activeLunasiOrder, setActiveLunasiOrder] = useState<any | null>(null);
  const [lunasiMethod, setLunasiMethod] = useState<"dompet" | "qris">("dompet");
  const [showLunasiQris, setShowLunasiQris] = useState(false);

  const tabs = ["Aktif", "Selesai", "Dibatalkan"];
  const filtered = [
    myOrders.filter(o => o.status === "Dikirim" || o.status === "Diproses" || o.status === "Aktif" || o.status === "Menunggu Pelunasan"),
    myOrders.filter(o => o.status === "Selesai"),
    [],
  ][tab];

  const handleLunasi = (order: any, methodOverride?: "dompet" | "qris") => {
    const sisa = order.sisaAmount;
    const method = methodOverride || lunasiMethod;

    if (method === "dompet") {
      if (dompetBalance < sisa) {
        showToast("Saldo Dompet Rangers tidak mencukupi untuk pelunasan!");
        return;
      }
      setDompetBalance(prev => prev - sisa);
    }

    setMyOrders(prev => prev.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: "Diproses",
          statusColor: "orange",
          sisaAmount: 0,
          paymentType: "Full",
          paymentHistory: [
            ...(o.paymentHistory || []),
            { label: "Pelunasan PO", amount: sisa, date: "Hari Ini", method: method === "dompet" ? "Dompet Rangers" : "QRIS" }
          ]
        };
      }
      return o;
    }));

    showToast(`Pelunasan PO sebesar ${rp(sisa)} via ${method === "dompet" ? "Dompet" : "QRIS"} berhasil!`);
    setActiveLunasiOrder(null);
    setShowLunasiQris(false);
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
                        <div 
                          onClick={() => setActiveLunasiOrder(o)}
                          className="flex justify-between items-center text-[10px] text-amber-700 font-bold border-t border-dashed border-border pt-1.5 mt-1 cursor-pointer hover:underline"
                          title="Klik untuk melunasi sisa pembayaran"
                        >
                          <span>○ Sisa Pembayaran PO (Klik untuk lunasi)</span>
                          <span className="bg-amber-100 px-2 py-0.5 rounded text-amber-900">{rp(o.sisaAmount)}</span>
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
                        onClick={() => setActiveLunasiOrder(o)}
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

      {/* Pelunasan Payment Option Dialog (Popup Modal) */}
      {activeLunasiOrder && !showLunasiQris && (() => {
        const sisa = activeLunasiOrder.sisaAmount;
        return (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-5">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-border relative flex flex-col max-h-[85%]">
              
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-slate-50">
                <span className="text-xs font-black text-foreground">Metode Pelunasan PO</span>
                <button 
                  onClick={() => setActiveLunasiOrder(null)}
                  className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
                
                {/* Order Summary box */}
                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex flex-col gap-1">
                  <div className="text-[10px] text-muted-foreground font-bold">Katering PO</div>
                  <div className="text-xs text-foreground font-extrabold truncate">{activeLunasiOrder.item}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold mt-1">{activeLunasiOrder.detail}</div>
                  <div className="flex justify-between items-center text-xs text-foreground font-bold border-t border-dashed border-border pt-2 mt-2">
                    <span>Sisa Pelunasan</span>
                    <span className="text-primary font-black text-sm">{rp(sisa)}</span>
                  </div>
                </div>

                {/* Choices Selector */}
                <div className="flex flex-col gap-2.5">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wide">Pilih Metode Pelunasan</p>
                  
                  {/* Option 1: Dompet Rangers */}
                  <div 
                    onClick={() => setLunasiMethod("dompet")}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 bg-white ${lunasiMethod === "dompet" ? "border-primary bg-primary/[0.02]" : "border-border hover:bg-slate-50"}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${lunasiMethod === "dompet" ? "border-primary" : "border-gray-300"}`}>
                      {lunasiMethod === "dompet" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-foreground">Dompet Rangers</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Potong langsung dari saldo Anda.</p>
                      <p className="text-primary font-bold text-xs mt-1">Saldo: {rp(dompetBalance)}</p>
                    </div>
                  </div>

                  {/* Option 2: QRIS */}
                  <div 
                    onClick={() => setLunasiMethod("qris")}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 bg-white ${lunasiMethod === "qris" ? "border-primary bg-primary/[0.02]" : "border-border hover:bg-slate-50"}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${lunasiMethod === "qris" ? "border-primary" : "border-gray-300"}`}>
                      {lunasiMethod === "qris" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-foreground">QRIS Barcode Scan</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Scan & bayar instan dari aplikasi e-wallet Anda.</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-border bg-white flex gap-2.5 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
                <button 
                  onClick={() => setActiveLunasiOrder(null)}
                  className="flex-1 py-3 border border-border text-muted-foreground font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-50 text-center"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    if (lunasiMethod === "qris") {
                      setShowLunasiQris(true);
                    } else {
                      handleLunasi(activeLunasiOrder);
                    }
                  }}
                  className="flex-[2] py-3 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer text-center"
                >
                  Bayar Pelunasan
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Pelunasan QRIS Simulation Dialog */}
      {showLunasiQris && activeLunasiOrder && (() => {
        const sisa = activeLunasiOrder.sisaAmount;
        return (
          <div className="absolute inset-0 bg-[#1B7A4E] z-50 flex flex-col items-center justify-center p-6 text-white text-center">
            <h2 className="text-xl font-extrabold mb-1">Pelunasan QRIS</h2>
            <p className="text-green-200 text-xs mb-6">PGE Kamojang Community Payment Gate</p>

            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-xs text-foreground flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider">QRIS STANDAR NASIONAL</span>
                <span className="text-[10px] font-bold text-primary">RANGERS APP</span>
              </div>
              
              <div className="text-xs text-muted-foreground mb-1">Jumlah Pelunasan PO</div>
              <div className="text-xl font-extrabold text-foreground mb-4">{rp(sisa)}</div>
              
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
                  <span className="bg-white px-2 py-1 rounded text-[9px] font-bold shadow">Simulasi QRIS Pelunasan</span>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground text-center">
                Pindai QR di atas menggunakan aplikasi perbankan atau e-wallet Anda untuk menyelesaikan pelunasan
              </p>
            </div>

            <button 
              onClick={() => handleLunasi(activeLunasiOrder, "qris")}
              className="w-full max-w-xs mt-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold rounded-2xl text-sm transition-all shadow-md cursor-pointer"
            >
              ✅ Simulasikan Bayar Pelunasan Sukses
            </button>

            <button 
              onClick={() => setShowLunasiQris(false)}
              className="text-xs text-green-200 mt-4 hover:underline cursor-pointer"
            >
              Kembali
            </button>
          </div>
        );
      })()}

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
  addDriverMessage,
  dompetBalance,
  setDompetBalance
}: {
  navigate: (s: Screen) => void;
  activeTrackingOrderId: string | null;
  myOrders: any[];
  setMyOrders: React.Dispatch<React.SetStateAction<any[]>>;
  showToast: (m: string) => void;
  unreadChatCount: number;
  addDriverMessage: (text: string) => void;
  dompetBalance: number;
  setDompetBalance: React.Dispatch<React.SetStateAction<number>>;
}) {
  const order = myOrders.find(o => o.id === activeTrackingOrderId);
  const [phase, setPhase] = useState(0); 
  const [tick, setTick] = useState(0);

  const [activeLunasiOrder, setActiveLunasiOrder] = useState<any | null>(null);
  const [lunasiMethod, setLunasiMethod] = useState<"dompet" | "qris">("dompet");
  const [showLunasiQris, setShowLunasiQris] = useState(false);

  const handleLunasi = (targetOrder: any, methodOverride?: "dompet" | "qris") => {
    const sisa = targetOrder.sisaAmount;
    const method = methodOverride || lunasiMethod;

    if (method === "dompet") {
      if (dompetBalance < sisa) {
        showToast("Saldo Dompet Rangers tidak mencukupi untuk pelunasan!");
        return;
      }
      setDompetBalance(prev => prev - sisa);
    }

    setMyOrders(prev => prev.map(o => {
      if (o.id === targetOrder.id) {
        return {
          ...o,
          status: "Diproses",
          statusColor: "orange",
          sisaAmount: 0,
          paymentType: "Full",
          paymentHistory: [
            ...(o.paymentHistory || []),
            { label: "Pelunasan PO", amount: sisa, date: "Hari Ini", method: method === "dompet" ? "Dompet Rangers" : "QRIS" }
          ]
        };
      }
      return o;
    }));

    showToast(`Pelunasan PO sebesar ${rp(sisa)} via ${method === "dompet" ? "Dompet" : "QRIS"} berhasil!`);
    setActiveLunasiOrder(null);
    setShowLunasiQris(false);
  };

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

        {/* Catering PO Payment History and Installment timeline inside Tracking Screen */}
        {order.type === "Catering" && order.paymentHistory && order.paymentHistory.length > 0 && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Riwayat Pembayaran PO</h4>
            {order.paymentHistory.map((h: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-xs font-semibold text-foreground">
                <span className="text-muted-foreground">✓ {h.label} ({h.method})</span>
                <span className="text-primary font-bold">{rp(h.amount)}</span>
              </div>
            ))}
            {order.sisaAmount > 0 && (
              <div 
                onClick={() => setActiveLunasiOrder(order)}
                className="flex justify-between items-center text-[11px] text-amber-700 font-bold border-t border-dashed border-border pt-2 mt-1.5 cursor-pointer hover:underline"
                title="Klik untuk melunasi sisa pembayaran"
              >
                <span>○ Sisa Pembayaran PO (Klik untuk lunasi)</span>
                <span className="bg-amber-100 px-2 py-0.5 rounded text-amber-900">{rp(order.sisaAmount)}</span>
              </div>
            )}
          </div>
        )}

        {/* Down Payment (DP) warning banner & payment trigger in Tracking Screen */}
        {order.type === "Catering" && order.status === "Menunggu Pelunasan" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-800 font-bold">⚠️ Menunggu Pelunasan PO</span>
              <span className="text-amber-900 font-extrabold">{rp(order.sisaAmount)}</span>
            </div>
            <button 
              onClick={() => setActiveLunasiOrder(order)}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer text-center active:scale-95 transition-all"
            >
              Lunasi Sekarang
            </button>
          </div>
        )}

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

      {/* Pelunasan Payment Option Dialog in Tracking (Popup Modal) */}
      {activeLunasiOrder && !showLunasiQris && (() => {
        const sisa = activeLunasiOrder.sisaAmount;
        return (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-5 text-foreground">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-border relative flex flex-col max-h-[85%]">
              
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-slate-50">
                <span className="text-xs font-black text-foreground">Metode Pelunasan PO</span>
                <button 
                  onClick={() => setActiveLunasiOrder(null)}
                  className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
                
                {/* Order Summary box */}
                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex flex-col gap-1">
                  <div className="text-[10px] text-muted-foreground font-bold">Katering PO</div>
                  <div className="text-xs text-foreground font-extrabold truncate">{activeLunasiOrder.item}</div>
                  <div className="text-[10px] text-muted-foreground font-semibold mt-1">{activeLunasiOrder.detail}</div>
                  <div className="flex justify-between items-center text-xs text-foreground font-bold border-t border-dashed border-border pt-2 mt-2">
                    <span>Sisa Pelunasan</span>
                    <span className="text-primary font-black text-sm">{rp(sisa)}</span>
                  </div>
                </div>

                {/* Choices Selector */}
                <div className="flex flex-col gap-2.5">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wide">Pilih Metode Pelunasan</p>
                  
                  {/* Option 1: Dompet Rangers */}
                  <div 
                    onClick={() => setLunasiMethod("dompet")}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 bg-white ${lunasiMethod === "dompet" ? "border-primary bg-primary/[0.02]" : "border-border hover:bg-slate-50"}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${lunasiMethod === "dompet" ? "border-primary" : "border-gray-300"}`}>
                      {lunasiMethod === "dompet" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-foreground">Dompet Rangers</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Potong langsung dari saldo Anda.</p>
                      <p className="text-primary font-bold text-xs mt-1">Saldo: {rp(dompetBalance)}</p>
                    </div>
                  </div>

                  {/* Option 2: QRIS */}
                  <div 
                    onClick={() => setLunasiMethod("qris")}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 bg-white ${lunasiMethod === "qris" ? "border-primary bg-primary/[0.02]" : "border-border hover:bg-slate-50"}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${lunasiMethod === "qris" ? "border-primary" : "border-gray-300"}`}>
                      {lunasiMethod === "qris" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-foreground">QRIS Barcode Scan</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Scan & bayar instan dari aplikasi e-wallet Anda.</p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-border bg-white flex gap-2.5 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
                <button 
                  onClick={() => setActiveLunasiOrder(null)}
                  className="flex-1 py-3 border border-border text-muted-foreground font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-50 text-center"
                >
                  Batal
                </button>
                <button 
                  onClick={() => {
                    if (lunasiMethod === "qris") {
                      setShowLunasiQris(true);
                    } else {
                      handleLunasi(activeLunasiOrder);
                    }
                  }}
                  className="flex-[2] py-3 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer text-center"
                >
                  Bayar Pelunasan
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Pelunasan QRIS Simulation Dialog in Tracking */}
      {showLunasiQris && activeLunasiOrder && (() => {
        const sisa = activeLunasiOrder.sisaAmount;
        return (
          <div className="absolute inset-0 bg-[#1B7A4E] z-50 flex flex-col items-center justify-center p-6 text-white text-center">
            <h2 className="text-xl font-extrabold mb-1">Pelunasan QRIS</h2>
            <p className="text-green-200 text-xs mb-6">PGE Kamojang Community Payment Gate</p>

            <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-xs text-foreground flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3 border-b border-border pb-2">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider">QRIS STANDAR NASIONAL</span>
                <span className="text-[10px] font-bold text-primary">RANGERS APP</span>
              </div>
              
              <div className="text-xs text-muted-foreground mb-1">Jumlah Pelunasan PO</div>
              <div className="text-xl font-extrabold text-foreground mb-4">{rp(sisa)}</div>
              
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
                  <span className="bg-white px-2 py-1 rounded text-[9px] font-bold shadow">Simulasi QRIS Pelunasan</span>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground text-center">
                Pindai QR di atas menggunakan aplikasi perbankan atau e-wallet Anda untuk menyelesaikan pelunasan
              </p>
            </div>

            <button 
              onClick={() => handleLunasi(activeLunasiOrder, "qris")}
              className="w-full max-w-xs mt-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold rounded-2xl text-sm transition-all shadow-md cursor-pointer"
            >
              ✅ Simulasikan Bayar Pelunasan Sukses
            </button>

            <button 
              onClick={() => setShowLunasiQris(false)}
              className="text-xs text-green-200 mt-4 hover:underline cursor-pointer"
            >
              Kembali
            </button>
          </div>
        );
      })()}

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
    { id: "catering", title: "Pemilik Catering", icon: Coffee, color: "text-yellow-600", bg: "bg-yellow-100" },
    { id: "marketplace", title: "Pemilik Marketplace", icon: Store, color: "text-emerald-600", bg: "bg-emerald-100" }
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
            <h3 className="text-xl font-black text-gray-900 mb-2">Detail Usaha & Legalitas</h3>
            <p className="text-sm text-gray-500 mb-6">Lengkapi informasi spesifik untuk verifikasi pendaftaran peran Anda.</p>
            
            <div className="flex flex-col gap-6">
              {roles.includes("driver") && (
                <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-2 mb-3"><Bike size={16} /> Data Kendaraan & SIM (Driver)</h4>
                  <div className="flex flex-col gap-3">
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Plat Nomor Kendaraan (Cth: D 1234 ABC)" />
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Tipe Kendaraan (Cth: Honda Beat)" />
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Nomor SIM C (12 Digit)" />
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Nomor STNK Kendaraan" />
                    
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="h-24 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white text-gray-400">
                        <Camera size={18} className="mb-1" />
                        <span className="text-[9px] font-medium text-center px-1">Upload SIM C</span>
                      </div>
                      <div className="h-24 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white text-gray-400">
                        <Camera size={18} className="mb-1" />
                        <span className="text-[9px] font-medium text-center px-1">Upload STNK / Plat</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {roles.includes("marketplace") && (
                <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-2 mb-3"><Store size={16} /> Data Toko & Izin Usaha (Marketplace)</h4>
                  <div className="flex flex-col gap-3">
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Nama Toko / Outlet" />
                    <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-primary">
                      <option value="">Pilih Kategori Bisnis</option>
                      <option value="makanan">Makanan & Minuman</option>
                      <option value="fashion">Pakaian & Fashion</option>
                      <option value="kesehatan">Kesehatan & Kecantikan</option>
                      <option value="lainnya">Kerajinan & Lainnya</option>
                    </select>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Nomor Induk Berusaha (NIB)" />
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Nomor NPWP Pemilik Usaha" />
                    <textarea className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm h-16 resize-none focus:outline-none focus:border-primary" placeholder="Alamat Lengkap Toko & GPS Koordinat..." />
                    
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="h-24 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white text-gray-400">
                        <Camera size={18} className="mb-1" />
                        <span className="text-[9px] font-medium text-center px-1">Upload KTP Pemilik</span>
                      </div>
                      <div className="h-24 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white text-gray-400">
                        <Camera size={18} className="mb-1" />
                        <span className="text-[9px] font-medium text-center px-1">Upload Foto Toko</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {roles.includes("catering") && (
                <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-2 mb-3"><Coffee size={16} /> Data Dapur & Sertifikasi (Catering)</h4>
                  <div className="flex flex-col gap-3">
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Nama Dapur Catering" />
                    <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-primary">
                      <option value="">Pilih Jenis Layanan Utama</option>
                      <option value="nasibox">Prasmanan & Nasi Box</option>
                      <option value="tumpeng">Nasi Tumpeng Event</option>
                      <option value="bento">Bento Kidz Special</option>
                      <option value="snackbox">Snack Box & Coffee Break</option>
                    </select>
                    <input type="number" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Kapasitas Dapur Harian (Pax / Hari)" />
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Nomor Sertifikat Halal (Bila Ada)" />
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="No. Sertifikat Higiene Sanitasi Dinas Kesehatan" />
                    
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="h-24 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white text-gray-400">
                        <Camera size={18} className="mb-1" />
                        <span className="text-[9px] font-medium text-center px-1">Upload KTP PJ Dapur</span>
                      </div>
                      <div className="h-24 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white text-gray-400">
                        <Camera size={18} className="mb-1" />
                        <span className="text-[9px] font-medium text-center px-1">Upload Foto Dapur</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(roles.includes("kos") || roles.includes("laundry")) && (
                <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-2 mb-3"><Building2 size={16} /> Data Properti & Lokasi Usaha</h4>
                  <div className="flex flex-col gap-3">
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="Nama Usaha (Cth: Kos Putri Melati)" />
                    <textarea className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm h-20 resize-none focus:outline-none focus:border-primary" placeholder="Alamat Lengkap Usaha..." />
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
const MOCK_LAUNDRY_ORDERS = [
  { id: "#LND-924", name: "Siti Aminah", phone: "0812 1987 6543", address: "Jl. Aster No. 7, Kamojang", service: "Express 3 Jam", notes: "Baju kantor, kemeja putih", status: "baru", pricePerKg: 15000, weight: 0, total: 0, date: "14 Jul 2026, 13:00", userAvatar: "https://i.pravatar.cc/150?img=5" },
  { id: "#LND-923", name: "Ahmad Faisal", phone: "0812 3456 7890", address: "Jl. Anggrek No. 12", service: "Biasa", notes: "Pakaian harian", status: "diproses", pricePerKg: 8000, weight: 5.0, total: 40000, date: "14 Jul 2026, 15:00", userAvatar: "https://i.pravatar.cc/150?img=11" },
  { id: "#LND-922", name: "Dewi Lestari", phone: "0812 5678 9012", address: "Jl. Raya Kamojang No. 20", service: "Cuci Komplit", notes: "Baju kerja & pakaian harian", status: "menunggu_harga", pricePerKg: 6000, weight: 4.5, total: 0, date: "16 Jul 2026, 15:00", userAvatar: "https://i.pravatar.cc/150?img=9" }
];

function DriverHome({ navigate, activeMitraRoles, showToast }: Nav & { activeMitraRoles: string[]; showToast: (m: string) => void }) {
  const [online, setOnline] = useState(false);
  const [dashboardMode, setDashboardMode] = useState<"driver"|"mitra">(activeMitraRoles.includes("driver") ? "driver" : "mitra");
  
  const [storeOpen, setStoreOpen] = useState(true);
  const [mktOrderStatus, setMktOrderStatus] = useState<"new" | "preparing" | "searching" | "otw">("new");
  const [menuStatusList, setMenuStatusList] = useState({ 1: true, 2: true, 3: false });

  const [showMktHistory, setShowMktHistory] = useState(false);
  const [showMktPromo, setShowMktPromo] = useState(false);
  const [showMktSettings, setShowMktSettings] = useState(false);

  const [promoList, setPromoList] = useState([
    { id: 1, type: "Diskon Ongkir", name: "Subsidi Ongkir Kamojang", value: 5000, active: true },
    { id: 2, type: "Coret Harga", name: "Diskon Sore Nasi Timbel", value: 3000, active: false }
  ]);

  const [mktStoreInfo, setMktStoreInfo] = useState({
    name: "Warung Bu Siti Khas Kamojang",
    hours: "08:00 - 20:00",
    address: "Jl. Aster No. 7, Kamojang, Kab. Garut",
    phone: "0812-3456-7890"
  });

  const mktHistoryData = [
    { id: "MKT-799", customer: "Asep Sunandar", items: "1x Nasi Timbel, 1x Es Jeruk", total: 33000, date: "Hari Ini, 10:20", status: "Selesai" },
    { id: "MKT-798", customer: "Neng Lilis", items: "2x Ayam Bakar Madu", total: 56000, date: "Kemarin, 19:40", status: "Selesai" },
    { id: "MKT-797", customer: "Kang Emil", items: "3x Nasi Timbel Komplit", total: 75000, date: "13 Jan 2024, 12:15", status: "Selesai" }
  ];

  const [showMktFinance, setShowMktFinance] = useState(false);
  const [showMktHours, setShowMktHours] = useState(false);
  const [showMktReviews, setShowMktReviews] = useState(false);

  const [mktFinanceData, setMktFinanceData] = useState({
    totalOmzet: 3240000,
    withdrawn: 2000000,
    available: 1240000
  });

  const [mktScheduleHours, setMktScheduleHours] = useState([
    { day: "Senin - Jumat", open: "08:00", close: "20:00", active: true },
    { day: "Sabtu - Minggu", open: "09:00", close: "22:00", active: true }
  ]);

  const [mktReviews, setMktReviews] = useState([
    { id: 1, customer: "Asep Sunandar", rating: 5, date: "14 Jul 2026", comment: "Nasi timbelnya enak banget, sambalnya pedas mantap!", reply: "" },
    { id: 2, customer: "Neng Lilis", rating: 4, date: "13 Jul 2026", comment: "Ayam bakar madunya manis gurih, tapi jeruknya agak asem.", reply: "Terima kasih Neng Lilis atas masukannya!" }
  ]);

  const [kitchenOpen, setKitchenOpen] = useState(true);
  const [catOrderStatus, setCatOrderStatus] = useState<"pending" | "cooking" | "ready" | "delivered">("pending");
  const [showCatPackages, setShowCatPackages] = useState(false);
  const [showCatSchedule, setShowCatSchedule] = useState(false);
  const [showCatSettings, setShowCatSettings] = useState(false);
  const [minPoDays, setMinPoDays] = useState(1);
  const [minPax, setMinPax] = useState(10);

  const [catPackages, setCatPackages] = useState([
    { id: 1, name: "Paket Nasi Tumpeng Mini", price: 25000, minPax: 10, active: true },
    { id: 2, name: "Paket Nasi Box Ayam Bakar", price: 22000, minPax: 15, active: true },
    { id: 3, name: "Paket Bento Kidz Special", price: 27500, minPax: 10, active: false }
  ]);

  const catScheduleData = [
    { id: "PO-481", customer: "Rizky Pangestu", package: "Nasi Tumpeng (20 Pax)", date: "Besok, 12:00 WIB", status: "Bumbu & Bahan Siap" },
    { id: "PO-482", customer: "Ibu Amanda", package: "Nasi Box Ayam Bakar (50 Pax)", date: "17 Juli 2026, 10:00 WIB", status: "Menunggu Bahan" }
  ];

  const [showCatFinance, setShowCatFinance] = useState(false);
  const [showCatHolidays, setShowCatHolidays] = useState(false);
  const [showCatInvoice, setShowCatInvoice] = useState(false);

  const [catFinanceData, setCatFinanceData] = useState({
    totalOmzet: 1850000,
    dpSettled: 1500000,
    pendingPelunasan: 350000,
    withdrawn: 1000000
  });

  const [catHolidays, setCatHolidays] = useState([
    { id: 1, name: "Tahun Baru Islam", date: "19 Juli 2026", active: true },
    { id: 2, name: "Libur Dapur Bersama", date: "25 Juli 2026", active: false }
  ]);

  const catInvoiceData = {
    poId: "PO-481",
    customer: "Rizky Pangestu",
    phone: "0812-9876-5432",
    package: "Paket Nasi Tumpeng Mini (20 Pax)",
    deliveryTime: "Besok, 12:00 WIB",
    address: "Kost Orange Room 3, Gg. Barokah, Kamojang",
    totalPrice: 500000,
    dpPaid: 150000,
    remaining: 350000,
    paymentMethod: "Dompet Rangers"
  };

  const hasDriver = activeMitraRoles.includes("driver");
  const businessRoles = activeMitraRoles.filter(r => ["kos", "laundry", "catering", "marketplace"].includes(r));
  const hasBusiness = businessRoles.length > 0;
  const [activeBusinessTab, setActiveBusinessTab] = useState<string>(businessRoles[0] || "");

  // Laundry Order States
  const [laundryOrders, setLaundryOrders] = useState(MOCK_LAUNDRY_ORDERS);
  const [selectedLaundryOrderId, setSelectedLaundryOrderId] = useState<string | null>(null);
  const [laundryWeight, setLaundryWeight] = useState<number>(0);
  const [laundryFlowStep, setLaundryFlowStep] = useState<"input_weight" | "waiting_payment" | "detail">("input_weight");
  
  const [activeLaundryScreen, setActiveLaundryScreen] = useState<"dashboard" | "manajemen_order" | "manajemen_user" | "manajemen_keuangan" | "manajemen_lainnya" | "kos_manajemen_kamar" | "kos_manajemen_penghuni" | "kos_laporan_keuangan" | "kos_verifikasi_dp" | "kos_kirim_pengingat" | "kos_notifikasi">("dashboard");
  const [kosFinanceFilter, setKosFinanceFilter] = useState("Semua");
  const [orderFilter, setOrderFilter] = useState("Semua");
  const [showKosTolakDPPopup, setShowKosTolakDPPopup] = useState(false);
  const [showKosTerimaDPPopup, setShowKosTerimaDPPopup] = useState(false);
  const [showKosKirimPengingatPopup, setShowKosKirimPengingatPopup] = useState(false);
  const [kosPengingatMethod, setKosPengingatMethod] = useState<"whatsapp" | "sms">("whatsapp");
  const [kosNotifikasiTab, setKosNotifikasiTab] = useState("Semua");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [kosKamarFilter, setKosKamarFilter] = useState("Semua (12)");
  const [kosPenghuniFilter, setKosPenghuniFilter] = useState("Semua (10)");
  const [showKosRoomMenu, setShowKosRoomMenu] = useState(false);
  const [kosRoomWizardStep, setKosRoomWizardStep] = useState(0); // 0 means closed, 1,2,3 are steps
  const [kosRoomWizardMode, setKosRoomWizardMode] = useState<"add" | "edit">("add");
  const [kosRoomAmenities, setKosRoomAmenities] = useState<string[]>(["AC", "WiFi", "KM Dalam", "Kasur", "Lemari", "Meja"]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [financePeriod, setFinancePeriod] = useState<"Minggu" | "Bulan">("Minggu");

  const MOCK_CUSTOMERS = [
    { id: 1, name: "Siti Aminah", phone: "0812 1987 6543", avatar: "https://i.pravatar.cc/150?img=5", totalOrder: 12, status: "VIP" },
    { id: 2, name: "Ahmad Faisal", phone: "0812 3456 7890", avatar: "https://i.pravatar.cc/150?img=11", totalOrder: 8, status: "Reguler" },
    { id: 3, name: "Dewi Lestari", phone: "0812 5678 9012", avatar: "https://i.pravatar.cc/150?img=9", totalOrder: 5, status: "Reguler" },
    { id: 4, name: "Budi Santoso", phone: "0812 1111 2222", avatar: "https://i.pravatar.cc/150?img=12", totalOrder: 3, status: "Reguler" },
  ];

  const selectedOrder = laundryOrders.find(o => o.id === selectedLaundryOrderId);

  useEffect(() => {
    if (businessRoles.length > 0 && !businessRoles.includes(activeBusinessTab)) {
      setActiveBusinessTab(businessRoles[0]);
    }
  }, [businessRoles, activeBusinessTab]);

  const MOCK_KOS_OCCUPANTS = [
    {
      id: "OCC1", name: "Budi Santoso", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", 
      status: "Aktif", room: "Kamar 1A", type: "Tipe AC", phone: "0812 3456 7890", 
      entryDate: "15 Jan 2026", remainingDays: 20, price: 1200000
    },
    {
      id: "OCC2", name: "Dewi Lestari", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", 
      status: "Aktif", room: "Kamar 2C", type: "Tipe AC", phone: "0813 2468 1357", 
      entryDate: "10 Feb 2026", remainingDays: 16, price: 1300000
    },
    {
      id: "OCC3", name: "Ahmad Faisal", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", 
      status: "Aktif", room: "Kamar 3B", type: "Tipe Standar", phone: "0821 9876 5432", 
      entryDate: "01 Mar 2026", remainingDays: 7, price: 950000
    },
    {
      id: "OCC4", name: "Siti Aminah", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", 
      status: "Aktif", room: "Kamar 1B", type: "Tipe AC", phone: "0812 7654 3210", 
      entryDate: "20 Feb 2026", remainingDays: 12, price: 1200000
    },
    {
      id: "OCC5", name: "Andi Wijaya", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", 
      status: "Aktif", room: "Kamar 2A", type: "Tipe Standar", phone: "0857 1234 5678", 
      entryDate: "05 Mar 2026", remainingDays: 30, price: 850000
    }
  ];

  const MOCK_KOS_FINANCE_TRANSACTIONS = [
    { id: "TRX1", title: "Pembayaran Kamar A-03", subtitle: "Budi Santoso • 2 Juli 2026", amount: 1500000, type: "in" },
    { id: "TRX2", title: "Bayar Listrik", subtitle: "PLN • 5 Juli 2026", amount: 650000, type: "out" },
    { id: "TRX3", title: "Laundry Bulanan", subtitle: "Ayu • 6 Juli 2026", amount: 250000, type: "in" },
  ];

  const MOCK_KOS_ROOMS_MANAGEMENT = [
    {
      id: "1A", type: "Tipe AC", category: "Kos Putra", status: "Terisi", occupant: "Budi Santoso", 
      avatar: "https://i.pravatar.cc/150?img=11", price: 1200000, 
      amenities: ["AC", "WiFi", "KM Dalam"], extraAmenities: "Kasur, Lemari, Meja",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop"
    },
    {
      id: "2B", type: "Tipe Standar", category: "Kos Putra", status: "Kosong", occupant: null, 
      avatar: null, price: 950000, 
      amenities: ["Kipas", "WiFi", "KM Luar"], extraAmenities: "Kasur, Lemari",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&h=300&fit=crop"
    },
    {
      id: "2C", type: "Tipe AC", category: "Kos Putri", status: "Terisi", occupant: "Dewi Lestari", 
      avatar: "https://i.pravatar.cc/150?img=5", price: 1300000, 
      amenities: ["AC", "WiFi", "KM Dalam"], extraAmenities: "Kasur, Lemari, Meja",
      image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&h=300&fit=crop"
    },
    {
      id: "3A", type: "Tipe AC", category: "Kos Putra", status: "Kosong", occupant: null, 
      avatar: null, price: 1200000, 
      amenities: ["AC", "WiFi", "KM Dalam"], extraAmenities: "Kasur, Lemari, Meja",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7FAF8]">
      {activeLaundryScreen === "dashboard" ? (
        <>
          <div className={`shrink-0 transition-colors duration-500 ${(online || dashboardMode === "mitra") ? "bg-gradient-to-b from-[#0D5C36] to-[#1B7A4E]" : "bg-gradient-to-b from-gray-700 to-gray-600"}`}>
            <StatusBar light />
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Halo, selamat pagi 🌿</p>
              <h2 className="text-white font-extrabold text-xl">Pak Rahman</h2>
            </div>
            <button onClick={() => setActiveLaundryScreen("kos_notifikasi")} className="relative w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
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
            {/* Sub-Tab Navigation (Always show to confirm roles) */}
            {businessRoles.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {businessRoles.includes("kos") && (
                  <button 
                    onClick={() => setActiveBusinessTab("kos")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${activeBusinessTab === "kos" ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-white text-gray-500 border-gray-200"}`}
                  >
                    <Store size={14} /> Pemilik Kos
                  </button>
                )}
                {businessRoles.includes("laundry") && (
                  <button 
                    onClick={() => setActiveBusinessTab("laundry")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${activeBusinessTab === "laundry" ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20" : "bg-white text-gray-500 border-gray-200"}`}
                  >
                    <Shirt size={14} /> Pemilik Laundry
                  </button>
                )}
                {businessRoles.includes("catering") && (
                  <button 
                    onClick={() => setActiveBusinessTab("catering")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${activeBusinessTab === "catering" ? "bg-yellow-600 border-yellow-600 text-white shadow-md shadow-yellow-600/20" : "bg-white text-gray-500 border-gray-200"}`}
                  >
                    <Coffee size={14} /> Pemilik Catering
                  </button>
                )}
                {businessRoles.includes("marketplace") && (
                  <button 
                    onClick={() => setActiveBusinessTab("marketplace")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${activeBusinessTab === "marketplace" ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20" : "bg-white text-gray-500 border-gray-200"}`}
                  >
                    <Store size={14} /> Pemilik Marketplace
                  </button>
                )}
              </div>
            )}

            {/* --- KOS DASHBOARD --- */}
            {activeBusinessTab === "kos" && (
              <div className="flex flex-col relative" style={{ marginLeft: "-16px", marginRight: "-16px", marginTop: "-16px" }}>
                {/* Background extension */}
                <div className="absolute top-0 left-0 w-full h-[220px] bg-gradient-to-b from-[#0D5C36] to-[#0D5C36] rounded-b-[40px] -z-10" />

                {/* Ringkasan Hari Ini */}
                <div className="bg-white rounded-t-[32px] pt-6 px-4 pb-2">
                   <div className="flex justify-between items-center mb-4 px-1">
                      <h3 className="font-extrabold text-[15px] text-gray-900">Ringkasan Bisnis Bulan Ini</h3>
                      <button className="text-[11px] font-bold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">Juli 2026 <ChevronDown size={14}/></button>
                   </div>
                   
                   <div className="bg-[#0B4A2B] rounded-[24px] p-5 relative overflow-hidden mb-6 shadow-sm">
                      <div className="relative z-10">
                         <p className="text-white/80 text-[12px] font-medium mb-1">Estimasi Pendapatan</p>
                         <p className="text-white font-black text-[26px] tracking-tight mb-3">Rp 12.500.000</p>
                         <div className="flex items-center gap-2">
                            <span className="bg-[#A7F3D0] text-[#064E3B] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                               <TrendingUp size={12} strokeWidth={3} /> +5.2%
                            </span>
                            <span className="text-[11px] text-white/80">vs bulan lalu</span>
                         </div>
                      </div>
                      <div className="absolute -right-4 -bottom-6 opacity-10">
                         <Wallet size={120} className="text-white" strokeWidth={1} />
                      </div>
                   </div>

                   <h3 className="font-extrabold text-[15px] text-gray-900 mb-4 px-1">Tingkat Keterisian</h3>
                   
                   <div className="flex items-center justify-between px-2 mb-6">
                      <div className="relative w-[110px] h-[110px] flex items-center justify-center shrink-0">
                         <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                           <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                           <path className="text-[#0D5C36]" strokeDasharray="83, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                         </svg>
                         <div className="absolute flex flex-col items-center justify-center">
                            <span className="font-black text-[22px] text-gray-900 leading-none">83%</span>
                            <span className="text-[11px] font-bold text-gray-500 mt-0.5">Terisi</span>
                         </div>
                      </div>

                      <div className="flex-1 ml-6 flex flex-col gap-3">
                         <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-xl">
                            <div className="flex items-center gap-2">
                               <div className="w-7 h-7 rounded-full bg-[#E7F6ED] text-[#0D5C36] flex items-center justify-center">
                                  <Building2 size={14} />
                               </div>
                               <span className="text-[12px] font-medium text-gray-600">Total Kamar</span>
                            </div>
                            <span className="font-black text-[14px] text-gray-900">12</span>
                         </div>
                         <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-xl">
                            <div className="flex items-center gap-2">
                               <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                  <Users size={14} />
                               </div>
                               <span className="text-[12px] font-medium text-gray-600">Kamar Terisi</span>
                            </div>
                            <span className="font-black text-[14px] text-gray-900">10</span>
                         </div>
                         <div className="flex items-center justify-between bg-orange-50/30 p-2 rounded-xl border border-orange-50">
                            <div className="flex items-center gap-2">
                               <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                                  <Store size={14} />
                               </div>
                               <span className="text-[12px] font-medium text-gray-600">Kamar Kosong</span>
                            </div>
                            <span className="font-black text-[14px] text-orange-500">2</span>
                         </div>
                      </div>
                   </div>

                   {/* Quick Action */}
                   <div className="flex justify-between items-start px-2 mb-8">
                     {[
                       { icon: Building2, label: "Manajemen\nKamar", action: () => setActiveLaundryScreen("kos_manajemen_kamar") },
                       { icon: Users, label: "Penghuni", action: () => setActiveLaundryScreen("kos_manajemen_penghuni") },
                       { icon: FileText, label: "Laporan\nKeuangan", action: () => setActiveLaundryScreen("kos_laporan_keuangan") },
                       { icon: LayoutGrid, label: "Lainnya", action: () => {} }
                     ].map((btn, idx) => (
                       <div key={idx} onClick={btn.action} className="flex flex-col items-center gap-2 cursor-pointer w-[70px]">
                         <button className="w-[66px] h-[66px] rounded-[20px] bg-white border border-gray-100 text-[#0D5C36] flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] active:scale-95 transition-transform relative overflow-hidden">
                           <btn.icon size={26} strokeWidth={1.5} />
                         </button>
                         <span className="text-[11px] font-bold text-gray-700 text-center leading-[1.2]">{btn.label.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</span>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Notifikasi Booking & Tagihan */}
                <div className="px-4">
                  <div className="flex justify-between items-center mb-3 px-1">
                     <h3 className="font-extrabold text-[15px] text-gray-900">Perlu Tindakan</h3>
                     <button className="text-[11px] font-bold text-[#0D5C36] hover:text-[#1B7A4E] flex items-center gap-0.5">Lihat Semua <ChevronRight size={14}/></button>
                  </div>
                  
                  <div className="bg-white rounded-[24px] shadow-sm overflow-hidden flex flex-col mb-6 border border-gray-100/50">
                     {/* Booking Baru */}
                     <div className="p-4 border-b border-gray-50 flex gap-3 items-start relative hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-orange-400" />
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                           <Bell size={18} />
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-[13px] text-gray-900">Booking Kamar Baru</h4>
                              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Baru saja</span>
                           </div>
                           <p className="text-[12px] text-gray-500 mb-3 leading-relaxed">Budi Santoso telah membayar DP untuk tipe <span className="font-bold text-gray-700">Kos Putra</span>.</p>
                           <button onClick={() => setActiveLaundryScreen("kos_verifikasi_dp")} className="bg-orange-500 text-white text-[11px] font-bold px-4 py-2 rounded-xl shadow-sm shadow-orange-500/20 hover:bg-orange-600 transition-colors">Verifikasi DP</button>
                        </div>
                     </div>

                     {/* Tagihan Jatuh Tempo */}
                     <div className="p-4 flex gap-3 items-start relative hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-red-400" />
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                           <AlertCircle size={18} />
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-[13px] text-gray-900">Tagihan Jatuh Tempo</h4>
                              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Hari ini</span>
                           </div>
                           <p className="text-[12px] text-gray-500 mb-3 leading-relaxed">Kamar 04 (Ahmad) jatuh tempo hari ini sebesar <span className="font-bold text-gray-700">Rp 1.500.000</span>.</p>
                           <button onClick={() => setActiveLaundryScreen("kos_kirim_pengingat")} className="bg-red-50 text-red-500 border border-red-100 text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">Kirim Pengingat</button>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Status Kamar */}
                <div className="px-4 pb-10">
                  <div className="flex justify-between items-center mb-3 px-1">
                     <h3 className="font-extrabold text-[15px] text-gray-900">Status Kamar Kosong</h3>
                     <button className="text-[11px] font-bold text-[#0D5C36] hover:text-[#1B7A4E] flex items-center gap-0.5">Kelola Kamar <ChevronRight size={14}/></button>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
                     {[1, 2].map((kamar, idx) => (
                        <div key={idx} className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-w-[240px] shrink-0">
                           <div className="flex justify-between items-center mb-2">
                              <span className="font-black text-[15px] text-gray-900">Kamar {idx + 1}A</span>
                              <span className="bg-[#E7F6ED] text-[#0D5C36] text-[10px] font-bold px-2.5 py-1 rounded-full">Kos Putra</span>
                           </div>
                           <p className="font-bold text-[13px] text-gray-700 mb-3">Tipe Campur AC</p>
                           
                           <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-5 font-medium">
                              <div className="flex items-center gap-1"><Monitor size={12} /> AC</div>
                              <div className="flex items-center gap-1"><Wifi size={12} /> WiFi</div>
                              <div className="flex items-center gap-1"><Bath size={12} /> KM Dalam</div>
                           </div>
                           
                           <div>
                              <p className="font-black text-[16px] text-[#0D5C36]">Rp 1.200.000 <span className="text-[11px] text-gray-400 font-medium line-through decoration-transparent">/bulan</span></p>
                           </div>
                        </div>
                     ))}
                  </div>
                </div>

              </div>
            )}

            {/* --- LAUNDRY DASHBOARD --- */}
            {activeBusinessTab === "laundry" && (
              <div className="flex flex-col relative" style={{ marginLeft: "-16px", marginRight: "-16px", marginTop: "-16px" }}>
                {/* Background extension */}
                <div className="absolute top-0 left-0 w-full h-[220px] bg-gradient-to-b from-[#0D5C36] to-[#0D5C36] rounded-b-[40px] -z-10" />
                
                {/* Ringkasan Hari Ini */}
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 mx-4 mt-6">
                  <div className="flex justify-between items-center p-5 pb-4 border-b border-gray-50">
                    <div>
                      <h3 className="font-extrabold text-[15px] text-gray-900">Ringkasan Hari Ini</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">Selasa, 14 Juli 2026</p>
                    </div>
                    <button className="text-[11px] font-bold text-[#0D5C36] hover:text-[#1B7A4E] flex items-center gap-0.5">Lihat Detail <ChevronRight size={14}/></button>
                  </div>
                  
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-3 p-4 border-r border-b border-gray-50">
                      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 border border-teal-100 bg-white">
                        <ShoppingBag size={18} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-[15px] leading-none">12</p>
                        <p className="text-[10px] text-gray-500 mt-1">Pesanan Baru</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border-b border-gray-50">
                      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 border border-teal-100 bg-white">
                        <Wallet size={18} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-[15px] leading-none">18</p>
                        <p className="text-[10px] text-gray-500 mt-1">Sedang Dikerjakan</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border-r border-gray-50">
                      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 border border-green-100 bg-white">
                        <CheckSquare size={18} className="text-[#0D5C36]" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-[15px] leading-none">8</p>
                        <p className="text-[10px] text-gray-500 mt-1">Selesai Hari Ini</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 border border-green-100 bg-white">
                        <TrendingUp size={18} className="text-[#0D5C36]" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-[15px] leading-none">{rp(1245000)}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Pendapatan</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pesanan Terbaru */}
                <div className="mt-6 px-4">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-extrabold text-[15px] text-gray-900">Pesanan Terbaru</h3>
                    <button onClick={() => setActiveLaundryScreen("manajemen_order")} className="text-[11px] font-bold text-[#0D5C36] hover:text-[#1B7A4E] flex items-center gap-0.5">Lihat Semua <ChevronRight size={14}/></button>
                  </div>
                  
                  <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    {laundryOrders.map((order, idx) => {
                      const isBaru = order.status === "baru" || order.status === "menunggu_harga";
                      const isDiproses = order.status === "diproses";
                      const isSelesai = order.status === "selesai";
                      
                      let bgIcon = isBaru ? "bg-green-50 text-green-600" : isDiproses ? "bg-blue-50 text-blue-500" : "bg-indigo-50 text-indigo-500";
                      let bgPill = isBaru ? "bg-[#E7F6ED] text-[#0D5C36]" : isDiproses ? "bg-blue-50 text-blue-500" : isSelesai ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-500";
                      let labelPill = order.status === "baru" ? "Baru" : order.status === "menunggu_harga" ? "Menunggu Harga" : order.status === "diproses" ? "Diproses" : order.status === "diantar" ? "Diantar" : "Selesai";
                      if (order.status === "menunggu_harga" || order.status === "baru") {
                        bgPill = order.status === "baru" ? "bg-[#E7F6ED] text-[#0D5C36]" : "bg-orange-50 text-orange-500";
                      }
                      
                      return (
                        <div 
                          key={order.id}
                          onClick={() => {
                            setSelectedLaundryOrderId(order.id);
                            setLaundryWeight(order.weight || 3.0);
                            setLaundryFlowStep(order.status === "baru" || order.status === "menunggu_harga" ? "input_weight" : "detail");
                          }}
                          className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${idx !== laundryOrders.length - 1 ? 'border-b border-gray-50' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgIcon}`}>
                              <Shirt size={18} />
                            </div>
                            <div>
                              <p className="font-extrabold text-[13px] text-gray-900">{order.id}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5">{order.name} • {order.service}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`${bgPill} text-[9px] font-extrabold px-3 py-1 rounded-full`}>{labelPill}</span>
                            <p className="font-black text-[13px] text-gray-900">{order.total > 0 ? rp(order.total) : "-"}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Action */}
                <div className="mt-6 px-4 pb-10">
                  <h3 className="font-extrabold text-[13px] text-gray-900 mb-4 ml-1">Quick Action</h3>
                  <div className="flex justify-between items-start px-2">
                    {[
                      { icon: Package, label: "Manajemen Order", action: () => setActiveLaundryScreen("manajemen_order") },
                      { icon: Users, label: "Manajemen User", action: () => setActiveLaundryScreen("manajemen_user") },
                      { icon: BarChart2, label: "Laporan Keuangan", action: () => setActiveLaundryScreen("manajemen_keuangan") },
                      { icon: LayoutGrid, label: "Lainnya", action: () => setActiveLaundryScreen("manajemen_lainnya") }
                    ].map((btn, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <button onClick={btn.action} className="w-[60px] h-[60px] rounded-[22px] bg-[#0B4A2B] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                          <btn.icon size={24} className="relative z-10" />
                        </button>
                        <span className="text-[11px] font-bold text-gray-800 text-center leading-tight max-w-[60px]">{btn.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- CATERING DASHBOARD --- */}
            {activeBusinessTab === "catering" && (
              <div className="flex flex-col gap-4">
                {/* Kitchen Status Banner for Catering */}
                <div className="bg-amber-950 text-white rounded-[24px] p-4 flex flex-col gap-3.5 shadow-md relative overflow-hidden">
                  <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-amber-800/20 rounded-full" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h4 className="text-[10px] font-black text-amber-300 uppercase tracking-widest">Status Dapur Katering</h4>
                      <p className="text-sm font-extrabold mt-0.5">{kitchenOpen ? "🟢 Dapur Aktif (Menerima PO)" : "🔴 Dapur Sibuk (PO Dijeda)"}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setKitchenOpen(!kitchenOpen);
                        showToast(kitchenOpen ? "Status dapur diubah menjadi SIBUK (PO Dijeda)" : "Status dapur diubah menjadi AKTIF (Menerima PO)");
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer shadow transition-all ${kitchenOpen ? "bg-red-500 text-white hover:bg-red-600" : "bg-amber-500 text-white hover:bg-amber-600"}`}
                    >
                      {kitchenOpen ? "Set Sibuk" : "Set Aktif"}
                    </button>
                  </div>
                  <div className="border-t border-amber-800/50 pt-3 grid grid-cols-3 gap-2 text-center text-[10px] relative z-10">
                    <div>
                      <span className="text-amber-300 block">Rating Rasa</span>
                      <span className="font-bold text-sm">4.9 ★</span>
                    </div>
                    <div>
                      <span className="text-amber-300 block">Tepat Waktu</span>
                      <span className="font-bold text-sm">100%</span>
                    </div>
                    <div>
                      <span className="text-amber-300 block">Kapasitas Dapur</span>
                      <span className="font-bold text-sm">85/100 pax</span>
                    </div>
                  </div>
                </div>

                {/* Catering Hub */}
                <div className="mb-2">
                  <h3 className="font-bold text-sm text-gray-900 mb-3">Pusat Kelola Katering (Catering Hub)</h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button 
                      onClick={() => setShowCatSchedule(true)}
                      className="bg-white border border-gray-100 hover:border-amber-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <Clock size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Jadwal Kirim PO</span>
                    </button>
                    <button 
                      onClick={() => setShowCatPackages(true)}
                      className="bg-white border border-gray-100 hover:border-amber-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <Utensils size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Daftar Paket</span>
                    </button>
                    <button 
                      onClick={() => setShowCatSettings(true)}
                      className="bg-white border border-gray-100 hover:border-amber-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <SlidersHorizontal size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Aturan PO</span>
                    </button>

                    <button 
                      onClick={() => setShowCatFinance(true)}
                      className="bg-white border border-gray-100 hover:border-amber-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <Wallet size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Ringkasan Uang</span>
                    </button>
                    <button 
                      onClick={() => setShowCatHolidays(true)}
                      className="bg-white border border-gray-100 hover:border-amber-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <AlertCircle size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Hari Libur</span>
                    </button>
                    <button 
                      onClick={() => setShowCatInvoice(true)}
                      className="bg-white border border-gray-100 hover:border-amber-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <Package size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Nota & Surat Jalan</span>
                    </button>
                  </div>
                </div>

                {/* Catering PO Orders */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 mt-2">
                    <h3 className="font-bold text-sm text-gray-900">Pesanan Catering PO Masuk</h3>
                    {catOrderStatus === "pending" && <Pill color="yellow">1 pending</Pill>}
                    {catOrderStatus === "cooking" && <Pill color="orange">Sedang dimasak</Pill>}
                    {catOrderStatus === "ready" && <Pill color="green">Siap kirim</Pill>}
                    {catOrderStatus === "delivered" && <Pill color="blue">Telah dikirim</Pill>}
                  </div>
                  
                  <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm relative overflow-hidden transition-all duration-300">
                    <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${catOrderStatus === 'pending' ? 'bg-yellow-500' : catOrderStatus === 'cooking' ? 'bg-orange-500' : catOrderStatus === 'ready' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    
                    <div className="flex justify-between items-center mb-3 border-b border-dashed border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                          <Coffee size={14} />
                        </div>
                        <div>
                          <p className="font-extrabold text-[13px] text-gray-900">PO #CAT-481</p>
                          <p className="text-[10px] text-gray-500">Rizky Pangestu · Nasi Tumpeng (20 Pax)</p>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded">DP 30% Lunas</span>
                    </div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[9px] text-gray-400">Tanggal Pengiriman</p>
                        <p className="font-extrabold text-[11px] text-gray-800">Besok, 12:00 WIB</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-gray-400">Sisa Pelunasan</p>
                        <p className="font-extrabold text-[12px] text-amber-700">{rp(350000)}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-gray-400">Total Nilai PO</p>
                        <p className="font-black text-[14px] text-gray-900">{rp(500000)}</p>
                      </div>
                      <div className="flex gap-2">
                        {catOrderStatus === "pending" && (
                          <button 
                            onClick={() => {
                              setCatOrderStatus("cooking");
                              showToast("Pesanan PO diterima! Memulai proses masak.");
                            }}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow shadow-amber-500/20"
                          >
                            🍳 Terima & Masak
                          </button>
                        )}
                        {catOrderStatus === "cooking" && (
                          <button 
                            onClick={() => {
                              setCatOrderStatus("ready");
                              showToast("Proses masak selesai! Makanan siap kirim.");
                            }}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow shadow-orange-500/20"
                          >
                            🍲 Siap Kirim
                          </button>
                        )}
                        {catOrderStatus === "ready" && (
                          <button 
                            onClick={() => {
                              setCatOrderStatus("delivered");
                              showToast("Pesanan PO diserahkan ke kurir pengiriman.");
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow shadow-green-600/20"
                          >
                            🚚 Kirim Sekarang
                          </button>
                        )}
                        {catOrderStatus === "delivered" && (
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-xl flex items-center gap-1">
                            ✓ Pesanan Selesai
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* --- MARKETPLACE DASHBOARD --- */}
            {activeBusinessTab === "marketplace" && (
              <div className="flex flex-col gap-4">
                {/* Outlet Status Banner for Marketplace */}
                <div className="bg-emerald-950 text-white rounded-[24px] p-4 flex flex-col gap-3.5 shadow-md relative overflow-hidden">
                  <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-emerald-800/20 rounded-full" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h4 className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Status Outlet Anda</h4>
                      <p className="text-sm font-extrabold mt-0.5">{storeOpen ? "🟢 Toko Buka (Menerima Order)" : "🔴 Toko Tutup (Offline)"}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setStoreOpen(!storeOpen);
                        showToast(storeOpen ? "Status outlet diubah menjadi TUTUP" : "Status outlet diubah menjadi BUKA");
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer shadow transition-all ${storeOpen ? "bg-red-500 text-white hover:bg-red-600" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}
                    >
                      {storeOpen ? "Tutup Outlet" : "Buka Outlet"}
                    </button>
                  </div>
                  <div className="border-t border-emerald-800/50 pt-3 grid grid-cols-3 gap-2 text-center text-[10px] relative z-10">
                    <div>
                      <span className="text-emerald-300 block">Rating Toko</span>
                      <span className="font-bold text-sm">4.9 ★</span>
                    </div>
                    <div>
                      <span className="text-emerald-300 block">Penyelesaian</span>
                      <span className="font-bold text-sm">99.4%</span>
                    </div>
                    <div>
                      <span className="text-emerald-300 block">Kecepatan</span>
                      <span className="font-bold text-sm">11 mnt</span>
                    </div>
                  </div>
                </div>

                {/* GoBiz Hub for Marketplace */}
                <div className="mb-2">
                  <h3 className="font-bold text-sm text-gray-900 mb-3">Pusat Kelola Outlet (GoBiz Hub)</h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button 
                      onClick={() => setShowMktHistory(true)}
                      className="bg-white border border-gray-100 hover:border-emerald-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <BarChart2 size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Riwayat Transaksi</span>
                    </button>
                    <button 
                      onClick={() => setShowMktPromo(true)}
                      className="bg-white border border-gray-100 hover:border-emerald-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Percent size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Kelola Promo</span>
                    </button>
                    <button 
                      onClick={() => setShowMktSettings(true)}
                      className="bg-white border border-gray-100 hover:border-emerald-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Settings size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Pengaturan Toko</span>
                    </button>

                    <button 
                      onClick={() => setShowMktFinance(true)}
                      className="bg-white border border-gray-100 hover:border-emerald-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Wallet size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Tarik Saldo</span>
                    </button>
                    <button 
                      onClick={() => setShowMktHours(true)}
                      className="bg-white border border-gray-100 hover:border-emerald-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Clock size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Jam Operasional</span>
                    </button>
                    <button 
                      onClick={() => setShowMktReviews(true)}
                      className="bg-white border border-gray-100 hover:border-emerald-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center gap-2 cursor-pointer transition-all active:scale-95 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <MessageSquare size={18} />
                      </div>
                      <span className="text-[10px] font-black text-gray-700 text-center leading-tight">Ulasan Toko</span>
                    </button>
                  </div>
                </div>

                {/* Marketplace/Toko Orders */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 mt-2">
                    <h3 className="font-bold text-sm text-gray-900">Pesanan Toko Aktif (GoBiz Style)</h3>
                    {mktOrderStatus === "new" && <Pill color="green">1 baru</Pill>}
                    {mktOrderStatus === "preparing" && <Pill color="orange">Sedang disiapkan</Pill>}
                    {mktOrderStatus === "searching" && <Pill color="blue">Mencari kurir</Pill>}
                    {mktOrderStatus === "otw" && <Pill color="purple">Kurir otw</Pill>}
                  </div>
                  
                  <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm relative overflow-hidden transition-all duration-300">
                    <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${mktOrderStatus === 'new' ? 'bg-green-500' : mktOrderStatus === 'preparing' ? 'bg-orange-500' : mktOrderStatus === 'searching' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                    
                    <div className="flex justify-between items-center mb-3 border-b border-dashed border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Store size={14} />
                        </div>
                        <div>
                          <p className="font-extrabold text-[13px] text-gray-900">Order #MKT-802</p>
                          <p className="text-[10px] text-gray-500">Bambang Wijaya · Nasi Timbel Komplit (2x)</p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded">Bayar Lunas</span>
                    </div>

                    {/* Dynamic Workflow Info */}
                    {mktOrderStatus === "new" && (
                      <div className="flex justify-between items-center mt-3">
                        <div>
                          <p className="text-[10px] text-gray-400">Total Transaksi</p>
                          <p className="font-black text-[14px] text-gray-900">{rp(50000)}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setMktOrderStatus("preparing");
                            showToast("Pesanan diproses: Mulai menyiapkan makanan!");
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
                        >
                          Terima & Siapkan Makanan
                        </button>
                      </div>
                    )}

                    {mktOrderStatus === "preparing" && (
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Persiapan Makanan</span>
                          <span className="text-xs font-bold text-orange-600 animate-pulse">Menyiapkan...</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full animate-[shimmer_2s_infinite]" style={{ width: "65%" }} />
                        </div>
                        <button 
                          onClick={() => {
                            setMktOrderStatus("searching");
                            showToast("Makanan selesai! Mencari kurir terdekat...");
                          }}
                          className="w-full mt-2 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all cursor-pointer text-center"
                        >
                          Selesai Siapkan & Panggil Kurir
                        </button>
                      </div>
                    )}

                    {mktOrderStatus === "searching" && (
                      <div className="flex flex-col gap-3 mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <RefreshCw size={12} className="animate-spin text-blue-500" />
                            Mencari Rangers Driver terdekat...
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            setMktOrderStatus("otw");
                            showToast("Kurir ditemukan! Pak Rahman sedang menuju ke toko Anda.");
                          }}
                          className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer text-center"
                        >
                          Hubungkan dengan Kurir (Simulasi)
                        </button>
                      </div>
                    )}

                    {mktOrderStatus === "otw" && (
                      <div className="flex flex-col gap-3 mt-2 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm shrink-0">🏍️</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900">Pak Rahman (Driver)</p>
                            <p className="text-[10px] text-muted-foreground">Supra H 4251 AA · Menuju Toko</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setMktOrderStatus("new");
                            showToast("Serah terima makanan selesai! Pesanan diambil oleh kurir.");
                          }}
                          className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer text-center"
                        >
                          Serahkan Makanan ke Kurir
                        </button>
                      </div>
                    )}

                  </div>
                </div>

                {/* GoFood-style Menu Management */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 mt-2">
                    <h3 className="font-bold text-sm text-gray-900">Kelola Menu Outlet (GoBiz)</h3>
                    <span className="text-[10px] font-bold text-primary">Live Sync</span>
                  </div>
                  <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                    {[
                      { id: 1, name: "Nasi Timbel Komplit", price: 25000, desc: "Nasi timbel, ayam goreng, tahu, tempe, lalap, sambal" },
                      { id: 2, name: "Ayam Bakar Madu", price: 28000, desc: "Ayam bakar bumbu madu khas Kamojang" },
                      { id: 3, name: "Es Jeruk Peras", price: 8000, desc: "Es jeruk segar dari jeruk asli diperas langsung" }
                    ].map(menu => {
                      const isAvailable = (menuStatusList as any)[menu.id] ?? true;
                      return (
                        <div key={menu.id} className="flex justify-between items-center gap-3 pb-3 border-b border-gray-50 last:border-b-0 last:pb-0">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-gray-900">{menu.name}</h4>
                            <p className="text-[10px] text-gray-500 mt-0.5 truncate">{menu.desc}</p>
                            <p className="text-[11px] font-extrabold text-primary mt-1">{rp(menu.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {isAvailable ? "Tersedia" : "Habis"}
                            </span>
                            <button 
                              onClick={() => {
                                setMenuStatusList(prev => ({ ...prev, [menu.id]: !isAvailable }));
                                showToast(`${menu.name} diatur menjadi ${!isAvailable ? 'Tersedia' : 'Habis'}`);
                              }}
                              className={`w-10 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${isAvailable ? "bg-primary" : "bg-gray-300"}`}
                            >
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isAvailable ? "translate-x-4.5" : "translate-x-0.5"}`} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
      {/* Riwayat Transaksi Toko (GoBiz style) */}
      {showMktHistory && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#1B7A4E] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowMktHistory(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Riwayat Transaksi</h3>
                <p className="text-[10px] text-green-200">Log order selesai - Live data</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
            {mktHistoryData.map(h => (
              <div key={h.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                  <span>ID: #{h.id} · {h.date}</span>
                  <span className="bg-green-50 text-green-700 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Selesai</span>
                </div>
                <div className="border-t border-dashed border-gray-100 my-1" />
                <div className="text-xs font-bold text-gray-800">{h.customer}</div>
                <div className="text-[11px] text-muted-foreground">{h.items}</div>
                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400">Total Penjualan</span>
                  <span className="text-sm font-black text-primary">{rp(h.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kelola Promo Outlet (GoBiz style) */}
      {showMktPromo && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#1B7A4E] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowMktPromo(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Kelola Promo Outlet</h3>
                <p className="text-[10px] text-green-200">Buat diskon & voucher mandiri</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
            
            {/* Promo Header banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-5 text-white flex flex-col gap-2 relative overflow-hidden shadow">
              <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-white/10 rounded-full" />
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-200">PROMO MERDEKA UMKM</div>
              <h4 className="text-base font-extrabold">Naikkan Penjualan Toko!</h4>
              <p className="text-[10px] leading-relaxed text-emerald-100">Aktifkan promo voucher agar produk Anda muncul di halaman rekomendasi utama.</p>
            </div>

            {/* List of active promos */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Daftar Promo</h4>
              {promoList.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center gap-3">
                  <div className="flex-1">
                    <span className="bg-primary/10 text-primary text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">{p.type}</span>
                    <h5 className="font-bold text-xs text-gray-800 mt-1.5">{p.name}</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Potongan: {rp(p.value)}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setPromoList(prev => prev.map(x => x.id === p.id ? { ...x, active: !x.active } : x));
                      showToast(`Promo ${p.name} ${!p.active ? 'diaktifkan' : 'dinonaktifkan'}`);
                    }}
                    className={`w-12 h-6.5 rounded-full relative transition-colors duration-200 cursor-pointer ${p.active ? "bg-primary" : "bg-gray-300"}`}
                  >
                    <div className={`absolute top-0.5 w-5.5 h-5.5 bg-white rounded-full shadow transition-transform duration-200 ${p.active ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new promo action */}
            <button 
              onClick={() => showToast("Fitur integrasi kustom promo akan tersedia di rilis beta berikutnya!")}
              className="w-full py-4 bg-primary text-white font-extrabold rounded-2xl shadow-md cursor-pointer hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 mt-4 text-xs"
            >
              ➕ Buat Promo Baru
            </button>
          </div>
        </div>
      )}

      {/* Pengaturan Profil Toko (GoBiz style) */}
      {showMktSettings && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#1B7A4E] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowMktSettings(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Pengaturan Profil Toko</h3>
                <p className="text-[10px] text-green-200">Konfigurasi outlet & jam buka</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Nama Toko Outlet</label>
                <input 
                  type="text" 
                  value={mktStoreInfo.name} 
                  onChange={(e) => setMktStoreInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Jam Operasional</label>
                <input 
                  type="text" 
                  value={mktStoreInfo.hours} 
                  onChange={(e) => setMktStoreInfo(prev => ({ ...prev, hours: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-semibold"
                  placeholder="Contoh: 08:00 - 20:00"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Nomor Telepon Outlet</label>
                <input 
                  type="text" 
                  value={mktStoreInfo.phone} 
                  onChange={(e) => setMktStoreInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Alamat Outlet</label>
                <textarea 
                  value={mktStoreInfo.address} 
                  onChange={(e) => setMktStoreInfo(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-foreground focus:outline-none focus:border-primary font-semibold resize-none"
                />
              </div>
            </div>

            <button 
              onClick={() => {
                setShowMktSettings(false);
                showToast("Perubahan profil outlet berhasil disimpan!");
              }}
              className="w-full py-3.5 bg-primary text-white font-extrabold rounded-2xl shadow-md cursor-pointer hover:bg-primary-dark transition-colors text-center text-xs"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}

      {/* Keuangan & Payout Toko (GoBiz style) */}
      {showMktFinance && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#1B7A4E] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowMktFinance(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Ringkasan Uang & Payout</h3>
                <p className="text-[10px] text-green-200">Pantau omzet outlet & pencairan dana</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
            
            {/* Financial Overview Cards */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Total Pendapatan Toko</span>
                  <span className="text-xl font-black text-gray-900">{rp(mktFinanceData.totalOmzet)}</span>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-lg">Toko</span>
              </div>
              <div className="border-t border-dashed border-gray-100 pt-3 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider">Telah Dicairkan</span>
                  <span className="text-sm font-extrabold text-gray-500">{rp(mktFinanceData.withdrawn)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider">Belum Dicairkan</span>
                  <span className="text-sm font-extrabold text-emerald-600">{rp(mktFinanceData.available)}</span>
                </div>
              </div>
            </div>

            {/* Account Balance Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-5 text-white shadow flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute right-[-15px] bottom-[-15px] w-24 h-24 bg-white/10 rounded-full" />
              <div>
                <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider">Saldo Yang Bisa Ditarik</span>
                <h4 className="text-2xl font-black mt-0.5">{rp(mktFinanceData.available)}</h4>
              </div>
              <button 
                onClick={() => {
                  if (mktFinanceData.available <= 0) {
                    showToast("Saldo Anda tidak mencukupi untuk penarikan!");
                  } else {
                    setMktFinanceData(prev => ({ ...prev, withdrawn: prev.withdrawn + prev.available, available: 0 }));
                    showToast("Penarikan saldo toko berhasil dikirim ke rekening bank terdaftar!");
                  }
                }}
                className="w-full py-2.5 bg-white text-emerald-600 font-extrabold rounded-xl text-xs hover:bg-emerald-50 transition-colors shadow"
              >
                💸 Tarik Saldo Toko
              </button>
            </div>

            {/* Transaction Log */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Riwayat Mutasi Saldo</h4>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-gray-800">Order #MKT-802 Selesai</p>
                    <p className="text-[10px] text-gray-400">Hari Ini, 14:20</p>
                  </div>
                  <span className="font-extrabold text-emerald-600">+{rp(50000)}</span>
                </div>
                <div className="border-t border-gray-50 pt-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-gray-800">Penarikan Saldo Sukses</p>
                    <p className="text-[10px] text-gray-400">Kemarin, 11:30</p>
                  </div>
                  <span className="font-extrabold text-red-500">-{rp(1000000)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Jam Operasional Toko (GoBiz style) */}
      {showMktHours && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#1B7A4E] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowMktHours(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Jam Operasional</h3>
                <p className="text-[10px] text-green-200">Atur jadwal buka tutup otomatis outlet</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-[11px] leading-relaxed">
              💡 **Tips**: Dengan mengatur jam operasional otomatis, outlet Anda akan otomatis berstatus "Tutup" di luar jam kerja yang telah ditentukan.
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Jadwal Operasional</h4>
              {mktScheduleHours.map((sched, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-gray-800">{sched.day}</span>
                    <button 
                      onClick={() => {
                        setMktScheduleHours(prev => prev.map((s, i) => i === idx ? { ...s, active: !sched.active } : s));
                        showToast(`Jadwal ${sched.day} ${!sched.active ? 'diaktifkan' : 'dinonaktifkan'}`);
                      }}
                      className={`w-10 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${sched.active ? "bg-primary" : "bg-gray-300"}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${sched.active ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50">
                    <div>
                      <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Jam Buka</span>
                      <input 
                        type="text" 
                        value={sched.open}
                        onChange={(e) => setMktScheduleHours(prev => prev.map((s, i) => i === idx ? { ...s, open: e.target.value } : s))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Jam Tutup</span>
                      <input 
                        type="text" 
                        value={sched.close}
                        onChange={(e) => setMktScheduleHours(prev => prev.map((s, i) => i === idx ? { ...s, close: e.target.value } : s))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setShowMktHours(false);
                showToast("Pengaturan jam operasional otomatis berhasil disimpan!");
              }}
              className="w-full py-3.5 bg-primary text-white font-extrabold rounded-2xl shadow-md cursor-pointer hover:bg-primary-dark transition-colors text-center text-xs mt-2"
            >
              Simpan Jadwal Operasional
            </button>
          </div>
        </div>
      )}

      {/* Ulasan & Rating Toko (GoBiz style) */}
      {showMktReviews && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#1B7A4E] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowMktReviews(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Ulasan & Rating Toko</h3>
                <p className="text-[10px] text-green-200">Komentar & masukan dari pelanggan Anda</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
            {mktReviews.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-gray-800">{r.customer}</span>
                  <span className="text-[10px] text-gray-400">{r.date}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                  {"★".repeat(r.rating)} <span className="text-gray-500 font-normal">({r.rating}.0)</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 italic">"{r.comment}"</p>
                
                {r.reply ? (
                  <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100 mt-2 text-[11px] text-emerald-800">
                    <span className="font-bold block text-[10px] text-emerald-700 uppercase tracking-wider mb-0.5">Balasan Anda:</span>
                    "{r.reply}"
                  </div>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Balas ulasan ini..." 
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = (e.target as HTMLInputElement).value;
                          if (!val) return;
                          setMktReviews(prev => prev.map(x => x.id === r.id ? { ...x, reply: val } : x));
                          showToast("Balasan ulasan berhasil dikirim!");
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jadwal Pengiriman PO (GoBiz style) */}
      {showCatSchedule && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#FF7043] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowCatSchedule(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Jadwal Pengiriman PO</h3>
                <p className="text-[10px] text-orange-100">Kalender persiapan dapur katering</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
            {catScheduleData.map(s => (
              <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-orange-400" />
                <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                  <span className="font-bold text-gray-800">ID: #{s.id}</span>
                  <span className="bg-orange-50 text-orange-700 font-extrabold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider">{s.status}</span>
                </div>
                <div className="border-t border-dashed border-gray-100 my-1" />
                <div className="text-xs font-bold text-gray-800">{s.customer}</div>
                <div className="text-[11px] text-muted-foreground">{s.package}</div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 text-[10px]">
                  <span className="text-gray-400">Rencana Pengiriman</span>
                  <span className="font-bold text-primary">{s.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kelola Daftar Paket Catering (GoBiz style) */}
      {showCatPackages && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#FF7043] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowCatPackages(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Kelola Paket Katering</h3>
                <p className="text-[10px] text-orange-100">Live menu paket katering Anda</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
            {catPackages.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-gray-900">{pkg.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Min. Order: {pkg.minPax} Pax</p>
                  <p className="text-sm font-black text-primary mt-1">{rp(pkg.price)}<span className="text-[9px] font-normal text-muted-foreground">/Pax</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${pkg.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {pkg.active ? "Aktif" : "Nonaktif"}
                  </span>
                  <button 
                    onClick={() => {
                      setCatPackages(prev => prev.map(x => x.id === pkg.id ? { ...x, active: !pkg.active } : x));
                      showToast(`${pkg.name} ${!pkg.active ? 'diaktifkan' : 'dinonaktifkan'}`);
                    }}
                    className={`w-10 h-6 rounded-full relative transition-colors duration-200 cursor-pointer ${pkg.active ? "bg-primary" : "bg-gray-300"}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${pkg.active ? "translate-x-4.5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pengaturan Aturan Pre-Order (GoBiz style) */}
      {showCatSettings && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#FF7043] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowCatSettings(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Pengaturan Aturan PO</h3>
                <p className="text-[10px] text-orange-100">Konfigurasi batas waktu & minimum order</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Batas Waktu Pre-Order Minimum</label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-200">
                  <button 
                    onClick={() => setMinPoDays(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-extrabold text-xs text-gray-800">H - {minPoDays} Hari</span>
                  <button 
                    onClick={() => setMinPoDays(prev => Math.min(7, prev + 1))}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <p className="text-[9px] text-gray-400 mt-1">Batas minimal hari bagi pelanggan sebelum memesan makanan katering Anda.</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Jumlah Minimum Pax per PO</label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-200">
                  <button 
                    onClick={() => setMinPax(prev => Math.max(5, prev - 5))}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-extrabold text-xs text-gray-800">{minPax} Pax</span>
                  <button 
                    onClick={() => setMinPax(prev => Math.min(100, prev + 5))}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <p className="text-[9px] text-gray-400 mt-1">Jumlah minimum porsi / pax untuk satu kali order Pre-Order katering.</p>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowCatSettings(false);
                showToast("Aturan Pre-Order katering berhasil disimpan!");
              }}
              className="w-full py-3.5 bg-primary text-white font-extrabold rounded-2xl shadow-md cursor-pointer hover:bg-primary-dark transition-colors text-center text-xs"
            >
              Simpan Aturan PO
            </button>
          </div>
        </div>
      )}

      {/* Keuangan & Payout Katering (GoBiz style) */}
      {showCatFinance && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#FF7043] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowCatFinance(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Ringkasan Uang & Payout</h3>
                <p className="text-[10px] text-orange-100">Pantau omzet DP & pelunasan Anda</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
            
            {/* Financial Overview Cards */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Total Omzet PO</span>
                  <span className="text-xl font-black text-gray-900">{rp(catFinanceData.totalOmzet)}</span>
                </div>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-lg">Catering</span>
              </div>
              <div className="border-t border-dashed border-gray-100 pt-3 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider">DP Cair (30%/50%)</span>
                  <span className="text-sm font-extrabold text-emerald-600">{rp(catFinanceData.dpSettled)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase font-bold tracking-wider">Pending Pelunasan</span>
                  <span className="text-sm font-extrabold text-amber-600">{rp(catFinanceData.pendingPelunasan)}</span>
                </div>
              </div>
            </div>

            {/* Account Balance Card */}
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl p-5 text-white shadow flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute right-[-15px] bottom-[-15px] w-24 h-24 bg-white/10 rounded-full" />
              <div>
                <span className="text-[10px] font-black text-orange-200 uppercase tracking-wider">Saldo Yang Bisa Ditarik</span>
                <h4 className="text-2xl font-black mt-0.5">{rp(catFinanceData.dpSettled - catFinanceData.withdrawn)}</h4>
              </div>
              <button 
                onClick={() => {
                  if (catFinanceData.dpSettled - catFinanceData.withdrawn <= 0) {
                    showToast("Saldo Anda tidak mencukupi untuk penarikan!");
                  } else {
                    setCatFinanceData(prev => ({ ...prev, withdrawn: prev.dpSettled }));
                    showToast("Penarikan saldo berhasil dikirim ke rekening terdaftar!");
                  }
                }}
                className="w-full py-2.5 bg-white text-orange-600 font-extrabold rounded-xl text-xs hover:bg-orange-50 transition-colors shadow"
              >
                💸 Tarik Saldo ke Rekening Bank
              </button>
            </div>

            {/* Transaction Log */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Riwayat Mutasi Saldo</h4>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-gray-800">DP PO #CAT-481 Cair</p>
                    <p className="text-[10px] text-gray-400">14 Jul 2026, 12:45</p>
                  </div>
                  <span className="font-extrabold text-emerald-600">+{rp(150000)}</span>
                </div>
                <div className="border-t border-gray-50 pt-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-gray-800">Penarikan Saldo Sukses</p>
                    <p className="text-[10px] text-gray-400">12 Jul 2026, 09:00</p>
                  </div>
                  <span className="font-extrabold text-red-500">-{rp(1000000)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Kalender Hari Libur Dapur (GoBiz style) */}
      {showCatHolidays && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#FF7043] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowCatHolidays(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Kalender Hari Libur</h3>
                <p className="text-[10px] text-orange-100">Atur hari libur operasional dapur katering</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
            
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-[11px] leading-relaxed">
              ⚠️ **Perhatian**: Menghidupkan hari libur akan menolak pesanan masuk otomatis pada tanggal tersebut. Pastikan Anda menyelesaikan PO aktif sebelum tanggal libur yang diatur.
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tanggal Libur Terjadwal</h4>
              {catHolidays.map(h => (
                <div key={h.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center gap-3">
                  <div>
                    <h5 className="font-bold text-xs text-gray-800">{h.name}</h5>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{h.date}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setCatHolidays(prev => prev.map(x => x.id === h.id ? { ...x, active: !h.active } : x));
                      showToast(`Status libur ${h.name} ${!h.active ? 'diaktifkan' : 'dinonaktifkan'}`);
                    }}
                    className={`w-12 h-6.5 rounded-full relative transition-colors duration-200 cursor-pointer ${h.active ? "bg-primary" : "bg-gray-300"}`}
                  >
                    <div className={`absolute top-0.5 w-5.5 h-5.5 bg-white rounded-full shadow transition-transform duration-200 ${h.active ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={() => showToast("Fitur tambah hari libur kustom akan tersedia di rilis beta berikutnya!")}
              className="w-full py-3.5 bg-primary text-white font-extrabold rounded-2xl shadow-md cursor-pointer hover:bg-primary-dark transition-colors text-center text-xs mt-4"
            >
              ➕ Tambah Hari Libur Baru
            </button>
          </div>
        </div>
      )}

      {/* Cetak Surat Jalan & Nota Pesanan (GoBiz style) */}
      {showCatInvoice && (
        <div className="absolute inset-0 bg-[#F7FAF8] z-50 flex flex-col text-foreground">
          <div className="bg-[#FF7043] text-white shrink-0">
            <StatusBar light />
            <div className="px-5 pb-4 pt-2 flex items-center gap-3">
              <button 
                onClick={() => setShowCatInvoice(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-extrabold text-sm">Nota Pesanan / Surat Jalan</h3>
                <p className="text-[10px] text-orange-100">Pratinjau label pengiriman kotak katering</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
            
            {/* Nota Printable Container */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 flex flex-col gap-4 text-xs font-mono relative overflow-hidden">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
              
              <div className="text-center pb-2 border-b border-dashed border-gray-200">
                <h4 className="font-bold text-sm text-gray-800">RANGERS CATERING</h4>
                <p className="text-[10px] text-gray-400">Garut, Jawa Barat</p>
              </div>

              <div className="flex flex-col gap-1.5 text-[11px] text-gray-700">
                <div className="flex justify-between">
                  <span>ID PO:</span>
                  <span className="font-bold">#{catInvoiceData.poId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-bold">{catInvoiceData.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kontak:</span>
                  <span>{catInvoiceData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pengiriman:</span>
                  <span className="font-bold">{catInvoiceData.deliveryTime}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 my-1" />

              <div>
                <div className="font-bold mb-1 text-[11px] text-gray-800">Detail Paket:</div>
                <div className="flex justify-between text-gray-700 text-[11px]">
                  <span>{catInvoiceData.package}</span>
                  <span className="font-bold">{rp(catInvoiceData.totalPrice)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 my-1" />

              <div className="flex flex-col gap-1 text-[11px] text-gray-700">
                <div className="flex justify-between">
                  <span>DP Lunas (30%):</span>
                  <span className="text-emerald-600 font-bold">-{rp(catInvoiceData.dpPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sisa Pelunasan:</span>
                  <span className="text-amber-600 font-bold">{rp(catInvoiceData.remaining)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-dashed border-gray-200 font-bold text-gray-900">
                  <span>Total Tagihan:</span>
                  <span>{rp(catInvoiceData.totalPrice)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 my-1" />

              <div className="text-[10px] text-gray-500">
                <div className="font-bold text-gray-700 mb-0.5">Alamat Pengiriman:</div>
                <p className="leading-relaxed">{catInvoiceData.address}</p>
              </div>

              <div className="text-center pt-2 text-[9px] text-gray-400 italic">
                *Tempelkan nota ini pada kemasan katering utama sebagai surat jalan kurir.*
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button 
                onClick={() => showToast("Nota berhasil disimpan ke folder download!")}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl text-xs cursor-pointer transition-colors text-center border border-gray-200"
              >
                💾 Simpan PDF
              </button>
              <button 
                onClick={() => showToast("Nota berhasil dikirim ke printer bluetooth!")}
                className="flex-1 py-3 bg-primary text-white font-extrabold rounded-2xl text-xs cursor-pointer hover:bg-primary-dark transition-colors text-center shadow-md"
              >
                🖨️ Cetak Nota
              </button>
            </div>
          </div>
        </div>
      )}

    </>
      ) : activeLaundryScreen === "manajemen_order" ? (
        <>
          <div className="bg-white px-5 pt-10 pb-4 shrink-0 shadow-sm z-10 flex flex-col rounded-b-[32px]">
             <div className="flex justify-between items-center mb-5">
               <div className="flex items-center gap-3">
                  <button onClick={() => setActiveLaundryScreen("dashboard")} className="w-10 h-10 flex items-center -ml-2 text-gray-900 active:scale-95 transition-transform">
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-extrabold text-[17px] text-gray-900">Manajemen Order</h2>
               </div>
               <button className="w-8 h-8 rounded-full bg-[#0D5C36] text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                  <Plus size={18} />
               </button>
             </div>
             
             <div className="flex gap-2 mb-5">
                <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-[14px] flex items-center px-3 gap-2">
                  <Search size={16} className="text-gray-400" />
                  <input type="text" placeholder="Cari order / nama / no hp" value={orderSearchQuery} onChange={e => setOrderSearchQuery(e.target.value)} className="bg-transparent text-[13px] outline-none w-full py-3" />
                </div>
                <button className="w-12 rounded-[14px] bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 active:bg-gray-50">
                  <Filter size={18} />
                </button>
             </div>

             <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
               {["Semua", "Baru", "Diproses", "Selesai", "Dibatalkan"].map(f => (
                 <button key={f} onClick={() => setOrderFilter(f)} className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-bold transition-colors ${orderFilter === f ? "bg-[#0D5C36] text-white" : "bg-gray-100 text-gray-600"}`}>
                   {f}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 pb-32">
             {laundryOrders.filter(o => {
               if (orderFilter !== "Semua") {
                 if (orderFilter === "Baru" && o.status !== "baru" && o.status !== "menunggu_harga") return false;
                 if (orderFilter === "Diproses" && o.status !== "diproses") return false;
                 if (orderFilter === "Selesai" && o.status !== "selesai") return false;
                 if (orderFilter === "Dibatalkan" && o.status !== "dibatalkan") return false;
               }
               if (orderSearchQuery) {
                 const q = orderSearchQuery.toLowerCase();
                 if (!o.name.toLowerCase().includes(q) && !o.id.toLowerCase().includes(q)) return false;
               }
               return true;
             }).map(order => {
                const isBaru = order.status === "baru" || order.status === "menunggu_harga";
                const isDiproses = order.status === "diproses";
                const isSelesai = order.status === "selesai";
                
                let bgPill = isBaru ? "bg-[#E7F6ED] text-[#0D5C36]" : isDiproses ? "bg-blue-50 text-blue-500" : isSelesai ? "bg-purple-50 text-purple-600" : "bg-orange-50 text-orange-500";
                let labelPill = order.status === "baru" ? "Baru" : order.status === "menunggu_harga" ? "Menunggu Harga" : order.status === "diproses" ? "Diproses" : order.status === "diantar" ? "Diantar" : "Selesai";
                if (order.status === "menunggu_harga" || order.status === "baru") {
                  bgPill = order.status === "baru" ? "bg-[#E7F6ED] text-[#0D5C36]" : "bg-orange-50 text-orange-500";
                }
                
                return (
                  <div key={order.id} onClick={() => {
                      setSelectedLaundryOrderId(order.id);
                      setLaundryWeight(order.weight || 3.0);
                      setLaundryFlowStep(order.status === "baru" || order.status === "menunggu_harga" ? "input_weight" : "detail");
                  }} className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm flex flex-col cursor-pointer active:scale-[0.98] transition-transform">
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                           <div className="relative">
                              <img src={order.userAvatar} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                 <div className="w-3 h-3 rounded-full bg-[#0D5C36] flex items-center justify-center">
                                    <CheckCircle size={8} className="text-white" />
                                 </div>
                              </div>
                           </div>
                           <div>
                              <p className="font-extrabold text-[13px] text-gray-900">{order.id}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5">{order.name}</p>
                           </div>
                        </div>
                        <span className={`${bgPill} text-[9px] font-extrabold px-3 py-1 rounded-full`}>{labelPill}</span>
                     </div>
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[11px] text-gray-500">{order.weight || 3.0} kg • {order.service}</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                           <p className="font-black text-[13px] text-gray-900 mb-0.5">{order.total > 0 ? rp(order.total) : "-"}</p>
                           <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              {order.date} <ChevronRight size={12} className="text-gray-300 ml-1"/>
                           </div>
                        </div>
                     </div>
                  </div>
                );
             })}
          </div>
        </>
      ) : activeLaundryScreen === "manajemen_user" ? (
        <>
          <div className="bg-white px-5 pt-10 pb-4 shrink-0 shadow-sm z-10 flex flex-col rounded-b-[32px]">
             <div className="flex justify-between items-center mb-5">
               <div className="flex items-center gap-3">
                  <button onClick={() => setActiveLaundryScreen("dashboard")} className="w-10 h-10 flex items-center -ml-2 text-gray-900 active:scale-95 transition-transform">
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="font-extrabold text-[17px] text-gray-900">Pelanggan</h2>
               </div>
               <button className="w-8 h-8 rounded-full bg-[#0D5C36] text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                  <Plus size={18} />
               </button>
             </div>
             
             <div className="flex gap-2">
                <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-[14px] flex items-center px-3 gap-2">
                  <Search size={16} className="text-gray-400" />
                  <input type="text" placeholder="Cari nama / no hp" value={userSearchQuery} onChange={e => setUserSearchQuery(e.target.value)} className="bg-transparent text-[13px] outline-none w-full py-3" />
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white flex flex-col">
             {MOCK_CUSTOMERS.filter(c => {
               if (userSearchQuery) {
                 const q = userSearchQuery.toLowerCase();
                 return c.name.toLowerCase().includes(q) || c.phone.includes(q);
               }
               return true;
             }).map((customer, idx) => (
                <div key={customer.id} className={`flex items-center justify-between p-5 ${idx !== MOCK_CUSTOMERS.length - 1 ? 'border-b border-gray-50' : ''} cursor-pointer hover:bg-gray-50 transition-colors`}>
                   <div className="flex items-center gap-4">
                      <img src={customer.avatar} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                      <div>
                         <p className="font-extrabold text-[14px] text-gray-900">{customer.name}</p>
                         <p className="text-[12px] text-gray-500 mt-0.5">{customer.phone}</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-1.5">
                      <p className="text-[11px] text-gray-500">Total Order: {customer.totalOrder}</p>
                      <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full ${customer.status === 'VIP' ? 'bg-orange-50 text-orange-500' : 'bg-[#E7F6ED] text-[#0D5C36]'}`}>
                        {customer.status}
                      </span>
                   </div>
                </div>
             ))}
          </div>
        </>
      ) : activeLaundryScreen === "manajemen_keuangan" ? (
        <>
          <div className="bg-white px-5 pt-10 pb-4 shrink-0 shadow-sm z-10 flex flex-col rounded-b-[32px]">
             <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setActiveLaundryScreen("dashboard")} className="w-10 h-10 flex items-center -ml-2 text-gray-900 active:scale-95 transition-transform">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="font-extrabold text-[17px] text-gray-900">Keuangan</h2>
             </div>
             
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5 text-[#0D5C36] bg-[#E7F6ED] px-3 py-1.5 rounded-full cursor-pointer">
                   <span className="font-bold text-[12px]">Ringkasan Bulan Ini</span>
                   <ChevronRight size={14} />
                </div>
                <div className="flex items-center gap-1 text-gray-600 font-bold text-[12px] cursor-pointer">
                   Juli 2026 <ChevronDown size={14} />
                </div>
             </div>

             <div className="bg-[#0B4A2B] rounded-[20px] p-5 relative overflow-hidden mb-4">
                <div className="relative z-10">
                   <p className="text-white/80 text-[12px] font-semibold mb-1">Total Pendapatan</p>
                   <p className="text-white font-black text-[24px] tracking-tight mb-2">Rp 18.750.000</p>
                   <p className="text-[#A7F3D0] text-[11px] font-bold">↑ 12.5% dari bulan lalu</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                   <BarChart2 size={120} className="text-white" />
                </div>
             </div>

             <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="bg-white border border-gray-100 shadow-sm rounded-[16px] p-3 text-center flex flex-col justify-center items-center">
                   <p className="text-[10px] text-gray-500 font-semibold mb-1">Pendapatan</p>
                   <p className="text-[11px] font-black text-[#0D5C36]">Rp 18.750.000</p>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-[16px] p-3 text-center flex flex-col justify-center items-center">
                   <p className="text-[10px] text-gray-500 font-semibold mb-1">Pengeluaran</p>
                   <p className="text-[11px] font-black text-red-500">Rp 4.250.000</p>
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-[16px] p-3 text-center flex flex-col justify-center items-center">
                   <p className="text-[10px] text-gray-500 font-semibold mb-1">Laba Bersih</p>
                   <p className="text-[11px] font-black text-[#0D5C36]">Rp 14.500.000</p>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#F7FAF8] p-5">
             <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-extrabold text-[14px] text-gray-900">Grafik Pendapatan</h3>
                   <div className="bg-gray-50 p-1 rounded-full flex gap-1 border border-gray-100">
                      <button onClick={() => setFinancePeriod("Minggu")} className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold transition-colors ${financePeriod === "Minggu" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}>Minggu</button>
                      <button onClick={() => setFinancePeriod("Bulan")} className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold transition-colors ${financePeriod === "Bulan" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}>Bulan</button>
                   </div>
                </div>

                <div className="h-48 flex items-end justify-between gap-2 px-2 relative pb-6 border-b border-gray-100">
                   {/* Y Axis Labels */}
                   <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-gray-400 font-semibold">
                      <span>50</span>
                      <span>30</span>
                      <span>10</span>
                   </div>
                   
                   {/* Chart Bars */}
                   <div className="flex-1 h-full flex items-end justify-between gap-2 pl-6 pb-6">
                      {(financePeriod === "Minggu" ? [20, 40, 60, 30, 50, 80, 40] : [15, 25, 60, 45, 65, 30, 50, 20, 40, 70, 55]).map((val, idx) => (
                         <div key={idx} className="w-full h-full bg-transparent rounded-t-md relative group flex items-end">
                            <div className="w-full bg-[#0D5C36] rounded-t-md transition-all duration-500 group-hover:bg-[#1B7A4E]" style={{ height: `${val}%` }} />
                         </div>
                      ))}
                   </div>
                   
                   {/* X Axis mock labels - purely aesthetic */}
                   <div className="absolute bottom-1 left-8 right-2 flex justify-between text-[9px] text-gray-400 font-semibold">
                      <span>1</span>
                      <span>5</span>
                      <span>10</span>
                      <span>15</span>
                      <span>20</span>
                      <span>25</span>
                      <span>30</span>
                   </div>
                </div>
             </div>
          </div>
        </>
      ) : activeLaundryScreen === "manajemen_lainnya" ? (
        <>
          <div className="bg-[#F7FAF8] flex-1 overflow-y-auto flex flex-col">
             <div className="px-5 pt-10 pb-6 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2">
                   <button onClick={() => setActiveLaundryScreen("dashboard")} className="w-10 h-10 flex items-center -ml-2 text-gray-900 active:scale-95 transition-transform">
                     <ArrowLeft size={22} />
                   </button>
                   <h2 className="font-extrabold text-[22px] text-gray-900 tracking-tight">Lainnya</h2>
                </div>
                <button className="w-10 h-10 flex items-center justify-center text-gray-900 -mr-2 active:bg-gray-100 rounded-full">
                  <MoreVertical size={20} />
                </button>
             </div>

             <div className="px-5 pb-8 flex-1">
                <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 rounded-full bg-[#0D5C36] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Shirt size={26} />
                   </div>
                   <div className="flex-1">
                      <h3 className="font-extrabold text-[15px] text-gray-900 mb-0.5">Laundry Bersih Kilat</h3>
                      <div className="flex items-center gap-1 text-[13px] text-gray-500">
                         Pemilik Laundry <CheckCircle size={14} className="text-[#0D5C36] fill-green-100" />
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                   {[
                      { icon: Store, label: "Profil Laundry" },
                      { icon: Tag, label: "Layanan & Harga" },
                      { icon: Users, label: "Karyawan" },
                      { icon: Settings, label: "Pengaturan Toko" },
                      { icon: CreditCard, label: "Metode Pembayaran" },
                      { icon: HelpCircle, label: "Pusat Bantuan" },
                   ].map((item, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-5 cursor-pointer active:bg-gray-50 transition-colors ${idx !== 5 ? 'border-b border-gray-50' : ''}`}>
                         <div className="flex items-center gap-4">
                            <item.icon size={20} className="text-[#334155]" strokeWidth={1.5} />
                            <span className="font-extrabold text-[14px] text-[#0F172A]">{item.label}</span>
                         </div>
                         <ChevronRight size={18} className="text-gray-300" />
                      </div>
                   ))}
                </div>
             </div>

             {/* Bottom Nav Placeholder to avoid overlapping with absolute bottom nav if rendered outside */}
             <div className="h-24"></div>
          </div>
        </>
      ) : activeLaundryScreen === "kos_manajemen_kamar" ? (
        <>
          <div className="bg-white flex-1 overflow-y-auto flex flex-col rounded-b-[32px] shadow-sm relative">
             {/* Header */}
             <div className="px-5 pt-10 pb-4 flex justify-between items-center bg-white sticky top-0 z-20">
                <div className="flex items-center gap-3">
                   <button onClick={() => setActiveLaundryScreen("dashboard")} className="w-10 h-10 flex items-center -ml-2 text-gray-900 active:scale-95 transition-transform">
                     <ArrowLeft size={22} />
                   </button>
                   <div>
                     <h2 className="font-extrabold text-lg text-gray-900 leading-tight">Manajemen Kamar</h2>
                     <p className="text-[11px] text-gray-500 font-medium">Kelola semua kamar kos Anda</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-colors">
                     <Search size={16} />
                   </button>
                   <button onClick={() => setShowKosRoomMenu(true)} className="w-9 h-9 rounded-full text-white bg-[#0D5C36] flex items-center justify-center shadow-md shadow-[#0D5C36]/30 hover:bg-[#0A4A2A] transition-colors">
                     <Plus size={18} />
                   </button>
                </div>
             </div>

             {/* Stats Horizontal Scroll */}
             <div className="px-5 pb-5 mt-2">
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                   <div className="bg-white rounded-[20px] p-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-w-[100px] shrink-0 flex flex-col items-center justify-center">
                      <p className="text-[10px] text-gray-500 font-bold mb-1">Total Kamar</p>
                      <p className="font-black text-[22px] text-gray-900 leading-tight">12</p>
                      <p className="text-[9px] text-gray-400 mt-1">Semua kamar</p>
                   </div>
                   <div className="bg-white rounded-[20px] p-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-w-[100px] shrink-0 flex flex-col items-center justify-center">
                      <p className="text-[10px] text-gray-500 font-bold mb-1 flex items-center gap-1">Terisi <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /></p>
                      <p className="font-black text-[22px] text-gray-900 leading-tight">10</p>
                      <p className="text-[9px] text-gray-400 mt-1">83%</p>
                   </div>
                   <div className="bg-white rounded-[20px] p-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-w-[100px] shrink-0 flex flex-col items-center justify-center">
                      <p className="text-[10px] text-orange-500 font-bold mb-1">Kosong</p>
                      <p className="font-black text-[22px] text-orange-500 leading-tight">2</p>
                      <p className="text-[9px] text-orange-500 mt-1">17%</p>
                   </div>
                   <div className="bg-white rounded-[20px] p-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-w-[100px] shrink-0 flex flex-col items-center justify-center">
                      <p className="text-[10px] text-blue-500 font-bold mb-1">Dalam Proses</p>
                      <p className="font-black text-[22px] text-blue-500 leading-tight">0</p>
                      <p className="text-[9px] text-blue-500 mt-1">0%</p>
                   </div>
                </div>
             </div>

             {/* Filter Tabs */}
             <div className="px-5 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                   {["Semua (12)", "Terisi (10)", "Kosong (2)", "Dalam Proses (0)"].map(tab => (
                     <button 
                       key={tab}
                       onClick={() => setKosKamarFilter(tab)}
                       className={`whitespace-nowrap text-[12px] font-bold px-4 py-1.5 rounded-full transition-colors ${kosKamarFilter === tab ? "bg-[#0D5C36] text-white" : "text-gray-500 hover:text-gray-900"}`}
                     >
                       {tab}
                     </button>
                   ))}
                </div>
             </div>

             {/* Room List */}
             <div className="px-5 pb-32 flex flex-col gap-4">
                {MOCK_KOS_ROOMS_MANAGEMENT.map((room, idx) => (
                   <div key={idx} className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                      <div className="flex h-[160px]">
                         {/* Room Image & Status */}
                         <div className="w-[130px] h-full relative shrink-0 p-2 pl-2">
                            <img src={room.image} alt="Room" className="w-full h-full object-cover rounded-[16px]" />
                            <div className="absolute top-4 left-4">
                               <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${room.status === "Terisi" ? "bg-[#E7F6ED] text-[#0D5C36]" : "bg-orange-100 text-orange-600"}`}>
                                  {room.status}
                               </span>
                            </div>
                         </div>
                         
                         {/* Room Info */}
                         <div className="p-3 pr-4 flex-1 flex flex-col justify-between">
                            <div>
                               <div className="flex justify-between items-start mb-1.5">
                                  <div className="flex items-center gap-2">
                                     <h3 className="font-black text-[18px] text-gray-900 leading-none">{room.id}</h3>
                                     <span className="bg-[#F2FAF5] text-[#0D5C36] text-[9px] font-bold px-2 py-0.5 rounded-full">{room.type}</span>
                                  </div>
                                  <button onClick={() => { setKosRoomWizardMode("edit"); setShowKosRoomMenu(true); }} className="text-gray-400 hover:text-gray-600">
                                     <MoreHorizontal size={16} />
                                  </button>
                               </div>

                               <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                                  {room.amenities.map(am => (
                                     <div key={am} className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                                        {am === "AC" && <Monitor size={12} />}
                                        {am === "Kipas" && <Wind size={12} />}
                                        {am === "WiFi" && <Wifi size={12} />}
                                        {am.includes("KM") && <Bath size={12} />}
                                        {am}
                                     </div>
                                  ))}
                               </div>
                               <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium mt-1.5">
                                  <Calendar size={12} /> {room.extraAmenities}
                               </div>
                            </div>

                            <div className="mt-3 flex justify-between items-end">
                               <div className="flex flex-col">
                                  {room.status === "Terisi" ? (
                                     <>
                                        <p className="text-[9px] text-gray-400 mb-1 font-medium">Penghuni</p>
                                        <div className="flex items-center gap-1.5">
                                           <img src={room.avatar!} className="w-5 h-5 rounded-full" />
                                           <span className="font-bold text-[11px] text-gray-900">{room.occupant}</span>
                                        </div>
                                     </>
                                  ) : (
                                     <div className="h-6" /> // Placeholder
                                  )}
                               </div>
                               <div className="text-right">
                                  <p className="font-black text-[15px] text-[#0D5C36] leading-none">{rp(room.price)}</p>
                                  <p className="text-[9px] text-gray-400 font-medium mt-0.5">/ bulan</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>

             {/* Sticky Bottom Bar */}
             <div className="sticky bottom-4 mx-4 mb-4 mt-auto bg-[#F2FAF5] border border-[#E7F6ED] rounded-[24px] p-4 flex items-center justify-between shadow-lg z-30">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white text-[#0D5C36] flex items-center justify-center shrink-0 shadow-sm border border-green-50">
                      <Building2 size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-500 font-bold mb-0.5">Potensi Pendapatan</p>
                      <p className="font-black text-[16px] text-[#0D5C36] leading-none">Rp 23.100.000 <span className="text-[10px] font-medium text-gray-500">/ bulan</span></p>
                   </div>
                </div>
                <button className="text-[11px] font-bold text-[#0D5C36] border border-[#0D5C36]/20 bg-white px-3 py-2 rounded-[14px] flex items-center gap-1 shadow-sm active:scale-95 transition-transform">
                   Lihat Laporan <ChevronRight size={14} />
                </button>
             </div>
          </div>
        </>
      ) : activeLaundryScreen === "kos_manajemen_penghuni" ? (
        <>
          <div className="bg-white flex-1 min-h-0 overflow-y-auto flex flex-col rounded-b-[32px] shadow-sm relative">
             {/* Header */}
             <div className="bg-white px-5 pt-10 pb-4 shrink-0 z-10 sticky top-0 flex items-center gap-3">
                <button onClick={() => setActiveLaundryScreen("dashboard")} className="w-10 h-10 flex items-center -ml-2 text-gray-900 active:scale-95 transition-transform">
                  <ArrowLeft size={22} />
                </button>
                <div className="flex-1">
                   <h2 className="font-extrabold text-[18px] text-gray-900 leading-none">Manajemen Penghuni</h2>
                   <p className="text-[12px] text-gray-500 font-medium mt-1">Kelola semua penghuni kos Anda</p>
                </div>
                <div className="flex items-center gap-2">
                   <button className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-colors">
                     <Search size={16} />
                   </button>
                   <button className="w-9 h-9 rounded-full text-white bg-[#0D5C36] flex items-center justify-center shadow-md shadow-[#0D5C36]/30 hover:bg-[#0A4A2A] transition-colors">
                     <Plus size={18} />
                   </button>
                </div>
             </div>

             {/* Stats Row */}
             <div className="flex gap-3 overflow-x-auto px-5 pb-5 pt-2 shrink-0" style={{ scrollbarWidth: "none" }}>
                {[
                   { label: "Total Penghuni", value: "10", sub: "Orang", color: "gray-900", bg: "gray-50", subColor: "gray-400" },
                   { label: "Aktif", value: "10", sub: "100%", color: "green-600", bg: "green-50", subColor: "green-500", icon: <CheckCircle size={10} className="inline ml-1" /> },
                   { label: "Akan Keluar", value: "0", sub: "0%", color: "red-500", bg: "red-50", subColor: "red-400" },
                   { label: "Check-out", value: "0", sub: "0%", color: "blue-500", bg: "blue-50", subColor: "blue-400" },
                ].map((stat, i) => (
                   <div key={i} className="min-w-[105px] h-[95px] rounded-[20px] bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-center items-center shrink-0">
                      <p className="text-[10px] font-bold text-gray-500 text-center mb-1 leading-tight">{stat.label} {stat.icon}</p>
                      <h3 className={`font-black text-[26px] leading-none mb-1 text-${stat.color}`}>{stat.value}</h3>
                      <p className={`text-[10px] font-bold text-${stat.subColor}`}>{stat.sub}</p>
                   </div>
                ))}
             </div>

             {/* Filter Tabs */}
             <div className="flex items-center gap-3 overflow-x-auto px-5 pb-5 shrink-0" style={{ scrollbarWidth: "none" }}>
                {["Semua (10)", "Aktif (10)", "Akan Keluar (0)", "Check-out (0)"].map(tab => (
                   <button 
                      key={tab}
                      onClick={() => setKosPenghuniFilter(tab)}
                      className={`whitespace-nowrap text-[12px] font-bold px-4 py-2 rounded-full transition-colors ${kosPenghuniFilter === tab ? "bg-[#0D5C36] text-white" : "bg-white border border-gray-200 text-gray-500"}`}
                   >
                      {tab}
                   </button>
                ))}
                <button className="w-9 h-9 rounded-full border border-gray-200 text-gray-600 flex items-center justify-center bg-white shadow-sm shrink-0 ml-auto">
                   <Filter size={16} />
                </button>
             </div>

             {/* Occupants List */}
             <div className="px-5 pb-8">
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                   {MOCK_KOS_OCCUPANTS.map((occ, idx) => (
                      <div key={idx} className="p-4 border-b border-gray-100 last:border-b-0 flex gap-4">
                         <img src={occ.avatar} className="w-14 h-14 rounded-full object-cover shrink-0" />
                         <div className="flex-1 flex justify-between">
                            {/* Left Column */}
                            <div className="flex flex-col justify-between">
                               <div>
                                  <div className="flex items-center gap-2 mb-1">
                                     <h3 className="font-extrabold text-[15px] text-[#1D2939] leading-none">{occ.name}</h3>
                                     <span className="bg-[#E7F6ED] text-[#0D5C36] text-[9px] font-bold px-2 py-0.5 rounded-full">{occ.status}</span>
                                  </div>
                                  <p className="text-[12px] font-medium text-gray-500">{occ.room} • {occ.type}</p>
                               </div>
                               
                               <div className="flex flex-col gap-1 mt-3">
                                  <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1.5">
                                     <Phone size={12} className="text-gray-400" /> {occ.phone}
                                  </p>
                                  <p className="text-[11px] font-medium text-gray-500 flex items-center gap-1.5">
                                     <Calendar size={12} className="text-gray-400" /> Masuk: {occ.entryDate}
                                  </p>
                               </div>
                            </div>
                            
                            {/* Right Column */}
                            <div className="flex flex-col justify-between items-end text-right">
                               <div className="flex flex-col items-end">
                                   <button className="text-gray-400 hover:text-gray-600 mb-2 -mt-1 -mr-1">
                                      <MoreVertical size={16} />
                                   </button>
                                   <p className="text-[9px] text-gray-400 font-bold mb-0.5">Sisa Sewa</p>
                                   <p className={`text-[11px] font-extrabold ${occ.remainingDays <= 10 ? 'text-orange-500' : 'text-[#0D5C36]'}`}>
                                      {occ.remainingDays} hari lagi
                                   </p>
                               </div>
                               
                               <div className="mt-2 flex flex-col items-end">
                                  <p className="font-black text-[14px] text-[#0D5C36] leading-none">{rp(occ.price)}</p>
                                  <p className="text-[9px] text-gray-400 font-medium mt-0.5">/ bulan</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Double Sticky Bottom Bar (OUTSIDE scroll container) */}
          <div className="w-full p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 flex gap-3 shrink-0 rounded-b-[32px]">
             <div className="flex-1 bg-[#F2FAF5] border border-[#E7F6ED] rounded-2xl p-3.5 flex justify-between items-center active:scale-95 transition-transform cursor-pointer">
                <div>
                   <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-md bg-[#0D5C36] flex items-center justify-center text-white">
                         <Banknote size={10} />
                      </div>
                      <p className="text-[9px] text-gray-500 font-bold">Pendapatan Bulan Ini</p>
                   </div>
                   <p className="font-black text-[14px] text-[#0D5C36] leading-none ml-6">Rp 12.500.000</p>
                </div>
                <ChevronRight size={14} className="text-[#0D5C36]" />
             </div>
             
             <div className="flex-1 bg-[#FFF5F2] border border-[#FFE8E2] rounded-2xl p-3.5 flex justify-between items-center active:scale-95 transition-transform cursor-pointer">
                <div>
                   <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-md bg-[#FF5C35] flex items-center justify-center text-white">
                         <FileText size={10} />
                      </div>
                      <p className="text-[9px] text-gray-500 font-bold">Tunggakan</p>
                   </div>
                   <p className="font-black text-[14px] text-[#FF5C35] leading-none ml-6">Rp 1.500.000</p>
                </div>
                <ChevronRight size={14} className="text-[#FF5C35]" />
             </div>
          </div>
        </>
      ) : activeLaundryScreen === "kos_laporan_keuangan" ? (
        <>
          <div className="bg-[#F7FAF8] flex-1 overflow-y-auto flex flex-col rounded-b-[32px] shadow-sm relative pb-20">
             {/* Header */}
             <div className="bg-[#F7FAF8] px-5 pt-10 pb-4 shrink-0 z-10 sticky top-0 flex items-center gap-3">
                <button onClick={() => setActiveLaundryScreen("dashboard")} className="w-10 h-10 flex items-center -ml-2 text-gray-900 active:scale-95 transition-transform">
                  <ArrowLeft size={22} />
                </button>
                <div className="flex-1">
                   <h2 className="font-extrabold text-[18px] text-gray-900 leading-none mb-1">Laporan Keuangan</h2>
                   <p className="text-[11px] text-gray-500 font-medium">Ringkasan pemasukan & pengeluaran</p>
                </div>
                <button className="h-9 px-3 rounded-full border border-gray-200 text-gray-700 font-bold text-[11px] flex items-center gap-1.5 bg-white shadow-sm hover:bg-gray-50 transition-colors">
                  <Calendar size={14} className="text-[#0D5C36]" /> Juli 2026 <ChevronDown size={14} />
                </button>
             </div>

             <div className="px-5 flex flex-col gap-4">
                {/* Laba Bersih Card */}
                <div className="bg-[#0D5C36] rounded-[24px] p-5 relative overflow-hidden shadow-lg shadow-[#0D5C36]/20">
                   <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                      <ClipboardList size={140} strokeWidth={1.5} className="text-white" />
                   </div>
                   <div className="relative z-10">
                      <p className="text-white/80 text-[12px] font-bold mb-1">Laba Bersih</p>
                      <h2 className="text-white text-[32px] font-black leading-none mb-3">Rp 8.250.000</h2>
                      <div className="flex items-center gap-2">
                         <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                            <TrendingUp size={12} /> +12%
                         </span>
                         <span className="text-white/70 text-[10px] font-medium">dibanding bulan lalu</span>
                      </div>
                   </div>
                </div>

                {/* Metrics */}
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
                   {[
                      { title: "Pendapatan", value: "Rp 12.500.000", change: "+8.5%", icon: <Wallet size={14} />, color: "green", bg: "bg-green-50", text: "text-green-600", border: "border-green-100", changeColor: "text-green-600 bg-green-100" },
                      { title: "Pengeluaran", value: "Rp 4.250.000", change: "+5.2%", icon: <ArrowDown size={14} />, color: "red", bg: "bg-red-50", text: "text-red-500", border: "border-red-100", changeColor: "text-red-500 bg-red-100" },
                      { title: "Piutang", value: "Rp 1.500.000", change: "- 0%", icon: <FileText size={14} />, color: "blue", bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-100", changeColor: "text-blue-500 bg-blue-100" },
                   ].map((m, i) => (
                      <div key={i} className="min-w-[140px] bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm shrink-0">
                         <div className={`w-8 h-8 rounded-xl ${m.bg} ${m.text} flex items-center justify-center mb-3`}>
                            {m.icon}
                         </div>
                         <p className="text-[11px] font-bold text-gray-900 mb-1">{m.title}</p>
                         <p className="font-black text-[14px] text-gray-900 mb-3">{m.value}</p>
                         <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${m.changeColor}`}>
                               {m.change.includes('+') ? <ArrowUp size={8} /> : null} {m.change}
                            </span>
                            <span className="text-[9px] text-gray-400 font-medium">vs bulan lalu</span>
                         </div>
                      </div>
                   ))}
                </div>

                {/* Pendapatan Bulanan Chart */}
                <div className="bg-white rounded-[24px] p-4 border border-gray-100 shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-[13px] text-gray-900">Pendapatan Bulanan</h3>
                      <button className="text-[10px] font-bold text-[#0D5C36] flex items-center gap-0.5">Lihat Detail <ChevronRight size={12} /></button>
                   </div>
                   <div className="relative h-32 w-full mt-2">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-400">
                         <div className="flex items-center border-b border-gray-100 h-0 w-full relative"><span className="absolute -left-1 -top-1.5 pr-2 bg-white">15 jt</span></div>
                         <div className="flex items-center border-b border-gray-100 h-0 w-full relative"><span className="absolute -left-1 -top-1.5 pr-2 bg-white">10 jt</span></div>
                         <div className="flex items-center border-b border-gray-100 h-0 w-full relative"><span className="absolute -left-1 -top-1.5 pr-2 bg-white">5 jt</span></div>
                         <div className="flex items-center border-b border-gray-100 h-0 w-full relative"><span className="absolute -left-1 -top-1.5 pr-2 bg-white">0</span></div>
                      </div>
                      
                      {/* SVG Line Chart */}
                      <svg className="absolute inset-0 h-full w-full overflow-visible z-10 pl-6" viewBox="0 0 300 100" preserveAspectRatio="none">
                         <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="0%" stopColor="#0D5C36" stopOpacity="0.2" />
                               <stop offset="100%" stopColor="#0D5C36" stopOpacity="0" />
                            </linearGradient>
                         </defs>
                         <polygon points="0,70 50,55 100,40 150,48 200,32 250,22 300,10 300,100 0,100" fill="url(#gradient)" />
                         <polyline points="0,70 50,55 100,40 150,48 200,32 250,22 300,10" fill="none" stroke="#0D5C36" strokeWidth="2.5" />
                         <circle cx="0" cy="70" r="3" fill="#0D5C36" stroke="white" strokeWidth="1.5" />
                         <circle cx="50" cy="55" r="3" fill="#0D5C36" stroke="white" strokeWidth="1.5" />
                         <circle cx="100" cy="40" r="3" fill="#0D5C36" stroke="white" strokeWidth="1.5" />
                         <circle cx="150" cy="48" r="3" fill="#0D5C36" stroke="white" strokeWidth="1.5" />
                         <circle cx="200" cy="32" r="3" fill="#0D5C36" stroke="white" strokeWidth="1.5" />
                         <circle cx="250" cy="22" r="3" fill="#0D5C36" stroke="white" strokeWidth="1.5" />
                         <circle cx="300" cy="10" r="4.5" fill="#0D5C36" />
                      </svg>
                      
                      {/* Tooltip on last point */}
                      <div className="absolute right-0 top-[-8px] bg-[#0D5C36] text-white text-[9px] font-bold px-2 py-1 rounded z-20 shadow-md">
                         Rp 12.500.000
                      </div>

                      {/* X Axis Labels */}
                      <div className="absolute -bottom-6 left-6 right-0 flex justify-between text-[9px] text-gray-500 font-medium">
                         <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span><span className="text-[#0D5C36] font-extrabold">Jul</span>
                      </div>
                   </div>
                </div>

                {/* Komposisi Pengeluaran */}
                <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm flex items-center gap-6">
                   <div className="flex-1 max-w-[120px]">
                      <h3 className="font-bold text-[13px] text-gray-900 leading-tight mb-2">Komposisi Pengeluaran</h3>
                      {/* Pure CSS Donut Chart */}
                      <div className="w-24 h-24 rounded-full relative ml-2 mt-4" style={{
                         background: "conic-gradient(#0D5C36 0% 45%, #4ADE80 45% 65%, #3B82F6 65% 80%, #FBBF24 80% 90%, #9CA3AF 90% 100%)"
                      }}>
                         {/* Donut Hole */}
                         <div className="absolute inset-0 m-[18px] bg-white rounded-full flex flex-col items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                            <span className="text-[7px] font-medium text-gray-400">Total</span>
                            <span className="text-[8px] font-extrabold text-gray-900 leading-none">Rp 4.250.000</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex-1 flex flex-col gap-2.5">
                      {[
                         { label: "Operasional", percent: "45%", color: "bg-[#0D5C36]" },
                         { label: "Listrik", percent: "20%", color: "bg-[#4ADE80]" },
                         { label: "Air", percent: "15%", color: "bg-[#3B82F6]" },
                         { label: "Perawatan", percent: "10%", color: "bg-[#FBBF24]" },
                         { label: "Lainnya", percent: "10%", color: "bg-[#9CA3AF]" },
                      ].map((item, i) => (
                         <div key={i} className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                               <span className="text-gray-600 font-medium">{item.label}</span>
                            </div>
                            <span className="font-bold text-gray-900">{item.percent}</span>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Transaksi Terbaru */}
                <div>
                   <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-[13px] text-gray-900">Transaksi Terbaru</h3>
                      <button className="text-[10px] font-bold text-[#0D5C36] flex items-center gap-0.5">Lihat Semua <ChevronRight size={12} /></button>
                   </div>
                   
                   <div className="flex gap-2 mb-4">
                      <div className="flex-1 relative">
                         <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input type="text" placeholder="Cari transaksi..." className="w-full pl-8 pr-3 py-2 text-[11px] bg-white border border-gray-200 rounded-full outline-none focus:border-[#0D5C36]" />
                      </div>
                      {["Semua", "Pendapatan", "Pengeluaran"].map(tab => (
                         <button 
                            key={tab} 
                            onClick={() => setKosFinanceFilter(tab)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border transition-colors ${kosFinanceFilter === tab ? "bg-[#0D5C36] text-white border-[#0D5C36]" : "bg-white text-gray-500 border-gray-200"}`}
                         >
                            {tab}
                         </button>
                      ))}
                   </div>

                   <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                      {MOCK_KOS_FINANCE_TRANSACTIONS.map((trx, idx) => (
                         <div key={idx} className="flex items-center gap-3 p-4 border-b border-gray-50 last:border-b-0 active:bg-gray-50 cursor-pointer">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${trx.type === 'in' ? 'bg-[#E7F6ED] text-[#0D5C36]' : 'bg-[#FFF5F2] text-[#FF5C35]'}`}>
                               {trx.type === 'in' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                            </div>
                            <div className="flex-1">
                               <p className="font-extrabold text-[12px] text-gray-900 leading-tight mb-1">{trx.title}</p>
                               <p className="text-[10px] text-gray-500 font-medium">{trx.subtitle}</p>
                            </div>
                            <div className="text-right flex items-center gap-2">
                               <p className={`font-black text-[13px] ${trx.type === 'in' ? 'text-[#0D5C36]' : 'text-[#FF5C35]'}`}>
                                  {trx.type === 'in' ? '+' : '-'} {rp(trx.amount)}
                               </p>
                               <ChevronRight size={14} className="text-gray-300" />
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Bottom Summary Cards */}
                <div className="flex gap-3 mt-2 mb-4">
                   {/* Ringkasan Keuangan */}
                   <div className="flex-1 bg-white rounded-[24px] p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
                      <div>
                         <div className="flex items-center gap-1.5 mb-2">
                            <Building2 size={14} className="text-[#0D5C36]" />
                            <h4 className="font-bold text-[11px] text-gray-900">Ringkasan Keuangan</h4>
                         </div>
                         <p className="text-[9px] text-gray-500 font-medium">Total Pendapatan</p>
                         <p className="font-black text-[14px] text-gray-900 leading-tight mb-3">Rp 12.500.000</p>
                      </div>
                      <div className="flex justify-between border-t border-gray-100 pt-3">
                         <div>
                            <p className="text-[9px] text-gray-400 font-medium">Tunai</p>
                            <p className="font-bold text-[11px] text-gray-900">Rp 3.500.000</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] text-gray-400 font-medium">Transfer</p>
                            <p className="font-bold text-[11px] text-gray-900">Rp 9.000.000</p>
                         </div>
                      </div>
                   </div>

                   {/* Insight Bulan Ini */}
                   <div className="flex-1 bg-white rounded-[24px] p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-1.5 mb-3">
                         <Zap size={14} className="text-orange-500 fill-orange-500" />
                         <h4 className="font-bold text-[11px] text-gray-900">Insight Bulan Ini</h4>
                      </div>
                      <div className="flex flex-col gap-2.5">
                         <div className="flex gap-2 items-start">
                            <TrendingUp size={12} className="text-[#0D5C36] mt-0.5 shrink-0" />
                            <p className="text-[9px] text-gray-600 font-medium leading-tight">Pendapatan meningkat 12%</p>
                         </div>
                         <div className="flex gap-2 items-start">
                            <Users size={12} className="text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-[9px] text-gray-600 font-medium leading-tight">Okupansi mencapai 83%</p>
                         </div>
                         <div className="flex gap-2 items-start">
                            <Zap size={12} className="text-orange-500 mt-0.5 shrink-0" />
                            <p className="text-[9px] text-gray-600 font-medium leading-tight">Pengeluaran listrik naik 8%</p>
                         </div>
                         <div className="flex gap-2 items-start">
                            <AlertTriangle size={12} className="text-red-500 mt-0.5 shrink-0" />
                            <p className="text-[9px] text-gray-600 font-medium leading-tight">2 penghuni belum membayar sewa</p>
                         </div>
                      </div>
                   </div>
                </div>

             </div>

             {/* Floating Action Button */}
             <button className="absolute right-5 bottom-5 w-12 h-12 bg-[#0D5C36] rounded-full text-white flex items-center justify-center shadow-lg shadow-[#0D5C36]/40 hover:bg-[#0A4A2A] active:scale-95 transition-transform z-30">
                <Plus size={24} />
             </button>
          </div>
        </>
      ) : activeLaundryScreen === "kos_verifikasi_dp" ? (
        <>
          <div className="bg-[#F7FAF8] flex-1 min-h-0 overflow-y-auto flex flex-col relative">
             {/* Header */}
             <div className="bg-white px-5 pt-10 pb-4 shrink-0 z-10 sticky top-0 flex items-center gap-3 shadow-sm shadow-gray-100/50">
                <button onClick={() => setActiveLaundryScreen("dashboard")} className="w-10 h-10 flex items-center -ml-2 text-gray-900 active:scale-95 transition-transform">
                  <ArrowLeft size={22} />
                </button>
                <h2 className="font-extrabold text-[18px] text-gray-900 flex-1">Verifikasi DP</h2>
             </div>

             <div className="px-5 pt-5 pb-8 flex flex-col gap-4 flex-1">
                {/* Banner Atas */}
                <div className="bg-[#E7F6ED] rounded-xl p-4 flex gap-3 items-start border border-[#D1EADC]">
                   <div className="w-5 h-5 rounded-full bg-[#0D5C36] flex items-center justify-center shrink-0 mt-0.5 text-white">
                      <div className="w-2.5 h-2.5 rounded-l-full bg-white/20"></div>
                   </div>
                   <p className="text-[12px] text-[#0A4A2A] font-medium leading-relaxed">
                      Pastikan DP sesuai dengan jumlah dan bukti pembayaran yang diterima dari penghuni.
                   </p>
                </div>

                {/* Card Detail Booking */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col mt-2">
                   <div className="p-4 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                         <div className="w-7 h-7 rounded-lg bg-[#E7F6ED] text-[#0D5C36] flex items-center justify-center">
                            <ClipboardList size={14} />
                         </div>
                         <h3 className="font-extrabold text-[14px] text-gray-900">Detail Booking</h3>
                      </div>
                   </div>
                   <div className="p-5 flex flex-col gap-4">
                      {[
                         { label: "Nama Penghuni", value: "Budi Santoso", bold: true },
                         { label: "Tipe Kamar", value: "Kos Putra" },
                         { label: "Kamar", value: "04 (Ahmad)" },
                         { label: "Tanggal Booking", value: "12 Juli 2026" },
                         { label: "Total Harga", value: "Rp1.500.000", bold: true },
                      ].map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center text-[12px]">
                            <span className="text-gray-500 font-medium">{item.label}</span>
                            <span className={`text-gray-900 ${item.bold ? 'font-bold' : 'font-medium'}`}>{item.value}</span>
                         </div>
                      ))}
                   </div>
                   <div className="p-4 bg-gray-50/50 flex justify-between items-center border-t border-gray-50 text-[13px]">
                      <span className="text-gray-600 font-medium">Jumlah DP</span>
                      <div>
                         <span className="font-extrabold text-[#0D5C36] mr-1">Rp750.000</span>
                         <span className="font-bold text-[#0D5C36] text-[11px]">(50%)</span>
                      </div>
                   </div>
                </div>

                {/* Card Detail Pembayaran DP */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                   <div className="p-4 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                         <div className="w-7 h-7 rounded-lg bg-[#E7F6ED] text-[#0D5C36] flex items-center justify-center">
                            <FileText size={14} />
                         </div>
                         <h3 className="font-extrabold text-[14px] text-gray-900">Detail Pembayaran DP</h3>
                      </div>
                   </div>
                   <div className="p-5 flex flex-col gap-4">
                      {[
                         { label: "Tanggal Transfer", value: "12 Juli 2026, 10:45" },
                         { label: "Metode Pembayaran", value: "Transfer Bank (BCA)" },
                         { label: "Dari Rekening", value: "Budi Santoso", bold: true },
                      ].map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center text-[12px]">
                            <span className="text-gray-500 font-medium">{item.label}</span>
                            <span className={`text-gray-900 ${item.bold ? 'font-bold' : 'font-medium'}`}>{item.value}</span>
                         </div>
                      ))}
                      
                      <div className="flex justify-between items-center text-[12px] mt-2">
                         <span className="text-gray-500 font-medium">Jumlah Diterima</span>
                         <span className="font-black text-[14px] text-gray-900">Rp750.000</span>
                      </div>

                      <div className="flex justify-between items-start text-[12px] mt-4">
                         <span className="text-gray-500 font-medium">Bukti Pembayaran</span>
                         <div className="w-[140px]">
                            <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
                               <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" alt="Bukti Transfer" className="w-full h-full object-cover opacity-80" />
                               <div className="absolute inset-0 bg-black/5" />
                            </div>
                            <button className="w-full py-2.5 mt-2 rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#0D5C36] active:bg-gray-50 transition-colors">
                               <Search size={14} /> Lihat Bukti
                            </button>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Banner Bawah */}
                <div className="bg-[#E7F6ED] rounded-xl p-4 flex gap-3 items-start mt-2">
                   <div className="mt-0.5 shrink-0">
                      <div className="w-[18px] h-[18px] rounded-full bg-[#0D5C36] flex items-center justify-center text-white">
                         <Check size={12} strokeWidth={3} />
                      </div>
                   </div>
                   <p className="text-[12px] text-[#0A4A2A] font-bold leading-relaxed">
                      Setelah verifikasi, status booking akan diperbarui dan kamar akan ditandai sebagai terbooking.
                   </p>
                </div>
             </div>
          </div>
          
          {/* Double Bottom Fixed Bar (Outside scrollable area) */}
          <div className="bg-white px-5 py-4 border-t border-gray-100 flex gap-3 items-center rounded-b-[32px] shrink-0 z-20 shadow-[0_-4px_15px_rgba(0,0,0,0.03)]">
             <button onClick={() => setShowKosTolakDPPopup(true)} className="flex-1 py-3.5 rounded-[16px] text-[#0D5C36] font-bold text-[13px] bg-white border-2 border-[#0D5C36] active:bg-gray-50 transition-colors text-center">
                Tolak DP
             </button>
             <button onClick={() => setShowKosTerimaDPPopup(true)} className="flex-[1.5] py-3.5 rounded-[16px] text-white font-bold text-[13px] bg-[#0D5C36] shadow-sm shadow-[#0D5C36]/30 active:scale-[0.98] transition-transform text-center">
                Verifikasi & Terima DP
             </button>
          </div>

          {/* Popup Tolak DP */}
          {showKosTolakDPPopup && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowKosTolakDPPopup(false)} />
                <div className="bg-white rounded-[28px] w-full max-w-[320px] p-6 relative z-10 animate-in zoom-in-95 fade-in duration-200 shadow-xl flex flex-col items-center text-center">
                   <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                      <AlertTriangle size={28} strokeWidth={2.5} />
                   </div>
                   <h3 className="font-black text-[18px] text-gray-900 mb-2">Tolak Pembayaran DP?</h3>
                   <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-6">
                      Apakah Anda yakin ingin menolak DP ini? Status pesanan akan dikembalikan menjadi tertunda.
                   </p>
                   <div className="flex flex-col gap-2.5 w-full">
                      <button onClick={() => { setShowKosTolakDPPopup(false); setActiveLaundryScreen("dashboard"); }} className="w-full py-3.5 bg-red-500 text-white rounded-[16px] font-bold text-[14px] shadow-sm shadow-red-500/30 active:scale-[0.98] transition-transform">
                         Ya, Tolak DP
                      </button>
                      <button onClick={() => setShowKosTolakDPPopup(false)} className="w-full py-3.5 text-gray-500 font-bold text-[14px] active:bg-gray-50 rounded-[16px] transition-colors">
                         Batal
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* Popup Terima DP */}
          {showKosTerimaDPPopup && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowKosTerimaDPPopup(false)} />
                <div className="bg-white rounded-[28px] w-full max-w-[320px] p-6 relative z-10 animate-in zoom-in-95 fade-in duration-200 shadow-xl flex flex-col items-center text-center">
                   <div className="w-16 h-16 rounded-full bg-[#E7F6ED] flex items-center justify-center text-[#0D5C36] mb-4">
                      <CheckCircle size={32} strokeWidth={2.5} />
                   </div>
                   <h3 className="font-black text-[18px] text-gray-900 mb-2">Verifikasi Berhasil</h3>
                   <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-6">
                      Pembayaran DP atas nama <strong className="text-gray-900">Budi Santoso</strong> telah dikonfirmasi. Kamar berhasil dipesan!
                   </p>
                   <div className="flex flex-col gap-2.5 w-full">
                      <button onClick={() => { setShowKosTerimaDPPopup(false); setActiveLaundryScreen("dashboard"); }} className="w-full py-3.5 bg-[#0D5C36] text-white rounded-[16px] font-bold text-[14px] shadow-sm shadow-[#0D5C36]/30 active:scale-[0.98] transition-transform">
                         Kembali ke Dasbor
                      </button>
                   </div>
                </div>
             </div>
          )}
        </>
      ) : activeLaundryScreen === "kos_kirim_pengingat" ? (
        <>
          <div className="bg-[#F7FAF8] flex-1 min-h-0 overflow-y-auto flex flex-col relative pb-8">
             {/* Header */}
             <div className="bg-[#F7FAF8] px-5 pt-10 pb-4 shrink-0 z-10 sticky top-0 flex items-center gap-3">
                <button onClick={() => setActiveLaundryScreen("dashboard")} className="w-10 h-10 flex items-center -ml-2 text-gray-900 active:scale-95 transition-transform">
                  <ArrowLeft size={22} />
                </button>
                <h2 className="font-extrabold text-[18px] text-gray-900 flex-1">Kirim Pengingat</h2>
             </div>

             <div className="px-5 pt-2 flex flex-col gap-4">
                {/* Banner Atas */}
                <div className="bg-[#FFF5F2] rounded-xl p-4 flex gap-3 items-start border border-[#FFE8E2]">
                   <div className="mt-0.5 shrink-0">
                      <AlertCircle size={16} className="text-[#FF5C35]" />
                   </div>
                   <p className="text-[12px] text-gray-700 font-medium leading-relaxed">
                      Kirim pengingat pembayaran ke penghuni yang belum melunasi pembayaran.
                   </p>
                </div>

                {/* Card Detail Tagihan */}
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col mt-2">
                   <div className="p-4 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                         <div className="w-7 h-7 rounded-lg bg-[#FFF5F2] text-[#FF5C35] flex items-center justify-center">
                            <FileText size={14} />
                         </div>
                         <h3 className="font-extrabold text-[14px] text-gray-900">Detail Tagihan</h3>
                      </div>
                   </div>
                   <div className="p-5 flex flex-col gap-4">
                      {[
                         { label: "Nama Penghuni", value: "Budi Santoso" },
                         { label: "Kamar", value: "04 (Ahmad)" },
                         { label: "Tipe Kamar", value: "Kos Putra" },
                      ].map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center text-[12px]">
                            <span className="text-gray-500 font-medium">{item.label}</span>
                            <span className="text-gray-900 font-medium">{item.value}</span>
                         </div>
                      ))}
                      <div className="flex justify-between items-center text-[12px]">
                         <span className="text-gray-500 font-medium">Tagihan</span>
                         <span className="text-[#FF5C35] font-bold">Rp1.500.000</span>
                      </div>
                      <div className="flex justify-between items-center text-[12px]">
                         <span className="text-gray-500 font-medium">Jatuh Tempo</span>
                         <span className="text-[#FF5C35] font-bold">12 Juli 2026 (Hari ini)</span>
                      </div>
                      <div className="flex justify-between items-center text-[12px]">
                         <span className="text-gray-500 font-medium">Status</span>
                         <span className="bg-[#FFF5F2] text-[#FF5C35] font-bold px-2 py-1 rounded-lg">Belum Dibayar</span>
                      </div>
                   </div>
                </div>

                {/* Pilih Metode Pengiriman */}
                <div>
                   <h3 className="font-bold text-[13px] text-gray-900 mb-3 ml-1">Pilih Metode Pengiriman</h3>
                   <div className="flex flex-col gap-3">
                      <div 
                         onClick={() => setKosPengingatMethod("whatsapp")}
                         className={`p-4 rounded-[16px] border-[1.5px] flex gap-3 items-center cursor-pointer transition-colors ${kosPengingatMethod === "whatsapp" ? "border-[#0D5C36] bg-[#F7FAF8]" : "border-gray-200 bg-white"}`}
                      >
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${kosPengingatMethod === "whatsapp" ? "bg-[#E7F6ED] text-[#0D5C36]" : "bg-gray-50 text-gray-400"}`}>
                            <MessageCircle size={20} />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">WhatsApp</h4>
                            <p className="text-[11px] text-gray-500 font-medium">Kirim pengingat melalui WhatsApp</p>
                         </div>
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${kosPengingatMethod === "whatsapp" ? "border-[#0D5C36]" : "border-gray-300"}`}>
                            {kosPengingatMethod === "whatsapp" && <div className="w-2.5 h-2.5 rounded-full bg-[#0D5C36]"></div>}
                         </div>
                      </div>

                      <div 
                         onClick={() => setKosPengingatMethod("sms")}
                         className={`p-4 rounded-[16px] border-[1.5px] flex gap-3 items-center cursor-pointer transition-colors ${kosPengingatMethod === "sms" ? "border-[#0D5C36] bg-[#F7FAF8]" : "border-gray-200 bg-white"}`}
                      >
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${kosPengingatMethod === "sms" ? "bg-[#E7F6ED] text-[#0D5C36]" : "bg-gray-50 text-gray-400"}`}>
                            <MessageSquare size={20} />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">SMS</h4>
                            <p className="text-[11px] text-gray-500 font-medium">Kirim pengingat melalui SMS</p>
                         </div>
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${kosPengingatMethod === "sms" ? "border-[#0D5C36]" : "border-gray-300"}`}>
                            {kosPengingatMethod === "sms" && <div className="w-2.5 h-2.5 rounded-full bg-[#0D5C36]"></div>}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Pesan Pengingat */}
                <div className="mt-2">
                   <h3 className="font-bold text-[13px] text-gray-900 mb-3 ml-1">Pesan Pengingat</h3>
                   <div className="bg-white rounded-[20px] p-4 border border-gray-200 shadow-sm relative mb-3">
                      <p className="text-[12px] text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
Halo Budi Santoso,<br/><br/>
Ini adalah pengingat bahwa pembayaran untuk kamar 04 (Ahmad) dengan total Rp1.500.000 telah jatuh tempo hari ini (12 Juli 2026).<br/><br/>
Mohon segera lakukan pembayaran. Terima kasih!<br/><br/>
- Kosan Pak Rahman
                      </p>
                      <div className="text-right mt-2">
                         <span className="text-[10px] font-medium text-gray-400">162/200</span>
                      </div>
                   </div>
                   
                   {/* Banner Tips */}
                   <div className="bg-[#FFF8E1] rounded-xl p-3 flex gap-2.5 items-center border border-[#FFECB3]">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-500">
                         <Info size={12} strokeWidth={3} />
                      </div>
                      <p className="text-[11px] text-orange-700 font-medium">
                         Tips: Pesan akan dikirim secara personal ke penghuni.
                      </p>
                   </div>
                </div>

             </div>
          </div>
          
          {/* Bottom Fixed Bar */}
          <div className="bg-white px-5 py-4 border-t border-gray-100 flex items-center rounded-b-[32px] shrink-0 z-20 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] relative">
             <button onClick={() => setShowKosKirimPengingatPopup(true)} className="w-full py-4 rounded-[16px] text-white font-bold text-[14px] bg-[#0D5C36] shadow-sm shadow-[#0D5C36]/30 active:scale-[0.98] transition-transform text-center relative overflow-hidden">
                Kirim Pengingat
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
             </button>
          </div>

          {/* Popup Kirim Pengingat */}
          {showKosKirimPengingatPopup && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowKosKirimPengingatPopup(false)} />
                <div className="bg-white rounded-[28px] w-full max-w-[320px] p-6 relative z-10 animate-in zoom-in-95 fade-in duration-200 shadow-xl flex flex-col items-center text-center">
                   <div className="w-16 h-16 rounded-full bg-[#E7F6ED] flex items-center justify-center text-[#0D5C36] mb-4 relative overflow-hidden">
                      <Send size={28} className="relative z-10 animate-bounce" />
                   </div>
                   <h3 className="font-black text-[18px] text-gray-900 mb-2">Berhasil Terkirim</h3>
                   <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-6">
                      Pesan pengingat tagihan berhasil dikirimkan ke <strong className="text-gray-900">Budi Santoso</strong> melalui {kosPengingatMethod === "whatsapp" ? "WhatsApp" : "SMS"}.
                   </p>
                   <div className="flex flex-col gap-2.5 w-full">
                      <button onClick={() => { setShowKosKirimPengingatPopup(false); setActiveLaundryScreen("dashboard"); }} className="w-full py-3.5 bg-[#0D5C36] text-white rounded-[16px] font-bold text-[14px] shadow-sm shadow-[#0D5C36]/30 active:scale-[0.98] transition-transform">
                         Kembali ke Dasbor
                      </button>
                   </div>
                </div>
             </div>
          )}
        </>
      ) : activeLaundryScreen === "kos_notifikasi" ? (
        <>
          <div className="bg-[#F7FAF8] flex-1 min-h-0 flex flex-col relative overflow-hidden">
             {/* Header */}
             <div className="bg-[#F7FAF8] px-5 pt-10 pb-4 shrink-0 z-10 flex items-center gap-3">
                <button onClick={() => setActiveLaundryScreen("dashboard")} className="w-10 h-10 flex items-center -ml-2 text-gray-900 active:scale-95 transition-transform">
                  <ArrowLeft size={22} />
                </button>
                <h2 className="font-extrabold text-[18px] text-gray-900 flex-1">Notifikasi</h2>
                <button className="text-[11px] font-bold text-[#0D5C36]">Tandai semua dibaca</button>
             </div>

             {/* Scrolling Content */}
             <div className="flex-1 min-h-0 overflow-y-auto flex flex-col relative pb-32">
             {/* Tabs */}
             <div className="px-5 pb-4 overflow-x-auto flex gap-2 shrink-0" style={{ scrollbarWidth: "none" }}>
                {[
                   { id: "Semua", icon: null, badge: 7 },
                   { id: "Transaksi", icon: Wallet, badge: 3 },
                   { id: "Pembayaran", icon: BellRing, badge: 2 },
                   { id: "Sistem", icon: Bell, badge: 2 }
                ].map(tab => (
                   <button 
                      key={tab.id}
                      onClick={() => setKosNotifikasiTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-100 whitespace-nowrap transition-colors relative ${kosNotifikasiTab === tab.id ? "bg-[#0D5C36] text-white" : "bg-white text-gray-600"}`}
                   >
                      {tab.icon && <tab.icon size={14} className={kosNotifikasiTab === tab.id ? "text-white" : tab.id === "Transaksi" ? "text-green-500" : tab.id === "Pembayaran" ? "text-orange-400" : "text-blue-500"} />}
                      <span className="font-bold text-[12px]">{tab.id}</span>
                      {tab.badge > 0 && (
                         <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-[1.5px] border-[#F7FAF8] text-white text-[9px] font-bold flex items-center justify-center">
                            {tab.badge}
                         </span>
                      )}
                   </button>
                ))}
             </div>

             <div className="px-5 pb-6 flex flex-col gap-6">
                
                {/* Section: Baru */}
                <div>
                   <h3 className="font-extrabold text-[15px] text-gray-900 mb-3 ml-1">Baru</h3>
                   <div className="flex flex-col gap-3">
                      
                      {/* Booking Baru */}
                      <div onClick={() => setActiveLaundryScreen("kos_verifikasi_dp")} className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex gap-3 items-center relative cursor-pointer active:scale-[0.99] transition-transform">
                         <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 relative">
                            <Bell size={20} />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="font-bold text-[14px] text-gray-900 truncate pr-2">Booking Kamar Baru</h4>
                               <span className="text-[10px] font-bold text-[#0D5C36] bg-[#E7F6ED] px-2 py-0.5 rounded-full shrink-0">Baru saja</span>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-relaxed pr-4">Budi Santoso telah membayar DP untuk tipe <strong className="text-gray-900">Kos Putra</strong>.</p>
                         </div>
                         <ChevronRight size={16} className="text-gray-300 shrink-0" />
                      </div>

                      {/* Pembayaran Diterima */}
                      <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex gap-3 items-center relative cursor-pointer active:scale-[0.99] transition-transform">
                         <div className="w-12 h-12 rounded-full bg-[#E7F6ED] flex items-center justify-center text-[#0D5C36] shrink-0 relative">
                            <Wallet size={20} />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#0D5C36] rounded-full border-2 border-white" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="font-bold text-[14px] text-gray-900 truncate pr-2">Pembayaran Diterima</h4>
                               <span className="text-[10px] text-gray-400 shrink-0">10 menit lalu</span>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-relaxed pr-4">Pembayaran kamar A-03 oleh Budi Santoso sebesar <strong className="text-[#0D5C36]">Rp1.500.000</strong> berhasil diterima.</p>
                         </div>
                         <ChevronRight size={16} className="text-gray-300 shrink-0" />
                      </div>

                      {/* Tagihan Jatuh Tempo */}
                      <div onClick={() => setActiveLaundryScreen("kos_kirim_pengingat")} className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex gap-3 items-center relative cursor-pointer active:scale-[0.99] transition-transform">
                         <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0 relative">
                            <AlertCircle size={20} />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="font-bold text-[14px] text-gray-900 truncate pr-2">Tagihan Jatuh Tempo</h4>
                               <span className="text-[10px] text-gray-400 shrink-0">1 jam lalu</span>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-relaxed pr-4">Kamar 04 (Ahmad) jatuh tempo hari ini sebesar <strong className="text-red-500">Rp1.500.000</strong>.</p>
                         </div>
                         <ChevronRight size={16} className="text-gray-300 shrink-0" />
                      </div>

                   </div>
                </div>

                {/* Section: Sebelumnya */}
                <div>
                   <h3 className="font-extrabold text-[15px] text-gray-900 mb-3 ml-1">Sebelumnya</h3>
                   <div className="flex flex-col gap-3">
                      
                      {/* Laporan Bulanan Siap */}
                      <div onClick={() => setActiveLaundryScreen("kos_laporan_keuangan")} className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex gap-3 items-center cursor-pointer active:scale-[0.99] transition-transform">
                         <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                            <BarChart2 size={20} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="font-bold text-[14px] text-gray-900 truncate pr-2">Laporan Bulanan Siap</h4>
                               <span className="text-[10px] text-gray-400 shrink-0">Kemarin, 09.00</span>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-relaxed pr-4">Laporan keuangan bulan Juni 2026 sudah siap untuk dilihat.</p>
                         </div>
                         <ChevronRight size={16} className="text-gray-300 shrink-0" />
                      </div>

                      {/* Penghuni Baru */}
                      <div onClick={() => setActiveLaundryScreen("kos_manajemen_penghuni")} className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex gap-3 items-center cursor-pointer active:scale-[0.99] transition-transform">
                         <div className="w-12 h-12 rounded-full bg-[#E7F6ED] flex items-center justify-center text-[#0D5C36] shrink-0">
                            <Users size={20} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="font-bold text-[14px] text-gray-900 truncate pr-2">Penghuni Baru Bergabung</h4>
                               <span className="text-[10px] text-gray-400 shrink-0">2 Jul 2026</span>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-relaxed pr-4">Ayu Lestari telah menjadi penghuni kamar B-02.</p>
                         </div>
                         <ChevronRight size={16} className="text-gray-300 shrink-0" />
                      </div>

                      {/* Pengingat Pembayaran Listrik */}
                      <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex gap-3 items-center cursor-pointer active:scale-[0.99] transition-transform">
                         <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                            <Zap size={20} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="font-bold text-[14px] text-gray-900 truncate pr-2">Pengingat Pembayaran Listrik</h4>
                               <span className="text-[10px] text-gray-400 shrink-0">1 Jul 2026</span>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-relaxed pr-4">Pembayaran listrik bulan Juli 2026 sebesar <strong className="text-orange-500">Rp650.000</strong>.</p>
                         </div>
                         <ChevronRight size={16} className="text-gray-300 shrink-0" />
                      </div>

                      {/* Pembaruan Sistem */}
                      <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex gap-3 items-center cursor-pointer active:scale-[0.99] transition-transform">
                         <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                            <Settings size={20} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="font-bold text-[14px] text-gray-900 truncate pr-2">Pembaruan Sistem</h4>
                               <span className="text-[10px] text-gray-400 shrink-0">30 Jun 2026</span>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-relaxed pr-4">Aplikasi Kostin telah diperbarui ke versi 2.1.0.</p>
                         </div>
                         <ChevronRight size={16} className="text-gray-300 shrink-0" />
                      </div>

                   </div>
                </div>

             </div>
             </div>
             
             {/* Bottom Aktifkan Notifikasi */}
             <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#F7FAF8] via-[#F7FAF8] to-transparent pointer-events-none z-20">
                <div className="bg-[#E7F6ED] rounded-[20px] p-4 flex gap-3 items-center border border-[#D1EADC] pointer-events-auto shadow-sm">
                   <div className="w-10 h-10 rounded-full bg-[#0D5C36] flex items-center justify-center text-white shrink-0">
                      <BellRing size={18} />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-extrabold text-[13px] text-gray-900">Aktifkan notifikasi</h4>
                      <p className="text-[10px] text-gray-600 font-medium">Dapatkan informasi penting secara real-time.</p>
                   </div>
                   <button className="px-4 py-2 bg-white rounded-full border border-gray-200 text-[#0D5C36] text-[11px] font-bold active:bg-gray-50 transition-colors shrink-0">
                      Aktifkan
                   </button>
                </div>
             </div>

          </div>
        </>
      ) : null}

      {/* MODAL DETAIL PESANAN LAUNDRY */}
      {selectedOrder && (
        <div className="absolute inset-0 z-50 bg-[#F7FAF8] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          {laundryFlowStep === "input_weight" && (
            <>
              <div className="bg-white px-5 pt-8 pb-4 flex items-center gap-3 shrink-0 shadow-sm z-10">
                <button onClick={() => setSelectedLaundryOrderId(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 active:bg-gray-100">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="font-extrabold text-[17px] text-gray-900 leading-none">Penawaran Harga</h2>
                  <p className="text-[12px] text-gray-500 mt-1">{selectedOrder.id}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 pb-32">
                <div className="flex items-center gap-4 mb-6">
                  <img src={selectedOrder.userAvatar} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-extrabold text-[15px] text-gray-900">{selectedOrder.name}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{selectedOrder.phone}</p>
                  </div>
                  <button className="ml-auto w-10 h-10 rounded-full bg-green-50 text-[#0D5C36] flex items-center justify-center">
                    <MessageCircle size={18} />
                  </button>
                </div>

                <h3 className="font-extrabold text-[14px] text-gray-900 mb-3">Detail Cucian</h3>
                <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm mb-6">
                  <div className="mb-4">
                    <p className="text-[11px] text-gray-500 mb-1">Jenis Layanan</p>
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-[12px] p-3 text-[13px] font-bold text-gray-900 flex justify-between">
                      {selectedOrder.service} <ChevronRight size={16} className="text-gray-400"/>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-[11px] text-gray-500 mb-1">Berat Cucian (kg)</p>
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-[12px] p-2">
                      <button 
                        onClick={() => setLaundryWeight(Math.max(1, laundryWeight - 0.5))}
                        className="w-10 h-10 rounded-[10px] bg-white text-gray-600 shadow-sm flex items-center justify-center text-lg font-bold hover:bg-gray-100 active:scale-95 transition-transform"
                      >-</button>
                      <span className="font-black text-xl text-gray-900">{laundryWeight.toFixed(1)}</span>
                      <button 
                        onClick={() => setLaundryWeight(laundryWeight + 0.5)}
                        className="w-10 h-10 rounded-[10px] bg-[#0D5C36] text-white shadow-sm flex items-center justify-center text-lg font-bold hover:bg-[#1B7A4E] active:scale-95 transition-transform"
                      >+</button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-[11px] text-gray-500 mb-1">Catatan</p>
                    <p className="text-[13px] font-bold text-gray-900">{selectedOrder.notes}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 mb-1">Estimasi Selesai</p>
                    <p className="text-[13px] font-bold text-gray-900">{selectedOrder.date}</p>
                  </div>
                </div>

                <h3 className="font-extrabold text-[14px] text-gray-900 mb-3">Rincian Harga</h3>
                <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[12px] text-gray-500">Harga per Kg</p>
                    <p className="text-[13px] font-bold text-gray-900">{rp(selectedOrder.pricePerKg)}</p>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[12px] text-gray-500">Subtotal</p>
                    <p className="text-[13px] font-bold text-gray-900">{rp(selectedOrder.pricePerKg * laundryWeight)}</p>
                  </div>
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-dashed border-gray-200">
                    <p className="text-[12px] text-gray-500">Ongkos Pickup</p>
                    <p className="text-[13px] font-bold text-gray-900">{rp(5000)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] font-extrabold text-gray-900">Total Harga</p>
                    <p className="text-[18px] font-black text-[#0D5C36]">{rp(selectedOrder.pricePerKg * laundryWeight + 5000)}</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-5 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <button 
                  onClick={() => {
                    setLaundryOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, weight: laundryWeight, total: selectedOrder.pricePerKg * laundryWeight + 5000, status: "menunggu_pembayaran" } : o));
                    setLaundryFlowStep("waiting_payment");
                    setTimeout(() => {
                      setLaundryOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: "diproses" } : o));
                      setLaundryFlowStep("detail");
                    }, 3000);
                  }}
                  className="w-full h-14 rounded-[16px] bg-[#0D5C36] text-white font-extrabold text-[15px] flex items-center justify-center active:scale-[0.98] transition-transform"
                >
                  Kirim Penawaran Harga
                </button>
              </div>
            </>
          )}

          {laundryFlowStep === "waiting_payment" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 rounded-full border-4 border-[#0D5C36] border-t-transparent animate-spin" />
                 <CheckCircle size={32} className="text-[#0D5C36] opacity-50" />
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Menunggu Pembayaran...</h2>
              <p className="text-sm text-gray-500 mb-8 max-w-[250px]">Penawaran harga telah dikirim. Menunggu konfirmasi pembayaran dari pelanggan.</p>
              <div className="p-4 bg-[#F7FAF8] rounded-[16px] border border-gray-100 w-full max-w-[280px]">
                <p className="text-xs text-gray-500 mb-1">Simulasi:</p>
                <p className="text-sm font-bold text-gray-900">Pembayaran otomatis sukses dalam 3 detik.</p>
              </div>
            </div>
          )}

          {laundryFlowStep === "detail" && (
            <>
              <div className="bg-white px-5 pt-8 pb-4 flex items-center justify-between shrink-0 shadow-sm z-10 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedLaundryOrderId(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 active:bg-gray-100">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="font-extrabold text-[17px] text-gray-900 leading-none">Detail Order</h2>
                    <p className="text-[12px] text-gray-500 mt-1">{selectedOrder.id}</p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-green-50 text-[#0D5C36] flex items-center justify-center">
                  <MessageCircle size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 pb-32">
                <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm mb-6">
                  <h3 className="font-extrabold text-[14px] text-gray-900 mb-4">Status Pesanan</h3>
                  <div className="flex flex-col gap-0 relative">
                    <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-gray-100" />
                    
                    <div className="flex gap-4 relative mb-6">
                      <div className="w-6 h-6 rounded-full bg-[#0D5C36] flex items-center justify-center shrink-0 z-10 relative">
                        <CheckCircle size={12} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-gray-900">Baru</p>
                        <p className="text-[11px] text-gray-500">Pesanan baru diterima</p>
                      </div>
                    </div>

                    <div className="flex gap-4 relative mb-6">
                      <div className="w-6 h-6 rounded-full bg-[#0D5C36] flex items-center justify-center shrink-0 z-10 relative">
                        <CheckCircle size={12} className="text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-gray-900">Dibayar</p>
                        <p className="text-[11px] text-gray-500">Pelanggan telah membayar</p>
                      </div>
                    </div>

                    <div className={`flex gap-4 relative mb-6 ${['diproses', 'diantar', 'selesai'].includes(selectedOrder.status) ? '' : 'opacity-40'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 relative ${['diproses', 'diantar', 'selesai'].includes(selectedOrder.status) ? 'bg-[#0D5C36]' : 'bg-gray-200'}`}>
                        {selectedOrder.status !== 'diproses' && <CheckCircle size={12} className="text-white" />}
                        {selectedOrder.status === 'diproses' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-gray-900">Diproses</p>
                        <p className="text-[11px] text-gray-500">Cucian sedang dalam proses</p>
                      </div>
                    </div>

                    <div className={`flex gap-4 relative mb-6 ${['diantar', 'selesai'].includes(selectedOrder.status) ? '' : 'opacity-40'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 relative ${['diantar', 'selesai'].includes(selectedOrder.status) ? 'bg-[#0D5C36]' : 'bg-gray-200'}`}>
                        {selectedOrder.status === 'selesai' && <CheckCircle size={12} className="text-white" />}
                        {selectedOrder.status === 'diantar' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-gray-900">Diserahkan Kurir</p>
                        <p className="text-[11px] text-gray-500">Sedang diantar ke alamat user</p>
                      </div>
                    </div>

                    <div className={`flex gap-4 relative ${selectedOrder.status === 'selesai' ? '' : 'opacity-40'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 relative ${selectedOrder.status === 'selesai' ? 'bg-[#0D5C36]' : 'bg-gray-200'}`}>
                        {selectedOrder.status === 'selesai' && <CheckCircle size={12} className="text-white" />}
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-gray-900">Selesai</p>
                        <p className="text-[11px] text-gray-500">Cucian selesai dan diterima</p>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="font-extrabold text-[14px] text-gray-900 mb-3">Detail Order</h3>
                <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[12px] text-gray-500">Layanan</p>
                    <p className="text-[13px] font-bold text-gray-900">{selectedOrder.service}</p>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[12px] text-gray-500">Berat</p>
                    <p className="text-[13px] font-bold text-gray-900">{selectedOrder.weight || 3.0} kg</p>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[12px] text-gray-500">Catatan</p>
                    <p className="text-[13px] font-bold text-gray-900">{selectedOrder.notes}</p>
                  </div>
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-dashed border-gray-200">
                    <p className="text-[12px] text-gray-500">Estimasi Selesai</p>
                    <p className="text-[13px] font-bold text-gray-900">{selectedOrder.date}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[14px] font-extrabold text-gray-900">Total Harga</p>
                    <p className="text-[16px] font-black text-[#0D5C36]">{rp(selectedOrder.total)}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.status !== "selesai" && (
                <div className="absolute bottom-0 left-0 w-full p-5 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                  <button 
                    onClick={() => {
                      setLaundryOrders(prev => prev.map(o => o.id === selectedOrder.id ? { 
                        ...o, 
                        status: o.status === "diproses" ? "diantar" : "selesai" 
                      } : o));
                    }}
                    className="w-full h-14 rounded-[16px] bg-[#0D5C36] text-white font-extrabold text-[15px] flex items-center justify-center active:scale-[0.98] transition-transform"
                  >
                    {selectedOrder.status === "diproses" ? "Serahkan ke Kurir" : "Selesaikan Pesanan"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* KOS ROOM ACTION MENU (BOTTOM SHEET) */}
      <AnimatePresence>
        {showKosRoomMenu && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end"
            onClick={() => setShowKosRoomMenu(false)}
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-[32px] p-6 pb-8 shadow-2xl flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mb-6" />
              
              <div className="w-full flex flex-col gap-2">
                <button onClick={() => { setShowKosRoomMenu(false); setKosRoomWizardMode("add"); setKosRoomWizardStep(1); }} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors w-full text-left">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-[#0D5C36] flex items-center justify-center shrink-0">
                    <Plus size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[15px] text-gray-900">Tambah Kamar Baru</h3>
                    <p className="text-[12px] text-gray-500 mt-0.5">Buat kamar baru untuk disewakan</p>
                  </div>
                </button>

                <button onClick={() => { setShowKosRoomMenu(false); setKosRoomWizardMode("edit"); setKosRoomWizardStep(1); }} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors w-full text-left">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-[#0D5C36] flex items-center justify-center shrink-0">
                    <Edit3 size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[15px] text-gray-900">Edit Kamar</h3>
                    <p className="text-[12px] text-gray-500 mt-0.5">Ubah informasi kamar yang sudah ada</p>
                  </div>
                </button>

                <button className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors w-full text-left">
                  <div className="w-12 h-12 rounded-full bg-green-50 text-[#0D5C36] flex items-center justify-center shrink-0">
                    <Copy size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[15px] text-gray-900">Duplikat Kamar</h3>
                    <p className="text-[12px] text-gray-500 mt-0.5">Salin data kamar untuk kamar baru</p>
                  </div>
                </button>

                <button className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors w-full text-left">
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <EyeOff size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[15px] text-gray-900">Nonaktifkan Kamar</h3>
                    <p className="text-[12px] text-gray-500 mt-0.5">Sembunyikan kamar dari pencarian</p>
                  </div>
                </button>

                <button className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors w-full text-left">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                    <Trash2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[15px] text-gray-900">Hapus Kamar</h3>
                    <p className="text-[12px] text-gray-500 mt-0.5">Hapus kamar secara permanen</p>
                  </div>
                </button>
              </div>

              <button onClick={() => setShowKosRoomMenu(false)} className="w-full mt-4 py-4 rounded-2xl font-bold text-[15px] text-gray-900 bg-gray-50 active:bg-gray-100 transition-colors">
                Batal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MULTI-STEP WIZARD MODAL */}
      <AnimatePresence>
        {kosRoomWizardStep > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-white z-[60] flex flex-col"
          >
            {/* Wizard Header */}
            <div className="px-5 pt-8 pb-4 flex items-center justify-between border-b border-gray-100 shrink-0">
              <div className="flex-1"></div>
              <h2 className="font-extrabold text-[16px] text-gray-900 flex-1 text-center">
                {kosRoomWizardMode === "add" ? "Tambah Kamar Baru" : kosRoomWizardStep === 3 ? "Detail & Status" : "Edit Kamar 1A"}
              </h2>
              <div className="flex-1 flex justify-end">
                <button onClick={() => setKosRoomWizardStep(0)} className="w-8 h-8 flex items-center justify-center text-gray-500 active:scale-95 transition-transform">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Stepper Indicator */}
            <div className="px-10 py-6 shrink-0">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-4 right-4 h-0.5 bg-gray-100 top-1/2 -translate-y-1/2 z-0" />
                {[1, 2, 3].map(step => (
                  <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold relative z-10 transition-colors ${
                    kosRoomWizardStep === step ? "bg-[#0D5C36] text-white ring-4 ring-green-50" :
                    kosRoomWizardStep > step ? "bg-[#0D5C36] text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Wizard Content Scrollable */}
            <div className="flex-1 overflow-y-auto px-5 pb-32">
              {kosRoomWizardStep === 1 && (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="font-extrabold text-[16px] text-gray-900 mb-2">Informasi Dasar</h3>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-gray-900">Nomor Kamar <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Contoh: 1A" defaultValue={kosRoomWizardMode === "edit" ? "1A" : ""} className="w-full h-12 px-4 rounded-xl border border-gray-200 text-[14px] font-medium focus:border-[#0D5C36] focus:ring-1 focus:ring-[#0D5C36] outline-none transition-all placeholder:text-gray-400" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-gray-900">Tipe Kamar <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select defaultValue={kosRoomWizardMode === "edit" ? "Tipe AC" : ""} className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-200 text-[14px] font-medium focus:border-[#0D5C36] focus:ring-1 focus:ring-[#0D5C36] outline-none transition-all appearance-none bg-white text-gray-900">
                        <option value="" disabled>Pilih tipe kamar</option>
                        <option value="Tipe AC">Tipe AC</option>
                        <option value="Tipe Standar">Tipe Standar</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-gray-900">Harga Sewa / bulan <span className="text-red-500">*</span></label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-[14px] font-bold text-gray-500">Rp</span>
                      <input type="number" placeholder="0" defaultValue={kosRoomWizardMode === "edit" ? "1200000" : ""} className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 text-[14px] font-bold focus:border-[#0D5C36] focus:ring-1 focus:ring-[#0D5C36] outline-none transition-all placeholder:text-gray-400" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-gray-900">Deskripsi (Opsional)</label>
                    <textarea placeholder="Tambahkan deskripsi kamar..." defaultValue={kosRoomWizardMode === "edit" ? "Kamar nyaman dan bersih, cocok untuk mahasiswa atau pekerja." : ""} className="w-full h-24 p-4 rounded-xl border border-gray-200 text-[14px] font-medium focus:border-[#0D5C36] focus:ring-1 focus:ring-[#0D5C36] outline-none transition-all placeholder:text-gray-400 resize-none" />
                  </div>
                </div>
              )}

              {kosRoomWizardStep === 2 && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h3 className="font-extrabold text-[16px] text-gray-900 mb-1">Fasilitas Kamar</h3>
                    <p className="text-[11px] text-gray-500 mb-4">Pilih fasilitas yang tersedia</p>
                    
                    <div className="flex flex-wrap gap-2.5">
                      {["AC", "Kipas", "WiFi", "KM Dalam", "KM Luar", "Kasur", "Lemari", "Meja", "Kursi", "TV", "Dispenser", "Parkir"].map(am => {
                        const isSelected = kosRoomAmenities.includes(am);
                        return (
                          <button 
                            key={am} 
                            onClick={() => setKosRoomAmenities(prev => isSelected ? prev.filter(x => x !== am) : [...prev, am])}
                            className={`px-4 py-2.5 rounded-xl border flex items-center gap-1.5 text-[12px] font-bold transition-all ${isSelected ? "border-[#0D5C36] bg-[#F2FAF5] text-[#0D5C36]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                          >
                            {am === "AC" && <Monitor size={14} />}
                            {am === "Kipas" && <Wind size={14} />}
                            {am === "WiFi" && <Wifi size={14} />}
                            {am.includes("KM") && <Bath size={14} />}
                            {am}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-[16px] text-gray-900 mb-1">Foto Kamar</h3>
                    <p className="text-[11px] text-gray-500 mb-4">Tambahkan foto kamar (Maks. 5 foto)</p>
                    
                    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                      {kosRoomWizardMode === "edit" && [
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=200&fit=crop",
                        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=200&h=200&fit=crop",
                        "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=200&h=200&fit=crop"
                      ].map((img, i) => (
                        <div key={i} className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 relative overflow-hidden border border-gray-200">
                          <img src={img} className="w-full h-full object-cover" />
                          <button className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <button className="w-20 h-20 rounded-xl bg-gray-50 border border-dashed border-gray-300 shrink-0 flex flex-col items-center justify-center gap-1 text-[#0D5C36] hover:bg-[#F2FAF5] hover:border-[#0D5C36] transition-colors">
                        <Plus size={20} />
                        <span className="text-[9px] font-bold">Tambah Foto</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {kosRoomWizardStep === 3 && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {kosRoomWizardMode === "add" && (
                    <div>
                      <h3 className="font-extrabold text-[16px] text-gray-900 mb-1">Ringkasan</h3>
                      <p className="text-[11px] text-gray-500 mb-4">Periksa kembali informasi kamar Anda</p>
                      
                      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-4">
                        <div className="flex gap-3 items-center mb-4">
                          <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                            <ImageIcon size={24} className="m-auto mt-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-black text-[16px] text-gray-900">1A</h4>
                              <span className="bg-[#F2FAF5] text-[#0D5C36] text-[9px] font-bold px-2 py-0.5 rounded-full">Tipe AC</span>
                            </div>
                            <p className="font-black text-[14px] text-[#0D5C36] leading-none">Rp 1.200.000 <span className="text-[9px] text-gray-400 font-medium">/ bulan</span></p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-[11px] font-bold text-gray-900 shrink-0">Fasilitas</p>
                            <p className="text-[11px] text-gray-500 text-right">AC, WiFi, KM Dalam, Kasur, Lemari, Meja</p>
                          </div>
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-[11px] font-bold text-gray-900 shrink-0">Deskripsi</p>
                            <p className="text-[11px] text-gray-500 text-right">Kamar nyaman dan bersih, cocok untuk mahasiswa atau pekerja.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-extrabold text-[16px] text-gray-900 mb-4">{kosRoomWizardMode === "add" ? "Status Kamar" : "Detail & Status"}</h3>
                    
                    <div className="flex flex-col gap-3">
                      <label className={`flex items-center gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${kosRoomWizardMode === "add" ? "border-[#0D5C36] bg-[#F2FAF5]" : "border-gray-200"}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${kosRoomWizardMode === "add" ? "border-[#0D5C36]" : "border-gray-300"}`}>
                          {kosRoomWizardMode === "add" && <div className="w-2.5 h-2.5 rounded-full bg-[#0D5C36]" />}
                        </div>
                        <div>
                          <p className={`font-bold text-[13px] ${kosRoomWizardMode === "add" ? "text-[#0D5C36]" : "text-gray-900"}`}>Tersedia</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">Kamar siap disewakan</p>
                        </div>
                      </label>
                      <label className={`flex items-center gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${kosRoomWizardMode === "add" ? "border-gray-200" : "border-[#0D5C36] bg-[#F2FAF5]"}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${kosRoomWizardMode === "add" ? "border-gray-300" : "border-[#0D5C36]"}`}>
                          {kosRoomWizardMode === "edit" && <div className="w-2.5 h-2.5 rounded-full bg-[#0D5C36]" />}
                        </div>
                        <div>
                          <p className={`font-bold text-[13px] ${kosRoomWizardMode === "add" ? "text-gray-900" : "text-[#0D5C36]"}`}>Tidak Tersedia</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">Sembunyikan kamar sementara</p>
                        </div>
                      </label>
                    </div>
                    
                    {kosRoomWizardMode === "edit" && (
                      <div className="mt-6 flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center">
                          <p className="text-[11px] text-gray-500">Dibuat pada</p>
                          <p className="text-[11px] font-bold text-gray-900">12 Jan 2024</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-[11px] text-gray-500">Terakhir diubah</p>
                          <p className="text-[11px] font-bold text-gray-900">14 Jul 2026</p>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <p className="text-[11px] text-gray-500">Riwayat Penyewa</p>
                          <button className="text-[11px] font-bold text-[#0D5C36]">Lihat riwayat</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 w-full p-5 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 flex gap-3">
              {kosRoomWizardMode === "edit" && (
                <button onClick={() => setKosRoomWizardStep(0)} className="h-14 px-6 rounded-2xl bg-red-50 text-red-500 font-extrabold text-[14px] flex items-center justify-center shrink-0 active:scale-95 transition-transform">
                  Hapus Kamar
                </button>
              )}
              <button 
                onClick={() => {
                  if (kosRoomWizardStep < 3) setKosRoomWizardStep(prev => prev + 1);
                  else setKosRoomWizardStep(0);
                }} 
                className="h-14 flex-1 rounded-2xl bg-[#0D5C36] text-white font-extrabold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md shadow-[#0D5C36]/30"
              >
                {kosRoomWizardStep < 3 ? "Lanjut" : kosRoomWizardMode === "add" ? "Simpan Kamar" : "Simpan Perubahan"}
                {kosRoomWizardStep < 3 && <ArrowLeft size={18} className="rotate-180" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        dompetBalance={dompetBalance}
        setDompetBalance={setDompetBalance}
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
    if (screen === "d_home") return <DriverHome navigate={navigate} activeMitraRoles={activeMitraRoles} showToast={showToast} />;
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
