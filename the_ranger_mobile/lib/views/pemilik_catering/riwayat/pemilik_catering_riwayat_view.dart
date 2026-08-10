import 'package:flutter/material.dart';

import '../../../../core/theme/app_theme.dart';

class PemilikCateringRiwayatView extends StatefulWidget {
  const PemilikCateringRiwayatView({super.key});

  @override
  State<PemilikCateringRiwayatView> createState() =>
      _PemilikCateringRiwayatViewState();
}

class _PemilikCateringRiwayatViewState
    extends State<PemilikCateringRiwayatView> {
  String _filter = 'Semua';

  final _history = const [
    (
      'CAT-2401',
      'Deni Kurniawan',
      'Box Nasi Timbel Komplit (10x)',
      250000,
      'Hari ini, 08:30',
      'Selesai'
    ),
    (
      'CAT-2399',
      'Ayu Lestari',
      'Nasi Tumpeng Mini (2x) & Es Jeruk (20x)',
      460000,
      'Kemarin, 16:10',
      'Selesai'
    ),
    (
      'CAT-2394',
      'Rizky Maulana',
      'Box Ayam Bakar Madu (30x)',
      840000,
      '05 Agu, 11:30',
      'Dibatalkan'
    )
  ];

  @override
  Widget build(BuildContext context) {
    final visible = _history.where((item) => _filter == 'Semua' || item.$6 == _filter);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
        children: [
          const Text(
            'Riwayat Transaksi',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 4),
          const Text(
            'Temukan pesanan catering selesai dan dibatalkan.',
            style: TextStyle(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            children: ['Semua', 'Selesai', 'Dibatalkan'].map((filter) {
              final isSelected = _filter == filter;
              return ChoiceChip(
                label: Text(filter),
                selected: isSelected,
                selectedColor: AppColors.primary,
                backgroundColor: Colors.white,
                side: BorderSide(
                  color: isSelected ? AppColors.primary : AppColors.border,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : AppColors.textPrimary,
                  fontWeight: FontWeight.w700,
                  fontSize: 11,
                ),
                showCheckmark: false,
                onSelected: (_) => setState(() => _filter = filter),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),
          if (visible.isEmpty)
            _buildEmptyState()
          else
            ...visible.map((item) => _historyCard(item)),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 42),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: const Column(
        children: [
          Icon(Icons.receipt_long_outlined,
              size: 42, color: AppColors.textMuted),
          SizedBox(height: 12),
          Text(
            'Tidak ada riwayat',
            style: TextStyle(fontWeight: FontWeight.w800),
          ),
          SizedBox(height: 4),
          Text(
            'Belum ada transaksi dengan status ini.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _historyCard((String, String, String, int, String, String) item) {
    final canceled = item.$6 == 'Dibatalkan';
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  '#${item.$1}',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: (canceled ? Colors.red : Colors.green).withValues(alpha: .12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  item.$6,
                  style: TextStyle(
                    color: canceled ? Colors.red : Colors.green,
                    fontWeight: FontWeight.bold,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            item.$2,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 2),
          Text(
            item.$3,
            style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Text(
                'Rp ${_format(item.$4)}',
                style: const TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const Spacer(),
              Text(
                item.$5,
                style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _format(int value) => value
      .toString()
      .replaceAllMapped(RegExp(r'(?=(\d{3})+(?!\d))'), (_) => '.');
}
