import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import 'kos_home_view.dart';
import 'manajemen_kamar_view.dart';
import 'manajemen_penghuni_view.dart';
import '../driver/laporan_keuangan_view.dart';
import 'pemilik_kos_profile_view.dart';

class PemilikKosDashboardView extends StatefulWidget {
  const PemilikKosDashboardView({super.key});

  @override
  State<PemilikKosDashboardView> createState() => _PemilikKosDashboardViewState();
}

class _PemilikKosDashboardViewState extends State<PemilikKosDashboardView> {
  int _selectedIndex = 0;

  late final List<Widget> _pages = [
    KosHomeView(
      onOpenRooms: () => setState(() => _selectedIndex = 1),
      onOpenOccupants: () => setState(() => _selectedIndex = 2),
      onOpenKeuangan: () => setState(() => _selectedIndex = 3),
      onOpenProfile: () => setState(() => _selectedIndex = 4),
    ),
    const ManajemenKamarView(),
    const ManajemenPenghuniView(),
    const LaporanKeuanganView(showBottomNav: false),
    const PemilikKosProfileView(),
  ];

  static const _items = [
    _NavItem('Beranda', LucideIcons.home),
    _NavItem('Kamar', LucideIcons.building),
    _NavItem('Penghuni', LucideIcons.users),
    _NavItem('Keuangan', LucideIcons.wallet),
    _NavItem('Profil', LucideIcons.user),
  ];

  @override
  Widget build(BuildContext context) {
    const accentGreen = Color(0xFF0B6637);

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
