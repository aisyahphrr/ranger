import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'laundry_keuangan_view.dart';
import 'manajemen_order_view.dart';
import 'pelanggan_laundry_view.dart';
import '../driver/notifikasi_view.dart';

class LaundryHomeView extends StatefulWidget {
  const LaundryHomeView({super.key});

  @override
  State<LaundryHomeView> createState() => _LaundryHomeViewState();
}

class _LaundryHomeViewState extends State<LaundryHomeView> {
  int _currentBottomNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    const headerGreen = Color(0xFF0B6637);
    const accentGreen = Color(0xFF15803D);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Top Green Header Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.only(top: 48, left: 20, right: 20, bottom: 24),
              decoration: const BoxDecoration(
                color: headerGreen,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        "Halo, selamat pagi 🌿",
                        style: TextStyle(
                          fontSize: 13.5,
                          color: Colors.white70,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        "Pak Rahman",
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  // Bell Icon with Notification Badge
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const NotifikasiView(),
                        ),
                      );
                    },
                    child: Stack(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.18),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            LucideIcons.bell,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                        Positioned(
                          top: 10,
                          right: 10,
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Color(0xFFEF4444),
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 2. Role Pill Badge (Pemilik Laundry)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF2563EB),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF2563EB).withValues(alpha: 0.25),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(LucideIcons.shirt, color: Colors.white, size: 16),
                        SizedBox(width: 8),
                        Text(
                          "Pemilik Laundry",
                          style: TextStyle(
                            fontSize: 13.5,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  // 3. Ringkasan Hari Ini Section (2x2 Grid)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
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
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text(
                                  "Ringkasan Hari Ini",
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF0F172A),
                                  ),
                                ),
                                SizedBox(height: 2),
                                Text(
                                  "Selasa, 14 Juli 2026",
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF64748B),
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                            GestureDetector(
                              onTap: () {},
                              child: Row(
                                children: const [
                                  Text(
                                    "Lihat Detail",
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w800,
                                      color: accentGreen,
                                    ),
                                  ),
                                  SizedBox(width: 4),
                                  Icon(LucideIcons.chevronRight, size: 14, color: accentGreen),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        const Divider(height: 1, color: Color(0xFFF1F5F9)),
                        const SizedBox(height: 16),

                        // 2x2 Grid Quadrants
                        Row(
                          children: [
                            _buildGridStatItem(
                              icon: LucideIcons.shoppingBag,
                              value: "12",
                              label: "Pesanan Baru",
                            ),
                            Container(width: 1, height: 45, color: const Color(0xFFF1F5F9)),
                            _buildGridStatItem(
                              icon: LucideIcons.wallet,
                              value: "18",
                              label: "Sedang Dikerjakan",
                            ),
                          ],
                        ),
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 12),
                          child: Divider(height: 1, color: Color(0xFFF1F5F9)),
                        ),
                        Row(
                          children: [
                            _buildGridStatItem(
                              icon: LucideIcons.checkSquare,
                              value: "8",
                              label: "Selesai Hari Ini",
                            ),
                            Container(width: 1, height: 45, color: const Color(0xFFF1F5F9)),
                            _buildGridStatItem(
                              icon: LucideIcons.trendingUp,
                              value: "Rp 1.245.000",
                              label: "Pendapatan",
                              isValueBold: true,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 22),

                  // 4. Pesanan Terbaru Section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Pesanan Terbaru",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ManajemenOrderView(),
                            ),
                          );
                        },
                        child: Row(
                          children: const [
                            Text(
                              "Lihat Semua",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                                color: accentGreen,
                              ),
                            ),
                            SizedBox(width: 4),
                            Icon(LucideIcons.chevronRight, size: 14, color: accentGreen),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Orders Card Container
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
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
                        _buildOrderItem(
                          code: "#LND-924",
                          subtitle: "Siti Aminah • Express 3 Jam",
                          tag: "Baru",
                          tagBg: const Color(0xFFEDFBF4),
                          tagColor: const Color(0xFF15803D),
                          trailing: "-",
                          iconBg: const Color(0xFFEDFBF4),
                          iconColor: const Color(0xFF15803D),
                        ),
                        const Divider(height: 1, color: Color(0xFFF1F5F9)),
                        _buildOrderItem(
                          code: "#LND-923",
                          subtitle: "Ahmad Faisal • Biasa",
                          tag: "Diproses",
                          tagBg: const Color(0xFFEFF6FF),
                          tagColor: const Color(0xFF2563EB),
                          trailing: "Rp 40.000",
                          iconBg: const Color(0xFFEFF6FF),
                          iconColor: const Color(0xFF2563EB),
                        ),
                        const Divider(height: 1, color: Color(0xFFF1F5F9)),
                        _buildOrderItem(
                          code: "#LND-922",
                          subtitle: "Dewi Lestari • Cuci Komplit",
                          tag: "Menunggu Harga",
                          tagBg: const Color(0xFFFFF7ED),
                          tagColor: const Color(0xFFEA580C),
                          trailing: "-",
                          iconBg: const Color(0xFFEDFBF4),
                          iconColor: const Color(0xFF15803D),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 22),

                  // 5. Quick Action Section (Gambar 2)
                  const Text(
                    "Quick Action",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 14),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildQuickActionButton(
                        icon: LucideIcons.box,
                        label: "Manajemen\nOrder",
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ManajemenOrderView(),
                            ),
                          );
                        },
                      ),
                      _buildQuickActionButton(
                        icon: LucideIcons.users,
                        label: "Manajemen\nUser",
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const PelangganLaundryView(),
                            ),
                          );
                        },
                      ),
                      _buildQuickActionButton(
                        icon: LucideIcons.barChart2,
                        label: "Laporan\nKeuangan",
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const LaundryKeuanganView(),
                            ),
                          );
                        },
                      ),
                      _buildQuickActionButton(
                        icon: LucideIcons.grid,
                        label: "Lainnya",
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text("Fitur Lainnya")),
                          );
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
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
          selectedItemColor: accentGreen,
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

  // --- HELPER WIDGETS ---

  Widget _buildGridStatItem({
    required IconData icon,
    required String value,
    required String label,
    bool isValueBold = false,
  }) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFEDFBF4),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, size: 20, color: const Color(0xFF15803D)),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    value,
                    style: TextStyle(
                      fontSize: isValueBold ? 15 : 18,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderItem({
    required String code,
    required String subtitle,
    required String tag,
    required Color tagBg,
    required Color tagColor,
    required String trailing,
    required Color iconBg,
    required Color iconColor,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: iconBg,
              shape: BoxShape.circle,
            ),
            child: Icon(LucideIcons.shirt, size: 20, color: iconColor),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  code,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 11.5,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: tagBg,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  tag,
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w800,
                    color: tagColor,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                trailing,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: trailing == "-" ? FontWeight.w500 : FontWeight.w900,
                  color: const Color(0xFF0F172A),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 58,
            height: 58,
            decoration: const BoxDecoration(
              color: Color(0xFF0B6637),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w700,
              color: Color(0xFF0F172A),
              height: 1.2,
            ),
          ),
        ],
      ),
    );
  }
}
