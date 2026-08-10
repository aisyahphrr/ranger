import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../models/models.dart';
import '../../../../providers/app_provider.dart';

class PemilikMarketplacePendapatanView extends StatefulWidget {
  const PemilikMarketplacePendapatanView({super.key});

  @override
  State<PemilikMarketplacePendapatanView> createState() =>
      _PemilikMarketplacePendapatanViewState();
}

class _PemilikMarketplacePendapatanViewState
    extends State<PemilikMarketplacePendapatanView> {
  final List<_WithdrawalRecord> _withdrawals = [];
  _RevenuePeriod _chartPeriod = _RevenuePeriod.sevenDays;

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppProvider>();
    final snapshot = _RevenueSnapshot.fromOrders(
      appState.orders,
      storeName: appState.marketplaceStoreName,
      withdrawals: _withdrawals,
    );

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 30),
        children: [
          const Text(
            'Pendapatan',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 4),
          const Text(
            'Pantau performa penjualan outlet Anda.',
            style: TextStyle(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 18),
          _buildTotalCard(snapshot),
          const SizedBox(height: 14),
          _buildSummaryGrid(snapshot),
          const SizedBox(height: 14),
          _buildWithdrawCard(snapshot),
          const SizedBox(height: 22),
          _buildChartSection(snapshot),
          const SizedBox(height: 22),
          _buildBreakdown(snapshot),
          const SizedBox(height: 22),
          _buildWithdrawalHistory(),
        ],
      ),
    );
  }

  Widget _buildTotalCard(_RevenueSnapshot snapshot) {
    final hasRevenue = snapshot.totalRevenue > 0;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'TOTAL PENDAPATAN',
            style: TextStyle(
              color: Colors.white70,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            hasRevenue
                ? _rupiah(snapshot.totalRevenue)
                : 'Belum ada pendapatan',
            style: TextStyle(
              color: Colors.white,
              fontSize: hasRevenue ? 28 : 21,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            hasRevenue
                ? '${snapshot.completedOrderCount} order selesai tercatat'
                : 'Pendapatan muncul setelah order selesai.',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryGrid(_RevenueSnapshot snapshot) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final ratio = constraints.maxWidth < 360 ? 1.32 : 1.48;
        return GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: ratio,
          children: [
            _MetricCard(
              title: 'Hari ini',
              value: _displayRevenue(snapshot.todayRevenue, snapshot),
              icon: LucideIcons.calendarDays,
            ),
            _MetricCard(
              title: 'Minggu ini',
              value: _displayRevenue(snapshot.weekRevenue, snapshot),
              icon: LucideIcons.calendarRange,
            ),
            _MetricCard(
              title: 'Bulan ini',
              value: _displayRevenue(snapshot.monthRevenue, snapshot),
              icon: LucideIcons.chartNoAxesCombined,
            ),
            _MetricCard(
              title: 'Order hari ini',
              value: snapshot.hasMarketplaceOrders
                  ? '${snapshot.todayOrderCount} order'
                  : 'Belum ada',
              icon: LucideIcons.shoppingBag,
            ),
            _MetricCard(
              title: 'Order selesai',
              value: snapshot.hasMarketplaceOrders
                  ? '${snapshot.completedOrderCount} order'
                  : 'Belum ada',
              icon: LucideIcons.packageCheck,
            ),
            _MetricCard(
              title: 'Saldo tersedia',
              value: snapshot.hasRevenue
                  ? _rupiah(snapshot.availableBalance)
                  : '—',
              icon: LucideIcons.wallet,
            ),
          ],
        );
      },
    );
  }

  Widget _buildWithdrawCard(_RevenueSnapshot snapshot) {
    final canWithdraw = snapshot.availableBalance > 0;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(11),
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(
              LucideIcons.walletCards,
              color: AppColors.primary,
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Saldo tersedia',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  snapshot.hasRevenue
                      ? _rupiah(snapshot.availableBalance)
                      : '—',
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
          FilledButton(
            onPressed: canWithdraw ? () => _openWithdrawal(snapshot) : null,
            style: FilledButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
              textStyle:
                  const TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
            ),
            child: const Text('Tarik Pendapatan'),
          ),
        ],
      ),
    );
  }

  Widget _buildChartSection(_RevenueSnapshot snapshot) {
    final points = snapshot.chartPoints(_chartPeriod);
    final hasData = points.any((point) => point.value > 0);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Expanded(
              child: Text(
                'Performa Pendapatan',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
              ),
            ),
            DropdownButtonHideUnderline(
              child: DropdownButton<_RevenuePeriod>(
                value: _chartPeriod,
                isDense: true,
                borderRadius: BorderRadius.circular(12),
                items: const [
                  DropdownMenuItem(
                    value: _RevenuePeriod.sevenDays,
                    child: Text('7 hari'),
                  ),
                  DropdownMenuItem(
                    value: _RevenuePeriod.thirtyDays,
                    child: Text('30 hari'),
                  ),
                  DropdownMenuItem(
                    value: _RevenuePeriod.thisMonth,
                    child: Text('Bulan ini'),
                  ),
                ],
                onChanged: (value) {
                  if (value != null) setState(() => _chartPeriod = value);
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Container(
          height: 220,
          padding: const EdgeInsets.fromLTRB(14, 18, 14, 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.border),
          ),
          child: hasData
              ? _RevenueChart(points: points)
              : const _EmptyRevenueChart(),
        ),
      ],
    );
  }

  Widget _buildBreakdown(_RevenueSnapshot snapshot) {
    return _SectionCard(
      title: 'Ringkasan Pendapatan',
      icon: LucideIcons.receiptText,
      child: Column(
        children: [
          _breakdownRow(
            'Pendapatan transaksi',
            _displayRevenue(snapshot.totalRevenue, snapshot),
          ),
          const SizedBox(height: 11),
          _breakdownRow('Biaya / komisi', 'Belum tersedia'),
          const Divider(height: 22, color: AppColors.border),
          _breakdownRow(
            'Pendapatan bersih',
            'Menunggu data komisi',
            emphasized: true,
          ),
          const SizedBox(height: 8),
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Perhitungan komisi belum tersedia di model transaksi project ini.',
              style: TextStyle(color: AppColors.textMuted, fontSize: 10),
            ),
          ),
        ],
      ),
    );
  }

  Widget _breakdownRow(String label, String value, {bool emphasized = false}) {
    return Row(
      children: [
        Expanded(
          child: Text(
            label,
            style: TextStyle(
              color:
                  emphasized ? AppColors.textPrimary : AppColors.textSecondary,
              fontWeight: emphasized ? FontWeight.w900 : FontWeight.w500,
            ),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: emphasized ? AppColors.primary : AppColors.textPrimary,
            fontWeight: emphasized ? FontWeight.w900 : FontWeight.w700,
            fontSize: emphasized ? 14 : 12,
          ),
        ),
      ],
    );
  }

  Widget _buildWithdrawalHistory() {
    return _SectionCard(
      title: 'Riwayat Penarikan',
      icon: LucideIcons.history,
      child: _withdrawals.isEmpty
          ? const _EmptySection(
              icon: LucideIcons.walletCards,
              title: 'Belum ada riwayat penarikan',
              message:
                  'Riwayat pencairan akan muncul setelah pengajuan dibuat.',
            )
          : Column(
              children: [
                for (var index = 0; index < _withdrawals.length; index++) ...[
                  _WithdrawalTile(record: _withdrawals[index]),
                  if (index != _withdrawals.length - 1)
                    const Divider(height: 20, color: AppColors.border),
                ],
              ],
            ),
    );
  }

  Future<void> _openWithdrawal(_RevenueSnapshot snapshot) async {
    final draft = await showModalBottomSheet<_WithdrawalDraft>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _WithdrawalSheet(
        availableBalance: snapshot.availableBalance,
      ),
    );
    if (!mounted || draft == null) return;

    final confirmed = await _confirmWithdrawal(draft);
    if (!mounted || !confirmed) return;

    // Belum ada withdrawal service di project. Simpan sebagai Diproses tanpa
    // mengurangi saldo; saldo baru boleh berkurang setelah backend sukses.
    setState(() {
      _withdrawals.insert(
        0,
        _WithdrawalRecord(
          amount: draft.amount,
          method: draft.methodLabel,
          destination: draft.destination,
          createdAt: DateTime.now(),
          status: _WithdrawalStatus.processing,
        ),
      );
    });
    _showMessage(
      'Pengajuan penarikan dicatat sebagai Diproses. Saldo belum dikurangi sampai backend mengonfirmasi keberhasilan.',
    );
  }

  Future<bool> _confirmWithdrawal(_WithdrawalDraft draft) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Konfirmasi Penarikan'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _dialogRow('Jumlah', _rupiah(draft.amount)),
            const SizedBox(height: 10),
            _dialogRow('Tujuan', draft.methodLabel),
            const SizedBox(height: 4),
            Text(
              draft.destination,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 12,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Konfirmasi'),
          ),
        ],
      ),
    );
    return result == true;
  }

  Widget _dialogRow(String label, String value) {
    return Row(
      children: [
        Expanded(
          child: Text(label,
              style: const TextStyle(color: AppColors.textSecondary)),
        ),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w800)),
      ],
    );
  }

  void _showMessage(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  String _displayRevenue(int amount, _RevenueSnapshot snapshot) {
    return snapshot.hasRevenue ? _rupiah(amount) : '—';
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.title,
    required this.value,
    required this.icon,
  });

  final String title;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 18, color: AppColors.primary),
          const SizedBox(height: 8),
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style:
                const TextStyle(fontSize: 11, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 3),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.title,
    required this.icon,
    required this.child,
  });

  final String title;
  final IconData icon;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppColors.primary, size: 18),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
            ],
          ),
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }
}

