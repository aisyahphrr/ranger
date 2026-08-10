import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../providers/app_provider.dart';
import 'product_detail_view.dart';

class MerchantView extends StatelessWidget {
  final String storeName;

  const MerchantView({super.key, required this.storeName});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);
    final products = appState.productsForStore(storeName);
    final rating = products.isEmpty
        ? 0.0
        : products.map((item) => item.rating).reduce((a, b) => a + b) /
            products.length;
    final isOpen = appState.isStoreOpen(storeName);
    final reviews = appState.reviewsForStore(storeName);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(storeName),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16),
            child: Icon(LucideIcons.store),
          ),
        ],
      ),
      body: products.isEmpty
          ? const Center(
              child: Text(
                'Belum ada menu dari toko ini.',
                style: TextStyle(color: AppColors.textSecondary),
              ),
            )
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _StoreInfo(
                  storeName: storeName,
                  rating: rating,
                  productCount: products.length,
                  address: appState.storeAddress(storeName),
                  isOpen: isOpen,
                ),
                if (reviews.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AppColors.border)),
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Ulasan Customer',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 15)),
                          const SizedBox(height: 8),
                          ...reviews.take(3).map((review) => Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Text(
                                  '${List.filled(review.rating, '★').join()}  ${review.text.isEmpty ? 'Tanpa komentar' : review.text}',
                                  style: const TextStyle(
                                      fontSize: 12,
                                      color: AppColors.textSecondary)))),
                        ]),
                  ),
                ],
                const SizedBox(height: 20),
                const Text(
                  'Menu & Produk',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                ...products.map(
                  (product) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(16),
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ProductDetailView(product: product),
                        ),
                      ),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: product.imageBytes != null
                                  ? Image.memory(product.imageBytes!,
                                      width: 72, height: 72, fit: BoxFit.cover)
                                  : Image.network(
                                      product.img,
                                      width: 72,
                                      height: 72,
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, __, ___) => Container(
                                        width: 72,
                                        height: 72,
                                        color: Colors.grey.shade200,
                                        child: const Icon(LucideIcons.image,
                                            color: Colors.grey),
                                      ),
                                    ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(product.name,
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 14)),
                                  const SizedBox(height: 4),
                                  Text(
                                      product.description.isEmpty
                                          ? 'Deskripsi belum tersedia.'
                                          : product.description,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                          color: AppColors.textSecondary,
                                          fontSize: 11)),
                                  const SizedBox(height: 6),
                                  Row(
                                    children: [
                                      Text(product.formattedPrice,
                                          style: const TextStyle(
                                              color: AppColors.primary,
                                              fontWeight: FontWeight.bold)),
                                      const SizedBox(width: 8),
                                      const Icon(LucideIcons.star,
                                          size: 12,
                                          color: AppColors.ratingAmber),
                                      const SizedBox(width: 3),
                                      Text(product.rating.toStringAsFixed(1),
                                          style: const TextStyle(fontSize: 11)),
                                    ],
                                  ),
                                  const SizedBox(height: 3),
                                  Text(
                                    !isOpen
                                        ? 'Toko sedang tutup'
                                        : product.isAvailable
                                            ? 'Tersedia'
                                            : 'Habis',
                                    style: TextStyle(
                                        fontSize: 11,
                                        color: !isOpen || !product.isAvailable
                                            ? Colors.red
                                            : Colors.green,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(LucideIcons.chevronRight,
                                size: 18, color: AppColors.textMuted),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}

class _StoreInfo extends StatelessWidget {
  final String storeName;
  final double rating;
  final int productCount;
  final String address;
  final bool isOpen;

  const _StoreInfo({
    required this.storeName,
    required this.rating,
    required this.productCount,
    required this.address,
    required this.isOpen,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(storeName,
              style:
                  const TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(LucideIcons.star,
                  size: 15, color: AppColors.ratingAmber),
              const SizedBox(width: 4),
              Text(
                  rating == 0
                      ? 'Belum ada rating'
                      : '${rating.toStringAsFixed(1)} / 5',
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(width: 12),
              Text('$productCount menu',
                  style: const TextStyle(
                      color: AppColors.textSecondary, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(LucideIcons.mapPin,
                  size: 14, color: AppColors.primary),
              const SizedBox(width: 4),
              Expanded(
                  child: Text(
                      address.isEmpty ? 'Alamat belum tersedia' : address,
                      style: const TextStyle(
                          color: AppColors.textSecondary, fontSize: 12))),
            ],
          ),
          const SizedBox(height: 8),
          Text(isOpen ? 'Buka' : 'Toko sedang tutup',
              style: TextStyle(
                  color: isOpen ? Colors.green : Colors.red,
                  fontWeight: FontWeight.bold,
                  fontSize: 12)),
        ],
      ),
    );
  }
}
