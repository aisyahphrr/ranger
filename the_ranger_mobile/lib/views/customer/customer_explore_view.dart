import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../core/constants/mock_data.dart';

class CustomerExploreView extends StatefulWidget {
  const CustomerExploreView({super.key});

  @override
  State<CustomerExploreView> createState() => _CustomerExploreViewState();
}

class _CustomerExploreViewState extends State<CustomerExploreView> {
  String _selectedCat = "Semua";
  final List<String> _categories = ["Semua", "Makanan", "Fashion", "Minuman", "Kesehatan", "Kerajinan"];

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedCat == "Semua"
        ? MockData.products
        : MockData.products.where((p) => p.cat == _selectedCat).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text("Jelajah Produk & UMKM"),
      ),
      body: Column(
        children: [
          // Search & Filter Category Pills
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: "Cari keripik, batik, kopi...",
                prefixIcon: const Icon(LucideIcons.search, color: AppColors.textMuted),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
              ),
            ),
          ),
          SizedBox(
            height: 38,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                final cat = _categories[index];
                final active = cat == _selectedCat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(cat),
                    selected: active,
                    selectedColor: AppColors.primary,
                    labelStyle: TextStyle(
                      color: active ? Colors.white : AppColors.textPrimary,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                    backgroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    onSelected: (selected) {
                      setState(() => _selectedCat = cat);
                    },
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),

          // Grid View
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final p = filtered[index];
                return Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                        child: Image.network(
                          p.img,
                          height: 110,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(height: 110, color: Colors.grey.shade200),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(p.store, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                            const SizedBox(height: 2),
                            Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13), maxLines: 1),
                            const SizedBox(height: 4),
                            Text(p.formattedPrice, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 13)),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
