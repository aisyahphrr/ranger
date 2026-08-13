import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { CateringPaymentOption, OrderItem, Screen } from "../../types";
import { BackHeader } from "../../components/BackHeader";
import { rp } from "../../utils/formatters";
import { createCateringOrder, getCateringPaymentBreakdown } from "../../utils/cateringPayment";

interface CateringPaymentScreenProps {
  navigate: (s: Screen) => void;
  cateringPO: any; // Contains: merchant, package, paxCount, bookingDate, note, totalPrice
  dompetBalance: number;
  setDompetBalance: React.Dispatch<React.SetStateAction<number>>;
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  setSelectedOrderId: (id: string | null) => void;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedCateringPO: (po: any) => void;
}

export const CateringPaymentScreen: React.FC<CateringPaymentScreenProps> = ({
  navigate,
  cateringPO,
  dompetBalance,
  setDompetBalance,
  orders,
  setOrders,
  setSelectedOrderId,
  setNotifications,
  setSelectedCateringPO,
}) => {
  const [paymentOption, setPaymentOption] = useState<CateringPaymentOption>("full");
  const [payMethod, setPayMethod] = useState<"dompet" | "qris">("dompet");

  if (!cateringPO) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <BackHeader title="Pembayaran PO" onBack={() => navigate("c_catering")} />
        <View style={styles.errorBody}>
          <Text style={styles.errorText}>Data pre-order tidak ditemukan.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalPrice = cateringPO.totalPrice;
  const { paidAmount, remainingAmount, dpPercent } = getCateringPaymentBreakdown(totalPrice, paymentOption);

  const handleConfirmPO = () => {
    if (dompetBalance < paidAmount) {
      Alert.alert("Saldo Kurang", "Saldo Dompet Rangers Anda tidak mencukupi untuk melakukan pembayaran katering ini.");
      return;
    }
    setDompetBalance(prev => prev - paidAmount);

    const newOrder = createCateringOrder({
      cateringPO,
      paymentOption,
      paymentMethod: "Dompet Rangers",
      paymentReference: `WALLET-${Date.now().toString().slice(-8)}`,
    });
    const orderId = newOrder.id;

    setOrders(prev => [newOrder, ...prev]);
    setSelectedOrderId(orderId);

    // Save notification
    const newNotif = {
      id: Date.now(),
      type: "info",
      title: "Booking Catering Dibuat 🍱",
      msg: `Pemesanan PO #${orderId} untuk menu ${cateringPO.package.name} telah diproses.`,
      time: "Baru saja",
      read: false,
    };
    setNotifications(prev => [
      ...(remainingAmount > 0
        ? [{
            id: Date.now() + 1,
            type: "payment",
            title: "Pengingat Pelunasan",
            msg: `Sisa pembayaran ${rp(remainingAmount)} untuk order #${orderId} jatuh tempo H-1 sebelum pengiriman.`,
            time: "Baru saja",
            read: false,
          }]
        : []),
      newNotif,
      ...prev,
    ]);

    Alert.alert(
      remainingAmount > 0 ? "DP Berhasil Dibayar" : "Pembayaran Berhasil",
      remainingAmount > 0
        ? `Order masuk ke Diproses. Sisa ${rp(remainingAmount)} perlu dilunasi paling lambat H-1 sebelum pengiriman.`
        : `Pre-Order ${cateringPO.package.name} berhasil dibuat!`,
      [
      {
        text: "Lacak Pesanan",
        onPress: () => navigate("c_tracking")
      }
      ]
    );
  };

  const handlePayAndCreatePO = () => {
    if (payMethod === "qris") {
      setSelectedCateringPO({ ...cateringPO, paymentOption });
      navigate("c_catering_qris");
    } else {
      handleConfirmPO();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Metode Pembayaran PO" onBack={() => navigate("c_catering_detail")} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Order Summary box */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLabelRow}>
            <Text style={styles.summaryLabel}>Menu Paket PO</Text>
            <Text style={styles.summaryLabel}>Qty / Porsi</Text>
          </View>
          <View style={styles.summaryItemRow}>
            <Text style={styles.summaryItemName} numberOfLines={1}>
              {cateringPO.package.name}
            </Text>
            <Text style={styles.summaryItemQty}>
              {cateringPO.paxCount} {cateringPO.package.cat === "Tumpeng" ? "Unit" : "Pax"}
            </Text>
          </View>
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total Harga PO</Text>
            <Text style={styles.summaryTotalValue}>{rp(totalPrice)}</Text>
          </View>
        </View>

        {/* DP Choices Options */}
        <Text style={styles.sectionTitle}>PILIH OPSI PEMBAYARAN</Text>
        <View style={styles.optionsCol}>
          {/* Lunas */}
          <TouchableOpacity
            onPress={() => setPaymentOption("full")}
            style={[styles.optionCard, paymentOption === "full" && styles.optionCardActive]}
            activeOpacity={0.8}
          >
            <View style={[styles.radioCircle, paymentOption === "full" && styles.radioCircleActive]}>
              {paymentOption === "full" && <View style={styles.radioDot} />}
            </View>
            <View style={styles.optionBody}>
              <Text style={styles.optionTitle}>Bayar Lunas (100%)</Text>
              <Text style={styles.optionSub}>Dapatkan garansi prioritas pengantaran.</Text>
              <Text style={styles.optionPrice}>{rp(totalPrice)}</Text>
            </View>
          </TouchableOpacity>

          {/* DP 30% */}
          <TouchableOpacity
            onPress={() => setPaymentOption("dp30")}
            style={[styles.optionCard, paymentOption === "dp30" && styles.optionCardActive]}
            activeOpacity={0.8}
          >
            <View style={[styles.radioCircle, paymentOption === "dp30" && styles.radioCircleActive]}>
              {paymentOption === "dp30" && <View style={styles.radioDot} />}
            </View>
            <View style={styles.optionBody}>
              <View style={styles.dpBadgeRow}>
                <Text style={styles.optionTitle}>Bayar DP 30%</Text>
                <View style={styles.dpBadge}>
                  <Text style={styles.dpBadgeText}>DP</Text>
                </View>
              </View>
              <Text style={styles.optionSub}>Sisa pelunasan dibayar paling lambat H-1.</Text>
              <View style={styles.priceSplitRow}>
                <Text style={styles.optionPrice}>DP: {rp(Math.round(totalPrice * 0.3))}</Text>
                <Text style={styles.optionPriceRemaining}>Sisa: {rp(totalPrice - Math.round(totalPrice * 0.3))}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* DP 50% */}
          <TouchableOpacity
            onPress={() => setPaymentOption("dp50")}
            style={[styles.optionCard, paymentOption === "dp50" && styles.optionCardActive]}
            activeOpacity={0.8}
          >
            <View style={[styles.radioCircle, paymentOption === "dp50" && styles.radioCircleActive]}>
              {paymentOption === "dp50" && <View style={styles.radioDot} />}
            </View>
            <View style={styles.optionBody}>
              <View style={styles.dpBadgeRow}>
                <Text style={styles.optionTitle}>Bayar DP 50%</Text>
                <View style={styles.dpBadge}>
                  <Text style={styles.dpBadgeText}>DP</Text>
                </View>
              </View>
              <Text style={styles.optionSub}>Sisa pelunasan dibayar paling lambat H-1.</Text>
              <View style={styles.priceSplitRow}>
                <Text style={styles.optionPrice}>DP: {rp(Math.round(totalPrice * 0.5))}</Text>
                <Text style={styles.optionPriceRemaining}>Sisa: {rp(totalPrice - Math.round(totalPrice * 0.5))}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Method Selection */}
        <Text style={styles.sectionTitle}>PILIH METODE PEMBAYARAN</Text>
        <View style={styles.methodRow}>
          <TouchableOpacity
            onPress={() => setPayMethod("dompet")}
            style={[styles.methodBtn, payMethod === "dompet" && styles.methodBtnActive]}
            activeOpacity={0.8}
          >
            <Text style={styles.methodIcon}>🪙</Text>
            <Text style={[styles.methodLabelText, payMethod === "dompet" && styles.methodLabelTextActive]}>
              Dompet Rangers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPayMethod("qris")}
            style={[styles.methodBtn, payMethod === "qris" && styles.methodBtnActive]}
            activeOpacity={0.8}
          >
            <Text style={styles.methodIcon}>📱</Text>
            <Text style={[styles.methodLabelText, payMethod === "qris" && styles.methodLabelTextActive]}>
              QRIS Barcode
            </Text>
          </TouchableOpacity>
        </View>

        {/* Balance/Wallet conditional info card */}
        {payMethod === "dompet" ? (
          <View style={styles.walletInfoCard}>
            <View style={styles.walletInfoLeft}>
              <Text style={styles.walletIconBig}>🪙</Text>
              <View>
                <Text style={styles.walletTitle}>Dompet Rangers</Text>
                <Text style={styles.walletSubtitle}>Saldo Anda</Text>
              </View>
            </View>
            <Text style={styles.walletBalanceText}>{rp(dompetBalance)}</Text>
          </View>
        ) : (
          <View style={styles.qrisInfoCard}>
            <View style={styles.walletInfoLeft}>
              <Text style={styles.walletIconBig}>📱</Text>
              <View>
                <Text style={styles.walletTitle}>QRIS (Rangers Pay)</Text>
                <Text style={styles.walletSubtitle}>Bayar instan via barcode scan</Text>
              </View>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Aktif</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => navigate("c_catering_detail")}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePayAndCreatePO}
          style={styles.payBtn}
        >
          <Text style={styles.payBtnText}>Bayar & Buat PO</Text>
        </TouchableOpacity>
      </View>
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
    gap: 12,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    gap: 6,
  },
  summaryLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderStyle: "dashed",
    paddingBottom: 8,
    marginBottom: 6,
  },
  summaryItemName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
    flex: 1,
  },
  summaryItemQty: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTotalLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E293B",
  },
  summaryTotalValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "900",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 10,
  },
  optionsCol: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionCardActive: {
    borderColor: "#1B7A4E",
    backgroundColor: "rgba(27,122,78,0.01)",
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleActive: {
    borderColor: "#1B7A4E",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1B7A4E",
  },
  optionBody: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },
  dpBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dpBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  dpBadgeText: {
    color: "#D97706",
    fontSize: 8,
    fontWeight: "900",
  },
  optionSub: {
    fontSize: 9,
    color: "#9CA3AF",
    marginTop: 2,
  },
  optionPrice: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1B7A4E",
    marginTop: 4,
  },
  priceSplitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  optionPriceRemaining: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "600",
  },
  methodRow: {
    flexDirection: "row",
    gap: 10,
  },
  methodBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  methodBtnActive: {
    borderColor: "#1B7A4E",
    backgroundColor: "rgba(27,122,78,0.03)",
  },
  methodIcon: {
    fontSize: 14,
  },
  methodLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  methodLabelTextActive: {
    color: "#1B7A4E",
  },
  walletInfoCard: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qrisInfoCard: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  walletInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  walletIconBig: {
    fontSize: 18,
  },
  walletTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1E293B",
  },
  walletSubtitle: {
    fontSize: 9,
    color: "#9CA3AF",
    marginTop: 1,
  },
  walletBalanceText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  activeBadge: {
    backgroundColor: "#1B7A4E",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  activeBadgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    padding: 16,
    flexDirection: "row",
    gap: 10,
  },
  backBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "800",
  },
  payBtn: {
    flex: 2,
    height: 44,
    backgroundColor: "#1B7A4E",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  payBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
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
  },
  errorText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
});
