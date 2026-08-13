import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../../core/theme/app_theme.dart';

class CateringEmptyState extends StatelessWidget {
  const CateringEmptyState(
      {required this.title,
      required this.message,
      this.icon = LucideIcons.cookingPot,
      super.key});

  final String title;
  final String message;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border)),
      child: Column(
        children: [
          Icon(icon, color: Colors.amber.shade800, size: 36),
          const SizedBox(height: 12),
          Text(title,
              style:
                  const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
          const SizedBox(height: 5),
          Text(message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: AppColors.textSecondary, fontSize: 12, height: 1.5)),
        ],
      ),
    );
  }
}
