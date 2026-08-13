import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { CheckCircle2, ChevronRight, ShoppingBag, Home } from "lucide-react-native";
import { Screen, OrderItem } from "../../types";
import { rp } from "../../utils/formatters";

interface OrderSuccessScreenProps {
  navigate: (s: Screen) => void;
  selectedOrderId: string | null;
  orders: OrderItem[];
}

export const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({
  navigate,
  selectedOrderId,
  orders,
}) => {
  const currentOrder = orders.find(o => o.id === selectedOrderId);

  // Fallback default details if not found
  const orderIdVal = selectedOrderId || "RNG-000000";
  const storeName = currentOrder?.detail || "Merchant Partner";
  const totalVal = currentOrder?.total || 0;
  const paymentMethod = currentOrder?.paymentMethod || "Metode Pembayaran";

  const getETA = () => {
    if (!currentOrder) return "30 - 45 menit";
    if (currentOrder.type === "Catering") {
      return `${currentOrder.cateringDate} @ ${currentOrder.cateringTime}`;
    }
    if (currentOrder.deliveryMethod?.toLowerCase().includes("instant")) return "20 - 30 menit";
    if (currentOrder.deliveryMethod?.toLowerCase().includes("express")) return "1 - 2 jam";
    return "3 - 5 jam";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated-like Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconPulseBg}>
            <CheckCircle2 size={68} color="#047857" />
          </View>
        </View>

        <Text style={styles.successTitle}>Pesanan Berhasil Dibuat!</Text>
        <Text style={styles.successSub}>
          Hore! Pembayaran Anda sukses diterima dan pesanan telah diteruskan ke pihak merchant.
        </Text>

        {/* Order Details Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order ID</Text>
            <Text style={styles.summaryValue}>#{orderIdVal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Merchant</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>{storeName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Pembayaran</Text>
            <Text style={[styles.summaryValue, styles.highlightText]}>{rp(totalVal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimasi Tiba</Text>
            <Text style={styles.summaryValue}>{getETA()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Metode Pembayaran</Text>
            <Text style={styles.summaryValue}>{paymentMethod}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigate("c_tracking")}
            activeOpacity={0.9}
          >
            <ShoppingBag size={18} color="#FFFFFF" />
            <Text style={styles.trackBtnText}>Lacak Pesanan Saya</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigate("c_home")}
            activeOpacity={0.8}
          >
            <Home size={18} color="#047857" />
            <Text style={styles.homeBtnText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconPulseBg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E8F5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
  successSub: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  summaryCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    width: "100%",
    marginTop: 28,
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
    maxWidth: "60%",
  },
  highlightText: {
    color: "#1B7A4E",
    fontWeight: "900",
  },
  actionsContainer: {
    width: "100%",
    marginTop: 32,
    gap: 12,
  },
  trackBtn: {
    backgroundColor: "#1B7A4E",
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  trackBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  homeBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: "#1B7A4E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  homeBtnText: {
    color: "#1B7A4E",
    fontSize: 13,
    fontWeight: "800",
  },
});
