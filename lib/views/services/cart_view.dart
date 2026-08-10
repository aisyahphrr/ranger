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
  String _paymentMethod = 'COD';

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);
    final cart = appState.cartItems;
    final products = <int, Product>{};
    for (final product in cart) {
      products[product.id] = product;
    }
    final subtotal = appState.cartTotalPrice;
    final address = appState.customerAddress;
    final storeClosed =
        products.values.any((product) => !appState.isStoreOpen(product.store));
    final canCheckout = cart.isNotEmpty &&
        address != null &&
        address.isNotEmpty &&
        !storeClosed;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Keranjang')),
      body: cart.isEmpty
          ? _EmptyCart(onBrowse: () => Navigator.pop(context))
          : Column(
              children: [
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      _AddressCard(
                          address: address,
                          onEdit: () => _editAddress(context, appState)),
                      if (address == null || address.isEmpty)
                        const Padding(
                            padding: EdgeInsets.only(top: 8),
                            child: Text('Alamat diperlukan sebelum checkout.',
                                style: TextStyle(
                                    color: Colors.red, fontSize: 12))),
                      if (storeClosed)
                        const Padding(
                            padding: EdgeInsets.only(top: 8),
                            child: Text(
                                'Ada toko yang sedang tutup. Produk dari toko tersebut tidak dapat dipesan.',
                                style: TextStyle(
                                    color: Colors.red, fontSize: 12))),
                      const SizedBox(height: 16),
                      ...products.values.map((product) => _CartItemCard(
                          product: product,
                          quantity: appState.cartQuantity(product.id),
                          appState: appState)),
                      const SizedBox(height: 8),
                      _PaymentSection(
                          appState: appState,
                          selected: _paymentMethod,
                          onChanged: (value) =>
                              setState(() => _paymentMethod = value)),
                      const SizedBox(height: 16),
                      _Summary(subtotal: subtotal),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
                SafeArea(
                  top: false,
                  child: Container(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                    decoration: BoxDecoration(color: Colors.white, boxShadow: [
                      BoxShadow(
                          color: Colors.black.withValues(alpha: .06),
                          blurRadius: 12,
                          offset: const Offset(0, -3))
                    ]),
                    child: Row(
                      children: [
                        Expanded(
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                              const Text('Total',
                                  style: TextStyle(
                                      color: AppColors.textMuted,
                                      fontSize: 11)),
                              Text(_formatCurrency(subtotal),
                                  style: const TextStyle(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w900,
                                      fontSize: 18))
                            ])),
                        ElevatedButton.icon(
                          onPressed: canCheckout
                              ? () => _checkout(context, appState,
                                  products.values.toList(), subtotal)
                              : null,
                          icon: const Icon(LucideIcons.arrowRight, size: 16),
                          label: const Text('Checkout'),
                          style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 18, vertical: 14),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14))),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Future<void> _editAddress(BuildContext context, AppProvider appState) async {
    final controller =
        TextEditingController(text: appState.customerAddress ?? '');
    await showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Alamat Pengiriman'),
        content: TextField(
            controller: controller,
            maxLines: 3,
            autofocus: true,
            decoration:
                const InputDecoration(hintText: 'Masukkan alamat lengkap')),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Batal')),
          ElevatedButton(
              onPressed: () async {
                await appState.saveCustomerProfile(address: controller.text);
                if (dialogContext.mounted) Navigator.pop(dialogContext);
              },
              child: const Text('Simpan')),
        ],
      ),
    );
    controller.dispose();
  }

  void _checkout(BuildContext context, AppProvider appState,
      List<Product> products, int subtotal) {
    final quantities = products
        .map((product) => OrderLine(
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: appState.cartQuantity(product.id)))
        .toList();
    final first = products.first;
    final itemLabel = quantities.length == 1
        ? '${quantities.first.name} x${quantities.first.quantity}'
        : '${quantities.first.name} x${quantities.first.quantity} + ${quantities.length - 1} item';
    final order = OrderModel(
      id: 'RNG-${DateTime.now().millisecondsSinceEpoch}',
      type: appState.isCateringStore(first.store) ? 'Catering' : 'Marketplace',
      item: itemLabel,
      detail: first.store,
      status: 'Diproses',
      date: DateFormat('dd MMM yyyy').format(DateTime.now()),
      total: subtotal,
      lines: quantities,
      address: appState.customerAddress ?? '',
      paymentMethod: _paymentMethod,
    );
    appState.placeOrder(order);
    appState.clearCart();
    showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        icon: const Icon(LucideIcons.checkCircle,
            color: AppColors.primary, size: 48),
        title: const Text('Pesanan dibuat'),
        content: Text(
            'Order #${order.id} diteruskan dengan status ${order.status}. Status pembayaran akan mengikuti integrasi payment service.'),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              Navigator.pop(context);
              appState.setCustomerTab(2);
            },
            child: const Text('Lihat Pesanan'),
          ),
        ],
      ),
    );
  }
}

class _EmptyCart extends StatelessWidget {
  final VoidCallback onBrowse;

  const _EmptyCart({required this.onBrowse});

