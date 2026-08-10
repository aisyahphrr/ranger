import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_provider.dart';
import '../services/catering_view.dart';
import '../services/kos_view.dart';
import '../services/laundry_view.dart';
import '../services/marketplace_view.dart';
import '../services/product_detail_view.dart';

class CustomerExploreView extends StatefulWidget {
  const CustomerExploreView({super.key});

  @override
  State<CustomerExploreView> createState() => _CustomerExploreViewState();
}

class _CustomerExploreViewState extends State<CustomerExploreView> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  static const _popularSearches = [
    'Nasi Box',
    'Catering 50 Pax',
    'Laundry Kiloan',
    'Kos Dekat Kantor PGE',
    'Batik Kamojang',
    'Kopi Lokal',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Product> _filteredProducts(List<Product> products) {
    final query = _searchQuery.trim().toLowerCase();
    if (query.isEmpty) return const [];

    return products.where((product) {
      return product.name.toLowerCase().contains(query) ||
          product.store.toLowerCase().contains(query) ||
          product.cat.toLowerCase().contains(query) ||
          product.description.toLowerCase().contains(query);
    }).toList(growable: false);
  }

  void _setSearch(String value) {
    _searchController.value = TextEditingValue(
      text: value,
      selection: TextSelection.collapsed(offset: value.length),
    );
    setState(() => _searchQuery = value);
  }

  void _showUnavailable(String serviceName) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('$serviceName belum tersedia.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);
    final filteredProducts = _filteredProducts(appState.products);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(14, 14, 14, 24),
          children: [
            const Text(
              'Jelajah Layanan',
              style: TextStyle(
                color: AppColors.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'Temukan semua yang Anda butuhkan',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _searchController,
              onChanged: (value) => setState(() => _searchQuery = value),
              textInputAction: TextInputAction.search,
              decoration: InputDecoration(
                hintText: 'Cari apa saja...',
                hintStyle: const TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 12,
                ),
                prefixIcon: const Icon(
                  LucideIcons.search,
                  color: AppColors.textSecondary,
                  size: 18,
                ),
                suffixIcon: _searchQuery.isEmpty
                    ? null
                    : IconButton(
                        onPressed: () => _setSearch(''),
                        icon: const Icon(
                          Icons.close,
                          size: 17,
                          color: AppColors.textSecondary,
                        ),
                      ),
                filled: true,
                fillColor: const Color(0xFFF0F3F2),
                contentPadding: const EdgeInsets.symmetric(vertical: 13),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none,
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: const BorderSide(
                    color: AppColors.primary,
                    width: 1,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 18),
            const _SectionTitle('SEMUA LAYANAN'),
            const SizedBox(height: 10),
            _ServiceGrid(
              onMarketplace: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const MarketplaceView()),
              ),
              onCatering: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CateringView()),
              ),
              onLaundry: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const LaundryView()),
              ),
              onKos: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const KosView()),
              ),
              onDelivery: () => appState.setCustomerTab(2),
              onVoucher: () => _showUnavailable('Voucher'),
            ),
            const SizedBox(height: 22),
            const _SectionTitle('PENCARIAN POPULER'),
            const SizedBox(height: 9),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _popularSearches
                  .map(
                    (term) => _PopularSearchChip(
                      label: term,
                      onTap: () => _setSearch(term),
                    ),
                  )
                  .toList(),
            ),
            if (_searchQuery.trim().isNotEmpty) ...[
              const SizedBox(height: 24),
              const _SectionTitle('HASIL PENCARIAN'),
              const SizedBox(height: 10),
              if (filteredProducts.isEmpty)
                const _EmptySearchResult()
              else
                ...filteredProducts.map(
                  (product) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: _ProductResultTile(
                      product: product,
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ProductDetailView(product: product),
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle(this.title);

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: const TextStyle(
        color: AppColors.textSecondary,
        fontSize: 11,
        fontWeight: FontWeight.w800,
        letterSpacing: 0.2,
      ),
    );
  }
}

