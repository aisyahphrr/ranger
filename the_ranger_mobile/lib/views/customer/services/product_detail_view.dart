import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../models/models.dart';
import '../../../providers/app_provider.dart';
import 'cart_view.dart';
import 'merchant_view.dart';

class ProductDetailView extends StatefulWidget {
  final Product product;

  const ProductDetailView({super.key, required this.product});

  @override
  State<ProductDetailView> createState() => _ProductDetailViewState();
}

class _ProductDetailViewState extends State<ProductDetailView> {
  int _quantity = 1;

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);
    final product = widget.product;
    final isOpen = appState.isStoreOpen(product.store);
    final canOrder = isOpen && product.isAvailable;
    final totalPrice = product.price * _quantity;
    final reviews = appState.reviewsForStore(product.store);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Detail Produk'),
        actions: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(
                icon: const Icon(LucideIcons.shoppingCart),
                onPressed: () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => const CartView())),
              ),
              if (appState.cartItemCount > 0)
                Positioned(
                  right: 4,
                  top: 4,
                  child: _Badge(label: appState.cartItemCount.toString()),
                ),
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    height: 280,
                    width: double.infinity,
                    child: product.imageBytes != null
                        ? Image.memory(product.imageBytes!, fit: BoxFit.cover)
                        : Image.network(
                            product.img,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              color: Colors.grey.shade200,
                              child: const Icon(LucideIcons.image,
                                  size: 48, color: Colors.grey),
                            ),
                          ),
                  ),
                  _Section(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(product.name,
                            style: const TextStyle(
                                fontSize: 22, fontWeight: FontWeight.w900)),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(LucideIcons.star,
                                size: 16, color: AppColors.ratingAmber),
                            const SizedBox(width: 4),
                            Text(product.rating.toStringAsFixed(1),
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold)),
                            const SizedBox(width: 12),
                            Text('${product.sold} terjual',
                                style: const TextStyle(
                                    color: AppColors.textSecondary,
                                    fontSize: 12)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(product.formattedPrice,
                            style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                color: AppColors.primary)),
                        const SizedBox(height: 10),
                        Text(
                            isOpen
                                ? (product.isAvailable
                                    ? 'Tersedia'
                                    : 'Stok habis')
                                : 'Toko sedang tutup',
                            style: TextStyle(
                                color: canOrder ? Colors.green : Colors.red,
                                fontWeight: FontWeight.bold,
                                fontSize: 12)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  _Section(
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundColor: AppColors.primaryLight,
                          child: Text(
                              product.store.isEmpty
                                  ? '?'
                                  : product.store[0].toUpperCase(),
                              style: const TextStyle(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(product.store,
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 15)),
                              const SizedBox(height: 3),
                              Text(
                                  appState.storeAddress(product.store).isEmpty
                                      ? 'Alamat toko belum tersedia'
                                      : appState.storeAddress(product.store),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                      color: AppColors.textSecondary,
                                      fontSize: 12)),
                            ],
                          ),
                        ),
                        OutlinedButton(
                          onPressed: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) =>
                                      MerchantView(storeName: product.store))),
                          child: const Text('Kunjungi'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  _Section(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Deskripsi Produk',
                            style: TextStyle(
                                fontWeight: FontWeight.bold, fontSize: 15)),
                        const SizedBox(height: 8),
                        Text(
                            product.description.isEmpty
                                ? 'Deskripsi produk belum tersedia.'
                                : product.description,
                            style: const TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 13,
                                height: 1.6)),
                        const SizedBox(height: 16),
                        const Text('Rating & Ulasan',
                            style: TextStyle(
                                fontWeight: FontWeight.bold, fontSize: 15)),
                        const SizedBox(height: 8),
                        if (reviews.isEmpty)
                          const Text('Ulasan belum tersedia dari backend.',
                              style: TextStyle(
                                  color: AppColors.textSecondary, fontSize: 13))
                        else
                          ...reviews.take(3).map((review) => Padding(
                              padding: const EdgeInsets.only(bottom: 6),
                              child: Text(
                                  '${List.filled(review.rating, '★').join()}  ${review.text.isEmpty ? 'Tanpa komentar' : review.text}',
                                  style: const TextStyle(
                                      color: AppColors.textSecondary,
                                      fontSize: 12)))),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          SafeArea(
            top: false,
            child: Container(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      blurRadius: 12,
                      offset: const Offset(0, -3))
                ],
              ),
              child: Row(
                children: [
                  _QuantitySelector(
                    quantity: _quantity,
                    onMinus: _quantity > 1
                        ? () => setState(() => _quantity--)
                        : null,
                    onPlus: canOrder && _quantity < product.stock
                        ? () => setState(() => _quantity++)
                        : null,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: canOrder
                          ? () => _addToCart(context, appState, product)
                          : null,
                      style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14))),
                      child: Text(
                          canOrder
                              ? 'Tambah • ${_formatPrice(totalPrice)}'
                              : (isOpen ? 'Stok habis' : 'Toko tutup'),
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _addToCart(BuildContext context, AppProvider appState, Product product) {
    appState.addToCart(product, quantity: _quantity);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content:
            Text('${_quantity}x ${product.name} ditambahkan ke keranjang.'),
        action: SnackBarAction(
            label: 'Keranjang',
            onPressed: () => Navigator.push(
                context, MaterialPageRoute(builder: (_) => const CartView()))),
      ),
    );
  }
}

String _formatPrice(int amount) =>
    'Rp ${amount.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')}';

class _Section extends StatelessWidget {
  final Widget child;

  const _Section({required this.child});

  @override
  Widget build(BuildContext context) => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(18),
        color: Colors.white,
        child: child,
      );
}

class _QuantitySelector extends StatelessWidget {
  final int quantity;
  final VoidCallback? onMinus;
  final VoidCallback? onPlus;

  const _QuantitySelector(
      {required this.quantity, required this.onMinus, required this.onPlus});

  @override
  Widget build(BuildContext context) => Container(
        decoration: BoxDecoration(
            border: Border.all(color: AppColors.border),
            borderRadius: BorderRadius.circular(12)),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
                icon: const Icon(LucideIcons.minus, size: 14),
                onPressed: onMinus),
            Text('$quantity',
                style: const TextStyle(fontWeight: FontWeight.bold)),
            IconButton(
                icon: const Icon(LucideIcons.plus, size: 14),
                onPressed: onPlus),
          ],
        ),
      );
}

class _Badge extends StatelessWidget {
  final String label;

  const _Badge({required this.label});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
        decoration:
            const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
        child: Text(label,
            style: const TextStyle(
                color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
      );
}
