import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_provider.dart';
import '../services/cart_view.dart';
import '../services/catering_view.dart';
import '../services/kos_view.dart';
import '../services/laundry_view.dart';
import '../services/marketplace_view.dart';
import '../services/merchant_view.dart';
import '../services/product_detail_view.dart';

class CustomerHomeView extends StatelessWidget {
  const CustomerHomeView({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);
    final products = appState.products
        .where((product) => product.isAvailable)
        .take(6)
        .toList();
    final firstName = appState.customerName?.split(' ').first;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverToBoxAdapter(
            child: _CustomerHeader(
              firstName: firstName,
              location: appState.customerLocation ?? appState.customerAddress,
              cartCount: appState.cartItemCount,
              unreadCount: appState.unreadNotificationCount,
              onCartTap: () => Navigator.push(
                  context, MaterialPageRoute(builder: (_) => const CartView())),
              onNotificationTap: () => appState.setCustomerTab(3),
              onSearchTap: () => appState.setCustomerTab(1),
            ),
          ),
          SliverToBoxAdapter(
              child: _PromoSection(promotions: appState.promotions)),
          SliverToBoxAdapter(
            child: _ServiceSection(
              onMarketplace: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const MarketplaceView())),
              onCatering: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const CateringView())),
              onLaundry: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const LaundryView())),
              onKos: () => Navigator.push(
                  context, MaterialPageRoute(builder: (_) => const KosView())),
            ),
          ),
          SliverToBoxAdapter(
            child: _MarketplaceSection(
              stores: appState.marketplaceNames,
              appState: appState,
              onStoreTap: (store) => Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => MerchantView(storeName: store))),
            ),
          ),
          SliverToBoxAdapter(
            child: _SectionHeading(
              title: 'Menu & Produk Pilihan',
              actionLabel: 'Lihat semua',
              onAction: () => appState.setCustomerTab(1),
            ),
          ),
          if (products.isEmpty)
            const SliverToBoxAdapter(child: _EmptyProductMessage())
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 28),
              sliver: SliverLayoutBuilder(
                builder: (context, constraints) {
                  final columns = constraints.crossAxisExtent >= 560 ? 4 : 2;
                  return SliverGrid(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) => _ProductCard(
                        product: products[index],
                        onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) => ProductDetailView(
                                    product: products[index]))),
                      ),
                      childCount: products.length,
                    ),
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: columns,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: columns == 2 ? .73 : .8,
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}

class _CustomerHeader extends StatelessWidget {
  final String? firstName;
  final String? location;
  final int cartCount;
  final int unreadCount;
  final VoidCallback onCartTap;
  final VoidCallback onNotificationTap;
  final VoidCallback onSearchTap;

  const _CustomerHeader({
    required this.firstName,
    required this.location,
    required this.cartCount,
    required this.unreadCount,
    required this.onCartTap,
    required this.onNotificationTap,
    required this.onSearchTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 48, 20, 20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primaryHeaderStart, AppColors.primaryHeaderEnd],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(firstName == null ? 'Halo 👋' : 'Halo, $firstName 👋',
                        style: TextStyle(
                            color: Colors.green.shade200, fontSize: 13)),
                    const SizedBox(height: 4),
                    const Text('Mau makan apa hari ini?',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.w800)),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Icon(LucideIcons.mapPin,
                            color: Colors.green.shade300, size: 13),
                        const SizedBox(width: 4),
                        Expanded(
                            child: Text(location ?? 'Lokasi belum diatur',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                    color: Colors.green.shade200,
                                    fontSize: 12))),
                      ],
                    ),
                  ],
                ),
              ),
              _HeaderAction(
                  icon: LucideIcons.shoppingCart,
                  badge: cartCount,
                  onTap: onCartTap),
              const SizedBox(width: 10),
              _HeaderAction(
                  icon: LucideIcons.bell,
                  badge: unreadCount,
                  onTap: onNotificationTap),
            ],
          ),
          const SizedBox(height: 18),
          InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: onSearchTap,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 13),
              decoration: BoxDecoration(
                  color: Colors.white, borderRadius: BorderRadius.circular(16)),
              child: const Row(
                children: [
                  Icon(LucideIcons.search,
                      color: AppColors.textMuted, size: 18),
                  SizedBox(width: 10),
                  Text('Cari makanan, minuman, atau toko...',
                      style:
                          TextStyle(color: AppColors.textMuted, fontSize: 13)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeaderAction extends StatelessWidget {
  final IconData icon;
  final int badge;
  final VoidCallback onTap;

  const _HeaderAction(
      {required this.icon, required this.badge, required this.onTap});

  @override
  Widget build(BuildContext context) => Stack(
        clipBehavior: Clip.none,
        children: [
          IconButton(
            onPressed: onTap,
            icon: Icon(icon, color: Colors.white, size: 20),
            style: IconButton.styleFrom(
                backgroundColor: Colors.white.withValues(alpha: .15)),
          ),
          if (badge > 0)
            Positioned(
              right: 0,
              top: -2,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                decoration: BoxDecoration(
                    color: AppColors.accent,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.primary)),
                child: Text('$badge',
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.bold)),
              ),
            ),
        ],
      );
}

