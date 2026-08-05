import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/app_provider.dart';
import '../../core/constants/mock_data.dart';

class DriverHomeView extends StatelessWidget {
  const DriverHomeView({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Mode Driver Ranger"),
        actions: [
          Switch(
            value: appState.isDriverOnline,
            activeTrackColor: AppColors.primary,
            onChanged: (val) {
              appState.toggleDriverOnline();
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Status Banner ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: appState.isDriverOnline ? AppColors.primaryLight : Colors.red.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: appState.isDriverOnline ? AppColors.primary : Colors.red,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    appState.isDriverOnline ? LucideIcons.checkCircle : LucideIcons.alertCircle,
                    color: appState.isDriverOnline ? AppColors.primary : Colors.red,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      appState.isDriverOnline
                          ? "Status Online: Siap menerima orderan di sekitar Kamojang"
                          : "Status Offline: Kamu sedang istirahat",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: appState.isDriverOnline ? AppColors.primaryDark : Colors.red.shade900,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // ── Earnings Today ──
            const Text(
              "Ringkasan Pendapatan Hari Ini",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Card(
              elevation: 1,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _Metric(label: "Pendapatan", value: "Rp 145.000", color: AppColors.primary),
                    const SizedBox(height: 30, child: VerticalDivider()),
                    _Metric(label: "Order Selesai", value: "8 Order", color: Colors.blue),
                    const SizedBox(height: 30, child: VerticalDivider()),
                    _Metric(label: "Rating", value: "4.9 ⭐", color: Colors.amber.shade800),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // ── Incoming Orders List ──
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Orderan Masuk",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Text(
                  "${MockData.driverOrders.length} Order Aktif",
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: MockData.driverOrders.length,
              itemBuilder: (context, index) {
                final order = MockData.driverOrders[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.primaryLight,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                order.type,
                                style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 12),
                              ),
                            ),
                            Text(
                              "Rp ${order.pay}",
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primary),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            const Icon(LucideIcons.mapPin, size: 16, color: Colors.green),
                            const SizedBox(width: 6),
                            Expanded(child: Text("Jemput: ${order.from}", style: const TextStyle(fontSize: 13))),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(LucideIcons.navigation2, size: 16, color: Colors.red),
                            const SizedBox(width: 6),
                            Expanded(child: Text("Antar: ${order.to}", style: const TextStyle(fontSize: 13))),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                                onPressed: () {},
                                child: const Text("Tolak"),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text("Orderan ${order.id} diterima!")),
                                  );
                                },
                                child: const Text("Terima Order"),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _Metric({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: color)),
      ],
    );
  }
}
