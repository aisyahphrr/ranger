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
    _restoreCustomerSession();
    _restoreCustomerOrders();
    _restoreCustomerReviews();
    _restoreCustomerChats();
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

  int? _walletBalance;
  int? _gopayBalance;
  int? _rangerPoints;

  String _customerName = '';
  String _customerPhone = '';
  String _customerAddress = '';
  String _customerLocation = '';

  final List<Product> _cartItems = [];
  final List<Product> _products = List.from(MockData.products);
  final List<OrderModel> _orders = [];
  final List<CustomerNotification> _notifications = [];
  final List<CustomerPromotion> _promotions = [];
  final List<CustomerReview> _reviews = [];
  final List<CustomerChatThread> _chatThreads = [];
  final List<CustomerChatMessage> _chatMessages = [];
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
  int? get walletBalance => _walletBalance;
  int? get gopayBalance => _gopayBalance;
  int? get rangerPoints => _rangerPoints;
  String? get customerName =>
      _customerName.trim().isEmpty ? null : _customerName.trim();
  String get customerPhone => _customerPhone;
  String? get customerAddress =>
      _customerAddress.trim().isEmpty ? null : _customerAddress.trim();
  String? get customerLocation =>
      _customerLocation.trim().isEmpty ? null : _customerLocation.trim();

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
  List<Product> get cartItems => List.unmodifiable(_cartItems);
  List<OrderModel> get orders => List.unmodifiable(_orders);
  List<CustomerNotification> get notifications =>
      List.unmodifiable(_notifications);
  List<CustomerPromotion> get promotions => List.unmodifiable(_promotions);
  List<CustomerReview> get reviews => List.unmodifiable(_reviews);
  List<CustomerChatThread> get chatThreads => List.unmodifiable(_chatThreads);
  int get unreadChatCount =>
      _chatThreads.fold(0, (total, thread) => total + thread.unreadCount);
  int get unreadInboxCount => unreadNotificationCount + unreadChatCount;
  List<CustomerReview> reviewsForStore(String storeName) {
    final orderIds = _orders
        .where((order) => order.detail == storeName)
        .map((order) => order.id)
        .toSet();
    return _reviews
        .where((review) => orderIds.contains(review.orderId))
        .toList(growable: false);
  }

  int get unreadNotificationCount =>
      _notifications.where((item) => !item.isRead).length;
  int get cartItemCount => _cartItems.length;
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

  List<String> get marketplaceNames => _products
      .map((product) => product.store.trim())
      .where((store) => store.isNotEmpty)
      .toSet()
      .toList();

  List<Product> productsForStore(String storeName) => _products
      .followedBy(_cateringProducts)
      .where((product) => product.store == storeName)
      .toList(growable: false);

  bool isStoreOpen(String storeName) {
    if (storeName == _marketplaceStoreName &&
        _marketplaceStoreName.isNotEmpty) {
      return _marketplaceIsOpen;
    }
    if (storeName == _cateringBusinessName &&
        _cateringBusinessName.isNotEmpty) {
      return _cateringIsOpen;
    }
    return true;
  }

  String storeAddress(String storeName) {
    if (storeName == _marketplaceStoreName && _marketplaceAddress.isNotEmpty) {
      return _marketplaceAddress;
    }
    if (storeName == _cateringBusinessName && _cateringAddress.isNotEmpty) {
      return _cateringAddress;
    }
    return '';
  }

  bool isCateringStore(String storeName) =>
      storeName.isNotEmpty && storeName == _cateringBusinessName;

  int cartQuantity(int productId) =>
      _cartItems.where((item) => item.id == productId).length;

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
    if (!product.isAvailable || !isStoreOpen(product.store) || quantity <= 0) {
      return;
    }
    final remainingStock = product.stock - cartQuantity(product.id);
    final safeQuantity = quantity > remainingStock ? remainingStock : quantity;
    if (safeQuantity <= 0) return;
    for (int i = 0; i < safeQuantity; i++) {
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

  void setCartQuantity(Product product, int quantity) {
    final current = cartQuantity(product.id);
    final target = quantity.clamp(0, product.stock).toInt();
    if (target > current) {
      addToCart(product, quantity: target - current);
    } else if (target < current) {
      for (var i = 0; i < current - target; i++) {
        removeFromCart(product);
      }
    }
  }

  Future<void> saveCustomerProfile({
    String? name,
    String? phone,
    String? address,
    String? location,
  }) async {
    if (name != null) _customerName = name.trim();
    if (phone != null) _customerPhone = phone.trim();
    if (address != null) _customerAddress = address.trim();
    if (location != null) _customerLocation = location.trim();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      'customer_profile',
      jsonEncode({
        'name': _customerName,
        'phone': _customerPhone,
        'address': _customerAddress,
        'location': _customerLocation,
      }),
    );
    notifyListeners();
  }

  Future<void> logoutCustomer() async {
    _customerName = '';
    _customerPhone = '';
    _customerAddress = '';
    _customerLocation = '';
    _cartItems.clear();
    _orders.clear();
    _notifications.clear();
    _reviews.clear();
    _chatThreads.clear();
    _chatMessages.clear();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('customer_profile');
    await prefs.remove('customer_orders');
    await prefs.remove('customer_reviews');
    await prefs.remove('customer_chats');
    _currentScreen = AppScreen.login;
    notifyListeners();
  }

  void markNotificationRead(String notificationId) {
    final index =
        _notifications.indexWhere((item) => item.id == notificationId);
    if (index == -1 || _notifications[index].isRead) return;
    _notifications[index] = _notifications[index].copyWith(isRead: true);
    notifyListeners();
  }

  void markAllNotificationsRead() {
    for (var index = 0; index < _notifications.length; index++) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
    }
    notifyListeners();
  }

  void markAllInboxRead() {
    markAllNotificationsRead();
    for (var index = 0; index < _chatThreads.length; index++) {
      if (_chatThreads[index].unreadCount > 0) {
        _chatThreads[index] = _chatThreads[index].copyWith(unreadCount: 0);
      }
    }
    _saveCustomerChats();
    notifyListeners();
  }

  CustomerChatThread? chatThread(String threadId) {
    for (final thread in _chatThreads) {
      if (thread.id == threadId) return thread;
    }
    return null;
  }

  List<CustomerChatMessage> messagesForThread(String threadId) {
    return _chatMessages
        .where((message) => message.threadId == threadId)
        .toList(growable: false);
  }

  String chatThreadId({
    required String orderId,
    required String participantType,
  }) =>
      'order:$orderId:$participantType';

  CustomerChatThread ensureChatThread({
    required OrderModel order,
    required String participantType,
  }) {
    final id = chatThreadId(
      orderId: order.id,
      participantType: participantType,
    );
    final existing = chatThread(id);
    if (existing != null) return existing;

    final participantName = participantType == 'driver'
        ? (order.driverName?.trim().isNotEmpty ?? false)
            ? order.driverName!.trim()
            : 'Driver Rangers'
        : order.detail.trim().isEmpty
            ? 'Toko'
            : order.detail.trim();
    final thread = CustomerChatThread(
      id: id,
      orderId: order.id,
      participantType: participantType,
      participantName: participantName,
      lastMessage: '',
      updatedAt: DateTime.now().toIso8601String(),
    );
    _chatThreads.insert(0, thread);
    _saveCustomerChats();
    notifyListeners();
    return thread;
  }

  void sendChatMessage({
    required String threadId,
    required String text,
  }) {
    final cleanText = text.trim();
    if (cleanText.isEmpty) return;
    final threadIndex = _chatThreads.indexWhere((item) => item.id == threadId);
    if (threadIndex == -1) return;

    final now = DateTime.now().toIso8601String();
    _chatMessages.add(CustomerChatMessage(
      id: 'message-${DateTime.now().microsecondsSinceEpoch}',
      threadId: threadId,
      text: cleanText,
      senderType: 'customer',
      sentAt: now,
    ));
    _chatThreads[threadIndex] = _chatThreads[threadIndex].copyWith(
      lastMessage: cleanText,
      updatedAt: now,
      unreadCount: 0,
    );
    _sortChatThreads();
    _saveCustomerChats();
    notifyListeners();
  }

  void markChatThreadRead(String threadId) {
    final index = _chatThreads.indexWhere((item) => item.id == threadId);
    if (index == -1 || _chatThreads[index].unreadCount == 0) return;
    _chatThreads[index] = _chatThreads[index].copyWith(unreadCount: 0);
    _saveCustomerChats();
    notifyListeners();
  }

  void replacePromotions(Iterable<CustomerPromotion> promotions) {
    _promotions
      ..clear()
      ..addAll(promotions);
    notifyListeners();
  }

  Future<void> submitReview(
      {required String orderId,
      required int rating,
      required String text}) async {
    _reviews.removeWhere((review) => review.orderId == orderId);
    _reviews.add(CustomerReview(
        orderId: orderId,
        rating: rating,
        text: text.trim(),
        date: DateTime.now().toIso8601String()));
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
        'customer_reviews',
        jsonEncode(_reviews
            .map((review) => {
                  'orderId': review.orderId,
                  'rating': review.rating,
                  'text': review.text,
                  'date': review.date
                })
            .toList()));
    notifyListeners();
  }

  void deductWallet(int amount) {
    if (_walletBalance != null) _walletBalance = _walletBalance! - amount;
    notifyListeners();
  }

  void deductGoPay(int amount) {
    if (_gopayBalance != null) _gopayBalance = _gopayBalance! - amount;
    notifyListeners();
  }

  void placeOrder(OrderModel order) {
    _orders.insert(0, order);
    _notifications.insert(
      0,
      CustomerNotification(
        id: 'order-${order.id}',
        title: 'Pesanan dibuat',
        description: 'Pesanan #${order.id} sedang menunggu diproses.',
        time: 'Baru saja',
        type: 'order',
        orderId: order.id,
      ),
    );
    _saveCustomerOrders();
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
    _cateringProfileImageBase64 =
        credentials['profileImageBase64'] as String? ?? '';
    _cateringOperatingHours =
        _stringMapFrom(credentials['operatingHours'], _defaultCateringHours());
    _cateringOperatingDays =
        _boolMapFrom(credentials['operatingDays'], _defaultCateringDays());
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

  Future<void> _restoreCustomerSession() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('customer_profile');
    if (raw == null) return;
    try {
      final data = jsonDecode(raw) as Map<String, dynamic>;
      _customerName = data['name'] as String? ?? '';
      _customerPhone = data['phone'] as String? ?? '';
      _customerAddress = data['address'] as String? ?? '';
      _customerLocation = data['location'] as String? ?? '';
      notifyListeners();
    } catch (_) {
      // Ignore an invalid local session and allow the customer to continue
      // with the safe empty-profile fallback.
    }
  }

  Future<void> _restoreCustomerOrders() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('customer_orders');
    if (raw == null) return;
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      _orders
        ..clear()
        ..addAll(decoded
            .map((item) => _orderFromJson(item as Map<String, dynamic>)));
      _notifications
        ..clear()
        ..addAll(
          _orders.map(
            (order) => CustomerNotification(
              id: 'order-${order.id}',
              title: 'Pesanan ${order.status}',
              description: 'Pesanan #${order.id} dari ${order.detail}.',
              time: order.date,
              type: order.status == 'Selesai' ? 'review' : 'order',
              orderId: order.id,
              isRead: true,
            ),
          ),
        );
      notifyListeners();
    } catch (_) {
      // Ignore invalid local orders instead of breaking the customer home.
    }
  }

  Future<void> _restoreCustomerReviews() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('customer_reviews');
    if (raw == null) return;
    try {
      final decoded = jsonDecode(raw) as List<dynamic>;
      _reviews
        ..clear()
        ..addAll(decoded
            .whereType<Map<String, dynamic>>()
            .map((item) => CustomerReview(
                  orderId: item['orderId'] as String? ?? '',
                  rating: (item['rating'] as num?)?.toInt() ?? 0,
                  text: item['text'] as String? ?? '',
                  date: item['date'] as String? ?? '',
                )));
      notifyListeners();
    } catch (_) {
      // Ignore invalid local reviews.
    }
  }

  Future<void> _saveCustomerOrders() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      'customer_orders',
      jsonEncode(_orders.map(_orderToJson).toList()),
    );
  }

  Future<void> _restoreCustomerChats() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('customer_chats');
    if (raw == null) return;
    try {
      final data = jsonDecode(raw) as Map<String, dynamic>;
      final rawThreads = data['threads'] as List<dynamic>? ?? [];
      final rawMessages = data['messages'] as List<dynamic>? ?? [];
      _chatThreads
        ..clear()
        ..addAll(rawThreads
            .whereType<Map<String, dynamic>>()
            .map(_chatThreadFromJson));
      _chatMessages
        ..clear()
        ..addAll(rawMessages
            .whereType<Map<String, dynamic>>()
            .map(_chatMessageFromJson));
      _sortChatThreads();
      notifyListeners();
    } catch (_) {
      // Ignore invalid chat history and keep the inbox usable.
    }
  }

  Future<void> _saveCustomerChats() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      'customer_chats',
      jsonEncode({
        'threads': _chatThreads.map(_chatThreadToJson).toList(),
        'messages': _chatMessages.map(_chatMessageToJson).toList(),
      }),
    );
  }

  void _sortChatThreads() {
    _chatThreads
        .sort((left, right) => right.updatedAt.compareTo(left.updatedAt));
  }

  Map<String, dynamic> _chatThreadToJson(CustomerChatThread thread) => {
        'id': thread.id,
        'orderId': thread.orderId,
        'participantType': thread.participantType,
        'participantName': thread.participantName,
        'lastMessage': thread.lastMessage,
        'updatedAt': thread.updatedAt,
        'unreadCount': thread.unreadCount,
      };

  CustomerChatThread _chatThreadFromJson(Map<String, dynamic> data) =>
      CustomerChatThread(
        id: data['id'] as String? ?? '',
        orderId: data['orderId'] as String? ?? '',
        participantType: data['participantType'] as String? ?? 'store',
        participantName: data['participantName'] as String? ?? 'Toko',
        lastMessage: data['lastMessage'] as String? ?? '',
        updatedAt: data['updatedAt'] as String? ?? '',
        unreadCount: (data['unreadCount'] as num?)?.toInt() ?? 0,
      );

  Map<String, dynamic> _chatMessageToJson(CustomerChatMessage message) => {
        'id': message.id,
        'threadId': message.threadId,
        'text': message.text,
        'senderType': message.senderType,
        'sentAt': message.sentAt,
      };

  CustomerChatMessage _chatMessageFromJson(Map<String, dynamic> data) =>
      CustomerChatMessage(
        id: data['id'] as String? ?? '',
        threadId: data['threadId'] as String? ?? '',
        text: data['text'] as String? ?? '',
        senderType: data['senderType'] as String? ?? 'customer',
        sentAt: data['sentAt'] as String? ?? '',
      );

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

  Map<String, dynamic> _orderToJson(OrderModel order) => {
        'id': order.id,
        'type': order.type,
        'item': order.item,
        'detail': order.detail,
        'status': order.status,
        'date': order.date,
        'total': order.total,
        'address': order.address,
        'paymentMethod': order.paymentMethod,
        'driverId': order.driverId,
        'driverName': order.driverName,
        'driverPhone': order.driverPhone,
        'driverVehicle': order.driverVehicle,
        'lines': order.lines
            .map(
              (line) => {
                'productId': line.productId,
                'name': line.name,
                'price': line.price,
                'quantity': line.quantity,
              },
            )
            .toList(),
      };

  OrderModel _orderFromJson(Map<String, dynamic> data) {
    final rawLines = data['lines'] as List<dynamic>? ?? [];
    return OrderModel(
      id: data['id'] as String? ?? '',
      type: data['type'] as String? ?? 'Marketplace',
      item: data['item'] as String? ?? '',
      detail: data['detail'] as String? ?? '',
      status: data['status'] as String? ?? 'Diproses',
      date: data['date'] as String? ?? '',
      total: (data['total'] as num?)?.toInt() ?? 0,
      address: data['address'] as String? ?? '',
      paymentMethod: data['paymentMethod'] as String? ?? '',
      driverId: data['driverId'] as String?,
      driverName: data['driverName'] as String?,
      driverPhone: data['driverPhone'] as String?,
      driverVehicle: data['driverVehicle'] as String?,
      lines: rawLines
          .whereType<Map<String, dynamic>>()
          .map(
            (line) => OrderLine(
              productId: (line['productId'] as num?)?.toInt() ?? 0,
              name: line['name'] as String? ?? '',
              price: (line['price'] as num?)?.toInt() ?? 0,
              quantity: (line['quantity'] as num?)?.toInt() ?? 0,
            ),
          )
          .toList(),
    );
  }

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
