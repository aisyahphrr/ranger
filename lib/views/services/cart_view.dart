import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_provider.dart';

class CartView extends StatefulWidget {
  const CartView({super.key});

  @override
  State<CartView> createState() => _CartViewState();
}

class _CartViewState extends State<CartView> {
  String _paymentMethod = "Dompet"; // 'Dompet', 'GoPay', 'QRIS', or 'COD'
  final int _deliveryFee = 5000;
  final int _serviceFee = 2000;

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);
    final cart = appState.cartItems;
    final wallet = appState.walletBalance;
    final gopay = appState.gopayBalance;

    // Group cart items by store name
    final Map<String, List<Product>> groupedItems = {};
    for (var product in cart) {
      groupedItems.putIfAbsent(product.store, () => []).add(product);
    }

    final subtotal = appState.cartTotalPrice;
    final grandTotal = cart.isEmpty ? 0 : subtotal + _deliveryFee + _serviceFee;
    final hasEnoughWallet = wallet >= grandTotal;
    final hasEnoughGoPay = gopay >= grandTotal;
    final needsBalanceWarning = cart.isNotEmpty &&
        ((_paymentMethod == "Dompet" && !hasEnoughWallet) || (_paymentMethod == "GoPay" && !hasEnoughGoPay));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("Keranjang Belanja"),
      ),
      body: cart.isEmpty
          ? _buildEmptyCart(context)
          : Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // 1. Delivery Address Card
                          _buildAddressSection(),
                          const SizedBox(height: 16),

                          // 2. Merchant Grouped Cart Items
                          ...groupedItems.entries.map((entry) {
                            final storeName = entry.key;
                            final products = entry.value;
                            return _buildStoreGroup(context, storeName, products, appState);
                          }),
                          const SizedBox(height: 16),

                          // 3. Payment Method Card
                                          _buildPaymentMethodSection(wallet, gopay, grandTotal),
                          const SizedBox(height: 16),

                          // 4. Order Billing Summary
                          _buildBillingSummary(subtotal, grandTotal),
                          const SizedBox(height: 24),
                        ],
                      ),
                    ),
                  ),
                ),

                // Sticky Bottom Checkout Actions
                _buildStickyBottomCheckout(context, appState, grandTotal, needsBalanceWarning),
              ],
            ),
    );
  }

  Widget _buildEmptyCart(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: const BoxDecoration(
                color: AppColors.secondary,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                LucideIcons.shoppingCart,
                size: 44,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              "Keranjangmu Kosong",
              style: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 18,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Jelajahi produk berkualitas buatan warga lokal Kamojang dan isi keranjang belanjamu!",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              onPressed: () => Navigator.pop(context),
              child: const Text(
                "Mulai Belanja",
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAddressSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(LucideIcons.mapPin, color: AppColors.primary, size: 22),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Alamat Pengantaran",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textMuted),
                ),
                SizedBox(height: 4),
                Text(
                  "Budi Santoso (Rumah)",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textPrimary),
                ),
                SizedBox(height: 2),
                Text(
                  "Jl. Geothermal No. 12, Kamojang, Kec. Ibun, Kab. Bandung",
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                ),
              ],
            ),
          ),
          Icon(LucideIcons.chevronRight, color: AppColors.textMuted, size: 18),
        ],
      ),
    );
  }

  Widget _buildStoreGroup(BuildContext context, String storeName, List<Product> products, AppProvider appState) {
    // Count quantities of unique items in this store
    final Map<int, int> itemQuantities = {};
    final Map<int, Product> uniqueProducts = {};

    for (var product in products) {
      itemQuantities[product.id] = (itemQuantities[product.id] ?? 0) + 1;
      uniqueProducts[product.id] = product;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Store Header
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 10),
            child: Row(
              children: [
                const Icon(LucideIcons.store, size: 18, color: AppColors.primary),
                const SizedBox(width: 8),
                Text(
                  storeName,
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15),
                ),
                const SizedBox(width: 6),
                const Icon(LucideIcons.checkCircle, size: 14, color: Colors.blue),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.border),

          // Items inside this store
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: uniqueProducts.length,
            itemBuilder: (context, index) {
              final id = uniqueProducts.keys.elementAt(index);
              final product = uniqueProducts[id]!;
              final qty = itemQuantities[id]!;

              return Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Product Image thumbnail
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(
                        product.img,
                        width: 64,
                        height: 64,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          width: 64,
                          height: 64,
                          color: Colors.grey.shade200,
                          child: const Icon(LucideIcons.image, color: Colors.grey),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    
                    // Product info & quantity
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product.name,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            product.formattedPrice,
                            style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              // Quantity controller
                              Container(
                                decoration: BoxDecoration(
                                  border: Border.all(color: AppColors.border),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Row(
                                  children: [
                                    GestureDetector(
                                      onTap: () => appState.removeFromCart(product),
                                      child: const Padding(
                                        padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        child: Icon(LucideIcons.minus, size: 12, color: AppColors.textPrimary),
                                      ),
                                    ),
                                    Text(
                                      qty.toString(),
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                    GestureDetector(
                                      onTap: () => appState.addToCart(product),
                                      child: const Padding(
                                        padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        child: Icon(LucideIcons.plus, size: 12, color: AppColors.textPrimary),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              
                              // Calculated total item price
                              Text(
                                "Rp ${(product.price * qty).toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}",
                                style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.primary, fontSize: 14),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentMethodSection(int wallet, int gopay, int grandTotal) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Metode Pembayaran",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 12),

          // Payment option 1: Dompet Rangers
          InkWell(
            onTap: () => setState(() => _paymentMethod = "Dompet"),
            child: Row(
              children: [
                Radio<String>(
                  value: "Dompet",
                  groupValue: _paymentMethod,
                  onChanged: (val) => setState(() => _paymentMethod = val!),
                  activeColor: AppColors.primary,
                ),
                const Icon(LucideIcons.wallet, color: Colors.amber, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                          const Text(
                        "Dompet Rangers",
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        "Saldo: Rp ${wallet.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}",
                        style: TextStyle(
                          fontSize: 12,
                          color: wallet >= grandTotal ? Colors.green.shade700 : Colors.red.shade700,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 16),

          // Payment option 2: GoPay
          InkWell(
            onTap: () => setState(() => _paymentMethod = "GoPay"),
            child: Row(
              children: [
                Radio<String>(
                  value: "GoPay",
                  groupValue: _paymentMethod,
                  onChanged: (val) => setState(() => _paymentMethod = val!),
                  activeColor: AppColors.primary,
                ),
                const Icon(LucideIcons.smartphone, color: Colors.blue, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "GoPay",
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        "Saldo: Rp ${gopay.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}",
                        style: TextStyle(
                          fontSize: 12,
                          color: gopay >= grandTotal ? Colors.green.shade700 : Colors.red.shade700,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 16),

          // Payment option 3: QRIS
          InkWell(
            onTap: () => setState(() => _paymentMethod = "QRIS"),
            child: Row(
              children: [
                Radio<String>(
                  value: "QRIS",
                  groupValue: _paymentMethod,
                  onChanged: (val) => setState(() => _paymentMethod = val!),
                  activeColor: AppColors.primary,
                ),
                const Icon(LucideIcons.qrCode, color: Colors.indigo, size: 20),
                const SizedBox(width: 10),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "QRIS",
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        "Bayar cepat dengan QR code saat checkout",
                        style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 16),

          // Payment option 4: COD
          InkWell(
            onTap: () => setState(() => _paymentMethod = "COD"),
            child: Row(
              children: [
                Radio<String>(
                  value: "COD",
                  groupValue: _paymentMethod,
                  onChanged: (val) => setState(() => _paymentMethod = val!),
                  activeColor: AppColors.primary,
                ),
                const Icon(LucideIcons.banknote, color: Colors.green, size: 20),
                const SizedBox(width: 10),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Bayar di Tempat (COD)",
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        "Bayar tunai ke kurir Rangers saat pesanan tiba",
                        style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBillingSummary(int subtotal, int grandTotal) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Rincian Pembayaran",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 12),
          _buildBillingRow("Subtotal Produk", subtotal),
          const SizedBox(height: 8),
          _buildBillingRow("Biaya Pengiriman (Kurir Lokal)", _deliveryFee),
          const SizedBox(height: 8),
          _buildBillingRow("Biaya Jasa Aplikasi", _serviceFee),
          const Divider(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Total Pembayaran",
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: AppColors.textPrimary),
              ),
              Text(
                "Rp ${grandTotal.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}",
                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 17, color: AppColors.primary),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBillingRow(String label, int amount) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
        Text(
          "Rp ${amount.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}",
          style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildStickyBottomCheckout(BuildContext context, AppProvider appState, int grandTotal, bool needsBalanceWarning) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 15,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (needsBalanceWarning) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.red.shade200),
              ),
              child: Row(
                children: [
                  Icon(LucideIcons.alertTriangle, color: Colors.red.shade700, size: 16),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "Saldo Dompet Rangers kurang! Ganti metode ke COD.",
                      style: TextStyle(color: Colors.red.shade800, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ],
          
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Total",
                      style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "Rp ${grandTotal.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}",
                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppColors.primary),
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: needsBalanceWarning ? Colors.grey : AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
                onPressed: needsBalanceWarning
                    ? null
                    : () => _handleCheckout(context, appState, grandTotal),
                child: const Row(
                  children: [
                    Text(
                      "Pesan Sekarang",
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                    SizedBox(width: 8),
                    Icon(LucideIcons.arrowRight, size: 16),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _handleCheckout(BuildContext context, AppProvider appState, int grandTotal) {
    // Determine the product title to save in order model
    final cart = appState.cartItems;
    if (cart.isEmpty) return;

    final firstItem = cart.first;
    final orderTitle = cart.length > 1
        ? "${firstItem.name} + ${cart.length - 1} item lainnya"
        : firstItem.name;

    final orderMerchant = firstItem.store;

    // Deduct wallet if using wallet payment
    if (_paymentMethod == "Dompet") {
      appState.deductWallet(grandTotal);
    } else if (_paymentMethod == "GoPay") {
      appState.deductGoPay(grandTotal);
    }

    // Place new order
    final newOrder = OrderModel(
      id: "RNG${Random().nextInt(90000) + 10000}",
      type: "Marketplace",
      item: orderTitle,
      detail: orderMerchant,
      status: "Diproses",
      date: DateFormat('dd MMM yyyy').format(DateTime.now()),
      total: grandTotal,
    );

    appState.placeOrder(newOrder);
    appState.clearCart();

    // Show custom visual success dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: Padding(
            padding: const EdgeInsets.all(28.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: const BoxDecoration(
                    color: AppColors.secondary,
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Icon(LucideIcons.check, color: AppColors.primary, size: 44),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  "Pesanan Diproses! 🎉",
                  style: TextStyle(fontWeight: FontWeight.w900, fontSize: 20, color: AppColors.textPrimary),
                ),
                const SizedBox(height: 8),
                const Text(
                  "Hore! Pesanan Anda telah terkirim ke merchant dan driver lokal kami sedang bersiap mengantar.",
                  textAlign: TextAlign.center,
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.5),
                ),
                const SizedBox(height: 28),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: () {
                      Navigator.pop(context); // Close dialog
                      Navigator.pop(context); // Close cart view
                      appState.setCustomerTab(2); // Redirect to Orders tab
                    },
                    child: const Text("Lihat Pesanan Saya", style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
