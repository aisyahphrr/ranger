import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import {
  Home,
  Map,
  ShoppingBag,
  MessageCircle,
  User as UserIcon,
  MapPin,
  Bell,
  Search,
  ChevronRight,
  X,
  Store,
  Coffee,
  Wind,
  Building,
  Star,
  Plus,
  Minus,
  CheckCircle,
  Heart,
} from "lucide-react-native";
import { rp } from "../../utils/formatters";
import { PRODUCTS, RESTAURANTS } from "../../constants/mockData";
import { Screen, Nav, OrderItem, CartItem, Product, CustomerAddress } from "../../types";

// Import other customer screens
import { Jelajah } from "./Jelajah";
import { Pesanan } from "./Pesanan";
import { Inbox, CustomerNotification, CustomerChatThread } from "./Inbox";
import { Profile } from "./Profile";

import { MarketplaceScreen } from "./MarketplaceScreen";
import { CateringScreen } from "./CateringScreen";
import { CateringDetailScreen } from "./CateringDetailScreen";
import { CateringPaymentScreen } from "./CateringPaymentScreen";
import { CateringQrisScreen } from "./CateringQrisScreen";
import { LaundryScreen } from "./LaundryScreen";
import { KosScreen } from "./KosScreen";
import { ProductDetailScreen } from "./ProductDetailScreen";
import { CheckoutScreen } from "./CheckoutScreen";
import { OrderSuccessScreen } from "./OrderSuccessScreen";
import { OrderTrackingScreen } from "./OrderTrackingScreen";

interface BerandaProps {
  currentScreen: Screen;
  navigate: (s: Screen) => void;
  customerName: string;
  setCustomerName: (s: string) => void;
  customerPhone: string;
  setCustomerPhone: (s: string) => void;
  customerAddress: string;
  setCustomerAddress: (s: string) => void;
  customerLocation: string;
  setCustomerLocation: (s: string) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  notifications: CustomerNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<CustomerNotification[]>>;
  chatThreads: CustomerChatThread[];
  setChatThreads: React.Dispatch<React.SetStateAction<CustomerChatThread[]>>;
  reviews: any[];
  setReviews: React.Dispatch<React.SetStateAction<any[]>>;
  wishlist: number[];
  setWishlist: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedProduct: (p: Product | null) => void;
  setSelectedProductList: (l: Product[]) => void;
  setProductSourceScreen: (s: Screen) => void;
  selectedProduct: Product | null;
  selectedProductList: Product[];
  productSourceScreen: Screen;
  addresses: CustomerAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<CustomerAddress[]>>;
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  customerBalance: number;
  setCustomerBalance: React.Dispatch<React.SetStateAction<number>>;
}