class _PromoSection extends StatelessWidget {
  final List<CustomerPromotion> promotions;

  const _PromoSection({required this.promotions});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
      child: promotions.isEmpty
          ? Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.border)),
              child: const Row(
                children: [
                  Icon(LucideIcons.percent, color: AppColors.primary),
                  SizedBox(width: 12),
                  Expanded(
                      child: Text('Belum ada promo aktif dari server.',
                          style: TextStyle(
                              color: AppColors.textSecondary, fontSize: 13))),
                ],
              ),
            )
          : SizedBox(
              height: 148,
              child: PageView.builder(
                itemCount: promotions.length,
                controller: PageController(viewportFraction: .92),
                itemBuilder: (context, index) {
                  final promo = promotions[index];
                  return Container(
                    margin: const EdgeInsets.only(right: 10),
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                          colors: [Color(0xFF0D5C36), Color(0xFF2E7D32)]),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('PROMO HARI INI',
                              style: TextStyle(
                                  color: Colors.amberAccent,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold)),
                          const SizedBox(height: 6),
                          Text(promo.title,
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 17,
                                  fontWeight: FontWeight.w800)),
                          const SizedBox(height: 4),
                          Text(promo.subtitle,
                              style: TextStyle(
                                  color: Colors.green.shade100, fontSize: 12)),
                          if (promo.code != null)
                            Text('Kode: ${promo.code}',
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold)),
                        ]),
                  );
                },
              ),
            ),
    );
  }
}

class _ServiceSection extends StatelessWidget {
  final VoidCallback onMarketplace;
  final VoidCallback onCatering;
  final VoidCallback onLaundry;
  final VoidCallback onKos;

  const _ServiceSection(
      {required this.onMarketplace,
      required this.onCatering,
      required this.onLaundry,
      required this.onKos});

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _SectionHeading(title: 'Layanan Utama'),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _ServiceItem(
                    label: 'Marketplace',
                    icon: LucideIcons.store,
                    color: AppColors.marketplaceColor,
                    bgColor: AppColors.marketplaceBg,
                    onTap: onMarketplace),
                _ServiceItem(
                    label: 'Catering',
                    icon: LucideIcons.utensils,
                    color: AppColors.cateringColor,
                    bgColor: AppColors.cateringBg,
                    onTap: onCatering),
                _ServiceItem(
                    label: 'Laundry',
                    icon: LucideIcons.wind,
                    color: AppColors.laundryColor,
                    bgColor: AppColors.laundryBg,
                    onTap: onLaundry),
                _ServiceItem(
                    label: 'Kos',
                    icon: LucideIcons.building,
                    color: AppColors.kosColor,
                    bgColor: AppColors.kosBg,
                    onTap: onKos),
              ],
            ),
          ),
        ],
      );
}

class _MarketplaceSection extends StatelessWidget {
  final List<String> stores;
  final AppProvider appState;
  final ValueChanged<String> onStoreTap;

