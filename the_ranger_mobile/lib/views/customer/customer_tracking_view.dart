import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_provider.dart';
import 'customer_chat_view.dart';

class CustomerTrackingView extends StatelessWidget {
  final OrderModel order;

  const CustomerTrackingView({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    final progress = _progressForStatus(order.status);
    final subtotal = order.lines.isEmpty
        ? order.total
        : order.lines.fold<int>(0, (sum, line) => sum + line.total);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        automaticallyImplyLeading: true,
        centerTitle: false,
        toolbarHeight: 44,
        titleSpacing: 0,
        title: Text(
          'Lacak Order: #${order.id}',
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 16,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          _TrackingMap(
            order: order,
            progress: progress,
          ),
          const SizedBox(height: 10),
          const _UnavailableEtaBanner(),
          const SizedBox(height: 10),
          _AddressCard(address: order.address),
          const SizedBox(height: 10),
          _StoreChatCard(order: order),
          const SizedBox(height: 10),
          _DriverCard(order: order),
          const SizedBox(height: 10),
          _PaymentSummary(
            order: order,
            subtotal: subtotal,
          ),
          const SizedBox(height: 16),
        ],
      ),
      bottomNavigationBar: _TrackingActions(
        onDelay: () => Navigator.pop(context),
        onSpeedUp: () => ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Permintaan percepat pengiriman akan tersedia setelah terhubung ke backend.',
            ),
          ),
        ),
      ),
    );
  }
}

class _TrackingMap extends StatelessWidget {
  final OrderModel order;
  final double progress;

  const _TrackingMap({required this.order, required this.progress});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 242,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned.fill(
            child: CustomPaint(
              painter: _RouteMapPainter(progress: progress),
            ),
          ),
          Positioned(
            top: 23,
            left: 66,
            child: _MapLabel(label: order.detail),
          ),
          const Positioned(
            top: 48,
            left: 208,
            child: _MapPin(
              color: Color(0xFFFF3D55),
              icon: LucideIcons.store,
              size: 26,
            ),
          ),
          const Positioned(
            top: 114,
            left: 177,
            child: _MapCurrentPosition(),
          ),
          const Positioned(
            top: 159,
            left: 111,
            child: _MapPin(
              color: Color(0xFF2F72E8),
              icon: LucideIcons.mapPin,
              size: 21,
            ),
          ),
          Positioned(
            left: 8,
            right: 8,
            bottom: -1,
            child: _ProgressCard(progress: progress),
          ),
        ],
      ),
    );
  }
}

class _RouteMapPainter extends CustomPainter {
  final double progress;

  const _RouteMapPainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final background = Paint()..color = const Color(0xFFF0F5FA);
    canvas.drawRect(Offset.zero & size, background);

    final blockPaint = Paint()..color = const Color(0xFFF7F9FC);
    const blocks = <Rect>[
      Rect.fromLTWH(66, 13, 83, 36),
      Rect.fromLTWH(187, 13, 85, 36),
      Rect.fromLTWH(66, 85, 83, 70),
      Rect.fromLTWH(187, 85, 85, 70),
      Rect.fromLTWH(66, 169, 83, 39),
      Rect.fromLTWH(187, 169, 85, 39),
    ];
    for (final block in blocks) {
      canvas.drawRRect(
        RRect.fromRectAndRadius(block, const Radius.circular(5)),
        blockPaint,
      );
    }

    final roadPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.95)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 18
      ..strokeCap = StrokeCap.round;
    final roads = [
      Path()
        ..moveTo(size.width * 0.49, -10)
        ..lineTo(size.width * 0.49, size.height + 10),
      Path()
        ..moveTo(-10, size.height * 0.56)
        ..cubicTo(size.width * 0.28, size.height * 0.6, size.width * 0.63,
            size.height * 0.49, size.width + 10, size.height * 0.69),
    ];
    for (final road in roads) {
      canvas.drawPath(road, roadPaint);
    }

    final routePaint = Paint()
      ..color = const Color(0xFF2D7EF5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.square;
    final route = Path()
      ..moveTo(size.width * 0.49, size.height * 0.93)
      ..lineTo(size.width * 0.49, size.height * 0.25)
      ..lineTo(size.width * 0.64, size.height * 0.25)
      ..lineTo(size.width * 0.64, size.height * 0.13);
    canvas.drawPath(route, routePaint);

    final routeDashPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.65)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    canvas.drawLine(
      Offset(size.width * 0.49, 0),
      Offset(size.width * 0.49, size.height),
      routeDashPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _RouteMapPainter oldDelegate) =>
      oldDelegate.progress != progress;
}

