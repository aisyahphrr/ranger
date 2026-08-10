import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class NotifikasiView extends StatefulWidget {
  const NotifikasiView({super.key});

  @override
  State<NotifikasiView> createState() => _NotifikasiViewState();
}

class _NotifikasiViewState extends State<NotifikasiView> {
  int _currentBottomNavIndex = 0;
  String _selectedCategory = "Semua"; // "Semua", "Transaksi", "Pembayaran"

  final List<Map<String, dynamic>> _newNotifications = [
    {
      "type": "booking",
      "icon": LucideIcons.bell,
      "iconBg": const Color(0xFFFFEDD5),
      "iconColor": const Color(0xFFEA580C),
      "dotColor": const Color(0xFFEA580C),
      "title": "Booking Kamar ...",
      "time": "Baru saja",
      "isBadgeTime": true,
      "body": "Budi Santoso telah membayar DP untuk tipe Kos Putra.",
      "highlightText": "Kos Putra",
    },
    {
      "type": "transaksi",
      "icon": LucideIcons.wallet,
      "iconBg": const Color(0xFFEDFBF4),
      "iconColor": const Color(0xFF15803D),
      "dotColor": const Color(0xFF15803D),
      "title": "Pembayaran Dite...",
      "time": "10 menit lalu",
      "isBadgeTime": false,
      "body": "Pembayaran kamar A-03 oleh Budi Santoso sebesar Rp1.500.000 berhasil diterima.",
      "highlightText": "Rp1.500.000",
    },
    {
      "type": "pembayaran",
      "icon": LucideIcons.alertCircle,
      "iconBg": const Color(0xFFFEE2E8),
      "iconColor": const Color(0xFFDC2626),
      "dotColor": const Color(0xFFDC2626),
      "title": "Tagihan Jatuh Tempo",
      "time": "1 jam lalu",
      "isBadgeTime": false,
      "body": "Kamar 04 (Ahmad) jatuh tempo hari ini sebesar Rp1.500.000.",
      "highlightText": "Rp1.500.000",
    },
  ];

