import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import Svg, { Rect, Path, Circle, Polygon, G, Text as SvgText } from "react-native-svg";
import {
  MapPin,
  Clock,
  Bike,
  Store,
  MessageSquare,
  Phone,
  CheckCircle,
  X,
  Send,
  Star,
  ChevronRight,
  AlertTriangle,
  Play,
  ArrowLeft,
  Camera,
  Video,
} from "lucide-react-native";
import { BackHeader } from "../../components/BackHeader";
import { Screen, OrderItem } from "../../types";
import { CustomerChatThread } from "./Inbox";
import { rp } from "../../utils/formatters";
import * as ImagePicker from "expo-image-picker";

interface OrderTrackingScreenProps {
  navigate: (s: Screen) => void;
  setCurrentTab: (tab: number) => void;
  selectedOrderId: string | null;
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  chatThreads: CustomerChatThread[];
  setChatThreads: React.Dispatch<React.SetStateAction<CustomerChatThread[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  notifications: any[];
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({
  navigate,
  setCurrentTab,
  selectedOrderId,
  orders,
  setOrders,
  chatThreads,
  setChatThreads,
  setNotifications,
  notifications,
}) => {
  const order = orders.find(o => o.id === selectedOrderId);

  // Delivery Phase state: 0 (Received), 1 (To Store), 2 (At Store), 3 (On Way), 4 (Arrived)
  const [phase, setPhase] = useState(0);

  // GPS coordinates mapping (Store -> Home)
  const homeX = 60, homeY = 150;
  const storeX = 140, storeY = 50;
  const startX = 100, startY = 180;

  // Real-time animated driver coordinates state
  const [driverCoords, setDriverCoords] = useState({ x: startX, y: startY });
  const animationRef = useRef<any>(null);

  // Chat sheet state
  const [chatVisible, setChatVisible] = useState(false);
  const [chatText, setChatText] = useState("");
  const [localMessages, setLocalMessages] = useState<any[]>([
    { id: "1", sender: "driver", text: "Halo kak, pesanan sudah saya terima ya. Sedang disiapkan toko.", time: "Baru saja" }
  ]);
  const [unreadChatCount, setUnreadChatCount] = useState(1);

  // Review states
  const [reviewVisible, setReviewVisible] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [mediaList, setMediaList] = useState<any[]>([]);

  const scrollRef = useRef<ScrollView>(null);

  const phaseDetails = [
    { title: "Pesanan Diterima", desc: "Toko sedang menyiapkan & memasak makanan Anda", icon: "⏱️" },
    { title: "Kurir Menuju Toko", desc: "Rangers Driver sedang menjemput pesanan Anda", icon: "⏱️" },
    { title: "Pesanan Diambil", desc: "Driver telah menerima makanan dari toko dan bersiap berangkat", icon: "⏱️" },
    { title: "Dalam Perjalanan", desc: "Kurir sedang mengantarkan pesanan ke alamat rumah Anda", icon: "⏱️" },
    { title: "Sampai di Lokasi", desc: "Pesanan Anda telah tiba! Selamat menikmati hidangan Anda", icon: "🎉" }
  ];

  const currentPhase = phaseDetails[phase];
  const etaMins = [15, 12, 9, 5, 0][phase];

  // Smooth interpolation motor coordinator
  const animateDriver = (pathPoints: { x: number, y: number }[], duration = 2500) => {
    if (animationRef.current) clearInterval(animationRef.current);

    let currentStep = 0;
    const steps = 50; // Smooth 50 intermediate points
    const intervalTime = duration / steps;

    const getPointAtRatio = (ratio: number) => {
      const segmentCount = pathPoints.length - 1;
      if (segmentCount <= 0) return pathPoints[0];

      const rawIndex = ratio * segmentCount;
      const segmentIndex = Math.min(Math.floor(rawIndex), segmentCount - 1);
      const segmentRatio = rawIndex - segmentIndex;

      const p1 = pathPoints[segmentIndex];
      const p2 = pathPoints[segmentIndex + 1];

      return {
        x: p1.x + (p2.x - p1.x) * segmentRatio,
        y: p1.y + (p2.y - p1.y) * segmentRatio
      };
    };

    animationRef.current = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;
      if (ratio >= 1) {
        setDriverCoords(pathPoints[pathPoints.length - 1]);
        clearInterval(animationRef.current);
      } else {
        setDriverCoords(getPointAtRatio(ratio));
      }
    }, intervalTime);
  };