class _MapLabel extends StatelessWidget {
  final String label;

  const _MapLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 96),
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.86),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label.isEmpty ? 'Marketplace' : label,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(
          color: AppColors.textSecondary,
          fontSize: 9,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _MapPin extends StatelessWidget {
  final Color color;
  final IconData icon;
  final double size;

  const _MapPin({required this.color, required this.icon, required this.size});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        boxShadow: const [
          BoxShadow(
            color: Colors.white,
            blurRadius: 0,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Icon(icon, color: Colors.white, size: size * 0.55),
    );
  }
}

class _MapCurrentPosition extends StatelessWidget {
  const _MapCurrentPosition();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        color: const Color(0xFF62D9B3),
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 3),
        boxShadow: const [
          BoxShadow(
            color: Color(0x4455CFA5),
            blurRadius: 0,
            spreadRadius: 5,
          ),
        ],
      ),
      child: const Icon(
        LucideIcons.navigation,
        color: Colors.white,
        size: 12,
      ),
    );
  }
}

class _ProgressCard extends StatelessWidget {
  final double progress;

  const _ProgressCard({required this.progress});

  @override
  Widget build(BuildContext context) {
    final percentage = (progress * 100).round();
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 10, 12, 9),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: const Color(0xFFE7EBED)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x22000000),
            blurRadius: 5,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Text(
                'PROGRESS PENGIRIMAN',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 9,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const Spacer(),
              Text(
                '$percentage%',
                style: const TextStyle(
                  color: AppColors.primary,
                  fontSize: 9,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(5),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 6,
              backgroundColor: const Color(0xFFEFF2F0),
              valueColor:
                  const AlwaysStoppedAnimation<Color>(AppColors.primary),
            ),
          ),
        ],
      ),
    );
  }
}

class _UnavailableEtaBanner extends StatelessWidget {
  const _UnavailableEtaBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 29,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      padding: const EdgeInsets.only(left: 13, right: 5),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Expanded(
            child: Text(
              'Estimasi tiba belum tersedia',
              style: TextStyle(
                color: Colors.white,
                fontSize: 11,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.alarm,
              color: Colors.white,
              size: 14,
            ),
          ),
        ],
      ),
    );
  }
}

class _AddressCard extends StatelessWidget {
  final String address;

  const _AddressCard({required this.address});

