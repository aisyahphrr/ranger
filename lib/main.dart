import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'providers/app_provider.dart';
import 'views/splash/splash_view.dart';
import 'views/onboarding/onboarding_view.dart';
import 'views/auth/login_view.dart';
import 'views/auth/otp_view.dart';
import 'views/auth/role_view.dart';
import 'views/auth/mitra_role_view.dart';
import 'views/auth/pemilik_marketplace/mitra_marketplace_registration_view.dart';
import 'views/auth/pemilik_marketplace/mitra_marketplace_success_view.dart';
import 'views/auth/pemilik_marketplace/mitra_marketplace_dashboard_view.dart';
import 'views/customer_main_layout.dart';
import 'views/driver/driver_home_view.dart';
import 'views/services/marketplace_view.dart';
import 'views/services/catering_view.dart';
import 'views/services/laundry_view.dart';
import 'views/services/kos_view.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppProvider()),
      ],
      child: const TheRangerApp(),
    ),
  );
}

class TheRangerApp extends StatelessWidget {
  const TheRangerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'The Ranger Mobile 2.0',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const MainAppRouter(),
    );
  }
}

class MainAppRouter extends StatelessWidget {
  const MainAppRouter({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);

    Widget currentWidget;
    switch (appState.currentScreen) {
      case AppScreen.splash:
        currentWidget = const SplashView();
        break;
      case AppScreen.onboarding:
        currentWidget = const OnboardingView();
        break;
      case AppScreen.login:
        currentWidget = const LoginView();
        break;
      case AppScreen.otp:
        currentWidget = const OtpView();
        break;
      case AppScreen.role:
        currentWidget = const RoleView();
        break;
      case AppScreen.mitraRole:
        currentWidget = const MitraRoleView();
        break;
      case AppScreen.mitraMarketplaceRegistration:
        currentWidget = const MitraMarketplaceRegistrationView();
        break;
      case AppScreen.mitraMarketplaceSuccess:
        currentWidget = const MitraMarketplaceSuccessView();
        break;
      case AppScreen.mitraMarketplaceDashboard:
        currentWidget = const MitraMarketplaceDashboardView();
        break;
      case AppScreen.cMarketplace:
        currentWidget = const MarketplaceView();
        break;
      case AppScreen.cCatering:
        currentWidget = const CateringView();
        break;
      case AppScreen.cLaundry:
        currentWidget = const LaundryView();
        break;
      case AppScreen.cKos:
        currentWidget = const KosView();
        break;
      default:
        currentWidget = appState.role == UserRole.customer
            ? const CustomerMainLayout()
            : const DriverHomeView();
        break;
    }

    final isAuthOrSplash = appState.currentScreen == AppScreen.splash ||
        appState.currentScreen == AppScreen.onboarding ||
        appState.currentScreen == AppScreen.login ||
        appState.currentScreen == AppScreen.otp ||
        appState.currentScreen == AppScreen.role ||
        appState.currentScreen == AppScreen.mitraRole ||
        appState.currentScreen == AppScreen.mitraMarketplaceRegistration ||
        appState.currentScreen == AppScreen.mitraMarketplaceSuccess ||
        appState.currentScreen == AppScreen.mitraMarketplaceDashboard;

    return Scaffold(
      body: currentWidget,
      floatingActionButton: isAuthOrSplash ? null : FloatingActionButton.extended(
          backgroundColor: Colors.black87,
          foregroundColor: Colors.white,
          onPressed: () {
            final nextRole = appState.role == UserRole.customer
                ? UserRole.driver
                : UserRole.customer;
            appState.setRole(nextRole);
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  "Mode diganti ke: ${nextRole == UserRole.customer ? 'Pelanggan' : 'Driver'}",
                ),
                duration: const Duration(seconds: 1),
              ),
            );
          },
          icon: Icon(
            appState.role == UserRole.customer ? LucideIcons.bike : LucideIcons.user,
            size: 18,
          ),
          label: Text(
            appState.role == UserRole.customer ? "Mode Driver" : "Mode Pelanggan",
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
          ),
        ),
    );
  }
}
