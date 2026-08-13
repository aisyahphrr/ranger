import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/app_provider.dart';

class MitraLaundryRegistrationView extends StatefulWidget {
  const MitraLaundryRegistrationView({super.key});

  @override
  State<MitraLaundryRegistrationView> createState() => _MitraLaundryRegistrationViewState();
}

class _MitraLaundryRegistrationViewState extends State<MitraLaundryRegistrationView> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _nikController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _businessNameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();

  String? _ktpFileName;
  String? _ownerKtpFileName;

  @override
  void dispose() {
    _nameController.dispose();
    _nikController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _businessNameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _nextStep() async {
    if (_currentStep == 0) {
      if (_formKey.currentState?.validate() ?? false) {
        setState(() => _currentStep = 1);
      }
    } else {
      if (_formKey.currentState?.validate() ?? false) {
        final provider = Provider.of<AppProvider>(context, listen: false);
        await provider.registerLaundryOwner(
          ownerName: _nameController.text.trim(),
          businessName: _businessNameController.text.trim(),
          phone: _phoneController.text.trim().isEmpty ? 'Belum diisi' : _phoneController.text.trim(),
          address: _addressController.text.trim(),
          email: _emailController.text.trim(),
          password: _passwordController.text.trim(),
        );
        if (mounted) provider.navigate(AppScreen.laundryOwnerSuccess);
      }
    }
  }

  Future<void> _pickFile(String field) async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: const ['jpg', 'jpeg', 'png'],
    );

    if (result == null || result.files.single.name.isEmpty || !mounted) return;

    setState(() {
      final fileName = result.files.single.name;
      switch (field) {
        case 'ktp':
          _ktpFileName = fileName;
          break;
        case 'ownerKtp':
          _ownerKtpFileName = fileName;
          break;
      }
    });
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    String? hintText,
    bool obscureText = false,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
    int? maxLines,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w700)),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          maxLines: maxLines ?? 1,
          decoration: InputDecoration(
            hintText: hintText,
            filled: true,
            fillColor: const Color(0xFFF8FAFA),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          ),
          validator: validator,
        ),
      ],
    );
  }

  Widget _buildUploadBox({required String title, required String description, required IconData icon, String? fileName, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFF1F5F9)),
        ),
        child: Row(
          children: [
            Icon(icon, color: const Color(0xFF64748B)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
                  const SizedBox(height: 6),
                  Text(fileName ?? description, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Icon(LucideIcons.uploadCloud, size: 18, color: AppColors.textSecondary),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionCard({required String title, required String subtitle, required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
          const SizedBox(height: 6),
          Text(subtitle, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Widget _buildStepIndicator() {
    return Row(
      children: [
        Expanded(child: LinearProgressIndicator(value: (_currentStep + 1) / 2, color: AppColors.primary, backgroundColor: const Color(0xFFEFF6FF))),
      ],
    );
  }

  Widget _buildTitleSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: const [
        Text('Daftar Pemilik Laundry', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
        SizedBox(height: 6),
        Text('Lengkapi data untuk membuat akun pemilik laundry Anda.', style: TextStyle(color: AppColors.textSecondary))
      ],
    );
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
        title: const Text('Daftar Mitra', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold)),
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
                          title: 'Data Diri & Akun',
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
                              const SizedBox(height: 16),
                              _buildTextField(
                                label: 'Alamat Email',
                                controller: _emailController,
                                hintText: 'nama@domain.com',
                                keyboardType: TextInputType.emailAddress,
                                validator: (value) {
                                  if (value == null || value.isEmpty) return 'Harus diisi';
                                  if (!value.contains('@')) return 'Format email tidak valid';
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),
                              _buildTextField(
                                label: 'Password Akun Mitra',
                                controller: _passwordController,
                                hintText: 'Minimal 6 karakter',
                                obscureText: true,
                                validator: (value) {
                                  if (value == null || value.isEmpty) return 'Harus diisi';
                                  if (value.length < 6) return 'Password minimal 6 karakter';
                                  return null;
                                },
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
                          title: 'Detail Usaha',
                          subtitle: 'Lengkapi informasi usaha laundry Anda.',
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              _buildTextField(
                                label: 'Nama Usaha / Laundry',
                                controller: _businessNameController,
                                hintText: 'Nama Laundry Anda',
                                validator: (value) => value == null || value.isEmpty ? 'Harus diisi' : null,
                              ),
                              const SizedBox(height: 16),
                              _buildTextField(
                                label: 'Nomor Telepon',
                                controller: _phoneController,
                                hintText: '08xxxxxxxxxx',
                                keyboardType: TextInputType.phone,
                                validator: (value) => value == null || value.isEmpty ? 'Harus diisi' : null,
                              ),
                              const SizedBox(height: 16),
                              _buildTextField(
                                label: 'Alamat Lengkap',
                                controller: _addressController,
                                hintText: 'Alamat lengkap usaha',
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
                            ],
                          ),
                        ),
                      ],
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _nextStep,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                          child: Text(
                            _currentStep == 0 ? 'LANJUTKAN' : 'DAFTAR SEKARANG',
                            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
