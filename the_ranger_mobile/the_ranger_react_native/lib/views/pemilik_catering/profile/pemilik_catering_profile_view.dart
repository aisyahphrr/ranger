import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../providers/app_provider.dart';

class PemilikCateringProfileView extends StatefulWidget {
  const PemilikCateringProfileView({super.key});

  @override
  State<PemilikCateringProfileView> createState() =>
      _PemilikCateringProfileViewState();
}

class _PemilikCateringProfileViewState
    extends State<PemilikCateringProfileView> {
  bool _orderNotifications = true;
  bool _chatNotifications = true;
  bool _incomeNotifications = true;
  bool _promotionNotifications = false;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final isVerified = provider.isCateringProfileComplete;

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 30),
        children: [
          const Text(
            'Profil Catering',
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
                subtitle: provider.cateringEmail.isEmpty
                    ? 'Informasi akun belum lengkap'
                    : provider.cateringEmail,
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
                    _displayValue(provider.cateringPhone, 'Belum diisi'),
                onTap: _openPhone,
              ),
            ],
          ),
          const SizedBox(height: 14),
          _ProfileGroup(
            title: 'Informasi Dapur Catering',
            children: [
              _ProfileMenuItem(
                icon: LucideIcons.store,
                title: 'Informasi Catering',
                subtitle: _displayValue(
                    provider.cateringBusinessName, 'Nama catering belum diisi'),
                onTap: _openCateringInfo,
              ),
              _ProfileMenuItem(
                icon: provider.cateringIsOpen
                    ? LucideIcons.circleCheck
                    : LucideIcons.circleX,
                title: 'Status Dapur',
                subtitle:
                    provider.cateringIsOpen ? 'Dapur Buka (Menerima Pesanan)' : 'Dapur Tutup',
                iconColor:
                    provider.cateringIsOpen ? Colors.green : Colors.red,
                onTap: _toggleCateringStatus,
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
                title: 'Bagikan Dapur',
                subtitle: 'Salin informasi catering',
                onTap: _openShareCatering,
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
                subtitle: 'Pusat bantuan pemilik catering',
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
                  imageBytes: provider.cateringProfileImageBytes,
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
                  _displayValue(provider.cateringOwnerName, 'Nama pemilik'),
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
                      provider.cateringBusinessName, 'Nama catering belum diisi'),
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
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Text('Preview Foto Profil', style: TextStyle(fontWeight: FontWeight.bold)),
        content: Center(
          widthFactor: 1,
          heightFactor: 1,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(18),
            child:
                Image.memory(bytes, width: 190, height: 190, fit: BoxFit.cover),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Batal', style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold)),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            style: FilledButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Simpan', style: TextStyle(fontWeight: FontWeight.bold)),
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
      await context.read<AppProvider>().updateCateringProfile(
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
                  imageBytes: provider.cateringProfileImageBytes,
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
        ownerName: provider.cateringOwnerName,
        phone: provider.cateringPhone,
        email: provider.cateringEmail,
      ),
    );
    if (!mounted || draft == null) return;
    await provider.updateCateringProfile(
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
    final success = await context.read<AppProvider>().changeCateringPassword(
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

  Future<void> _openCateringInfo() async {
    final provider = context.read<AppProvider>();
    final draft = await showModalBottomSheet<_CateringDraft>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _CateringInfoSheet(
        businessName: provider.cateringBusinessName,
        description: provider.cateringDescription,
        address: provider.cateringAddress,
        hours: provider.cateringOperatingHours,
        days: provider.cateringOperatingDays,
        isOpen: provider.cateringIsOpen,
      ),
    );
    if (!mounted || draft == null) return;
    await provider.updateCateringStore(
      businessName: draft.businessName,
      description: draft.description,
      address: draft.address,
      operatingHours: draft.hours,
      operatingDays: draft.days,
      isOpen: draft.isOpen,
    );
    if (mounted) _showMessage('Informasi catering berhasil diperbarui.');
  }

  Future<void> _toggleCateringStatus() async {
    final provider = context.read<AppProvider>();
    final nextStatus = !provider.cateringIsOpen;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Text(nextStatus ? 'Buka Dapur?' : 'Tutup Dapur?', style: const TextStyle(fontWeight: FontWeight.bold)),
        content: Text(
          nextStatus
              ? 'Dapur catering akan kembali menerima pesanan baru.'
              : 'Dapur catering tidak akan menerima pesanan baru selama ditutup.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Batal', style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold)),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            style: FilledButton.styleFrom(backgroundColor: AppColors.primary),
            child: Text(nextStatus ? 'Buka Dapur' : 'Tutup Dapur', style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
    if (!mounted || confirmed != true) return;
    await provider.setCateringOpen(nextStatus);
    if (mounted) {
      _showMessage(nextStatus ? 'Dapur sekarang buka.' : 'Dapur sekarang tutup.');
    }
  }

  void _openVerification() {
    final provider = context.read<AppProvider>();
    final hasOwner = provider.cateringOwnerName.trim().isNotEmpty;
    final hasPhone = provider.cateringPhone.trim().isNotEmpty &&
        provider.cateringPhone.toLowerCase() != 'belum diisi';
    final hasBusiness = provider.cateringBusinessName.trim().isNotEmpty;
    final hasAddress = provider.cateringAddress.trim().isNotEmpty;
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
            _VerificationRow(label: 'Nama catering', verified: hasBusiness),
            _VerificationRow(label: 'Alamat dapur', verified: hasAddress),
            const Divider(height: 22),
            Row(
              children: [
                Icon(
                  provider.isCateringProfileComplete
                      ? Icons.check_circle
                      : Icons.warning_amber_rounded,
                  color: provider.isCateringProfileComplete
                      ? Colors.green
                      : Colors.orange,
                ),
                const SizedBox(width: 9),
                Text(
                  provider.isCateringProfileComplete
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
      builder: (_) => _PhoneSheet(currentPhone: provider.cateringPhone),
    );
    if (!mounted || phone == null) return;
    await provider.updateCateringProfile(phone: phone);
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
              () => _showMessage('Sesi catering sedang aktif.'),
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

  void _openShareCatering() {
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
              'Bagikan Dapur',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 8),
            Text(
              _displayValue(
                  provider.cateringBusinessName, 'Nama catering belum diisi'),
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
                          '${provider.cateringBusinessName}\n${provider.cateringAddress}',
                    ),
                  );
                  if (sheetContext.mounted) Navigator.pop(sheetContext);
                  if (mounted) _showMessage('Informasi catering disalin.');
                },
                icon: const Icon(Icons.copy_rounded),
                label: const Text('Salin Informasi Catering'),
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
      'Gunakan menu Akun Saya untuk memperbarui profil, Informasi Dapur Catering untuk mengatur operasional catering, dan Pendapatan untuk memantau saldo selesai.',
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
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Tutup', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmLogout() async {
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Text('Logout dari Catering?', style: TextStyle(fontWeight: FontWeight.bold)),
        content: const Text('Anda perlu login kembali untuk mengelola dapur catering.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Batal', style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.bold)),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Logout', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
    if (!mounted || shouldLogout != true) return;
    await context.read<AppProvider>().logoutCateringOwner();
    if (!mounted) return;
    context.read<AppProvider>().navigate(AppScreen.cateringOwnerLogin);
  }

  void _showMessage(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  String _displayValue(String value, String placeholder) {
    return value.trim().isEmpty ? placeholder : value;
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
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            isVerified ? Icons.verified_user : Icons.warning_amber_rounded,
            size: 11,
            color: color,
          ),
          const SizedBox(width: 4),
          Text(
            isVerified ? 'Terverifikasi' : 'Belum Lengkap',
            style: TextStyle(
              color: color,
              fontSize: 9,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
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
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
            child: Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                color: AppColors.textPrimary,
                fontSize: 13,
              ),
            ),
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
    this.iconColor,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: (iconColor ?? AppColors.primary).withValues(alpha: .1),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: iconColor ?? AppColors.primary, size: 18),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
          fontSize: 14,
        ),
      ),
      subtitle: Text(
        subtitle,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(color: AppColors.textSecondary, fontSize: 11.5),
      ),
      trailing: const Icon(LucideIcons.chevronRight,
          color: AppColors.textMuted, size: 17),
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
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(
            verified ? Icons.check_circle_rounded : Icons.radio_button_off,
            color: verified ? Colors.green : AppColors.textMuted,
            size: 18,
          ),
          const SizedBox(width: 10),
          Expanded(child: Text(label)),
          Text(
            verified ? 'Lengkap' : 'Belum diisi',
            style: TextStyle(
              color: verified ? Colors.green : Colors.red,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}

enum _ImageSource { gallery, camera }

class _ProfileDraft {
  const _ProfileDraft({required this.ownerName, required this.phone});

  final String ownerName;
  final String phone;
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
  late final TextEditingController _nameController;
  late final TextEditingController _phoneController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.ownerName);
    _phoneController = TextEditingController(text: widget.phone);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
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
              const Text(
                'Akun Saya',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 16),
              _textField(
                controller: _nameController,
                label: 'Nama Pemilik',
                validator: (value) => value == null || value.trim().isEmpty
                    ? 'Nama wajib diisi.'
                    : null,
              ),
              const SizedBox(height: 12),
              _textField(
                controller: _phoneController,
                label: 'Nomor HP',
                keyboardType: TextInputType.phone,
                validator: (value) => value == null || value.trim().isEmpty
                    ? 'Nomor HP wajib diisi.'
                    : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                initialValue: widget.email,
                decoration: _inputDecoration('Email (Tidak dapat diubah)'),
                enabled: false,
                style: const TextStyle(color: AppColors.textSecondary),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _submit,
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Simpan Perubahan', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _textField({
    required TextEditingController controller,
    required String label,
    FormFieldValidator<String>? validator,
    TextInputType? keyboardType,
  }) {
    return TextFormField(
      controller: controller,
      validator: validator,
      keyboardType: keyboardType,
      decoration: _inputDecoration(label),
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

  void _submit() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    Navigator.pop(
      context,
      _ProfileDraft(
        ownerName: _nameController.text.trim(),
        phone: _phoneController.text.trim(),
      ),
    );
  }
}