class _EmptySection extends StatelessWidget {
  const _EmptySection({
    required this.icon,
    required this.title,
    required this.message,
  });

  final IconData icon;
  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, size: 30, color: AppColors.textMuted),
        const SizedBox(height: 9),
        Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
        const SizedBox(height: 4),
        Text(
          message,
          textAlign: TextAlign.center,
          style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
        ),
      ],
    );
  }
}

class _WithdrawalTile extends StatelessWidget {
  const _WithdrawalTile({required this.record});

  final _WithdrawalRecord record;

  @override
  Widget build(BuildContext context) {
    final color = switch (record.status) {
      _WithdrawalStatus.success => Colors.green,
      _WithdrawalStatus.failed => Colors.red,
      _ => Colors.orange.shade800,
    };

    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withValues(alpha: .1),
            shape: BoxShape.circle,
          ),
          child: Icon(Icons.account_balance_wallet_outlined,
              color: color, size: 19),
        ),
        const SizedBox(width: 11),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _rupiah(record.amount),
                style: const TextStyle(fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 3),
              Text(
                '${record.method} · ${_formatDisplayDate(record.createdAt)}',
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ),
        Text(
          record.status.label,
          style: TextStyle(
              color: color, fontSize: 11, fontWeight: FontWeight.w800),
        ),
      ],
    );
  }
}

