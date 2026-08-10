import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_provider.dart';
import 'customer_review_view.dart';
import 'customer_tracking_view.dart';

class CustomerOrdersView extends StatefulWidget {
  const CustomerOrdersView({super.key});

  @override
  State<CustomerOrdersView> createState() => _CustomerOrdersViewState();
}

class _CustomerOrdersViewState extends State<CustomerOrdersView> {
  int _selectedTab = 0;

  List<OrderModel> _ordersForTab(List<OrderModel> orders) {
    switch (_selectedTab) {
      case 0:
        return orders
            .where((order) =>
                order.status != 'Selesai' &&
                !order.status.toLowerCase().contains('batal'))
            .toList(growable: false);
      case 1:
        return orders
            .where((order) => order.status == 'Selesai')
            .toList(growable: false);
      case 2:
        return orders
            .where((order) => order.status.toLowerCase().contains('batal'))
            .toList(growable: false);
      default:
        return orders;
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);
    final orders = _ordersForTab(appState.orders);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Padding(
              padding: EdgeInsets.fromLTRB(13, 9, 13, 0),
              child: Text(
                'Pesanan Saya',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            const SizedBox(height: 10),
            _OrderTabs(
              selectedIndex: _selectedTab,
              onChanged: (index) => setState(() => _selectedTab = index),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: orders.isEmpty
                  ? _EmptyOrders(tabIndex: _selectedTab)
                  : ListView.builder(
                      padding: const EdgeInsets.fromLTRB(8, 0, 8, 24),
                      itemCount: orders.length,
                      itemBuilder: (context, index) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: _OrderCard(order: orders[index]),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OrderTabs extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onChanged;

  const _OrderTabs({
    required this.selectedIndex,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    const labels = ['Aktif', 'Selesai', 'Dibatalkan'];

    return Container(
      height: 38,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        color: const Color(0xFFF0F3F2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          for (var index = 0; index < labels.length; index++)
            Expanded(
              child: GestureDetector(
                onTap: () => onChanged(index),
                behavior: HitTestBehavior.opaque,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: selectedIndex == index
                        ? Colors.white
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(17),
                    boxShadow: selectedIndex == index
                        ? [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.08),
                              blurRadius: 3,
                              offset: const Offset(0, 1),
                            ),
                          ]
                        : null,
                  ),
                  child: Text(
                    labels[index],
                    style: TextStyle(
                      color: selectedIndex == index
                          ? AppColors.primary
                          : AppColors.textSecondary,
                      fontSize: 11,
                      fontWeight: selectedIndex == index
                          ? FontWeight.w700
                          : FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final OrderModel order;

  const _OrderCard({required this.order});

  @override
  Widget build(BuildContext context) {
    final status = _statusStyle(order.status);
    final isCompleted = order.status == 'Selesai';
    final appState = Provider.of<AppProvider>(context, listen: false);
    final hasReview =
        appState.reviews.any((review) => review.orderId == order.id);

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 15, 16, 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: const Color(0xFFE6EBE9)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _ServiceIcon(order.type),
              const SizedBox(width: 10),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(top: 1),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '#${order.id} · ${order.type}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        order.item,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        order.detail,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              _StatusPill(label: status.label, style: status),
            ],
          ),
          const Padding(
            padding: EdgeInsets.only(top: 12),
            child: Divider(height: 1, color: Color(0xFFE5E9E7)),
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      order.date,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 10,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      _formatRupiah(order.total),
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
              if (isCompleted && !hasReview) ...[
                _SecondaryAction(
                  label: 'Ulasan',
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => CustomerReviewView(order: order),
                    ),
                  ),
                ),
                const SizedBox(width: 6),
              ],
              if (!order.status.toLowerCase().contains('batal'))
                _TrackButton(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => CustomerTrackingView(order: order),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ServiceIcon extends StatelessWidget {
  final String type;

  const _ServiceIcon(this.type);

  @override
  Widget build(BuildContext context) {
    final normalizedType = type.toLowerCase();
    final IconData icon;
    final Color foreground;
    final Color background;

    if (normalizedType.contains('market')) {
      icon = LucideIcons.store;
      foreground = AppColors.marketplaceColor;
      background = AppColors.marketplaceBg;
    } else if (normalizedType.contains('cater')) {
      icon = LucideIcons.coffee;
      foreground = AppColors.cateringColor;
      background = AppColors.cateringBg;
    } else if (normalizedType.contains('laundry')) {
      icon = LucideIcons.wind;
      foreground = AppColors.laundryColor;
      background = AppColors.laundryBg;
    } else if (normalizedType.contains('kos')) {
      icon = LucideIcons.building;
      foreground = AppColors.kosColor;
      background = AppColors.kosBg;
    } else {
      icon = LucideIcons.truck;
      foreground = const Color(0xFFFF9800);
      background = const Color(0xFFFFF4D8);
    }

    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: background,
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: foreground, size: 20),
    );
  }
}

class _OrderStatusStyle {
  final String label;
  final Color foreground;
  final Color background;

  const _OrderStatusStyle({
    required this.label,
    required this.foreground,
    required this.background,
  });
}

_OrderStatusStyle _statusStyle(String status) {
  final normalized = status.toLowerCase();
  if (normalized == 'dikirim') {
    return const _OrderStatusStyle(
      label: 'Dikirim',
      foreground: Color(0xFF2C6BC4),
      background: Color(0xFFDCEAFF),
    );
  }
  if (normalized.contains('batal')) {
    return const _OrderStatusStyle(
      label: 'Dibatalkan',
      foreground: Color(0xFFB42318),
      background: Color(0xFFFFE4E1),
    );
  }
  if (normalized == 'selesai') {
    return const _OrderStatusStyle(
      label: 'Selesai',
      foreground: Color(0xFF17864D),
      background: Color(0xFFD7F5E4),
    );
  }
  if (normalized == 'aktif') {
    return const _OrderStatusStyle(
      label: 'Aktif',
      foreground: Color(0xFF17864D),
      background: Color(0xFFD7F5E4),
    );
  }
  return _OrderStatusStyle(
    label: status.isEmpty ? 'Diproses' : status,
    foreground: const Color(0xFFE45B0C),
    background: const Color(0xFFFFE8D7),
  );
}

class _StatusPill extends StatelessWidget {
  final String label;
  final _OrderStatusStyle style;

  const _StatusPill({required this.label, required this.style});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: style.background,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: style.foreground,
          fontSize: 9,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _TrackButton extends StatelessWidget {
  final VoidCallback onPressed;

  const _TrackButton({required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        minimumSize: const Size(59, 28),
        padding: const EdgeInsets.symmetric(horizontal: 13),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
        textStyle: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w800,
        ),
      ),
      child: const Text('Lacak'),
    );
  }
}

class _SecondaryAction extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;

  const _SecondaryAction({required this.label, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(54, 28),
        padding: const EdgeInsets.symmetric(horizontal: 8),
        foregroundColor: AppColors.primary,
        side: const BorderSide(color: AppColors.primary),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
        textStyle: const TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w700,
        ),
      ),
      child: Text(label),
    );
  }
}

String _formatRupiah(int value) {
  final formatted = value
      .toString()
      .replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (match) {
    return '${match[1]}.';
  });
  return 'Rp $formatted';
}

class _EmptyOrders extends StatelessWidget {
  final int tabIndex;

  const _EmptyOrders({required this.tabIndex});

  @override
  Widget build(BuildContext context) {
    final message = switch (tabIndex) {
      0 => 'Belum ada pesanan aktif.',
      1 => 'Belum ada pesanan selesai.',
      2 => 'Belum ada pesanan dibatalkan.',
      _ => 'Belum ada pesanan.',
    };

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 70,
              height: 70,
              decoration: const BoxDecoration(
                color: AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                LucideIcons.shoppingBag,
                size: 30,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 14),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 14,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Pesanan dari layanan yang Anda pilih akan tampil di sini.',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 11,
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
