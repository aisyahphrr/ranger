import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class VerifikasiDpView extends StatefulWidget {
  const VerifikasiDpView({super.key});

  @override
  State<VerifikasiDpView> createState() => _VerifikasiDpViewState();
}

class _VerifikasiDpViewState extends State<VerifikasiDpView> {
  int _currentBottomNavIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Verifikasi DP",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: Color(0xFF0F172A),
          ),
        ),
        centerTitle: false,
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Top Notice Banner
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEDFBF4),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFDCFCE7), width: 1.2),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: const BoxDecoration(
                            color: Color(0xFF15803D),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            LucideIcons.check,
                            size: 12,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(width: 10),
                        const Expanded(
                          child: Text(
                            "Pastikan DP sesuai dengan jumlah dan bukti pembayaran yang diterima dari penghuni.",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF15803D),
                              height: 1.35,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // 2. Detail Booking Card
                  _buildSectionCard(
                    title: "Detail Booking",
                    icon: LucideIcons.fileText,
                    child: Column(
                      children: [
                        _buildDetailRow("Nama Penghuni", "Budi Santoso", isBold: true),
                        _buildDetailRow("Tipe Kamar", "Kos Putra"),
                        _buildDetailRow("Kamar", "04 (Ahmad)"),
                        _buildDetailRow("Tanggal Booking", "12 Juli 2026"),
                        _buildDetailRow("Total Harga", "Rp1.500.000", isBold: true),
                        const SizedBox(height: 8),
                        const Divider(height: 1, color: Color(0xFFF1F5F9)),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              "Jumlah DP",
                              style: TextStyle(
                                fontSize: 13,
                                color: Color(0xFF64748B),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            RichText(
                              text: const TextSpan(
                                children: [
                                  TextSpan(
                                    text: "Rp750.000 ",
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFF15803D),
                                    ),
                                  ),
                                  TextSpan(
                                    text: "(50%)",
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF15803D),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // 3. Detail Pembayaran DP Card
                  _buildSectionCard(
                    title: "Detail Pembayaran DP",
                    icon: LucideIcons.fileText,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildDetailRow("Tanggal Transfer", "12 Juli 2026, 10:45"),
                        _buildDetailRow("Metode Pembayaran", "Transfer Bank (BCA)"),
                        _buildDetailRow("Dari Rekening", "Budi Santoso", isBold: true),
                        _buildDetailRow("Jumlah Diterima", "Rp750.000", isBold: true),
                        const SizedBox(height: 14),

                        const Text(
                          "Bukti Pembayaran",
                          style: TextStyle(
                            fontSize: 12.5,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 8),

                        // Transfer Receipt Image Thumbnail & View Button
                        Center(
                          child: Column(
                            children: [
                              GestureDetector(
                                onTap: () => _showFullImageModal(context),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(16),
                                  child: Image.network(
                                    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&fit=crop",
                                    width: double.infinity,
                                    height: 160,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 10),
                              OutlinedButton.icon(
                                onPressed: () => _showFullImageModal(context),
                                icon: const Icon(LucideIcons.search, size: 14, color: Color(0xFF15803D)),
                                label: const Text(
                                  "Lihat Bukti",
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF15803D),
                                  ),
                                ),
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                                  side: const BorderSide(color: Color(0xFFE2E8F0), width: 1.2),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // 4. Bottom Info Banner
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEDFBF4),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFDCFCE7), width: 1.2),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(
                          LucideIcons.checkCircle2,
                          size: 18,
                          color: Color(0xFF15803D),
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Setelah verifikasi, status booking akan diperbarui dan kamar akan ditandai sebagai terbooking.",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF15803D),
                              height: 1.35,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),

          // Sticky Bottom Action Bar (Tolak DP / Verifikasi & Terima DP)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: const Border(
                top: BorderSide(color: Color(0xFFF1F5F9), width: 1.2),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 10,
                  offset: const Offset(0, -4),
                ),
              ],
            ),
            child: Row(
              children: [
                // Button 1: Tolak DP
                Expanded(
                  child: SizedBox(
                    height: 48,
                    child: OutlinedButton(
                      onPressed: () => _showTolakDpDialog(context),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF15803D), width: 1.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text(
                        "Tolak DP",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF15803D),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),

                // Button 2: Verifikasi & Terima DP
                Expanded(
                  flex: 1,
                  child: SizedBox(
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () => _showVerifikasiSuksesDialog(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF15803D),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text(
                        "Verifikasi & Terima DP",
                        style: TextStyle(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
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

  // --- HELPER WIDGETS ---

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required Widget child,
  }) {
    return Container(
      width: double.infinity,
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                  color: Color(0xFFEDFBF4),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, size: 16, color: const Color(0xFF15803D)),
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              color: Color(0xFF64748B),
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 13.5,
              color: const Color(0xFF0F172A),
              fontWeight: isBold ? FontWeight.w900 : FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  // --- MODALS & DIALOGS ---

  void _showFullImageModal(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.all(16),
          child: Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.network(
                  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&fit=crop",
                  fit: BoxFit.contain,
                ),
              ),
              Positioned(
                top: 12,
                right: 12,
                child: GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: Colors.black54,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(LucideIcons.x, color: Colors.white, size: 20),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // Dialog Gambar 4: Tolak DP
  void _showTolakDpDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(
                    color: Color(0xFFFFF5F5),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    LucideIcons.triangleAlert,
                    color: Color(0xFFEF4444),
                    size: 36,
                  ),
                ),
                const SizedBox(height: 18),
                const Text(
                  "Tolak Pembayaran DP?",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  "Apakah Anda yakin ingin menolak DP ini? Status pesanan akan dikembalikan menjadi tertunda.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 24),

                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context); // Close dialog
                      Navigator.pop(context); // Return to previous page
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text("Pembayaran DP berhasil ditolak."),
                          backgroundColor: Color(0xFFEF4444),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEF4444),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      "Ya, Tolak DP",
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    "Batal",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // Dialog Gambar 5: Verifikasi Berhasil
  void _showVerifikasiSuksesDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(
                    color: Color(0xFFEDFBF4),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    LucideIcons.check,
                    color: Color(0xFF15803D),
                    size: 36,
                  ),
                ),
                const SizedBox(height: 18),
                const Text(
                  "Verifikasi Berhasil",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 8),
                RichText(
                  textAlign: TextAlign.center,
                  text: const TextSpan(
                    style: TextStyle(
                      fontSize: 13,
                      color: Color(0xFF64748B),
                      height: 1.4,
                    ),
                    children: [
                      TextSpan(text: "Pembayaran DP atas nama "),
                      TextSpan(
                        text: "Budi Santoso ",
                        style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                      ),
                      TextSpan(text: "telah dikonfirmasi. Kamar berhasil dipesan!"),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context); // Close dialog
                      Navigator.pop(context); // Return to previous page
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text("Booking Budi Santoso Berhasil Dikonfirmasi!"),
                          backgroundColor: Color(0xFF15803D),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF15803D),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      "Kembali ke Dasbor",
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
