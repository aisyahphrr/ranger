import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../providers/app_provider.dart';

class PemilikCateringSuccessView extends StatelessWidget {
  const PemilikCateringSuccessView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                    width: 92,
                    height: 92,
                    decoration: BoxDecoration(
                        color: Colors.amber.shade50, shape: BoxShape.circle),
                    child: const Icon(LucideIcons.checkCircle2,
                        color: Colors.amber, size: 48)),
                const SizedBox(height: 24),
                const Text('Pendaftaran Catering Tersimpan',
                    textAlign: TextAlign.center,
                    style:
                        TextStyle(fontSize: 23, fontWeight: FontWeight.w900)),
                const SizedBox(height: 10),
                const Text(
                    'Akun catering sudah dibuat. Anda dapat masuk dan mulai menyiapkan menu catering.',
                    textAlign: TextAlign.center,
                    style:
                        TextStyle(color: AppColors.textSecondary, height: 1.5)),
                const SizedBox(height: 26),
                SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                        onPressed: () => context
                            .read<AppProvider>()
                            .navigate(AppScreen.cateringOwnerDashboard),
                        child: const Text('Buka Dashboard Catering'))),
                TextButton(
                    onPressed: () => context
                        .read<AppProvider>()
                        .navigate(AppScreen.cateringOwnerLogin),
                    child: const Text('Masuk nanti')),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
