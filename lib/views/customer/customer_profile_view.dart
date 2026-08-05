import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/app_provider.dart';

class CustomerProfileView extends StatelessWidget {
  const CustomerProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Profil Saya"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // User Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: AppColors.primary,
                  child: Text("BS", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
                ),
                const SizedBox(width: 14),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Budi Santoso", style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                      SizedBox(height: 2),
                      Text("+62 812-3456-7890", style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                      SizedBox(height: 4),
                      Text("Kamojang, Kab. Garut", style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 11)),
                    ],
                  ),
                ),
                IconButton(icon: const Icon(LucideIcons.edit3, size: 18), onPressed: () {}),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Switch Role Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.orange.shade50,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.accent.withValues(alpha: 0.3)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(LucideIcons.bike, color: AppColors.accent, size: 24),
                    SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("Beralih ke Mode Driver", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        Text("Terima orderan & tambah penghasilan", style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                      ],
                    ),
                  ],
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.accent,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  ),
                  onPressed: () => appState.setRole(UserRole.driver),
                  child: const Text("Beralih", style: TextStyle(fontSize: 12)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Menu List
          const Text("Pengaturan & Akun", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 10),
          _ProfileMenuItem(icon: LucideIcons.wallet, label: "Dompet & Poin Ranger", subtitle: "Rp 150.000 (1.250 Poin)"),
          _ProfileMenuItem(icon: LucideIcons.mapPin, label: "Alamat Saya", subtitle: "Jl. Geothermal No. 12, Kamojang"),
          _ProfileMenuItem(icon: LucideIcons.heart, label: "Favorit Saya", subtitle: "2 Produk disimpan"),
          _ProfileMenuItem(icon: LucideIcons.shield, label: "Keamanan Akun", subtitle: "PIN & Autentikasi"),
          _ProfileMenuItem(icon: LucideIcons.helpCircle, label: "Pusat Bantuan", subtitle: "FAQ & Customer Care"),

          const SizedBox(height: 20),
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.red,
              side: const BorderSide(color: Colors.red),
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            onPressed: () => appState.navigate(AppScreen.login),
            icon: const Icon(LucideIcons.logOut, size: 16),
            label: const Text("Keluar dari Akun"),
          ),
        ],
      ),
    );
  }
}

class _ProfileMenuItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;

  const _ProfileMenuItem({required this.icon, required this.label, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppColors.primary, size: 20),
        title: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text(subtitle, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
        trailing: const Icon(LucideIcons.chevronRight, size: 16, color: AppColors.textMuted),
        onTap: () {},
      ),
    );
  }
}
