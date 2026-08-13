import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/mock_data.dart';
import 'laundry_detail_view.dart';

class LaundryView extends StatelessWidget {
  const LaundryView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Layanan Laundry Kilat"),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: MockData.laundries.length,
        itemBuilder: (context, index) {
          final laundry = MockData.laundries[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.network(
                    laundry.img,
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        width: 80,
                        height: 80,
                        color: Colors.grey.shade200,
                        child: const Icon(Icons.dry_cleaning, color: Colors.grey),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        laundry.name,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      Text(
                        laundry.address,
                        style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.primaryLight,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              laundry.type,
                              style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            "Rp ${laundry.price} / kg",
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => LaundryDetailView(laundry: laundry),
                      ),
                    );
                  },
                  child: const Text("Jemput"),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
