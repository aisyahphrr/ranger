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
import { PRODUCTS } from "../../constants/mockData";
import { BackHeader } from "../../components/BackHeader";
import { Stars } from "../../components/Stars";
import { rp } from "../../utils/formatters";
import { ShoppingBag, Search, Heart, ShoppingCart, Plus } from "lucide-react-native";

interface MarketplaceScreenProps {
  navigate: (s: Screen) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: number[];
  setWishlist: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedProduct: (p: Product | null) => void;
  setSelectedProductList: (l: Product[]) => void;
  setProductSourceScreen: (s: Screen) => void;
  onOpenCart?: () => void;
}

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  navigate,
  cart,
  setCart,
  wishlist,
  setWishlist,
  setSelectedProduct,
  setSelectedProductList,
  setProductSourceScreen,
  onOpenCart,
}) => {
  const [cat, setCat] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const categories = ["Semua", "Makanan", "Fashion", "Minuman", "Kesehatan", "Kerajinan"];

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

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = cat === "Semua" || p.cat === cat;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.store.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
      <BackHeader title="Pasar UMKM Kamojang" onBack={() => navigate("c_home")} right={cartIcon} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarRow}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            style={styles.textInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari produk UMKM, warung, cenderamata..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Category Pills */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.catPill, cat === c && styles.catPillActive]}
              onPress={() => setCat(c)}
              activeOpacity={0.7}
            >
              <Text style={[styles.catPillText, cat === c && styles.catPillTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Grid */}
      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ShoppingBag size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>
            <Text style={styles.emptySub}>Silakan cari produk UMKM dengan kata kunci lainnya.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map((p) => {
              const isLiked = wishlist.includes(p.id);
              return (
                <TouchableOpacity 
                  key={p.id} 
                  style={styles.card} 
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedProduct(p);
                    setSelectedProductList(filteredProducts);
                    setProductSourceScreen("c_marketplace");
                    navigate("c_product_detail");
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
                      <Text style={styles.soldText}>{p.sold} terjual</Text>
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
    paddingBottom: 4,
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
  catScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    backgroundColor: "#047857",
    borderColor: "#047857",
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
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
    height: 120,
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
    color: "#047857",
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
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
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
