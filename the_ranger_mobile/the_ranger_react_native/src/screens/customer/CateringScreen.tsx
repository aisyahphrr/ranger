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
} from "react-native";
import { Screen, CartItem, Product } from "../../types";
import { RESTAURANTS } from "../../constants/mockData";
import { BackHeader } from "../../components/BackHeader";
import { Stars } from "../../components/Stars";
import { rp } from "../../utils/formatters";
import { Coffee, Search, Plus, Heart, ShoppingBag, ShoppingCart } from "lucide-react-native";

// Let's create specific catering products for the demo
const CATERING_PRODUCTS: Product[] = [
  { id: 101, name: "Nasi Box Timbel Komplit", store: "Saung Sunda Asli", price: 28000, rating: 4.9, sold: 180, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop", liked: false, cat: "Nasi Box", description: "Paket Nasi Timbel Komplit dengan Ayam Goreng Lengkuas, Lalap, Sambal Terasi, Tahu & Tempe Goreng, disajikan higienis dalam box ramah lingkungan." },
  { id: 102, name: "Nasi Tumpeng Mini Kuning", store: "Catering Bu Haji Nani", price: 35000, rating: 4.8, sold: 95, img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop", liked: false, cat: "Tumpeng", description: "Nasi kuning tumpeng mini dengan lauk pauk lengkap: ayam suwir, perkedel kentang, mie goreng, telur dadar iris, kering tempe, dan sambal." },
  { id: 103, name: "Catering Rantang Harian (3 Lauk)", store: "Dapur Asri Kamojang", price: 45000, rating: 4.7, sold: 340, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop", liked: false, cat: "Harian", description: "Menu catering rantangan harian isi 3 macam lauk (Sayur, Lauk Utama, Lauk Pendamping) porsi 2-3 orang. Cocok untuk keluarga kecil." },
  { id: 104, name: "Paket Bento Kidz Party", store: "Bento Box & Snack Kamojang", price: 22000, rating: 4.6, sold: 120, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop", liked: false, cat: "Bento", description: "Bento lucu karakter kartun dengan nugget ayam premium, sosis goreng gurita, salad wortel manis, nasi pulen, dan saus keju kesukaan anak-anak." },
  { id: 105, name: "Prasmanan Sunda Premium (Min 50 Pax)", store: "Tumpeng Premium Kamojang", price: 75000, rating: 4.9, sold: 12, img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop", liked: false, cat: "Prasmanan", description: "Paket prasmanan sunda mewah untuk acara pernikahan, rapat kantor, atau arisan. Sudah termasuk peralatan saji, meja dekorasi, dan pramusaji." },
  { id: 106, name: "Healthy Slimming Diet Menu", store: "Healthy Diet Catering", price: 50000, rating: 4.8, sold: 150, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop", liked: false, cat: "Diet", description: "Menu diet sehat rendah garam dan karbohidrat kompleks. Diatur khusus oleh ahli gizi untuk menurunkan berat badan tanpa merasa lapar." },
  { id: 107, name: "Snack Box Rapat A (3 Kue + Air)", store: "Snack Box & Jajanan Bu Tini", price: 12500, rating: 4.7, sold: 650, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop", liked: false, cat: "Snack", description: "Snack Box isi 3 macam jajanan pasar premium (Risol Mayo, Lemper Ayam, Sus Buah) ditambah air mineral gelas untuk kebutuhan rapat / acara." },
];

interface CateringScreenProps {
  navigate: (s: Screen) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: number[];
  setWishlist: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedProduct: (p: Product | null) => void;
  setSelectedProductList: (l: Product[]) => void;
  setProductSourceScreen: (s: Screen) => void;
  onOpenCart?: () => void;
  setSelectedMerchant: (m: any) => void;
}

export const CateringScreen: React.FC<CateringScreenProps> = ({
  navigate,
  cart,
  setCart,
  wishlist,
  setWishlist,
  setSelectedProduct,
  setSelectedProductList,
  setProductSourceScreen,
  onOpenCart,
  setSelectedMerchant,
}) => {
  const [selectedCat, setSelectedCat] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const categories = ["Semua", "Nasi Box", "Prasmanan", "Bento", "Snack", "Diet", "Harian"];

  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, qty: 1, store: product.store, img: product.img }]);
    }
    Alert.alert("Sukses", `${product.name} dimasukkan ke keranjang belanja.`);
  };

  const handleToggleLike = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((wId) => wId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const filteredCatering = CATERING_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCat === "Semua" || p.cat === selectedCat;
    const matchesStore = !selectedStore || p.store === selectedStore;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.store.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStore && matchesSearch;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartIcon = (
    <TouchableOpacity 
      style={styles.cartHeaderBtn}
      onPress={() => {
        if (onOpenCart) {
          onOpenCart();
        } else {
          Alert.alert("Keranjang", `Ada ${totalCartCount} item di keranjang. Anda bisa checkout lewat halaman Beranda.`);
        }
      }}
      activeOpacity={0.7}
    >
      <ShoppingCart size={20} color="#1F2937" />
      {totalCartCount > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Catering & Dapur Kamojang" onBack={() => navigate("c_home")} right={cartIcon} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Field */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBarRow}>
            <Search size={18} color="#9CA3AF" />
            <TextInput
              style={styles.textInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari nasi tumpeng, box harian, prasmanan..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Merchant Recommendation Slider */}
        <Text style={styles.sectionTitle}>Mitra Catering Pilihan</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.merchantList}>
          {RESTAURANTS.map((res) => {
            return (
              <TouchableOpacity
                key={res.id}
                style={styles.merchantCard}
                onPress={() => {
                  setSelectedMerchant(res);
                  navigate("c_catering_detail");
                }}
                activeOpacity={0.8}
              >
                <Image source={{ uri: res.img }} style={styles.merchantImg} />
                <View style={styles.merchantInfo}>
                  <Text style={styles.merchantName} numberOfLines={1}>{res.name}</Text>
                  <View style={styles.merchantSubRow}>
                    <Text style={styles.merchantRating}>★ {res.rating}</Text>
                    <Text style={styles.merchantDist}>{res.distance} km</Text>
                  </View>
                  <Text style={styles.merchantMin} numberOfLines={1}>Min. order {rp(res.minOrder)}</Text>
                  <View style={styles.tagsRow}>
                    {res.tags.slice(0, 2).map((tag, idx) => (
                      <View key={idx} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Category Filter Pills */}
        <Text style={styles.sectionTitle}>Menu & Paket Catering</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.catPill, selectedCat === c && styles.catPillActive]}
              onPress={() => setSelectedCat(c)}
              activeOpacity={0.7}
            >
              <Text style={[styles.catPillText, selectedCat === c && styles.catPillTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Catering Products Grid */}
        {filteredCatering.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ShoppingBag size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Menu tidak ditemukan</Text>
            <Text style={styles.emptySub}>Silakan cari dengan kata kunci lain.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredCatering.map((p) => {
              const isLiked = wishlist.includes(p.id);
              return (
                <TouchableOpacity 
                  key={p.id} 
                  style={styles.card} 
                  activeOpacity={0.9}
                  onPress={() => {
                    const matchedMerchant = RESTAURANTS.find(r => r.name === p.store) || RESTAURANTS[0];
                    setSelectedMerchant(matchedMerchant);
                    setSelectedProduct(p);
                    navigate("c_catering_detail");
                  }}
                >
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: p.img }} style={styles.cardImg} />
                    <TouchableOpacity 
                      style={styles.heartBtn}
                      onPress={() => handleToggleLike(p.id)}
                      activeOpacity={0.7}
                    >
                      <Heart size={14} color={isLiked ? "#EF4444" : "#9CA3AF"} fill={isLiked ? "#EF4444" : "none"} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardStore} numberOfLines={1}>
                      {p.store}
                    </Text>
                    <Text style={styles.cardName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <View style={styles.ratingRow}>
                      <Stars rating={p.rating} />
                      <Text style={styles.soldText}>{p.sold} order</Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>{rp(p.price)}</Text>
                      <TouchableOpacity 
                        style={styles.addBtn} 
                        activeOpacity={0.7}
                        onPress={() => handleAddToCart(p)}
                      >
                        <Plus size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
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
  cartHeaderBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  searchBarRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  merchantList: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 12,
  },
  merchantCard: {
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  merchantCardActive: {
    borderColor: "#EA580C",
    borderWidth: 1.5,
    backgroundColor: "rgba(234, 88, 12, 0.03)",
  },
  merchantImg: {
    width: "100%",
    height: 80,
    backgroundColor: "#E5E7EB",
  },
  merchantInfo: {
    padding: 10,
    gap: 3,
  },
  merchantName: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },
  merchantSubRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  merchantRating: {
    fontSize: 10,
    color: "#D97706",
    fontWeight: "800",
  },
  merchantDist: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  merchantMin: {
    fontSize: 10,
    color: "#6B7280",
  },
  tagsRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
  },
  tagBadge: {
    backgroundColor: "#FFEDD5",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    color: "#EA580C",
    fontSize: 8,
    fontWeight: "800",
  },
  catScroll: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  catPillActive: {
    backgroundColor: "#EA580C",
    borderColor: "#EA580C",
  },
  catPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  catPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    rowGap: 14,
  },
  card: {
    width: "48%",
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
  imageWrapper: {
    position: "relative",
  },
  cardImg: {
    width: "100%",
    height: 110,
    backgroundColor: "#F3F4F6",
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardBody: {
    padding: 12,
    gap: 2,
  },
  cardStore: {
    fontSize: 10,
    color: "#EA580C",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  cardName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  soldText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#EA580C",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  emptySub: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
