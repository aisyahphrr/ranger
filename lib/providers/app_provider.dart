import 'package:flutter/material.dart';
import '../models/models.dart';
import '../core/constants/mock_data.dart';

enum UserRole { customer, driver }

enum AppScreen {
  splash,
  onboarding,
  login,
  otp,
  role,
  mitraRole,
  cHome,
  cJelajah,
  cPesanan,
  cInbox,
  cProfil,
  cMarketplace,
  cCatering,
  cLaundry,
  cKos,
  cCart,
  cQris,
  cTracking,
  cDriverChat,
  dHome,
  dOrder,
  dRiwayat,
  dPendapatan,
  dProfil,
  mitraMarketplaceRegistration,
  mitraMarketplaceSuccess,
  mitraMarketplaceDashboard,
}

class AppProvider with ChangeNotifier {
  UserRole _role = UserRole.customer;
  AppScreen _currentScreen = AppScreen.splash;
  int _customerTabIndex = 0;
  int _driverTabIndex = 0;
  bool _isDriverOnline = true;

  int _walletBalance = 150000;
  int _gopayBalance = 100000;
  final int _rangerPoints = 1250;

  final List<Product> _cartItems = [];
  final List<Product> _products = List.from(MockData.products);
  final List<OrderModel> _orders = List.from(MockData.orders);

  UserRole get role => _role;
  AppScreen get currentScreen => _currentScreen;
  int get customerTabIndex => _customerTabIndex;
  int get driverTabIndex => _driverTabIndex;
  bool get isDriverOnline => _isDriverOnline;
  int get walletBalance => _walletBalance;
  int get gopayBalance => _gopayBalance;
  int get rangerPoints => _rangerPoints;

  List<Product> get products => _products;
  List<Product> get cartItems => _cartItems;
  List<OrderModel> get orders => _orders;

  int get cartTotalPrice => _cartItems.fold(0, (sum, item) => sum + item.price);

  void navigate(AppScreen screen) {
    _currentScreen = screen;
    notifyListeners();
  }

  void setRole(UserRole role) {
    _role = role;
    if (role == UserRole.customer) {
      _currentScreen = AppScreen.cHome;
    } else {
      _currentScreen = AppScreen.dHome;
    }
    notifyListeners();
  }

  void setCustomerTab(int index) {
    _customerTabIndex = index;
    switch (index) {
      case 0:
        _currentScreen = AppScreen.cHome;
        break;
      case 1:
        _currentScreen = AppScreen.cJelajah;
        break;
      case 2:
        _currentScreen = AppScreen.cPesanan;
        break;
      case 3:
        _currentScreen = AppScreen.cInbox;
        break;
      case 4:
        _currentScreen = AppScreen.cProfil;
        break;
    }
    notifyListeners();
  }

  void setDriverTab(int index) {
    _driverTabIndex = index;
    switch (index) {
      case 0:
        _currentScreen = AppScreen.dHome;
        break;
      case 1:
        _currentScreen = AppScreen.dOrder;
        break;
      case 2:
        _currentScreen = AppScreen.dRiwayat;
        break;
      case 3:
        _currentScreen = AppScreen.dPendapatan;
        break;
      case 4:
        _currentScreen = AppScreen.dProfil;
        break;
    }
    notifyListeners();
  }

  void toggleDriverOnline() {
    _isDriverOnline = !_isDriverOnline;
    notifyListeners();
  }

  void addToCart(Product product, {int quantity = 1}) {
    for (int i = 0; i < quantity; i++) {
      _cartItems.add(product);
    }
    notifyListeners();
  }

  void removeFromCart(Product product) {
    _cartItems.remove(product);
    notifyListeners();
  }

  void clearCart() {
    _cartItems.clear();
    notifyListeners();
  }

  void deductWallet(int amount) {
    _walletBalance -= amount;
    notifyListeners();
  }

  void deductGoPay(int amount) {
    _gopayBalance -= amount;
    notifyListeners();
  }

  void placeOrder(OrderModel order) {
    _orders.insert(0, order);
    notifyListeners();
  }

  void toggleLike(int productId) {
    final index = _products.indexWhere((p) => p.id == productId);
    if (index != -1) {
      _products[index].liked = !_products[index].liked;
      notifyListeners();
    }
  }
}
