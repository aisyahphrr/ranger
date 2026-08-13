import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Screen } from "./src/types";

// Auth Screens
import { SplashScreen } from "./src/screens/auth/SplashScreen";
import { OnboardingScreen } from "./src/screens/auth/OnboardingScreen";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { RoleScreen } from "./src/screens/auth/RoleScreen";
import { DaftarMitraStep1Screen } from "./src/screens/auth/DaftarMitraStep1Screen";
import { DaftarMitraStep2Screen } from "./src/screens/auth/DaftarMitraStep2Screen";
import { DaftarMitraStep3Screen } from "./src/screens/auth/DaftarMitraStep3Screen";

// Role Screens (7 Roles)
import { CustomerHomeScreen } from "./src/screens/customer/CustomerHomeScreen";
import { MarketplaceScreen } from "./src/screens/customer/MarketplaceScreen";
import { CustomerLaundryScreen } from "./src/screens/customer/CustomerLaundryScreen";
import { CustomerLaundryDetailScreen } from "./src/screens/customer/CustomerLaundryDetailScreen";
import { DriverHomeScreen } from "./src/screens/driver/DriverHomeScreen";
import { PemilikCateringHomeScreen } from "./src/screens/pemilik_catering/PemilikCateringHomeScreen";
import { PemilikMarketplaceHomeScreen } from "./src/screens/pemilik_marketplace/PemilikMarketplaceHomeScreen";
import { PemilikLaundryHomeScreen } from "./src/screens/pemilik_laundry/PemilikLaundryHomeScreen";
import { LaundryOrderScreen } from "./src/screens/pemilik_laundry/LaundryOrderScreen";
import { LaundryUserScreen } from "./src/screens/pemilik_laundry/LaundryUserScreen";
import { LaundryRiwayatScreen } from "./src/screens/pemilik_laundry/LaundryRiwayatScreen";
import { LaundryPendapatanScreen } from "./src/screens/pemilik_laundry/LaundryPendapatanScreen";
import { LaundryProfilScreen } from "./src/screens/pemilik_laundry/LaundryProfilScreen";
import { PemilikKosHomeScreen } from "./src/screens/pemilik_kos/PemilikKosHomeScreen";
import { ManajemenKamarScreen } from "./src/screens/pemilik_kos/ManajemenKamarScreen";
import { ManajemenPenghuniScreen } from "./src/screens/pemilik_kos/ManajemenPenghuniScreen";
import { LaporanKeuanganScreen } from "./src/screens/pemilik_kos/LaporanKeuanganScreen";
import { PemilikKosProfilScreen } from "./src/screens/pemilik_kos/PemilikKosProfilScreen";
import { VerifikasiDpScreen } from "./src/screens/pemilik_kos/VerifikasiDpScreen";
import { KirimPengingatScreen } from "./src/screens/pemilik_kos/KirimPengingatScreen";
import { AdminHomeScreen } from "./src/screens/admin/AdminHomeScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      // Auth
      case "splash":
        return <SplashScreen navigate={navigate} />;
      case "onboarding":
        return <OnboardingScreen navigate={navigate} />;
      case "login":
        return <LoginScreen navigate={navigate} />;
      case "role":
        return <RoleScreen navigate={navigate} />;
      case "daftar_mitra_step1":
        return <DaftarMitraStep1Screen navigate={navigate} />;
      case "daftar_mitra_step2":
        return <DaftarMitraStep2Screen navigate={navigate} />;
      case "daftar_mitra_step3":
        return <DaftarMitraStep3Screen navigate={navigate} />;

      // 1. Customer
      case "c_home":
        return <CustomerHomeScreen navigate={navigate} />;
      case "c_marketplace":
        return <MarketplaceScreen navigate={navigate} />;
      case "c_laundry":
        return <CustomerLaundryScreen navigate={navigate} />;
      case "c_laundry_detail":
        return <CustomerLaundryDetailScreen navigate={navigate} />;

      // 2. Driver
      case "d_home":
        return <DriverHomeScreen navigate={navigate} />;

      // 3. Pemilik Catering
      case "pemilik_catering_home":
        return <PemilikCateringHomeScreen navigate={navigate} />;

      // 4. Pemilik Marketplace (UMKM)
      case "pemilik_marketplace_home":
        return <PemilikMarketplaceHomeScreen navigate={navigate} />;

      // 5. Pemilik Laundry
      case "pemilik_laundry_home":
        return <PemilikLaundryHomeScreen navigate={navigate} />;
      case "pemilik_laundry_order":
        return <LaundryOrderScreen navigate={navigate} />;
      case "pemilik_laundry_user":
        return <LaundryUserScreen navigate={navigate} />;
      case "pemilik_laundry_riwayat":
        return <LaundryRiwayatScreen navigate={navigate} />;
      case "pemilik_laundry_pendapatan":
        return <LaundryPendapatanScreen navigate={navigate} />;
      case "pemilik_laundry_profil":
        return <LaundryProfilScreen navigate={navigate} />;

      // 6. Pemilik Kos
      case "pemilik_kos_home":
        return <PemilikKosHomeScreen navigate={navigate} />;
      case "pemilik_kos_manajemen_kamar":
        return <ManajemenKamarScreen navigate={navigate} />;
      case "pemilik_kos_manajemen_penghuni":
        return <ManajemenPenghuniScreen navigate={navigate} />;
      case "pemilik_kos_laporan_keuangan":
        return <LaporanKeuanganScreen navigate={navigate} />;
      case "pemilik_kos_profil":
        return <PemilikKosProfilScreen navigate={navigate} />;
      case "pemilik_kos_verifikasi_dp":
        return <VerifikasiDpScreen navigate={navigate} />;
      case "pemilik_kos_kirim_pengingat":
        return <KirimPengingatScreen navigate={navigate} />;

      // 7. Admin
      case "admin_home":
        return <AdminHomeScreen navigate={navigate} />;

      default:
        return <CustomerHomeScreen navigate={navigate} />;
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
