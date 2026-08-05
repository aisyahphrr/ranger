import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

class MitraMarketplaceDashboardView extends StatefulWidget {
  const MitraMarketplaceDashboardView({super.key});

  @override
  State<MitraMarketplaceDashboardView> createState() => _MitraMarketplaceDashboardViewState();
}

class _MitraMarketplaceDashboardViewState extends State<MitraMarketplaceDashboardView> {
  int _selectedIndex = 0;

  final List<_BottomNavItem> _navItems = [
    _BottomNavItem(label: 'Beranda', icon: LucideIcons.home),
    _BottomNavItem(label: 'Order', icon: LucideIcons.package),
    _BottomNavItem(label: 'Riwayat', icon: LucideIcons.clock),
    _BottomNavItem(label: 'Pendapatan', icon: LucideIcons.wallet),
    _BottomNavItem(label: 'Profil', icon: LucideIcons.user),
  ];

  final List<String> _pageTitles = [
    'Beranda',
    'Pesanan',
    'Riwayat',
    'Pendapatan',
    'Profil',
  ];

  final List<String> _pageSubtitles = [
    'Kelola toko dan pesanan aktif.',
    'Cek dan proses order masuk.',
    'Riwayat transaksi harian.',
    'Pantau saldo dan pencairan.',
    'Kelola profil dan informasi toko.',
  ];

