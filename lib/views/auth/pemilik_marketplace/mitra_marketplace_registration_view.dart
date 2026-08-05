import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../providers/app_provider.dart';

class MitraMarketplaceRegistrationView extends StatefulWidget {
  const MitraMarketplaceRegistrationView({super.key});

  @override
  State<MitraMarketplaceRegistrationView> createState() => _MitraMarketplaceRegistrationViewState();
}

class _MitraMarketplaceRegistrationViewState extends State<MitraMarketplaceRegistrationView> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _nikController = TextEditingController();
  final TextEditingController _storeNameController = TextEditingController();
  final TextEditingController _businessCategoryController = TextEditingController();
  final TextEditingController _nibController = TextEditingController();
  final TextEditingController _npwpController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();

  String? _ktpFileName;
  String? _ownerKtpFileName;
  String? _storePhotoFileName;

  @override
  void dispose() {
    _nameController.dispose();
    _nikController.dispose();
    _storeNameController.dispose();
    _businessCategoryController.dispose();
    _nibController.dispose();
    _npwpController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep == 0) {
      if (_formKey.currentState?.validate() ?? false) {
        setState(() => _currentStep = 1);
      }
    } else {
      if (_formKey.currentState?.validate() ?? false) {
        Provider.of<AppProvider>(context, listen: false)
            .navigate(AppScreen.mitraMarketplaceSuccess);
      }
    }
  }

  void _pickFile(String field) {
    setState(() {
      final fileName = '${field.toUpperCase()}_${DateTime.now().millisecondsSinceEpoch % 1000}.jpg';
      switch (field) {
        case 'ktp':
          _ktpFileName = fileName;
          break;
        case 'ownerKtp':
          _ownerKtpFileName = fileName;
          break;
        case 'storePhoto':
          _storePhotoFileName = fileName;
          break;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context, listen: false);
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: AppColors.textPrimary),
          onPressed: () => provider.navigate(AppScreen.mitraRole),
        ),
        title: const Text(
          'Daftar Mitra',
          style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold),
        ),
        centerTitle: false,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildStepIndicator(),
              const SizedBox(height: 24),
              _buildTitleSection(),
              const SizedBox(height: 20),
              Expanded(
                child: Form(
                  key: _formKey,
                  child: ListView(
                    padding: EdgeInsets.zero,
                    children: [
                      if (_currentStep == 0) ...[
                        _buildSectionCard(
                          title: 'Data Diri & NIK',
                          subtitle: 'Pastikan data sesuai dengan kartu identitas Anda yang berlaku.',
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              _buildTextField(
                                label: 'Nama Lengkap Sesuai KTP',
                                controller: _nameController,
                                hintText: 'Budi Santoso',
                                validator: (value) => value == null || value.isEmpty ? 'Harus diisi' : null,
                              ),
                              const SizedBox(height: 16),
                              _buildTextField(
                                label: 'Nomor Induk Kependudukan (NIK)',
                                controller: _nikController,
                                hintText: '320xxxxxxxxxxxxx',
                                keyboardType: TextInputType.number,
                                validator: (value) => value == null || value.isEmpty ? 'Harus diisi' : null,
                              ),
                              const SizedBox(height: 20),
                              _buildUploadBox(
                                title: 'Upload Foto KTP',
                                description: _ktpFileName ?? 'Unggah foto KTP yang jelas dan tidak buram.',
                                icon: LucideIcons.camera,
                                fileName: _ktpFileName,
                                onTap: () => _pickFile('ktp'),
                              ),
                            ],
                          ),
                        ),
                      ] else ...[
                        _buildSectionCard(
                          title: 'Detail Usaha & Legalitas',
                          subtitle: 'Lengkapi informasi spesifik untuk verifikasi pendaftaran peran Anda.',
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              _buildTextField(
                                label: 'Nama Toko / Outlet',
                                controller: _storeNameController,
                                hintText: 'Nama Toko Anda',
                                validator: (value) => value == null || value.isEmpty ? 'Harus diisi' : null,
                              ),
                              const SizedBox(height: 16),
                              _buildDropdownField(
                                label: 'Pilih Kategori Bisnis',
                                controller: _businessCategoryController,
                                hintText: 'Pilih Kategori Bisnis',
                                options: ['Kuliner', 'Laundry', 'Kos', 'Marketplace', 'Catering'],
                              ),
                              const SizedBox(height: 16),
                              _buildTextField(
                                label: 'Nomor Induk Berusaha (NIB)',
                                controller: _nibController,
                                hintText: 'Nomor Induk Berusaha',
                                validator: (value) => value == null || value.isEmpty ? 'Harus diisi' : null,
                              ),
                              const SizedBox(height: 16),
                              _buildTextField(
                                label: 'Nomor NPWP Pemilik Usaha',
                                controller: _npwpController,
                                hintText: 'Nomor NPWP Pemilik Usaha',
                                validator: (value) => value == null || value.isEmpty ? 'Harus diisi' : null,
                              ),
                              const SizedBox(height: 16),
                              _buildTextField(
                                label: 'Alamat Lengkap Toko & GPS Koordinat',
                                controller: _addressController,
                                hintText: 'Alamat lengkap toko & GPS Koordinat...',
                                maxLines: 3,
                                validator: (value) => value == null || value.isEmpty ? 'Harus diisi' : null,
                              ),
                              const SizedBox(height: 20),
                              _buildUploadBox(
                                title: 'Upload KTP Pemilik',
                                description: _ownerKtpFileName ?? 'Unggah KTP pemilik usaha untuk verifikasi.',
                                icon: LucideIcons.idCard,
                                fileName: _ownerKtpFileName,
                                onTap: () => _pickFile('ownerKtp'),
                              ),
                              const SizedBox(height: 14),
                              _buildUploadBox(
                                title: 'Upload Foto Toko',
                                description: _storePhotoFileName ?? 'Unggah foto tampak depan toko atau outlet Anda.',
                                icon: LucideIcons.image,
                                fileName: _storePhotoFileName,
                                onTap: () => _pickFile('storePhoto'),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              _buildActionButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepIndicator() {
    return Row(
      children: [
        Expanded(
          child: Container(
            height: 8,
            decoration: BoxDecoration(
              color: AppColors.border,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(
                  flex: _currentStep == 0 ? 1 : 0,
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                Expanded(
                  flex: _currentStep == 1 ? 1 : 0,
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        Text(
          '${_currentStep + 1}/2',
          style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.textSecondary),
        ),
      ],
    );
  }

  Widget _buildTitleSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _currentStep == 0 ? 'Data Diri & NIK' : 'Detail Usaha & Legalitas',
          style: const TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.w900,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          _currentStep == 0
              ? 'Pastikan data sesuai dengan kartu identitas Anda yang berlaku.'
              : 'Lengkapi informasi spesifik untuk verifikasi pendaftaran peran Anda.',
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
            height: 1.6,
          ),
        ),
      ],
    );
  }

  Widget _buildSectionCard({
    required String title,
    required String subtitle,
    required Widget child,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 6),
          Text(
            subtitle,
            style: const TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.6),
          ),
          const SizedBox(height: 20),
          child,
        ],
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    String? hintText,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.textPrimary),
        ),
        const SizedBox(height: 10),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          maxLines: maxLines,
          validator: validator,
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: const TextStyle(color: AppColors.textMuted),
            filled: true,
            fillColor: AppColors.background,
            contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: AppColors.border),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: AppColors.primary),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDropdownField({
    required String label,
    required TextEditingController controller,
    required String hintText,
    required List<String> options,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.textPrimary),
        ),
        const SizedBox(height: 10),
        DropdownButtonFormField<String>(
          value: controller.text.isEmpty ? null : controller.text,
          items: options
              .map(
                (option) => DropdownMenuItem(
                  value: option,
                  child: Text(option),
                ),
              )
              .toList(),
          onChanged: (value) {
            if (value != null) {
              controller.text = value;
            }
          },
          validator: (value) => (value == null || value.isEmpty) ? 'Harus diisi' : null,
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: const TextStyle(color: AppColors.textMuted),
            filled: true,
            fillColor: AppColors.background,
            contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: AppColors.border),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(color: AppColors.primary),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUploadBox({
    required String title,
    required String description,
    required IconData icon,
    String? fileName,
    required VoidCallback onTap,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: AppColors.primary, size: 26),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
                const SizedBox(height: 6),
                Text(
                  fileName ?? description,
                  style: TextStyle(
                    fontSize: 13,
                    color: fileName == null ? AppColors.textSecondary : AppColors.primary,
                    height: 1.4,
                    fontWeight: fileName == null ? FontWeight.normal : FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          OutlinedButton(
            onPressed: onTap,
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: AppColors.primary.withOpacity(0.2)),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
            ),
            child: Text(
              fileName == null ? 'Pilih Berkas' : 'Ganti',
              style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton() {
    final buttonText = _currentStep == 0 ? 'Lanjutkan' : 'Kirim Pendaftaran';
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _nextStep,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        child: Text(
          buttonText,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
    );
  }
}
