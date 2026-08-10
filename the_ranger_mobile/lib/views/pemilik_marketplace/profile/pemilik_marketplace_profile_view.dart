import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../providers/app_provider.dart';

class PemilikMarketplaceProfileView extends StatefulWidget {
  const PemilikMarketplaceProfileView({super.key});

  @override
  State<PemilikMarketplaceProfileView> createState() =>
      _PemilikMarketplaceProfileViewState();
}

class _PemilikMarketplaceProfileViewState
    extends State<PemilikMarketplaceProfileView> {
  bool _orderNotifications = true;
  bool _chatNotifications = true;
  bool _incomeNotifications = true;
  bool _promotionNotifications = false;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final isVerified = provider.isMarketplaceProfileComplete;

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 30),
        children: [
          const Text(
            'Profil Marketplace',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 18),
          _buildProfileHeader(provider, isVerified),
          const SizedBox(height: 16),
          _ProfileGroup(
            title: 'Akun Saya',
            children: [
              _ProfileMenuItem(
                icon: LucideIcons.userRound,
                title: 'Akun Saya',
                subtitle: provider.marketplaceEmail.isEmpty
                    ? 'Informasi akun belum lengkap'
                    : provider.marketplaceEmail,
                onTap: _openAccount,
              ),
              _ProfileMenuItem(
                icon: LucideIcons.lockKeyhole,
                title: 'Ubah Password',
                subtitle: 'Perbarui keamanan akun',
                onTap: _openChangePassword,
              ),
              _ProfileMenuItem(
                icon: LucideIcons.phone,
                title: 'Nomor HP',
                subtitle:
                    _displayValue(provider.marketplacePhone, 'Belum diisi'),
                onTap: _openPhone,
              ),
            ],
          ),
          const SizedBox(height: 14),
          _ProfileGroup(
            title: 'Informasi Toko',
            children: [
              _ProfileMenuItem(
                icon: LucideIcons.store,
                title: 'Informasi Toko',
                subtitle: _displayValue(
                    provider.marketplaceStoreName, 'Nama toko belum diisi'),
                onTap: _openStoreInfo,
              ),
              _ProfileMenuItem(
                icon: provider.marketplaceIsOpen
                    ? LucideIcons.circleCheck
                    : LucideIcons.circleX,
                title: 'Status Toko',
                subtitle:
                    provider.marketplaceIsOpen ? 'Toko Buka' : 'Toko Tutup',
                iconColor:
                    provider.marketplaceIsOpen ? Colors.green : Colors.red,
                onTap: _toggleStoreStatus,
              ),
              _ProfileMenuItem(
                icon: LucideIcons.fileCheck2,
                title: 'Status Verifikasi',
                subtitle: isVerified
                    ? 'Data profil lengkap'
                    : 'Data profil perlu dilengkapi',
                onTap: _openVerification,
              ),
              _ProfileMenuItem(
                icon: LucideIcons.share2,
                title: 'Bagikan Toko',
                subtitle: 'Salin informasi toko',
                onTap: _openShareStore,
              ),
            ],
          ),
          const SizedBox(height: 14),
          _ProfileGroup(
            title: 'Pengaturan',
            children: [
              _ProfileMenuItem(
                icon: LucideIcons.bell,
                title: 'Notifikasi',
                subtitle: 'Pesanan, chat, pendapatan, promosi',
                onTap: _openNotificationSettings,
              ),
              _ProfileMenuItem(
                icon: LucideIcons.shieldCheck,
                title: 'Keamanan',
                subtitle: 'Password, nomor HP, dan status login',
                onTap: _openSecurity,
              ),
              _ProfileMenuItem(
                icon: LucideIcons.circleHelp,
                title: 'Bantuan',
                subtitle: 'Pusat bantuan pemilik marketplace',
                onTap: _showHelp,
              ),
              _ProfileMenuItem(
                icon: LucideIcons.fileText,
                title: 'Kebijakan & Ketentuan',
                subtitle: 'Privasi dan syarat penggunaan',
                onTap: _showPolicies,
              ),
            ],
          ),
          const SizedBox(height: 18),
          OutlinedButton.icon(
            onPressed: _confirmLogout,
            icon: const Icon(LucideIcons.logOut),
            label: const Text('Logout'),
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.red,
              minimumSize: const Size.fromHeight(50),
              side: const BorderSide(color: Color(0xFFFFD8D8)),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileHeader(AppProvider provider, bool isVerified) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: _viewProfilePhoto,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                _ProfileAvatar(
                  imageBytes: provider.marketplaceProfileImageBytes,
                  radius: 31,
                ),
                Positioned(
                  right: -3,
                  bottom: -2,
                  child: InkWell(
                    onTap: _chooseProfileImage,
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                      child: const Icon(
                        Icons.edit_rounded,
                        size: 13,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 13),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _displayValue(provider.marketplaceOwnerName, 'Nama pemilik'),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 17,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  _displayValue(
                      provider.marketplaceStoreName, 'Nama toko belum diisi'),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: AppColors.textSecondary),
                ),
                const SizedBox(height: 7),
                _VerificationBadge(isVerified: isVerified),
              ],
            ),
          ),
          IconButton(
            onPressed: _openAccount,
            icon: const Icon(LucideIcons.chevronRight,
                color: AppColors.textMuted),
            tooltip: 'Edit profil',
          ),
        ],
      ),
    );
  }

  Future<void> _chooseProfileImage() async {
    final source = await showModalBottomSheet<_ImageSource>(
      context: context,
      showDragHandle: true,
      builder: (sheetContext) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Ubah Foto Profil',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                ),
              ),
              const SizedBox(height: 12),
              ListTile(
                leading:
                    const Icon(LucideIcons.image, color: AppColors.primary),
                title: const Text('Pilih dari Gallery'),
                onTap: () => Navigator.pop(sheetContext, _ImageSource.gallery),
              ),
              ListTile(
                leading:
                    const Icon(LucideIcons.camera, color: AppColors.primary),
                title: const Text('Ambil dari Kamera'),
                subtitle:
                    const Text('Fitur kamera belum tersedia di project ini'),
                onTap: () => Navigator.pop(sheetContext, _ImageSource.camera),
              ),
            ],
          ),
        ),
      ),
    );
    if (!mounted || source == null) return;
    if (source == _ImageSource.camera) {
      _showMessage(
          'Fitur kamera belum tersedia karena project belum memiliki camera service.');
      return;
    }
    await _pickProfileImageFromGallery();
  }

  Future<void> _pickProfileImageFromGallery() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.image,
      withData: true,
    );
    if (!mounted || result == null || result.files.single.bytes == null) return;
    final bytes = result.files.single.bytes!;
    final shouldSave = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Preview Foto Profil'),
        content: Center(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(18),
            child:
                Image.memory(bytes, width: 190, height: 190, fit: BoxFit.cover),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Simpan'),
          ),
        ],
      ),
    );
    if (!mounted || shouldSave != true) return;
    await _saveProfileImage(bytes);
  }

  Future<void> _saveProfileImage(Uint8List bytes) async {
    _showMessage('Menyimpan foto profil...');
    try {
      await context.read<AppProvider>().updateMarketplaceProfile(
            profileImageBytes: bytes,
          );
      if (mounted) _showMessage('Foto profil berhasil diperbarui.');
    } catch (_) {
      if (mounted) _showMessage('Foto profil gagal disimpan.');
    }
  }

  void _viewProfilePhoto() {
    final provider = context.read<AppProvider>();
    showDialog<void>(
      context: context,
      builder: (dialogContext) => Dialog(
        backgroundColor: Colors.transparent,
        child: Stack(
          children: [
            Center(
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: _ProfileAvatar(
                  imageBytes: provider.marketplaceProfileImageBytes,
                  radius: 115,
                ),
              ),
            ),
            Positioned(
              top: 0,
              right: 0,
              child: IconButton(
                onPressed: () => Navigator.pop(dialogContext),
                style: IconButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: AppColors.textPrimary,
                ),
                icon: const Icon(Icons.close_rounded),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _openAccount() async {
    final provider = context.read<AppProvider>();
    final draft = await showModalBottomSheet<_ProfileDraft>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _ProfileAccountSheet(
        ownerName: provider.marketplaceOwnerName,
        phone: provider.marketplacePhone,
        email: provider.marketplaceEmail,
      ),
    );
    if (!mounted || draft == null) return;
    await provider.updateMarketplaceProfile(
      ownerName: draft.ownerName,
      phone: draft.phone,
    );
    if (mounted) _showMessage('Informasi akun berhasil diperbarui.');
  }

  Future<void> _openChangePassword() async {
    final draft = await showModalBottomSheet<_PasswordDraft>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const _ChangePasswordSheet(),
    );
    if (!mounted || draft == null) return;
    _showMessage('Memproses perubahan password...');
    final success = await context.read<AppProvider>().changeMarketplacePassword(
          currentPassword: draft.currentPassword,
          newPassword: draft.newPassword,
        );
    if (!mounted) return;
    _showMessage(
      success
          ? 'Password berhasil diperbarui.'
          : 'Password saat ini salah atau perubahan gagal.',
    );
  }

  Future<void> _openStoreInfo() async {
    final provider = context.read<AppProvider>();
    final draft = await showModalBottomSheet<_StoreDraft>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _StoreInfoSheet(
        storeName: provider.marketplaceStoreName,
        description: provider.marketplaceStoreDescription,
        address: provider.marketplaceAddress,
        hours: provider.marketplaceOperatingHours,
        days: provider.marketplaceOperatingDays,
        isOpen: provider.marketplaceIsOpen,
      ),
    );
    if (!mounted || draft == null) return;
    await provider.updateMarketplaceStore(
      storeName: draft.storeName,
      description: draft.description,
      address: draft.address,
      operatingHours: draft.hours,
      operatingDays: draft.days,
      isOpen: draft.isOpen,
    );
    if (mounted) _showMessage('Informasi toko berhasil diperbarui.');
  }

  Future<void> _toggleStoreStatus() async {
    final provider = context.read<AppProvider>();
    final nextStatus = !provider.marketplaceIsOpen;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(nextStatus ? 'Buka Toko?' : 'Tutup Toko?'),
        content: Text(
          nextStatus
              ? 'Toko akan kembali menerima pesanan customer.'
              : 'Toko tidak akan menerima pesanan baru selama ditutup.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: Text(nextStatus ? 'Buka Toko' : 'Tutup Toko'),
          ),
        ],
      ),
    );
    if (!mounted || confirmed != true) return;
    await provider.setMarketplaceOpen(nextStatus);
    if (mounted) {
      _showMessage(nextStatus ? 'Toko sekarang buka.' : 'Toko sekarang tutup.');
    }
  }

  void _openVerification() {
    final provider = context.read<AppProvider>();
    final hasOwner = provider.marketplaceOwnerName.trim().isNotEmpty;
    final hasPhone = provider.marketplacePhone.trim().isNotEmpty &&
        provider.marketplacePhone.toLowerCase() != 'belum diisi';
    final hasStore = provider.marketplaceStoreName.trim().isNotEmpty;
    final hasAddress = provider.marketplaceAddress.trim().isNotEmpty;
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (_) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Status Verifikasi',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 14),
            _VerificationRow(label: 'Identitas pemilik', verified: hasOwner),
            _VerificationRow(label: 'Nomor HP', verified: hasPhone),
            _VerificationRow(label: 'Nama toko', verified: hasStore),
            _VerificationRow(label: 'Alamat toko', verified: hasAddress),
            const Divider(height: 22),
            Row(
              children: [
                Icon(
                  provider.isMarketplaceProfileComplete
                      ? Icons.check_circle
                      : Icons.warning_amber_rounded,
                  color: provider.isMarketplaceProfileComplete
                      ? Colors.green
                      : Colors.orange,
                ),
                const SizedBox(width: 9),
                Text(
                  provider.isMarketplaceProfileComplete
                      ? 'Profil siap digunakan'
                      : 'Lengkapi data profil untuk verifikasi',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Project ini belum memiliki service KTP/OTP terhubung, jadi status di atas hanya mengikuti data profil yang tersimpan.',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _openPhone() async {
    final provider = context.read<AppProvider>();
    final phone = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (_) => _PhoneSheet(currentPhone: provider.marketplacePhone),
    );
    if (!mounted || phone == null) return;
    await provider.updateMarketplaceProfile(phone: phone);
    if (mounted) {
      _showMessage(
          'Nomor HP disimpan. Verifikasi OTP belum tersedia di project.');
    }
  }

  void _openNotificationSettings() {
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (_) => StatefulBuilder(
        builder: (context, sheetSetState) => Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Notifikasi',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
                ),
              ),
              const SizedBox(height: 10),
              _notificationSwitch(
                sheetSetState,
                'Notifikasi Pesanan',
                _orderNotifications,
                (value) => _orderNotifications = value,
              ),
              _notificationSwitch(
                sheetSetState,
                'Notifikasi Chat',
                _chatNotifications,
                (value) => _chatNotifications = value,
              ),
              _notificationSwitch(
                sheetSetState,
                'Notifikasi Pendapatan',
                _incomeNotifications,
                (value) => _incomeNotifications = value,
              ),
              _notificationSwitch(
                sheetSetState,
                'Notifikasi Promosi',
                _promotionNotifications,
                (value) => _promotionNotifications = value,
              ),
              const SizedBox(height: 8),
              const Text(
                'Preferensi ini siap dihubungkan ke notification service yang sudah ada.',
                style: TextStyle(color: AppColors.textMuted, fontSize: 10),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _notificationSwitch(
    StateSetter setSheetState,
    String title,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return SwitchListTile.adaptive(
      contentPadding: EdgeInsets.zero,
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
      value: value,
      activeThumbColor: AppColors.primary,
      onChanged: (nextValue) {
        setSheetState(() => onChanged(nextValue));
        setState(() {});
      },
    );
  }

  void _openSecurity() {
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (_) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Keamanan Akun',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 12),
            _securityAction(
              Icons.lock_outline_rounded,
              'Ubah Password',
              _openChangePassword,
            ),
            _securityAction(Icons.phone_outlined, 'Nomor HP', _openPhone),
            _securityAction(
              Icons.verified_user_outlined,
              'Status login',
              () => _showMessage('Sesi marketplace sedang aktif.'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _securityAction(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: AppColors.primary),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
      trailing:
          const Icon(LucideIcons.chevronRight, color: AppColors.textMuted),
      onTap: onTap,
    );
  }

  void _openShareStore() {
    final provider = context.read<AppProvider>();
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (sheetContext) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Bagikan Toko',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 8),
            Text(
              _displayValue(
                  provider.marketplaceStoreName, 'Nama toko belum diisi'),
              style: const TextStyle(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 4),
            const Text(
              'Deep link dan share sheet perangkat belum tersedia di project ini. Tidak dibuat link palsu.',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () async {
                  await Clipboard.setData(
                    ClipboardData(
                      text:
                          '${provider.marketplaceStoreName}\n${provider.marketplaceAddress}',
                    ),
                  );
                  if (sheetContext.mounted) Navigator.pop(sheetContext);
                  if (mounted) _showMessage('Informasi toko disalin.');
                },
                icon: const Icon(Icons.copy_rounded),
                label: const Text('Salin Informasi Toko'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showHelp() {
    _showInfoDialog(
      'Bantuan',
      'Gunakan menu Akun Saya untuk memperbarui profil, Informasi Toko untuk mengatur outlet, dan Pendapatan untuk memantau transaksi selesai.',
    );
  }

  void _showPolicies() {
    _showInfoDialog(
      'Kebijakan & Ketentuan',
      'Halaman kebijakan dan ketentuan belum memiliki content service khusus di project ini. Struktur menu sudah disiapkan untuk integrasi berikutnya.',
    );
  }

  void _showInfoDialog(String title, String message) {
    showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Tutup'),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmLogout() async {
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Logout dari Marketplace?'),
        content: const Text('Anda perlu login kembali untuk mengelola toko.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
    if (!mounted || shouldLogout != true) return;
    await context.read<AppProvider>().logoutMarketplace();
    if (!mounted) return;
    context.read<AppProvider>().navigate(AppScreen.login);
  }

  void _showMessage(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }
}

class _ProfileAvatar extends StatelessWidget {
  const _ProfileAvatar({required this.imageBytes, required this.radius});

  final Uint8List? imageBytes;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: radius,
      backgroundColor: AppColors.primaryLight,
      backgroundImage: imageBytes == null ? null : MemoryImage(imageBytes!),
      child: imageBytes == null
          ? Icon(
              LucideIcons.store,
              color: AppColors.primary,
              size: radius * .85,
            )
          : null,
    );
  }
}

class _VerificationBadge extends StatelessWidget {
  const _VerificationBadge({required this.isVerified});

  final bool isVerified;

  @override
  Widget build(BuildContext context) {
    final color = isVerified ? Colors.green : Colors.orange.shade800;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .1),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        isVerified ? 'Terverifikasi' : 'Belum lengkap',
        style:
            TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: color),
      ),
    );
  }
}

class _ProfileGroup extends StatelessWidget {
  const _ProfileGroup({required this.title, required this.children});

  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 7),
            child: Text(title,
                style: const TextStyle(fontWeight: FontWeight.w800)),
          ),
          ...children,
        ],
      ),
    );
  }
}

