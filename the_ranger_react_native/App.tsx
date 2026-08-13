import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Screen } from "./src/types";

// Auth Screens
import { SplashScreen } from "./src/screens/auth/SplashScreen";
import { OnboardingScreen } from "./src/screens/auth/OnboardingScreen";
import { LoginScreen } from "./src/screens/auth/LoginScreen";
import { RoleScreen } from "./src/screens/auth/RoleScreen";

// Role Screens (7 Roles)
import { CustomerHomeScreen } from "./src/screens/customer/CustomerHomeScreen";
import { MarketplaceScreen } from "./src/screens/customer/MarketplaceScreen";
import { DriverHomeScreen } from "./src/screens/driver/DriverHomeScreen";
import { PemilikCateringHomeScreen } from "./src/screens/pemilik_catering/PemilikCateringHomeScreen";
import { PemilikMarketplaceHomeScreen } from "./src/screens/pemilik_marketplace/PemilikMarketplaceHomeScreen";
import { PemilikLaundryHomeScreen } from "./src/screens/pemilik_laundry/PemilikLaundryHomeScreen";
import { PemilikKosHomeScreen } from "./src/screens/pemilik_kos/PemilikKosHomeScreen";
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

      // 1. Customer
      case "c_home":
        return <CustomerHomeScreen navigate={navigate} />;
      case "c_marketplace":
        return <MarketplaceScreen navigate={navigate} />;

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

      // 6. Pemilik Kos
      case "pemilik_kos_home":
        return <PemilikKosHomeScreen navigate={navigate} />;

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
