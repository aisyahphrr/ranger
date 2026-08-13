import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Screen, OrderItem } from "../../types";
import { LAUNDRIES } from "../../constants/mockData";
import { BackHeader } from "../../components/BackHeader";
import { Stars } from "../../components/Stars";
import { rp } from "../../utils/formatters";
import { Wind, X, MapPin, Scale, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react-native";
import { CustomerNotification } from "./Inbox";

interface LaundryScreenProps {
  navigate: (s: Screen) => void;
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  notifications: CustomerNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<CustomerNotification[]>>;
}

export const LaundryScreen: React.FC<LaundryScreenProps> = ({
  navigate,
  orders,
  setOrders,
  notifications,
  setNotifications,
}) => {
  const [selectedLaundry, setSelectedLaundry] = useState<any>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);

  // Booking form states
  const [weight, setWeight] = useState(3); // kg
  const [serviceType, setServiceType] = useState<"Biasa" | "Ekspres" | "Setrika Saja">("Biasa");
  const [useCourier, setUseCourier] = useState(true);
  const [note, setNote] = useState("");

  const handleOpenBooking = (laundry: any) => {
    setSelectedLaundry(laundry);
    setWeight(3);
    setServiceType(laundry.type === "Ekspres" ? "Ekspres" : "Biasa");
    setUseCourier(true);
    setNote("");
    setBookingModalVisible(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedLaundry) return;

    const basePrice = selectedLaundry.price;
    const multiplier = serviceType === "Ekspres" ? 1.5 : serviceType === "Setrika Saja" ? 0.8 : 1.0;
    const finalPricePerKg = Math.round(basePrice * multiplier);
    const courierFee = useCourier ? 8000 : 0;
    const totalPrice = (finalPricePerKg * weight) + courierFee;

    const orderId = `RNG0${orders.length + 1}`;
    const newOrder: OrderItem = {
      id: orderId,
      type: "Laundry",
      iconName: "Wind",
      color: "#0284C7",
      item: `Jasa Laundry - ${serviceType}`,
      detail: `${selectedLaundry.name} · ${weight} kg pakaian`,
      status: "Diproses",
      statusColor: "orange",
      date: "Hari ini",
      total: totalPrice,
    };

    setOrders([newOrder, ...orders]);

    // Add notification
    const newNotif: CustomerNotification = {
      id: Date.now(),
      type: "order",
      title: "Penjemputan Laundry 🛵",
      msg: `Kurir Rangers sedang ditugaskan menjemput pakaian kotor Anda untuk diantar ke ${selectedLaundry.name}`,
      time: "Baru saja",
      read: false,
    };
    setNotifications([newNotif, ...notifications]);

    setBookingModalVisible(false);
    Alert.alert(
      "Pemesanan Berhasil", 
      `Order #${orderId} telah dibuat. Kurir akan segera menjemput pakaian Anda.`,
      [
        { text: "Tutup" },
        { text: "Lacak Pesanan", onPress: () => navigate("c_home") }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Layanan Laundry Kilat" onBack={() => navigate("c_home")} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Baju Bersih & Wangi Tanpa Repot</Text>
          <Text style={styles.heroSub}>Kurir Rangers menjemput pakaian kotor Anda dan mengantarkannya kembali dalam keadaan bersih, rapi, dan harum.</Text>
        </View>

        <Text style={styles.sectionTitle}>Mitra Laundry Dekat Anda</Text>
        <View style={styles.listContainer}>
          {LAUNDRIES.map((l) => (
            <View key={l.id} style={styles.laundryCard}>
              <Image source={{ uri: l.img }} style={styles.laundryImg} />
              <View style={styles.laundryInfo}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.laundryName}>{l.name}</Text>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{l.type}</Text>
                  </View>
                </View>
                <Text style={styles.laundryAddress} numberOfLines={1}>{l.address}</Text>
                
                <View style={styles.metaRow}>
                  <Stars rating={l.rating} />
                  <Text style={styles.metaDivider}>·</Text>
                  <Text style={styles.metaText}>{l.distance}</Text>
                  <Text style={styles.metaDivider}>·</Text>
                  <Text style={styles.metaText}>Mulai {rp(l.price)}/kg</Text>
                </View>

                <TouchableOpacity 
                  style={styles.bookBtn}
                  onPress={() => handleOpenBooking(l)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.bookBtnText}>Pesan Layanan</Text>
                  <ChevronRight size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Booking Form Sheet */}
      {selectedLaundry && (
        <Modal visible={bookingModalVisible} transparent animationType="slide">
          <View style={styles.modalBgBottom}>
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Form Pemesanan Laundry</Text>
                <TouchableOpacity onPress={() => setBookingModalVisible(false)}>
                  <X size={20} color="#111827" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.bookingStore}>{selectedLaundry.name}</Text>
                <Text style={styles.bookingAddress}>{selectedLaundry.address}</Text>

                <View style={styles.divider} />

                {/* Service Type Selection */}
                <Text style={styles.inputLabel}>Tipe Layanan</Text>
                <View style={styles.typeSelectorRow}>
                  {(["Biasa", "Ekspres", "Setrika Saja"] as const).map((type) => {
                    const active = serviceType === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.typePill, active && styles.typePillActive]}
                        onPress={() => setServiceType(type)}
                      >
                        <Text style={[styles.typePillText, active && styles.typePillTextActive]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Weight selector */}
                <Text style={styles.inputLabel}>Estimasi Berat Pakaian (Kg)</Text>
                <View style={styles.weightSelectorRow}>
                  <TouchableOpacity 
                    style={styles.weightBtn}
                    onPress={() => setWeight(Math.max(1, weight - 1))}
                  >
                    <Text style={styles.weightBtnText}>-</Text>
                  </TouchableOpacity>
                  <View style={styles.weightDisplay}>
                    <Scale size={16} color="#0284C7" />
                    <Text style={styles.weightText}>{weight} Kg</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.weightBtn}
                    onPress={() => setWeight(weight + 1)}
                  >
                    <Text style={styles.weightBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.weightHelper}>*Berat riil akan ditimbang kembali saat kurir menjemput pakaian kotor.</Text>

                {/* Courier Selection */}
                <View style={styles.courierToggleRow}>
                  <View style={styles.courierToggleInfo}>
                    <Text style={styles.courierTitle}>Jemput-Antar Rangers Courier</Text>
                    <Text style={styles.courierDesc}>Kurir menjemput pakaian dan mengantar setelah selesai (+Rp 8.000)</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggleSwitch, useCourier ? styles.toggleSwitchOn : null]}
                    onPress={() => setUseCourier(!useCourier)}
                  >
                    <View style={[styles.toggleCircle, useCourier ? styles.toggleCircleOn : null]} />
                  </TouchableOpacity>
                </View>

                {/* Notes input */}
                <Text style={styles.inputLabel}>Catatan Tambahan (Opsional)</Text>
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Contoh: Jangan disetrika terlalu panas, pisahkan baju putih..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={2}
                />

                <View style={styles.divider} />

                {/* Pricing panel */}
                <View style={styles.pricePanel}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Biaya Jasa ({weight} kg x {rp(selectedLaundry.price * (serviceType === "Ekspres" ? 1.5 : serviceType === "Setrika Saja" ? 0.8 : 1.0))}/kg)</Text>
                    <Text style={styles.priceValue}>{rp(Math.round(selectedLaundry.price * (serviceType === "Ekspres" ? 1.5 : serviceType === "Setrika Saja" ? 0.8 : 1.0)) * weight)}</Text>
                  </View>
                  {useCourier && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Biaya Kurir Rangers (Antar Jemput)</Text>
                      <Text style={styles.priceValue}>Rp 8.000</Text>
                    </View>
                  )}
                  <View style={[styles.priceRow, { marginTop: 6 }]}>
                    <Text style={styles.priceTotalLabel}>Total Estimasi Pembayaran</Text>
                    <Text style={styles.priceTotalValue}>
                      {rp(Math.round(selectedLaundry.price * (serviceType === "Ekspres" ? 1.5 : serviceType === "Setrika Saja" ? 0.8 : 1.0)) * weight + (useCourier ? 8000 : 0))}
                    </Text>
                  </View>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity 
                  style={styles.confirmBtn}
                  onPress={handleConfirmBooking}
                  activeOpacity={0.8}
                >
                  <CheckCircle2 size={16} color="#FFFFFF" />
                  <Text style={styles.confirmBtnText}>Konfirmasi Order Laundry</Text>
                </TouchableOpacity>
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
    backgroundColor: "#F3F7F5",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    backgroundColor: "#0284C7",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    gap: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  heroSub: {
    color: "#E0F2FE",
    fontSize: 11,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 14,
  },
  laundryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  laundryImg: {
    width: "100%",
    height: 140,
    backgroundColor: "#F3F4F6",
  },
  laundryInfo: {
    padding: 14,
    gap: 4,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  laundryName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeText: {
    color: "#0284C7",
    fontSize: 10,
    fontWeight: "800",
  },
  laundryAddress: {
    fontSize: 12,
    color: "#6B7280",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 8,
  },
  metaDivider: {
    fontSize: 12,
    color: "#D1D5DB",
    marginHorizontal: 6,
  },
  metaText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "500",
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0284C7",
    borderRadius: 12,
    height: 38,
    gap: 6,
  },
  bookBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  // Modal layout
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
    maxHeight: 500,
  },
  bookingStore: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  bookingAddress: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#4B5563",
    marginBottom: 8,
  },
  typeSelectorRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  typePill: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  typePillActive: {
    borderColor: "#0284C7",
    backgroundColor: "#E0F2FE",
  },
  typePillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  typePillTextActive: {
    color: "#0284C7",
    fontWeight: "800",
  },
  weightSelectorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 6,
  },
  weightBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  weightBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  weightDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    borderRadius: 12,
    height: 36,
    paddingHorizontal: 16,
  },
  weightText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0284C7",
  },
  weightHelper: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 16,
  },
  courierToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginBottom: 16,
  },
  courierToggleInfo: {
    flex: 1,
    marginRight: 12,
    gap: 2,
  },
  courierTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },
  courierDesc: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D1D5DB",
    padding: 2,
    justifyContent: "center",
  },
  toggleSwitchOn: {
    backgroundColor: "#0284C7",
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  toggleCircleOn: {
    alignSelf: "flex-end",
  },
  noteInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#111827",
    textAlignVertical: "top",
    marginBottom: 6,
  },
  pricePanel: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
    marginBottom: 18,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 11,
    color: "#1F2937",
    fontWeight: "700",
  },
  priceTotalLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },
  priceTotalValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0284C7",
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0284C7",
    height: 46,
    borderRadius: 14,
    gap: 8,
    marginBottom: 12,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
