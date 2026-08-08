import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../providers/app_provider.dart';

class PemilikMarketplaceProfileView extends StatelessWidget {
  const PemilikMarketplaceProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
        children: [
          const Text('Profil Marketplace', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(22), border: Border.all(color: AppColors.border)),
            child: Row(children: [
              const CircleAvatar(radius: 30, backgroundColor: Color(0xFFE5F3EB), child: Icon(LucideIcons.store, color: AppColors.primary, size: 28)),
              const SizedBox(width: 14),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(provider.marketplaceOwnerName, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
                const SizedBox(height: 3),
                Text(provider.marketplaceStoreName, style: const TextStyle(color: AppColors.textSecondary)),
                const SizedBox(height: 6),
                const _VerifiedLabel(),
              ])),
              const Icon(LucideIcons.chevronRight, color: AppColors.textMuted),
            ]),
          ),
          const SizedBox(height: 18),
          _ProfileGroup(title: 'Informasi marketplace', items: [
            (LucideIcons.store, 'Informasi toko', provider.marketplaceAddress.isEmpty ? 'Alamat belum diisi' : provider.marketplaceAddress),
            (LucideIcons.fileCheck2, 'Status verifikasi', 'KTP dan data usaha terverifikasi'),
          ]),
          const SizedBox(height: 14),
          _ProfileGroup(title: 'Akun', items: [
            (LucideIcons.phone, 'Nomor HP', provider.marketplacePhone),
            (LucideIcons.settings, 'Pengaturan akun', 'Notifikasi dan keamanan'),
          ]),
          const SizedBox(height: 18),
          OutlinedButton.icon(
            onPressed: () async {
              await context.read<AppProvider>().logoutMarketplace();
              if (context.mounted) context.read<AppProvider>().navigate(AppScreen.login);
            },
            icon: const Icon(LucideIcons.logOut),
            label: const Text('Logout'),
            style: OutlinedButton.styleFrom(foregroundColor: Colors.red, minimumSize: const Size.fromHeight(50), side: const BorderSide(color: Color(0xFFFFD8D8))),
          ),
        ],
      ),
    );
  }
}

class _VerifiedLabel extends StatelessWidget {
  const _VerifiedLabel();
  @override
  Widget build(BuildContext context) => Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: const Color(0xFFE5F3EB), borderRadius: BorderRadius.circular(10)), child: const Text('Terverifikasi', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primary)));
}

class _ProfileGroup extends StatelessWidget {
  const _ProfileGroup({required this.title, required this.items});
  final String title;
  final List<(IconData, String, String)> items;
  @override
  Widget build(BuildContext context) => Container(decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.border)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Padding(padding: const EdgeInsets.fromLTRB(16, 16, 16, 8), child: Text(title, style: const TextStyle(fontWeight: FontWeight.w800))), ...items.map((item) => ListTile(leading: Icon(item.$1, color: AppColors.primary), title: Text(item.$2, style: const TextStyle(fontWeight: FontWeight.w700)), subtitle: Text(item.$3), trailing: const Icon(LucideIcons.chevronRight, size: 18, color: AppColors.textMuted), onTap: () {}))]));
}
