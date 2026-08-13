import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Svg, { Rect, Circle, Path } from "react-native-svg";
import { Screen, OrderItem } from "../../types";
import { rp } from "../../utils/formatters";

interface CateringQrisScreenProps {
  navigate: (s: Screen) => void;
  cateringPO: any; // Contains: merchant, package, paxCount, bookingDate, note, totalPrice
  paymentOption: "full" | "dp30" | "dp50";
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  setSelectedOrderId: (id: string | null) => void;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}

export const CateringQrisScreen: React.FC<CateringQrisScreenProps> = ({
  navigate,
  cateringPO,
  paymentOption,
  orders,
  setOrders,
  setSelectedOrderId,
  setNotifications,
}) => {
  if (!cateringPO) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorBody}>
          <Text style={styles.errorText}>Data pre-order tidak ditemukan.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalPrice = cateringPO.totalPrice;
  let paidAmount = totalPrice;
  if (paymentOption === "dp30") {
    paidAmount = Math.round(totalPrice * 0.3);
  } else if (paymentOption === "dp50") {
    paidAmount = Math.round(totalPrice * 0.5);
  }

  const handleSimulatePaymentSuccess = () => {
    // Generate new order
    const orderId = `PO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderItem = {
      id: orderId,
      type: "Catering",
      iconName: "Coffee",
      color: "#FF7043",
      item: cateringPO.package.name,
      detail: cateringPO.merchant.name,
      status: "Diproses",
      statusColor: "orange",
      date: cateringPO.bookingDate || "Hari Ini",
      total: totalPrice,
      deliveryFee: 8000,
      serviceFee: 0,
      discount: 0,
      paymentMethod: "QRIS Barcode",
      notes: cateringPO.note,
      address: {
        id: "addr-po",
        label: "Rumah Utama",
        receiverName: "Customer Rangers",
        phoneNumber: "081234567890",
        fullAddress: "Jl. Aster No. 7, Kamojang, Kab. Garut",
        isMain: true
      },
      items: [
        {
          id: cateringPO.package.id.toString(),
          name: cateringPO.package.name,
          price: cateringPO.package.price,
          qty: cateringPO.paxCount,
          img: cateringPO.package.img,
          store: cateringPO.merchant.name
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrderId(orderId);

    // Save notification
    const newNotif = {
      id: Date.now(),
      type: "info",
      title: "Pembayaran QRIS PO Sukses 📱",
      msg: `Pembayaran katering sebesar ${rp(paidAmount)} untuk order #${orderId} telah terkonfirmasi.`,
      time: "Baru saja",
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    Alert.alert("Simulasi Sukses", "Pembayaran QRIS berhasil dikonfirmasi! Kami mengalihkan Anda ke pelacakan kurir.", [
      {
        text: "Lacak Pesanan",
        onPress: () => navigate("c_tracking")
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pembayaran QRIS PO</Text>
        <Text style={styles.subtitle}>PGE Kamojang Community Payment Gate</Text>
      </View>

      <View style={styles.card}>
        {/* QRIS Top labels */}
        <View style={styles.cardHeader}>
          <Text style={styles.qrisLabel}>QRIS STANDAR NASIONAL</Text>
          <Text style={styles.appLabel}>RANGERS APP</Text>
        </View>

        {/* Amount */}
        <Text style={styles.tagihanLabel}>Jumlah Tagihan PO</Text>
        <Text style={styles.tagihanVal}>{rp(paidAmount)}</Text>

        {/* SVG QR Code */}
        <View style={styles.qrContainer}>
          <Svg viewBox="0 0 100 100" style={styles.qrSvg}>
            {/* Top-Left Finder Pattern */}
            <Rect x="0" y="0" width="25" height="25" fill="#1E293B" />
            <Rect x="5" y="5" width="15" height="15" fill="#FFFFFF" />
            <Rect x="9" y="9" width="7" height="7" fill="#1E293B" />
            
            {/* Top-Right Finder Pattern */}
            <Rect x="75" y="0" width="25" height="25" fill="#1E293B" />
            <Rect x="75" y="5" width="15" height="15" fill="#FFFFFF" />
            <Rect x="79" y="9" width="7" height="7" fill="#1E293B" />

            {/* Bottom-Left Finder Pattern */}
            <Rect x="0" y="75" width="25" height="25" fill="#1E293B" />
            <Rect x="5" y="75" width="15" height="15" fill="#FFFFFF" />
            <Rect x="9" y="79" width="7" height="7" fill="#1E293B" />

            {/* Mock random code points */}
            <Rect x="35" y="10" width="10" height="20" fill="#1E293B" />
            <Rect x="55" y="5" width="15" height="10" fill="#1E293B" />
            <Rect x="40" y="40" width="20" height="20" fill="#1E293B" />
            <Rect x="10" y="45" width="15" height="15" fill="#1E293B" />
            <Rect x="70" y="40" width="15" height="15" fill="#1E293B" />
            <Rect x="30" y="70" width="20" height="15" fill="#1E293B" />
            <Rect x="65" y="70" width="15" height="20" fill="#1E293B" />
            <Rect x="45" y="85" width="15" height="10" fill="#1E293B" />
            
            {/* Center Logo Area */}
            <Circle cx="50" cy="50" r="12" fill="#FFFFFF" />
            <Circle cx="50" cy="50" r="9" fill="#1B7A4E" />
            {/* White up-arrow inside green circle */}
            <Path d="M 47,52 L 50,47 L 53,52" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>

        <Text style={styles.qrFooterText}>
          Pindai QR di atas menggunakan aplikasi perbankan atau e-wallet Anda untuk menyelesaikan pembayaran PO
        </Text>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          onPress={handleSimulatePaymentSuccess}
          style={styles.simulateBtn}
        >
          <Text style={styles.simulateBtnText}>✅ Simulasikan Bayar PO Sukses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate("c_catering_payment")}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B7A4E",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 10,
    color: "#A7F3D0",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 8,
    marginBottom: 16,
  },
  qrisLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
  appLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  tagihanLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 2,
  },
  tagihanVal: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 16,
  },
  qrContainer: {
    width: 180,
    height: 180,
    borderWidth: 4,
    borderColor: "#F3F4F6",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  qrSvg: {
    width: "100%",
    height: "100%",
  },
  qrFooterText: {
    fontSize: 9,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 13,
  },
  bottomActions: {
    alignItems: "center",
    marginTop: 24,
    gap: 12,
  },
  simulateBtn: {
    width: "100%",
    height: 48,
    backgroundColor: "#FBBF24",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FBBF24",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  simulateBtnText: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "900",
  },
  backBtn: {
    paddingVertical: 8,
  },
  backBtnText: {
    color: "#A7F3D0",
    fontSize: 12,
    fontWeight: "700",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#1B7A4E",
    alignItems: "center",
    justifyContent: "center",
  },
  errorBody: {
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
