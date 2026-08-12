import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:the_ranger_mobile/providers/app_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Mitra Authentication Tests', () {
    setUp(() {
      SharedPreferences.setMockInitialValues({});
    });

    test('Should seed default demo account on initialization', () async {
      final provider = AppProvider();
      // Yield to let async restore complete
      await Future.delayed(Duration.zero);

      final success = await provider.loginMitra('wuwu@gmail.com', 'wuwu123');
      expect(success, isTrue);
      expect(provider.marketplaceOwnerName, equals('wuwu'));
      expect(provider.currentScreen, equals(AppScreen.mitraMarketplaceDashboard));
    });

    test('Should save new registration and allow login', () async {
      final provider = AppProvider();
      await Future.delayed(Duration.zero);

      await provider.saveMarketplaceRegistration(
        ownerName: 'Test Owner',
        storeName: 'Test Store',
        phone: '08122223333',
        address: 'Jl. Test No. 12',
        email: 'test@mitra.com',
        password: 'password123',
      );

      // Try logging in with the newly registered account
      final success = await provider.loginMitra('test@mitra.com', 'password123');
      expect(success, isTrue);
      expect(provider.marketplaceOwnerName, equals('Test Owner'));
      expect(provider.marketplaceStoreName, equals('Test Store'));
      expect(provider.currentScreen, equals(AppScreen.mitraMarketplaceDashboard));
    });

    test('Should reject invalid credentials', () async {
      final provider = AppProvider();
      await Future.delayed(Duration.zero);

      final success = await provider.loginMitra('wuwu@gmail.com', 'wrongpassword');
      expect(success, isFalse);
    });
  });
}
