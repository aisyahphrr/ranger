import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color primary = Color(0xFF1B7A4E);
  static const Color primaryHeaderStart = Color(0xFF0D5C36);
  static const Color primaryHeaderEnd = Color(0xFF1B7A4E);
  static const Color primaryDark = Color(0xFF0D3C26);
  static const Color primaryLight = Color(0xFFE8F5EE);
  static const Color secondary = Color(0xFFE8F5EE); // Soft green for active nav
  static const Color background = Color(0xFFF7FAF8);
  static const Color cardBg = Colors.white;
  
  static const Color textPrimary = Color(0xFF111827);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textMuted = Color(0xFF9CA3AF);

  static const Color border = Color(0xFFE5E7EB);

  // Service specific colors
  static const Color marketplaceColor = Color(0xFF1B7A4E);
  static const Color marketplaceBg = Color(0xFFE8F5EE);
  
  static const Color cateringColor = Color(0xFFFF7043);
  static const Color cateringBg = Color(0xFFFFF3E0);

  static const Color laundryColor = Color(0xFF2196F3);
  static const Color laundryBg = Color(0xFFE3F2FD);

  static const Color kosColor = Color(0xFF9C27B0);
  static const Color kosBg = Color(0xFFF3E5F5);

  static const Color accent = Color(0xFFFF7043);
  static const Color ratingAmber = Color(0xFFFFC107);
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        primary: AppColors.primary,
        secondary: AppColors.secondary,
        surface: AppColors.background,
      ),
      scaffoldBackgroundColor: AppColors.background,
      textTheme: GoogleFonts.plusJakartaSansTextTheme().copyWith(
        titleLarge: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.textPrimary),
        bodyMedium: const TextStyle(color: AppColors.textPrimary),
        bodySmall: const TextStyle(color: AppColors.textSecondary),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0.5,
        centerTitle: true,
        iconTheme: IconThemeData(color: AppColors.textPrimary),
        titleTextStyle: TextStyle(
          color: AppColors.textPrimary,
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
