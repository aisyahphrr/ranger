import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class LaporanKeuanganView extends StatefulWidget {
  const LaporanKeuanganView({super.key});

  @override
  State<LaporanKeuanganView> createState() => _LaporanKeuanganViewState();
}

class _LaporanKeuanganViewState extends State<LaporanKeuanganView> {
  int _currentBottomNavIndex = 0;
  String _selectedTxFilter = "Semua"; // "Semua", "Pendapatan", "Pengeluaran"

  final List<Map<String, dynamic>> _transactions = [
    {
      "title": "Pembayaran Kamar A-03",
      "subtitle": "Budi Santoso • 2 Juli 2026",
      "amount": "+ Rp 1.500.000",
      "isIncome": true,
    },
    {
      "title": "Bayar Listrik",
      "subtitle": "PLN • 5 Juli 2026",
      "amount": "- Rp 650.000",
      "isIncome": false,
    },
    {
      "title": "Laundry Bulanan",
      "subtitle": "Ayu • 6 Juli 2026",
      "amount": "+ Rp 250.000",
      "isIncome": true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filteredTransactions = _transactions.where((t) {
      if (_selectedTxFilter == "Pendapatan") return t["isIncome"] == true;
      if (_selectedTxFilter == "Pengeluaran") return t["isIncome"] == false;
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text(
              "Laporan Keuangan",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
                height: 1.15,
              ),
            ),
            Text(
              "Ringkasan pemasukan & pengeluaran",
              style: TextStyle(
                fontSize: 11.5,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        centerTitle: false,
        actions: [
          // Month Dropdown Pill Button
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
            ),
            child: Row(
              children: const [
                Icon(LucideIcons.calendar, size: 14, color: Color(0xFF15803D)),
                SizedBox(width: 4),
                Text(
                  "Juli 2026",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
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
      body: Stack(
        children: [
          // Scrollable Body Content
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Dark Green Net Profit Hero Card (Laba Bersih)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F5132),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.06),
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
                            "Laba Bersih",
                            style: TextStyle(
                              fontSize: 13,
                              color: Color(0xFFA7F3D0),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            "Rp 8.250.000",
                            style: TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 12),
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
                                      "+12%",
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
                                "dibanding bulan lalu",
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
                        right: 0,
                        bottom: 0,
                        child: Icon(
                          LucideIcons.fileText,
                          size: 70,
                          color: Colors.white.withValues(alpha: 0.08),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // 2. Metric Summary Horizontal Cards (Pendapatan & Pengeluaran)
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  child: Row(
                    children: [
                      // Card 1: Pendapatan
                      _buildMetricSummaryCard(
                        icon: LucideIcons.wallet,
                        iconBg: const Color(0xFFEDFBF4),
                        iconColor: const Color(0xFF15803D),
                        title: "Pendapatan",
                        amount: "Rp 12.500.000",
                        trendText: "+8.5%",
                        trendBg: const Color(0xFFDCFCE7),
                        trendTextColor: const Color(0xFF15803D),
                      ),
                      const SizedBox(width: 12),

                      // Card 2: Pengeluaran
                      _buildMetricSummaryCard(
                        icon: LucideIcons.arrowDown,
                        iconBg: const Color(0xFFFEE2E8),
                        iconColor: const Color(0xFFDC2626),
                        title: "Pengeluaran",
                        amount: "Rp 4.250.000",
                        trendText: "+5.2%",
                        trendBg: const Color(0xFFFEE2E8),
                        trendTextColor: const Color(0xFFDC2626),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // 3. Monthly Revenue Line Chart Card (Pendapatan Bulanan)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            "Pendapatan Bulanan",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          Row(
                            children: const [
                              Text(
                                "Lihat Detail",
                                style: TextStyle(
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF15803D),
                                ),
                              ),
                              SizedBox(width: 4),
                              Icon(LucideIcons.chevronRight, size: 14, color: Color(0xFF15803D)),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Custom Line Chart Visualization
                      SizedBox(
                        height: 180,
                        child: CustomPaint(
                          size: Size.infinite,
                          painter: RevenueLineChartPainter(),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // 4. Expense Breakdown Donut Chart Card (Komposisi Pengeluaran)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Komposisi Pengeluaran",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          // Left Donut Chart
                          SizedBox(
                            width: 120,
                            height: 120,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                CustomPaint(
                                  size: const Size(110, 110),
                                  painter: ExpenseDonutChartPainter(),
                                ),
                                Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: const [
                                    Text(
                                      "Total",
                                      style: TextStyle(fontSize: 10, color: Color(0xFF94A3B8), fontWeight: FontWeight.w500),
                                    ),
                                    Text(
                                      "Rp 4.25M",
                                      style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 20),

                          // Right Legend Items
                          Expanded(
                            child: Column(
                              children: [
                                _buildLegendRow(const Color(0xFF0F5132), "Operasional", "45%"),
                                const SizedBox(height: 6),
                                _buildLegendRow(const Color(0xFF10B981), "Listrik", "25%"),
                                const SizedBox(height: 6),
                                _buildLegendRow(const Color(0xFF2563EB), "Air", "15%"),
                                const SizedBox(height: 6),
                                _buildLegendRow(const Color(0xFFF59E0B), "Perawatan", "10%"),
                                const SizedBox(height: 6),
                                _buildLegendRow(const Color(0xFF94A3B8), "Lainnya", "10%"),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // 5. Transaksi Terbaru Section
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "Transaksi Terbaru",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    Row(
                      children: const [
                        Text(
                          "Lihat Semua",
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF15803D),
                          ),
                        ),
                        SizedBox(width: 4),
                        Icon(LucideIcons.chevronRight, size: 14, color: Color(0xFF15803D)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Filter Chips Row
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                        ),
                        child: const Icon(LucideIcons.search, size: 16, color: Color(0xFF64748B)),
                      ),
                      const SizedBox(width: 8),
                      _buildTxFilterPill("Semua"),
                      const SizedBox(width: 8),
                      _buildTxFilterPill("Pendapatan"),
                      const SizedBox(width: 8),
                      _buildTxFilterPill("Pengeluaran"),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                // Transactions List Card Container
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                  ),
                  child: ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filteredTransactions.length,
                    separatorBuilder: (context, index) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    itemBuilder: (context, index) {
                      final tx = filteredTransactions[index];
                      return _buildTransactionItem(tx);
                    },
                  ),
                ),
                const SizedBox(height: 24),

                // 6. Side-by-Side Dual Summary & Insight Cards
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Left: Ringkasan Keuangan
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: const [
                                Icon(LucideIcons.building2, size: 16, color: Color(0xFF15803D)),
                                SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    "Ringkasan Keuangan",
                                    style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            const Text(
                              "Total Pendapatan",
                              style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              "Rp 12.500.000",
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                            ),
                            const SizedBox(height: 12),
                            const Divider(height: 1, color: Color(0xFFF1F5F9)),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: const [
                                Text("Tunai", style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                                Text("Transfer", style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: const [
                                Text("Rp 3.500.000", style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                                Text("Rp 9.000.000", style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),

                    // Right: Insight Bulan Ini
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: const [
                                Icon(LucideIcons.zap, size: 16, color: Color(0xFFEA580C)),
                                SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    "Insight Bulan Ini",
                                    style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            _buildInsightBullet("📈", "Pendapatan meningkat 12%"),
                            const SizedBox(height: 6),
                            _buildInsightBullet("👥", "Okupansi mencapai 83%"),
                            const SizedBox(height: 6),
                            _buildInsightBullet("⚡", "Pengeluaran listrik naik 8%"),
                            const SizedBox(height: 6),
                            _buildInsightBullet("⚠️", "2 penghuni belum membayar sewa"),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 100),
              ],
            ),
          ),

          // Floating Plus Button (Right)
          Positioned(
            right: 20,
            bottom: 20,
            child: GestureDetector(
              onTap: () {},
              child: Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: const Color(0xFF15803D),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF15803D).withValues(alpha: 0.35),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const Icon(
                  LucideIcons.plus,
                  color: Colors.white,
                  size: 26,
                ),
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

  Widget _buildMetricSummaryCard({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String amount,
    required String trendText,
    required Color trendBg,
    required Color trendTextColor,
  }) {
    return Container(
      width: 170,
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
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: iconBg,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 18, color: iconColor),
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 2),
          Text(
            amount,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: trendBg,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  trendText,
                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w800, color: trendTextColor),
                ),
              ),
              const SizedBox(width: 4),
              const Text(
                "vs bulan lalu",
                style: TextStyle(fontSize: 10, color: Color(0xFF94A3B8), fontWeight: FontWeight.w400),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegendRow(Color color, String label, String percentage) {
    return Row(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(fontSize: 12, color: Color(0xFF475569), fontWeight: FontWeight.w500),
          ),
        ),
        Text(
          percentage,
          style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
        ),
      ],
    );
  }

  Widget _buildTxFilterPill(String label) {
    final isSel = _selectedTxFilter == label;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedTxFilter = label;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSel ? const Color(0xFF15803D) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSel ? const Color(0xFF15803D) : const Color(0xFFE2E8F0),
            width: 1.2,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12.5,
            fontWeight: FontWeight.w800,
            color: isSel ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }

  Widget _buildTransactionItem(Map<String, dynamic> tx) {
    final isIncome = tx["isIncome"] as bool;

    return Padding(
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: isIncome ? const Color(0xFFEDFBF4) : const Color(0xFFFEE2E8),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isIncome ? LucideIcons.arrowUpRight : LucideIcons.arrowDownRight,
              size: 18,
              color: isIncome ? const Color(0xFF15803D) : const Color(0xFFDC2626),
            ),
          ),
          const SizedBox(width: 12),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tx["title"] as String,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 2),
                Text(
                  tx["subtitle"] as String,
                  style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w400),
                ),
              ],
            ),
          ),

          Row(
            children: [
              Text(
                tx["amount"] as String,
                style: TextStyle(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w900,
                  color: isIncome ? const Color(0xFF15803D) : const Color(0xFFDC2626),
                ),
              ),
              const SizedBox(width: 4),
              const Icon(LucideIcons.chevronRight, size: 14, color: Color(0xFFCBD5E1)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInsightBullet(String emoji, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(emoji, style: const TextStyle(fontSize: 11)),
        const SizedBox(width: 4),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(fontSize: 10.5, color: Color(0xFF475569), fontWeight: FontWeight.w500, height: 1.2),
          ),
        ),
      ],
    );
  }
}

// Custom Painter for Monthly Revenue Line Chart
class RevenueLineChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = const Color(0xFFF1F5F9)
      ..strokeWidth = 1;

    final linePaint = Paint()
      ..color = const Color(0xFF15803D)
      ..strokeWidth = 3.2
      ..style = PaintingStyle.stroke;

    final dotPaint = Paint()
      ..color = const Color(0xFF15803D)
      ..style = PaintingStyle.fill;

    // Grid lines & Y Labels
    final double stepY = (size.height - 30) / 3;
    final yLabels = ["15 jt", "10 jt", "5 jt", "0"];

    for (int i = 0; i < 4; i++) {
      double y = i * stepY;
      canvas.drawLine(Offset(35, y), Offset(size.width, y), gridPaint);

      final textSpan = TextSpan(
        text: yLabels[i],
        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10.5, fontWeight: FontWeight.w500),
      );
      final tp = TextPainter(text: textSpan, textDirection: TextDirection.ltr);
      tp.layout();
      tp.paint(canvas, Offset(0, y - 6));
    }

    // X Labels & Points
    final months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];
    final values = [0.35, 0.45, 0.65, 0.58, 0.75, 0.85, 0.95]; // Normalized [0..1]

    final double stepX = (size.width - 45) / (months.length - 1);
    final List<Offset> points = [];

    for (int i = 0; i < months.length; i++) {
      double x = 40 + (i * stepX);
      double y = (size.height - 30) * (1 - values[i]);
      points.add(Offset(x, y));

      final textSpan = TextSpan(
        text: months[i],
        style: TextStyle(
          color: i == months.length - 1 ? const Color(0xFF15803D) : const Color(0xFF94A3B8),
          fontSize: 11,
          fontWeight: i == months.length - 1 ? FontWeight.w900 : FontWeight.w500,
        ),
      );
      final tp = TextPainter(text: textSpan, textDirection: TextDirection.ltr);
      tp.layout();
      tp.paint(canvas, Offset(x - (tp.width / 2), size.height - 18));
    }

    // Draw Smooth Path
    final path = Path();
    if (points.isNotEmpty) {
      path.moveTo(points[0].dx, points[0].dy);
      for (int i = 0; i < points.length - 1; i++) {
        final p1 = points[i];
        final p2 = points[i + 1];
        final controlP1 = Offset(p1.dx + (p2.dx - p1.dx) / 2, p1.dy);
        final controlP2 = Offset(p1.dx + (p2.dx - p1.dx) / 2, p2.dy);
        path.cubicTo(controlP1.dx, controlP1.dy, controlP2.dx, controlP2.dy, p2.dx, p2.dy);
      }
      canvas.drawPath(path, linePaint);
    }

    // Draw Dots & Highlight Tooltip on Jul
    for (int i = 0; i < points.length; i++) {
      canvas.drawCircle(points[i], 4, dotPaint);
    }

    // Active Tooltip on Last Point (Jul)
    final lastP = points.last;
    final tooltipBg = Paint()..color = const Color(0xFF0F5132);
    final RRect rect = RRect.fromRectAndRadius(
      Rect.fromLTRB(
        lastP.dx - 50,
        lastP.dy - 34,
        lastP.dx + 50,
        lastP.dy - 6,
      ),
      const Radius.circular(8),
    );
    canvas.drawRRect(rect, tooltipBg);

    final tooltipSpan = const TextSpan(
      text: "Rp 12.500.000",
      style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.w900),
    );
    final tpTooltip = TextPainter(text: tooltipSpan, textDirection: TextDirection.ltr);
    tpTooltip.layout();
    tpTooltip.paint(canvas, Offset(lastP.dx - (tpTooltip.width / 2), lastP.dy - 27));
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Custom Painter for Expense Donut Chart
class ExpenseDonutChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 8;
    final strokeWidth = 16.0;

    final slices = [
      {"percent": 0.45, "color": const Color(0xFF0F5132)},
      {"percent": 0.25, "color": const Color(0xFF10B981)},
      {"percent": 0.15, "color": const Color(0xFF2563EB)},
      {"percent": 0.10, "color": const Color(0xFFF59E0B)},
      {"percent": 0.10, "color": const Color(0xFF94A3B8)},
    ];

    double startAngle = -1.57; // -90 deg

    for (var slice in slices) {
      final sweepAngle = (slice["percent"] as double) * 2 * 3.14159;
      final paint = Paint()
        ..color = slice["color"] as Color
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle - 0.05, // gap between slices
        false,
        paint,
      );

      startAngle += sweepAngle;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