  @override
  Widget build(BuildContext context) => Center(
      child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            const Icon(LucideIcons.shoppingCart,
                size: 56, color: AppColors.primary),
            const SizedBox(height: 16),
            const Text('Keranjang masih kosong',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 8),
            const Text('Pilih produk dari marketplace untuk mulai memesan.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.textSecondary)),
            const SizedBox(height: 24),
            ElevatedButton(
                onPressed: onBrowse, child: const Text('Mulai Belanja'))
          ])));
}

class _AddressCard extends StatelessWidget {
  final String? address;
  final VoidCallback onEdit;

  const _AddressCard({required this.address, required this.onEdit});

  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.border)),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Icon(LucideIcons.mapPin, color: AppColors.primary, size: 22),
        const SizedBox(width: 12),
        Expanded(
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Alamat Pengiriman',
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: AppColors.textMuted)),
          const SizedBox(height: 4),
          Text(address == null || address!.isEmpty ? 'Belum diatur' : address!,
              style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: AppColors.textPrimary))
        ])),
        TextButton(onPressed: onEdit, child: const Text('Ubah'))
      ]));
}

class _CartItemCard extends StatelessWidget {
  final Product product;
  final int quantity;
  final AppProvider appState;

  const _CartItemCard(
      {required this.product, required this.quantity, required this.appState});

  @override
  Widget build(BuildContext context) => Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border)),
      child: Row(children: [
        ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: product.imageBytes != null
                ? Image.memory(product.imageBytes!,
                    width: 68, height: 68, fit: BoxFit.cover)
                : Image.network(product.img,
                    width: 68,
                    height: 68,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                        width: 68,
                        height: 68,
                        color: Colors.grey.shade200,
                        child: const Icon(LucideIcons.image,
                            color: Colors.grey)))),
        const SizedBox(width: 12),
        Expanded(
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(product.name,
              style:
                  const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 4),
          Text(product.formattedPrice,
              style: const TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 13)),
          const SizedBox(height: 8),
          Row(children: [
            Container(
                decoration: BoxDecoration(
                    border: Border.all(color: AppColors.border),
                    borderRadius: BorderRadius.circular(8)),
                child: Row(mainAxisSize: MainAxisSize.min, children: [
                  IconButton(
                      icon: const Icon(LucideIcons.minus, size: 13),
                      onPressed: () =>
                          appState.setCartQuantity(product, quantity - 1)),
                  Text('$quantity',
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                  IconButton(
                      icon: const Icon(LucideIcons.plus, size: 13),
                      onPressed: quantity < product.stock
                          ? () =>
                              appState.setCartQuantity(product, quantity + 1)
                          : null)
                ])),
            const Spacer(),
            Text(_formatCurrency(product.price * quantity),
                style: const TextStyle(
                    fontWeight: FontWeight.w800, color: AppColors.primary))
          ])
        ]))
      ]));
}

class _PaymentSection extends StatelessWidget {
  final AppProvider appState;
  final String selected;
  final ValueChanged<String> onChanged;

  const _PaymentSection(
      {required this.appState,
      required this.selected,
      required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final methods = <String>['COD'];
    if (appState.walletBalance != null) methods.add('Wallet');
    if (appState.gopayBalance != null) methods.add('GoPay');
    return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppColors.border)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Metode Pembayaran',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            initialValue: selected,
            decoration: const InputDecoration(
              labelText: 'Pilih metode',
              border: OutlineInputBorder(),
            ),
            items: methods
                .map((method) => DropdownMenuItem<String>(
                      value: method,
                      child: Text(method == 'COD' ? 'Bayar di tempat' : method),
                    ))
                .toList(),
            onChanged: (value) {
              if (value != null) onChanged(value);
            },
          ),
          const SizedBox(height: 8),
          Text(
            selected == 'COD'
                ? 'Pembayaran dikonfirmasi saat pesanan diterima.'
                : 'Saldo berasal dari service wallet/payment yang terhubung.',
            style:
                const TextStyle(color: AppColors.textSecondary, fontSize: 12),
          )
        ]));
  }
}

class _Summary extends StatelessWidget {
  final int subtotal;

  const _Summary({required this.subtotal});

  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.border)),
      child: Column(children: [
        const Align(
            alignment: Alignment.centerLeft,
            child: Text('Ringkasan Pembayaran',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14))),
        const SizedBox(height: 12),
        _Row(label: 'Subtotal', value: _formatCurrency(subtotal)),
        const _Row(label: 'Ongkir', value: 'Belum dihitung'),
        const Divider(height: 22),
        _Row(label: 'Total', value: _formatCurrency(subtotal), strong: true)
      ]));
}

class _Row extends StatelessWidget {
  final String label;
  final String value;
  final bool strong;

  const _Row({required this.label, required this.value, this.strong = false});

  @override
  Widget build(BuildContext context) => Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label,
            style: TextStyle(
                color: strong ? AppColors.textPrimary : AppColors.textSecondary,
                fontWeight: strong ? FontWeight.bold : FontWeight.normal)),
        Text(value,
            style: TextStyle(
                color: strong ? AppColors.primary : AppColors.textPrimary,
                fontWeight: FontWeight.bold))
      ]));
}

String _formatCurrency(int amount) =>
    NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0)
        .format(amount);