class _PasswordDraft {
  const _PasswordDraft({
    required this.currentPassword,
    required this.newPassword,
  });

  final String currentPassword;
  final String newPassword;
}

class _ChangePasswordSheet extends StatefulWidget {
  const _ChangePasswordSheet();

  @override
  State<_ChangePasswordSheet> createState() => _ChangePasswordSheetState();
}

class _ChangePasswordSheetState extends State<_ChangePasswordSheet> {
  final _formKey = GlobalKey<FormState>();
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();

  @override
  void dispose() {
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
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
              const Text(
                'Ubah Password',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _currentPasswordController,
                obscureText: true,
                decoration: _inputDecoration('Password saat ini'),
                validator: (value) => value == null || value.trim().isEmpty
                    ? 'Password saat ini wajib diisi.'
                    : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _newPasswordController,
                obscureText: true,
                decoration: _inputDecoration('Password baru'),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Password baru wajib diisi.';
                  }
                  if (value.length < 5) {
                    return 'Password minimal 5 karakter.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _submit,
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Ubah Password', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
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

  void _submit() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    Navigator.pop(
      context,
      _PasswordDraft(
        currentPassword: _currentPasswordController.text,
        newPassword: _newPasswordController.text,
      ),
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
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _phoneController;

  @override
  void initState() {
    super.initState();
    _phoneController = TextEditingController(
      text: widget.currentPhone == 'Belum diisi' ? '' : widget.currentPhone,
    );
  }

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
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
              const Text(
                'Nomor HP',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: _inputDecoration('Nomor HP baru'),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Nomor HP wajib diisi.';
                  }
                  if (value.length < 9) {
                    return 'Nomor HP tidak valid.';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _submit,
                  style: FilledButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Simpan Nomor HP', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
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

  void _submit() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    Navigator.pop(context, _phoneController.text.trim());
  }
}

class _CateringDraft {
  const _CateringDraft({
    required this.businessName,
    required this.description,
    required this.address,
    required this.hours,
    required this.days,
    required this.isOpen,
  });

  final String businessName;
  final String description;
  final String address;
  final Map<String, String> hours;
  final Map<String, bool> days;
  final bool isOpen;
}

class _CateringInfoSheet extends StatefulWidget {
  const _CateringInfoSheet({
    required this.businessName,
    required this.description,
    required this.address,
    required this.hours,
    required this.days,
    required this.isOpen,
  });

  final String businessName;
  final String description;
  final String address;
  final Map<String, String> hours;
  final Map<String, bool> days;
  final bool isOpen;

  @override
  State<_CateringInfoSheet> createState() => _CateringInfoSheetState();
}

class _CateringInfoSheetState extends State<_CateringInfoSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _businessNameController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _addressController;
  late final Map<String, String> _hours;
  late final Map<String, bool> _days;
  late bool _isOpen;

  @override
  void initState() {
    super.initState();
    _businessNameController = TextEditingController(text: widget.businessName);
    _descriptionController = TextEditingController(text: widget.description);
    _addressController = TextEditingController(text: widget.address);
    _hours = Map<String, String>.from(widget.hours);
    _days = Map<String, bool>.from(widget.days);
    _isOpen = widget.isOpen;
  }

  @override
  void dispose() {
    _businessNameController.dispose();
    _descriptionController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * .9,
        ),
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
          child: Form(
            key: _formKey,
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
                const Text(
                  'Informasi Dapur Catering',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 16),
                _textField(
                  controller: _businessNameController,
                  label: 'Nama Catering',
                  validator: (value) => value == null || value.trim().isEmpty
                      ? 'Nama catering wajib diisi.'
                      : null,
                ),
                const SizedBox(height: 12),
                _textField(
                  controller: _descriptionController,
                  label: 'Deskripsi',
                  maxLines: 2,
                ),
                const SizedBox(height: 12),
                _textField(
                  controller: _addressController,
                  label: 'Alamat Lengkap Dapur',
                  maxLines: 2,
                  validator: (value) => value == null || value.trim().isEmpty
                      ? 'Alamat wajib diisi.'
                      : null,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Hari Operasional',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 7,
                  children: _days.keys.map((day) {
                    final active = _days[day] ?? false;
                    return ChoiceChip(
                      label: Text(day),
                      selected: active,
                      selectedColor: AppColors.primary,
                      backgroundColor: Colors.white,
                      side: BorderSide(
                        color: active ? AppColors.primary : AppColors.border,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      labelStyle: TextStyle(
                        color: active ? Colors.white : AppColors.textSecondary,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                      ),
                      showCheckmark: false,
                      onSelected: (val) => setState(() => _days[day] = val),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Jam Operasional',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                ),
                const SizedBox(height: 8),
                ..._hours.keys.map((day) {
                  if (!(_days[day] ?? false)) return const SizedBox.shrink();
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        SizedBox(
                          width: 60,
                          child: Text(
                            day,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                        ),
                        Expanded(
                          child: TextFormField(
                            initialValue: _hours[day],
                            onChanged: (val) => _hours[day] = val.trim(),
                            decoration: InputDecoration(
                              hintText: 'Misal: 08.00 - 21.00',
                              filled: true,
                              fillColor: Colors.white,
                              contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 8),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(color: AppColors.border),
                              ),
                            ),
                            style: const TextStyle(fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                  );
                }),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: _submit,
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Simpan Perubahan', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _textField({
    required TextEditingController controller,
    required String label,
    int maxLines = 1,
    FormFieldValidator<String>? validator,
  }) {
    return TextFormField(
      controller: controller,
      validator: validator,
      maxLines: maxLines,
      decoration: _inputDecoration(label),
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

  void _submit() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    Navigator.pop(
      context,
      _CateringDraft(
        businessName: _businessNameController.text.trim(),
        description: _descriptionController.text.trim(),
        address: _addressController.text.trim(),
        hours: _hours,
        days: _days,
        isOpen: _isOpen,
      ),
    );
  }
}
