import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/app_provider.dart';

class LoginView extends StatefulWidget {
  const LoginView({super.key});

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final TextEditingController _phoneController = TextEditingController(text: "81234567890");

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context, listen: false);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: AppColors.secondary,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(LucideIcons.store, color: AppColors.primary, size: 30),
              ),
              const SizedBox(height: 24),
              const Text(
                "Selamat Datang 👋",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.textPrimary),
              ),
              const SizedBox(height: 6),
              const Text(
                "Masukan nomor HP untuk masuk atau mendaftar di Rangers App",
                style: TextStyle(fontSize: 14, color: AppColors.textSecondary, height: 1.4),
              ),
              const SizedBox(height: 32),

              // Phone Number Input
              const Text("Nomor Telepon", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    const Text("+62 ", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Expanded(
                      child: TextField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        decoration: const InputDecoration(
                          border: InputBorder.none,
                          hintText: "812-xxxx-xxxx",
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Kirim OTP Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () => provider.navigate(AppScreen.otp),
                  child: const Text("Lanjutkan", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 24),

              Row(
                children: [
                  Expanded(child: Container(height: 1, color: AppColors.border)),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12),
                    child: Text("atau", style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                  ),
                  Expanded(child: Container(height: 1, color: AppColors.border)),
                ],
              ),
              const SizedBox(height: 24),

              // Google Login Button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    side: const BorderSide(color: AppColors.border),
                  ),
                  onPressed: () => provider.navigate(AppScreen.role),
                  icon: const Icon(LucideIcons.globe, size: 20, color: Colors.blue),
                  label: const Text("Lanjutkan dengan Google", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                ),
              ),

              const Spacer(),
              const Center(
                child: Text(
                  "Dengan masuk, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi Rangers App.",
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 11, color: AppColors.textMuted, height: 1.4),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