  // Listen to phase changes and smoothly animate motorcycle along street vector segments
  useEffect(() => {
    if (phase === 0) {
      setDriverCoords({ x: startX, y: startY });
    } else if (phase === 1) {
      animateDriver([
        { x: startX, y: startY },
        { x: 100, y: 50 },
        { x: storeX, y: storeY }
      ]);
    } else if (phase === 2) {
      setDriverCoords({ x: storeX, y: storeY });
    } else if (phase === 3) {
      animateDriver([
        { x: storeX, y: storeY },
        { x: 100, y: 50 },
        { x: 100, y: 150 },
        { x: homeX, y: homeY }
      ]);
    } else if (phase === 4) {
      setDriverCoords({ x: homeX, y: homeY });
    }

    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [phase]);

  // Helper trigger messages
  const triggerDriverMessage = (nextPhase: number) => {
    let msg = "";
    if (nextPhase === 1) msg = "Saya sedang menuju ke toko ya kak.";
    if (nextPhase === 2) msg = "Makanan sudah serah terima, ini saya bersiap jalan ke alamat kakak.";
    if (nextPhase === 3) msg = "Saya sudah dekat di area tujuan kak, mohon ditunggu.";
    if (nextPhase === 4) msg = "Saya sudah di depan lokasi pengiriman ya kak.";

    if (msg) {
      setTimeout(() => {
        setLocalMessages(prev => [
          ...prev,
          { id: Date.now().toString(), sender: "driver", text: msg, time: "Baru saja" }
        ]);
        setUnreadChatCount(c => c + 1);

        // Push global notification
        const newNotif = {
          id: Date.now(),
          type: "message",
          title: "Pesan Baru dari Driver 🏍️",
          msg: msg,
          time: "Baru saja",
          read: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
      }, 1200);
    }
  };

  if (!order) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <BackHeader title="Lacak Order" onBack={() => navigate("c_home")} />
        <View style={styles.errorBody}>
          <AlertTriangle size={48} color="#EF4444" />
          <Text style={styles.errorText}>Pesanan tidak ditemukan.</Text>
          <TouchableOpacity onPress={() => navigate("c_home")} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleFastForward = () => {
    if (phase < 4) {
      const nextPhase = phase + 1;
      setPhase(nextPhase);
      triggerDriverMessage(nextPhase);

      setOrders(prev => prev.map(o => {
        if (o.id === order.id) {
          let newStatus = o.status;
          let newColor = o.statusColor;
          if (nextPhase === 1) { newStatus = "Dikirim"; newColor = "blue"; }
          if (nextPhase === 4) { newStatus = "Selesai"; newColor = "green"; }
          return { ...o, status: newStatus, statusColor: newColor };
        }
        return o;
      }));
    }
  };

  const handleSendMessage = () => {
    if (!chatText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "customer",
      text: chatText,
      time: "Baru saja",
    };

    setLocalMessages(prev => [...prev, userMsg]);
    setChatText("");

    // Simulate auto response from driver after 1.5 seconds
    setTimeout(() => {
      let reply = "Baik kak, siap dimengerti.";
      if (chatText.toLowerCase().includes("alamat") || chatText.toLowerCase().includes("lokasi")) {
        reply = "Ini saya mengikuti maps ya kak. Sebentar lagi sampai.";
      } else if (chatText.toLowerCase().includes("cepat") || chatText.toLowerCase().includes("buru")) {
        reply = "Siap kak, saya berkendara seaman dan secepat mungkin.";
      }

      const driverReply = {
        id: (Date.now() + 1).toString(),
        sender: "driver",
        text: reply,
        time: "Baru saja",
      };

      setLocalMessages(prev => [...prev, driverReply]);
    }, 1500);
  };

  const handleUploadPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin Ditolak", "Maaf, kami membutuhkan izin galeri untuk memilih foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setMediaList(prev => [...prev, { type: "photo", uri: selectedUri }]);
    }
  };

