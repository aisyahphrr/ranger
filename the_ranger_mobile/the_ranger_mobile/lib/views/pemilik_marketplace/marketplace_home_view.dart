import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class MarketplaceHomeView extends StatefulWidget {
  const MarketplaceHomeView({super.key});

  @override
  State<MarketplaceHomeView> createState() => _MarketplaceHomeViewState();
}

class _MarketplaceHomeViewState extends State<MarketplaceHomeView> {
  int _currentBottomNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    const accentPurple = Color(0xFF7C3AED);
    const headerDark = Color(0xFF5B21B6);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.only(top: 48, left: 20, right: 20, bottom: 24),
              decoration: const BoxDecoration(color: headerDark),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        "Halo, selamat datang 🛒",
                        style: TextStyle(fontSize: 13.5, color: Colors.white70, fontWeight: FontWeight.w500),
                      ),
                      SizedBox(height: 2),
                      Text(
                        "Toko Sembako Berkah",
                        style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
                      ),
                    ],
                  ),
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.18),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(LucideIcons.bell, color: Colors.white, size: 20),
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Role Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: accentPurple,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(LucideIcons.store, color: Colors.white, size: 16),
                        SizedBox(width: 8),
                        Text(
                          "Pemilik Marketplace",
                          style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Ringkasan Dashboard Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Ringkasan Toko Hari Ini",
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            _buildStatItem("Produk Terjual", "35", LucideIcons.shoppingCart, const Color(0xFFF5F3FF), accentPurple),
                            _buildStatItem("Pendapatan", "Rp 850rb", LucideIcons.wallet, const Color(0xFFEDFBF4), const Color(0xFF15803D)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentBottomNavIndex,
        onTap: (idx) => setState(() => _currentBottomNavIndex = idx),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: accentPurple,
        unselectedItemColor: const Color(0xFF94A3B8),
        items: const [
          BottomNavigationBarItem(icon: Icon(LucideIcons.home), label: "Beranda"),
          BottomNavigationBarItem(icon: Icon(LucideIcons.package), label: "Produk"),
          BottomNavigationBarItem(icon: Icon(LucideIcons.shoppingBag), label: "Pesanan"),
          BottomNavigationBarItem(icon: Icon(LucideIcons.user), label: "Profil"),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon, Color bg, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        margin: const EdgeInsets.symmetric(horizontal: 4),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: color)),
                Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
