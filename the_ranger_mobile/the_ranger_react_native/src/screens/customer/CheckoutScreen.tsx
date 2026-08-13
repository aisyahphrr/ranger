import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Image,
} from "react-native";
import {
  MapPin,
  Edit3,
  Minus,
  Plus,
  Tag,
  Gift,
  Wallet,
  QrCode,
  Check,
  AlertCircle,
  ChevronRight,
  X,
  PlusCircle,
  Edit2,
  Trash2,
} from "lucide-react-native";
import { BackHeader } from "../../components/BackHeader";
import { Screen, CartItem, OrderItem, CustomerAddress } from "../../types";
import { rp } from "../../utils/formatters";

interface CheckoutScreenProps {
  navigate: (s: Screen) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  addresses: CustomerAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<CustomerAddress[]>>;
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  customerBalance: number;
  setCustomerBalance: React.Dispatch<React.SetStateAction<number>>;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  notifications: any[];
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  navigate,
  cart,
  setCart,
  orders,
  setOrders,
  addresses,
  setAddresses,
  selectedAddressId,
  setSelectedAddressId,
  setSelectedOrderId,
  customerBalance,
  setCustomerBalance,
  setNotifications,
  notifications,
}) => {
  const [payMethod, setPayMethod] = useState<"dompet" | "qris">("dompet");
  const [driverNote, setDriverNote] = useState("");
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(0);
  const [promoError, setPromoError] = useState("");

  // Address Modals
  const [addressListVisible, setAddressListVisible] = useState(false);
  const [addressFormVisible, setAddressFormVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);

  // Address Form fields
  const [label, setLabel] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [notes, setNotes] = useState("");

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  // Sync address changes
  const handleAddressTextChange = (text: string) => {
    if (activeAddress) {
      setAddresses(prev => prev.map(addr =>
        addr.id === activeAddress.id ? { ...addr, fullAddress: text } : addr
      ));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = cart.length > 0 ? 8000 : 0;
  const total = Math.max(0, subtotal + shippingFee + tip - discount);

  const handleUpdateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleApplyPromo = () => {
    const code = voucherInput.toUpperCase().trim();
    if (code === "BERSIH20") {
      setAppliedVoucher(code);
      setDiscount(Math.round(subtotal * 0.2));
      setPromoError("");
      Alert.alert("Sukses", "Voucher BERSIH20 berhasil diterapkan (Diskon 20%)!");
    } else if (code === "KAMOJANG") {
      setAppliedVoucher(code);
      setDiscount(Math.min(subtotal, 10000));
      setPromoError("");
      Alert.alert("Sukses", "Voucher KAMOJANG berhasil diterapkan (Potongan Rp 10.000)!");
    } else {
      setPromoError("Kode voucher tidak valid!");
      setAppliedVoucher(null);
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (payMethod === "dompet") {
      if (customerBalance < total) {
        Alert.alert("Gagal", "Saldo Dompet Rangers tidak mencukupi!");
        return;
      }
      
      // Deduct balance
      setCustomerBalance(prev => prev - total);

      const newOrderId = `RNG${Math.floor(100 + Math.random() * 900)}`;
      const firstItem = cart[0];
      const detailStr = cart.length > 1 ? `${firstItem.name} + ${cart.length - 1} item lainnya` : firstItem.name;

      const newOrder: OrderItem = {
        id: newOrderId,
        type: "Marketplace",
        iconName: "Store",
        color: "#1B7A4E",
        item: detailStr,
        detail: firstItem.store,
        status: "Diproses",
        statusColor: "orange",
        date: "Hari Ini",
        total: total,
        items: [...cart],
        address: activeAddress,
        notes: driverNote,
        discount: discount,
        deliveryFee: shippingFee,
        serviceFee: tip, // Use as tip driver
        paymentMethod: "Dompet Rangers",
      };

      setOrders(prev => [newOrder, ...prev]);
      setSelectedOrderId(newOrderId);
      setCart([]);

      // Create success notification
      const newNotif = {
        id: Date.now(),
        type: "order",
        title: "Pembayaran Berhasil! 🎉",
        msg: `Pesanan #${newOrderId} berhasil dibayar menggunakan Dompet Rangers.`,
        time: "Baru saja",
        read: false,
      };
      setNotifications(prev => [newNotif, ...prev]);

      navigate("c_tracking");
    } else {
      // Simulate QRIS screens or just create direct order
      const newOrderId = `RNG${Math.floor(100 + Math.random() * 900)}`;
      const firstItem = cart[0];
      const detailStr = cart.length > 1 ? `${firstItem.name} + ${cart.length - 1} item lainnya` : firstItem.name;

      const newOrder: OrderItem = {
        id: newOrderId,
        type: "Marketplace",
        iconName: "Store",
        color: "#1B7A4E",
        item: detailStr,
        detail: firstItem.store,
        status: "Diproses",
        statusColor: "orange",
        date: "Hari Ini",
        total: total,
        items: [...cart],
        address: activeAddress,
        notes: driverNote,
        discount: discount,
        deliveryFee: shippingFee,
        serviceFee: tip,
        paymentMethod: "Scan QRIS Otomatis",
      };

      setOrders(prev => [newOrder, ...prev]);
      setSelectedOrderId(newOrderId);
      setCart([]);

      // Create success notification
      const newNotif = {
        id: Date.now(),
        type: "order",
        title: "Pembayaran QRIS Sukses! 📲",
        msg: `Pesanan #${newOrderId} sukses dibayar via QRIS otomatis.`,
        time: "Baru saja",
        read: false,
      };
      setNotifications(prev => [newNotif, ...prev]);

      navigate("c_tracking");
    }
  };

  // Address logic
  const handleSaveAddress = () => {
    if (!label.trim() || !receiverName.trim() || !phoneNumber.trim() || !fullAddress.trim()) {
      Alert.alert("Input Salah", "Mohon lengkapi seluruh field wajib.");
      return;
    }

    if (editingAddress) {
      const updated = addresses.map(addr =>
        addr.id === editingAddress.id
          ? { ...addr, label, receiverName, phoneNumber, fullAddress, notes }
          : addr
      );
      setAddresses(updated);
      Alert.alert("Sukses", "Alamat berhasil diperbarui.");
    } else {
      const newAddr: CustomerAddress = {
        id: `addr_${Date.now()}`,
        label,
        receiverName,
        phoneNumber,
        fullAddress,
        notes,
        isMain: addresses.length === 0,
      };
      setAddresses([...addresses, newAddr]);
      setSelectedAddressId(newAddr.id);
      Alert.alert("Sukses", "Alamat baru berhasil ditambahkan.");
    }

    setLabel("");
    setReceiverName("");
    setPhoneNumber("");
    setFullAddress("");
    setNotes("");
    setEditingAddress(null);
    setAddressFormVisible(false);
  };

  const handleEditAddressClick = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    setLabel(addr.label);
    setReceiverName(addr.receiverName);
    setPhoneNumber(addr.phoneNumber);
    setFullAddress(addr.fullAddress);
    setNotes(addr.notes || "");
    setAddressFormVisible(true);
  };

  const handleDeleteAddress = (id: string) => {
    if (addresses.length <= 1) {
      Alert.alert("Gagal", "Anda harus memiliki minimal 1 alamat tersimpan.");
      return;
    }
    Alert.alert("Hapus Alamat", "Apakah Anda yakin ingin menghapus alamat ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          const filtered = addresses.filter(a => a.id !== id);
          setAddresses(filtered);
          if (selectedAddressId === id) {
            setSelectedAddressId(filtered[0].id);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Keranjang Belanja" onBack={() => navigate("c_home")} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Alamat Pengiriman */}
        <View style={styles.sectionCard}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <MapPin size={16} color="#1B7A4E" />
              <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
            </View>
            <TouchableOpacity onPress={() => setAddressListVisible(true)}>
              <Text style={styles.actionText}>Pilih Alamat</Text>
            </TouchableOpacity>
          </View>

          {activeAddress ? (
            <View style={styles.addressFormContainer}>
              <TextInput
                value={activeAddress.fullAddress}
                onChangeText={handleAddressTextChange}
                placeholder="Tulis alamat pengiriman secara detail..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
                style={styles.addressTextArea}
              />
              
              <View style={styles.driverNoteRow}>
                <Edit3 size={14} color="#6B7280" />
                <TextInput
                  value={driverNote}
                  onChangeText={setDriverNote}
                  placeholder="Catatan untuk driver (contoh: Pagar hitam, titip satpam)"
                  placeholderTextColor="#9CA3AF"
                  style={styles.driverNoteInput}
                />
              </View>
            </View>
          ) : (
            <View style={styles.emptyAddressBox}>
              <Text style={styles.emptyAddressText}>Belum ada alamat pengiriman.</Text>
              <TouchableOpacity
                style={styles.addAddressInlineBtn}
                onPress={() => {
                  setEditingAddress(null);
                  setAddressFormVisible(true);
                }}
              >
                <Plus size={14} color="#1B7A4E" />
                <Text style={styles.addAddressInlineBtnText}>Tambah Alamat</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 2. Daftar Produk */}
        {cart.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderTitle}>Daftar Produk</Text>
            {cart.map(item => (
              <View key={item.id} style={styles.cartItemRow}>
                <Image source={{ uri: item.img }} style={styles.productImg as any} />
                <View style={styles.productDetails}>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.productStore} numberOfLines={1}>{item.store}</Text>
                  <Text style={styles.productPrice}>{rp(item.price)}</Text>
                </View>
                <View style={styles.qtyContainer}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQty(item.id, -1)}
                  >
                    <Minus size={12} color="#111827" />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleUpdateQty(item.id, 1)}
                  >
                    <Plus size={12} color="#111827" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 3. Promo / Voucher */}
        <View style={styles.sectionCard}>
          <View style={styles.titleRow}>
            <Tag size={16} color="#1B7A4E" />
            <Text style={styles.sectionTitle}>Makin Hemat Pakai Promo</Text>
          </View>
          <View style={styles.promoInputRow}>
            <TextInput
              value={voucherInput}
              onChangeText={setVoucherInput}
              placeholder="Masukkan kode voucher (BERSIH20 / KAMOJANG)"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              style={styles.promoInput}
            />
            <TouchableOpacity style={styles.promoApplyBtn} onPress={handleApplyPromo}>
              <Text style={styles.promoApplyText}>Terapkan</Text>
            </TouchableOpacity>
          </View>
          {appliedVoucher && (
            <Text style={styles.promoSuccessText}>
              ✓ Voucher {appliedVoucher} berhasil digunakan! Potongan {rp(discount)}.
            </Text>
          )}
          {promoError ? (
            <Text style={styles.promoErrorText}>✗ {promoError}</Text>
          ) : null}
        </View>

        {/* 4. Tip Driver */}
        <View style={styles.sectionCard}>
          <View style={styles.titleRow}>
            <Gift size={16} color="#1B7A4E" />
            <Text style={styles.sectionTitle}>Kasi Tip Apresiasi ke Driver</Text>
          </View>
          <Text style={styles.tipDesc}>
            Tip 100% akan diteruskan kepada Rangers Driver untuk mengapresiasi jasanya.
          </Text>
          <View style={styles.tipPillsRow}>
            {[0, 2000, 5000, 10000].map(val => {
              const active = tip === val;
              return (
                <TouchableOpacity
                  key={val}
                  onPress={() => setTip(val)}
                  style={[styles.tipPill, active && styles.tipPillActive]}
                >
                  <Text style={[styles.tipPillText, active && styles.tipPillTextActive]}>
                    {val === 0 ? "Tanpa Tip" : `+${val.toLocaleString("id-ID")}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. Pilih Metode Pembayaran */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Pilih Metode Pembayaran</Text>
          <View style={styles.payOptionList}>
            {/* Dompet Rangers */}
            <TouchableOpacity
              onPress={() => setPayMethod("dompet")}
              style={[styles.payOptionCard, payMethod === "dompet" && styles.payOptionCardActive]}
            >
              <View style={styles.payOptionLeft}>
                <Wallet size={20} color={payMethod === "dompet" ? "#1B7A4E" : "#9CA3AF"} />
                <View style={styles.payOptionInfo}>
                  <Text style={styles.payOptionName}>Dompet Rangers</Text>
                  <Text style={styles.payOptionDescText}>Saldo: {rp(customerBalance)}</Text>
                </View>
              </View>
              <View style={[styles.checkCircle, payMethod === "dompet" && styles.checkCircleActive]}>
                {payMethod === "dompet" && <Check size={12} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>

            {/* Scan QRIS Otomatis */}
            <TouchableOpacity
              onPress={() => setPayMethod("qris")}
              style={[styles.payOptionCard, payMethod === "qris" && styles.payOptionCardActive]}
            >
              <View style={styles.payOptionLeft}>
                <QrCode size={20} color={payMethod === "qris" ? "#1B7A4E" : "#9CA3AF"} />
                <View style={styles.payOptionInfo}>
                  <Text style={styles.payOptionName}>Scan QRIS Otomatis</Text>
                  <Text style={styles.payOptionDescText}>Bayar aman instan lewat e-wallet/bank</Text>
                </View>
              </View>
              <View style={[styles.checkCircle, payMethod === "qris" && styles.checkCircleActive]}>
                {payMethod === "qris" && <Check size={12} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. Rincian Pembayaran */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Rincian Pembayaran</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal Produk</Text>
            <Text style={styles.priceValue}>{rp(subtotal)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Ongkos Kirim Kurir</Text>
            <Text style={styles.priceValue}>{rp(shippingFee)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabelPromo}>Diskon Voucher ({appliedVoucher})</Text>
              <Text style={styles.priceValuePromo}>-{rp(discount)}</Text>
            </View>
          )}
          {tip > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Apresiasi Tip Kurir</Text>
              <Text style={styles.priceValue}>+{rp(tip)}</Text>
            </View>
          )}
          <View style={styles.lineDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValueText}>{rp(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Pay Panel */}
      {cart.length > 0 && (
        <View style={styles.bottomBar}>
          {payMethod === "dompet" && customerBalance < total && (
            <View style={styles.warningBanner}>
              <AlertCircle size={14} color="#EF4444" />
              <Text style={styles.warningBannerText}>
                Saldo Dompet Rangers kurang {rp(total - customerBalance)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleCheckout}
            disabled={payMethod === "dompet" && customerBalance < total}
            style={[styles.checkoutBtn, payMethod === "dompet" && customerBalance < total && styles.checkoutBtnDisabled]}
            activeOpacity={0.9}
          >
            <Text style={styles.checkoutBtnText}>Bayar Sekarang ({rp(total)})</Text>
            <ChevronRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL 1: ADDRESS LIST SELECTOR */}
      <Modal visible={addressListVisible} transparent animationType="slide">
        <View style={styles.modalBgBottom}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Pilih Alamat Pengiriman</Text>
              <TouchableOpacity onPress={() => setAddressListVisible(false)}>
                <X size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.addressListScroll} showsVerticalScrollIndicator={false}>
              {addresses.map(addr => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <View
                    key={addr.id}
                    style={[styles.addressItemCard, isSelected && styles.addressItemCardSelected]}
                  >
                    <TouchableOpacity
                      style={styles.addressItemPressable}
                      onPress={() => {
                        setSelectedAddressId(addr.id);
                        setAddressListVisible(false);
                      }}
                    >
                      <View style={styles.addressHeaderRow}>
                        <Text style={styles.addressItemLabel}>{addr.label}</Text>
                        {addr.isMain && <Text style={styles.mainBadge}>Utama</Text>}
                      </View>
                      <Text style={styles.addressItemReceiver}>
                        {addr.receiverName} · {addr.phoneNumber}
                      </Text>
                      <Text style={styles.addressItemFull}>{addr.fullAddress}</Text>
                    </TouchableOpacity>

                    <View style={styles.addressActionsRow}>
                      <TouchableOpacity
                        style={styles.addressActionBtnIcon}
                        onPress={() => handleEditAddressClick(addr)}
                      >
                        <Edit2 size={14} color="#4B5563" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.addressActionBtnIcon}
                        onPress={() => handleDeleteAddress(addr.id)}
                      >
                        <Trash2 size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={() => {
                setEditingAddress(null);
                setLabel("");
                setReceiverName("");
                setPhoneNumber("");
                setFullAddress("");
                setNotes("");
                setAddressFormVisible(true);
              }}
            >
              <PlusCircle size={16} color="#FFFFFF" />
              <Text style={styles.addAddressBtnText}>Tambah Alamat Baru</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: ADDRESS FORM (ADD / EDIT) */}
      <Modal visible={addressFormVisible} transparent animationType="slide">
        <View style={styles.modalBgBottom}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {editingAddress ? "Edit Alamat" : "Tambah Alamat Baru"}
              </Text>
              <TouchableOpacity onPress={() => setAddressFormVisible(false)}>
                <X size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Label Alamat (Wajib)</Text>
              <TextInput
                style={styles.formInput}
                value={label}
                onChangeText={setLabel}
                placeholder="Contoh: Rumah, Kantor, Kos"
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.formLabel}>Nama Penerima (Wajib)</Text>
              <TextInput
                style={styles.formInput}
                value={receiverName}
                onChangeText={setReceiverName}
                placeholder="Masukkan nama lengkap penerima"
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.formLabel}>Nomor HP Penerima (Wajib)</Text>
              <TextInput
                style={styles.formInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Contoh: 08123456789"
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.formLabel}>Alamat Lengkap (Wajib)</Text>
              <TextInput
                style={[styles.formInput, styles.formInputArea]}
                value={fullAddress}
                onChangeText={setFullAddress}
                placeholder="Masukkan alamat jalan, nomor rumah, RT/RW, desa/kecamatan"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.formBtn, styles.formBtnOutline]}
                  onPress={() => setAddressFormVisible(false)}
                >
                  <Text style={styles.formBtnTextOutline}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formBtn, styles.formBtnSolid]}
                  onPress={handleSaveAddress}
                >
                  <Text style={styles.formBtnTextSolid}>Simpan</Text>
                </TouchableOpacity>
              </View>
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
    paddingBottom: 110,
    gap: 12,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1E293B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1B7A4E",
  },
  addressFormContainer: {
    gap: 10,
  },
  addressTextArea: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 12,
    fontSize: 12,
    color: "#1E293B",
    fontFamily: "System",
    fontWeight: "500",
    borderWidth: 1,
    borderColor: "transparent",
    textAlignVertical: "top",
    minHeight: 56,
  },
  driverNoteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 40,
  },
  driverNoteInput: {
    flex: 1,
    fontSize: 11,
    color: "#1E293B",
    fontWeight: "500",
  },
  emptyAddressBox: {
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  emptyAddressText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  addAddressInlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#1B7A4E",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addAddressInlineBtnText: {
    color: "#1B7A4E",
    fontSize: 11,
    fontWeight: "700",
  },
  cartItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  productImg: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  productName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },
  productStore: {
    fontSize: 10,
    color: "#6B7280",
  },
  productPrice: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1B7A4E",
    marginTop: 2,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
    width: 16,
    textAlign: "center",
  },
  promoInputRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  promoInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "500",
  },
  promoApplyBtn: {
    backgroundColor: "#1B7A4E",
    borderRadius: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  promoApplyText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  promoSuccessText: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "700",
    marginTop: 8,
  },
  promoErrorText: {
    fontSize: 10,
    color: "#DC2626",
    fontWeight: "700",
    marginTop: 8,
  },
  tipDesc: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
    marginBottom: 8,
  },
  tipPillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  tipPill: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  tipPillActive: {
    backgroundColor: "#1B7A4E",
    borderColor: "#1B7A4E",
  },
  tipPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6B7280",
  },
  tipPillTextActive: {
    color: "#FFFFFF",
  },
  payOptionList: {
    gap: 10,
  },
  payOptionCard: {
    width: "100%",
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  payOptionCardActive: {
    borderColor: "#1B7A4E",
    backgroundColor: "rgba(27, 122, 78, 0.05)",
  },
  payOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  payOptionInfo: {
    gap: 2,
  },
  payOptionName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },
  payOptionDescText: {
    fontSize: 10,
    color: "#6B7280",
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleActive: {
    borderColor: "#1B7A4E",
    backgroundColor: "#1B7A4E",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  priceLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  priceLabelPromo: {
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "600",
  },
  priceValuePromo: {
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "800",
  },
  lineDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },
  totalValueText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    gap: 10,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  warningBannerText: {
    fontSize: 10,
    color: "#DC2626",
    fontWeight: "600",
  },
  checkoutBtn: {
    width: "100%",
    height: 48,
    backgroundColor: "#1B7A4E",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#1B7A4E",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  checkoutBtnDisabled: {
    backgroundColor: "#E5E7EB",
  },
  checkoutBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  // Dialog select address sheets styles
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
  addressListScroll: {
    maxHeight: 350,
  },
  addressItemCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
    padding: 14,
    marginBottom: 10,
  },
  addressItemCardSelected: {
    borderColor: "#1B7A4E",
    backgroundColor: "rgba(27, 122, 78, 0.05)",
  },
  addressItemPressable: {
    gap: 2,
  },
  addressHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  addressItemLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },
  mainBadge: {
    backgroundColor: "#E8F5EE",
    color: "#1B7A4E",
    fontSize: 9,
    fontWeight: "800",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  addressItemReceiver: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4B5563",
  },
  addressItemFull: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
  },
  addressActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },
  addressActionBtnIcon: {
    padding: 4,
  },
  addAddressBtn: {
    backgroundColor: "#1B7A4E",
    borderRadius: 14,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
  },
  addAddressBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  formScroll: {
    maxHeight: 450,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
    marginTop: 8,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    height: 38,
    fontSize: 12,
    color: "#111827",
    marginBottom: 6,
  },
  formInputArea: {
    height: 64,
    textAlignVertical: "top",
    paddingVertical: 8,
  },
  formActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    marginBottom: 10,
  },
  formBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  formBtnOutline: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  formBtnSolid: {
    backgroundColor: "#1B7A4E",
  },
  formBtnTextOutline: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "800",
  },
  formBtnTextSolid: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
