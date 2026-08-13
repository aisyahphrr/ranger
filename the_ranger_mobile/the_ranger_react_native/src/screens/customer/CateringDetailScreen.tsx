import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Screen, Product } from "../../types";
import { BackHeader } from "../../components/BackHeader";
import { Stars } from "../../components/Stars";
import { rp } from "../../utils/formatters";
import { MessageSquare, Plus, Minus, Calendar, AlignLeft, Star, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react-native";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const WEEKDAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const dateOnly = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatBookingDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
};

const parseBookingDate = (value: string) => {
  const parts = value.includes("/")
    ? value.split("/").map(Number)
    : value.split("-").map(Number).reverse();
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  const [day, month, year] = parts;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ? dateOnly(date)
    : null;
};

const getCalendarDays = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [
    ...Array<Date | null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) =>
      new Date(month.getFullYear(), month.getMonth(), index + 1)
    ),
  ];
};

const getMerchantCateringProducts = (merchantName: string): Product[] => {
  if (merchantName === "Saung Sunda Asli") {
    return [
      {
        id: 101,
        name: "Paket A - Timbel Ayam Bakar",
        store: "Saung Sunda Asli",
        price: 25000,
        rating: 4.9,
        sold: 180,
        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop",
        liked: false,
        cat: "Nasi Box",
        description: "Nasi timbel wangi daun pisang, ayam bakar madu empuk, tahu tempe goreng, lalapan segar & sambal terasi."
      },
      {
        id: 102,
        name: "Paket B - Liwet Kakap Bakar",
        store: "Saung Sunda Asli",
        price: 35000,
        rating: 4.8,
        sold: 95,
        img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop",
        liked: false,
        cat: "Nasi Box",
        description: "Nasi liwet gurih teri pete, kakap bakar bumbu kuning, bakwan jagung, sambal cobek terasi."
      },
      {
        id: 103,
        name: "Tumpeng Sunda Tampah Premium",
        store: "Saung Sunda Asli",
        price: 450000,
        rating: 4.9,
        sold: 12,
        img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop",
        liked: false,
        cat: "Tumpeng",
        description: "Tumpeng dengan nasi kuning/liwet tampah, ayam bakar 10 potong, urap sayur, tempe oreg, sambal."
      }
    ];
  } else {
    return [
      {
        id: 201,
        name: "Paket Nasi Box Syukuran",
        store: "Catering Bu Haji Nani",
        price: 30000,
        rating: 4.9,
        sold: 210,
        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop",
        liked: false,
        cat: "Nasi Box",
        description: "Nasi kuning wangi, ayam goreng lengkuas, sambal goreng kentang ati, telur balado, kerupuk udang."
      },
      {
        id: 202,
        name: "Tumpeng Kuning Premium Bu Haji",
        store: "Catering Bu Haji Nani",
        price: 650000,
        rating: 4.8,
        sold: 84,
        img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop",
        liked: false,
        cat: "Tumpeng",
        description: "Tumpeng ukuran besar lengkap dengan hiasan, ayam kuning 20 potong, perkedel kentang, mie..."
      },
      {
        id: 203,
        name: "Paket Bento Box Ayam Teriyaki",
        store: "Catering Bu Haji Nani",
        price: 22000,
        rating: 4.6,
        sold: 135,
        img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop",
        liked: false,
        cat: "Bento",
        description: "Nasi putih, chicken teriyaki premium, salad kol wortel, crispy eggroll, buah potong."
      }
    ];
  }
};

const getMockReviews = (name: string) => [
  { initial: "A", name: "Asep Kurniawan", date: "12 Jan 2026", rating: 5, text: "Makanannya enak sekali, porsi tumpengnya sangat besar dan hiasannya rapi. Pengantaran tepat waktu." },
  { initial: "R", name: "Rina Kartika", date: "10 Jan 2026", rating: 4, text: "Paket Nasi Box Syukuran lauk pauk komplit, bumbu ayam lengkuas meresap. Sangat recommended." },
  { initial: "D", name: "Dedi Sunandar", date: "05 Jan 2026", rating: 5, text: "Sangat direkomendasikan untuk acara rapat kantor. Porsinya pas dan rasanya lezat." }
];

interface CateringDetailScreenProps {
  navigate: (s: Screen) => void;
  selectedMerchant: any;
  setSelectedCateringPO: (po: any) => void;
  selectedProduct: Product | null;
  selectedCateringPO?: any;
}

