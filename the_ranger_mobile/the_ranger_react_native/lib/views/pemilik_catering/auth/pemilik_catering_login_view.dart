import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../providers/app_provider.dart';

class PemilikCateringLoginView extends StatefulWidget {
  const PemilikCateringLoginView({super.key});

  @override
  State<PemilikCateringLoginView> createState() =>
      _PemilikCateringLoginViewState();
}

class _PemilikCateringLoginViewState extends State<PemilikCateringLoginView> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isFocusedEmail = false;
  bool _isFocusedPassword = false;
  bool _obscurePassword = true;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Email dan password harus diisi!');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final success = await context.read<AppProvider>().loginCateringOwner(
          email,
          password,
        );

    if (!mounted) return;
    setState(() {
      _isLoading = false;
      _errorMessage = success ? null : 'Email atau password catering salah!';
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.read<AppProvider>();

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 480),
            child: SingleChildScrollView(
              keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(
                horizontal: 28,
                vertical: 24,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 16),
                  Center(
                    child: Container(
                      width: 70,
                      height: 70,
                      decoration: BoxDecoration(
                        color: AppColors.secondary,
                        borderRadius: BorderRadius.circular(22),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withValues(alpha: 0.1),
                            blurRadius: 15,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: const Icon(
                        LucideIcons.store,
                        color: AppColors.primary,
                        size: 36,
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),
                  const Text(
                    'Selamat Datang',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      color: AppColors.textPrimary,
                      letterSpacing: -0.6,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Masuk ke dashboard dapur Anda dengan email dan password pemilik catering.',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 28),
                  if (_errorMessage != null) ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.red.shade200),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            LucideIcons.alertCircle,
                            color: Colors.red.shade700,
                            size: 20,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              _errorMessage!,
                              style: TextStyle(
                                color: Colors.red.shade900,
                                fontWeight: FontWeight.w600,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                  _buildFieldLabel('Alamat Email'),
                  const SizedBox(height: 8),
                  _buildEmailField(),
                  const SizedBox(height: 18),
                  _buildFieldLabel('Password Akun'),
                  const SizedBox(height: 8),
                  _buildPasswordField(),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        elevation: 2,
                        shadowColor: AppColors.primary.withValues(alpha: 0.3),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      onPressed: _isLoading ? null : _login,
                      child: _isLoading
                          ? const SizedBox(
                              width: 22,
                              height: 22,
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                color: Colors.white,
                              ),
                            )
                          : const Text(
                              'Masuk sebagai Pemilik Catering',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Belum punya akun catering? ',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                        ),
                      ),
                      GestureDetector(
                        onTap: () => provider.navigate(
                          AppScreen.cateringOwnerRegistration,
                        ),
                        child: const Text(
                          'Daftar Catering',
                          style: TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          height: 1,
                          color: AppColors.border,
                        ),
                      ),
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'atau',
                          style: TextStyle(
                            color: AppColors.textMuted,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Container(
                          height: 1,
                          color: AppColors.border,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        side: const BorderSide(
                          color: AppColors.border,
                          width: 1.5,
                        ),
                        backgroundColor: Colors.white,
                        foregroundColor: AppColors.textPrimary,
                      ),
                      onPressed: () => provider.navigate(AppScreen.role),
                      icon: Image.network(
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/24px-Google_%22G%22_logo.svg.png',
                        width: 20,
                        height: 20,
                        errorBuilder: (context, error, stackTrace) =>
                            const Icon(
                          LucideIcons.globe,
                          size: 20,
                          color: Colors.blue,
                        ),
                      ),
                      label: const Text(
                        'Lanjutkan dengan Google',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 48),
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Text(
                        'Dengan masuk, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi Rangers App.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                          height: 1.5,
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

  Widget _buildFieldLabel(String label) {
    return Text(
      label,
      style: const TextStyle(
        fontSize: 13,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
      ),
    );
  }

  Widget _buildEmailField() {
    return Focus(
      onFocusChange: (hasFocus) => setState(() {
        _isFocusedEmail = hasFocus;
      }),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: _isFocusedEmail ? AppColors.primary : AppColors.border,
            width: _isFocusedEmail ? 2 : 1,
          ),
          boxShadow: _isFocusedEmail
              ? [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.15),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [],
        ),
        child: TextField(
          controller: _emailController,
          keyboardType: TextInputType.emailAddress,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            color: AppColors.textPrimary,
          ),
          decoration: const InputDecoration(
            border: InputBorder.none,
            hintText: 'nama@domain.com',
            hintStyle: TextStyle(
              color: AppColors.textMuted,
              fontWeight: FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPasswordField() {
    return Focus(
      onFocusChange: (hasFocus) => setState(() {
        _isFocusedPassword = hasFocus;
      }),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: _isFocusedPassword ? AppColors.primary : AppColors.border,
            width: _isFocusedPassword ? 2 : 1,
          ),
          boxShadow: _isFocusedPassword
              ? [
                  BoxShadow(
                    color: AppColors.primary.withValues(alpha: 0.15),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [],
        ),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _passwordController,
                obscureText: _obscurePassword,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: AppColors.textPrimary,
                ),
                decoration: const InputDecoration(
                  border: InputBorder.none,
                  hintText: '••••••••',
                  hintStyle: TextStyle(
                    color: AppColors.textMuted,
                    fontWeight: FontWeight.normal,
                  ),
                ),
              ),
            ),
            IconButton(
              icon: Icon(
                _obscurePassword ? LucideIcons.eyeOff : LucideIcons.eye,
                color: AppColors.textSecondary,
                size: 20,
              ),
              onPressed: () => setState(() {
                _obscurePassword = !_obscurePassword;
              }),
            ),
          ],
        ),
      ),
    );
  }
}