  @override
  Widget build(BuildContext context) {
    return _WhiteCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'ALAMAT PENGIRIMAN',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 9,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 7),
          Text(
            address.isEmpty ? 'Alamat pengiriman belum tersedia' : address,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 11,
              height: 1.25,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

class _StoreChatCard extends StatelessWidget {
  final OrderModel order;

  const _StoreChatCard({required this.order});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context, listen: false);
    return _WhiteCard(
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: const BoxDecoration(
              color: AppColors.primaryLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              LucideIcons.store,
              color: AppColors.primary,
              size: 20,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  order.detail.isEmpty ? 'Toko' : order.detail,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 3),
                const Text(
                  'Hubungi toko terkait pesanan',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          _ChatActionButton(
            onTap: () {
              final thread = appState.ensureChatThread(
                order: order,
                participantType: 'store',
              );
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => CustomerChatView(
                    threadId: thread.id,
                    orderId: order.id,
                    participantType: 'store',
                    participantName: thread.participantName,
                    order: order,
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _DriverCard extends StatelessWidget {
  final OrderModel order;

  const _DriverCard({required this.order});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context, listen: false);
    final hasDriver = order.hasAssignedDriver;
    final driverName = order.driverName?.trim().isNotEmpty ?? false
        ? order.driverName!.trim()
        : 'Driver belum ditugaskan';
    final vehicle = order.driverVehicle?.trim().isNotEmpty ?? false
        ? order.driverVehicle!.trim()
        : 'Detail driver akan tampil setelah tersedia.';

    return _WhiteCard(
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: const BoxDecoration(
              color: AppColors.primaryLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              LucideIcons.bike,
              color: AppColors.primary,
              size: 20,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  driverName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  vehicle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
          ),
          _CircleAction(
            icon: LucideIcons.messageCircle,
            enabled: hasDriver,
            onTap: () {
              if (!hasDriver) return;
              final thread = appState.ensureChatThread(
                order: order,
                participantType: 'driver',
              );
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => CustomerChatView(
                    threadId: thread.id,
                    orderId: order.id,
                    participantType: 'driver',
                    participantName: thread.participantName,
                    order: order,
                  ),
                ),
              );
            },
          ),
          const SizedBox(width: 7),
          _CircleAction(
            icon: LucideIcons.phone,
            enabled:
                hasDriver && (order.driverPhone?.trim().isNotEmpty ?? false),
            onTap: () => ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Kontak telepon driver siap diintegrasikan.'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ChatActionButton extends StatelessWidget {
  final VoidCallback onTap;

  const _ChatActionButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.primaryLight,
      borderRadius: BorderRadius.circular(17),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(17),
        child: const Padding(
          padding: EdgeInsets.symmetric(horizontal: 11, vertical: 8),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                LucideIcons.messageCircle,
                color: AppColors.primary,
                size: 15,
              ),
              SizedBox(width: 4),
              Text(
                'Chat',
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CircleAction extends StatelessWidget {
  final IconData icon;
  final bool enabled;
  final VoidCallback onTap;

  const _CircleAction({
    required this.icon,
    required this.enabled,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: enabled ? AppColors.primaryLight : const Color(0xFFF0F3F2),
      shape: const CircleBorder(),
      child: InkWell(
        onTap: enabled ? onTap : null,
        customBorder: const CircleBorder(),
        child: SizedBox(
          width: 34,
          height: 34,
          child: Icon(
            icon,
            color: enabled ? AppColors.primary : AppColors.textMuted,
            size: 17,
          ),
        ),
      ),
    );
  }
}

class _PaymentSummary extends StatelessWidget {
  final OrderModel order;
  final int subtotal;

  const _PaymentSummary({required this.order, required this.subtotal});

  @override
  Widget build(BuildContext context) {
    return _WhiteCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'RINCIAN PEMBAYARAN AKHIR',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 9,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 10),
          _SummaryRow(
            label: 'Subtotal Belanja',
            value: _formatRupiah(subtotal),
          ),
          const SizedBox(height: 7),
          const _SummaryRow(
            label: 'Ongkir Kurir',
            value: 'Belum tersedia',
            valueColor: AppColors.textSecondary,
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10),
            child: Divider(height: 1, color: Color(0xFFE5E9E7)),
          ),
          _SummaryRow(
            label: 'Metode Pembayaran',
            value: order.paymentMethod.isEmpty
                ? 'Belum dipilih'
                : order.paymentMethod,
            labelWeight: FontWeight.w700,
            valueColor: AppColors.primary,
          ),
          const SizedBox(height: 9),
          _SummaryRow(
            label: 'Total Dibayar',
            value: _formatRupiah(order.total),
            labelWeight: FontWeight.w800,
            valueColor: AppColors.primary,
            valueWeight: FontWeight.w900,
          ),
        ],
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;
  final FontWeight labelWeight;
  final FontWeight valueWeight;

  const _SummaryRow({
    required this.label,
    required this.value,
    this.valueColor,
    this.labelWeight = FontWeight.normal,
    this.valueWeight = FontWeight.normal,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            label,
            style: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 11,
              fontWeight: labelWeight,
            ),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: valueColor ?? AppColors.textPrimary,
            fontSize: 11,
            fontWeight: valueWeight,
          ),
        ),
      ],
    );
  }
}

class _WhiteCard extends StatelessWidget {
  final Widget child;

  const _WhiteCard({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: const Color(0xFFE6EBE9)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: child,
    );
  }
}

class _TrackingActions extends StatelessWidget {
  final VoidCallback onDelay;
  final VoidCallback onSpeedUp;

  const _TrackingActions({required this.onDelay, required this.onSpeedUp});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Container(
        padding: const EdgeInsets.fromLTRB(8, 8, 8, 7),
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: onSpeedUp,
                icon: const Icon(Icons.double_arrow, size: 13),
                label: const Text('Percepat Pengiriman'),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(34),
                  backgroundColor: const Color(0xFFFFC400),
                  foregroundColor: AppColors.textPrimary,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(17),
                  ),
                  textStyle: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 7),
            Expanded(
              child: OutlinedButton(
                onPressed: onDelay,
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(34),
                  foregroundColor: AppColors.textSecondary,
                  side: const BorderSide(color: AppColors.border),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(17),
                  ),
                  textStyle: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                child: const Text('Pantau Nanti'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

double _progressForStatus(String status) {
  switch (status.toLowerCase()) {
    case 'selesai':
      return 1;
    case 'dikirim':
      return 0.25;
    case 'diproses':
      return 0.18;
    default:
      return 0.1;
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
