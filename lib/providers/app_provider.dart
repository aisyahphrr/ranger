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
  cateringOwnerLogin,
  cateringOwnerRegistration,
  cateringOwnerSuccess,
  cateringOwnerDashboard,
}

class AppProvider with ChangeNotifier {
  AppProvider() {
    _restoreMarketplaceSession();
    _restoreRegisteredMitras();
    _restoreCateringSession();
    _restoreRegisteredCateringOwners();
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
  final List<Product> _cateringProducts = [];
  final List<OrderModel> _cateringOrders = [];
  String _marketplaceOwnerName = '';
  String _marketplaceStoreName = '';
  String _marketplacePhone = '';
  String _marketplaceAddress = '';
  String _marketplaceStoreDescription = '';
  String _marketplaceProfileImageBase64 = '';
  Map<String, String> _marketplaceOperatingHours = _defaultMarketplaceHours();
  Map<String, bool> _marketplaceOperatingDays = _defaultMarketplaceDays();
  bool _marketplaceIsOpen = true;
  String _marketplaceEmail = '';
  String _marketplacePassword = '';
  bool _isMarketplaceRegistered = false;
  Map<String, Map<String, dynamic>> _registeredMitras = {};
  String _cateringOwnerName = '';
  String _cateringBusinessName = '';
  String _cateringPhone = '';
  String _cateringAddress = '';
  String _cateringEmail = '';
  String _cateringPassword = '';
  bool _isCateringRegistered = false;
  Map<String, Map<String, dynamic>> _registeredCateringOwners = {};
  String _cateringDescription = '';
  String _cateringProfileImageBase64 = '';
  Map<String, String> _cateringOperatingHours = _defaultCateringHours();
  Map<String, bool> _cateringOperatingDays = _defaultCateringDays();
  bool _cateringIsOpen = true;

  UserRole get role => _role;
  AppScreen get currentScreen => _currentScreen;
  int get customerTabIndex => _customerTabIndex;
  int get driverTabIndex => _driverTabIndex;
  bool get isDriverOnline => _isDriverOnline;
  int get walletBalance => _walletBalance;
  int get gopayBalance => _gopayBalance;
  int get rangerPoints => _rangerPoints;

  List<Product> get products => _products;
  List<Product> get marketplaceProducts => _products
      .where((product) => product.store == _marketplaceStoreName)
      .toList();
  String get marketplaceOwnerName => _marketplaceOwnerName;
  String get marketplaceStoreName => _marketplaceStoreName;
  String get marketplacePhone => _marketplacePhone;
  String get marketplaceAddress => _marketplaceAddress;
  String get marketplaceStoreDescription => _marketplaceStoreDescription;
  Uint8List? get marketplaceProfileImageBytes =>
      _marketplaceProfileImageBase64.isEmpty
          ? null
          : Uint8List.fromList(base64Decode(_marketplaceProfileImageBase64));
  Map<String, String> get marketplaceOperatingHours =>
      Map.unmodifiable(_marketplaceOperatingHours);
  Map<String, bool> get marketplaceOperatingDays =>
      Map.unmodifiable(_marketplaceOperatingDays);
  bool get marketplaceIsOpen => _marketplaceIsOpen;
  bool get isMarketplaceProfileComplete =>
      _marketplaceOwnerName.trim().isNotEmpty &&
      _marketplaceStoreName.trim().isNotEmpty &&
      _marketplaceAddress.trim().isNotEmpty &&
      _marketplacePhone.trim().isNotEmpty &&
      _marketplacePhone.trim().toLowerCase() != 'belum diisi';
  String get marketplaceEmail => _marketplaceEmail;
  String get marketplacePassword => _marketplacePassword;
  bool get isMarketplaceRegistered => _isMarketplaceRegistered;
  List<Product> get cartItems => _cartItems;
  List<OrderModel> get orders => _orders;
  List<Product> get cateringProducts => _cateringProducts;
  List<OrderModel> get cateringOrders => _cateringOrders;
  String get cateringOwnerName => _cateringOwnerName;
  String get cateringBusinessName => _cateringBusinessName;
  String get cateringPhone => _cateringPhone;
  String get cateringAddress => _cateringAddress;
  String get cateringEmail => _cateringEmail;
  bool get isCateringRegistered => _isCateringRegistered;
  String get cateringDescription => _cateringDescription;
  Uint8List? get cateringProfileImageBytes =>
      _cateringProfileImageBase64.isEmpty
          ? null
          : Uint8List.fromList(base64Decode(_cateringProfileImageBase64));
  Map<String, String> get cateringOperatingHours =>
      Map.unmodifiable(_cateringOperatingHours);
  Map<String, bool> get cateringOperatingDays =>
      Map.unmodifiable(_cateringOperatingDays);
  bool get cateringIsOpen => _cateringIsOpen;
  bool get isCateringProfileComplete =>
      _cateringOwnerName.trim().isNotEmpty &&
      _cateringBusinessName.trim().isNotEmpty &&
      _cateringAddress.trim().isNotEmpty &&
      _cateringPhone.trim().isNotEmpty &&
      _cateringPhone.trim().toLowerCase() != 'belum diisi';

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
    String storeDescription = '',
    Map<String, String>? operatingHours,
    Map<String, bool>? operatingDays,
    bool isOpen = true,
  }) async {
    _marketplaceOwnerName = ownerName;
    _marketplaceStoreName = storeName;
    _marketplacePhone = phone;
    _marketplaceAddress = address;
    _marketplaceStoreDescription = storeDescription;
    _marketplaceOperatingHours = operatingHours ?? _defaultMarketplaceHours();
    _marketplaceOperatingDays = operatingDays ?? _defaultMarketplaceDays();
    _marketplaceIsOpen = isOpen;
    _marketplaceEmail = email;
    _marketplacePassword = password;
    _isMarketplaceRegistered = true;

    _registeredMitras[email] = {
      'ownerName': ownerName,
      'storeName': storeName,
      'phone': phone,
      'address': address,
      'storeDescription': storeDescription,
      'operatingHours': _marketplaceOperatingHours,
      'operatingDays': _marketplaceOperatingDays,
      'isOpen': isOpen,
      'profileImageBase64': _marketplaceProfileImageBase64,
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
        _marketplaceStoreDescription = credentials['storeDescription'] ?? '';
        _marketplaceOperatingHours = _stringMapFrom(
            credentials['operatingHours'], _defaultMarketplaceHours());
        _marketplaceOperatingDays = _boolMapFrom(
            credentials['operatingDays'], _defaultMarketplaceDays());
        _marketplaceIsOpen = credentials['isOpen'] as bool? ?? true;
        _marketplaceProfileImageBase64 =
            credentials['profileImageBase64'] as String? ?? '';
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

  Future<void> updateMarketplaceProfile({
    String? ownerName,
    String? phone,
    Uint8List? profileImageBytes,
  }) async {
    if (ownerName != null) _marketplaceOwnerName = ownerName.trim();
    if (phone != null) _marketplacePhone = phone.trim();
    if (profileImageBytes != null) {
      _marketplaceProfileImageBase64 = base64Encode(profileImageBytes);
    }
    final account = _registeredMitras[_marketplaceEmail];
    if (account != null) {
      account['ownerName'] = _marketplaceOwnerName;
      account['phone'] = _marketplacePhone;
      account['profileImageBase64'] = _marketplaceProfileImageBase64;
    }
    notifyListeners();
    await _saveMarketplaceSession();
    await _saveRegisteredMitras();
  }

  Future<void> updateMarketplaceStore({
    required String storeName,
    required String description,
    required String address,
    required Map<String, String> operatingHours,
    required Map<String, bool> operatingDays,
    required bool isOpen,
  }) async {
    final previousStoreName = _marketplaceStoreName;
    _marketplaceStoreName = storeName.trim();
    _marketplaceStoreDescription = description.trim();
    _marketplaceAddress = address.trim();
    _marketplaceOperatingHours = Map<String, String>.from(operatingHours);
    _marketplaceOperatingDays = Map<String, bool>.from(operatingDays);
    _marketplaceIsOpen = isOpen;

    if (previousStoreName != _marketplaceStoreName) {
      for (var index = 0; index < _products.length; index++) {
        if (_products[index].store == previousStoreName) {
          _products[index] =
              _products[index].copyWith(store: _marketplaceStoreName);
        }
      }
    }

    final account = _registeredMitras[_marketplaceEmail];
    if (account != null) {
      account['storeName'] = _marketplaceStoreName;
      account['storeDescription'] = _marketplaceStoreDescription;
      account['address'] = _marketplaceAddress;
      account['operatingHours'] = _marketplaceOperatingHours;
      account['operatingDays'] = _marketplaceOperatingDays;
      account['isOpen'] = _marketplaceIsOpen;
    }
    notifyListeners();
    await _saveMarketplaceSession();
    await _saveRegisteredMitras();
  }

  Future<bool> changeMarketplacePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    if (currentPassword != _marketplacePassword || newPassword.trim().isEmpty) {
      return false;
    }
    _marketplacePassword = newPassword;
    final account = _registeredMitras[_marketplaceEmail];
    if (account != null) account['password'] = newPassword;
    notifyListeners();
    await _saveMarketplaceSession();
    await _saveRegisteredMitras();
    return true;
  }

  Future<void> setMarketplaceOpen(bool isOpen) async {
    _marketplaceIsOpen = isOpen;
    final account = _registeredMitras[_marketplaceEmail];
    if (account != null) account['isOpen'] = isOpen;
    notifyListeners();
    await _saveMarketplaceSession();
    await _saveRegisteredMitras();
  }

  Future<void> registerCateringOwner({
    required String ownerName,
    required String businessName,
    required String phone,
    required String address,
    required String email,
    required String password,
  }) async {
    _cateringOwnerName = ownerName.trim();
    _cateringBusinessName = businessName.trim();
    _cateringPhone = phone.trim();
    _cateringAddress = address.trim();
    _cateringEmail = email.trim();
    _cateringPassword = password;
    _isCateringRegistered = true;
    _registeredCateringOwners[_cateringEmail] = {
      'ownerName': _cateringOwnerName,
      'businessName': _cateringBusinessName,
      'phone': _cateringPhone,
      'address': _cateringAddress,
      'email': _cateringEmail,
      'password': _cateringPassword,
    };
    notifyListeners();
    await _saveCateringSession();
    await _saveRegisteredCateringOwners();
  }

  Future<bool> loginCateringOwner(String email, String password) async {
    final credentials = _registeredCateringOwners[email.trim()];
    if (credentials == null || credentials['password'] != password) {
      return false;
    }
    _cateringOwnerName = credentials['ownerName'] as String? ?? '';
    _cateringBusinessName = credentials['businessName'] as String? ?? '';
    _cateringPhone = credentials['phone'] as String? ?? '';
    _cateringAddress = credentials['address'] as String? ?? '';
    _cateringEmail = credentials['email'] as String? ?? email.trim();
    _cateringPassword = credentials['password'] as String? ?? password;
    _cateringDescription = credentials['description'] as String? ?? '';
    _cateringProfileImageBase64 = credentials['profileImageBase64'] as String? ?? '';
    _cateringOperatingHours = _stringMapFrom(
        credentials['operatingHours'], _defaultCateringHours());
    _cateringOperatingDays = _boolMapFrom(
        credentials['operatingDays'], _defaultCateringDays());
    _cateringIsOpen = credentials['isOpen'] as bool? ?? true;
    _isCateringRegistered = true;
    await _saveCateringSession();
    _currentScreen = AppScreen.cateringOwnerDashboard;
    notifyListeners();
    return true;
  }

  Future<void> logoutCateringOwner() async {
    _cateringOwnerName = '';
    _cateringBusinessName = '';
    _cateringPhone = '';
    _cateringAddress = '';
    _cateringEmail = '';
    _cateringPassword = '';
    _cateringDescription = '';
    _cateringProfileImageBase64 = '';
    _cateringOperatingHours = _defaultCateringHours();
    _cateringOperatingDays = _defaultCateringDays();
    _cateringIsOpen = true;
    _isCateringRegistered = false;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('catering_owner_session');
    notifyListeners();
  }

  Future<void> updateCateringProfile({
    String? ownerName,
    String? phone,
    Uint8List? profileImageBytes,
  }) async {
    if (ownerName != null) _cateringOwnerName = ownerName.trim();
    if (phone != null) _cateringPhone = phone.trim();
    if (profileImageBytes != null) {
      _cateringProfileImageBase64 = base64Encode(profileImageBytes);
    }
    final account = _registeredCateringOwners[_cateringEmail];
    if (account != null) {
      account['ownerName'] = _cateringOwnerName;
      account['phone'] = _cateringPhone;
      account['profileImageBase64'] = _cateringProfileImageBase64;
    }
    notifyListeners();
    await _saveCateringSession();
    await _saveRegisteredCateringOwners();
  }

  Future<void> updateCateringStore({
    required String businessName,
    required String description,
    required String address,
    required Map<String, String> operatingHours,
    required Map<String, bool> operatingDays,
    required bool isOpen,
  }) async {
    _cateringBusinessName = businessName.trim();
    _cateringDescription = description.trim();
    _cateringAddress = address.trim();
    _cateringOperatingHours = Map<String, String>.from(operatingHours);
    _cateringOperatingDays = Map<String, bool>.from(operatingDays);
    _cateringIsOpen = isOpen;

    final account = _registeredCateringOwners[_cateringEmail];
    if (account != null) {
      account['businessName'] = _cateringBusinessName;
      account['description'] = _cateringDescription;
      account['address'] = _cateringAddress;
      account['operatingHours'] = _cateringOperatingHours;
      account['operatingDays'] = _cateringOperatingDays;
      account['isOpen'] = _cateringIsOpen;
    }
    notifyListeners();
    await _saveCateringSession();
    await _saveRegisteredCateringOwners();
  }

  Future<bool> changeCateringPassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    if (currentPassword != _cateringPassword || newPassword.trim().isEmpty) {
      return false;
    }
    _cateringPassword = newPassword;
    final account = _registeredCateringOwners[_cateringEmail];
    if (account != null) account['password'] = newPassword;
    notifyListeners();
    await _saveCateringSession();
    await _saveRegisteredCateringOwners();
    return true;
  }

  Future<void> setCateringOpen(bool isOpen) async {
    _cateringIsOpen = isOpen;
    final account = _registeredCateringOwners[_cateringEmail];
    if (account != null) account['isOpen'] = isOpen;
    notifyListeners();
    await _saveCateringSession();
    await _saveRegisteredCateringOwners();
  }

  void addCateringProduct(Product product) {
    _cateringProducts.insert(0, product);
    notifyListeners();
    _saveCateringSession();
  }

  void updateCateringProduct(Product product) {
    final index = _cateringProducts.indexWhere((item) => item.id == product.id);
    if (index == -1) return;
    _cateringProducts[index] = product;
    notifyListeners();
    _saveCateringSession();
  }

  void deleteCateringProduct(int productId) {
    _cateringProducts.removeWhere((item) => item.id == productId);
    notifyListeners();
    _saveCateringSession();
  }

  Future<void> logoutMarketplace() async {
    _marketplaceOwnerName = '';
    _marketplaceStoreName = '';
    _marketplacePhone = '';
    _marketplaceAddress = '';
    _marketplaceStoreDescription = '';
    _marketplaceProfileImageBase64 = '';
    _marketplaceOperatingHours = _defaultMarketplaceHours();
    _marketplaceOperatingDays = _defaultMarketplaceDays();
    _marketplaceIsOpen = true;
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
    _marketplaceStoreDescription = data['storeDescription'] as String? ?? '';
    _marketplaceProfileImageBase64 =
        data['profileImageBase64'] as String? ?? '';
    _marketplaceOperatingHours =
        _stringMapFrom(data['operatingHours'], _defaultMarketplaceHours());
    _marketplaceOperatingDays =
        _boolMapFrom(data['operatingDays'], _defaultMarketplaceDays());
    _marketplaceIsOpen = data['isOpen'] as bool? ?? true;
    _marketplaceEmail = data['email'] as String? ?? '';
    _marketplacePassword = data['password'] as String? ?? '';
    _isMarketplaceRegistered = _marketplaceOwnerName.isNotEmpty;
    final savedProducts = (data['products'] as List<dynamic>? ?? [])
        .map((item) => _productFromJson(item as Map<String, dynamic>))
        .toList();
    _products.removeWhere((product) => product.store == _marketplaceStoreName);
    _products.addAll(savedProducts);
    notifyListeners();
  }

  Future<void> _restoreCateringSession() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('catering_owner_session');
    if (raw == null) return;
    final data = jsonDecode(raw) as Map<String, dynamic>;
    _cateringOwnerName = data['ownerName'] as String? ?? '';
    _cateringBusinessName = data['businessName'] as String? ?? '';
    _cateringPhone = data['phone'] as String? ?? '';
    _cateringAddress = data['address'] as String? ?? '';
    _cateringEmail = data['email'] as String? ?? '';
    _cateringPassword = data['password'] as String? ?? '';
    _cateringDescription = data['description'] as String? ?? '';
    _cateringProfileImageBase64 = data['profileImageBase64'] as String? ?? '';
    _cateringOperatingHours =
        _stringMapFrom(data['operatingHours'], _defaultCateringHours());
    _cateringOperatingDays =
        _boolMapFrom(data['operatingDays'], _defaultCateringDays());
    _cateringIsOpen = data['isOpen'] as bool? ?? true;
    _isCateringRegistered = _cateringOwnerName.isNotEmpty;
    _cateringProducts
      ..clear()
      ..addAll(
        (data['products'] as List<dynamic>? ?? []).map(
          (item) => _productFromJson(item as Map<String, dynamic>),
        ),
      );
    notifyListeners();
  }

  Future<void> _saveCateringSession() async {
    if (!_isCateringRegistered) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      'catering_owner_session',
      jsonEncode({
        'ownerName': _cateringOwnerName,
        'businessName': _cateringBusinessName,
        'phone': _cateringPhone,
        'address': _cateringAddress,
        'email': _cateringEmail,
        'password': _cateringPassword,
        'description': _cateringDescription,
        'profileImageBase64': _cateringProfileImageBase64,
        'operatingHours': _cateringOperatingHours,
        'operatingDays': _cateringOperatingDays,
        'isOpen': _cateringIsOpen,
        'products': _cateringProducts.map(_productToJson).toList(),
      }),
    );
  }

  Future<void> _restoreRegisteredCateringOwners() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('registered_catering_owners');
    if (raw == null) return;
    final decoded = jsonDecode(raw) as Map<String, dynamic>;
    _registeredCateringOwners = decoded.map(
      (key, value) => MapEntry(
        key,
        Map<String, dynamic>.from(value as Map),
      ),
    );
    notifyListeners();
  }

  Future<void> _saveRegisteredCateringOwners() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      'registered_catering_owners',
      jsonEncode(_registeredCateringOwners),
    );
  }

  Future<void> _saveMarketplaceSession() async {
    if (!_isMarketplaceRegistered) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
        'marketplace_session',
        jsonEncode({
          'ownerName': _marketplaceOwnerName,
          'storeName': _marketplaceStoreName,
          'phone': _marketplacePhone,
          'address': _marketplaceAddress,
          'storeDescription': _marketplaceStoreDescription,
          'profileImageBase64': _marketplaceProfileImageBase64,
          'operatingHours': _marketplaceOperatingHours,
          'operatingDays': _marketplaceOperatingDays,
          'isOpen': _marketplaceIsOpen,
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
    _registeredMitras = decoded.map(
        (key, value) => MapEntry(key, Map<String, dynamic>.from(value as Map)));
    notifyListeners();
  }

  Future<void> _saveRegisteredMitras() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('registered_mitras', jsonEncode(_registeredMitras));
  }

  Map<String, dynamic> _productToJson(Product product) => {
        'id': product.id,
        'name': product.name,
        'store': product.store,
        'price': product.price,
        'rating': product.rating,
        'sold': product.sold,
        'img': product.img,
        'cat': product.cat,
        'description': product.description,
        'stock': product.stock,
        'isActive': product.isActive,
        'imageBytes': product.imageBytes == null
            ? null
            : base64Encode(product.imageBytes!)
      };
  Product _productFromJson(Map<String, dynamic> data) => Product(
      id: data['id'] as int,
      name: data['name'] as String,
      store: data['store'] as String,
      price: data['price'] as int,
      rating: (data['rating'] as num).toDouble(),
      sold: data['sold'] as int,
      img: data['img'] as String,
      cat: data['cat'] as String,
      description: data['description'] as String? ?? '',
      stock: data['stock'] as int? ?? 0,
      isActive: data['isActive'] as bool? ?? false,
      imageBytes: data['imageBytes'] == null
          ? null
          : Uint8List.fromList(base64Decode(data['imageBytes'] as String)));
}