export const CateringDetailScreen: React.FC<CateringDetailScreenProps> = ({
  navigate,
  selectedMerchant,
  setSelectedCateringPO,
  selectedProduct,
  selectedCateringPO,
}) => {
  const [activeTab, setActiveTab] = useState<"menu" | "review" | "info">("menu");
  
  const merchantName = selectedMerchant?.name || "Catering Bu Haji Nani";
  const packages = getMerchantCateringProducts(merchantName);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDay = String(tomorrow.getDate()).padStart(2, "0");
  const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const tomorrowYear = tomorrow.getFullYear();
  const tomorrowFormatted = `${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}`;

  const isPoMatching = selectedCateringPO && selectedCateringPO.merchant?.name === merchantName;

  const [showCheckoutForm, setShowCheckoutForm] = useState(isPoMatching ? true : false);
  
  // Pre-select the clicked package if it belongs to this merchant, otherwise fallback to packages[0]
  const [selectedPackage, setSelectedPackage] = useState<Product | null>(
    isPoMatching && selectedCateringPO.package
      ? packages.find(pkg => pkg.id === selectedCateringPO.package.id) || selectedCateringPO.package
      : (selectedProduct && selectedProduct.store === merchantName
          ? packages.find(pkg => pkg.name === selectedProduct.name) || selectedProduct
          : (packages[0] || null))
  );
  const isTumpeng = selectedPackage?.cat === "Tumpeng";

  const [paxCount, setPaxCount] = useState(
    isPoMatching ? selectedCateringPO.paxCount : (isTumpeng ? 1 : 10)
  );
  const [bookingDate, setBookingDate] = useState(
    isPoMatching ? selectedCateringPO.bookingDate : tomorrowFormatted
  );
  const [note, setNote] = useState(
    isPoMatching ? selectedCateringPO.note : ""
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initialDate = parseBookingDate(isPoMatching ? selectedCateringPO.bookingDate : tomorrowFormatted);
    const date = initialDate || dateOnly(tomorrow);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const minimumBookingDate = dateOnly(tomorrow);
  const selectedBookingDate = parseBookingDate(bookingDate);

  const openDatePicker = () => {
    const dateToShow = selectedBookingDate || minimumBookingDate;
    setCalendarMonth(new Date(dateToShow.getFullYear(), dateToShow.getMonth(), 1));
    setShowDatePicker(true);
  };

  const selectBookingDate = (date: Date) => {
    if (dateOnly(date) < minimumBookingDate) return;
    setBookingDate(formatBookingDate(date));
    setShowDatePicker(false);
  };

  const moveCalendarMonth = (offset: number) => {
    const nextMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + offset,
      1
    );
    const firstAllowedMonth = new Date(
      minimumBookingDate.getFullYear(),
      minimumBookingDate.getMonth(),
      1
    );
    if (nextMonth < firstAllowedMonth) return;
    setCalendarMonth(nextMonth);
  };

  const handleSelectPackage = (p: Product) => {
    setSelectedPackage(p);
    setPaxCount(p.cat === "Tumpeng" ? 1 : 10);
  };

  const handlePesanSekarang = () => {
    if (!selectedPackage) {
      Alert.alert("Perhatian", "Silakan pilih salah satu paket menu terlebih dahulu.");
      return;
    }
    if (!bookingDate) {
      Alert.alert("Perhatian", "Silakan pilih hari pengiriman katering.");
      return;
    }
    const selectedDate = parseBookingDate(bookingDate);
    if (!selectedDate || selectedDate < minimumBookingDate) {
      Alert.alert("Perhatian", "Tanggal pengiriman minimal mulai besok.");
      return;
    }

    const poDetails = {
      merchant: selectedMerchant,
      package: selectedPackage,
      paxCount: paxCount,
      bookingDate: bookingDate,
      note: note,
      totalPrice: selectedPackage.price * paxCount,
    };

    setSelectedCateringPO(poDetails);
    navigate("c_catering_payment");
  };


  return (
    <SafeAreaView style={styles.container}>
      {showCheckoutForm ? (
        <View style={styles.customHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowCheckoutForm(false)} activeOpacity={0.7}>
            <ArrowLeft size={20} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>{merchantName}</Text>
            <Text style={styles.headerSubtitle}>Detail PO & Booking Catering</Text>
          </View>
          <View style={styles.rightContainer} />
        </View>
      ) : (
        <BackHeader
          title={merchantName}
          onBack={() => navigate("c_catering")}
        />
      )}

      {/* Tabs selector */}
      <View style={styles.tabsRow}>
        {[
          { label: "Menu Katering", val: "menu" },
          { label: "Ulasan Komunitas", val: "review" },
          { label: "Informasi Toko", val: "info" }
        ].map(t => (
          <TouchableOpacity
            key={t.val}
            onPress={() => setActiveTab(t.val as any)}
            style={[styles.tabBtn, activeTab === t.val && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === t.val && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {activeTab === "menu" && (
          <View style={styles.menuTabContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Daftar Paket Menu PO</Text>
              <Text style={styles.sectionCountText}>{packages.length} paket tersedia</Text>
            </View>

            <View style={styles.packagesCol}>
              {packages.map(p => {
                const isSelected = selectedPackage?.id === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => handleSelectPackage(p)}
                    style={[styles.packageCard, isSelected && styles.packageCardActive]}
                    activeOpacity={0.9}
                  >
                    <Image source={{ uri: p.img }} style={styles.packageImg} />
                    <View style={styles.packageBody}>
                      <View style={styles.packageTitleRow}>
                        <Text style={styles.packageName} numberOfLines={1}>{p.name}</Text>
                        {isSelected && (
                          <View style={styles.pilihanBadge}>
                            <Text style={styles.pilihanBadgeText}>Pilihan</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.packageDesc} numberOfLines={2}>{p.description}</Text>
                      <View style={styles.packagePriceRow}>
                        <View style={styles.catBadge}>
                          <Text style={styles.catBadgeText}>{p.cat}</Text>
                        </View>
                        <Text style={styles.packagePrice}>
                          {rp(p.price)}
                          <Text style={styles.pricePerText}>{p.cat === "Tumpeng" ? "/unit" : "/pax"}</Text>
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Pre-Order Configuration Panel */}
            {selectedPackage && showCheckoutForm && (
              <View style={styles.poConfigCard}>
                <Text style={styles.poConfigTitle}>Kustomisasi Pre-Order (PO)</Text>

                {/* Portion Counter */}
                <View style={styles.counterRow}>
                  <View>
                    <Text style={styles.counterLabel}>{isTumpeng ? "Jumlah Unit" : "Jumlah Pax (Porsi)"}</Text>
                    <Text style={styles.counterSub}>{isTumpeng ? "Minimal pemesanan 1 unit" : "Minimal pemesanan katering box 10 porsi"}</Text>
                  </View>
                  <View style={styles.counterControl}>
                    <TouchableOpacity
                      onPress={() => setPaxCount((prev: number) => Math.max(isTumpeng ? 1 : 10, prev - (isTumpeng ? 1 : 5)))}
                      style={styles.counterBtn}
                    >
                      <Minus size={14} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.counterVal}>{paxCount}</Text>
                    <TouchableOpacity
                      onPress={() => setPaxCount((prev: number) => prev + (isTumpeng ? 1 : 5))}
                      style={styles.counterBtn}
                    >
                      <Plus size={14} color="#111827" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Date Picker Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelRow}>
                    <Text style={styles.inputLabel}>Pilih Hari Pengiriman</Text>
                    <Text style={styles.reqText}>*Min. H-1</Text>
                  </View>
                  <TouchableOpacity
                    onPress={openDatePicker}
                    style={styles.dateInputWrapper}
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityLabel="Pilih hari pengiriman"
                  >
                    <Calendar size={14} color="#9CA3AF" style={styles.dateIcon} />
                    <Text style={styles.dateValue}>{bookingDate || "Pilih tanggal"}</Text>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Seller Note */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Catatan untuk Penjual</Text>
                  <View style={styles.dateInputWrapper}>
                    <AlignLeft size={14} color="#9CA3AF" style={styles.dateIcon} />
                    <TextInput
                      value={note}
                      onChangeText={setNote}
                      placeholder="Contoh: Minta sendok plastik, sambal dipisah, dll."
                      placeholderTextColor="#9CA3AF"
                      style={styles.textInput}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {activeTab === "review" && (
          <View style={styles.reviewTabContainer}>
            <Text style={styles.sectionTitle}>Ulasan Pelanggan</Text>
            <View style={styles.reviewsList}>
              {getMockReviews(merchantName).map((rev, idx) => (
                <View key={idx} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewProfileRow}>
                      <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{rev.initial}</Text>
                      </View>
                      <Text style={styles.reviewerName}>{rev.name}</Text>
                    </View>
                    <Text style={styles.reviewDate}>{rev.date}</Text>
                  </View>
                  <View style={styles.starsRow}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={10} color="#FBBF24" fill="#FBBF24" style={styles.miniStar} />
                    ))}
                  </View>
                  <Text style={styles.reviewText}>"{rev.text}"</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "info" && (
          <View style={styles.infoTabContainer}>
            <Text style={styles.sectionTitle}>Informasi Toko</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cuisine & Kategori</Text>
                <Text style={styles.infoValue}>{selectedMerchant?.cuisine || "Masakan Sunda & Prasmanan"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Jarak dari Lokasi Anda</Text>
                <Text style={styles.infoValue}>📍 {selectedMerchant?.distance || 0.6} km</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Minimum Pembelian</Text>
                <Text style={styles.infoValue}>{rp(selectedMerchant?.minOrder || 30000)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Jam Operasional</Text>
                <Text style={styles.infoValue}>⏰ 08:00 - 19:00 WIB</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Deskripsi Layanan</Text>
                <Text style={styles.infoDesc}>
                  Menyediakan aneka sajian katering sehat dan bersih yang diolah secara higienis oleh chef berpengalaman di Kamojang. Cocok untuk hidangan syukuran, rapat kantor, gathering komunitas, maupun konsumsi harian keluarga.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable
          style={styles.calendarModalOverlay}
          onPress={() => setShowDatePicker(false)}
        >
          <Pressable
            style={styles.calendarModalCard}
            onPress={event => event.stopPropagation()}
          >
            <View style={styles.calendarModalHeader}>
              <View>
                <Text style={styles.calendarModalTitle}>Pilih Hari Pengiriman</Text>
                <Text style={styles.calendarModalSubtitle}>Minimal pengiriman mulai besok</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.calendarCloseButton}
                accessibilityRole="button"
                accessibilityLabel="Tutup kalender"
              >
                <Text style={styles.calendarCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calendarMonthRow}>
              <TouchableOpacity
                onPress={() => moveCalendarMonth(-1)}
                disabled={
                  calendarMonth.getFullYear() === minimumBookingDate.getFullYear() &&
                  calendarMonth.getMonth() === minimumBookingDate.getMonth()
                }
                style={styles.calendarNavButton}
                accessibilityRole="button"
                accessibilityLabel="Bulan sebelumnya"
              >
                <ChevronLeft
                  size={18}
                  color={
                    calendarMonth.getFullYear() === minimumBookingDate.getFullYear() &&
                    calendarMonth.getMonth() === minimumBookingDate.getMonth()
                      ? "#D1D5DB"
                      : "#1B7A4E"
                  }
                />
              </TouchableOpacity>
              <Text style={styles.calendarMonthTitle}>
                {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
              </Text>
              <TouchableOpacity
                onPress={() => moveCalendarMonth(1)}
                style={styles.calendarNavButton}
                accessibilityRole="button"
                accessibilityLabel="Bulan berikutnya"
              >
                <ChevronRight size={18} color="#1B7A4E" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarWeekRow}>
              {WEEKDAY_NAMES.map(day => (
                <Text key={day} style={styles.calendarWeekday}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarDaysGrid}>
              {getCalendarDays(calendarMonth).map((date, index) => {
                if (!date) return <View key={`empty-${index}`} style={styles.calendarDayCell} />;

                const isPastDate = dateOnly(date) < minimumBookingDate;
                const isSelected = selectedBookingDate?.getTime() === date.getTime();
                return (
                  <TouchableOpacity
                    key={date.toISOString()}
                    onPress={() => selectBookingDate(date)}
                    disabled={isPastDate}
                    style={[
                      styles.calendarDayCell,
                      isSelected && styles.calendarDaySelected,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Tanggal ${formatBookingDate(date)}`}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        isPastDate && styles.calendarDayDisabled,
                        isSelected && styles.calendarDaySelectedText,
                      ]}
                    >
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.calendarSelectedDate}>
              Tanggal dipilih: {bookingDate || "Belum dipilih"}
            </Text>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Sticky Bottom Summary/CTA */}
      {selectedPackage && activeTab === "menu" && (
        <View style={styles.stickyBottomBar}>
          {showCheckoutForm ? (
            <>
              <View style={styles.paymentCol}>
                <Text style={styles.totalPOText}>TOTAL PEMBAYARAN PO</Text>
                <Text style={styles.totalPOValue}>{rp(selectedPackage.price * paxCount)}</Text>
              </View>
              <View style={styles.btnRow}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert("Chat Admin", `Membuka ruang chat dengan admin ${merchantName}.`);
                  }}
                  style={styles.chatAdminBtn}
                >
                  <MessageSquare size={13} color="#1B7A4E" />
                  <Text style={styles.chatAdminBtnText}>Chat Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePesanSekarang}
                  style={styles.orderPOBtn}
                >
                  <Text style={styles.orderPOBtnText}>Pesan Sekarang (PO)</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.paymentCol}>
                <Text style={styles.totalPOText}>HARGA PAKET</Text>
                <View style={styles.priceRowSimple}>
                  <Text style={styles.totalPOValue}>{rp(selectedPackage.price)}</Text>
                  <Text style={styles.pricePerTextSimple}>{selectedPackage.cat === "Tumpeng" ? " / unit" : " / pax"}</Text>
                </View>
              </View>
              <View style={styles.btnRow}>
                <TouchableOpacity
                  onPress={() => setShowCheckoutForm(true)}
                  style={styles.checkoutSekarangBtn}
                >
                  <Text style={styles.checkoutSekarangBtnText}>Checkout Sekarang</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#1B7A4E",
    fontWeight: "800",
  },
  body: {
    flex: 1,
  },
  menuTabContainer: {
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
  },
  sectionCountText: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
  },
  packagesCol: {
    gap: 10,
  },
  packageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    flexDirection: "row",
    gap: 12,
  },
  packageCardActive: {
    borderColor: "#1B7A4E",
    borderWidth: 1.5,
  },
  packageImg: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  packageBody: {
    flex: 1,
    justifyContent: "space-between",
  },
  packageTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  packageName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    flex: 1,
  },
  pilihanBadge: {
    backgroundColor: "#1B7A4E",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  pilihanBadgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  packageDesc: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 14,
    marginVertical: 4,
  },
  packagePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catBadge: {
    backgroundColor: "rgba(27,122,78,0.08)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  catBadgeText: {
    color: "#1B7A4E",
    fontSize: 8,
    fontWeight: "800",
  },
  packagePrice: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  pricePerText: {
    color: "#9CA3AF",
    fontSize: 8,
    fontWeight: "500",
  },
  poConfigCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginTop: 16,
    gap: 14,
  },
  poConfigTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 8,
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counterLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1E293B",
  },
  counterSub: {
    fontSize: 9,
    color: "#9CA3AF",
    marginTop: 2,
  },
  counterControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  counterBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  counterVal: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    width: 24,
    textAlign: "center",
  },
  inputContainer: {
    gap: 6,
  },
  inputLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1E293B",
  },
  reqText: {
    color: "#EF4444",
    fontSize: 9,
    fontWeight: "800",
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  dateIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: "#1E293B",
  },
  dateValue: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#1E293B",
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  calendarModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  calendarModalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  calendarModalTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },
  calendarModalSubtitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 4,
  },
  calendarCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarCloseText: {
    color: "#6B7280",
    fontSize: 22,
    fontWeight: "400",
    lineHeight: 24,
  },
  calendarMonthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  calendarMonthTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  calendarNavButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F0F8F3",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarWeekRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  calendarWeekday: {
    width: "14.2857%",
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 10,
    fontWeight: "800",
  },
  calendarDaysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 4,
  },
  calendarDayCell: {
    width: "14.2857%",
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  calendarDayText: {
    color: "#1E293B",
    fontSize: 11,
    fontWeight: "700",
  },
  calendarDayDisabled: {
    color: "#D1D5DB",
  },
  calendarDaySelected: {
    backgroundColor: "#1B7A4E",
  },
  calendarDaySelectedText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  calendarSelectedDate: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    color: "#6B7280",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  reviewTabContainer: {
    padding: 16,
  },
  reviewsList: {
    gap: 10,
    marginTop: 10,
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    padding: 14,
    gap: 4,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(27,122,78,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#1B7A4E",
    fontSize: 10,
    fontWeight: "900",
  },
  reviewerName: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1E293B",
  },
  reviewDate: {
    fontSize: 9,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  starsRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
  miniStar: {
    marginRight: 2,
  },
  reviewText: {
    fontSize: 10,
    color: "#4B5563",
    lineHeight: 14,
    fontStyle: "italic",
  },
  infoTabContainer: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 10,
    gap: 3,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E293B",
  },
  infoDesc: {
    fontSize: 11,
    color: "#4B5563",
    lineHeight: 16,
  },
  stickyBottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  paymentCol: {
    gap: 2,
  },
  totalPOText: {
    fontSize: 8,
    color: "#9CA3AF",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  totalPOValue: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  btnRow: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  chatAdminBtn: {
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#1B7A4E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  chatAdminBtnText: {
    color: "#1B7A4E",
    fontSize: 11,
    fontWeight: "800",
  },
  orderPOBtn: {
    flex: 1,
    height: 40,
    backgroundColor: "#1B7A4E",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  orderPOBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  customHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    width: 32,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 1,
    textAlign: "center",
  },
  checkoutSekarangBtn: {
    flex: 1,
    height: 40,
    backgroundColor: "#1B7A4E",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutSekarangBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  priceRowSimple: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  pricePerTextSimple: {
    color: "#9CA3AF",
    fontSize: 9,
    fontWeight: "600",
    marginLeft: 2,
  },
});
