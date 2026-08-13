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
import 'views/pemilik_marketplace/mitra_marketplace_registration_view.dart';
import 'views/pemilik_marketplace/mitra_marketplace_success_view.dart';
import 'views/pemilik_marketplace/mitra_marketplace_dashboard_view.dart';
import 'views/pemilik_catering/auth/pemilik_catering_login_view.dart';
import 'views/pemilik_catering/auth/pemilik_catering_registration_view.dart';
import 'views/pemilik_catering/auth/pemilik_catering_success_view.dart';
import 'views/pemilik_catering/dashboard/pemilik_catering_dashboard_view.dart';
import 'views/pemilik_laundry/mitra_laundry_registration_view.dart';
import 'views/pemilik_laundry/mitra_laundry_success_view.dart';
import 'views/pemilik_laundry/auth/pemilik_laundry_login_view.dart';
import 'views/pemilik_laundry/laundry_home_view.dart';
import 'views/pemilik_laundry/pemilik_laundry_dashboard_view.dart';
import 'views/pemilik_kos/mitra_kos_registration_view.dart';
import 'views/pemilik_kos/mitra_kos_success_view.dart';
import 'views/pemilik_kos/auth/pemilik_kos_login_view.dart';
import 'views/pemilik_kos/pemilik_kos_dashboard_view.dart';
import 'views/customer_main_layout.dart';
import 'views/driver/driver_home_view.dart';
import 'views/services/marketplace_view.dart';
import 'views/services/catering_view.dart';
import 'views/customer/laundry_view.dart';
import 'views/customer/kos_view.dart';

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
      case AppScreen.cateringOwnerLogin:
        currentWidget = const PemilikCateringLoginView();
        break;
      case AppScreen.cateringOwnerRegistration:
        currentWidget = const PemilikCateringRegistrationView();
        break;
      case AppScreen.cateringOwnerSuccess:
        currentWidget = const PemilikCateringSuccessView();
        break;
      case AppScreen.cateringOwnerDashboard:
        currentWidget = const PemilikCateringDashboardView();
        break;
      case AppScreen.laundryOwnerRegistration:
        currentWidget = const MitraLaundryRegistrationView();
        break;
      case AppScreen.laundryOwnerSuccess:
        currentWidget = const MitraLaundrySuccessView();
        break;
      case AppScreen.laundryOwnerLogin:
        currentWidget = const PemilikLaundryLoginView();
        break;
      case AppScreen.laundryOwnerDashboard:
        currentWidget = const PemilikLaundryDashboardView();
        break;
      case AppScreen.kosOwnerRegistration:
        currentWidget = const MitraKosRegistrationView();
        break;
      case AppScreen.kosOwnerSuccess:
        currentWidget = const MitraKosSuccessView();
        break;
      case AppScreen.kosOwnerLogin:
        currentWidget = const PemilikKosLoginView();
        break;
      case AppScreen.kosOwnerDashboard:
        currentWidget = const PemilikKosDashboardView();
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

    return Scaffold(body: currentWidget);
  }
}