Map<String, String> _defaultMarketplaceHours() => {
      'Senin': '08.00 - 21.00',
      'Selasa': '08.00 - 21.00',
      'Rabu': '08.00 - 21.00',
      'Kamis': '08.00 - 21.00',
      'Jumat': '08.00 - 21.00',
      'Sabtu': '09.00 - 22.00',
      'Minggu': '09.00 - 22.00',
    };

Map<String, bool> _defaultMarketplaceDays() => {
      for (final day in [
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
        'Minggu'
      ])
        day: true,
    };

Map<String, String> _defaultCateringHours() => {
      'Senin': '08.00 - 21.00',
      'Selasa': '08.00 - 21.00',
      'Rabu': '08.00 - 21.00',
      'Kamis': '08.00 - 21.00',
      'Jumat': '08.00 - 21.00',
      'Sabtu': '09.00 - 22.00',
      'Minggu': '09.00 - 22.00',
    };

Map<String, bool> _defaultCateringDays() => {
      for (final day in [
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
        'Minggu'
      ])
        day: true,
    };

Map<String, String> _stringMapFrom(
    dynamic value, Map<String, String> fallback) {
  if (value is! Map) return fallback;
  return value.map((key, item) => MapEntry(key.toString(), item.toString()));
}

Map<String, bool> _boolMapFrom(dynamic value, Map<String, bool> fallback) {
  if (value is! Map) return fallback;
  return value.map((key, item) => MapEntry(key.toString(), item == true));
}
