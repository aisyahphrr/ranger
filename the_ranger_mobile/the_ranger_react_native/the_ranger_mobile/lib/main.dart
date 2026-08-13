import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'providers/app_provider.dart';
import 'views/splash/splash_view.dart';
import 'views/onboarding/onboarding_view.dart';
import 'views/auth/login_view.dart';
import 'views/auth/otp_view.dart';
import 'views/auth/role_view.dart';
import 'views/customer_main_layout.dart';
import 'views/driver/driver_home_view.dart';
import 'views/pemilik_kos/kos_home_view.dart';
import 'views/pemilik_laundry/laundry_home_view.dart';
import 'views/pemilik_catering/catering_home_view.dart';
import 'views/pemilik_marketplace/marketplace_home_view.dart';
import 'views/customer/services/marketplace_view.dart';
import 'views/customer/services/catering_view.dart';
import 'views/customer/services/laundry_view.dart';
import 'views/customer/services/kos_view.dart';
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

  void _showRoleSelectorSheet(BuildContext context, AppProvider appState) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        final roles = [
          {"role": UserRole.customer, "title": "Pelanggan / Customer", "icon": LucideIcons.user, "color": Colors.green},
          {"role": UserRole.driver, "title": "Kurir / Driver", "icon": LucideIcons.bike, "color": Colors.orange},
          {"role": UserRole.pemilikKos, "title": "Pemilik Kos", "icon": LucideIcons.building, "color": Colors.purple},
          {"role": UserRole.pemilikLaundry, "title": "Pemilik Laundry", "icon": LucideIcons.shirt, "color": Colors.blue},
          {"role": UserRole.pemilikCatering, "title": "Pemilik Catering", "icon": LucideIcons.utensils, "color": Colors.amber},
          {"role": UserRole.pemilikMarketplace, "title": "Pemilik Marketplace", "icon": LucideIcons.store, "color": Colors.teal},
        ];

        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Pilih Peran Tampilan App",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 4),
              const Text(
                "Beralih antara mode pengguna dan berbagai pemilik usaha",
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 16),
              Flexible(
                child: ListView.separated(
                  shrinkWrap: true,
                  itemCount: roles.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final item = roles[index];
                    final roleEnum = item["role"] as UserRole;
                    final isSelected = appState.role == roleEnum;

                    return ListTile(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      tileColor: isSelected ? const Color(0xFFF1F5F9) : Colors.transparent,
                      leading: Icon(item["icon"] as IconData, color: item["color"] as Color),
                      title: Text(
                        item["title"] as String,
                        style: TextStyle(
                          fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                      trailing: isSelected ? const Icon(Icons.check_circle, color: Color(0xFF15803D)) : null,
                      onTap: () {
                        appState.setRole(roleEnum);
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text("Berpindah ke: ${item['title']}"),
                            duration: const Duration(seconds: 1),
                          ),
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

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
      case AppScreen.kosHome:
        currentWidget = const KosHomeView();
        break;
      case AppScreen.laundryHome:
        currentWidget = const LaundryHomeView();
        break;
      case AppScreen.cateringHome:
        currentWidget = const CateringHomeView();
        break;
      case AppScreen.marketplaceHome:
        currentWidget = const MarketplaceHomeView();
        break;
      default:
        switch (appState.role) {
          case UserRole.customer:
            currentWidget = const CustomerMainLayout();
            break;
          case UserRole.driver:
            currentWidget = const DriverHomeView();
            break;
          case UserRole.pemilikKos:
            currentWidget = const KosHomeView();
            break;
          case UserRole.pemilikLaundry:
            currentWidget = const LaundryHomeView();
            break;
          case UserRole.pemilikCatering:
            currentWidget = const CateringHomeView();
            break;
          case UserRole.pemilikMarketplace:
            currentWidget = const MarketplaceHomeView();
            break;
        }
        break;
    }

    final isAuthOrSplash = appState.currentScreen == AppScreen.splash ||
        appState.currentScreen == AppScreen.onboarding ||
        appState.currentScreen == AppScreen.login ||
        appState.currentScreen == AppScreen.otp ||
        appState.currentScreen == AppScreen.role;

    return Scaffold(
      body: currentWidget,
      floatingActionButton: isAuthOrSplash
          ? null
          : FloatingActionButton.extended(
              backgroundColor: Colors.black87,
              foregroundColor: Colors.white,
              onPressed: () => _showRoleSelectorSheet(context, appState),
              icon: const Icon(LucideIcons.repeat, size: 16),
              label: const Text(
                "Ganti Mode Peran",
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ),
    );
  }
}
