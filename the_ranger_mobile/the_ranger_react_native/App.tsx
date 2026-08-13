import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Screen, CartItem, OrderItem, Product, CustomerAddress } from "./src/types";

// Auth Screens
import { SplashScreen } from "./src/screens/auth/SplashScreen";
import { OnboardingScreen } from "./src/screens/auth/OnboardingScreen";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { RoleScreen } from "./src/screens/auth/RoleScreen";
import { RegisterRoleScreen } from "./src/screens/auth/RegisterRoleScreen";
import { RegisterFlowScreen } from "./src/screens/auth/RegisterFlowScreen";
import { ForgotPasswordScreen } from "./src/screens/auth/ForgotPasswordScreen";
import { RegisterSuccessScreen } from "./src/screens/auth/RegisterSuccessScreen";
import { AuthAccount, AuthRegistrationRole, GoogleProfile, RegistrationForm } from "./src/screens/auth/authTypes";
import { clearSession } from "./src/screens/auth/authStorage";
import { roleToScreen } from "./src/screens/auth/authNavigation";
import { createAuthSession, loginWithGoogle, loginWithPassword, registerAccount, resetPassword, restoreStoredAccount } from "./src/screens/auth/authService";

// Role Screens (7 Roles)
import { Beranda as CustomerHomeScreen } from "./src/screens/customer/Beranda";
import { MarketplaceScreen } from "./src/screens/customer/MarketplaceScreen";
import { CateringScreen } from "./src/screens/customer/CateringScreen";
import { LaundryScreen } from "./src/screens/customer/LaundryScreen";
import { KosScreen } from "./src/screens/customer/KosScreen";
import { ProductDetailScreen } from "./src/screens/customer/ProductDetailScreen";

import { Beranda as DriverHomeScreen } from "./src/screens/driver/Beranda";
import { Beranda as PemilikCateringHomeScreen } from "./src/screens/pemilik_catering/Beranda";
import { Beranda as PemilikMarketplaceHomeScreen } from "./src/screens/pemilik_marketplace/Beranda";
import { PemilikLaundryHomeScreen } from "./src/screens/pemilik_laundry/PemilikLaundryHomeScreen";
import { PemilikKosHomeScreen } from "./src/screens/pemilik_kos/PemilikKosHomeScreen";
import { AdminHomeScreen } from "./src/screens/admin/AdminHomeScreen";

