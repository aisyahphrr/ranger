import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class LainnyaView extends StatefulWidget {
  const LainnyaView({super.key});

  @override
  State<LainnyaView> createState() => _LainnyaViewState();
}

class _LainnyaViewState extends State<LainnyaView> {
  int _currentBottomNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: const Text(
          "Lainnya",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: Color(0xFF0F172A),
          ),
        ),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.moreVertical, color: Color(0xFF0F172A)),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // 1. Laundry Shop Profile Header Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 54,
                    height: 54,
                    decoration: const BoxDecoration(
                      color: Color(0xFF0F5132),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      LucideIcons.shirt,
                      size: 24,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Laundry Bersih Kilat",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 3),
                        Row(
                          children: const [
                            Text(
                              "Pemilik Laundry",
                              style: TextStyle(
                                fontSize: 12.5,
                                color: Color(0xFF64748B),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            SizedBox(width: 4),
                            Icon(
                              Icons.check_circle_rounded,
                              size: 14,
                              color: Color(0xFF15803D),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 2. Menu List Card Container
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                children: [
                  _buildMenuItem(
                    icon: LucideIcons.store,
                    title: "Profil Laundry",
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  _buildMenuItem(
                    icon: LucideIcons.tag,
                    title: "Layanan & Harga",
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  _buildMenuItem(
                    icon: LucideIcons.userCheck,
                    title: "Karyawan",
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  _buildMenuItem(
                    icon: LucideIcons.settings,
                    title: "Pengaturan Toko",
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  _buildMenuItem(
                    icon: LucideIcons.creditCard,
                    title: "Metode Pembayaran",
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  _buildMenuItem(
                    icon: LucideIcons.helpCircle,
                    title: "Pusat Bantuan",
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
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
          currentIndex: _currentBottomNavIndex,
          onTap: (idx) {
            setState(() {
              _currentBottomNavIndex = idx;
            });
          },
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFF15803D),
          unselectedItemColor: const Color(0xFF94A3B8),
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 11),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
          items: const [
            BottomNavigationBarItem(icon: Icon(LucideIcons.home), label: "Beranda"),
            BottomNavigationBarItem(icon: Icon(LucideIcons.box), label: "Order"),
            BottomNavigationBarItem(icon: Icon(LucideIcons.clock), label: "Riwayat"),
            BottomNavigationBarItem(icon: Icon(LucideIcons.wallet), label: "Pendapatan"),
            BottomNavigationBarItem(icon: Icon(LucideIcons.user), label: "Profil"),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap ?? () {},
      borderRadius: BorderRadius.circular(20),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: Row(
          children: [
            Icon(icon, size: 20, color: const Color(0xFF334155)),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
              ),
            ),
            const Icon(
              LucideIcons.chevronRight,
              size: 16,
              color: Color(0xFFCBD5E1),
            ),
          ],
        ),
      ),
    );
  }
}