  final List<Map<String, dynamic>> _earlierNotifications = [
    {
      "type": "transaksi",
      "icon": LucideIcons.barChart3,
      "iconBg": const Color(0xFFEFF6FF),
      "iconColor": const Color(0xFF2563EB),
      "title": "Laporan Bulan...",
      "time": "Kemarin, 09.00",
      "body": "Laporan keuangan bulan Juni 2026 sudah siap untuk dilihat.",
    },
    {
      "type": "pembayaran",
      "icon": LucideIcons.users,
      "iconBg": const Color(0xFFEDFBF4),
      "iconColor": const Color(0xFF15803D),
      "title": "Penghuni Baru Ber...",
      "time": "2 Jul 2026",
      "body": "Ayu Lestari telah menjadi penghuni kamar B-02.",
    },
    {
      "type": "pembayaran",
      "icon": LucideIcons.zap,
      "iconBg": const Color(0xFFFFEDD5),
      "iconColor": const Color(0xFFEA580C),
      "title": "Pengingat Pembay...",
      "time": "1 Jul 2026",
      "body": "Pembayaran listrik bulan Juli 2026 sebesar Rp650.000.",
      "highlightText": "Rp650.000",
    },
    {
      "type": "system",
      "icon": LucideIcons.settings,
      "iconBg": const Color(0xFFEFF6FF),
      "iconColor": const Color(0xFF2563EB),
      "title": "Pembaruan Sistem",
      "time": "30 Jun 2026",
      "body": "Aplikasi Kostin telah diperbarui ke versi 2.1.0.",
    },
  ];

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
          "Notifikasi",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: Color(0xFF0F172A),
          ),
        ),
        centerTitle: false,
        actions: [
          TextButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Semua notifikasi ditandai dibaca"),
                  backgroundColor: Color(0xFF15803D),
                ),
              );
            },
            child: const Text(
              "Tandai semua dibaca",
              style: TextStyle(
                fontSize: 12.5,
                fontWeight: FontWeight.w800,
                color: Color(0xFF15803D),
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Stack(
        children: [
          // Scrollable Body
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Category Chips Row (with Red Badge Count)
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  child: Row(
                    children: [
                      _buildCategoryChip("Semua", count: "7"),
                      const SizedBox(width: 10),
                      _buildCategoryChip("Transaksi", count: "3", icon: LucideIcons.wallet),
                      const SizedBox(width: 10),
                      _buildCategoryChip("Pembayaran", count: "2", icon: LucideIcons.bell),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Section 1: Baru
                const Text(
                  "Baru",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 12),

                // New Notifications List
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _newNotifications.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = _newNotifications[index];
                    return _buildNotificationCard(item, isNew: true);
                  },
                ),
                const SizedBox(height: 24),

                // Section 2: Sebelumnya
                const Text(
                  "Sebelumnya",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 12),

                // Earlier Notifications List
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _earlierNotifications.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = _earlierNotifications[index];
                    return _buildNotificationCard(item, isNew: false);
                  },
                ),
                const SizedBox(height: 110), // Clearance for floating push banner
              ],
            ),
          ),

          // Floating Push Notification Banner (Aktifkan notifikasi)
          Positioned(
            left: 16,
            right: 16,
            bottom: 16,
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFEDFBF4),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFDCFCE7), width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: const BoxDecoration(
                      color: Color(0xFF15803D),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(LucideIcons.bell, size: 20, color: Colors.white),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Text(
                          "Aktifkan notifikasi",
                          style: TextStyle(
                            fontSize: 13.5,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          "Dapatkan informasi penting secara real-time.",
                          style: TextStyle(
                            fontSize: 11.5,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Aktifkan Button
                  ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text("Notifikasi berhasil diaktifkan!"),
                          backgroundColor: Color(0xFF15803D),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: const Color(0xFF15803D),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: const BorderSide(color: Color(0xFFE2E8F0), width: 1.2),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                    ),
                    child: const Text(
                      "Aktifkan",
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
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

  Widget _buildCategoryChip(String label, {required String count, IconData? icon}) {
    final isSel = _selectedCategory == label;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedCategory = label;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
        decoration: BoxDecoration(
          color: isSel ? const Color(0xFF15803D) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSel ? const Color(0xFF15803D) : const Color(0xFFE2E8F0),
            width: 1.2,
          ),
        ),
        child: Row(
          children: [
            if (icon != null) ...[
              Icon(
                icon,
                size: 16,
                color: isSel ? Colors.white : const Color(0xFFEA580C),
              ),
              const SizedBox(width: 6),
            ],
            Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w800,
                color: isSel ? Colors.white : const Color(0xFF334155),
              ),
            ),
            const SizedBox(width: 6),

            // Red Count Circle Badge
            Container(
              padding: const EdgeInsets.all(4),
              decoration: const BoxDecoration(
                color: Color(0xFFDC2626),
                shape: BoxShape.circle,
              ),
              constraints: const BoxConstraints(minWidth: 18, minHeight: 18),
              child: Center(
                child: Text(
                  count,
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationCard(Map<String, dynamic> item, {required bool isNew}) {
    final highlightText = item["highlightText"] as String?;
    final bodyStr = item["body"] as String;

    return Container(
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon Box with Unread Dot
          Stack(
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: item["iconBg"] as Color,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  item["icon"] as IconData,
                  size: 20,
                  color: item["iconColor"] as Color,
                ),
              ),
              if (isNew && item["dotColor"] != null)
                Positioned(
                  top: 2,
                  right: 2,
                  child: Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: item["dotColor"] as Color,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 1.8),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14),

          // Main Column Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        item["title"] as String,
                        style: const TextStyle(
                          fontSize: 14.5,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ),
                    if (item["isBadgeTime"] == true)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDCFCE7),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          item["time"] as String,
                          style: const TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF15803D),
                          ),
                        ),
                      )
                    else
                      Text(
                        item["time"] as String,
                        style: const TextStyle(
                          fontSize: 11.5,
                          color: Color(0xFF94A3B8),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 4),

                // Body Text with Bold Highlight
                if (highlightText != null && bodyStr.contains(highlightText))
                  RichText(
                    text: TextSpan(
                      style: const TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w400,
                        height: 1.35,
                      ),
                      children: _buildHighlightSpans(bodyStr, highlightText),
                    ),
                  )
                else
                  Text(
                    bodyStr,
                    style: const TextStyle(
                      fontSize: 12.5,
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w400,
                      height: 1.35,
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 8),

          // Chevron Right Icon
          const Icon(LucideIcons.chevronRight, size: 16, color: Color(0xFFCBD5E1)),
        ],
      ),
    );
  }

  List<TextSpan> _buildHighlightSpans(String fullText, String highlight) {
    final parts = fullText.split(highlight);
    final List<TextSpan> spans = [];

    for (int i = 0; i < parts.length; i++) {
      if (parts[i].isNotEmpty) {
        spans.add(TextSpan(text: parts[i]));
      }
      if (i < parts.length - 1) {
        spans.add(
          TextSpan(
            text: highlight,
            style: TextStyle(
              fontWeight: FontWeight.w800,
              color: highlight.startsWith("Rp") ? const Color(0xFFDC2626) : const Color(0xFF0F172A),
            ),
          ),
        );
      }
    }
    return spans;
  }
}
