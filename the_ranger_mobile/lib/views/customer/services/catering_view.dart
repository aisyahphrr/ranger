import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_provider.dart';
import 'cart_view.dart';
import 'product_detail_view.dart';

class CateringView extends StatefulWidget {
  const CateringView({super.key});

  @override
  State<CateringView> createState() => _CateringViewState();
}

class _CateringViewState extends State<CateringView> {
  String _searchQuery = '';
  String _selectedCategory = 'Semua';

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);
    final products = appState.cateringProducts;
    final categories = [
      'Semua',
      ...products
          .map((product) => product.cat.trim())
          .where((category) => category.isNotEmpty)
          .toSet(),
    ];
    final query = _searchQuery.trim().toLowerCase();
    final filteredProducts = products.where((product) {
      final matchesCategory =
          _selectedCategory == 'Semua' || product.cat == _selectedCategory;
      final matchesQuery = query.isEmpty ||
          product.name.toLowerCase().contains(query) ||
          product.description.toLowerCase().contains(query) ||
          product.cat.toLowerCase().contains(query);
      return matchesCategory && matchesQuery;
    }).toList(growable: false);
    final isOpen = appState.cateringIsOpen;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Catering & Dapur Kamojang'),
        actions: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(
                icon: const Icon(LucideIcons.shoppingCart),
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const CartView()),
                ),
              ),
              if (appState.cartItemCount > 0)
                Positioned(
                  right: 4,
                  top: 4,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      appState.cartItemCount.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: TextField(
              onChanged: (value) => setState(() => _searchQuery = value),
              decoration: InputDecoration(
                hintText: 'Cari menu catering...',
                prefixIcon: const Icon(
                  LucideIcons.search,
                  color: AppColors.textMuted,
                ),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
              ),
            ),
          ),
          if (appState.cateringBusinessName.isNotEmpty)
            _CateringBusinessCard(
              name: appState.cateringBusinessName,
              address: appState.cateringAddress,
              isOpen: isOpen,
            ),
          if (categories.length > 1)
            SizedBox(
              height: 50,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.fromLTRB(16, 10, 16, 8),
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  final category = categories[index];
                  final selected = category == _selectedCategory;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(category),
                      selected: selected,
                      selectedColor: AppColors.primary,
                      backgroundColor: Colors.white,
                      labelStyle: TextStyle(
                        color: selected ? Colors.white : AppColors.textPrimary,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: const BorderSide(color: AppColors.border),
                      ),
                      onSelected: (_) =>
                          setState(() => _selectedCategory = category),
                    ),
                  );
                },
              ),
            ),
          Expanded(
            child: filteredProducts.isEmpty
                ? const _EmptyCateringMenu()
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    physics: const BouncingScrollPhysics(),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.68,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: filteredProducts.length,
                    itemBuilder: (context, index) => _CateringProductCard(
                      product: filteredProducts[index],
                      isStoreOpen: isOpen,
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}

class _CateringBusinessCard extends StatelessWidget {
  final String name;
  final String address;
  final bool isOpen;

  const _CateringBusinessCard({
    required this.name,
    required this.address,
    required this.isOpen,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 21,
            backgroundColor: AppColors.cateringBg,
            child: Icon(
              LucideIcons.utensils,
              color: AppColors.cateringColor,
              size: 19,
            ),
          ),
          const SizedBox(width: 9),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  address.isEmpty ? 'Alamat belum tersedia' : address,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          Text(
            isOpen ? 'Buka' : 'Tutup',
            style: TextStyle(
              color: isOpen ? Colors.green : Colors.red,
              fontSize: 10,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }
}

class _CateringProductCard extends StatelessWidget {
  final Product product;
  final bool isStoreOpen;

  const _CateringProductCard({
    required this.product,
    required this.isStoreOpen,
  });

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context, listen: false);
    final canOrder = isStoreOpen && product.isAvailable;

    return Card(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ProductDetailView(product: product),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _ProductImage(product: product)),
            Padding(
              padding: const EdgeInsets.all(11),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Row(
                    children: [
                      const Icon(
                        LucideIcons.star,
                        size: 12,
                        color: AppColors.ratingAmber,
                      ),
                      const SizedBox(width: 3),
                      Text(
                        product.rating == 0
                            ? 'Belum ada rating'
                            : product.rating.toStringAsFixed(1),
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 7),
                  Text(
                    product.formattedPrice,
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontSize: 13,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 7),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        !isStoreOpen
                            ? 'Toko tutup'
                            : product.isAvailable
                                ? 'Tersedia'
                                : 'Stok habis',
                        style: TextStyle(
                          color: canOrder ? Colors.green : Colors.red,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Material(
                        color: canOrder
                            ? AppColors.primaryLight
                            : const Color(0xFFF1F2F2),
                        borderRadius: BorderRadius.circular(9),
                        child: InkWell(
                          onTap: canOrder
                              ? () {
                                  appState.addToCart(product);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(
                                          '${product.name} ditambahkan ke keranjang.'),
                                    ),
                                  );
                                }
                              : null,
                          borderRadius: BorderRadius.circular(9),
                          child: Padding(
                            padding: const EdgeInsets.all(6),
                            child: Icon(
                              LucideIcons.plus,
                              size: 15,
                              color: canOrder
                                  ? AppColors.primary
                                  : AppColors.textMuted,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProductImage extends StatelessWidget {
  final Product product;

  const _ProductImage({required this.product});

  @override
  Widget build(BuildContext context) {
    if (product.imageBytes != null) {
      return Image.memory(
        product.imageBytes!,
        width: double.infinity,
        fit: BoxFit.cover,
      );
    }
    if (product.img.startsWith('http')) {
      return Image.network(
        product.img,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => _fallback(),
      );
    }
    return _fallback();
  }

  Widget _fallback() => Container(
        color: AppColors.cateringBg,
        child: const Center(
          child: Icon(
            LucideIcons.utensils,
            color: AppColors.cateringColor,
            size: 36,
          ),
        ),
      );
}

class _EmptyCateringMenu extends StatelessWidget {
  const _EmptyCateringMenu();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 70,
              height: 70,
              decoration: const BoxDecoration(
                color: AppColors.cateringBg,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                LucideIcons.utensils,
                color: AppColors.cateringColor,
                size: 30,
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'Menu catering belum tersedia',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.textPrimary,
                fontSize: 15,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Menu akan tampil setelah mitra catering menambahkan produk.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 12,
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