import { ORDERS, NOTIFS } from "./src/constants/mockData";
import { CustomerNotification, CustomerChatThread } from "./src/screens/customer/Inbox";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [currentAuthAccount, setCurrentAuthAccount] = useState<AuthAccount | null>(null);
  const [registrationRole, setRegistrationRole] = useState<AuthRegistrationRole>("customer");
  const [registrationResult, setRegistrationResult] = useState<AuthAccount | null>(null);
  const [googleDraft, setGoogleDraft] = useState<GoogleProfile | null>(null);

  // Shared Customer State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");

  const [addresses, setAddresses] = useState<CustomerAddress[]>([
    {
      id: "addr_1",
      label: "Rumah",
      receiverName: "",
      phoneNumber: "",
      fullAddress: "",
      notes: "",
      isMain: true,
    },
    {
      id: "addr_2",
      label: "Kantor PGE",
      receiverName: "",
      phoneNumber: "",
      fullAddress: "",
      notes: "",
      isMain: false,
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("addr_1");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [customerBalance, setCustomerBalance] = useState<number>(350000); // Saldo Rangers awal Rp350.000

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>(ORDERS);
  const [notifications, setNotifications] = useState<CustomerNotification[]>(
    NOTIFS.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      msg: n.msg,
      time: n.time,
      read: n.read,
    }))
  );

  const [chatThreads, setChatThreads] = useState<CustomerChatThread[]>([
    {
      id: "ch_001",
      orderId: "RNG001",
      participantType: "driver",
      participantName: "Pak Asep (Driver)",
      lastMessage: "Pak, saya sudah di depan pagar ya.",
      updatedAt: "11:05",
      unreadCount: 1,
    },
    {
      id: "ch_002",
      orderId: "RNG003",
      participantType: "merchant",
      participantName: "Catering Bu Haji Nani",
      lastMessage: "Nasi Box 20 pax sedang disiapkan ya kak.",
      updatedAt: "10:30",
      unreadCount: 0,
    },
  ]);

  const [reviews, setReviews] = useState<any[]>([
    { id: "REV-101", orderId: "RNG002", rating: 5, comment: "Laundry sangat cepat dan wangi!", photo: null },
  ]);

  const [wishlist, setWishlist] = useState<number[]>([2, 5]);

  // Product swiper screen state variables
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductList, setSelectedProductList] = useState<Product[]>([]);
  const [productSourceScreen, setProductSourceScreen] = useState<Screen>("c_home");

  useEffect(() => {
    void (async () => {
      const { account } = await restoreStoredAccount();
      if (account) {
        setCurrentAuthAccount(account);
        setCustomerName(account.name);
        setCustomerPhone(account.phone);
        setCustomerAddress(account.address);
        setCustomerLocation(account.address);
        setAddresses((current) => current.map((address, index) => index === 0
          ? { ...address, receiverName: account.name, phoneNumber: account.phone, fullAddress: account.address, isMain: true }
          : address));
        setCurrentScreen(roleToScreen(account.role));
      }
    })();
  }, []);

  const navigate = (screen: Screen) => {
    if (screen === "login" || screen === "onboarding") {
      setGoogleDraft(null);
      setRegistrationResult(null);
      setCurrentAuthAccount(null);
      void clearSession();
    }
    setCurrentScreen(screen);
  };

  const startSession = async (account: AuthAccount) => {
    await createAuthSession(account);
    setCurrentAuthAccount(account);
    setCustomerName(account.name);
    setCustomerPhone(account.phone);
    setCustomerAddress(account.address);
    setCustomerLocation(account.address);
    setAddresses((current) => current.map((address, index) => index === 0
      ? { ...address, receiverName: account.name, phoneNumber: account.phone, fullAddress: account.address, isMain: true }
      : address));
    setCurrentScreen(roleToScreen(account.role));
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await loginWithPassword(email, password);
    if (!result.account) return { ok: false, error: result.error };
    await startSession(result.account);
    return { ok: true };
  };

  const handleGoogleLogin = async (accessToken?: string) => {
    const result = await loginWithGoogle(accessToken);
    if (result.account) {
      await startSession(result.account);
      return;
    }
    setGoogleDraft(result.profile);
    navigate("auth_register_role");
  };

  const handleRegistration = async (form: RegistrationForm) => {
    const result = await registerAccount(registrationRole, form, googleDraft || undefined);
    if (!result.account) return { ok: false, error: result.error };
    setRegistrationResult(result.account);
    setGoogleDraft(null);
    navigate("auth_register_success");
    return { ok: true };
  };

  const handleResetPassword = async (email: string, password: string) => {
    return resetPassword(email, password);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      // Auth
      case "splash":
        return <SplashScreen navigate={navigate} />;
      case "onboarding":
        return <OnboardingScreen navigate={navigate} />;
      case "login":
        return <LoginScreen navigate={navigate} onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />;
      case "role":
        return <RoleScreen navigate={navigate} />;
      case "auth_register_role":
        return <RegisterRoleScreen navigate={navigate} onSelect={(role) => { setRegistrationRole(role); navigate("auth_register"); }} />;
      case "auth_register":
        return <RegisterFlowScreen navigate={navigate} role={registrationRole} initialEmail={googleDraft?.email} initialName={googleDraft?.name} googleRegistration={Boolean(googleDraft)} onSubmit={handleRegistration} />;
      case "auth_forgot_password":
        return <ForgotPasswordScreen navigate={navigate} onResetPassword={handleResetPassword} />;
      case "auth_register_success":
        return registrationResult ? <RegisterSuccessScreen navigate={navigate} account={registrationResult} onContinue={() => void startSession(registrationResult)} /> : <LoginScreen navigate={navigate} onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />;

      // 1. Customer Screens
      case "c_home":
      case "c_marketplace":
      case "c_catering":
      case "c_laundry":
      case "c_kos":
      case "c_product_detail":
      case "c_checkout":
      case "c_order_success":
      case "c_tracking":
      case "c_catering_detail":
      case "c_catering_payment":
      case "c_catering_qris":
        return (
          <CustomerHomeScreen
            currentScreen={currentScreen}
            navigate={navigate}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            customerAddress={customerAddress}
            setCustomerAddress={setCustomerAddress}
            customerLocation={customerLocation}
            setCustomerLocation={setCustomerLocation}
            cart={cart}
            setCart={setCart}
            orders={orders}
            setOrders={setOrders}
            notifications={notifications}
            setNotifications={setNotifications}
            chatThreads={chatThreads}
            setChatThreads={setChatThreads}
            reviews={reviews}
            setReviews={setReviews}
            wishlist={wishlist}
            setWishlist={setWishlist}
            setSelectedProduct={setSelectedProduct}
            setSelectedProductList={setSelectedProductList}
            setProductSourceScreen={setProductSourceScreen}
            selectedProduct={selectedProduct}
            selectedProductList={selectedProductList}
            productSourceScreen={productSourceScreen}
            addresses={addresses}
            setAddresses={setAddresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            selectedOrderId={selectedOrderId}
            setSelectedOrderId={setSelectedOrderId}
            customerBalance={customerBalance}
            setCustomerBalance={setCustomerBalance}
          />
        );

      // 2. Driver
      case "d_home":
        return <DriverHomeScreen navigate={navigate} authAccount={currentAuthAccount} />;

      // 3. Pemilik Catering
      case "pemilik_catering_home":
        return <PemilikCateringHomeScreen navigate={navigate} authAccount={currentAuthAccount} />;

      // 4. Pemilik Marketplace (UMKM)
      case "pemilik_marketplace_home":
        return <PemilikMarketplaceHomeScreen navigate={navigate} authAccount={currentAuthAccount} />;

      // 5. Pemilik Laundry
      case "pemilik_laundry_home":
        return <PemilikLaundryHomeScreen navigate={navigate} authAccount={currentAuthAccount} />;

      // 6. Pemilik Kos
      case "pemilik_kos_home":
        return <PemilikKosHomeScreen navigate={navigate} authAccount={currentAuthAccount} />;

      // 7. Admin
      case "admin_home":
        return <AdminHomeScreen navigate={navigate} />;

      default:
        return <SplashScreen navigate={navigate} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
