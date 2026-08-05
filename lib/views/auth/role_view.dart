import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/app_provider.dart';

class RoleView extends StatelessWidget {
  const RoleView({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context, listen: false);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 500), // Clean layout constraint on web/desktop
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      minHeight: constraints.maxHeight,
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const SizedBox(height: 16),
                          
                          // Custom back button to go back to Login/OTP
                          IconButton(
                            onPressed: () => provider.navigate(AppScreen.login),
                            icon: const Icon(LucideIcons.arrowLeft, color: AppColors.textPrimary),
                            style: IconButton.styleFrom(
                              backgroundColor: Colors.white,
                              shadowColor: Colors.black.withValues(alpha: 0.05),
                              elevation: 2,
                              padding: const EdgeInsets.all(12),
                            ),
                          ),
                          const SizedBox(height: 36),

                          // Header Title
                          const Text(
                            "Saya ingin...",
                            style: TextStyle(
                              fontSize: 30,
                              fontWeight: FontWeight.w900,
                              color: AppColors.textPrimary,
                              letterSpacing: -0.8,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            "Pilih peran Anda di Rangers App untuk memulai layanan terbaik kami.",
                            style: TextStyle(
                              fontSize: 15,
                              color: AppColors.textSecondary,
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: 40),

                          // Option 1: Customer Card (Memesan Layanan)
                          _buildRoleCard(
                            context: context,
                            title: "Memesan Layanan",
                            description: "Belanja produk UMKM lokal, pesan catering harian, laundry cepat, & info kos terbaik.",
                            badgeText: "Pelanggan",
                            icon: LucideIcons.shoppingBag,
                            iconColor: AppColors.primary,
                            iconBg: AppColors.secondary,
                            borderColor: AppColors.primary.withValues(alpha: 0.4),
                            glowColor: AppColors.primary.withValues(alpha: 0.1),
                            onTap: () => provider.setRole(UserRole.customer),
                          ),
                          const SizedBox(height: 20),

                          // Option 2: Driver/Mitra Card (Menjadi Mitra & Driver)
                          _buildRoleCard(
                            context: context,
                            title: "Menjadi Mitra & Driver",
                            description: "Kirim pesanan komunitas Kamojang, dapatkan penghasilan tambahan, & majukan ekonomi lokal.",
                            badgeText: "Mitra Driver",
                            icon: LucideIcons.bike,
                            iconColor: AppColors.accent,
                            iconBg: Colors.orange.shade50,
                            borderColor: AppColors.accent.withValues(alpha: 0.4),
                            glowColor: AppColors.accent.withValues(alpha: 0.1),
                            onTap: () => provider.navigate(AppScreen.mitraRole),
                          ),
                          
                          const SizedBox(height: 32),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRoleCard({
    required BuildContext context,
    required String title,
    required String description,
    required String badgeText,
    required IconData icon,
    required Color iconColor,
    required Color iconBg,
    required Color borderColor,
    required Color glowColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: borderColor, width: 2),
          boxShadow: [
            BoxShadow(
              color: glowColor,
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        padding: const EdgeInsets.all(20),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left Side: Rounded Icon Badge
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: iconColor, size: 26),
            ),
            const SizedBox(width: 16),
            
            // Middle: Text details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Little Tag/Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: iconBg,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      badgeText,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: iconColor,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  
                  // Role Title
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  
                  // Role Description
                  Text(
                    description,
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            
            // Right Side: Forward Chevron
            const Padding(
              padding: EdgeInsets.only(top: 4.0),
              child: Icon(
                LucideIcons.chevronRight,
                color: AppColors.textMuted,
                size: 20,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