class _WithdrawalSheet extends StatefulWidget {
  const _WithdrawalSheet({required this.availableBalance});

  final int availableBalance;

  @override
  State<_WithdrawalSheet> createState() => _WithdrawalSheetState();
}

class _WithdrawalSheetState extends State<_WithdrawalSheet> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _accountNumberController = TextEditingController();
  final _accountNameController = TextEditingController();
  final _bankNameController = TextEditingController();
  _WithdrawalMethod? _method;

  @override
  void dispose() {
    _amountController.dispose();
    _accountNumberController.dispose();
    _accountNameController.dispose();
    _bankNameController.dispose();
    super.dispose();
  }

  bool get _isBank => _method == _WithdrawalMethod.bank;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * .92,
        ),
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 42,
                    height: 5,
                    decoration: BoxDecoration(
                      color: AppColors.border,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 18),
                const Text(
                  'Tarik Pendapatan',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Ajukan pencairan dari transaksi yang sudah selesai.',
                  style:
                      TextStyle(color: AppColors.textSecondary, fontSize: 12),
                ),
                const SizedBox(height: 16),
                _balanceBanner(),
                const SizedBox(height: 16),
                _amountField(),
                const SizedBox(height: 16),
                const Text(
                  'Pilih metode pencairan',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8),
                ..._WithdrawalMethod.values.map(_methodTile),
                if (_method != null) ...[
                  const SizedBox(height: 12),
                  if (_isBank) ...[
                    _textField(
                      controller: _bankNameController,
                      label: 'Nama Bank',
                      hint: 'Contoh: BCA',
                    ),
                    const SizedBox(height: 10),
                  ],
                  _textField(
                    controller: _accountNumberController,
                    label:
                        _isBank ? 'Nomor Rekening' : 'Nomor ${_method!.label}',
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: 10),
                  _textField(
                    controller: _accountNameController,
                    label: 'Nama Pemilik ${_isBank ? 'Rekening' : ''}',
                  ),
                ],
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: _submit,
                    child: const Text('Konfirmasi Penarikan'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _balanceBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.primaryLight,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        children: [
          const Icon(LucideIcons.wallet, color: AppColors.primary, size: 20),
          const SizedBox(width: 9),
          const Expanded(
            child: Text(
              'Saldo tersedia',
              style: TextStyle(color: AppColors.primaryDark, fontSize: 12),
            ),
          ),
          Text(
            _rupiah(widget.availableBalance),
            style: const TextStyle(
              color: AppColors.primary,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }

  Widget _amountField() {
    return TextFormField(
      controller: _amountController,
      keyboardType: TextInputType.number,
      decoration: _inputDecoration('Jumlah penarikan', prefixText: 'Rp '),
      validator: (value) {
        final amount = _parseAmount(value ?? '');
        if (amount <= 0) return 'Jumlah penarikan harus lebih dari 0.';
        if (amount > widget.availableBalance) return 'Saldo tidak mencukupi.';
        return null;
      },
    );
  }

  Widget _methodTile(_WithdrawalMethod method) {
    return InkWell(
      onTap: () => setState(() => _method = method),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        margin: const EdgeInsets.only(bottom: 7),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
        decoration: BoxDecoration(
          color: _method == method ? AppColors.primaryLight : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: _method == method ? AppColors.primary : AppColors.border,
          ),
        ),
        child: Row(
          children: [
            Icon(
              _method == method
                  ? Icons.radio_button_checked
                  : Icons.radio_button_off,
              color:
                  _method == method ? AppColors.primary : AppColors.textMuted,
              size: 20,
            ),
            const SizedBox(width: 9),
            Icon(method.icon, color: AppColors.primary, size: 18),
            const SizedBox(width: 9),
            Text(method.label,
                style: const TextStyle(fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }

  Widget _textField({
    required TextEditingController controller,
    required String label,
    String? hint,
    TextInputType? keyboardType,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      decoration: _inputDecoration(label, hint: hint),
      validator: (value) =>
          value == null || value.trim().isEmpty ? '$label wajib diisi.' : null,
    );
  }

  InputDecoration _inputDecoration(
    String label, {
    String? hint,
    String? prefixText,
  }) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      prefixText: prefixText,
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppColors.border),
      ),
    );
  }

  void _submit() {
    if (!(_formKey.currentState?.validate() ?? false) || _method == null) {
      if (_method == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Pilih metode pencairan terlebih dahulu.')),
        );
      }
      return;
    }

    final amount = _parseAmount(_amountController.text);
    final accountName = _accountNameController.text.trim();
    final destination = _isBank
        ? '${_bankNameController.text.trim()} · ${_accountNumberController.text.trim()} · $accountName'
        : '${_accountNumberController.text.trim()} · $accountName';
    Navigator.pop(
      context,
      _WithdrawalDraft(
        amount: amount,
        methodLabel: _method!.label,
        destination: destination,
      ),
    );
  }
}

class _RevenueChart extends StatelessWidget {
  const _RevenueChart({required this.points});

  final List<_ChartPoint> points;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _RevenueChartPainter(points),
      child: const SizedBox.expand(),
    );
  }
}