class _ProfileMenuItem extends StatelessWidget {
  const _ProfileMenuItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.iconColor = AppColors.primary,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final Color iconColor;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 1),
      leading: Icon(icon, color: iconColor),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
      subtitle: Text(
        subtitle,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(fontSize: 11),
      ),
      trailing: const Icon(LucideIcons.chevronRight,
          color: AppColors.textMuted, size: 18),
      onTap: onTap,
    );
  }
}

class _VerificationRow extends StatelessWidget {
  const _VerificationRow({required this.label, required this.verified});

  final String label;
  final bool verified;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(
        verified ? Icons.check_circle : Icons.warning_amber_rounded,
        color: verified ? Colors.green : Colors.orange,
      ),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w700)),
      subtitle: Text(verified ? 'Data tersedia' : 'Belum diisi'),
    );
  }
}

class _ProfileAccountSheet extends StatefulWidget {
  const _ProfileAccountSheet({
    required this.ownerName,
    required this.phone,
    required this.email,
  });

  final String ownerName;
  final String phone;
  final String email;

  @override
  State<_ProfileAccountSheet> createState() => _ProfileAccountSheetState();
}

class _ProfileAccountSheetState extends State<_ProfileAccountSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController =
      TextEditingController(text: widget.ownerName);
  late final TextEditingController _phoneController = TextEditingController(
      text: widget.phone == 'Belum diisi' ? '' : widget.phone);

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _SheetContainer(
      title: 'Akun Saya',
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _field(_nameController, 'Nama Pemilik'),
            const SizedBox(height: 12),
            TextFormField(
              initialValue: widget.email,
              readOnly: true,
              decoration: _inputDecoration('Email').copyWith(
                suffixIcon: const Icon(Icons.lock_outline, size: 18),
              ),
            ),
            const SizedBox(height: 12),
            _field(
              _phoneController,
              'Nomor HP',
              keyboardType: TextInputType.phone,
              required: false,
            ),
            const SizedBox(height: 6),
            const Text(
              'Password dikelola oleh authentication system dan tidak ditampilkan.',
              style: TextStyle(color: AppColors.textMuted, fontSize: 10),
            ),
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {
                  if (_formKey.currentState?.validate() ?? false) {
                    Navigator.pop(
                      context,
                      _ProfileDraft(
                        ownerName: _nameController.text.trim(),
                        phone: _phoneController.text.trim().isEmpty
                            ? 'Belum diisi'
                            : _phoneController.text.trim(),
                      ),
                    );
                  }
                },
                child: const Text('Simpan Perubahan'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ChangePasswordSheet extends StatefulWidget {
  const _ChangePasswordSheet();

  @override
  State<_ChangePasswordSheet> createState() => _ChangePasswordSheetState();
}

class _ChangePasswordSheetState extends State<_ChangePasswordSheet> {
  final _formKey = GlobalKey<FormState>();
  final _currentController = TextEditingController();
  final _newController = TextEditingController();
  final _confirmController = TextEditingController();

  @override
  void dispose() {
    _currentController.dispose();
    _newController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _SheetContainer(
      title: 'Ubah Password',
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            _passwordField(_currentController, 'Password Saat Ini'),
            const SizedBox(height: 12),
            _passwordField(_newController, 'Password Baru', minLength: 6),
            const SizedBox(height: 12),
            _passwordField(
              _confirmController,
              'Konfirmasi Password',
              validator: (value) => value != _newController.text
                  ? 'Konfirmasi password tidak sama.'
                  : null,
            ),
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () {
                  if (!(_formKey.currentState?.validate() ?? false)) return;
                  Navigator.pop(
                    context,
                    _PasswordDraft(
                      currentPassword: _currentController.text,
                      newPassword: _newController.text,
                    ),
                  );
                },
                child: const Text('Simpan Password'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _passwordField(
    TextEditingController controller,
    String label, {
    int minLength = 1,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: true,
      decoration: _inputDecoration(label),
      validator: (value) {
        if (value == null || value.isEmpty) return '$label wajib diisi.';
        if (value.length < minLength) return 'Minimal $minLength karakter.';
        return validator?.call(value);
      },
    );
  }
}

class _PhoneSheet extends StatefulWidget {
  const _PhoneSheet({required this.currentPhone});

  final String currentPhone;

  @override
  State<_PhoneSheet> createState() => _PhoneSheetState();
}

class _PhoneSheetState extends State<_PhoneSheet> {
  late final TextEditingController _controller = TextEditingController(
    text: widget.currentPhone == 'Belum diisi' ? '' : widget.currentPhone,
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _SheetContainer(
      title: 'Nomor HP',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextFormField(
            controller: _controller,
            keyboardType: TextInputType.phone,
            decoration: _inputDecoration('Nomor HP Baru'),
          ),
          const SizedBox(height: 8),
          const Text(
            'OTP belum tersedia di project ini. Nomor akan disimpan sebagai data profil sampai OTP service terhubung.',
            style: TextStyle(color: AppColors.textMuted, fontSize: 10),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () {
                if (_controller.text.trim().isEmpty) return;
                Navigator.pop(context, _controller.text.trim());
              },
              child: const Text('Simpan Nomor HP'),
            ),
          ),
        ],
      ),
    );
  }
}

class _StoreInfoSheet extends StatefulWidget {
  const _StoreInfoSheet({
    required this.storeName,
    required this.description,
    required this.address,
    required this.hours,
    required this.days,
    required this.isOpen,
  });

  final String storeName;
  final String description;
  final String address;
  final Map<String, String> hours;
  final Map<String, bool> days;
  final bool isOpen;

  @override
  State<_StoreInfoSheet> createState() => _StoreInfoSheetState();
}

class _StoreInfoSheetState extends State<_StoreInfoSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _storeNameController =
      TextEditingController(text: widget.storeName);
  late final TextEditingController _descriptionController =
      TextEditingController(text: widget.description);
  late final TextEditingController _addressController =
      TextEditingController(text: widget.address);
  late final Map<String, String> _hours = Map.from(widget.hours);
  late final Map<String, bool> _days = Map.from(widget.days);
  late bool _isOpen = widget.isOpen;

  static const _dayNames = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
  ];

  @override
  void dispose() {
    _storeNameController.dispose();
    _descriptionController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _SheetContainer(
      title: 'Informasi Toko',
      maxHeightFactor: .94,
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _field(_storeNameController, 'Nama Toko'),
            const SizedBox(height: 12),
            _field(_descriptionController, 'Deskripsi Toko',
                maxLines: 3, required: false),
            const SizedBox(height: 12),
            _field(_addressController, 'Alamat Toko'),
            const SizedBox(height: 16),
            Row(
              children: [
                const Expanded(
                  child: Text(
                    'Status Toko',
                    style: TextStyle(fontWeight: FontWeight.w800),
                  ),
                ),
                Switch.adaptive(
                  value: _isOpen,
                  activeThumbColor: AppColors.primary,
                  onChanged: (value) => setState(() => _isOpen = value),
                ),
                Text(
                  _isOpen ? 'Buka' : 'Tutup',
                  style: TextStyle(
                    color: _isOpen ? Colors.green : Colors.red,
                    fontWeight: FontWeight.w800,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            const Text(
              'Jam Operasional',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 6),
            ..._dayNames.map(_buildDayRow),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: _save,
                child: const Text('Simpan Informasi Toko'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDayRow(String day) {
    final enabled = _days[day] ?? true;
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: enabled ? Colors.white : AppColors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 62,
            child: Text(day,
                style:
                    const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
          ),
          Switch.adaptive(
            value: enabled,
            activeThumbColor: AppColors.primary,
            onChanged: (value) => setState(() => _days[day] = value),
          ),
          Expanded(
            child: Text(
              enabled ? (_hours[day] ?? '08.00 - 21.00') : 'Tutup hari ini',
              style: TextStyle(
                color: enabled ? AppColors.textSecondary : AppColors.textMuted,
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          IconButton(
            onPressed: enabled ? () => _pickHours(day) : null,
            icon: const Icon(Icons.access_time_rounded, size: 18),
            color: AppColors.primary,
            tooltip: 'Atur jam',
          ),
        ],
      ),
    );
  }

  Future<void> _pickHours(String day) async {
    final current = _parseHours(_hours[day] ?? '08.00 - 21.00');
    final open =
        await showTimePicker(context: context, initialTime: current.$1);
    if (!mounted || open == null) return;
    final close =
        await showTimePicker(context: context, initialTime: current.$2);
    if (!mounted || close == null) return;
    setState(
        () => _hours[day] = '${_formatTime(open)} - ${_formatTime(close)}');
  }

  (TimeOfDay, TimeOfDay) _parseHours(String value) {
    final parts = value.split('-').map((part) => part.trim()).toList();
    return (
      _parseTimeOfDay(parts.isEmpty ? '08.00' : parts.first,
          const TimeOfDay(hour: 8, minute: 0)),
      _parseTimeOfDay(parts.length < 2 ? '21.00' : parts[1],
          const TimeOfDay(hour: 21, minute: 0)),
    );
  }

  TimeOfDay _parseTimeOfDay(String value, TimeOfDay fallback) {
    final parts = value.replaceAll('.', ':').split(':');
    if (parts.length != 2) return fallback;
    final hour = int.tryParse(parts[0]);
    final minute = int.tryParse(parts[1]);
    if (hour == null || minute == null || hour > 23 || minute > 59) {
      return fallback;
    }
    return TimeOfDay(hour: hour, minute: minute);
  }

  String _formatTime(TimeOfDay value) =>
      '${value.hour.toString().padLeft(2, '0')}.${value.minute.toString().padLeft(2, '0')}';

  void _save() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    Navigator.pop(
      context,
      _StoreDraft(
        storeName: _storeNameController.text.trim(),
        description: _descriptionController.text.trim(),
        address: _addressController.text.trim(),
        hours: _hours,
        days: _days,
        isOpen: _isOpen,
      ),
    );
  }
}

class _SheetContainer extends StatelessWidget {
  const _SheetContainer({
    required this.title,
    required this.child,
    this.maxHeightFactor = .88,
  });

  final String title;
  final Widget child;
  final double maxHeightFactor;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * maxHeightFactor,
        ),
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 42,
                  height: 5,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Text(title,
                  style: const TextStyle(
                      fontSize: 20, fontWeight: FontWeight.w900)),
              const SizedBox(height: 16),
              child,
            ],
          ),
        ),
      ),
    );
  }
}