class _ServiceGrid extends StatelessWidget {
  final VoidCallback onMarketplace;
  final VoidCallback onCatering;
  final VoidCallback onLaundry;
  final VoidCallback onKos;
  final VoidCallback onDelivery;
  final VoidCallback onVoucher;

  const _ServiceGrid({
    required this.onMarketplace,
    required this.onCatering,
    required this.onLaundry,
    required this.onKos,
    required this.onDelivery,
    required this.onVoucher,
  });

  @override
  Widget build(BuildContext context) {
    final services = [
      const _ExploreService(
        label: 'Marketplace',
        icon: LucideIcons.store,
        iconColor: AppColors.marketplaceColor,
        iconBackground: AppColors.marketplaceBg,
      ),
      const _ExploreService(
        label: 'Catering',
        icon: LucideIcons.coffee,
        iconColor: AppColors.cateringColor,
        iconBackground: AppColors.cateringBg,
      ),
      const _ExploreService(
        label: 'Laundry',
        icon: LucideIcons.wind,
        iconColor: AppColors.laundryColor,
        iconBackground: AppColors.laundryBg,
      ),
      const _ExploreService(
        label: 'Kos',
        icon: LucideIcons.building,
        iconColor: AppColors.kosColor,
        iconBackground: AppColors.kosBg,
      ),
      const _ExploreService(
        label: 'Rangers\nDelivery',
        icon: LucideIcons.truck,
        iconColor: Color(0xFFFF9800),
        iconBackground: Color(0xFFFFF4D8),
      ),
      const _ExploreService(
        label: 'Voucher',
        icon: LucideIcons.tag,
        iconColor: Color(0xFFE91E63),
        iconBackground: Color(0xFFFFE4EF),
      ),
    ];
    final callbacks = [
      onMarketplace,
      onCatering,
      onLaundry,
      onKos,
      onDelivery,
      onVoucher,
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: services.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 0.96,
      ),
      itemBuilder: (context, index) {
        final service = services[index];
        return _ServiceCard(service: service, onTap: callbacks[index]);
      },
    );
  }
}

class _ExploreService {
  final String label;
  final IconData icon;
  final Color iconColor;
  final Color iconBackground;

  const _ExploreService({
    required this.label,
    required this.icon,
    required this.iconColor,
    required this.iconBackground,
  });
}

class _ServiceCard extends StatelessWidget {
  final _ExploreService service;
  final VoidCallback onTap;

  const _ServiceCard({required this.service, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      elevation: 1,
      shadowColor: Colors.black.withValues(alpha: 0.08),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 9),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: service.iconBackground,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(service.icon, color: service.iconColor, size: 23),
              ),
              const SizedBox(height: 7),
              Text(
                service.label,
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 11,
                  height: 1.1,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PopularSearchChip extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _PopularSearchChip({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      elevation: 1,
      shadowColor: Colors.black.withValues(alpha: 0.1),
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                LucideIcons.search,
                size: 12,
                color: AppColors.primary,
              ),
              const SizedBox(width: 5),
              Text(
                label,
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProductResultTile extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;

  const _ProductResultTile({required this.product, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.all(9),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: product.imageBytes != null
                    ? Image.memory(
                        product.imageBytes!,
                        width: 62,
                        height: 62,
                        fit: BoxFit.cover,
                      )
                    : Image.network(
                        product.img,
                        width: 62,
                        height: 62,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          width: 62,
                          height: 62,
                          color: AppColors.background,
                          child: const Icon(
                            LucideIcons.image,
                            color: AppColors.textMuted,
                          ),
                        ),
                      ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      product.store,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 11,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      product.formattedPrice,
                      style: const TextStyle(
                        color: AppColors.primary,
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.chevron_right,
                color: AppColors.textMuted,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptySearchResult extends StatelessWidget {
  const _EmptySearchResult();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      child: const Column(
        children: [
          Icon(LucideIcons.search, size: 32, color: AppColors.textMuted),
          SizedBox(height: 8),
          Text(
            'Produk tidak ditemukan',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w700,
            ),
          ),
          SizedBox(height: 4),
          Text(
            'Coba kata kunci lain.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
          ),
        ],
      ),
    );
  }
}
