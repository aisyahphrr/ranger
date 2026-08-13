import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from "react-native";
import {
  ShoppingBag,
  Store,
  Coffee,
  Wind,
  Building,
  Truck,
  Star,
  MapPin,
  Clock,
  X,
  Navigation,
  AlertCircle,
} from "lucide-react-native";
import { Screen, OrderItem } from "../../types";
import { rp } from "../../utils/formatters";

const MOCK_PHOTOS = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=300&auto=format&fit=crop",
];

interface PesananProps {
  orders: OrderItem[];
  setOrders: (orders: OrderItem[]) => void;
  reviews: any[];
  setReviews: (reviews: any[]) => void;
  navigate: (s: Screen) => void;
  setSelectedOrderId: (id: string | null) => void;
}

export const Pesanan: React.FC<PesananProps> = ({
  orders,
  setOrders,
  reviews,
  setReviews,
  navigate,
  setSelectedOrderId,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [trackModalVisible, setTrackModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewPhoto, setReviewPhoto] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // Review states
  const [ratingVal, setRatingVal] = useState(5);
  const [commentText, setCommentText] = useState("");

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 0: // Aktif
        return orders.filter(
          (o) => o.status !== "Selesai" && !o.status.toLowerCase().includes("batal")
        );
      case 1: // Selesai
        return orders.filter((o) => o.status === "Selesai");
      case 2: // Dibatalkan
        return orders.filter((o) => o.status.toLowerCase().includes("batal"));
      default:
        return orders;
    }
  };

  const getServiceIcon = (type: string) => {
    const normalized = type.toLowerCase();
    if (normalized.includes("market")) {
      return { icon: Store, fg: "#1B7A4E", bg: "#E8F5EE" };
    } else if (normalized.includes("cater")) {
      return { icon: Coffee, fg: "#EA580C", bg: "#FFEDD5" };
    } else if (normalized.includes("laund")) {
      return { icon: Wind, fg: "#0284C7", bg: "#E0F2FE" };
    } else if (normalized.includes("kos")) {
      return { icon: Building, fg: "#9333EA", bg: "#F3E8FF" };
    } else {
      return { icon: Truck, fg: "#D97706", bg: "#FEF3C7" };
    }
  };

  const getStatusColors = (status: string) => {
    const s = status.toLowerCase();
    if (s === "dikirim" || s === "pesanan diambil" || s.includes("menuju")) {
      return { fg: "#2563EB", bg: "#EFF6FF" };
    } else if (s.includes("batal")) {
      return { fg: "#B91C1C", bg: "#FEE2E2" };
    } else if (s === "selesai" || s === "aktif") {
      return { fg: "#1B7A4E", bg: "#E8F5EE" };
    }
    return { fg: "#D97706", bg: "#FEF3C7" };
  };

  const handleOpenReview = (order: OrderItem) => {
    setSelectedOrder(order);
    setRatingVal(5);
    setCommentText("");
    setReviewPhoto(null);
    setReviewModalVisible(true);
  };

  const handleSaveReview = () => {
    if (!selectedOrder) return;

    const newReview = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      orderId: selectedOrder.id,
      productName: selectedOrder.item,
      rating: ratingVal,
      comment: commentText.trim(),
      photo: reviewPhoto,
    };

    setReviews([newReview, ...reviews]);
    setReviewModalVisible(false);
    Alert.alert("Terima Kasih", "Ulasan Anda berhasil disimpan.");
  };

  const handleOpenTracking = (order: OrderItem) => {
    setSelectedOrder(order);
    setTrackModalVisible(true);
  };

  const currentList = getFilteredOrders();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header title */}
      <View style={styles.header}>
        <Text style={styles.title}>Pesanan Saya</Text>
      </View>

      {/* Tabs selectors row */}
      <View style={styles.tabsRow}>
        {["Aktif", "Selesai", "Dibatalkan"].map((tabLabel, idx) => {
          const active = activeTab === idx;
          const count = 
            idx === 0 ? orders.filter((o) => o.status !== "Selesai" && !o.status.toLowerCase().includes("batal")).length :
            idx === 1 ? orders.filter((o) => o.status === "Selesai").length :
            orders.filter((o) => o.status.toLowerCase().includes("batal")).length;

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => setActiveTab(idx)}
            >
              <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
                {tabLabel} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* FlatList of orders */}
      <FlatList
        data={currentList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const config = getServiceIcon(item.type);
          const IconComp = config.icon;
          const statusStyle = getStatusColors(item.status);
          const isCompleted = item.status === "Selesai";
          const hasReviewed = reviews.some((r) => r.orderId === item.id);

          return (
            <View style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.serviceIconBg, { backgroundColor: config.bg }]}>
                  <IconComp size={20} color={config.fg} />
                </View>

                <View style={styles.cardHeaderBody}>
                  <Text style={styles.orderTitle} numberOfLines={1}>
                    #{item.id} · {item.type}
                  </Text>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.item}
                  </Text>
                  <Text style={styles.itemDetail} numberOfLines={1}>
                    {item.detail}
                  </Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: statusStyle.fg }]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {item.paymentStatus === "Menunggu Pelunasan" && (
                <View style={styles.paymentReminderCard}>
                  <AlertCircle size={17} color="#B45309" />
                  <View style={styles.paymentReminderCopy}>
                    <View style={styles.paymentReminderTitleRow}>
                      <Text style={styles.paymentReminderTitle}>Pengingat pelunasan</Text>
                      <View style={styles.dpPill}>
                        <Text style={styles.dpPillText}>DP</Text>
                      </View>
                    </View>
                    <Text style={styles.paymentReminderText}>
                      {item.paymentReminder || `Sisa pembayaran ${rp(item.remainingAmount || 0)} belum dilunasi.`}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.cardFooter}>
                <View style={styles.dateCol}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.totalValue}>{rp(item.total)}</Text>
                </View>

                <View style={styles.actionBtnRow}>
                  {isCompleted && !hasReviewed && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnOutline]}
                      onPress={() => handleOpenReview(item)}
                    >
                      <Text style={styles.actionBtnTextOutline}>Ulasan</Text>
                    </TouchableOpacity>
                  )}

                  {!item.status.toLowerCase().includes("batal") && (
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnSolid]}
                      onPress={() => {
                        setSelectedOrderId(item.id);
                        navigate("c_tracking");
                      }}
                    >
                      <Text style={styles.actionBtnTextSolid}>Lacak</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ShoppingBag size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>
              {activeTab === 0 ? "Belum ada pesanan aktif" : activeTab === 1 ? "Belum ada pesanan selesai" : "Belum ada pesanan dibatalkan"}
            </Text>
            <Text style={styles.emptySubtitle}>
              Semua orderan dari layanan yang Anda pesan akan terpantau statusnya di halaman ini.
            </Text>
          </View>
        }
      />

      {/* 1. Modal Lacak Order */}
      {selectedOrder && (
        <Modal visible={trackModalVisible} transparent animationType="slide">
          <View style={styles.modalBgBottom}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Lacak Kiriman #{selectedOrder.id}</Text>
                <TouchableOpacity onPress={() => setTrackModalVisible(false)}>
                  <X size={20} color="#111827" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
                {/* Simulated Peta Peta */}
                <View style={styles.mapSimulation}>
                  <Navigation size={24} color="#1B7A4E" style={styles.movingMarker} />
                  <MapPin size={18} color="#EF4444" style={styles.destMarker} />
                  <Text style={styles.mapPlaceholderText}>[ PETA PELACAKAN KURIR RANGERS ]</Text>
                  <Text style={styles.mapSubtext}>Kurir: Pak Asep (Motor · D 4521 ABC)</Text>
                </View>

                {/* Timeline status list */}
                <Text style={styles.detailSecTitle}>Status Pengiriman</Text>
                <View style={styles.timelineCard}>
                  <View style={styles.timelineRow}>
                    <View style={[styles.timelineDot, styles.timelineDotActive]} />
                    <View style={styles.timelineBody}>
                      <Text style={styles.timelineTitle}>Pesanan Sampai Tujuan</Text>
                      <Text style={styles.timelineDesc}>Rangers kurir sedang berada di depan pagar rumah.</Text>
                    </View>
                  </View>
                  
                  <View style={styles.timelineLine} />

                  <View style={styles.timelineRow}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineBody}>
                      <Text style={styles.timelineTitle}>Sedang Diantar</Text>
                      <Text style={styles.timelineDesc}>Pesanan sedang dibawa menuju lokasi Anda.</Text>
                    </View>
                  </View>

                  <View style={styles.timelineLine} />

                  <View style={styles.timelineRow}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineBody}>
                      <Text style={styles.timelineTitle}>Driver Menjemput</Text>
                      <Text style={styles.timelineDesc}>Pak Asep mengambil pesanan di merchant partner.</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.sheetBtnClose}
                  onPress={() => setTrackModalVisible(false)}
                >
                  <Text style={styles.sheetBtnCloseText}>Tutup</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* 2. Modal Rating & Ulasan */}
      {selectedOrder && (
        <Modal visible={reviewModalVisible} transparent animationType="slide">
          <View style={styles.modalBgBottom}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Beri Ulasan Pesanan</Text>
                <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                  <X size={20} color="#111827" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.reviewLabel}>Pesanan Anda:</Text>
                <Text style={styles.reviewItemName}>{selectedOrder.item}</Text>

                {/* Rating stars picker row */}
                <Text style={styles.inputLabel}>Pilih Bintang Rating</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRatingVal(star)}
                    >
                      <Star
                        size={32}
                        color={star <= ratingVal ? "#D97706" : "#D1D5DB"}
                        fill={star <= ratingVal ? "#D97706" : "none"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Tulis Komentar / Masukan</Text>
                <TextInput
                  style={styles.textAreaInput}
                  multiline
                  numberOfLines={3}
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Ceritakan pengalaman Anda berbelanja..."
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.inputLabel}>Tambahkan Foto Ulasan (Opsional)</Text>
                <View style={styles.photoPickerRow}>
                  {MOCK_PHOTOS.map((uri, index) => {
                    const selected = reviewPhoto === uri;
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.photoOption, selected && styles.photoOptionSelected]}
                        onPress={() => setReviewPhoto(selected ? null : uri)}
                        activeOpacity={0.7}
                      >
                        <Image source={{ uri }} style={styles.photoOptionImg} />
                        {selected && (
                          <View style={styles.photoSelectedCheck}>
                            <Text style={styles.checkText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.sheetActions}>
                  <TouchableOpacity 
                    style={[styles.sheetBtn, styles.sheetBtnOutline]}
                    onPress={() => setReviewModalVisible(false)}
                  >
                    <Text style={styles.sheetBtnTextOutline}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.sheetBtn, styles.sheetBtnSolid]}
                    onPress={handleSaveReview}
                  >
                    <Text style={styles.sheetBtnTextSolid}>Kirim Ulasan</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: {
    borderBottomColor: "#1B7A4E",
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabBtnTextActive: {
    color: "#1B7A4E",
    fontWeight: "800",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 12,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    elevation: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  serviceIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardHeaderBody: {
    flex: 1,
    gap: 2,
  },
  orderTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6B7280",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  itemDetail: {
    fontSize: 11,
    color: "#6B7280",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  paymentReminderCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  paymentReminderCopy: {
    flex: 1,
  },
  paymentReminderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  paymentReminderTitle: {
    color: "#92400E",
    fontSize: 10,
    fontWeight: "900",
  },
  dpPill: {
    backgroundColor: "#F59E0B",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dpPillText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
  },
  paymentReminderText: {
    color: "#A16207",
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dateCol: {
    gap: 2,
  },
  dateText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },
  actionBtnRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnOutline: {
    borderWidth: 1,
    borderColor: "#1B7A4E",
    backgroundColor: "#FFFFFF",
  },
  actionBtnSolid: {
    backgroundColor: "#1B7A4E",
  },
  actionBtnTextOutline: {
    color: "#1B7A4E",
    fontSize: 11,
    fontWeight: "800",
  },
  actionBtnTextSolid: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 72,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  emptySubtitle: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 36,
    lineHeight: 16,
  },
  // Modal layout styles
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
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: "92%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  sheetScroll: {
    maxHeight: 460,
  },
  mapSimulation: {
    backgroundColor: "#E8F5EE",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  movingMarker: {
    position: "absolute",
    top: 60,
    left: 80,
  },
  destMarker: {
    position: "absolute",
    top: 90,
    right: 70,
  },
  mapPlaceholderText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1B7A4E",
    letterSpacing: 0.5,
  },
  mapSubtext: {
    fontSize: 10,
    color: "#4B5563",
    marginTop: 4,
    fontWeight: "500",
  },
  detailSecTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#4B5563",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D1D5DB",
    marginTop: 4,
  },
  timelineDotActive: {
    backgroundColor: "#1B7A4E",
    borderWidth: 2,
    borderColor: "#A7F3D0",
  },
  timelineBody: {
    flex: 1,
    gap: 2,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  timelineDesc: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 15,
  },
  timelineLine: {
    width: 2,
    height: 16,
    backgroundColor: "#E5E7EB",
    marginLeft: 4,
    marginVertical: 2,
  },
  sheetBtnClose: {
    backgroundColor: "#1B7A4E",
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  sheetBtnCloseText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  // Review modal specific
  reviewLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  reviewItemName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#4B5563",
    marginTop: 10,
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 8,
  },
  textAreaInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
    marginBottom: 16,
  },
  sheetActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  sheetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetBtnOutline: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  sheetBtnSolid: {
    backgroundColor: "#1B7A4E",
  },
  sheetBtnTextOutline: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "800",
  },
  sheetBtnTextSolid: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  photoPickerRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 10,
  },
  photoOption: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    position: "relative",
    overflow: "hidden",
  },
  photoOptionSelected: {
    borderColor: "#1B7A4E",
  },
  photoOptionImg: {
    width: "100%",
    height: "100%",
  },
  photoSelectedCheck: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(4, 120, 87, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
