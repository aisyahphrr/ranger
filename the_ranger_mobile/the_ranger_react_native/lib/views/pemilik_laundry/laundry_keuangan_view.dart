import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class LaundryKeuanganView extends StatefulWidget {
  const LaundryKeuanganView({super.key});

  @override
  State<LaundryKeuanganView> createState() => _LaundryKeuanganViewState();
}

class _LaundryKeuanganViewState extends State<LaundryKeuanganView> {
  String _selectedChartTab = "Minggu"; // "Minggu" or "Bulan"

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF0F172A)),
                onPressed: () => Navigator.maybePop(context),
              )
            : null,
        title: const Text(
          "Keuangan",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: Color(0xFF0F172A),
          ),
        ),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Sub-Header Filter Row (Ringkasan Bulan Ini & Juli 2026 Dropdown)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEDFBF4),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: const [
                      Text(
                        "Ringkasan Bulan Ini",
                        style: TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF15803D),
                        ),
                      ),
                      SizedBox(width: 4),
                      Icon(LucideIcons.chevronRight, size: 14, color: Color(0xFF15803D)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
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
            const SizedBox(height: 16),

            // 2. Dark Green Total Revenue Hero Card (Total Pendapatan)
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
                    children: const [
                      Text(
                        "Total Pendapatan",
                        style: TextStyle(
                          fontSize: 13,
                          color: Color(0xFFA7F3D0),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        "Rp 18.750.000",
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: 12),
                      Text(
                        "↑ 12.5% dari bulan lalu",
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFFA7F3D0),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),

                  // Watermark Bar Chart Icon
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Icon(
                      LucideIcons.barChart2,
                      size: 70,
                      color: Colors.white.withValues(alpha: 0.08),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 3. 3 Metric Summary Cards Row (Pendapatan, Pengeluaran, Laba Bersih)
            Row(
              children: [
                _buildMetricBox(
                  label: "Pendapatan",
                  amount: "Rp\n18.750.000",
                  amountColor: const Color(0xFF15803D),
                ),
                const SizedBox(width: 10),
                _buildMetricBox(
                  label: "Pengeluaran",
                  amount: "Rp 4.250.000",
                  amountColor: const Color(0xFFDC2626),
                ),
                const SizedBox(width: 10),
                _buildMetricBox(
                  label: "Laba Bersih",
                  amount: "Rp\n14.500.000",
                  amountColor: const Color(0xFF0F5132),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // 4. Revenue Bar Chart Card (Grafik Pendapatan)
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
                  // Top Row: Title & Toggle Pill (Minggu / Bulan)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Grafik Pendapatan",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),

                      // Toggle Pill
                      Container(
                        padding: const EdgeInsets.all(3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          children: [
                            GestureDetector(
                              onTap: () {
                                setState(() {
                                  _selectedChartTab = "Minggu";
                                });
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                decoration: BoxDecoration(
                                  color: _selectedChartTab == "Minggu" ? Colors.white : Colors.transparent,
                                  borderRadius: BorderRadius.circular(14),
                                  boxShadow: _selectedChartTab == "Minggu"
                                      ? [
                                          BoxShadow(
                                            color: Colors.black.withValues(alpha: 0.05),
                                            blurRadius: 4,
                                          ),
                                        ]
                                      : null,
                                ),
                                child: Text(
                                  "Minggu",
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    color: _selectedChartTab == "Minggu" ? const Color(0xFF0F172A) : const Color(0xFF64748B),
                                  ),
                                ),
                              ),
                            ),
                            GestureDetector(
                              onTap: () {
                                setState(() {
                                  _selectedChartTab = "Bulan";
                                });
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                decoration: BoxDecoration(
                                  color: _selectedChartTab == "Bulan" ? Colors.white : Colors.transparent,
                                  borderRadius: BorderRadius.circular(14),
                                  boxShadow: _selectedChartTab == "Bulan"
                                      ? [
                                          BoxShadow(
                                            color: Colors.black.withValues(alpha: 0.05),
                                            blurRadius: 4,
                                          ),
                                        ]
                                      : null,
                                ),
                                child: Text(
                                  "Bulan",
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    color: _selectedChartTab == "Bulan" ? const Color(0xFF0F172A) : const Color(0xFF64748B),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Vertical Bar Chart
                  SizedBox(
                    height: 200,
                    child: CustomPaint(
                      size: Size.infinite,
                      painter: RevenueBarChartPainter(),
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

  Widget _buildMetricBox({
    required String label,
    required String amount,
    required Color amountColor,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
        ),
        child: Column(
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 11.5,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              amount,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.w900,
                color: amountColor,
                height: 1.15,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Custom Painter for Rounded Vertical Bar Chart
class RevenueBarChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final linePaint = Paint()
      ..color = const Color(0xFFF1F5F9)
      ..strokeWidth = 1;

    final barPaint = Paint()
      ..color = const Color(0xFF0F5132)
      ..style = PaintingStyle.fill;

    // Y Axis Labels (50, 30, 10)
    final yLabels = ["50", "30", "10"];
    final double stepY = (size.height - 30) / 2;

    for (int i = 0; i < 3; i++) {
      double y = i * stepY;
      canvas.drawLine(Offset(25, y), Offset(size.width, y), linePaint);

      final textSpan = TextSpan(
        text: yLabels[i],
        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.w500),
      );
      final tp = TextPainter(text: textSpan, textDirection: TextDirection.ltr);
      tp.layout();
      tp.paint(canvas, Offset(0, y - 6));
    }

    // X Axis Dates & Bar Heights
    final dates = ["1", "5", "10", "15", "20", "25", "30"];
    final barValues = [0.3, 0.55, 0.72, 0.45, 0.62, 0.90, 0.58]; // Normalized heights [0..1]

    final double startX = 35;
    final double availWidth = size.width - startX;
    const double barWidth = 24;
    final double stepX = availWidth / dates.length;

    for (int i = 0; i < dates.length; i++) {
      double centerX = startX + (i * stepX) + (stepX / 2);
      double barHeight = (size.height - 30) * barValues[i];
      double topY = (size.height - 30) - barHeight;

      // Draw Rounded Bar (Top Caps Rounded)
      final RRect barRect = RRect.fromRectAndCorners(
        Rect.fromLTRB(centerX - (barWidth / 2), topY, centerX + (barWidth / 2), size.height - 30),
        topLeft: const Radius.circular(12),
        topRight: const Radius.circular(12),
      );
      canvas.drawRRect(barRect, barPaint);

      // Draw X Axis Label
      final textSpan = TextSpan(
        text: dates[i],
        style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11, fontWeight: FontWeight.w500),
      );
      final tp = TextPainter(text: textSpan, textDirection: TextDirection.ltr);
      tp.layout();
      tp.paint(canvas, Offset(centerX - (tp.width / 2), size.height - 18));
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