  final List<_MenuProduct> _menuProducts = [
    _MenuProduct('Nasi Timbel Komplit', 'Nasi timbel, ayam goreng, tahu, tempe, lalap, sambal', 'Rp 25.000', true),
    _MenuProduct('Ayam Bakar Madu', 'Ayam bakar bumbu madu khas Kamojang', 'Rp 28.000', true),
    _MenuProduct('Es Jeruk Peras', 'Es jeruk segar dari jeruk asli diperas langsung', 'Rp 8.000', false),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          _buildTopHeader(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 16),
                  _buildPageInfo(),
                  const SizedBox(height: 16),
                  if (_selectedIndex == 0) ...[
                    _buildStatusCard(),
                    const SizedBox(height: 18),
                    _buildGridMenu(),
                    const SizedBox(height: 18),
                    _buildActiveOrderCard(),
                    const SizedBox(height: 18),
                    _buildMenuManagementCard(),
                  ] else if (_selectedIndex == 1) ...[
                    _buildOrdersPage(),
                  ] else if (_selectedIndex == 2) ...[
                    _buildHistoryPage(),
                  ] else if (_selectedIndex == 3) ...[
                    _buildEarningsPage(),
                  ] else ...[
                    _buildProfilePage(),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildTopHeader() {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(28)),
      ),
      padding: const EdgeInsets.fromLTRB(24, 42, 24, 22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('Halo, selamat pagi', style: TextStyle(color: Colors.white70, fontSize: 14)),
                    SizedBox(height: 6),
                    Text('Pak Rahman', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800)),
                  ],
                ),
              ),
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(LucideIcons.bell, color: Colors.white, size: 22),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.12),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(LucideIcons.shoppingBag, color: Colors.white, size: 16),
                SizedBox(width: 10),
                Text('Pemilik Marketplace', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPageInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(_pageTitles[_selectedIndex], style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        Text(_pageSubtitles[_selectedIndex], style: const TextStyle(fontSize: 14, color: AppColors.textSecondary, height: 1.6)),
      ],
    );
  }

  Widget _buildStatusCard() {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF0D5C36), Color(0xFF1B7A4E)]),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 20, offset: const Offset(0, 10)),
        ],
      ),
      padding: const EdgeInsets.all(22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('STATUS OUTLET ANDA', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    SizedBox(height: 12),
                    Text('Toko Buka (Menerima Order)', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.redAccent,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                ),
                child: const Text('Tutup Outlet', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 22),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMetricItem('Rating Toko', '4.9 ?'),
              _buildMetricItem('Penyelesaian', '99.4%'),
              _buildMetricItem('Kecepatan', '11 mnt'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricItem(String title, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: Colors.white70, fontSize: 12)),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14)),
        ],
      ),
    );
  }

  Widget _buildGridMenu() {
    final items = [
      _DashboardAction('Riwayat Transaksi', LucideIcons.barChart3),
      _DashboardAction('Kelola Promo', LucideIcons.percent),
      _DashboardAction('Pengaturan Toko', LucideIcons.settings),
      _DashboardAction('Tarik Saldo', LucideIcons.wallet),
      _DashboardAction('Jam Operasional', LucideIcons.clock),
      _DashboardAction('Ulasan Toko', LucideIcons.messageCircle),
    ];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 18, offset: const Offset(0, 10)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Pusat Kelola Outlet (GoBiz Hub)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
          const SizedBox(height: 16),
          GridView.builder(
            padding: EdgeInsets.zero,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: items.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.92,
            ),
            itemBuilder: (context, index) {
              final item = items[index];
              return _buildGridItem(item);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildGridItem(_DashboardAction item) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: () {},
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(item.icon, color: AppColors.primary, size: 20),
              ),
              const SizedBox(height: 10),
              Text(item.label, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActiveOrderCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10)),
        ],
        border: Border.all(color: AppColors.primary.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.14),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(LucideIcons.shoppingBag, color: AppColors.primary, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('Order #MKT-802', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                    SizedBox(height: 6),
                    Text('Bambang Wijaya · Nasi Timbel Komplit (2x)', style: TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.6)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.14),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Text('Bayar Lunas', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(height: 1),
          const SizedBox(height: 16),
          const Text('Total Transaksi', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          const SizedBox(height: 4),
          const Text('Rp 50.000', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: const Text('Terima & Siapkan Makanan', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuManagementCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 18, offset: const Offset(0, 10)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Kelola Menu Outlet (GoBiz)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
              const Text('Live Sync', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700)),
            ],
          ),
          const SizedBox(height: 16),
          Column(
            children: _menuProducts.map((item) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: _buildMenuProductItem(item),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuProductItem(_MenuProduct product) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(product.name, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: product.available ? AppColors.primary.withOpacity(0.12) : Colors.red.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(product.available ? 'Tersedia' : 'Habis', style: TextStyle(color: product.available ? AppColors.primary : Colors.redAccent, fontWeight: FontWeight.w700, fontSize: 12)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(product.description, style: const TextStyle(color: AppColors.textSecondary, height: 1.5, fontSize: 13)),
                const SizedBox(height: 10),
                Text(product.price, style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
              ],
            ),
          ),
          Switch(
            value: product.available,
            onChanged: (value) {
              setState(() {
                product.available = value;
              });
            },
            activeColor: AppColors.primary,
            activeTrackColor: AppColors.primary.withOpacity(0.24),
          ),
        ],
      ),
    );
  }

  Widget _buildOrdersPage() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildSectionCard('Pesanan Masuk', 'Lihat dan proses order yang masuk ke toko Anda.'),
        const SizedBox(height: 18),
        _buildOrderCard('Order #MKT-812', 'Bambang Wijaya • Nasi Timbel Komplit', 'Diproses', AppColors.primary),
        _buildOrderCard('Order #MKT-809', 'Siti • Es Jeruk Peras', 'Siap Antarkan', Colors.green),
      ],
    );
  }

  Widget _buildHistoryPage() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildSectionCard('Riwayat Order', 'Transaksi selesai dan ringkasan pendapatan.'),
        const SizedBox(height: 18),
        _buildHistoryItem('Order #MKT-790', 'Rp 48.000 • Selesai', '12 Apr 2026'),
        _buildHistoryItem('Order #MKT-784', 'Rp 63.000 • Selesai', '11 Apr 2026'),
      ],
    );
  }

  Widget _buildEarningsPage() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildSectionCard('Pendapatan', 'Saldo terbaru dan riwayat pencairan.'),
        const SizedBox(height: 18),
        _buildStatBox('Saldo Tersedia', 'Rp 5.420.000', Colors.green),
        const SizedBox(height: 14),
        _buildStatBox('Hari Ini', 'Rp 320.000', AppColors.primary),
      ],
    );
  }

  Widget _buildProfilePage() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildSectionCard('Profil Mitra', 'Perbarui data toko dan informasi akun.'),
        const SizedBox(height: 18),
        _buildProfileInfoCard('Nama Toko', 'Warung Kuliner Pak Rahman'),
        const SizedBox(height: 12),
        _buildProfileInfoCard('Alamat', 'Jl. Raya Bogor No. 129'),
        const SizedBox(height: 12),
        _buildProfileInfoCard('Jenis Layanan', 'Marketplace Makanan'),
      ],
    );
  }

  Widget _buildSectionCard(String title, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 16, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
          const SizedBox(height: 8),
          Text(subtitle, style: const TextStyle(color: AppColors.textSecondary, fontSize: 14, height: 1.6)),
        ],
      ),
    );
  }

  Widget _buildBottomNav() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFF1F5F9), width: 1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: _navItems.map((item) {
          final index = _navItems.indexOf(item);
          final active = index == _selectedIndex;
          return GestureDetector(
            onTap: () => setState(() => _selectedIndex = index),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: active ? AppColors.primary.withOpacity(0.14) : Colors.transparent,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(item.icon, size: 22, color: active ? AppColors.primary : AppColors.textMuted),
                ),
                const SizedBox(height: 6),
                Text(item.label, style: TextStyle(color: active ? AppColors.primary : AppColors.textMuted, fontSize: 12)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildOrderStatusChips() {
    final statuses = ['Baru', 'Diproses', 'Siap Antar'];
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: statuses.map((status) {
        return Chip(
          label: Text(status, style: const TextStyle(fontWeight: FontWeight.w700)),
          backgroundColor: status == 'Baru' ? AppColors.primary.withOpacity(0.12) : Colors.white,
          side: BorderSide(color: status == 'Baru' ? AppColors.primary : AppColors.border),
        );
      }).toList(),
    );
  }

  Widget _buildOrderCard(String title, String subtitle, String status, Color statusColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 18, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Text(status, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(subtitle, style: const TextStyle(color: AppColors.textSecondary, height: 1.5)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            child: const Text('Lihat Detail', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryItem(String title, String subtitle, String date) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 16, offset: const Offset(0, 8)),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
              const SizedBox(height: 6),
              Text(subtitle, style: const TextStyle(color: AppColors.textSecondary)),
            ],
          ),
          Text(date, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildStatBox(String label, String value, Color color) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 18, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: 10),
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: color)),
        ],
      ),
    );
  }

  Widget _buildProfileInfoCard(String label, String value) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 18, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        ],
      ),
    );
  }
}

class _DashboardAction {
  final String label;
  final IconData icon;

  _DashboardAction(this.label, this.icon);
}

class _MenuProduct {
  final String name;
  final String description;
  final String price;
  bool available;

  _MenuProduct(this.name, this.description, this.price, this.available);
}

class _BottomNavItem {
  final String label;
  final IconData icon;

  _BottomNavItem({required this.label, required this.icon});
}
