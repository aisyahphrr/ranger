import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../models/models.dart';
import '../../../../providers/app_provider.dart';

class PemilikMarketplaceBerandaView extends StatefulWidget {
  const PemilikMarketplaceBerandaView({
    super.key,
    required this.onOpenOrders,
    required this.onOpenEarnings,
  });

  final VoidCallback onOpenOrders;
  final VoidCallback onOpenEarnings;

  @override
  State<PemilikMarketplaceBerandaView> createState() => _PemilikMarketplaceBerandaViewState();
}

class _PemilikMarketplaceBerandaViewState extends State<PemilikMarketplaceBerandaView> {
  bool _isOutletOpen = true;

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppProvider>();
    final products = appState.marketplaceProducts;
    final marketplaceOrders = appState.orders.where((order) => order.type == 'Marketplace').toList();
    final todayRevenue = marketplaceOrders.fold<int>(0, (sum, order) => sum + order.total);
    final needsAttention = products.where((product) => !product.isAvailable || product.stock <= 5 || (product.img.isEmpty && product.imageBytes == null) || product.description.isEmpty).toList();
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 28),
        children: [
          _buildHeader(),
          const SizedBox(height: 18),
          _buildOutletCard(),
          const SizedBox(height: 22),
          _sectionTitle('Ringkasan Hari Ini', 'Data order marketplace'),
          const SizedBox(height: 12),
          _buildSummary(marketplaceOrders.length, todayRevenue),
          const SizedBox(height: 22),
          _sectionTitle('Aksi Cepat', 'Kelola toko lebih cepat'),
          const SizedBox(height: 12),
          _buildQuickActions(),
          const SizedBox(height: 22),
          if (needsAttention.isNotEmpty) ...[
            _sectionTitle('Perlu Perhatian', '${needsAttention.length} produk perlu dicek'),
            const SizedBox(height: 12),
            _buildAttentionCard(needsAttention),
            const SizedBox(height: 22),
          ],
          _buildSectionHeader(products.length),
          const SizedBox(height: 12),
          if (products.isEmpty) _buildEmptyState() else ...products.take(3).map(_buildProductCard),
          const SizedBox(height: 22),
          _sectionTitle('Produk Terlaris', 'Berdasarkan produk terjual'),
          const SizedBox(height: 12),
          _buildBestSellers(products),
          const SizedBox(height: 22),
          _sectionTitle('Rating dan Ulasan', 'Belum terhubung ke data ulasan'),
          const SizedBox(height: 12),
          _buildReviewsEmptyState(),
          const SizedBox(height: 22),
          _sectionTitle('Insight Toko', 'Dihitung saat data tersedia'),
          const SizedBox(height: 12),
          _buildInsight(products, marketplaceOrders),
        ],
      ),
    );
  }

  Widget _buildHeader() => Row(
        children: [
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Halo, ${context.watch<AppProvider>().marketplaceOwnerName}', style: const TextStyle(fontSize: 23, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              SizedBox(height: 4),
              Text('Selamat datang kembali di marketplace Anda.', style: TextStyle(color: AppColors.textSecondary)),
            ]),
          ),
          Stack(clipBehavior: Clip.none, children: [
            Material(color: Colors.white, borderRadius: BorderRadius.circular(14), child: IconButton(onPressed: _showNotifications, icon: const Icon(LucideIcons.bell, color: AppColors.primary))),
            Positioned(right: 7, top: 7, child: Container(width: 17, height: 17, alignment: Alignment.center, decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle), child: const Text('3', style: TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold)))),
          ]),
        ],
      );

  Widget _buildOutletCard() => Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          gradient: const LinearGradient(colors: [AppColors.primary, Color(0xFF35A66D)]),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(_isOutletOpen ? 'OUTLET AKTIF' : 'OUTLET NONAKTIF', style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
              SizedBox(height: 6),
              Text(context.watch<AppProvider>().marketplaceStoreName, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w800)),
            ])),
            TextButton(onPressed: _confirmOutletStatus, style: TextButton.styleFrom(foregroundColor: AppColors.primary, backgroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8)), child: Text(_isOutletOpen ? 'Tutup Outlet' : 'Buka Outlet')),
          ]),
          const SizedBox(height: 14),
          Text(_isOutletOpen ? 'Toko sedang menerima pesanan customer.' : 'Toko ditutup. Customer tidak dapat membuat pesanan.', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
          const SizedBox(height: 16),
          Row(children: const [
            _OutletMetric(label: 'Rating', value: '4,9'),
            _OutletMetric(label: 'Order hari ini', value: '12'),
            _OutletMetric(label: 'Estimasi', value: '11 mnt'),
          ]),
        ]),
      );

  Widget _sectionTitle(String title, String subtitle) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)), const SizedBox(height: 3), Text(subtitle, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary))]);

  Widget _buildSummary(int orderCount, int revenue) => GridView.count(
        crossAxisCount: 2, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(), mainAxisSpacing: 10, crossAxisSpacing: 10, childAspectRatio: 1.62,
        children: [
          _summaryCard(LucideIcons.shoppingBag, 'Order', '$orderCount', 'Hari ini', widget.onOpenOrders),
          _summaryCard(LucideIcons.walletCards, 'Pendapatan', 'Rp ${_formatCurrency(revenue)}', 'Dari order tercatat', widget.onOpenEarnings),
          _summaryCard(LucideIcons.timer, 'Diproses', '$orderCount', 'Perlu aksi', widget.onOpenOrders),
          _summaryCard(LucideIcons.star, 'Rating', '-', 'Belum ada ulasan', () => _showFeatureMessage('Belum ada halaman ulasan yang terhubung.')),
        ],
      );

  Widget _summaryCard(IconData icon, String title, String value, String caption, VoidCallback onTap) => Material(color: Colors.white, borderRadius: BorderRadius.circular(18), child: InkWell(onTap: onTap, borderRadius: BorderRadius.circular(18), child: Padding(padding: const EdgeInsets.all(14), child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [Icon(icon, color: AppColors.primary, size: 19), const SizedBox(height: 7), Text(value, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)), Text('$title - $caption', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary))]))));

  Widget _buildQuickActions() => Row(children: [
        _quickAction(LucideIcons.plus, 'Tambah Menu', () => _openProductForm()),
        _quickAction(LucideIcons.packagePlus, 'Kelola Produk', () => _showFeatureMessage('Gunakan kartu produk di bawah untuk edit, stok, dan status.')),
        _quickAction(LucideIcons.shoppingBag, 'Lihat Order', widget.onOpenOrders),
        _quickAction(LucideIcons.wallet, 'Pendapatan', widget.onOpenEarnings),
      ]);

  Widget _quickAction(IconData icon, String label, VoidCallback onTap) => Expanded(child: Material(color: Colors.white, borderRadius: BorderRadius.circular(16), child: InkWell(onTap: onTap, borderRadius: BorderRadius.circular(16), child: Padding(padding: const EdgeInsets.symmetric(vertical: 13, horizontal: 4), child: Column(children: [Icon(icon, color: AppColors.primary, size: 21), const SizedBox(height: 7), Text(label, maxLines: 2, textAlign: TextAlign.center, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700))])))));

  Widget _buildAttentionCard(List<Product> products) => Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: const Color(0xFFFFFAEB), borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFFDE68A))), child: Column(children: products.take(3).map((product) { final message = product.stock == 0 || !product.isActive ? 'Produk tidak tersedia untuk customer' : product.stock <= 5 ? 'Stok tersisa ${product.stock}' : product.img.isEmpty && product.imageBytes == null ? 'Belum memiliki foto' : 'Deskripsi belum diisi'; return ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(LucideIcons.triangleAlert, color: Colors.orange), title: Text(product.name, style: const TextStyle(fontWeight: FontWeight.w700)), subtitle: Text(message), trailing: TextButton(onPressed: () => _openProductForm(product: product), child: const Text('Kelola'))); }).toList()));

  Widget _buildBestSellers(List<Product> products) { if (products.isEmpty) return _simpleEmpty(LucideIcons.flame, 'Belum ada data produk untuk diperingkatkan.'); final items = [...products]..sort((a, b) => b.sold.compareTo(a.sold)); return Container(padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.border)), child: Column(children: items.take(3).toList().asMap().entries.map((entry) => ListTile(contentPadding: EdgeInsets.zero, leading: CircleAvatar(backgroundColor: AppColors.primary.withOpacity(.12), child: Text('${entry.key + 1}', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold))), title: Text(entry.value.name, style: const TextStyle(fontWeight: FontWeight.w700)), trailing: Text('${entry.value.sold} terjual', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)))).toList())); }

  Widget _buildReviewsEmptyState() => _simpleEmpty(LucideIcons.messageCircle, 'Belum ada ulasan customer. Ulasan akan tampil setelah model review tersedia.');

  Widget _buildInsight(List<Product> products, List<OrderModel> orders) { if (products.isEmpty && orders.isEmpty) return _simpleEmpty(LucideIcons.chartNoAxesCombined, 'Belum cukup data untuk membuat insight toko.'); final top = products.isEmpty ? null : ([...products]..sort((a, b) => b.sold.compareTo(a.sold))).first; return Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.border)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [if (top != null) Text('${top.name} adalah produk dengan penjualan tertinggi (${top.sold} terjual).', style: const TextStyle(fontWeight: FontWeight.w700)), if (orders.isNotEmpty) const Padding(padding: EdgeInsets.only(top: 8), child: Text('Data order marketplace saat ini tersedia untuk dipantau dari menu Order.', style: TextStyle(color: AppColors.textSecondary)))])); }

  Widget _simpleEmpty(IconData icon, String message) => Container(padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.border)), child: Column(children: [Icon(icon, color: AppColors.textMuted, size: 28), const SizedBox(height: 10), Text(message, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textSecondary))]));

  String _formatCurrency(int amount) => amount.toString().replaceAllMapped(RegExp(r'(?=(\d{3})+(?!\d))'), (_) => '.');

  void _showFeatureMessage(String message) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));

  Future<void> _confirmOutletStatus() async {
    final shouldChange = await showDialog<bool>(context: context, builder: (context) => AlertDialog(
      title: Text(_isOutletOpen ? 'Tutup Outlet?' : 'Buka Outlet?'),
      content: Text(_isOutletOpen ? 'Customer tidak dapat membuat pesanan selama outlet ditutup.' : 'Outlet akan kembali menerima pesanan customer.'),
      actions: [TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Batal')), ElevatedButton(onPressed: () => Navigator.pop(context, true), style: ElevatedButton.styleFrom(backgroundColor: _isOutletOpen ? Colors.red : AppColors.primary, foregroundColor: Colors.white), child: Text(_isOutletOpen ? 'Tutup Outlet' : 'Buka Outlet'))],
    ));
    if (shouldChange == true && mounted) { setState(() => _isOutletOpen = !_isOutletOpen); _showFeatureMessage(_isOutletOpen ? 'Outlet sekarang dibuka.' : 'Outlet sekarang ditutup.'); }
  }

  void _showNotifications() => showModalBottomSheet<void>(context: context, showDragHandle: true, builder: (context) => SafeArea(child: Padding(padding: const EdgeInsets.fromLTRB(20, 4, 20, 28), child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [const Text('Notifikasi', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)), const SizedBox(height: 12), _notificationItem(LucideIcons.shoppingBag, 'Pesanan baru', 'Pesanan marketplace terbaru tersedia untuk diproses.', 'Baru saja', widget.onOpenOrders), _notificationItem(LucideIcons.triangleAlert, 'Stok perlu dicek', 'Periksa produk dengan stok menipis di Beranda.', '20 menit lalu', null), _notificationItem(LucideIcons.messageCircle, 'Ulasan customer', 'Belum ada data ulasan yang dapat ditampilkan.', '1 jam lalu', null)]))));

  Widget _notificationItem(IconData icon, String title, String description, String time, VoidCallback? onTap) => ListTile(contentPadding: EdgeInsets.zero, onTap: onTap == null ? null : () { Navigator.pop(context); onTap(); }, leading: CircleAvatar(backgroundColor: AppColors.primary.withOpacity(.12), child: Icon(icon, color: AppColors.primary, size: 19)), title: Text(title, style: const TextStyle(fontWeight: FontWeight.w800)), subtitle: Text(description), trailing: Text(time, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)));

  Widget _buildSectionHeader(int count) => Row(children: [
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Menu Produk', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
          Text('$count menu terdaftar', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
        ])),
        ElevatedButton.icon(
          onPressed: () => _openProductForm(),
          icon: const Icon(LucideIcons.plus, size: 18),
          label: const Text('Tambah Menu'),
          style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
        ),
      ]);

  Widget _buildEmptyState() => Container(
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.border)),
        child: const Column(children: [
          Icon(LucideIcons.utensilsCrossed, size: 34, color: AppColors.primary),
          SizedBox(height: 12),
          Text('Belum ada menu', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
          SizedBox(height: 4),
          Text('Tambahkan menu pertama agar tampil di marketplace customer.', textAlign: TextAlign.center, style: TextStyle(color: AppColors.textSecondary)),
        ]),
      );

  Widget _buildProductCard(Product product) {
    final status = !product.isActive || product.stock == 0 ? 'Habis' : product.stock <= 5 ? 'Stok menipis' : 'Tersedia';
    final color = status == 'Tersedia' ? AppColors.primary : status == 'Stok menipis' ? Colors.orange : Colors.red;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.border)),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        _productImage(product),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(product.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
          const SizedBox(height: 4),
          Text(product.formattedPrice, style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Row(children: [
            _StatusPill(label: status, color: color),
            const SizedBox(width: 8),
            Text('Stok ${product.stock}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          ]),
        ])),
        PopupMenuButton<String>(
          icon: const Icon(LucideIcons.ellipsisVertical, color: AppColors.textSecondary),
          onSelected: (action) {
            if (action == 'edit') _openProductForm(product: product);
            if (action == 'delete') context.read<AppProvider>().deleteMarketplaceProduct(product.id);
            if (action == 'toggle') context.read<AppProvider>().updateMarketplaceProduct(product.copyWith(isActive: !product.isActive));
          },
          itemBuilder: (_) => [
            const PopupMenuItem(value: 'edit', child: Text('Edit menu')),
            PopupMenuItem(value: 'toggle', child: Text(product.isActive ? 'Nonaktifkan' : 'Aktifkan')),
            const PopupMenuItem(value: 'delete', child: Text('Hapus menu', style: TextStyle(color: Colors.red))),
          ],
        ),
      ]),
    );
  }

  Widget _productImage(Product product) => ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: SizedBox(
          width: 68,
          height: 68,
          child: _buildImage(product),
        ),
      );

  Widget _buildImage(Product product) {
    if (product.imageBytes != null) return Image.memory(product.imageBytes!, fit: BoxFit.cover);
    if (product.img.startsWith('http')) return Image.network(product.img, fit: BoxFit.cover, errorBuilder: (_, __, ___) => _imageFallback());
    return _imageFallback();
  }

  Widget _imageFallback() => Container(color: AppColors.primary.withOpacity(.1), child: const Icon(LucideIcons.image, color: AppColors.primary));

  Future<void> _openProductForm({Product? product}) async {
    final saved = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _ProductFormSheet(product: product),
    );
    if (saved == true && mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Menu berhasil disimpan dan tersinkron ke marketplace.')));
  }
}

