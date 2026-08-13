import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/mock_data.dart';
import 'kos_detail_view.dart';

class KosView extends StatelessWidget {
  const KosView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Info Kos & Penginapan"),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: MockData.kosList.length,
        itemBuilder: (context, index) {
          final kos = MockData.kosList[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  child: Image.network(
                    kos.img,
                    height: 150,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        height: 150,
                        color: Colors.grey.shade200,
                        child: const Icon(Icons.home, color: Colors.grey),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            kos.name,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: kos.type == "Putri"
                                  ? Colors.pink.shade50
                                  : kos.type == "Putra"
                                      ? Colors.blue.shade50
                                      : Colors.purple.shade50,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              kos.type,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: kos.type == "Putri"
                                    ? Colors.pink
                                    : kos.type == "Putra"
                                        ? Colors.blue
                                        : Colors.purple,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        kos.address,
                        style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 6,
                        children: kos.facilities.map((f) {
                          return Chip(
                            label: Text(f, style: const TextStyle(fontSize: 11)),
                            visualDensity: VisualDensity.compact,
                            backgroundColor: AppColors.background,
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "Rp ${kos.price} / bulan",
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.primary),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => KosDetailView(kos: kos),
                                ),
                              );
                            },
                            child: const Text("Tanya Kos"),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
