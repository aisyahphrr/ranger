import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/mock_data.dart';
import '../../models/models.dart';

class MerchantView extends StatelessWidget {
  final String storeName;

  const MerchantView({super.key, required this.storeName});

  List<Product> get _storeProducts {
    return MockData.products.where((product) => product.store == storeName).toList();
  }

  @override
  Widget build(BuildContext context) {
    final products = _storeProducts;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(storeName),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16.0),
            child: Icon(LucideIcons.store),
          ),
        ],
      ),
      body: products.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(LucideIcons.store, size: 56, color: AppColors.textMuted),
                  SizedBox(height: 16),
                  Text(
                    'Toko tidak ditemukan',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Coba kembali dengan toko lainnya.',
                    style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                  ),
                ],
              ),
            )
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Produk & Penawaran',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 14),
                  Expanded(
                    child: ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      itemCount: products.length,
                      itemBuilder: (context, index) {
                        final product = products[index];
                        return Container(
                          margin: const EdgeInsets.only(bottom: 14),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(12),
                            leading: ClipRRect(
                              borderRadius: BorderRadius.circular(12),
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
                            title: Text(product.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SizedBox(height: 4),
                                Text(product.formattedPrice, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 2),
                                Text('${product.sold} terjual • Rating ${product.rating}', style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                              ],
                            ),
                            trailing: const Icon(LucideIcons.chevronRight, size: 18),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