class _PasswordDraft {
  const _PasswordDraft(
      {required this.currentPassword, required this.newPassword});

  final String currentPassword;
  final String newPassword;
}

class _ProfileDraft {
  const _ProfileDraft({required this.ownerName, required this.phone});

  final String ownerName;
  final String phone;
}

class _StoreDraft {
  const _StoreDraft({
    required this.storeName,
    required this.description,
    required this.address,
    required this.hours,
    required this.days,
    required this.isOpen,
  });

  final String storeName;
  final String description;
  final String address;
  final Map<String, String> hours;
  final Map<String, bool> days;
  final bool isOpen;
}

enum _ImageSource { gallery, camera }

Widget _field(
  TextEditingController controller,
  String label, {
  int maxLines = 1,
  TextInputType? keyboardType,
  bool required = true,
}) {
  return TextFormField(
    controller: controller,
    maxLines: maxLines,
    keyboardType: keyboardType,
    decoration: _inputDecoration(label),
    validator: required
        ? (value) =>
            value == null || value.trim().isEmpty ? '$label wajib diisi.' : null
        : null,
  );
}

InputDecoration _inputDecoration(String label) {
  return InputDecoration(
    labelText: label,
    filled: true,
    fillColor: Colors.white,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: AppColors.border),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: AppColors.border),
    ),
  );
}

String _displayValue(String value, String fallback) =>
    value.trim().isEmpty ? fallback : value;
