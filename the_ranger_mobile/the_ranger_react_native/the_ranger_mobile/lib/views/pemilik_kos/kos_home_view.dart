import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'manajemen_kamar_view.dart';
import 'manajemen_penghuni_view.dart';
import 'verifikasi_dp_view.dart';
import 'kirim_pengingat_view.dart';
import '../driver/laporan_keuangan_view.dart';
import '../driver/notifikasi_view.dart';

class KosHomeView extends StatefulWidget {
  const KosHomeView({super.key});

  @override
  State<KosHomeView> createState() => _KosHomeViewState();
}

class _KosHomeViewState extends State<KosHomeView> {
  int _currentBottomNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    const primaryGreen = Color(0xFF0B6637);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Green Header Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.only(top: 48, left: 20, right: 20, bottom: 24),
              decoration: const BoxDecoration(
                color: primaryGreen,
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(28)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "Halo, selamat pagi 🌿",
                            style: TextStyle(
                              fontSize: 14,
                              color: Color(0xFFA7F3D0),
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

                      // Notification Bell Button with Red Dot
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const NotifikasiView(),
                            ),
                          );
                        },
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.18),
                            shape: BoxShape.circle,
                          ),
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              const Icon(
                                LucideIcons.bell,
                                color: Colors.white,
                                size: 20,
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
                      ),
                    ],
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 16),

                  // Orange Role Pill Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFF6B00),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFFF6B00).withValues(alpha: 0.25),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(LucideIcons.store, size: 16, color: Colors.white),
                        SizedBox(width: 8),
                        Text(
                          "Pemilik Kos",
                          style: TextStyle(
                            fontSize: 13.5,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // 1. Ringkasan Bisnis Bulan Ini Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Ringkasan Bisnis Bulan Ini",
                        style: TextStyle(
                          fontSize: 15.5,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                        ),
                        child: Row(
                          children: const [
                            Text(
                              "Juli 2026",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF334155),
                              ),
                            ),
                            SizedBox(width: 4),
                            Icon(LucideIcons.chevronDown, size: 14, color: Color(0xFF64748B)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Income Card Dark Green
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: primaryGreen,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: primaryGreen.withValues(alpha: 0.25),
                          blurRadius: 16,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Estimasi Pendapatan",
                              style: TextStyle(
                                fontSize: 13,
                                color: Color(0xFFA7F3D0),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              "Rp 12.500.000",
                              style: TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 14),
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFDCFCE7),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    children: const [
                                      Icon(LucideIcons.trendingUp, size: 12, color: Color(0xFF15803D)),
                                      SizedBox(width: 3),
                                      Text(
                                        "+5.2%",
                                        style: TextStyle(
                                          fontSize: 11.5,
                                          fontWeight: FontWeight.w800,
                                          color: Color(0xFF15803D),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 8),
                                const Text(
                                  "vs bulan lalu",
                                  style: TextStyle(
                                    fontSize: 11.5,
                                    color: Colors.white70,
                                    fontWeight: FontWeight.w400,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Positioned(
                          right: -10,
                          bottom: -10,
                          child: Icon(
                            LucideIcons.wallet,
                            size: 80,
                            color: Colors.white.withValues(alpha: 0.12),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // 2. Tingkat Keterisian Section
                  const Text(
                    "Tingkat Keterisian",
                    style: TextStyle(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                    ),
                    child: Row(
                      children: [
                        const SizedBox(
                          width: 95,
                          height: 95,
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              SizedBox(
                                width: 85,
                                height: 85,
                                child: CircularProgressIndicator(
                                  value: 0.83,
                                  strokeWidth: 9,
                                  backgroundColor: Color(0xFFF1F5F9),
                                  valueColor: AlwaysStoppedAnimation<Color>(primaryGreen),
                                ),
                              ),
                              Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    "83%",
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFF0F172A),
                                    ),
                                  ),
                                  Text(
                                    "Terisi",
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: Color(0xFF64748B),
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            children: [
                              _buildOccupancyRow(
                                icon: LucideIcons.building,
                                iconBg: const Color(0xFFDCFCE7),
                                iconColor: primaryGreen,
                                label: "Total Kamar",
                                value: "12",
                              ),
                              const SizedBox(height: 10),
                              _buildOccupancyRow(
                                icon: LucideIcons.users,
                                iconBg: const Color(0xFFEFF6FF),
                                iconColor: const Color(0xFF2563EB),
                                label: "Kamar Terisi",
                                value: "10",
                              ),
                              const SizedBox(height: 10),
                              _buildOccupancyRow(
                                icon: LucideIcons.store,
                                iconBg: const Color(0xFFFFF7ED),
                                iconColor: const Color(0xFFFF6B00),
                                label: "Kamar Kosong",
                                value: "2",
                                valueColor: const Color(0xFFFF6B00),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // 3. Quick Action 4 Grid Buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildQuickActionCard(
                        icon: LucideIcons.building,
                        title: "Manajemen\nKamar",
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ManajemenKamarView(),
                            ),
                          );
                        },
                      ),
                      _buildQuickActionCard(
                        icon: LucideIcons.users,
                        title: "Penghuni",
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ManajemenPenghuniView(),
                            ),
                          );
                        },
                      ),
                      _buildQuickActionCard(
                        icon: LucideIcons.fileText,
                        title: "Laporan\nKeuangan",
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const LaporanKeuanganView(),
                            ),
                          );
                        },
                      ),
                      _buildQuickActionCard(
                        icon: LucideIcons.layoutGrid,
                        title: "Lainnya",
                        onTap: () {},
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // 4. Perlu Tindakan Section (Image 2)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Perlu Tindakan",
                        style: TextStyle(
                          fontSize: 15.5,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      TextButton(
                        onPressed: () {},
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.zero,
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        child: Row(
                          children: const [
                            Text(
                              "Lihat Semua",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: primaryGreen,
                              ),
                            ),
                            SizedBox(width: 2),
                            Icon(LucideIcons.chevronRight, size: 14, color: primaryGreen),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Action Card 1: Booking Kamar Baru (Orange Accent)
                  _buildActionCard(
                    accentColor: const Color(0xFFFF6B00),
                    icon: LucideIcons.bell,
                    iconBg: const Color(0xFFFFF7ED),
                    iconColor: const Color(0xFFFF6B00),
                    title: "Booking Kamar Baru",
                    tag: "Baru saja",
                    tagBg: const Color(0xFFDCFCE7),
                    tagTextColor: const Color(0xFF15803D),
                    description: "Budi Santoso telah membayar DP untuk tipe Kos Putra.",
                    buttonLabel: "Verifikasi DP",
                    buttonBg: const Color(0xFFFF6B00),
                    buttonTextColor: Colors.white,
                    onTapButton: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const VerifikasiDpView(),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 12),

                  // Action Card 2: Tagihan Jatuh Tempo (Red Accent)
                  _buildActionCard(
                    accentColor: const Color(0xFFEF4444),
                    icon: LucideIcons.alertCircle,
                    iconBg: const Color(0xFFFEF2F2),
                    iconColor: const Color(0xFFEF4444),
                    title: "Tagihan Jatuh Tempo",
                    tag: "Hari ini",
                    tagBg: const Color(0xFFFEE2E2),
                    tagTextColor: const Color(0xFFEF4444),
                    description: "Kamar 04 (Ahmad) jatuh tempo hari ini sebesar Rp 1.500.000.",
                    buttonLabel: "Kirim Pengingat",
                    buttonBg: const Color(0xFFFEF2F2),
                    buttonTextColor: const Color(0xFFEF4444),
                    onTapButton: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const KirimPengingatView(),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 24),

                  // 5. Status Kamar Kosong Section (Image 2)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Status Kamar Kosong",
                        style: TextStyle(
                          fontSize: 15.5,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ManajemenKamarView(),
                            ),
                          );
                        },
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.zero,
                          minimumSize: Size.zero,
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                        child: Row(
                          children: const [
                            Text(
                              "Kelola Kamar",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: primaryGreen,
                              ),
                            ),
                            SizedBox(width: 2),
                            Icon(LucideIcons.chevronRight, size: 14, color: primaryGreen),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Horizontal Cards List for Available Rooms
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    physics: const BouncingScrollPhysics(),
                    child: Row(
                      children: [
                        _buildEmptyRoomCard(
                          title: "Kamar 1A",
                          tag: "Kos Putra",
                          type: "Tipe Campur AC",
                          price: "Rp 1.200.000",
                        ),
                        const SizedBox(width: 12),
                        _buildEmptyRoomCard(
                          title: "Kamar 2A",
                          tag: "Kos Putra",
                          type: "Tipe Campur AC",
                          price: "Rp 1.200.000",
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentBottomNavIndex,
        onTap: (idx) {
          setState(() {
            _currentBottomNavIndex = idx;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: primaryGreen,
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
    );
  }

  Widget _buildOccupancyRow({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String label,
    required String value,
    Color valueColor = const Color(0xFF0F172A),
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: iconBg,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, size: 14, color: iconColor),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 12.5,
              color: Color(0xFF475569),
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w900,
            color: valueColor,
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActionCard({
    required IconData icon,
    required String title,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 78,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Color(0xFFECFDF5),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 20, color: const Color(0xFF0B6637)),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 10.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF0F172A),
                height: 1.2,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard({
    required Color accentColor,
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String tag,
    required Color tagBg,
    required Color tagTextColor,
    required String description,
    required String buttonLabel,
    required Color buttonBg,
    required Color buttonTextColor,
    required VoidCallback onTapButton,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          children: [
            // Left Accent Colored Bar
            Container(
              width: 5,
              decoration: BoxDecoration(
                color: accentColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(20),
                  bottomLeft: Radius.circular(20),
                ),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: iconBg,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(icon, size: 18, color: iconColor),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            title,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: tagBg,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            tag,
                            style: TextStyle(
                              fontSize: 10.5,
                              fontWeight: FontWeight.w700,
                              color: tagTextColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      description,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF64748B),
                        height: 1.35,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: onTapButton,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: buttonBg,
                        foregroundColor: buttonTextColor,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      ),
                      child: Text(
                        buttonLabel,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: buttonTextColor,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyRoomCard({
    required String title,
    required String tag,
    required String type,
    required String price,
  }) {
    return Container(
      width: 220,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  tag,
                  style: const TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF15803D),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            type,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF64748B),
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 12),

          // Features Row Icons
          Row(
            children: const [
              Icon(LucideIcons.tv, size: 12, color: Color(0xFF64748B)),
              SizedBox(width: 3),
              Text("AC", style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
              SizedBox(width: 8),
              Icon(LucideIcons.wifi, size: 12, color: Color(0xFF64748B)),
              SizedBox(width: 3),
              Text("WiFi", style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
              SizedBox(width: 8),
              Icon(LucideIcons.bath, size: 12, color: Color(0xFF64748B)),
              SizedBox(width: 3),
              Text("KM Dalam", style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B))),
            ],
          ),
          const SizedBox(height: 14),

          RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: price,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0B6637),
                  ),
                ),
                const TextSpan(
                  text: " /bulan",
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF94A3B8),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