class _EmptyRevenueChart extends StatelessWidget {
  const _EmptyRevenueChart();

  @override
  Widget build(BuildContext context) {
    return const _EmptySection(
      icon: LucideIcons.chartNoAxesCombined,
      title: 'Belum ada data grafik',
      message: 'Grafik akan tampil setelah transaksi selesai tercatat.',
    );
  }
}

class _RevenueChartPainter extends CustomPainter {
  _RevenueChartPainter(this.points);

  final List<_ChartPoint> points;

  @override
  void paint(Canvas canvas, Size size) {
    const left = 8.0;
    const right = 6.0;
    const top = 8.0;
    const bottom = 28.0;
    final chartWidth = size.width - left - right;
    final chartHeight = size.height - top - bottom;
    final maxValue = points.fold<double>(
          0,
          (max, point) => point.value > max ? point.value : max,
        ) *
        1.15;
    final safeMax = maxValue <= 0 ? 1 : maxValue;

    final gridPaint = Paint()
      ..color = AppColors.border
      ..strokeWidth = 1;
    for (var index = 0; index < 4; index++) {
      final y = top + chartHeight * index / 3;
      canvas.drawLine(
          Offset(left, y), Offset(size.width - right, y), gridPaint);
    }

    final path = Path();
    for (var index = 0; index < points.length; index++) {
      final x = points.length == 1
          ? left + chartWidth / 2
          : left + chartWidth * index / (points.length - 1);
      final y =
          top + chartHeight - (points[index].value / safeMax) * chartHeight;
      if (index == 0) {
        path.moveTo(x, y);
      } else {
        final previousX = left + chartWidth * (index - 1) / (points.length - 1);
        final previousY = top +
            chartHeight -
            (points[index - 1].value / safeMax) * chartHeight;
        final controlX = (previousX + x) / 2;
        path.cubicTo(controlX, previousY, controlX, y, x, y);
      }
    }

    final fillPath = Path.from(path)
      ..lineTo(size.width - right, top + chartHeight)
      ..lineTo(left, top + chartHeight)
      ..close();
    canvas.drawPath(
      fillPath,
      Paint()
        ..color = AppColors.primary.withValues(alpha: .08)
        ..style = PaintingStyle.fill,
    );
    canvas.drawPath(
      path,
      Paint()
        ..color = AppColors.primary
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3
        ..strokeCap = StrokeCap.round,
    );

    const textStyle = TextStyle(
      color: AppColors.textMuted,
      fontSize: 9,
      fontWeight: FontWeight.w600,
    );
    final labelIndices = _labelIndices(points.length);
    for (final index in labelIndices) {
      final x = points.length == 1
          ? left + chartWidth / 2
          : left + chartWidth * index / (points.length - 1);
      final painter = TextPainter(
        text: TextSpan(text: points[index].label, style: textStyle),
        textDirection: ui.TextDirection.ltr,
      )..layout();
      painter.paint(canvas, Offset(x - painter.width / 2, size.height - 18));
    }
  }