  const handleUploadVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin Ditolak", "Maaf, kami membutuhkan izin galeri untuk memilih video.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setMediaList(prev => [...prev, { type: "video", uri: selectedUri }]);
    }
  };

  const handleDeleteMedia = (index: number) => {
    setMediaList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveReviews = () => {
    // Update order with ratings
    setOrders(prev => prev.map(o =>
      o.id === order.id ? { ...o, isReviewed: true, driverRating: ratingVal, merchantRating: ratingVal } : o
    ));

    // Save notification
    const newNotif = {
      id: Date.now(),
      type: "info",
      title: "Ulasan Terkirim ⭐",
      msg: `Terima kasih atas ulasan Anda untuk pesanan #${order.id}.`,
      time: "Baru saja",
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    setReviewVisible(false);
    Alert.alert("Ulasan Terkirim", "Terima kasih atas ulasan Anda! Kami mengalihkan Anda ke tab Pesanan.", [
      {
        text: "Tutup",
        onPress: () => {
          setCurrentTab(2); // Redirect to Pesanan Tab
          navigate("c_home"); // Ensure currentScreen returns to c_home
        }
      }
    ]);
  };

  const handleSkipReview = () => {
    setReviewVisible(false);
    setCurrentTab(2); // Redirect to Pesanan Tab
    navigate("c_home"); // Ensure currentScreen returns to c_home
  };

  const subtotalPrice = order.items ? order.items.reduce((sum, item) => sum + item.price * item.qty, 0) : (order.total - 8000);
  const deliveryFee = order.deliveryFee || 8000;
  const tipAmount = order.serviceFee || 0; // Tip stored in serviceFee
  const discountAmount = order.discount || 0;

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title={`Lacak Order: #${order.id}`} onBack={() => navigate("c_home")} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PREMIUM REALISTIC VECTOR MAP */}
        <View style={styles.mapContainer}>
          <Svg viewBox="0 0 200 200" style={styles.mapSvg}>
            {/* Base land */}
            <Rect x="0" y="0" width="200" height="200" fill="#F1F5F9" />

            {/* Structured Building Grids */}
            <Rect x="10" y="10" width="80" height="40" fill="#E2E8F0" rx="4" />
            <Rect x="110" y="10" width="80" height="30" fill="#E2E8F0" rx="4" />
            <Rect x="10" y="65" width="80" height="70" fill="#E2E8F0" rx="4" />
            <Rect x="110" y="65" width="80" height="70" fill="#E2E8F0" rx="4" />
            <Rect x="10" y="150" width="40" height="40" fill="#E2E8F0" rx="4" />
            <Rect x="110" y="150" width="80" height="40" fill="#E2E8F0" rx="4" />
            
            {/* Green Forest Area */}
            <Rect x="60" y="150" width="40" height="40" fill="#D1FAE5" rx="4" />

            {/* River */}
            <Path d="M 0,105 Q 60,110 110,95 T 200,115" stroke="#BAE6FD" strokeWidth="6" fill="none" />

            {/* Main Roads */}
            <Path d="M 100,0 L 100,200" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
            <Path d="M 100,50 L 150,50" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
            <Path d="M 100,150 L 50,150" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />
            <Path d="M 100,180 L 50,150" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" />

            {/* Mini Map labels */}
            <SvgText x="102" y="25" fontSize="4.5" fontWeight="bold" fill="#94A3B8" transform="rotate(90, 102, 25)">Jl. Raya Kamojang</SvgText>
            <SvgText x="120" y="47" fontSize="4" fontWeight="bold" fill="#94A3B8">Jl. Aster</SvgText>
            <SvgText x="60" y="147" fontSize="4" fontWeight="bold" fill="#94A3B8">Jl. PGE Utama</SvgText>

            {/* Highlighted active route path line */}
            <Path
              d="M 140,50 L 100,50 L 100,150 L 60,150"
              stroke="#3B82F6"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />

            {/* Merchant location pin (Realistic 🏪 badge) */}
            <G transform={`translate(${storeX - 9}, ${storeY - 16})`}>
              <Circle cx="9" cy="9" r="9" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.2" />
              <SvgText x="9" y="12" fontSize="9" textAnchor="middle">🏪</SvgText>
            </G>
            <G transform={`translate(${storeX}, ${storeY - 24})`}>
              <Rect x="-24" y="-6" width="48" height="12" fill="#FFFFFF" rx="2" stroke="#EF4444" strokeWidth="0.8" />
              <SvgText x="0" y="2.5" fontSize="5" fontWeight="bold" fill="#1E293B" textAnchor="middle">Toko</SvgText>
            </G>

            {/* Home location pin (Realistic 🏠 badge) */}
            <G transform={`translate(${homeX - 9}, ${homeY - 16})`}>
              <Circle cx="9" cy="9" r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.2" />
              <SvgText x="9" y="12" fontSize="9" textAnchor="middle">🏠</SvgText>
            </G>
            <G transform={`translate(${homeX}, ${homeY + 14})`}>
              <Rect x="-26" y="-6" width="52" height="12" fill="#FFFFFF" rx="2" stroke="#2563EB" strokeWidth="0.8" />
              <SvgText x="0" y="2.5" fontSize="5" fontWeight="bold" fill="#1E293B" textAnchor="middle">Rumah Anda</SvgText>
            </G>

            {/* Animated Motorcycle Driver Icon (🏍️) */}
            {phase < 4 && (
              <G transform={`translate(${driverCoords.x - 10}, ${driverCoords.y - 10})`}>
                <Circle cx="10" cy="10" r="10" fill="#1B7A4E" opacity="0.25" />
                <Circle cx="10" cy="10" r="8" fill="#1B7A4E" stroke="#FFFFFF" strokeWidth="1.2" />
                <SvgText x="10" y="13.2" fontSize="9" textAnchor="middle">🏍️</SvgText>
              </G>
            )}
          </Svg>

          {/* Floating Progress Bar at bottom of map */}
          <View style={styles.floatingProgressCard}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>Progress Pengiriman</Text>
              <Text style={styles.progressPercentage}>{phase * 25}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${(phase / 4) * 100}%` }]} />
            </View>
          </View>
        </View>

        {/* ELEGANT ETA BANNER CARD */}
        <View style={styles.etaBanner}>
          <View style={styles.etaLeftCol}>
            <Text style={styles.etaLabelText}>Estimasi Waktu Tiba</Text>
            <Text style={styles.etaTimeText}>
              {phase === 4 ? "Pesanan Tiba!" : `Tiba dalam ${etaMins} - ${etaMins + 5} menit`}
            </Text>
            <Text style={styles.etaStatusText}>
              {currentPhase.title} · {currentPhase.desc}
            </Text>
          </View>
          <View style={styles.etaRightCol}>
            <Text style={styles.etaRightColEmoji}>{currentPhase.icon}</Text>
          </View>
        </View>

        {/* ALAMAT PENGIRIMAN */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Alamat Pengiriman</Text>
          <Text style={styles.addressText}>
            {order.address?.fullAddress || "Jl. Aster No. 7, Kamojang, Kab. Garut (Kos Putri Melati)"}
          </Text>
          {order.notes ? (
            <View style={styles.driverNoteCard}>
              <Text style={styles.driverNoteLabel}>Catatan Driver</Text>
              <Text style={styles.driverNoteText}>"{order.notes}"</Text>
            </View>
          ) : null}
        </View>

        {/* COURIER INFO CARD */}
        <View style={styles.sectionCardRow}>
          <View style={styles.courierLeft}>
            <View style={styles.courierAvatarBg}>
              <Bike size={20} color="#1B7A4E" />
            </View>
            <View style={styles.courierTextCol}>
              <Text style={styles.courierName}>Pak Rahman (Rangers Driver)</Text>
              <View style={styles.courierPlateRow}>
                <Text style={styles.courierPlate}>Supra H 4251 AA</Text>
                {tipAmount > 0 ? (
                  <View style={styles.tipBadge}>
                    <Text style={styles.tipBadgeText}>Tip {rp(tipAmount)}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          {/* Action buttons (Chat & Call) */}
          <View style={styles.courierActions}>
            <TouchableOpacity
              onPress={() => {
                setUnreadChatCount(0);
                setChatVisible(true);
              }}
              style={styles.actionBtnCircle}
            >
              <MessageSquare size={16} color="#1B7A4E" />
              {unreadChatCount > 0 && (
                <View style={styles.unreadCountBadge}>
                  <Text style={styles.unreadCountBadgeText}>{unreadChatCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnCircle}>
              <Phone size={16} color="#1B7A4E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* VERTICAL TIMELINE MILESTONES */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Status Pengiriman</Text>
          <View style={styles.timelineContainer}>
            {phaseDetails.map((p, idx) => {
              const isCompleted = idx < phase;
              const isActive = idx === phase;
              return (
                <View key={idx} style={styles.timelineRow}>
                  <View style={styles.timelineLeftCol}>
                    <View style={[
                      styles.timelineDot,
                      isCompleted && styles.timelineDotCompleted,
                      isActive && styles.timelineDotActive
                    ]}>
                      {isCompleted && <CheckCircle size={10} color="#FFFFFF" />}
                      {isActive && <View style={styles.timelineDotInnerActive} />}
                    </View>
                    {idx < phaseDetails.length - 1 && (
                      <View style={[
                        styles.timelineLine,
                        isCompleted && styles.timelineLineCompleted
                      ]} />
                    )}
                  </View>
                  <View style={styles.timelineRightColBody}>
                    <Text style={[
                      styles.timelineStepTitle,
                      isActive && styles.timelineStepTitleActive,
                      isCompleted && styles.timelineStepTitleCompleted
                    ]}>
                      {p.title}
                    </Text>
                    <Text style={styles.timelineStepDesc}>{p.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* DETAILED RECEIPT / RINCIAN PEMBAYARAN */}
        {phase === 4 ? (
          /* Gojek-style Paper Invoice Receipt (When Completed) */
          <View style={styles.paperReceiptCard}>
            <View style={styles.paperReceiptHeader}>
              <View style={styles.statusBadgeGreen}>
                <Text style={styles.statusBadgeGreenText}>LUNAS / COMPLETED</Text>
              </View>
              <Text style={styles.receiptTitle}>Rangers App Receipt</Text>
              <Text style={styles.receiptSubtitle}>
                Order ID: #{order.id} · {order.date || "Hari Ini"}
              </Text>
            </View>

            <View style={styles.paperReceiptBody}>
              <Text style={styles.receiptSectionHeader}>Rincian Item</Text>
              {order.items && order.items.length > 0 ? (
                order.items.map(item => (
                  <View key={item.id} style={styles.receiptItemRow}>
                    <Text style={styles.receiptItemText} numberOfLines={1}>
                      {item.qty}x {item.name}
                    </Text>
                    <Text style={styles.receiptItemValue}>{rp(item.price * item.qty)}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.receiptItemRow}>
                  <Text style={styles.receiptItemText}>{order.item}</Text>
                  <Text style={styles.receiptItemValue}>{rp(subtotalPrice)}</Text>
                </View>
              )}

              <View style={styles.receiptDividerDashed} />

              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptDetailLabel}>Subtotal Belanja</Text>
                <Text style={styles.receiptDetailValue}>{rp(subtotalPrice)}</Text>
              </View>
              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptDetailLabel}>Ongkos Kirim</Text>
                <Text style={styles.receiptDetailValue}>{rp(deliveryFee)}</Text>
              </View>
              {discountAmount > 0 && (
                <View style={styles.receiptDetailRow}>
                  <Text style={styles.receiptDetailLabelPromo}>Diskon Promo</Text>
                  <Text style={styles.receiptDetailValuePromo}>-{rp(discountAmount)}</Text>
                </View>
              )}
              {tipAmount > 0 && (
                <View style={styles.receiptDetailRow}>
                  <Text style={styles.receiptDetailLabel}>Apresiasi Tip Kurir</Text>
                  <Text style={styles.receiptDetailValue}>+{rp(tipAmount)}</Text>
                </View>
              )}

              <View style={styles.receiptDividerDashed} />

              <View style={styles.receiptDetailRow}>
                <Text style={styles.receiptDetailLabelBold}>Metode Pembayaran</Text>
                <Text style={styles.receiptDetailValueBold}>{order.paymentMethod || "Dompet Rangers"}</Text>
              </View>
              <View style={styles.receiptTotalRow}>
                <Text style={styles.receiptTotalLabel}>Total Pembayaran</Text>
                <Text style={styles.receiptTotalValue}>{rp(order.total)}</Text>
              </View>
            </View>

            <View style={styles.paperReceiptFooter}>
              <Text style={styles.receiptFooterText1}>Terima kasih telah berbelanja! 🌿</Text>
              <Text style={styles.receiptFooterText2}>Rangers App PGE Kamojang Community Care</Text>
            </View>
          </View>
        ) : (
          /* Normal Payment Detail Breakdown (While In Progress) */
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderTitle}>Rincian Pembayaran Akhir</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal Belanja</Text>
              <Text style={styles.priceValue}>{rp(subtotalPrice)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Ongkir Kurir</Text>
              <Text style={styles.priceValue}>{rp(deliveryFee)}</Text>
            </View>
            {discountAmount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabelPromo}>Promo Voucher</Text>
                <Text style={styles.priceValuePromo}>-{rp(discountAmount)}</Text>
              </View>
            )}
            {tipAmount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Tip Driver</Text>
                <Text style={styles.priceValue}>+{rp(tipAmount)}</Text>
              </View>
            )}
            <View style={styles.lineDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalMethodLabel}>Metode Pembayaran</Text>
              <Text style={styles.totalMethodValue}>{order.paymentMethod || "Dompet Rangers"}</Text>
            </View>
            {order.remainingAmount && order.remainingAmount > 0 && (
              <>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Sudah Dibayar</Text>
                  <Text style={styles.priceValue}>{rp(order.paidAmount || 0)}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Sisa Pelunasan</Text>
                  <Text style={styles.priceValueAccent}>{rp(order.remainingAmount)}</Text>
                </View>
              </>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{order.remainingAmount ? "Total Pesanan" : "Total Dibayar"}</Text>
              <Text style={styles.totalValue}>{rp(order.total)}</Text>
            </View>
            {order.remainingAmount && order.remainingAmount > 0 && (
              <View style={styles.settlementReminderCard}>
                <AlertTriangle size={16} color="#B45309" />
                <View style={styles.settlementReminderCopy}>
                  <Text style={styles.settlementReminderTitle}>Pelunasan belum selesai</Text>
                  <Text style={styles.settlementReminderText}>
                    {order.paymentReminder || `Sisa ${rp(order.remainingAmount)} perlu dilunasi sebelum pengiriman.`}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <View style={styles.bottomActions}>
          {phase === 4 ? (
            <TouchableOpacity
              onPress={() => setReviewVisible(true)}
              style={styles.reviewBtn}
            >
              <Text style={styles.reviewBtnText}>⭐ Beri Review & Rating</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.btnRow}>
              <TouchableOpacity
                onPress={handleFastForward}
                style={styles.fastForwardBtn}
              >
                <Play size={10} color="#111827" fill="#111827" />
                <Text style={styles.fastForwardBtnText}>Percepat Pengiriman</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigate("c_home")}
                style={styles.outlineBtn}
              >
                <Text style={styles.outlineBtnText}>Pantau Nanti</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* CHAT WITH DRIVER MODAL DRAW */}
      <Modal visible={chatVisible} transparent animationType="slide">
        <View style={styles.modalBgBottom}>
          <View style={styles.chatSheetContainer}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Chat dengan Driver</Text>
                <Text style={styles.sheetSubtitle}>Pak Rahman · Supra H 4251 AA</Text>
              </View>
              <TouchableOpacity onPress={() => setChatVisible(false)}>
                <X size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollRef}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
              contentContainerStyle={styles.chatMessagesScroll}
              showsVerticalScrollIndicator={false}
            >
              {localMessages.map((msg, idx) => {
                const isMe = msg.sender === "customer";
                return (
                  <View
                    key={msg.id || idx}
                    style={[styles.bubbleContainer, isMe ? styles.bubbleRight : styles.bubbleLeft]}
                  >
                    <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                      <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextOther]}>
                        {msg.text}
                      </Text>
                    </View>
                    <Text style={styles.bubbleTime}>{msg.time}</Text>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                value={chatText}
                onChangeText={setChatText}
                placeholder="Tulis pesan..."
                placeholderTextColor="#9CA3AF"
                style={styles.chatTextInput}
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendBtn}>
                <Send size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* REVIEW & RATING MODAL POPUP */}
      <Modal visible={reviewVisible} transparent animationType="slide">
        <View style={styles.modalBgBottom}>
          <View style={[styles.sheetContainer, { height: "90%" }]}>
            
            {/* Header: Review & Rating / Lewati */}
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={handleSkipReview}>
                <ArrowLeft size={20} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Review & Rating</Text>
              <TouchableOpacity onPress={handleSkipReview}>
                <Text style={styles.skipBtnText}>Lewati</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              
              {/* Star Circle Badge */}
              <View style={styles.starCircleContainer}>
                <View style={styles.starCircleBg}>
                  <Star size={36} color="#FBBF24" fill="#FBBF24" />
                </View>
              </View>

              {/* Title & Subtitle */}
              <Text style={styles.ratingMainTitle}>Bagaimana hidangan & layanan Anda?</Text>
              <Text style={styles.ratingSubTitle}>
                Berikan masukan Anda untuk membantu Toko dan Driver meningkatkan kualitas pelayanan mereka
              </Text>

              {/* Large Stars Rating Row */}
              <View style={styles.starsRowCentered}>
                {[1, 2, 3, 4, 5].map(val => (
                  <TouchableOpacity key={val} onPress={() => setRatingVal(val)}>
                    <Star
                      size={36}
                      color={val <= ratingVal ? "#FBBF24" : "#E5E7EB"}
                      fill={val <= ratingVal ? "#FBBF24" : "transparent"}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Text Input */}
              <Text style={styles.formLabel}>Tulis Ulasan Anda</Text>
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Bagikan pengalaman Anda tentang rasa makanan, kemasan, atau keramahan kurir..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={styles.reviewTextArea}
              />

              {/* Upload Photo & Video */}
              <Text style={styles.formLabel}>Unggah Foto & Video</Text>
              <View style={styles.uploadButtonsRow}>
                <TouchableOpacity onPress={handleUploadPhoto} style={styles.uploadBtn}>
                  <Camera size={18} color="#1B7A4E" />
                  <Text style={styles.uploadBtnText}>Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleUploadVideo} style={styles.uploadBtn}>
                  <Video size={18} color="#1B7A4E" />
                  <Text style={styles.uploadBtnText}>Video</Text>
                </TouchableOpacity>
              </View>

              {mediaList.length > 0 && (
                <View style={styles.mediaContainerWrapper}>
                  <ScrollView horizontal style={styles.mediaPreviewsRow} showsHorizontalScrollIndicator={false}>
                    {mediaList.map((item, idx) => (
                      <View key={idx} style={styles.mediaThumbnailContainer}>
                        <Image source={{ uri: item.uri }} style={styles.mediaThumbnail} />
                        {item.type === "video" && (
                          <View style={styles.playIconOverlay}>
                            <Play size={10} color="#FFFFFF" fill="#FFFFFF" />
                          </View>
                        )}
                        <TouchableOpacity
                          onPress={() => handleDeleteMedia(idx)}
                          style={styles.deleteMediaBtn}
                        >
                          <X size={8} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Kirim Button */}
              <TouchableOpacity
                onPress={handleSaveReviews}
                style={styles.submitReviewBtn}
              >
                <Text style={styles.submitReviewBtnText}>Kirim Ulasan</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 64,
    gap: 12,
  },
  mapContainer: {
    height: 220,
    backgroundColor: "#F1F5F9",
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  mapSvg: {
    width: "100%",
    height: "100%",
  },
  floatingProgressCard: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  progressPercentage: {
    fontSize: 10,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  progressBarTrack: {
    width: "100%",
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#1B7A4E",
    borderRadius: 3,
  },
  etaBanner: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    borderLeftColor: "#1B7A4E",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  etaLeftCol: {
    flex: 1,
    gap: 2,
  },
  etaLabelText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  etaTimeText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1E293B",
  },
  etaStatusText: {
    fontSize: 10,
    color: "#1B7A4E",
    fontWeight: "700",
  },
  etaRightCol: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  etaRightColEmoji: {
    fontSize: 16,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionCardRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeaderTitle: {
    fontSize: 9,
    fontWeight: "900",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
    lineHeight: 16,
  },
  driverNoteCard: {
    marginTop: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  driverNoteLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  driverNoteText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1E293B",
    fontStyle: "italic",
  },
  courierLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  courierAvatarBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(27,122,78,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  courierTextCol: {
    flex: 1,
    gap: 2,
  },
  courierName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },
  courierPlateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  courierPlate: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
  },
  tipBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  tipBadgeText: {
    color: "#065F46",
    fontSize: 8,
    fontWeight: "900",
  },
  courierActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtnCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(27,122,78,0.1)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unreadCountBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  unreadCountBadgeText: {
    color: "#FFFFFF",
    fontSize: 7,
    fontWeight: "900",
  },
  paperReceiptCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  paperReceiptHeader: {
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderStyle: "dashed",
    gap: 4,
  },
  statusBadgeGreen: {
    backgroundColor: "#D1FAE5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusBadgeGreenText: {
    color: "#065F46",
    fontSize: 8,
    fontWeight: "900",
  },
  receiptTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1E293B",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  receiptSubtitle: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "600",
  },
  paperReceiptBody: {
    paddingVertical: 12,
  },
  receiptSectionHeader: {
    fontSize: 9,
    fontWeight: "900",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  receiptItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  receiptItemText: {
    fontSize: 11,
    color: "#1E293B",
    fontWeight: "600",
    flex: 1,
  },
  receiptItemValue: {
    fontSize: 11,
    color: "#1E293B",
    fontWeight: "600",
  },
  receiptDividerDashed: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderStyle: "dashed",
    marginVertical: 8,
  },
  receiptDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  receiptDetailLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  receiptDetailValue: {
    fontSize: 11,
    color: "#1E293B",
    fontWeight: "600",
  },
  receiptDetailLabelPromo: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "600",
  },
  receiptDetailValuePromo: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "700",
  },
  receiptDetailLabelBold: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E293B",
  },
  receiptDetailValueBold: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1B7A4E",
  },
  receiptTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  receiptTotalLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#1E293B",
  },
  receiptTotalValue: {
    fontSize: 13,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  paperReceiptFooter: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    borderStyle: "dashed",
    paddingTop: 10,
    gap: 2,
  },
  receiptFooterText1: {
    fontSize: 9,
    fontWeight: "800",
    color: "#6B7280",
  },
  receiptFooterText2: {
    fontSize: 8,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  priceLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1E293B",
  },
  priceValueAccent: {
    fontSize: 11,
    fontWeight: "800",
    color: "#B45309",
  },
  priceLabelPromo: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "600",
  },
  priceValuePromo: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "800",
  },
  lineDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },
  totalMethodLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E293B",
  },
  totalMethodValue: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1B7A4E",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1E293B",
  },
  totalValue: {
    fontSize: 13,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  settlementReminderCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 14,
    padding: 10,
    marginTop: 10,
    gap: 8,
  },
  settlementReminderCopy: {
    flex: 1,
  },
  settlementReminderTitle: {
    color: "#92400E",
    fontSize: 10,
    fontWeight: "900",
  },
  settlementReminderText: {
    color: "#A16207",
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "600",
    marginTop: 3,
  },
  bottomActions: {
    marginTop: 8,
  },
  reviewBtn: {
    width: "100%",
    height: 48,
    backgroundColor: "#1B7A4E",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1B7A4E",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  reviewBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  btnRow: {
    flexDirection: "row",
    gap: 8,
  },
  fastForwardBtn: {
    flex: 1,
    height: 40,
    backgroundColor: "#FBBF24",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  fastForwardBtnText: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "800",
  },
  outlineBtn: {
    flex: 1,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "800",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  errorBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
  },
  backBtn: {
    backgroundColor: "#1B7A4E",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  modalBgBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    maxHeight: "85%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  sheetSubtitle: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 1,
  },
  formScroll: {
    maxHeight: 520,
  },
  ratingSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1B7A4E",
    marginTop: 14,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
    marginTop: 14,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    fontSize: 12,
    color: "#111827",
    marginBottom: 12,
  },
  formInputArea: {
    height: 72,
    textAlignVertical: "top",
    paddingVertical: 10,
  },
  submitReviewBtn: {
    backgroundColor: "#1B7A4E",
    borderRadius: 14,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    marginBottom: 12,
  },
  submitReviewBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  // Chat styles
  chatSheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    height: "80%",
  },
  chatMessagesScroll: {
    paddingVertical: 12,
    gap: 10,
  },
  bubbleContainer: {
    maxWidth: "80%",
    marginBottom: 4,
  },
  bubbleLeft: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  bubbleRight: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleMe: {
    backgroundColor: "#1B7A4E",
    borderBottomRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: "#F3F4F6",
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 12,
    lineHeight: 16,
  },
  bubbleTextMe: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  bubbleTextOther: {
    color: "#1E293B",
    fontWeight: "500",
  },
  bubbleTime: {
    fontSize: 8,
    color: "#9CA3AF",
    marginTop: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 36,
    fontSize: 12,
    color: "#111827",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1B7A4E",
    alignItems: "center",
    justifyContent: "center",
  },
  // Review visual matching screenshot styles
  skipBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  starCircleContainer: {
    alignItems: "center",
    marginVertical: 18,
  },
  starCircleBg: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(27, 122, 78, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  ratingMainTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1E293B",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 16,
  },
  ratingSubTitle: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 14,
    paddingHorizontal: 24,
    marginTop: 6,
  },
  starsRowCentered: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 20,
  },
  reviewTextArea: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    fontSize: 12,
    color: "#1E293B",
    height: 96,
    textAlignVertical: "top",
    marginTop: 4,
  },
  uploadButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  uploadBtn: {
    flex: 1,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1B7A4E",
  },
  mediaContainerWrapper: {
    marginTop: 10,
  },
  mediaPreviewsRow: {
    flexDirection: "row",
  },
  mediaThumbnailContainer: {
    position: "relative",
    marginRight: 10,
  },
  mediaThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  playIconOverlay: {
    position: "absolute",
    top: 22,
    left: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteMediaBtn: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  // Timeline styles
  timelineContainer: {
    gap: 0,
    marginTop: 6,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  timelineLeftCol: {
    alignItems: "center",
    width: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E2E8F0",
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineDotActive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2.5,
    borderColor: "#1B7A4E",
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineDotInnerActive: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1B7A4E",
  },
  timelineDotCompleted: {
    backgroundColor: "#1B7A4E",
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 1.5,
    height: 32,
    backgroundColor: "#E2E8F0",
  },
  timelineLineCompleted: {
    backgroundColor: "#1B7A4E",
  },
  timelineRightColBody: {
    flex: 1,
    paddingBottom: 12,
  },
  timelineStepTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
  timelineStepTitleActive: {
    color: "#1E293B",
    fontWeight: "800",
  },
  timelineStepTitleCompleted: {
    color: "#1B7A4E",
    fontWeight: "700",
  },
  timelineStepDesc: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 13,
  },
});
