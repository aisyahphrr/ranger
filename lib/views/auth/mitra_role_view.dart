import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/app_provider.dart';

class MitraRoleView extends StatefulWidget {
  const MitraRoleView({super.key});

  @override
  State<MitraRoleView> createState() => _MitraRoleViewState();
}

class _MitraRoleViewState extends State<MitraRoleView> {
  String? _selectedRole;

  final List<_MitraRoleOption> _options = [
    _MitraRoleOption(
      title: 'Kurir / Driver',
      subtitle: 'Antar pesanan pelanggan dan bantu kelola pengiriman dalam komunitas.',
      icon: LucideIcons.bike,
      iconColor: Colors.deepOrange,
      iconBg: Colors.deepOrange.shade50,
      screen: AppScreen.dHome,
      roleType: _MitraRoleType.driver,
    ),
    _MitraRoleOption(
      title: 'Pemilik Kos',
      subtitle: 'Kelola kamar kos dan sediakan fasilitas terbaik untuk penghuni.',
      icon: LucideIcons.home,
      iconColor: Colors.purple,
      iconBg: Colors.purple.shade50,
      screen: AppScreen.cKos,
      roleType: _MitraRoleType.kos,
    ),
    _MitraRoleOption(
      title: 'Pemilik Laundry',
      subtitle: 'Kelola layanan laundry, terima pesanan, dan atur jadwal jemput.',
      icon: LucideIcons.shirt,
      iconColor: Colors.blue,
      iconBg: Colors.blue.shade50,
      screen: AppScreen.cLaundry,
      roleType: _MitraRoleType.laundry,
    ),
    _MitraRoleOption(
      title: 'Pemilik Catering',
      subtitle: 'Atur menu catering, terima pesanan katering harian, dan kelola dapur Anda.',
      icon: LucideIcons.coffee,
      iconColor: Colors.amber.shade800,
      iconBg: Colors.amber.shade50,
      screen: AppScreen.cCatering,
      roleType: _MitraRoleType.catering,
    ),
    _MitraRoleOption(
      title: 'Pemilik Marketplace',
      subtitle: 'Kelola produk UMKM lokal dan terima pesanan marketplace Anda.',
      icon: LucideIcons.store,
      iconColor: Colors.green.shade700,
      iconBg: Colors.green.shade50,
      screen: AppScreen.mitraMarketplaceRegistration,
      roleType: _MitraRoleType.marketplace,
    ),
  ];

  void _onContinue() {
    if (_selectedRole == null) return;
    final selectedOption = _options.firstWhere((option) => option.title == _selectedRole);
    final provider = Provider.of<AppProvider>(context, listen: false);

    if (selectedOption.roleType == _MitraRoleType.driver) {
      provider.setRole(UserRole.driver);
    } else {
      provider.navigate(selectedOption.screen);
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context, listen: false);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 500),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
              child: Column(
                children: [
                  Row(
                    children: [
                      IconButton(
                        onPressed: () => provider.navigate(AppScreen.role),
                        icon: const Icon(LucideIcons.arrowLeft, color: AppColors.textPrimary),
                        style: IconButton.styleFrom(
                          backgroundColor: Colors.white,
                          shadowColor: Colors.black.withValues(alpha: 0.05),
                          elevation: 2,
                          padding: const EdgeInsets.all(12),
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Daftar Mitra',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Container(
                    height: 4,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: FractionallySizedBox(
                      alignment: Alignment.centerLeft,
                      widthFactor: 1,
                      child: Container(
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Pilih Peran Anda',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Anda bisa memilih lebih dari satu peran. Dashboard akan menyesuaikan dengan pilihan Anda.',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                        height: 1.6,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Expanded(
                    child: ListView.separated(
                      padding: EdgeInsets.zero,
                      itemCount: _options.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 14),
                      itemBuilder: (context, index) {
                        final option = _options[index];
                        final selected = option.title == _selectedRole;
                        return InkWell(
                          onTap: () {
                            setState(() {
                              _selectedRole = option.title;
                            });
                          },
                          borderRadius: BorderRadius.circular(18),
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(
                                color: selected ? AppColors.primary : AppColors.border,
                                width: selected ? 2 : 1,
                              ),
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                            child: Row(
                              children: [
                                Container(
                                  width: 46,
                                  height: 46,
                                  decoration: BoxDecoration(
                                    color: option.iconBg,
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                  child: Icon(option.icon, color: option.iconColor, size: 24),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        option.title,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.textPrimary,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        option.subtitle,
                                        style: const TextStyle(
                                          fontSize: 13,
                                          color: AppColors.textSecondary,
                                          height: 1.4,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Container(
                                  width: 22,
                                  height: 22,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: selected ? AppColors.primary : AppColors.border,
                                      width: 2,
                                    ),
                                  ),
                                  child: Center(
                                    child: Container(
                                      width: 10,
                                      height: 10,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: selected ? AppColors.primary : Colors.transparent,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _selectedRole == null ? null : _onContinue,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: _selectedRole == null ? AppColors.border : AppColors.primary,
                      ),
                      child: Text(
                        'Lanjutkan',
                        style: TextStyle(
                          color: _selectedRole == null ? AppColors.textSecondary : Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

enum _MitraRoleType {
  driver,
  kos,
  laundry,
  catering,
  marketplace,
}

class _MitraRoleOption {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  final Color iconBg;
  final AppScreen screen;
  final _MitraRoleType roleType;

  _MitraRoleOption({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
    required this.iconBg,
    required this.screen,
    required this.roleType,
  });
}
