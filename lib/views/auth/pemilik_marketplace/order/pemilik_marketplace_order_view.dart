import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../../core/theme/app_theme.dart';

class PemilikMarketplaceOrderView extends StatefulWidget { const PemilikMarketplaceOrderView({super.key}); @override State<PemilikMarketplaceOrderView> createState() => _PemilikMarketplaceOrderViewState(); }
class _PemilikMarketplaceOrderViewState extends State<PemilikMarketplaceOrderView> {
  final _orders = <_StoreOrder>[
    _StoreOrder('MKT-2408', 'Bambang Wijaya', '2x Nasi Timbel Komplit', 50000, '10:24', 'Menunggu'),
    _StoreOrder('MKT-2407', 'Siti Aminah', '1x Ayam Bakar Madu, 2x Es Jeruk', 44000, '09:48', 'Diproses'),
    _StoreOrder('MKT-2406', 'Rani Setiawati', '3x Nasi Timbel Komplit', 75000, '09:15', 'Siap'),
  ];
  @override Widget build(BuildContext context) => SafeArea(child: ListView(padding: const EdgeInsets.fromLTRB(20, 16, 20, 28), children: [
    const Text('Pesanan Masuk', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
    const SizedBox(height: 4), const Text('Proses pesanan baru dengan cepat.', style: TextStyle(color: AppColors.textSecondary)), const SizedBox(height: 18),
    ..._orders.map(_orderCard),
  ]));
  Widget _orderCard(_StoreOrder order) { final color = _statusColor(order.status); return Card(color: Colors.white, elevation: 0, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18), side: const BorderSide(color: AppColors.border)), child: InkWell(borderRadius: BorderRadius.circular(18), onTap: () => _showDetail(order), child: Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Row(children: [Expanded(child: Text('#${order.id}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16))), _chip(order.status, color)]), const SizedBox(height: 10),
    Text(order.customer, style: const TextStyle(fontWeight: FontWeight.w700)), const SizedBox(height: 4), Text(order.items, style: const TextStyle(color: AppColors.textSecondary)), const SizedBox(height: 14),
    Row(children: [const Icon(LucideIcons.clock3, size: 15, color: AppColors.textMuted), const SizedBox(width: 5), Text(order.time, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)), const Spacer(), Text('Rp ${_format(order.total)}', style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.primary))]),
  ])))); }
  void _showDetail(_StoreOrder order) => showModalBottomSheet(context: context, builder: (_) => Padding(padding: const EdgeInsets.all(24), child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Order #${order.id}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)), const SizedBox(height: 16), _detail('Customer', order.customer), _detail('Pesanan', order.items), _detail('Total', 'Rp ${_format(order.total)}'), const SizedBox(height: 16), DropdownButtonFormField<String>(value: order.status, decoration: const InputDecoration(labelText: 'Status pesanan'), items: const ['Menunggu', 'Diproses', 'Siap', 'Selesai', 'Dibatalkan'].map((value) => DropdownMenuItem(value: value, child: Text(value))).toList(), onChanged: (value) { setState(() => order.status = value!); Navigator.pop(context); }), const SizedBox(height: 16)])));
  Widget _detail(String label, String value) => Padding(padding: const EdgeInsets.only(bottom: 10), child: Row(children: [SizedBox(width: 90, child: Text(label, style: const TextStyle(color: AppColors.textSecondary))), Expanded(child: Text(value, style: const TextStyle(fontWeight: FontWeight.w700)))]));
  Widget _chip(String label, Color color) => Container(padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5), decoration: BoxDecoration(color: color.withOpacity(.12), borderRadius: BorderRadius.circular(12)), child: Text(label, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 11)));
  Color _statusColor(String status) => status == 'Menunggu' ? Colors.orange : status == 'Diproses' ? AppColors.primary : status == 'Siap' || status == 'Selesai' ? Colors.green : Colors.red;
  String _format(int value) => value.toString().replaceAllMapped(RegExp(r'(?=(\d{3})+(?!\d))'), (_) => '.');
}
class _StoreOrder { _StoreOrder(this.id, this.customer, this.items, this.total, this.time, this.status); final String id; final String customer; final String items; final int total; final String time; String status; }
