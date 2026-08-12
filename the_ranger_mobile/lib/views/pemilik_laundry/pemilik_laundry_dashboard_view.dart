import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import 'laundry_home_view.dart';
import 'manajemen_order_view.dart';
import 'laundry_riwayat_view.dart';
import 'laundry_keuangan_view.dart';
import 'pemilik_laundry_profile_view.dart';

class PemilikLaundryDashboardView extends StatefulWidget {
  const PemilikLaundryDashboardView({super.key});

  @override
  State<PemilikLaundryDashboardView> createState() =>
      _PemilikLaundryDashboardViewState();
}

class _PemilikLaundryDashboardViewState
    extends State<PemilikLaundryDashboardView> {
  int _selectedIndex = 0;

  late final List<Widget> _pages = [
    LaundryHomeView(
      onOpenOrders: () => setState(() => _selectedIndex = 1),
      onOpenEarnings: () => setState(() => _selectedIndex = 3),
      onOpenProfile: () => setState(() => _selectedIndex = 4),
    ),
    const ManajemenOrderView(),
    const LaundryRiwayatView(),
    const LaundryKeuanganView(),
    const PemilikLaundryProfileView(),
  ];

  static const _items = [
    _NavItem('Beranda', LucideIcons.home),
    _NavItem('Order', LucideIcons.box),
    _NavItem('Riwayat', LucideIcons.clock),
    _NavItem('Pendapatan', LucideIcons.wallet),
    _NavItem('Profil', LucideIcons.user),
  ];

  @override
  Widget build(BuildContext context) {
    const accentGreen = Color(0xFF15803D);

    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      body: IndexedStack(index: _selectedIndex, children: _pages),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) {
            setState(() {
              _selectedIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          selectedItemColor: accentGreen,
          unselectedItemColor: const Color(0xFF94A3B8),
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 11),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
          items: _items.map((item) {
            return BottomNavigationBarItem(
              icon: Icon(item.icon),
              label: item.label,
            );
          }).toList(),
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