  const _MarketplaceSection(
      {required this.stores, required this.appState, required this.onStoreTap});

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _SectionHeading(title: 'Marketplace Terdekat'),
          if (stores.isEmpty)
            const Padding(
                padding: EdgeInsets.fromLTRB(16, 0, 16, 20),
                child: Text('Belum ada marketplace tersedia.',
                    style: TextStyle(
                        color: AppColors.textSecondary, fontSize: 13)))
          else
            SizedBox(
              height: 92,
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                scrollDirection: Axis.horizontal,
                itemCount: stores.length,
                separatorBuilder: (_, __) => const SizedBox(width: 10),
                itemBuilder: (context, index) {
                  final store = stores[index];
                  final storeProducts = appState.productsForStore(store);
                  final rating = storeProducts.isEmpty
                      ? 0.0
                      : storeProducts
                              .map((item) => item.rating)
                              .reduce((a, b) => a + b) /
                          storeProducts.length;
                  final isOpen = appState.isStoreOpen(store);
                  return InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () => onStoreTap(store),
                    child: Container(
                      width: 220,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.border)),
                      child: Row(children: [
                        const CircleAvatar(
                            backgroundColor: AppColors.primaryLight,
                            child: Icon(LucideIcons.store,
                                color: AppColors.primary, size: 18)),
                        const SizedBox(width: 10),
                        Expanded(
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                              Text(store,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12)),
                              Text(
                                  rating == 0
                                      ? 'Belum ada rating'
                                      : '★ ${rating.toStringAsFixed(1)}',
                                  style: const TextStyle(
                                      color: AppColors.textSecondary,
                                      fontSize: 11)),
                              Text(isOpen ? 'Buka' : 'Tutup',
                                  style: TextStyle(
                                      color: isOpen ? Colors.green : Colors.red,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold)),
                            ])),
                      ]),
                    ),
                  );
                },
              ),
            ),
        ],
      );
}

class _SectionHeading extends StatelessWidget {
  final String title;
  final String? actionLabel;
  final VoidCallback? onAction;

  const _SectionHeading({required this.title, this.actionLabel, this.onAction});

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
        child:
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(title,
              style:
                  const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
          if (actionLabel != null)
            TextButton(
                onPressed: onAction,
                child: Text(actionLabel!,
                    style: const TextStyle(
                        color: AppColors.primary,
                        fontSize: 12,
                        fontWeight: FontWeight.bold))),
        ]),
      );
}

class _ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onTap;

  const _ProductCard({required this.product, required this.onTap});

  @override
  Widget build(BuildContext context) => InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Container(
          decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border)),
          clipBehavior: Clip.antiAlias,
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Expanded(
              child: product.imageBytes != null
                  ? Image.memory(product.imageBytes!,
                      width: double.infinity, fit: BoxFit.cover)
                  : Image.network(product.img,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                          color: Colors.grey.shade200,
                          child: const Icon(LucideIcons.image,
                              color: Colors.grey))),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(product.store,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            color: AppColors.textMuted, fontSize: 10)),
                    const SizedBox(height: 3),
                    Text(product.name,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 12)),
                    const SizedBox(height: 6),
                    Row(children: [
                      const Icon(LucideIcons.star,
                          size: 11, color: AppColors.ratingAmber),
                      const SizedBox(width: 3),
                      Text(product.rating.toStringAsFixed(1),
                          style: const TextStyle(fontSize: 10)),
                      const Spacer(),
                      Text(product.formattedPrice,
                          style: const TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.w800,
                              fontSize: 12))
                    ]),
                  ]),
            ),
          ]),
        ),
      );
}

class _EmptyProductMessage extends StatelessWidget {
  const _EmptyProductMessage();

  @override
  Widget build(BuildContext context) => const Padding(
        padding: EdgeInsets.fromLTRB(16, 4, 16, 28),
        child: Text('Belum ada produk tersedia.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
      );
}

class _ServiceItem extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final Color bgColor;
  final VoidCallback onTap;

  const _ServiceItem(
      {required this.label,
      required this.icon,
      required this.color,
      required this.bgColor,
      required this.onTap});

  @override
  Widget build(BuildContext context) => InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Column(children: [
          Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                  color: bgColor, borderRadius: BorderRadius.circular(16)),
              child: Icon(icon, color: color, size: 24)),
          const SizedBox(height: 6),
          Text(label,
              style:
                  const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
        ]),
      );
}