export const Beranda: React.FC<BerandaProps> = ({
  currentScreen,
  navigate,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerAddress,
  setCustomerAddress,
  customerLocation,
  setCustomerLocation,
  cart,
  setCart,
  orders,
  setOrders,
  notifications,
  setNotifications,
  chatThreads,
  setChatThreads,
  reviews,
  setReviews,
  wishlist,
  setWishlist,
  setSelectedProduct,
  setSelectedProductList,
  setProductSourceScreen,
  selectedProduct,
  selectedProductList,
  productSourceScreen,
  addresses,
  setAddresses,
  selectedAddressId,
  setSelectedAddressId,
  selectedOrderId,
  setSelectedOrderId,
  customerBalance,
  setCustomerBalance,
}) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [marketCat, setMarketCat] = useState("Semua");
  const [selectedCateringMerchant, setSelectedCateringMerchant] = useState<any>(null);
  const [selectedCateringPO, setSelectedCateringPO] = useState<any>(null);

  const handleAddToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, qty: 1, store: product.store, img: product.img }]);
    }
  };

  const handleUpdateQty = (id: number, delta: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (item.qty + delta <= 0) {
      setCart(cart.filter((i) => i.id !== id));
    } else {
      setCart(cart.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i)));
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Keranjang Kosong", "Silakan tambahkan produk terlebih dahulu.");
      return;
    }
    setCartModalVisible(false);

    // Check if the first item in the cart is a catering item
    const firstItem = cart[0];
    const isCateringItem = RESTAURANTS.some(r => r.name === firstItem.store);

    if (isCateringItem) {
      const matchedMerchant = RESTAURANTS.find(r => r.name === firstItem.store) || RESTAURANTS[0];
      setSelectedCateringMerchant(matchedMerchant);

      // Create a mock product object representing the first package
      const matchedProduct: Product = {
        id: firstItem.id,
        name: firstItem.name,
        store: firstItem.store,
        price: firstItem.price,
        rating: 4.8,
        sold: 100,
        img: firstItem.img,
        liked: false,
        cat: firstItem.id === 103 || firstItem.id === 202 || firstItem.name.toLowerCase().includes("tumpeng") ? "Tumpeng" : "Nasi Box",
      };

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDay = String(tomorrow.getDate()).padStart(2, "0");
      const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const tomorrowYear = tomorrow.getFullYear();
      const tomorrowFormatted = `${tomorrowDay}/${tomorrowMonth}/${tomorrowYear}`;

      const poDetails = {
        merchant: matchedMerchant,
        package: matchedProduct,
        paxCount: firstItem.qty,
        bookingDate: tomorrowFormatted,
        note: "",
        totalPrice: firstItem.price * firstItem.qty,
      };

      setSelectedProduct(matchedProduct);
      setSelectedCateringPO(poDetails);
      navigate("c_catering_detail");
    } else {
      navigate("c_checkout");
    }
  };

  const handleToggleLike = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((wId) => wId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const totalCartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalCartPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const getStoreRating = (storeName: string) => {
    const storeProducts = PRODUCTS.filter((p) => p.store === storeName);
    if (storeProducts.length === 0) return "0.0";
    const sum = storeProducts.reduce((acc, p) => acc + p.rating, 0);
    return (sum / storeProducts.length).toFixed(1);
  };

  // Nav configuration
  const navItems = [
    { label: "Beranda", icon: Home },
    { label: "Jelajah", icon: Map },
    { label: "Pesanan", icon: ShoppingBag },
    { label: "Inbox", icon: MessageCircle },
    { label: "Profil", icon: UserIcon },
  ];

  React.useEffect(() => {
    if (["c_marketplace", "c_catering", "c_laundry", "c_kos", "c_product_detail", "c_checkout", "c_order_success", "c_tracking", "c_catering_detail", "c_catering_payment", "c_catering_qris"].includes(currentScreen)) {
      setCurrentTab(0);
    }
    if (currentScreen === "c_catering" || currentScreen === "c_home") {
      setSelectedCateringPO(null);
    }
  }, [currentScreen]);

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        switch (currentScreen) {
          case "c_marketplace":
            return (
              <MarketplaceScreen
                navigate={navigate}
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
                setSelectedProduct={setSelectedProduct}
                setSelectedProductList={setSelectedProductList}
                setProductSourceScreen={setProductSourceScreen}
                onOpenCart={() => setCartModalVisible(true)}
              />
            );
          case "c_catering":
            return (
              <CateringScreen
                navigate={navigate}
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
                setSelectedProduct={setSelectedProduct}
                setSelectedProductList={setSelectedProductList}
                setProductSourceScreen={setProductSourceScreen}
                onOpenCart={() => setCartModalVisible(true)}
                setSelectedMerchant={setSelectedCateringMerchant}
              />
            );
          case "c_catering_detail":
            return (
              <CateringDetailScreen
                navigate={navigate}
                selectedMerchant={selectedCateringMerchant}
                setSelectedCateringPO={setSelectedCateringPO}
                selectedProduct={selectedProduct}
                selectedCateringPO={selectedCateringPO}
              />
            );
          case "c_catering_payment":
            return (
              <CateringPaymentScreen
                navigate={navigate}
                cateringPO={selectedCateringPO}
                dompetBalance={customerBalance}
                setDompetBalance={setCustomerBalance}
                orders={orders}
                setOrders={setOrders}
                setSelectedOrderId={setSelectedOrderId}
                setNotifications={setNotifications}
                setSelectedCateringPO={setSelectedCateringPO}
              />
            );
          case "c_catering_qris":
            return (
              <CateringQrisScreen
                navigate={navigate}
                cateringPO={selectedCateringPO}
                paymentOption={selectedCateringPO?.paymentOption || "full"}
                orders={orders}
                setOrders={setOrders}
                setSelectedOrderId={setSelectedOrderId}
                setNotifications={setNotifications}
              />
            );
          case "c_laundry":
            return (
              <LaundryScreen
                navigate={navigate}
                orders={orders}
                setOrders={setOrders}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            );
          case "c_kos":
            return (
              <KosScreen
                navigate={navigate}
                chatThreads={chatThreads}
                setChatThreads={setChatThreads}
              />
            );
          case "c_product_detail":
            return (
              <ProductDetailScreen
                navigate={navigate}
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                productList={selectedProductList}
                sourceScreen={productSourceScreen}
                reviews={reviews}
                onOpenCart={() => setCartModalVisible(true)}
              />
            );
          case "c_checkout":
            return (
              <CheckoutScreen
                navigate={navigate}
                cart={cart}
                setCart={setCart}
                orders={orders}
                setOrders={setOrders}
                addresses={addresses}
                setAddresses={setAddresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                selectedOrderId={selectedOrderId}
                setSelectedOrderId={setSelectedOrderId}
                customerBalance={customerBalance}
                setCustomerBalance={setCustomerBalance}
                setNotifications={setNotifications}
                notifications={notifications}
              />
            );
          case "c_order_success":
            return (
              <OrderSuccessScreen
                navigate={navigate}
                selectedOrderId={selectedOrderId}
                orders={orders}
              />
            );
          case "c_tracking":
            return (
              <OrderTrackingScreen
                navigate={navigate}
                setCurrentTab={setCurrentTab}
                selectedOrderId={selectedOrderId}
                orders={orders}
                setOrders={setOrders}
                chatThreads={chatThreads}
                setChatThreads={setChatThreads}
                setNotifications={setNotifications}
                notifications={notifications}
              />
            );
          default:
            return renderBerandaContent();
        }
      case 1:
        return (
          <Jelajah
            products={PRODUCTS}
            onAddToCart={handleAddToCart}
            onOpenMarketplace={() => navigate("c_marketplace")}
            onOpenCatering={() => navigate("c_catering")}
            onOpenLaundry={() => navigate("c_laundry")}
            onOpenKos={() => navigate("c_kos")}
          />
        );
      case 2:
        return (
          <Pesanan
            orders={orders}
            setOrders={setOrders}
            reviews={reviews}
            setReviews={setReviews}
            navigate={navigate}
            setSelectedOrderId={setSelectedOrderId}
          />
        );
      case 3:
        return (
          <Inbox
            notifications={notifications}
            setNotifications={setNotifications}
            chatThreads={chatThreads}
            setChatThreads={setChatThreads}
            setCustomerTab={setCurrentTab}
          />
        );
      case 4:
        return (
          <Profile
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerAddress={customerAddress}
            setCustomerAddress={setCustomerAddress}
            customerLocation={customerLocation}
            setCustomerLocation={setCustomerLocation}
            orderCount={orders.length}
            wishlistCount={wishlist.length}
            rating={(4.8).toString()}
            navigate={navigate}
          />
        );
      default:
        return renderBerandaContent();
    }
  };

  // Main Beranda layout panel
  const renderBerandaContent = () => {
    const filteredMarketProducts =
      marketCat === "Semua" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === marketCat);

    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top green bar */}
        <View style={styles.topBar}>
          <View style={styles.headerBgCircle1 as any} />
          <View style={styles.headerBgCircle2 as any} />
          <View style={styles.locationCol}>
            <Text style={styles.locationLabel}>Halo, {customerName.split(" ")[0]} 👋</Text>
            <Text style={styles.locationQuest}>Temukan layanan UMKM lokal terbaik untuk harimu</Text>
            <View style={styles.mapPinRow}>
              <MapPin size={12} color="#BBF7D0" />
              <Text style={styles.mapPinVal} numberOfLines={1}>
                {customerLocation} · {customerAddress}
              </Text>
            </View>
          </View>

          <View style={styles.actionBtnGroup}>
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => setCartModalVisible(true)}
              activeOpacity={0.7}
            >
              <ShoppingBag size={18} color="#FFFFFF" />
              {totalCartCount > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{totalCartCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => setCurrentTab(3)} // Redirect to inbox notifications
              activeOpacity={0.7}
            >
              <Bell size={18} color="#FFFFFF" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <View style={[styles.badgeCount, { backgroundColor: "#EF4444" }]}>
                  <Text style={styles.badgeCountText}>
                    {notifications.filter((n) => !n.read).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar simulation */}
        <TouchableOpacity 
          style={styles.searchBarBtn}
          onPress={() => setCurrentTab(1)} // Redirect to explore tab
          activeOpacity={0.8}
        >
          <Search size={18} color="#9CA3AF" />
          <Text style={styles.searchPlaceholderText}>Cari layanan UMKM, catering, laundry, atau kos...</Text>
        </TouchableOpacity>

        {/* Promo slide card */}
        <View style={styles.promoBanner}>
          <Text style={styles.promoLabel}>PROMO HARI INI</Text>
          <Text style={styles.promoTitle}>Diskon 20% UMKM Kamojang</Text>
          <Text style={styles.promoSub}>Klaim voucher PGE 2.0 di halaman pembayaran</Text>
        </View>

        {/* Service grid row */}
        <Text style={styles.sectionTitle}>Layanan Utama</Text>
        <View style={styles.servicesGrid}>
          {/* Marketplace */}
          <TouchableOpacity style={styles.serviceItem} onPress={() => navigate("c_marketplace")}>
            <View style={[styles.serviceIconBg, { backgroundColor: "#E8F5EE" }]}>
              <Store size={22} color="#047857" />
            </View>
            <Text style={styles.serviceText}>Marketplace</Text>
          </TouchableOpacity>

          {/* Catering */}
          <TouchableOpacity style={styles.serviceItem} onPress={() => navigate("c_catering")}>
            <View style={[styles.serviceIconBg, { backgroundColor: "#FFEDD5" }]}>
              <Coffee size={22} color="#EA580C" />
            </View>
            <Text style={styles.serviceText}>Catering</Text>
          </TouchableOpacity>

          {/* Laundry */}
          <TouchableOpacity style={styles.serviceItem} onPress={() => navigate("c_laundry")}>
            <View style={[styles.serviceIconBg, { backgroundColor: "#E0F2FE" }]}>
              <Wind size={22} color="#0284C7" />
            </View>
            <Text style={styles.serviceText}>Laundry</Text>
          </TouchableOpacity>

          {/* Kos */}
          <TouchableOpacity style={styles.serviceItem} onPress={() => navigate("c_kos")}>
            <View style={[styles.serviceIconBg, { backgroundColor: "#F3E8FF" }]}>
              <Building size={22} color="#9333EA" />
            </View>
            <Text style={styles.serviceText}>Kos</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Stores horizontal lists */}
        <Text style={styles.sectionTitle}>Marketplace Terdekat</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollList}>
          {["Warung Bu Siti", "Batik Kamojang", "Cemilan Bu Eni", "Kopi Nusantara"].map((store, index) => {
            const rating = getStoreRating(store);
            return (
              <TouchableOpacity
                key={index}
                style={styles.storeCard}
                onPress={() => navigate("c_marketplace")}
              >
                <View style={styles.storeCardHeader}>
                  <View style={styles.avatarMiniBg}>
                    <Store size={16} color="#047857" />
                  </View>
                  <View style={styles.storeCardBody}>
                    <Text style={styles.storeCardTitle} numberOfLines={1}>{store}</Text>
                    <Text style={styles.storeCardRating}>★ {rating} · Buka sekarang</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected products grid lists */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Menu & Produk Pilihan</Text>
          <TouchableOpacity onPress={() => setCurrentTab(1)}>
            <Text style={styles.seeAllText}>Lihat semua</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {PRODUCTS.slice(0, 4).map((p) => {
            const isLiked = wishlist.includes(p.id);
            return (
              <TouchableOpacity
                key={p.id}
                style={styles.productCard}
                activeOpacity={0.95}
                onPress={() => {
                  setSelectedProduct(p);
                  setSelectedProductList(PRODUCTS.slice(0, 4));
                  setProductSourceScreen("c_home");
                  navigate("c_product_detail");
                }}
              >
                <Image source={{ uri: p.img }} style={styles.productImg as any} />
                
                <TouchableOpacity 
                  style={styles.heartIconBtn}
                  onPress={() => handleToggleLike(p.id)}
                >
                  <Heart size={14} color={isLiked ? "#EF4444" : "#9CA3AF"} fill={isLiked ? "#EF4444" : "none"} />
                </TouchableOpacity>

                <View style={styles.productCardBody}>
                  <Text style={styles.productStoreName} numberOfLines={1}>{p.store}</Text>
                  <Text style={styles.productItemName} numberOfLines={1}>{p.name}</Text>
                  
                  <View style={styles.productCardFooter}>
                    <Text style={styles.productPriceText}>{rp(p.price)}</Text>
                    <TouchableOpacity 
                      style={styles.addButtonMini}
                      onPress={() => {
                        handleAddToCart(p);
                        Alert.alert("Sukses", `${p.name} dimasukkan ke keranjang belanja.`);
                      }}
                    >
                      <Plus size={12} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Active Tab Panel */}
      <View style={styles.tabContainer}>{renderTabContent()}</View>

      {/* Fixed bottom navigation bar */}
      {!["c_checkout", "c_order_success", "c_tracking"].includes(currentScreen) && (
        <View style={styles.bottomNav}>
          {navItems.map((item, index) => {
            const active = currentTab === index;
            const IconComp = item.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.navItem}
                onPress={() => setCurrentTab(index)}
                activeOpacity={0.7}
              >
                <View style={[styles.navIconBg, active ? styles.navIconBgActive : null]}>
                  <IconComp size={18} color={active ? "#047857" : "#9CA3AF"} />
                </View>
                <Text style={[styles.navLabel, active ? styles.navLabelActive : null]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* MODAL 5: CART DRAWER */}
      <Modal visible={cartModalVisible} transparent animationType="slide">
        <View style={styles.modalBgBottom}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Keranjang Belanja</Text>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                <X size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
              <View style={styles.emptyCartBox}>
                <ShoppingBag size={38} color="#9CA3AF" />
                <Text style={styles.emptyCartTitle}>Keranjang Anda kosong</Text>
                <Text style={styles.emptyCartSub}>Pilih produk terpopuler di beranda untuk mulai berbelanja.</Text>
              </View>
            ) : (
              <View style={styles.cartBoxContent}>
                <ScrollView style={styles.cartItemsScroll} showsVerticalScrollIndicator={false}>
                  {cart.map((item) => (
                    <View key={item.id} style={styles.cartItemRow}>
                      <Image source={{ uri: item.img }} style={styles.cartItemImg as any} />
                      <View style={styles.cartItemBody}>
                        <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.cartItemStore} numberOfLines={1}>{item.store}</Text>
                        <Text style={styles.cartItemPrice}>{rp(item.price)}</Text>
                      </View>
                      <View style={styles.qtyControlRow}>
                        <TouchableOpacity 
                          style={styles.qtyBtn} 
                          onPress={() => handleUpdateQty(item.id, -1)}
                        >
                          <Minus size={12} color="#047857" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.qty}</Text>
                        <TouchableOpacity 
                          style={styles.qtyBtn} 
                          onPress={() => handleUpdateQty(item.id, 1)}
                        >
                          <Plus size={12} color="#047857" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.cartFooterPanel}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Pembayaran</Text>
                    <Text style={styles.totalValText}>{rp(totalCartPrice)}</Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.checkoutBtn}
                    onPress={handleCheckout}
                  >
                    <CheckCircle size={16} color="#FFFFFF" />
                    <Text style={styles.checkoutBtnText}>Checkout Sekarang</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7F5",
  },
  tabContainer: {
    flex: 1,
  },
  bottomNav: {
    height: 72,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 6,
    elevation: 10,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
  },
  navIconBg: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconBgActive: {
    backgroundColor: "rgba(4, 120, 87, 0.12)",
  },
  navLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#047857",
    fontWeight: "800",
  },
  scrollContent: {
    paddingBottom: 36,
  },
  topBar: {
    backgroundColor: "#047857",
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    position: "relative",
    overflow: "hidden",
  },
  headerBgCircle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(187,247,208,0.15)",
    top: -52,
    right: -40,
  },
  headerBgCircle2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(167,243,208,0.12)",
    bottom: -36,
    left: -34,
  },
  locationCol: {
    flex: 1,
    paddingRight: 16,
    gap: 2,
    zIndex: 2,
  },
  locationLabel: {
    color: "#BBF7D0",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  locationQuest: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },
  mapPinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  mapPinVal: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  actionBtnGroup: {
    flexDirection: "row",
    gap: 8,
    zIndex: 2,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  badgeCount: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#047857",
  },
  badgeCountText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
  },
  searchBarBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 18,
    height: 52,
    marginHorizontal: 20,
    marginTop: -24,
    gap: 10,
    elevation: 8,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  searchPlaceholderText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  promoBanner: {
    backgroundColor: "#DCFCE7",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#4ADE80",
  },
  promoLabel: {
    color: "#047857",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F5132",
  },
  promoSub: {
    fontSize: 12,
    color: "#166534",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    marginHorizontal: 20,
    marginTop: 26,
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
  },
  serviceItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  serviceIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#334155",
  },
  horizontalScrollList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  storeCard: {
    width: 178,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    paddingVertical: 14,
    paddingHorizontal: 14,
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  storeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarMiniBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  storeCardBody: {
    flex: 1,
    gap: 1,
  },
  storeCardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },
  storeCardRating: {
    fontSize: 10,
    color: "#16A34A",
    fontWeight: "700",
  },
  storeCardStatus: {
    fontSize: 9,
    color: "#22C55E",
    fontWeight: "800",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#047857",
    marginTop: 0,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    position: "relative",
    elevation: 4,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  productImg: {
    width: "100%",
    height: 110,
  },
  heartIconBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFFFFF",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productCardBody: {
    padding: 10,
    gap: 2,
  },
  productStoreName: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  productItemName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
  },
  productCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  productPriceText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#047857",
  },
  addButtonMini: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBgBottom: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    maxHeight: "92%",
    elevation: 20,
    shadowColor: "#0F172A",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -10 },
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 14,
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
  },
  catScrollBox: {
    flexDirection: "row",
    paddingVertical: 10,
    gap: 8,
  },
  catPillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  catPillBtnActive: {
    backgroundColor: "#047857",
    borderColor: "#047857",
  },
  catPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  catPillTextActive: {
    color: "#FFFFFF",
  },
  sheetProductList: {
    maxHeight: 380,
    paddingBottom: 20,
  },
  sheetList: {
    maxHeight: 400,
    gap: 12,
  },
  restaurantRowCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    padding: 10,
    gap: 12,
    elevation: 3,
    shadowColor: "#0F172A",
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  restaurantRowImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  restaurantRowBody: {
    flex: 1,
    gap: 2,
    justifyContent: "center",
  },
  restaurantRowName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
  },
  restaurantRowCuisine: {
    fontSize: 11,
    color: "#64748B",
  },
  restaurantRowMin: {
    fontSize: 11,
    fontWeight: "800",
    color: "#047857",
  },
  tagBadgeRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  tagBadge: {
    backgroundColor: "#E8F5EE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#047857",
  },
  orderLaundryBtn: {
    backgroundColor: "#047857",
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    width: 100,
  },
  orderLaundryBtnText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  emptyCartBox: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyCartTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E293B",
  },
  emptyCartSub: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  cartBoxContent: {
    gap: 12,
  },
  cartItemsScroll: {
    maxHeight: 280,
  },
  cartItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  cartItemImg: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  cartItemBody: {
    flex: 1,
    marginLeft: 12,
    gap: 1,
  },
  cartItemName: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
  },
  cartItemStore: {
    fontSize: 10,
    color: "#94A3B8",
  },
  cartItemPrice: {
    fontSize: 12,
    fontWeight: "900",
    color: "#047857",
  },
  qtyControlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E293B",
  },
  cartFooterPanel: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  totalValText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#047857",
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#047857",
    height: 46,
    borderRadius: 14,
    gap: 8,
  },
  checkoutBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
