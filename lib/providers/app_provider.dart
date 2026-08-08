import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
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
  AppProvider() {
    _restoreMarketplaceSession();
    _restoreRegisteredMitras();
  }

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
  String _marketplaceOwnerName = '';
  String _marketplaceStoreName = '';
  String _marketplacePhone = '';
  String _marketplaceAddress = '';
  String _marketplaceEmail = '';
  String _marketplacePassword = '';
  bool _isMarketplaceRegistered = false;
  Map<String, Map<String, dynamic>> _registeredMitras = {};

  UserRole get role => _role;
  AppScreen get currentScreen => _currentScreen;
  int get customerTabIndex => _customerTabIndex;
  int get driverTabIndex => _driverTabIndex;
  bool get isDriverOnline => _isDriverOnline;
  int get walletBalance => _walletBalance;
  int get gopayBalance => _gopayBalance;
  int get rangerPoints => _rangerPoints;

  List<Product> get products => _products;
  List<Product> get marketplaceProducts => _products.where((product) => product.store == _marketplaceStoreName).toList();
  String get marketplaceOwnerName => _marketplaceOwnerName;
  String get marketplaceStoreName => _marketplaceStoreName;
  String get marketplacePhone => _marketplacePhone;
  String get marketplaceAddress => _marketplaceAddress;
  String get marketplaceEmail => _marketplaceEmail;
  String get marketplacePassword => _marketplacePassword;
  bool get isMarketplaceRegistered => _isMarketplaceRegistered;
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

  void addMarketplaceProduct(Product product) {
    _products.insert(0, product);
    notifyListeners();
    _saveMarketplaceSession();
  }

  void updateMarketplaceProduct(Product product) {
    final index = _products.indexWhere((item) => item.id == product.id);
    if (index == -1) return;
    _products[index] = product;
    notifyListeners();
    _saveMarketplaceSession();
  }

  void deleteMarketplaceProduct(int productId) {
    _products.removeWhere((product) => product.id == productId);
    notifyListeners();
    _saveMarketplaceSession();
  }

  Future<void> saveMarketplaceRegistration({
    required String ownerName,
    required String storeName,
    required String phone,
    required String address,
    required String email,
    required String password,
  }) async {
    _marketplaceOwnerName = ownerName;
    _marketplaceStoreName = storeName;
    _marketplacePhone = phone;
    _marketplaceAddress = address;
    _marketplaceEmail = email;
    _marketplacePassword = password;
    _isMarketplaceRegistered = true;

    _registeredMitras[email] = {
      'ownerName': ownerName,
      'storeName': storeName,
      'phone': phone,
      'address': address,
      'email': email,
      'password': password,
    };

    notifyListeners();
    await _saveMarketplaceSession();
    await _saveRegisteredMitras();
  }

  Future<bool> loginMitra(String email, String password) async {
    if (_registeredMitras.containsKey(email)) {
      final credentials = _registeredMitras[email]!;
      if (credentials['password'] == password) {
        _marketplaceOwnerName = credentials['ownerName'] ?? '';
        _marketplaceStoreName = credentials['storeName'] ?? '';
        _marketplacePhone = credentials['phone'] ?? '';
        _marketplaceAddress = credentials['address'] ?? '';
        _marketplaceEmail = credentials['email'] ?? '';
        _marketplacePassword = credentials['password'] ?? '';
        _isMarketplaceRegistered = true;

        await _saveMarketplaceSession();
        _currentScreen = AppScreen.mitraMarketplaceDashboard;
        notifyListeners();
        return true;
      }
    }
    return false;
  }

  Future<void> logoutMarketplace() async {
    _marketplaceOwnerName = '';
    _marketplaceStoreName = '';
    _marketplacePhone = '';
    _marketplaceAddress = '';
    _marketplaceEmail = '';
    _marketplacePassword = '';
    _isMarketplaceRegistered = false;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('marketplace_session');
    notifyListeners();
  }

  Future<void> _restoreMarketplaceSession() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('marketplace_session');
    if (raw == null) return;
    final data = jsonDecode(raw) as Map<String, dynamic>;
    _marketplaceOwnerName = data['ownerName'] as String? ?? '';
    _marketplaceStoreName = data['storeName'] as String? ?? '';
    _marketplacePhone = data['phone'] as String? ?? '';
    _marketplaceAddress = data['address'] as String? ?? '';
    _marketplaceEmail = data['email'] as String? ?? '';
    _marketplacePassword = data['password'] as String? ?? '';
    _isMarketplaceRegistered = _marketplaceOwnerName.isNotEmpty;
    final savedProducts = (data['products'] as List<dynamic>? ?? []).map((item) => _productFromJson(item as Map<String, dynamic>)).toList();
    _products.removeWhere((product) => product.store == _marketplaceStoreName);
    _products.addAll(savedProducts);
    notifyListeners();
  }

  Future<void> _saveMarketplaceSession() async {
    if (!_isMarketplaceRegistered) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('marketplace_session', jsonEncode({
      'ownerName': _marketplaceOwnerName,
      'storeName': _marketplaceStoreName,
      'phone': _marketplacePhone,
      'address': _marketplaceAddress,
      'email': _marketplaceEmail,
      'password': _marketplacePassword,
      'products': marketplaceProducts.map(_productToJson).toList(),
    }));
  }

  Future<void> _restoreRegisteredMitras() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('registered_mitras');
    if (raw == null) {
      // Seed default demo account wuwu
      _registeredMitras = {
        'wuwu@gmail.com': {
          'ownerName': 'wuwu',
          'storeName': 'Toko Wuwu',
          'phone': '081234567890',
          'address': 'Jl. Kamojang No. 12',
          'email': 'wuwu@gmail.com',
          'password': 'wuwu123',
        }
      };
      await _saveRegisteredMitras();
      return;
    }
    final decoded = jsonDecode(raw) as Map<String, dynamic>;
    _registeredMitras = decoded.map((key, value) => MapEntry(key, Map<String, dynamic>.from(value as Map)));
    notifyListeners();
  }

  Future<void> _saveRegisteredMitras() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('registered_mitras', jsonEncode(_registeredMitras));
  }

  Map<String, dynamic> _productToJson(Product product) => {'id': product.id, 'name': product.name, 'store': product.store, 'price': product.price, 'rating': product.rating, 'sold': product.sold, 'img': product.img, 'cat': product.cat, 'description': product.description, 'stock': product.stock, 'isActive': product.isActive, 'imageBytes': product.imageBytes == null ? null : base64Encode(product.imageBytes!)};
  Product _productFromJson(Map<String, dynamic> data) => Product(id: data['id'] as int, name: data['name'] as String, store: data['store'] as String, price: data['price'] as int, rating: (data['rating'] as num).toDouble(), sold: data['sold'] as int, img: data['img'] as String, cat: data['cat'] as String, description: data['description'] as String? ?? '', stock: data['stock'] as int? ?? 0, isActive: data['isActive'] as bool? ?? false, imageBytes: data['imageBytes'] == null ? null : Uint8List.fromList(base64Decode(data['imageBytes'] as String)));
}
