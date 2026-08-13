import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../providers/app_provider.dart';

class PemilikLaundryProfileView extends StatelessWidget {
  const PemilikLaundryProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);
    final name = appState.laundryOwnerName.isEmpty ? 'Pemilik Laundry' : appState.laundryOwnerName;
    final phone = appState.laundryPhone.isEmpty ? 'Nomor belum diatur' : appState.laundryPhone;
    final rating = appState.reviews.isEmpty
        ? '—'
        : (appState.reviews
                    .map((review) => review.rating)
                    .reduce((left, right) => left + right) /
                appState.reviews.length)
            .toStringAsFixed(1);

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: AppColors.primaryHeaderStart,
        statusBarIconBrightness: Brightness.light,
        statusBarBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: ListView(
          padding: EdgeInsets.zero,
          children: [
            _ProfileHeader(
              name: name,
              phone: phone,
              orderCount: appState.orders.length,
              wishlistCount: appState.products.where((item) => item.liked).length,
              rating: rating,
              onEditPhoto: () => _showInfo(
                context,
                'Foto Profil',
                'Penggantian foto profil akan terhubung ke storage akun mitra.',
              ),
            ),
            const SizedBox(height: 16),
            const _SectionLabel('AKUN'),
            const SizedBox(height: 7),
            _ProfileMenuGroup(
              items: [
                _ProfileMenuData(
                  label: 'Edit Profil',
                  icon: LucideIcons.edit3,
                  iconColor: AppColors.primary,
                  iconBackground: AppColors.primaryLight,
                  onTap: () => _showEditProfile(context, appState),
                ),
                _ProfileMenuData(
                  label: 'Alamat Usaha',
                  icon: LucideIcons.mapPin,
                  iconColor: const Color(0xFF1685E5),
                  iconBackground: const Color(0xFFE3F2FF),
                  onTap: () => _showEditProfile(context, appState),
                ),
                _ProfileMenuData(
                  label: 'Metode Pembayaran',
                  icon: LucideIcons.walletCards,
                  iconColor: const Color(0xFFAE35C7),
                  iconBackground: const Color(0xFFF5E4F8),
                  onTap: () => _showInfo(
                    context,
                    'Metode Pembayaran',
                    'Metode pembayaran akan mengikuti layanan pembayaran yang terhubung di checkout.',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 17),
            const _SectionLabel('LAINNYA'),
            const SizedBox(height: 7),
            _ProfileMenuGroup(
              items: [
                _ProfileMenuData(
                  label: 'Bantuan & FAQ',
                  icon: Icons.help_outline,
                  iconColor: const Color(0xFFFF9F00),
                  iconBackground: const Color(0xFFFFF5D8),
                  onTap: () => _showInfo(
                    context,
                    'Bantuan & FAQ',
                    'Pusat bantuan akan menampilkan FAQ dan kanal Mitra Care setelah service bantuan terhubung.',
                  ),
                ),
                _ProfileMenuData(
                  label: 'Privasi & Keamanan',
                  icon: LucideIcons.shield,
                  iconColor: const Color(0xFF607D8B),
                  iconBackground: const Color(0xFFE9EEF0),
                  onTap: () => _showInfo(
                    context,
                    'Privasi & Keamanan',
                    'Data profil dan riwayat mitra disimpan pada storage akun aplikasi.',
                  ),
                ),
                _ProfileMenuData(
                  label: 'Pengaturan',
                  icon: Icons.settings_outlined,
                  iconColor: const Color(0xFF78909C),
                  iconBackground: const Color(0xFFF0F2F3),
                  onTap: () => _showInfo(
                    context,
                    'Pengaturan',
                    'Pengaturan aplikasi akan tersedia setelah preferensi mitra terhubung.',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 13),
            _LogoutButton(onTap: () => _confirmLogout(context, appState)),
            const SizedBox(height: 17),
            const Center(
              child: Text(
                'Rangers App v2.0 • PGE Kamojang',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 10,
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  Future<void> _showEditProfile(BuildContext context, AppProvider appState) async {
    final nameController = TextEditingController(text: appState.laundryOwnerName);
    final addressController = TextEditingController(text: appState.laundryAddress);

    await showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Perbarui Profil'),
        content: SingleChildScrollView(
          child: Column(
            children: [
              TextField(
                controller: nameController,
                textCapitalization: TextCapitalization.words,
                decoration: const InputDecoration(labelText: 'Nama pemilik'),
              ),
              TextField(
                controller: addressController,
                decoration: const InputDecoration(labelText: 'Alamat usaha'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            onPressed: () async {
              await appState.saveCustomerProfile(
                name: nameController.text,
                address: addressController.text,
              );
              if (dialogContext.mounted) Navigator.pop(dialogContext);
            },
            child: const Text('Simpan'),
          ),
        ],
      ),
    );
    nameController.dispose();
    addressController.dispose();
  }

  Future<void> _confirmLogout(BuildContext context, AppProvider appState) async {
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Keluar dari akun?'),
        content: const Text('Sesi mitra akan dihapus dari perangkat ini.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Batal'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            child: const Text('Keluar'),
          ),
        ],
      ),
    );
    if (shouldLogout == true) {
    await appState.logoutLaundryOwner();
    // After clearing state, navigate to laundry login UI through provider
    if (context.mounted) {
      appState.navigate(AppScreen.laundryOwnerLogin);
    }
    }
  }

  void _showInfo(BuildContext context, String title, String message) {
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (_) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 16,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 13,
                height: 1.45,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Reuse the header, menu group and logout widgets from customer_profile_view for consistent UI

class _ProfileHeader extends StatelessWidget {
  final String name;
  final String phone;
  final int orderCount;
  final int wishlistCount;
  final String rating;
  final VoidCallback onEditPhoto;

  const _ProfileHeader({
    required this.name,
    required this.phone,
    required this.orderCount,
    required this.wishlistCount,
    required this.rating,
    required this.onEditPhoto,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 13, 16, 17),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primaryHeaderStart, AppColors.primary],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 76,
                  height: 76,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.55),
                      width: 3,
                    ),
                  ),
                  child: const Icon(
                    Icons.person,
                    color: Color(0xFF4E167E),
                    size: 38,
                  ),
                ),
                Positioned(
                  right: -3,
                  bottom: -1,
                  child: Material(
                    color: Colors.white,
                    shape: const CircleBorder(),
                    child: InkWell(
                      onTap: onEditPhoto,
                      customBorder: const CircleBorder(),
                      child: const SizedBox(
                        width: 27,
                        height: 27,
                        child: Icon(
                          Icons.camera_alt_outlined,
                          color: AppColors.primary,
                          size: 15,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 17,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              phone,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _ProfileStat(value: '$orderCount', label: 'Pesanan'),
                _ProfileStat(value: '$wishlistCount', label: 'Wishlist'),
                _ProfileStat(value: rating, label: 'Rating'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileStat extends StatelessWidget {
  final String value;
  final String label;

  const _ProfileStat({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 74,
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 15,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String label;

  const _SectionLabel(this.label);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 7),
      child: Text(
        label,
        style: const TextStyle(
          color: AppColors.textSecondary,
          fontSize: 10,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}

class _ProfileMenuData {
  final String label;
  final IconData icon;
  final Color iconColor;
  final Color iconBackground;
  final VoidCallback onTap;

  const _ProfileMenuData({
    required this.label,
    required this.icon,
    required this.iconColor,
    required this.iconBackground,
    required this.onTap,
  });
}

class _ProfileMenuGroup extends StatelessWidget {
  final List<_ProfileMenuData> items;

  const _ProfileMenuGroup({required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 2),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE3E9E6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        children: [
          for (var index = 0; index < items.length; index++) ...[
            _ProfileMenuRow(item: items[index]),
            if (index < items.length - 1)
              const Divider(
                height: 1,
                indent: 58,
                color: Color(0xFFE5E9E7),
              ),
          ],
        ],
      ),
    );
  }
}

class _ProfileMenuRow extends StatelessWidget {
  final _ProfileMenuData item;

  const _ProfileMenuRow({required this.item});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: item.onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        child: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: item.iconBackground,
                shape: BoxShape.circle,
              ),
              child: Icon(item.icon, color: item.iconColor, size: 17),
            ),
            const SizedBox(width: 11),
            Expanded(
              child: Text(
                item.label,
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const Icon(
              LucideIcons.chevronRight,
              color: AppColors.textSecondary,
              size: 17,
            ),
          ],
        ),
      ),
    );
  }
}

class _LogoutButton extends StatelessWidget {
  final VoidCallback onTap;

  const _LogoutButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 2),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAF9),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE8EDEC)),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
          child: Row(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: const BoxDecoration(
                  color: Color(0xFFFFF0F0),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  LucideIcons.logOut,
                  color: Colors.red,
                  size: 17,
                ),
              ),
              const SizedBox(width: 11),
              const Text(
                'Keluar',
                style: TextStyle(
                  color: Colors.red,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
