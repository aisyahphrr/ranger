import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../core/theme/app_theme.dart';
import '../providers/app_provider.dart';
import 'customer/customer_home_view.dart';
import 'customer/customer_explore_view.dart';
import 'customer/customer_orders_view.dart';
import 'customer/customer_inbox_view.dart';
import 'customer/customer_profile_view.dart';

class CustomerMainLayout extends StatelessWidget {
  const CustomerMainLayout({super.key});

  static const List<Widget> _views = [
    CustomerHomeView(),
    CustomerExploreView(),
    CustomerOrdersView(),
    CustomerInboxView(),
    CustomerProfileView(),
  ];

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);

    return Scaffold(
      body: IndexedStack(
        index: appState.customerTabIndex,
        children: _views,
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: AppColors.border, width: 0.5)),
        ),
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          children: [
            _NavItem(
              icon: LucideIcons.home,
              label: "Beranda",
              active: appState.customerTabIndex == 0,
              onTap: () => appState.setCustomerTab(0),
            ),
            _NavItem(
              icon: LucideIcons.map,
              label: "Jelajah",
              active: appState.customerTabIndex == 1,
              outlinedActive: true,
              onTap: () => appState.setCustomerTab(1),
            ),
            _NavItem(
              icon: LucideIcons.shoppingBag,
              label: "Pesanan",
              active: appState.customerTabIndex == 2,
              badge: appState.orders.isNotEmpty
                  ? appState.orders.length.toString()
                  : null,
              onTap: () => appState.setCustomerTab(2),
            ),
            _NavItem(
              icon: LucideIcons.messageCircle,
              label: "Inbox",
              active: appState.customerTabIndex == 3,
              badge: appState.unreadInboxCount > 0
                  ? appState.unreadInboxCount.toString()
                  : null,
              onTap: () => appState.setCustomerTab(3),
            ),
            _NavItem(
              icon: LucideIcons.user,
              label: "Profil",
              active: appState.customerTabIndex == 4,
              onTap: () => appState.setCustomerTab(4),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool active;
  final bool outlinedActive;
  final String? badge;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.active,
    this.outlinedActive = false,
    this.badge,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 3),
          padding: const EdgeInsets.symmetric(vertical: 4),
          decoration: BoxDecoration(
            color: active && outlinedActive ? Colors.white : Colors.transparent,
            border: active && outlinedActive
                ? Border.all(color: AppColors.primary, width: 1)
                : null,
            borderRadius: BorderRadius.circular(outlinedActive ? 5 : 16),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: active && !outlinedActive ? 30 : null,
                    height: active && !outlinedActive ? 30 : null,
                    alignment: Alignment.center,
                    padding: EdgeInsets.symmetric(
                      horizontal: active && !outlinedActive ? 0 : 14,
                      vertical: 1,
                    ),
                    decoration: active && !outlinedActive
                        ? const BoxDecoration(
                            color: AppColors.secondary,
                            shape: BoxShape.circle,
                          )
                        : null,
                    child: Icon(
                      icon,
                      size: 20,
                      color: active ? AppColors.primary : AppColors.textMuted,
                    ),
                  ),
                  if (badge != null && !active)
                    Positioned(
                      right: 0,
                      top: -3,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 4, vertical: 1),
                        decoration: BoxDecoration(
                          color: AppColors.accent,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          badge!,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 2),
              Text(
                label,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: active ? AppColors.primary : AppColors.textMuted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