  List<int> _labelIndices(int length) {
    if (length <= 4) return List.generate(length, (index) => index);
    return [0, (length - 1) ~/ 3, (length - 1) * 2 ~/ 3, length - 1];
  }

  @override
  bool shouldRepaint(covariant _RevenueChartPainter oldDelegate) =>
      oldDelegate.points != points;
}

class _RevenueSnapshot {
  const _RevenueSnapshot({
    required this.totalRevenue,
    required this.todayRevenue,
    required this.weekRevenue,
    required this.monthRevenue,
    required this.todayOrderCount,
    required this.completedOrderCount,
    required this.availableBalance,
    required this.completedOrders,
    required this.hasMarketplaceOrders,
  });

  final int totalRevenue;
  final int todayRevenue;
  final int weekRevenue;
  final int monthRevenue;
  final int todayOrderCount;
  final int completedOrderCount;
  final int availableBalance;
  final List<OrderModel> completedOrders;
  final bool hasMarketplaceOrders;

  bool get hasRevenue => completedOrderCount > 0;

  factory _RevenueSnapshot.fromOrders(
    List<OrderModel> orders, {
    required String storeName,
    required List<_WithdrawalRecord> withdrawals,
  }) {
    final marketplaceOrders = orders.where((order) {
      final isMarketplace = order.type.toLowerCase() == 'marketplace';
      final belongsToStore = storeName.trim().isEmpty ||
          order.detail.trim().toLowerCase() == storeName.trim().toLowerCase();
      return isMarketplace && belongsToStore;
    }).toList();
    final completed = marketplaceOrders.where(_isCompleted).toList();
    final now = _dateOnly(DateTime.now());
    final weekStart = now.subtract(Duration(days: now.weekday - 1));
    final monthStart = DateTime(now.year, now.month);
    final total = completed.fold(0, (sum, order) => sum + order.total);
    final successfulWithdrawals = withdrawals
        .where((record) => record.status == _WithdrawalStatus.success)
        .fold(0, (sum, record) => sum + record.amount);

    return _RevenueSnapshot(
      totalRevenue: total,
      todayRevenue: _sumInRange(completed, now, now),
      weekRevenue: _sumInRange(completed, weekStart, now),
      monthRevenue: _sumInRange(completed, monthStart, now),
      todayOrderCount: marketplaceOrders.where((order) {
        final date = _parseOrderDate(order.date);
        return date != null && _dateOnly(date) == now;
      }).length,
      completedOrderCount: completed.length,
      availableBalance: (total - successfulWithdrawals).clamp(0, total).toInt(),
      completedOrders: completed,
      hasMarketplaceOrders: marketplaceOrders.isNotEmpty,
    );
  }

