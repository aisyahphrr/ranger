import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import 'beranda/pemilik_marketplace_beranda_view.dart';
import 'order/pemilik_marketplace_order_view.dart';
import 'pendapatan/pemilik_marketplace_pendapatan_view.dart';
import 'profile/pemilik_marketplace_profile_view.dart';
import 'riwayat/pemilik_marketplace_riwayat_view.dart';

/// Container dashboard: hanya mengelola navigasi dan mempertahankan state tiap tab.
class MitraMarketplaceDashboardView extends StatefulWidget {
  const MitraMarketplaceDashboardView({super.key});

  @override
  State<MitraMarketplaceDashboardView> createState() => _MitraMarketplaceDashboardViewState();
}

class _MitraMarketplaceDashboardViewState extends State<MitraMarketplaceDashboardView> {
  int _selectedIndex = 0;

  late final List<Widget> _pages = [
    PemilikMarketplaceBerandaView(
      onOpenOrders: () => setState(() => _selectedIndex = 1),
      onOpenEarnings: () => setState(() => _selectedIndex = 3),
    ),
    const PemilikMarketplaceOrderView(),
    const PemilikMarketplaceRiwayatView(),
    const PemilikMarketplacePendapatanView(),
    const PemilikMarketplaceProfileView(),
  ];

  static const _items = [
    _NavItem('Beranda', LucideIcons.house),
    _NavItem('Order', LucideIcons.shoppingBag),
    _NavItem('Riwayat', LucideIcons.clipboardList),
    _NavItem('Pendapatan', LucideIcons.walletCards),
    _NavItem('Profil', LucideIcons.userRound),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: IndexedStack(index: _selectedIndex, children: _pages),
      bottomNavigationBar: SafeArea(
        top: false,
        child: Container(
          height: 72,
          decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(top: BorderSide(color: AppColors.border)),
          ),
          child: Row(
            children: List.generate(_items.length, (index) {
              final item = _items[index];
              final active = index == _selectedIndex;
              return Expanded(
                child: InkWell(
                  onTap: () => setState(() => _selectedIndex = index),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                        decoration: BoxDecoration(
                          color: active ? AppColors.primary.withOpacity(.12) : Colors.transparent,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Icon(item.icon, size: 21, color: active ? AppColors.primary : AppColors.textMuted),
                      ),
                      const SizedBox(height: 3),
                      Text(item.label, style: TextStyle(fontSize: 11, fontWeight: active ? FontWeight.w800 : FontWeight.w500, color: active ? AppColors.primary : AppColors.textMuted)),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _NavItem {
  const _NavItem(this.label, this.icon);
  final String label;
  final IconData icon;
}
