import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import {
  CateringPaymentOption,
  CustomerAddress,
  OrderItem,
  Screen,
} from "../../types";
import {
  Check,
  ChevronDown,
  MapPin,
  Tag,
  Truck,
  Wallet,
  X,
} from "lucide-react-native";
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
  addresses: CustomerAddress[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
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
  addresses,
  selectedAddressId,
  setSelectedAddressId,
}) => {
  const [paymentOption, setPaymentOption] = useState<CateringPaymentOption>("full");
  const [payMethod, setPayMethod] = useState<"dompet" | "qris">("dompet");
  const [tip, setTip] = useState(0);
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [addressModalVisible, setAddressModalVisible] = useState(false);

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

  const subtotal = Number(cateringPO.totalPrice) || 0;
  const shippingFee = 8000;
  const activeAddress = addresses.find(address => address.id === selectedAddressId) || addresses[0] || null;
  const totalPrice = Math.max(0, subtotal + shippingFee + tip - discount);
  const { paidAmount, remainingAmount, dpPercent } = getCateringPaymentBreakdown(totalPrice, paymentOption);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === "KAMOJANG") {
      setPromoCode(code);
      setDiscount(Math.min(subtotal, 10000));
      setPromoMessage("Promo KAMOJANG berhasil digunakan.");
    } else if (code === "RANGER10") {
      setPromoCode(code);
      setDiscount(Math.min(subtotal, Math.round(subtotal * 0.1)));
      setPromoMessage("Diskon 10% berhasil digunakan.");
    } else {
      setPromoCode(null);
      setDiscount(0);
      setPromoMessage("Kode promo tidak tersedia.");
    }
  };

  const paymentPO = {
    ...cateringPO,
    totalPrice,
    subtotal,
    shippingFee,
    tip,
    discount,
    promoCode,
    address: activeAddress,
  };

  const handleConfirmPO = () => {
    if (dompetBalance < paidAmount) {
      Alert.alert("Saldo Kurang", "Saldo Dompet Rangers Anda tidak mencukupi untuk melakukan pembayaran katering ini.");
      return;
    }
    setDompetBalance(prev => prev - paidAmount);

    const newOrder = createCateringOrder({
      cateringPO: paymentPO,
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
      if (!activeAddress) {
        Alert.alert("Alamat Belum Dipilih", "Tambahkan atau pilih alamat pengiriman terlebih dahulu.");
        return;
      }
      setSelectedCateringPO({ ...paymentPO, paymentOption });
      navigate("c_catering_qris");
    } else {
      if (!activeAddress) {
        Alert.alert("Alamat Belum Dipilih", "Tambahkan atau pilih alamat pengiriman terlebih dahulu.");
        return;
      }
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
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Harga paket</Text>
            <Text style={styles.detailValue}>{rp(subtotal)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ongkir pengiriman</Text>
            <Text style={styles.detailValue}>{rp(shippingFee)}</Text>
          </View>
          {tip > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tip driver</Text>
              <Text style={styles.detailValue}>+{rp(tip)}</Text>
            </View>
          )}
          {discount > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.discountLabel}>Promo {promoCode}</Text>
              <Text style={styles.discountValue}>-{rp(discount)}</Text>
            </View>
          )}
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalLabel}>Total pembayaran</Text>
            <Text style={styles.summaryTotalValue}>{rp(totalPrice)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>ALAMAT PENGIRIMAN</Text>
        <TouchableOpacity
          style={styles.addressCard}
          onPress={() => setAddressModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.addressIcon}>
            <MapPin size={17} color="#1B7A4E" />
          </View>
          <View style={styles.addressCopy}>
            <View style={styles.addressTitleRow}>
              <Text style={styles.addressLabel}>{activeAddress?.label || "Alamat utama"}</Text>
              <Text style={styles.changeAddressText}>Ubah</Text>
            </View>
            <Text style={styles.receiverText}>
              {activeAddress?.receiverName || "Belum ada penerima"} {activeAddress?.phoneNumber ? `· ${activeAddress.phoneNumber}` : ""}
            </Text>
            <Text style={styles.addressText} numberOfLines={2}>
              {activeAddress?.fullAddress || "Pilih alamat pengiriman"}
            </Text>
          </View>
          <ChevronDown size={17} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.shippingInfoCard}>
          <View style={styles.shippingIcon}>
            <Truck size={17} color="#1B7A4E" />
          </View>
          <View style={styles.shippingCopy}>
            <Text style={styles.shippingTitle}>Pengiriman catering</Text>
            <Text style={styles.shippingSubtitle}>Dikirim sesuai tanggal PO · Estimasi 08:00 - 10:00 WIB</Text>
          </View>
          <Text style={styles.shippingFeeText}>{rp(shippingFee)}</Text>
        </View>

        <Text style={styles.sectionTitle}>TIP DRIVER</Text>
        <View style={styles.tipCard}>
          <View style={styles.tipHeaderRow}>
            <View>
              <Text style={styles.tipTitle}>Berikan apresiasi untuk driver</Text>
              <Text style={styles.tipSubtitle}>100% tip diteruskan ke driver.</Text>
            </View>
            <Text style={styles.tipSelected}>{tip === 0 ? "Tidak ada" : rp(tip)}</Text>
          </View>
          <View style={styles.tipOptionsRow}>
            {[0, 2000, 5000, 10000].map(value => (
              <TouchableOpacity
                key={value}
                onPress={() => setTip(value)}
                style={[styles.tipOption, tip === value && styles.tipOptionActive]}
              >
                <Text style={[styles.tipOptionText, tip === value && styles.tipOptionTextActive]}>
                  {value === 0 ? "Tanpa tip" : rp(value)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>PROMO & VOUCHER</Text>
        <View style={styles.promoCard}>
          <View style={styles.promoInputRow}>
            <Tag size={17} color="#1B7A4E" />
            <TextInput
              value={promoInput}
              onChangeText={setPromoInput}
              placeholder="Masukkan kode promo"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              style={styles.promoInput}
            />
            <TouchableOpacity onPress={applyPromo} style={styles.promoApplyButton}>
              <Text style={styles.promoApplyText}>Pakai</Text>
            </TouchableOpacity>
          </View>
          {promoCode && <Text style={styles.promoSuccess}>{promoMessage}</Text>}
          {!promoCode && promoMessage && <Text style={styles.promoError}>{promoMessage}</Text>}
          <Text style={styles.promoHint}>Coba kode KAMOJANG atau RANGER10.</Text>
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

      <Modal
        visible={addressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.addressModalOverlay}>
          <View style={styles.addressSheet}>
            <View style={styles.addressSheetHeader}>
              <View>
                <Text style={styles.addressSheetTitle}>Pilih alamat pengiriman</Text>
                <Text style={styles.addressSheetSubtitle}>Pesanan catering akan dikirim ke alamat ini.</Text>
              </View>
              <TouchableOpacity onPress={() => setAddressModalVisible(false)} style={styles.closeButton}>
                <X size={17} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.addressList}>
              {addresses.map(address => {
                const isSelected = address.id === (activeAddress?.id || selectedAddressId);
                return (
                  <TouchableOpacity
                    key={address.id}
                    onPress={() => {
                      setSelectedAddressId(address.id);
                      setAddressModalVisible(false);
                    }}
                    style={[styles.addressOption, isSelected && styles.addressOptionActive]}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.addressOptionIcon, isSelected && styles.addressOptionIconActive]}>
                      <MapPin size={16} color={isSelected ? "#FFFFFF" : "#1B7A4E"} />
                    </View>
                    <View style={styles.addressOptionCopy}>
                      <Text style={styles.addressOptionLabel}>{address.label}</Text>
                      <Text style={styles.addressOptionReceiver}>{address.receiverName} · {address.phoneNumber}</Text>
                      <Text style={styles.addressOptionText} numberOfLines={2}>{address.fullAddress}</Text>
                    </View>
                    {isSelected && <Check size={18} color="#1B7A4E" />}
                  </TouchableOpacity>
                );
              })}
              {addresses.length === 0 && (
                <Text style={styles.emptyAddressText}>Belum ada alamat tersimpan. Tambahkan alamat dari menu Profil.</Text>
              )}
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 10,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 10,
    color: "#374151",
    fontWeight: "700",
  },
  discountLabel: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "700",
  },
  discountValue: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "900",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 10,
  },
  addressCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addressIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#E8F5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  addressCopy: {
    flex: 1,
  },
  addressTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressLabel: {
    fontSize: 11,
    color: "#111827",
    fontWeight: "900",
  },
  changeAddressText: {
    fontSize: 10,
    color: "#1B7A4E",
    fontWeight: "900",
  },
  receiverText: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "700",
    marginTop: 3,
  },
  addressText: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 14,
    marginTop: 3,
  },
  shippingInfoCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 16,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  shippingIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  shippingCopy: {
    flex: 1,
  },
  shippingTitle: {
    fontSize: 10,
    color: "#166534",
    fontWeight: "900",
  },
  shippingSubtitle: {
    fontSize: 9,
    color: "#4B7F60",
    lineHeight: 13,
    marginTop: 2,
  },
  shippingFeeText: {
    fontSize: 10,
    color: "#166534",
    fontWeight: "900",
  },
  tipCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 13,
    gap: 11,
  },
  tipHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  tipTitle: {
    fontSize: 11,
    color: "#111827",
    fontWeight: "800",
  },
  tipSubtitle: {
    fontSize: 9,
    color: "#9CA3AF",
    marginTop: 2,
  },
  tipSelected: {
    color: "#1B7A4E",
    fontSize: 10,
    fontWeight: "900",
  },
  tipOptionsRow: {
    flexDirection: "row",
    gap: 7,
  },
  tipOption: {
    flex: 1,
    minHeight: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tipOptionActive: {
    backgroundColor: "#E8F5EE",
    borderColor: "#1B7A4E",
  },
  tipOptionText: {
    color: "#6B7280",
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },
  tipOptionTextActive: {
    color: "#1B7A4E",
    fontWeight: "900",
  },
  promoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 13,
  },
  promoInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  promoInput: {
    flex: 1,
    height: 36,
    color: "#111827",
    fontSize: 11,
    fontWeight: "700",
  },
  promoApplyButton: {
    backgroundColor: "#E8F5EE",
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  promoApplyText: {
    color: "#1B7A4E",
    fontSize: 10,
    fontWeight: "900",
  },
  promoSuccess: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 5,
  },
  promoError: {
    color: "#B91C1C",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 5,
  },
  promoHint: {
    color: "#9CA3AF",
    fontSize: 9,
    marginTop: 5,
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
  addressModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.42)",
  },
  addressSheet: {
    maxHeight: "78%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  addressSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  addressSheetTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
  },
  addressSheetSubtitle: {
    color: "#9CA3AF",
    fontSize: 10,
    marginTop: 3,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  addressList: {
    gap: 10,
    paddingBottom: 8,
  },
  addressOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 12,
    gap: 9,
  },
  addressOptionActive: {
    borderColor: "#1B7A4E",
    backgroundColor: "#F0FDF4",
  },
  addressOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: "#E8F5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  addressOptionIconActive: {
    backgroundColor: "#1B7A4E",
  },
  addressOptionCopy: {
    flex: 1,
  },
  addressOptionLabel: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "900",
  },
  addressOptionReceiver: {
    color: "#6B7280",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 3,
  },
  addressOptionText: {
    color: "#4B5563",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },
  emptyAddressText: {
    color: "#9CA3AF",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    paddingVertical: 20,
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