  List<_ChartPoint> chartPoints(_RevenuePeriod period) {
    final now = _dateOnly(DateTime.now());
    final days = switch (period) {
      _RevenuePeriod.sevenDays => 7,
      _RevenuePeriod.thirtyDays => 30,
      _RevenuePeriod.thisMonth => now.day,
    };
    final start = now.subtract(Duration(days: days - 1));
    return [
      for (var index = 0; index < days; index++)
        () {
          final date = start.add(Duration(days: index));
          final value = completedOrders
              .where((order) {
                final orderDate = _parseOrderDate(order.date);
                return orderDate != null && _dateOnly(orderDate) == date;
              })
              .fold(0, (sum, order) => sum + order.total)
              .toDouble();
          return _ChartPoint(_chartLabel(date, period), value);
        }(),
    ];
  }

  static bool _isCompleted(OrderModel order) {
    final status = order.status.trim().toLowerCase();
    return const {'selesai', 'diterima', 'berhasil', 'completed', 'complete'}
        .contains(status);
  }

  static int _sumInRange(
    List<OrderModel> orders,
    DateTime start,
    DateTime end,
  ) {
    return orders.where((order) {
      final date = _parseOrderDate(order.date);
      if (date == null) return false;
      final normalized = _dateOnly(date);
      return !normalized.isBefore(start) && !normalized.isAfter(end);
    }).fold(0, (sum, order) => sum + order.total);
  }
}

enum _RevenuePeriod { sevenDays, thirtyDays, thisMonth }

class _ChartPoint {
  const _ChartPoint(this.label, this.value);

  final String label;
  final double value;
}

enum _WithdrawalMethod {
  bank('Bank', Icons.account_balance_outlined),
  gopay('GoPay', Icons.account_balance_wallet_outlined),
  ovo('OVO', Icons.wallet_outlined),
  shopeePay('ShopeePay', Icons.payments_outlined);

  const _WithdrawalMethod(this.label, this.icon);

  final String label;
  final IconData icon;
}

enum _WithdrawalStatus {
  processing('Diproses'),
  success('Berhasil'),
  failed('Gagal');

  const _WithdrawalStatus(this.label);

  final String label;
}

class _WithdrawalDraft {
  const _WithdrawalDraft({
    required this.amount,
    required this.methodLabel,
    required this.destination,
  });

  final int amount;
  final String methodLabel;
  final String destination;
}

class _WithdrawalRecord {
  const _WithdrawalRecord({
    required this.amount,
    required this.method,
    required this.destination,
    required this.createdAt,
    required this.status,
  });

  final int amount;
  final String method;
  final String destination;
  final DateTime createdAt;
  final _WithdrawalStatus status;
}

String _rupiah(int amount) {
  if (amount <= 0) return 'Rp 0';
  return NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  ).format(amount);
}

int _parseAmount(String raw) {
  final digits = raw.replaceAll(RegExp(r'[^0-9]'), '');
  return int.tryParse(digits) ?? 0;
}

DateTime? _parseOrderDate(String raw) {
  final value = raw.trim();
  final iso = DateTime.tryParse(value);
  if (iso != null) return iso;

  final parts = value.toLowerCase().split(RegExp(r'[ ./-]+'));
  if (parts.length < 3) return null;
  final day = int.tryParse(parts[0]);
  final year = int.tryParse(parts[2]);
  if (day == null || year == null) return null;
  const months = {
    'jan': 1,
    'januari': 1,
    'feb': 2,
    'februari': 2,
    'mar': 3,
    'maret': 3,
    'apr': 4,
    'april': 4,
    'mei': 5,
    'may': 5,
    'jun': 6,
    'juni': 6,
    'jul': 7,
    'juli': 7,
    'agu': 8,
    'ags': 8,
    'aug': 8,
    'agustus': 8,
    'sep': 9,
    'sept': 9,
    'september': 9,
    'okt': 10,
    'oct': 10,
    'oktober': 10,
    'nov': 11,
    'november': 11,
    'des': 12,
    'dec': 12,
    'desember': 12,
  };
  final month = months[parts[1]];
  if (month == null) return null;
  return DateTime(year, month, day);
}

DateTime _dateOnly(DateTime value) =>
    DateTime(value.year, value.month, value.day);

String _chartLabel(DateTime date, _RevenuePeriod period) {
  if (period == _RevenuePeriod.thisMonth) return '${date.day}';
  const weekdays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  return weekdays[date.weekday - 1];
}

String _formatDisplayDate(DateTime date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  return '${date.day} ${months[date.month - 1]} ${date.year}';
}
