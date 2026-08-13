import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  QrCode,
  ShieldCheck,
  Store,
} from "lucide-react-native";
import { toQR } from "toqr";
import { CateringPaymentOption, OrderItem, Screen } from "../../types";
import { BackHeader } from "../../components/BackHeader";
import { rp } from "../../utils/formatters";
import {
  createCateringOrder,
  getCateringPaymentBreakdown,
} from "../../utils/cateringPayment";

interface CateringQrisScreenProps {
  navigate: (s: Screen) => void;
  cateringPO: any;
  paymentOption: CateringPaymentOption;
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  setSelectedOrderId: (id: string | null) => void;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}

const QR_EXPIRY_SECONDS = 15 * 60;

const CateringQrisContent: React.FC<CateringQrisScreenProps> = ({
  navigate,
  cateringPO,
  paymentOption,
  setOrders,
  setSelectedOrderId,
  setNotifications,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(QR_EXPIRY_SECONDS);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [qrVersion, setQrVersion] = useState(0);

  const totalPrice = Number(cateringPO.totalPrice) || 0;
  const breakdown = getCateringPaymentBreakdown(totalPrice, paymentOption);
  const paymentReference = useMemo(
    () => `RNG${Date.now().toString().slice(-8)}${qrVersion}`,
    [qrVersion],
  );
  const qrPayload = useMemo(
    () => [
      "RANGERS",
      "QRIS",
      paymentReference,
      breakdown.paidAmount,
      cateringPO.merchant.name,
      cateringPO.bookingDate,
    ].join("|"),
    [breakdown.paidAmount, cateringPO.bookingDate, cateringPO.merchant.name, paymentReference],
  );
  const qrCode = useMemo(() => {
    const matrix = toQR(qrPayload);
    const size = Math.sqrt(matrix.length);
    const darkModules: number[] = [];
    matrix.forEach((module, index) => {
      if (module) darkModules.push(index);
    });
    return { size, darkModules };
  }, [qrPayload]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft(current => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const timeLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  const refreshQr = () => {
    setSecondsLeft(QR_EXPIRY_SECONDS);
    setQrVersion(version => version + 1);
  };

  const handlePaymentConfirmed = () => {
    if (secondsLeft <= 0 || isCheckingPayment) return;

    setIsCheckingPayment(true);
    setTimeout(() => {
      const newOrder = createCateringOrder({
        cateringPO,
        paymentOption,
        paymentMethod: "QRIS",
        paymentReference,
      });

      setOrders(previousOrders => [newOrder, ...previousOrders]);
      setSelectedOrderId(newOrder.id);
      setNotifications(previousNotifications => [
        ...(newOrder.remainingAmount && newOrder.remainingAmount > 0
          ? [{
              id: Date.now() + 1,
              type: "payment",
              title: "Pengingat Pelunasan Catering",
              msg: `Sisa ${rp(newOrder.remainingAmount)} untuk order #${newOrder.id} wajib dilunasi H-1 sebelum pengiriman.`,
              time: "Baru saja",
              read: false,
            }]
          : []),
        {
          id: Date.now(),
          type: "payment",
          title: "Pembayaran QRIS Berhasil",
          msg: `Pembayaran ${rp(newOrder.paidAmount || 0)} untuk order #${newOrder.id} sudah terkonfirmasi.`,
          time: "Baru saja",
          read: false,
        },
        ...previousNotifications,
      ]);
      setIsCheckingPayment(false);

      Alert.alert(
        newOrder.remainingAmount && newOrder.remainingAmount > 0
          ? "DP Berhasil Dibayar"
          : "Pembayaran Berhasil",
        newOrder.remainingAmount && newOrder.remainingAmount > 0
          ? `Order masuk ke Diproses. Sisa ${rp(newOrder.remainingAmount)} perlu dilunasi paling lambat H-1 sebelum pengiriman.`
          : "Pembayaran lunas Anda sudah terkonfirmasi dan PO diteruskan ke merchant.",
        [{ text: "Lihat Pesanan", onPress: () => navigate("c_tracking") }],
      );
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Pembayaran QRIS" onBack={() => navigate("c_catering_payment")} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.secureBanner}>
          <View style={styles.secureIcon}>
            <ShieldCheck size={18} color="#1B7A4E" />
          </View>
          <View style={styles.secureCopy}>
            <Text style={styles.secureTitle}>Pembayaran aman dengan QRIS</Text>
            <Text style={styles.secureSubtitle}>QR berlaku hanya untuk transaksi ini</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.invoiceCard}>
          <View style={styles.invoiceHeader}>
            <View style={styles.merchantIdentity}>
              <View style={styles.merchantIcon}>
                <Store size={17} color="#1B7A4E" />
              </View>
              <View style={styles.merchantCopy}>
                <Text style={styles.merchantLabel}>Merchant QRIS</Text>
                <Text style={styles.merchantName} numberOfLines={1}>{cateringPO.merchant.name}</Text>
              </View>
            </View>
            <Text style={styles.qrisWordmark}>QRIS</Text>
          </View>

          <View style={styles.amountBlock}>
            <Text style={styles.amountLabel}>Total yang dibayar sekarang</Text>
            <Text style={styles.amountValue}>{rp(breakdown.paidAmount)}</Text>
            <View style={styles.planPill}>
              <Text style={styles.planPillText}>{breakdown.optionLabel}</Text>
            </View>
          </View>

          {breakdown.remainingAmount > 0 && (
            <View style={styles.remainingCard}>
              <View style={styles.remainingRow}>
                <Text style={styles.remainingLabel}>Total pesanan</Text>
                <Text style={styles.remainingValue}>{rp(totalPrice)}</Text>
              </View>
              <View style={styles.remainingRow}>
                <Text style={styles.remainingLabel}>Sisa pelunasan</Text>
                <Text style={styles.remainingValueAccent}>{rp(breakdown.remainingAmount)}</Text>
              </View>
              <Text style={styles.remainingHint}>Pelunasan maksimal H-1 sebelum tanggal pengiriman.</Text>
            </View>
          )}

          <View style={styles.qrFrame}>
            <View style={styles.qrInner}>
              <Svg viewBox={`0 0 ${qrCode.size} ${qrCode.size}`} style={styles.qrSvg}>
                <Rect x="0" y="0" width={qrCode.size} height={qrCode.size} fill="#FFFFFF" />
                {qrCode.darkModules.map(index => {
                  const x = index % qrCode.size;
                  const y = Math.floor(index / qrCode.size);
                  return <Rect key={index} x={x} y={y} width="1" height="1" fill="#111827" />;
                })}
              </Svg>
            </View>
            <View style={styles.qrTag}>
              <QrCode size={12} color="#111827" />
              <Text style={styles.qrTagText}>QRIS DINAMIS</Text>
            </View>
          </View>

          <Text style={styles.scanHint}>Scan QR di atas menggunakan aplikasi bank atau e-wallet yang mendukung QRIS.</Text>

          <View style={styles.transactionRow}>
            <View>
              <Text style={styles.transactionLabel}>ID TRANSAKSI</Text>
              <Text style={styles.transactionValue}>{paymentReference}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => Alert.alert("ID transaksi", `${paymentReference}\nGunakan ID ini jika membutuhkan bantuan pembayaran.`)}
            >
              <Copy size={14} color="#1B7A4E" />
              <Text style={styles.copyButtonText}>Salin</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.expiryCard}>
          <View style={styles.expiryIcon}>
            <Clock3 size={18} color={secondsLeft > 0 ? "#D97706" : "#B91C1C"} />
          </View>
          <View style={styles.expiryCopy}>
            <Text style={styles.expiryTitle}>{secondsLeft > 0 ? "Menunggu pembayaran" : "QR sudah kedaluwarsa"}</Text>
            <Text style={styles.expirySubtitle}>{secondsLeft > 0 ? "Selesaikan pembayaran sebelum waktu habis" : "Buat QR baru untuk melanjutkan pembayaran"}</Text>
          </View>
          <Text style={[styles.expiryTimer, secondsLeft <= 0 && styles.expiryTimerExpired]}>{timeLabel}</Text>
        </View>

        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>Cara membayar</Text>
          {[
            "Buka aplikasi bank atau e-wallet pilihan Anda.",
            "Pilih menu Scan QRIS, lalu arahkan ke QR di atas.",
            `Pastikan nominal pembayaran ${rp(breakdown.paidAmount)} sesuai sebelum konfirmasi.`,
            "Setelah berhasil, kembali ke aplikasi Rangers dan tekan Saya Sudah Bayar.",
          ].map((instruction, index) => (
            <View key={instruction} style={styles.instructionRow}>
              <View style={styles.instructionNumber}><Text style={styles.instructionNumberText}>{index + 1}</Text></View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        {secondsLeft <= 0 ? (
          <TouchableOpacity onPress={refreshQr} style={styles.primaryButton} activeOpacity={0.85}>
            <QrCode size={17} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Buat QR Baru</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handlePaymentConfirmed}
            style={[styles.primaryButton, isCheckingPayment && styles.primaryButtonDisabled]}
            disabled={isCheckingPayment}
            activeOpacity={0.85}
          >
            {isCheckingPayment ? <ActivityIndicator size="small" color="#FFFFFF" /> : <CheckCircle2 size={17} color="#FFFFFF" />}
            <Text style={styles.primaryButtonText}>{isCheckingPayment ? "Memeriksa pembayaran..." : "Saya Sudah Bayar"}</Text>
            {!isCheckingPayment && <ChevronRight size={17} color="#FFFFFF" />}
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigate("c_catering_payment")} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export const CateringQrisScreen: React.FC<CateringQrisScreenProps> = props => {
  if (!props.cateringPO) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <BackHeader title="Pembayaran QRIS" onBack={() => props.navigate("c_catering")} />
        <View style={styles.errorBody}>
          <Text style={styles.errorText}>Data pembayaran tidak ditemukan.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return <CateringQrisContent {...props} />;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAF8" },
  scrollContent: { padding: 16, gap: 12, paddingBottom: 24 },
  secureBanner: {
    backgroundColor: "#E8F5EE",
    borderWidth: 1,
    borderColor: "#C8E6D3",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  secureIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  secureCopy: { flex: 1, marginLeft: 10 },
  secureTitle: { color: "#14532D", fontSize: 11, fontWeight: "900" },
  secureSubtitle: { color: "#4B7F60", fontSize: 9, fontWeight: "600", marginTop: 2 },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#16A34A" },
  liveBadgeText: { color: "#15803D", fontSize: 8, fontWeight: "900" },
  invoiceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  invoiceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  merchantIdentity: { flexDirection: "row", alignItems: "center", flex: 1 },
  merchantIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: "#E8F5EE", alignItems: "center", justifyContent: "center" },
  merchantCopy: { marginLeft: 9, flex: 1 },
  merchantLabel: { color: "#9CA3AF", fontSize: 8, fontWeight: "800", textTransform: "uppercase" },
  merchantName: { color: "#111827", fontSize: 12, fontWeight: "900", marginTop: 2 },
  qrisWordmark: { color: "#1B7A4E", fontSize: 17, fontWeight: "900", letterSpacing: -1 },
  amountBlock: { alignItems: "center", paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: "#F3F4F6", marginBottom: 14 },
  amountLabel: { color: "#6B7280", fontSize: 10, fontWeight: "700" },
  amountValue: { color: "#111827", fontSize: 26, fontWeight: "900", marginTop: 4 },
  planPill: { backgroundColor: "#FFF7ED", borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4, marginTop: 7 },
  planPillText: { color: "#C2410C", fontSize: 9, fontWeight: "900" },
  remainingCard: { backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 14, padding: 11, marginBottom: 14, gap: 5 },
  remainingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  remainingLabel: { color: "#92400E", fontSize: 10, fontWeight: "700" },
  remainingValue: { color: "#78350F", fontSize: 10, fontWeight: "800" },
  remainingValueAccent: { color: "#B45309", fontSize: 11, fontWeight: "900" },
  remainingHint: { color: "#A16207", fontSize: 9, lineHeight: 13, marginTop: 2 },
  qrFrame: { alignSelf: "center", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 18, padding: 12, backgroundColor: "#FFFFFF", alignItems: "center" },
  qrInner: { width: 214, height: 214, padding: 4, backgroundColor: "#FFFFFF" },
  qrSvg: { width: "100%", height: "100%" },
  qrTag: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 9 },
  qrTagText: { color: "#111827", fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  scanHint: { color: "#6B7280", fontSize: 10, lineHeight: 15, textAlign: "center", marginTop: 14, paddingHorizontal: 12 },
  transactionRow: { borderTopWidth: 1, borderTopColor: "#F3F4F6", marginTop: 16, paddingTop: 13, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  transactionLabel: { color: "#9CA3AF", fontSize: 8, fontWeight: "900", letterSpacing: 0.6 },
  transactionValue: { color: "#374151", fontSize: 10, fontWeight: "800", marginTop: 3, letterSpacing: 0.5 },
  copyButton: { flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderColor: "#B7DCC5", borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 },
  copyButtonText: { color: "#1B7A4E", fontSize: 9, fontWeight: "900" },
  expiryCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 12, flexDirection: "row", alignItems: "center" },
  expiryIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: "#FFF7ED", alignItems: "center", justifyContent: "center" },
  expiryCopy: { flex: 1, marginLeft: 9 },
  expiryTitle: { color: "#374151", fontSize: 11, fontWeight: "900" },
  expirySubtitle: { color: "#9CA3AF", fontSize: 9, fontWeight: "600", marginTop: 2 },
  expiryTimer: { color: "#B45309", fontSize: 15, fontWeight: "900", letterSpacing: 0.5 },
  expiryTimerExpired: { color: "#B91C1C" },
  instructionCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 18, padding: 14, gap: 11 },
  instructionTitle: { color: "#111827", fontSize: 12, fontWeight: "900", marginBottom: 2 },
  instructionRow: { flexDirection: "row", alignItems: "flex-start" },
  instructionNumber: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#E8F5EE", alignItems: "center", justifyContent: "center", marginRight: 9 },
  instructionNumberText: { color: "#1B7A4E", fontSize: 9, fontWeight: "900" },
  instructionText: { flex: 1, color: "#6B7280", fontSize: 10, lineHeight: 15, fontWeight: "600" },
  bottomBar: { backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E5E7EB", padding: 14, gap: 9 },
  primaryButton: { height: 48, borderRadius: 14, backgroundColor: "#1B7A4E", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  secondaryButton: { height: 34, alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { color: "#6B7280", fontSize: 11, fontWeight: "800" },
  errorContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  errorBody: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { fontSize: 12, color: "#9CA3AF", fontWeight: "600" },
});
