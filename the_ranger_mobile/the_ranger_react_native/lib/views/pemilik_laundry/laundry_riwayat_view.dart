import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class LaundryRiwayatView extends StatefulWidget {
  const LaundryRiwayatView({super.key});

  @override
  State<LaundryRiwayatView> createState() => _LaundryRiwayatViewState();
}

class _LaundryRiwayatViewState extends State<LaundryRiwayatView> {
  String _filter = 'Semua';

  final _history = const [
    (
      'LND-921',
      'Rudi Hermawan',
      'Cuci Kering + Setrika • 4 kg',
      32000,
      'Hari ini, 09:15',
      'Selesai'
    ),
    (
      'LND-920',
      'Aulia Putri',
      'Cuci Selimut Tebal • 2 pcs',
      50000,
      'Kemarin, 14:30',
      'Selesai'
    ),
    (
      'LND-918',
      'Dedy Kurnia',
      'Express 3 Jam • 3 kg',
      45000,
      '08 Agu, 10:00',
      'Selesai'
    ),
    (
      'LND-917',
      'Indah Permata',
      'Cuci Sepatu Premium • 1 pasang',
      35000,
      '06 Agu, 16:45',
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
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Temukan pesanan laundry selesai dan dibatalkan.',
            style: TextStyle(
              color: Color(0xFF64748B),
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            children: ['Semua', 'Selesai', 'Dibatalkan'].map((filter) {
              final isSelected = _filter == filter;
              return ChoiceChip(
                label: Text(filter),
                selected: isSelected,
                selectedColor: const Color(0xFF0F5132),
                backgroundColor: Colors.white,
                side: BorderSide(
                  color: isSelected ? const Color(0xFF0F5132) : const Color(0xFFE2E8F0),
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : const Color(0xFF475569),
                  fontWeight: FontWeight.w700,
                  fontSize: 11.5,
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
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: const Column(
        children: [
          Icon(LucideIcons.history, size: 42, color: Color(0xFF94A3B8)),
          SizedBox(height: 12),
          Text(
            'Tidak ada riwayat',
            style: TextStyle(fontWeight: FontWeight.w800),
          ),
          SizedBox(height: 4),
          Text(
            'Belum ada transaksi dengan status ini.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
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
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  '#${item.$1}',
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: canceled
                      ? const Color(0xFFFEE2E2)
                      : const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  item.$6,
                  style: TextStyle(
                    color: canceled
                        ? const Color(0xFFEF4444)
                        : const Color(0xFF15803D),
                    fontWeight: FontWeight.w800,
                    fontSize: 10,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            item.$2,
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 2),
          Text(
            item.$3,
            style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Text(
                'Rp ${_format(item.$4)}',
                style: const TextStyle(
                  color: Color(0xFF15803D),
                  fontWeight: FontWeight.w900,
                ),
              ),
              const Spacer(),
              Text(
                item.$5,
                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11),
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