class _ProductFormSheet extends StatefulWidget {
  const _ProductFormSheet({this.product});
  final Product? product;
  @override
  State<_ProductFormSheet> createState() => _ProductFormSheetState();
}

class _ProductFormSheetState extends State<_ProductFormSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _name = TextEditingController(text: widget.product?.name ?? '');
  late final TextEditingController _description = TextEditingController(text: widget.product?.description ?? '');
  late final TextEditingController _price = TextEditingController(text: widget.product?.price.toString() ?? '');
  late final TextEditingController _stock = TextEditingController(text: widget.product?.stock.toString() ?? '');
  String _category = 'Makanan';
  String? _imagePath;
  Uint8List? _imageBytes;
  bool _isActive = true;

  @override
  void initState() { super.initState(); _category = widget.product?.cat ?? 'Makanan'; _imagePath = widget.product?.img; _isActive = widget.product?.isActive ?? true; }
  @override
  void dispose() { _name.dispose(); _description.dispose(); _price.dispose(); _stock.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) => Padding(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: Container(
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * .9),
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
          decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
          child: SingleChildScrollView(child: Form(key: _formKey, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Center(child: Container(width: 42, height: 4, decoration: BoxDecoration(color: AppColors.border, borderRadius: BorderRadius.circular(4)))),
            const SizedBox(height: 20),
            Text(widget.product == null ? 'Tambah Menu' : 'Edit Menu', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
            const SizedBox(height: 18),
            OutlinedButton.icon(onPressed: _pickImage, icon: const Icon(LucideIcons.upload), label: Text(_imagePath == null ? 'Upload Foto Menu' : 'Ganti Foto Menu'), style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(50), foregroundColor: AppColors.primary)),
            const SizedBox(height: 14),
            _field(_name, 'Nama Menu'),
            _field(_description, 'Deskripsi', maxLines: 2),
            DropdownButtonFormField<String>(value: _category, decoration: _decoration('Kategori'), items: const ['Makanan', 'Minuman', 'Fashion', 'Kesehatan', 'Kerajinan'].map((value) => DropdownMenuItem(value: value, child: Text(value))).toList(), onChanged: (value) => setState(() => _category = value!)),
            const SizedBox(height: 12),
            _field(_price, 'Harga', prefix: 'Rp ', keyboardType: TextInputType.number),
            _field(_stock, 'Stok', keyboardType: TextInputType.number),
            SwitchListTile(contentPadding: EdgeInsets.zero, title: const Text('Menu tersedia'), subtitle: const Text('Menu nonaktif atau stok 0 tidak dapat dipesan customer.'), value: _isActive, activeColor: AppColors.primary, onChanged: (value) => setState(() => _isActive = value)),
            const SizedBox(height: 12),
            Row(children: [Expanded(child: OutlinedButton(onPressed: () => Navigator.pop(context), child: const Text('Batal'))), const SizedBox(width: 12), Expanded(child: ElevatedButton(onPressed: _save, style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.white), child: const Text('Simpan Menu')))]),
          ]))),
        ),
      );

  Widget _field(TextEditingController controller, String label, {String? prefix, int maxLines = 1, TextInputType? keyboardType}) => Padding(padding: const EdgeInsets.only(bottom: 12), child: TextFormField(controller: controller, maxLines: maxLines, keyboardType: keyboardType, validator: (value) => value == null || value.trim().isEmpty ? '$label wajib diisi' : null, decoration: _decoration(label).copyWith(prefixText: prefix)));
  InputDecoration _decoration(String label) => InputDecoration(labelText: label, filled: true, fillColor: AppColors.background, border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: AppColors.border)));
  Future<void> _pickImage() async { final result = await FilePicker.platform.pickFiles(type: FileType.image, withData: true); if (result != null && mounted) setState(() { _imagePath = result.files.single.path; _imageBytes = result.files.single.bytes; }); }
  void _save() {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final current = widget.product;
    final product = current?.copyWith(name: _name.text.trim(), description: _description.text.trim(), price: int.parse(_price.text), stock: int.parse(_stock.text), cat: _category, img: _imagePath, imageBytes: _imageBytes, isActive: _isActive) ?? Product(id: DateTime.now().millisecondsSinceEpoch, name: _name.text.trim(), store: context.read<AppProvider>().marketplaceStoreName, price: int.parse(_price.text), rating: 0, sold: 0, img: _imagePath ?? '', cat: _category, description: _description.text.trim(), stock: int.parse(_stock.text), imageBytes: _imageBytes, isActive: _isActive);
    final provider = context.read<AppProvider>();
    if (current == null) { provider.addMarketplaceProduct(product); } else { provider.updateMarketplaceProduct(product); }
    Navigator.pop(context, true);
  }
}

class _OutletMetric extends StatelessWidget { const _OutletMetric({required this.label, required this.value}); final String label; final String value; @override Widget build(BuildContext context) => Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11)), const SizedBox(height: 4), Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800))])); }
class _StatusPill extends StatelessWidget { const _StatusPill({required this.label, required this.color}); final String label; final Color color; @override Widget build(BuildContext context) => Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: color.withOpacity(.12), borderRadius: BorderRadius.circular(10)), child: Text(label, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold))); }
