import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Screen, CartItem, Product } from "../../types";
import { BackHeader } from "../../components/BackHeader";
import { Stars } from "../../components/Stars";
import { rp } from "../../utils/formatters";
import { Heart, Plus, Minus, ShoppingBag, Store, MapPin, ShoppingCart, HelpCircle } from "lucide-react-native";

// Mock default reviews for products to make it look rich
const INITIAL_PRODUCT_REVIEWS = [
  { id: "REV-P01", productName: "Nasi Timbel Komplit", rating: 5, comment: "Ayam gorengnya empuk banget bumbunya meresap, sambel goangnya pedes seger! Rekomended bgt.", photo: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&auto=format&fit=crop" },
  { id: "REV-P02", productName: "Nasi Timbel Komplit", rating: 4, comment: "Enak dan porsi pas kenyang. Datangnya masih anget dibungkus daun pisang rapi.", photo: null },
  { id: "REV-P03", productName: "Batik Kawung Premium", rating: 5, comment: "Bahan batiknya halus adem dipakai, motif kawungnya sangat rapi. Cocok untuk acara formal.", photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&auto=format&fit=crop" },
  { id: "REV-P04", productName: "Keripik Singkong Pedas", rating: 5, comment: "Keripiknya renyah ga keras, bumbu baladonya melimpah ruah! Nagih terus.", photo: null },
  { id: "REV-P05", productName: "Kopi Arabika Gunung", rating: 4, comment: "Kopi harum, keasaman pas. Biji kopi fresh baru disangrai kayanya.", photo: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&auto=format&fit=crop" },
  { id: "REV-P06", productName: "Sabun Herbal Alami", rating: 5, comment: "Sabunnya wangi sereh alami, bikin kulit lembab ga kering lagi.", photo: null },
];

interface ProductDetailScreenProps {
  navigate: (s: Screen) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: number[];
  setWishlist: React.Dispatch<React.SetStateAction<number[]>>;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  productList: Product[];
  sourceScreen: Screen;
  reviews: any[]; // User reviews from App.tsx
  onOpenCart?: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigate,
  cart,
  setCart,
  wishlist,
  setWishlist,
  selectedProduct,
  setSelectedProduct,
  productList,
  sourceScreen,
  reviews,
  onOpenCart,
}) => {
  const [qty, setQty] = useState(1);

  if (!selectedProduct) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <BackHeader title="Detail Produk" onBack={() => navigate(sourceScreen)} />
        <View style={styles.errorBody}>
          <HelpCircle size={48} color="#9CA3AF" />
          <Text style={styles.errorText}>Produk tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, qty: item.qty + qty } : item)));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, qty: qty, store: product.store, img: product.img }]);
    }
    Alert.alert("Sukses", `${qty}x ${product.name} dimasukkan ke keranjang.`);
  };

  const handleToggleLike = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((wId) => wId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const isLiked = wishlist.includes(selectedProduct.id);

  // Filter reviews for selected product
  const productReviews = [
    ...reviews.filter((r) => r.productName === selectedProduct.name),
    ...INITIAL_PRODUCT_REVIEWS.filter((r) => r.productName === selectedProduct.name),
  ];

  const ratingValue = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : selectedProduct.rating.toFixed(1);

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
      <BackHeader title={selectedProduct.cat} onBack={() => navigate(sourceScreen)} right={cartIcon} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedProduct.img }} style={styles.productImg} />
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() => handleToggleLike(selectedProduct.id)}
            activeOpacity={0.7}
          >
            <Heart size={18} color={isLiked ? "#EF4444" : "#4B5563"} fill={isLiked ? "#EF4444" : "none"} />
          </TouchableOpacity>
        </View>

        {/* Pricing and basic details info */}
        <View style={styles.infoCard}>
          <Text style={styles.storeName}>{selectedProduct.store}</Text>
          <Text style={styles.productNameText}>{selectedProduct.name}</Text>
          
          <View style={styles.ratingInfoRow}>
            <Stars rating={Number(ratingValue)} size={14} />
            <Text style={styles.ratingDivider}>·</Text>
            <Text style={styles.soldCountText}>{selectedProduct.sold} Terjual</Text>
          </View>

          <Text style={styles.priceText}>{rp(selectedProduct.price)}</Text>
        </View>

        {/* Store Detail Info Card */}
        <View style={styles.detailSec}>
          <Text style={styles.sectionTitle}>Penjual / Partner</Text>
          <View style={styles.storeInfoRow}>
            <View style={styles.storeAvatar}>
              <Store size={20} color="#047857" />
            </View>
            <View style={styles.storeDetails}>
              <Text style={styles.storeTitleText}>{selectedProduct.store}</Text>
              <View style={styles.storePinRow}>
                <MapPin size={10} color="#6B7280" />
                <Text style={styles.storePinText}>Ring 1 Kamojang, Garut</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.visitStoreBtn}
              onPress={() => {
                Alert.alert("Kunjungi Toko", `Membuka etalase lengkap ${selectedProduct.store}.`);
              }}
            >
              <Text style={styles.visitStoreText}>Kunjungi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.detailSec}>
          <Text style={styles.sectionTitle}>Deskripsi Produk</Text>
          <Text style={styles.descText}>
            {selectedProduct.description || "Produk makanan/karya UMKM lokal asli Kamojang. Dibuat dengan bahan baku segar berkualitas tinggi, diolah secara bersih, higienis, dan terpercaya. Mendukung pemberdayaan ekonomi masyarakat Ring 1 PGE Kamojang."}
          </Text>
        </View>

        {/* Customer Reviews Section */}
        <View style={[styles.detailSec, { borderBottomWidth: 0, paddingBottom: 16 }]}>
          <Text style={styles.sectionTitle}>Ulasan Customer ({productReviews.length})</Text>
          
          {productReviews.length === 0 ? (
            <View style={styles.emptyReviewBox}>
              <Text style={styles.emptyReviewText}>Belum ada ulasan untuk menu ini.</Text>
            </View>
          ) : (
            productReviews.map((rev, idx) => (
              <View key={idx} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.starsContainer}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <View key={i}>
                        <Text style={[styles.starIcon, i < rev.rating ? styles.starIconActive : null]}>★</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.reviewUser}>Oleh Customer Rangers</Text>
                </View>
                <Text style={styles.reviewComment}>{rev.comment || "Bintang 5, mantap!"}</Text>
                {rev.photo && (
                  <Image source={{ uri: rev.photo }} style={styles.reviewImage} />
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Persistent Bottom Buy Panel */}
      <View style={styles.bottomBar}>
        <View style={styles.qtyContainer}>
          <TouchableOpacity 
            style={styles.qtyBtn}
            onPress={() => setQty(Math.max(1, qty - 1))}
          >
            <Minus size={14} color="#047857" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{qty}</Text>
          <TouchableOpacity 
            style={styles.qtyBtn}
            onPress={() => setQty(qty + 1)}
          >
            <Plus size={14} color="#047857" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.addToCartBtn}
          onPress={() => handleAddToCart(selectedProduct)}
          activeOpacity={0.8}
        >
          <ShoppingBag size={16} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Beli • {rp(selectedProduct.price * qty)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7F5",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  productImg: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },
  heartBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  storeName: {
    fontSize: 11,
    color: "#047857",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
  },
  ratingInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingDivider: {
    marginHorizontal: 8,
    color: "#D1D5DB",
  },
  soldCountText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginTop: 10,
  },
  detailSec: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4B5563",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  storeInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  storeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E8F5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  storeDetails: {
    flex: 1,
    gap: 2,
  },
  storeTitleText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  storePinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  storePinText: {
    fontSize: 10,
    color: "#6B7280",
  },
  visitStoreBtn: {
    borderWidth: 1,
    borderColor: "#047857",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  visitStoreText: {
    color: "#047857",
    fontSize: 11,
    fontWeight: "700",
  },
  descText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
  },
  emptyReviewBox: {
    paddingVertical: 8,
  },
  emptyReviewText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  reviewCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 12,
    gap: 4,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  starIcon: {
    fontSize: 12,
    color: "#D1D5DB",
  },
  starIconActive: {
    color: "#F59E0B",
  },
  reviewUser: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  reviewComment: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 16,
    marginTop: 2,
  },
  reviewImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "#F3F4F6",
  },
  bottomBar: {
    height: 72,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    height: 44,
  },
  qtyBtn: {
    width: 36,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    paddingHorizontal: 8,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#047857",
    borderRadius: 14,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addToCartText: {
    color: "#FFFFFF",
    fontSize: 13,
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
    gap: 10,
  },
  errorText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600",
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
});
