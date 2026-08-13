import 'dart:async';
import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class LaundryTrackingView extends StatefulWidget {
  final String laundryName;

  const LaundryTrackingView({
    super.key,
    this.laundryName = "Pesanan Laundry Express Pak Dedi",
  });

  @override
  State<LaundryTrackingView> createState() => _LaundryTrackingViewState();
}

class _LaundryTrackingViewState extends State<LaundryTrackingView> {
  int _currentStep = 2; // Step 2: Proses Pencucian (as shown in reference screenshot)
  Timer? _stepTimer;

  @override
  void initState() {
    super.initState();
    // Live Demo Simulation: Slowly advances step for live feel
    _stepTimer = Timer.periodic(const Duration(seconds: 8), (timer) {
      if (_currentStep < 5) {
        setState(() {
          _currentStep++;
        });
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _stepTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF1E293B)),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: const Text(
          "Tracking Pesanan",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
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
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 16,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header Title
                    Center(
                      child: Text(
                        widget.laundryName,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Center(
                      child: Text(
                        "Estimasi Selesai: Besok, 10:00",
                        style: TextStyle(
                          fontSize: 13,
                          color: Color(0xFF64748B),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Step 1: Menunggu Driver
                    _buildTimelineStep(
                      stepNumber: 1,
                      title: "Menunggu Driver",
                      subtitle: "Driver sedang menuju ke lokasi Anda",
                      isLast: false,
                    ),

                    // Step 2: Proses Pencucian
                    _buildTimelineStep(
                      stepNumber: 2,
                      title: "Proses Pencucian",
                      subtitle: "Pakaian Anda sedang dicuci dengan sepenuh hati",
                      isLast: false,
                      activeChild: Container(
                        margin: const EdgeInsets.only(top: 10, bottom: 4),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEDFBF4),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFDCFCE7), width: 1),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: const BoxDecoration(
                                color: Color(0xFFDCFCE7),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                LucideIcons.wind,
                                size: 18,
                                color: Color(0xFF15803D),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text(
                                  "Status Aktif",
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF15803D),
                                  ),
                                ),
                                SizedBox(height: 1),
                                Text(
                                  "Pembaruan otomatis...",
                                  style: TextStyle(
                                    fontSize: 10.5,
                                    color: Color(0xFF475569),
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),

                    // Step 3: Selesai Dicuci
                    _buildTimelineStep(
                      stepNumber: 3,
                      title: "Selesai Dicuci",
                      subtitle: "Menunggu kurir untuk pengantaran",
                      isLast: false,
                    ),

                    // Step 4: Pengantaran
                    _buildTimelineStep(
                      stepNumber: 4,
                      title: "Pengantaran",
                      subtitle: "Driver sedang menuju ke lokasi Anda",
                      isLast: false,
                    ),

                    // Step 5: Pesanan Selesai
                    _buildTimelineStep(
                      stepNumber: 5,
                      title: "Pesanan Selesai",
                      subtitle: "Pakaian bersih siap digunakan!",
                      isLast: true,
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Bottom Bar: Kembali ke Beranda / Home Button
          Container(
            padding: const EdgeInsets.all(16),
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
            child: SafeArea(
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    // Navigate back to home / root screen
                    Navigator.popUntil(context, (route) => route.isFirst);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF15803D),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(LucideIcons.home, size: 20),
                      SizedBox(width: 8),
                      Text(
                        "Kembali ke Beranda",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineStep({
    required int stepNumber,
    required String title,
    required String subtitle,
    required bool isLast,
    Widget? activeChild,
  }) {
    final bool isCompleted = stepNumber < _currentStep;
    final bool isActive = stepNumber == _currentStep;

    Color iconBgColor;
    Widget iconWidget;
    Color titleColor;
    Color subtitleColor;

    if (isCompleted) {
      iconBgColor = const Color(0xFF16A34A);
      iconWidget = const Icon(Icons.check_rounded, color: Colors.white, size: 18);
      titleColor = const Color(0xFF334155);
      subtitleColor = const Color(0xFF64748B);
    } else if (isActive) {
      iconBgColor = const Color(0xFF15803D);
      iconWidget = Text(
        "$stepNumber",
        style: const TextStyle(
          color: Colors.white,
          fontSize: 14,
          fontWeight: FontWeight.w800,
        ),
      );
      titleColor = const Color(0xFF15803D);
      subtitleColor = const Color(0xFF475569);
    } else {
      iconBgColor = const Color(0xFFE2E8F0);
      iconWidget = Text(
        "$stepNumber",
        style: const TextStyle(
          color: Colors.white,
          fontSize: 14,
          fontWeight: FontWeight.w800,
        ),
      );
      titleColor = const Color(0xFF94A3B8);
      subtitleColor = const Color(0xFFCBD5E1);
    }

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left Column (Icon Circle & Connecting Line)
          Column(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: iconBgColor,
                  shape: BoxShape.circle,
                ),
                child: Center(child: iconWidget),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    color: isCompleted ? const Color(0xFF16A34A) : const Color(0xFFE2E8F0),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14),

          // Right Column (Title, Subtitle & optional active child)
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: isActive ? FontWeight.w800 : FontWeight.w700,
                      color: titleColor,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: subtitleColor,
                      fontWeight: FontWeight.w400,
                      height: 1.3,
                    ),
                  ),
                  if (isActive && activeChild != null) activeChild,
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
