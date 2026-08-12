import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../../core/theme/app_theme.dart';
import 'widgets/order_chat_sheet.dart';

class PemilikMarketplaceOrderView extends StatefulWidget {
  const PemilikMarketplaceOrderView({super.key});

  @override
  State<PemilikMarketplaceOrderView> createState() =>
      _PemilikMarketplaceOrderViewState();
}

class _PemilikMarketplaceOrderViewState
    extends State<PemilikMarketplaceOrderView> {
  final _searchController = TextEditingController();
  final _statuses = const [
    'Semua',
    'Menunggu',
    'Diproses',
    'Siap',
    'Diambil',
    'Selesai',
    'Dibatalkan',
  ];

  final List<MarketplaceOrder> _orders = [
    MarketplaceOrder(
      id: 'MKT-2408',
      customer: 'Bambang Wijaya',
      customerPhone: '0812 3456 7890',
      items: const [
        OrderItem(name: 'Nasi Timbel Komplit', quantity: 2, price: 25000),
      ],
      total: 50000,
      time: '10:24',
      status: 'Menunggu',
    ),
    MarketplaceOrder(
      id: 'MKT-2407',
      customer: 'Siti Aminah',
      customerPhone: '0821 9876 5432',
      items: const [
        OrderItem(name: 'Ayam Bakar Madu', quantity: 1, price: 28000),
        OrderItem(name: 'Es Jeruk', quantity: 2, price: 8000),
      ],
      total: 44000,
      time: '09:48',
      status: 'Diproses',
      driver: DriverProfile(
        name: 'Budi Santoso',
        vehicle: 'Motor',
        plateNumber: 'B 1234 XYZ',
        rating: 4.9,
        stage: 'Driver menuju outlet',
        distance: '1,2 km',
        eta: '5 menit',
      ),
    ),
    MarketplaceOrder(
      id: 'MKT-2406',
      customer: 'Rani Setiawati',
      customerPhone: '0857 1122 3344',
      items: const [
        OrderItem(name: 'Nasi Timbel Komplit', quantity: 3, price: 25000),
      ],
      total: 75000,
      time: '09:15',
      status: 'Selesai',
      driver: DriverProfile(
        name: 'Andi Kurniawan',
        vehicle: 'Motor',
        plateNumber: 'D 4455 AB',
        rating: 4.8,
        stage: 'Pesanan selesai',
        distance: '0 km',
        eta: '-',
      ),
    ),
  ];

  final Map<String, List<OrderChatMessage>> _customerChats = {};
  final Map<String, List<OrderChatMessage>> _driverChats = {};
  String _selectedStatus = 'Semua';
  String _selectedDate = 'Hari Ini';
  String _selectedDriver = 'Semua Driver';
  String _selectedCustomer = 'Semua Customer';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final visibleOrders = _filteredOrders;
    final newOrders =
        _orders.where((order) => order.status == 'Menunggu').length;

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 28),
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Pesanan Masuk',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Kelola persiapan sampai pesanan tiba di customer.',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              if (newOrders > 0)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.orange.shade50,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.notifications_none_rounded,
                        size: 17,
                        color: Colors.orange.shade800,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        '$newOrders baru',
                        style: TextStyle(
                          color: Colors.orange.shade800,
                          fontWeight: FontWeight.w800,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 18),
          _buildSearchAndFilter(),
          const SizedBox(height: 14),
          _buildStatusTabs(),
          const SizedBox(height: 16),
          if (visibleOrders.isEmpty)
            _buildEmptyState()
          else
            ...visibleOrders.map(_orderCard),
        ],
      ),
    );
  }

  List<MarketplaceOrder> get _filteredOrders {
    final query = _searchController.text.trim().toLowerCase();
    return _orders.where((order) {
      final matchesStatus =
          _selectedStatus == 'Semua' || order.status == _selectedStatus;
      final matchesSearch = query.isEmpty ||
          order.id.toLowerCase().contains(query) ||
          order.customer.toLowerCase().contains(query) ||
          order.items.any((item) => item.name.toLowerCase().contains(query)) ||
          (order.driver?.name.toLowerCase().contains(query) ?? false);
      final matchesDriver = _selectedDriver == 'Semua Driver' ||
          order.driver?.name == _selectedDriver;
      final matchesCustomer = _selectedCustomer == 'Semua Customer' ||
          order.customer == _selectedCustomer;
      return matchesStatus && matchesSearch && matchesDriver && matchesCustomer;
    }).toList();
  }

  Widget _buildSearchAndFilter() {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _searchController,
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              hintText: 'Cari order, customer, menu, driver...',
              prefixIcon: const Icon(Icons.search_rounded),
              suffixIcon: _searchController.text.isEmpty
                  ? null
                  : IconButton(
                      onPressed: () {
                        _searchController.clear();
                        setState(() {});
                      },
                      icon: const Icon(Icons.close_rounded),
                    ),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(vertical: 12),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: AppColors.border),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: AppColors.border),
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        IconButton(
          onPressed: _showFilterSheet,
          style: IconButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: AppColors.primary,
            side: const BorderSide(color: AppColors.border),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15),
            ),
          ),
          icon: const Icon(Icons.tune_rounded),
          tooltip: 'Filter order',
        ),
      ],
    );
  }

  Widget _buildStatusTabs() {
    return SizedBox(
      height: 38,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _statuses.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final status = _statuses[index];
          final selected = status == _selectedStatus;
          final count = status == 'Semua'
              ? _orders.length
              : _orders.where((order) => order.status == status).length;
          return ChoiceChip(
            label: Text('$status ($count)'),
            selected: selected,
            onSelected: (_) => setState(() => _selectedStatus = status),
            labelStyle: TextStyle(
              color: selected ? Colors.white : AppColors.textSecondary,
              fontSize: 11,
              fontWeight: FontWeight.w700,
            ),
            selectedColor: AppColors.primary,
            backgroundColor: Colors.white,
            side: BorderSide(
              color: selected ? AppColors.primary : AppColors.border,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            showCheckmark: false,
          );
        },
      ),
    );
  }

  Widget _orderCard(MarketplaceOrder order) {
    final color = _statusColor(order.status);
    final hasDriver = order.driver != null;
    final canTrack =
        hasDriver && order.status != 'Selesai' && order.status != 'Dibatalkan';
    final hasUnreadCustomer = order.unreadCustomerMessages > 0;
    final hasUnreadDriver = order.unreadDriverMessages > 0;

    return Card(
      color: Colors.white,
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: const BorderSide(color: AppColors.border),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: () => _showDetail(order),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 15, 16, 13),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      '#${order.id}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 16,
                      ),
                    ),
                  ),
                  _chip(order.status, color),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: AppColors.primaryLight,
                    child: Text(
                      order.customer.substring(0, 1),
                      style: const TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w800,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(width: 9),
                  Expanded(
                    child: Text(
                      order.customer,
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ),
                  if (hasDriver)
                    const Icon(
                      Icons.delivery_dining_rounded,
                      size: 18,
                      color: AppColors.primary,
                    ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                order.itemSummary,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(color: AppColors.textSecondary),
              ),
              const SizedBox(height: 13),
              Row(
                children: [
                  const Icon(
                    LucideIcons.clock3,
                    size: 15,
                    color: AppColors.textMuted,
                  ),
                  const SizedBox(width: 5),
                  Text(
                    order.time,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    'Rp ${_format(order.total)}',
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(height: 1, color: AppColors.border),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: _quickAction(
                      icon: Icons.chat_bubble_outline_rounded,
                      label: 'Customer',
                      unread: hasUnreadCustomer,
                      onTap: () => _openChat(order, isDriver: false),
                    ),
                  ),
                  if (hasDriver) ...[
                    const SizedBox(width: 6),
                    Expanded(
                      child: _quickAction(
                        icon: Icons.delivery_dining_rounded,
                        label: 'Driver',
                        unread: hasUnreadDriver,
                        onTap: () => _openChat(order, isDriver: true),
                      ),
                    ),
                    if (canTrack) ...[
                      const SizedBox(width: 6),
                      Expanded(
                        child: _quickAction(
                          icon: Icons.map_outlined,
                          label: 'Tracking',
                          onTap: () => _openTracking(order),
                        ),
                      ),
                    ],
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _quickAction({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    bool unread = false,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 7),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, size: 16, color: AppColors.primary),
                const SizedBox(width: 5),
                Flexible(
                  child: Text(
                    label,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ),
            if (unread)
              Positioned(
                right: 3,
                top: -4,
                child: Container(
                  width: 7,
                  height: 7,
                  decoration: const BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 42),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: const Column(
        children: [
          Icon(Icons.receipt_long_outlined,
              size: 42, color: AppColors.textMuted),
          SizedBox(height: 12),
          Text(
            'Order tidak ditemukan',
            style: TextStyle(fontWeight: FontWeight.w800),
          ),
          SizedBox(height: 4),
          Text(
            'Coba ubah kata kunci atau filter yang digunakan.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
          ),
        ],
      ),
    );
  }

  void _showDetail(MarketplaceOrder order) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) {
        return DraggableScrollableSheet(
          initialChildSize: .9,
          minChildSize: .65,
          maxChildSize: .97,
          expand: false,
          builder: (context, scrollController) {
            return StatefulBuilder(
              builder: (context, sheetSetState) {
                return Container(
                  decoration: const BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(28),
                    ),
                  ),
                  child: ListView(
                    controller: scrollController,
                    padding: const EdgeInsets.fromLTRB(20, 12, 20, 30),
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
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Order #${order.id}',
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Dibuat hari ini, ${order.time}',
                                  style: const TextStyle(
                                    color: AppColors.textSecondary,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          _chip(order.status, _statusColor(order.status)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      _buildCustomerCard(order),
                      const SizedBox(height: 12),
                      _buildOrderSummary(order),
                      const SizedBox(height: 12),
                      _buildTimeline(order),
                      const SizedBox(height: 12),
                      _buildDriverCard(order),
                      const SizedBox(height: 12),
                      _buildStatusActions(order, sheetSetState),
                    ],
                  ),
                );
              },
            );
          },
        );
      },
    );
  }

  Widget _buildCustomerCard(MarketplaceOrder order) {
    return _sectionCard(
      title: 'Customer',
      icon: Icons.person_outline_rounded,
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: AppColors.primaryLight,
            child: Text(
              order.customer.substring(0, 1),
              style: const TextStyle(
                color: AppColors.primary,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  order.customer,
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 3),
                Text(
                  order.customerPhone,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => _openChat(order, isDriver: false),
            style: IconButton.styleFrom(
              backgroundColor: AppColors.primaryLight,
              foregroundColor: AppColors.primary,
            ),
            icon: const Icon(Icons.chat_bubble_outline_rounded, size: 19),
            tooltip: 'Chat customer',
          ),
        ],
      ),
    );
  }

  Widget _buildOrderSummary(MarketplaceOrder order) {
    return _sectionCard(
      title: 'Detail Pesanan',
      icon: Icons.receipt_long_outlined,
      child: Column(
        children: [
          ...order.items.map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                children: [
                  Text(
                    '${item.quantity}x',
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(child: Text(item.name)),
                  Text(
                    'Rp ${_format(item.total)}',
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
          ),
          const Divider(color: AppColors.border),
          const SizedBox(height: 4),
          _priceRow('Subtotal', order.subtotal),
          const SizedBox(height: 8),
          _priceRow('Delivery', order.deliveryFee),
          const Divider(color: AppColors.border),
          const SizedBox(height: 4),
          _priceRow('Total', order.total, emphasized: true),
        ],
      ),
    );
  }

  Widget _priceRow(String label, int value, {bool emphasized = false}) {
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
          'Rp ${_format(value)}',
          style: TextStyle(
            color: emphasized ? AppColors.primary : AppColors.textPrimary,
            fontWeight: emphasized ? FontWeight.w900 : FontWeight.w700,
            fontSize: emphasized ? 16 : 13,
          ),
        ),
      ],
    );
  }

  Widget _buildTimeline(MarketplaceOrder order) {
    final steps = _timelineSteps(order);
    return _sectionCard(
      title: 'Perjalanan Order',
      icon: Icons.timeline_rounded,
      child: Column(
        children: [
          for (var index = 0; index < steps.length; index++)
            _timelineStep(
              steps[index],
              isLast: index == steps.length - 1,
            ),
        ],
      ),
    );
  }

  List<_TimelineItem> _timelineSteps(MarketplaceOrder order) {
    if (order.status == 'Dibatalkan') {
      return const [
        _TimelineItem('Pesanan diterima', _TimelineState.done),
        _TimelineItem('Pesanan dibatalkan', _TimelineState.cancelled),
      ];
    }

    final current = switch (order.status) {
      'Menunggu' => 0,
      'Diproses' => 1,
      'Siap' => 2,
      'Diambil' => 3,
      'Selesai' => 5,
      _ => 0,
    };
    const labels = [
      'Pesanan diterima',
      'Pesanan sedang dipersiapkan',
      'Pesanan siap diambil driver',
      'Pesanan diantar ke customer',
      'Driver tiba di customer',
      'Pesanan selesai',
    ];

    return [
      for (var index = 0; index < labels.length; index++)
        _TimelineItem(
          labels[index],
          index < current
              ? _TimelineState.done
              : index == current
                  ? _TimelineState.active
                  : _TimelineState.pending,
        ),
    ];
  }

  Widget _timelineStep(_TimelineItem item, {required bool isLast}) {
    final isDone = item.state == _TimelineState.done;
    final isActive = item.state == _TimelineState.active;
    final isCancelled = item.state == _TimelineState.cancelled;
    final color = isCancelled
        ? Colors.red
        : isDone || isActive
            ? AppColors.primary
            : AppColors.textMuted;

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 26,
            child: Column(
              children: [
                Container(
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    color: isDone || isCancelled
                        ? color
                        : isActive
                            ? AppColors.primaryLight
                            : Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(color: color, width: 1.5),
                  ),
                  child: Icon(
                    isCancelled
                        ? Icons.close_rounded
                        : isDone
                            ? Icons.check_rounded
                            : isActive
                                ? Icons.circle
                                : Icons.circle_outlined,
                    size: isActive ? 8 : 14,
                    color: isDone || isCancelled ? Colors.white : color,
                  ),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 1.5,
                      margin: const EdgeInsets.symmetric(vertical: 3),
                      color: isDone ? AppColors.primary : AppColors.border,
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 11),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(top: 2, bottom: 16),
              child: Text(
                item.label,
                style: TextStyle(
                  color: isActive || isDone
                      ? AppColors.textPrimary
                      : AppColors.textMuted,
                  fontWeight:
                      isActive || isDone ? FontWeight.w800 : FontWeight.w500,
                  fontSize: 13,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDriverCard(MarketplaceOrder order) {
    final driver = order.driver;
    if (driver == null) {
      return _sectionCard(
        title: 'Driver',
        icon: Icons.delivery_dining_rounded,
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(11),
              decoration: BoxDecoration(
                color: Colors.orange.shade50,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.hourglass_top_rounded,
                color: Colors.orange.shade800,
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Driver belum ditugaskan',
                    style: TextStyle(fontWeight: FontWeight.w800),
                  ),
                  SizedBox(height: 3),
                  Text(
                    'Tracking akan aktif setelah driver menerima order.',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    return _sectionCard(
      title: 'Driver & Tracking',
      icon: Icons.delivery_dining_rounded,
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 23,
                backgroundColor: Colors.orange.shade50,
                child: Icon(
                  Icons.delivery_dining_rounded,
                  color: Colors.orange.shade800,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      driver.name,
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      '${driver.vehicle} · ${driver.plateNumber}',
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        const Icon(
                          Icons.star_rounded,
                          color: AppColors.ratingAmber,
                          size: 15,
                        ),
                        const SizedBox(width: 3),
                        Text(
                          driver.rating.toStringAsFixed(1),
                          style: const TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.navigation_rounded,
                  color: AppColors.primary,
                  size: 18,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    driver.stage,
                    style: const TextStyle(
                      color: AppColors.primaryDark,
                      fontWeight: FontWeight.w800,
                      fontSize: 12,
                    ),
                  ),
                ),
                if (driver.eta != '-')
                  Text(
                    '${driver.distance}\n${driver.eta}',
                    textAlign: TextAlign.right,
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w800,
                      fontSize: 11,
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _openChat(order, isDriver: true),
                  icon: const Icon(Icons.chat_bubble_outline_rounded, size: 17),
                  label: const Text('Chat Driver'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: FilledButton.icon(
                  onPressed:
                      order.status == 'Selesai' || order.status == 'Dibatalkan'
                          ? null
                          : () => _openTracking(order),
                  icon: const Icon(Icons.map_outlined, size: 17),
                  label: const Text('Tracking'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusActions(
    MarketplaceOrder order,
    StateSetter sheetSetState,
  ) {
    switch (order.status) {
      case 'Menunggu':
        return Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => _rejectOrder(order, sheetSetState),
                style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Tolak Pesanan'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: FilledButton(
                onPressed: () => _updateOrderStatus(
                  order,
                  'Diproses',
                  sheetSetState,
                ),
                child: const Text('Terima Pesanan'),
              ),
            ),
          ],
        );
      case 'Diproses':
        return SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: () => _updateOrderStatus(order, 'Siap', sheetSetState),
            icon: const Icon(Icons.check_box_outlined),
            label: const Text('Tandai Pesanan Siap'),
          ),
        );
      case 'Siap':
        return order.driver == null
            ? _infoBanner(
                Icons.hourglass_top_rounded,
                'Pesanan siap. Menunggu driver mengambil order.',
              )
            : SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: () =>
                      _updateOrderStatus(order, 'Diambil', sheetSetState),
                  icon: const Icon(Icons.delivery_dining_rounded),
                  label: const Text('Tandai Sudah Diambil Driver'),
                ),
              );
      case 'Diambil':
        return _infoBanner(
          Icons.local_shipping_outlined,
          'Pesanan sedang diantar ke customer. Pantau driver melalui tracking.',
        );
      case 'Selesai':
        return _infoBanner(
            Icons.check_circle_outline, 'Pesanan selesai diterima customer.');
      case 'Dibatalkan':
        return _infoBanner(
            Icons.cancel_outlined, 'Pesanan ini telah dibatalkan.');
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _infoBanner(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppColors.primary, size: 19),
          const SizedBox(width: 9),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionCard({
    required String title,
    required IconData icon,
    required Widget child,
  }) {
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
              Icon(icon, size: 18, color: AppColors.primary),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.w900),
              ),
            ],
          ),
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }

  void _openChat(MarketplaceOrder order, {required bool isDriver}) {
    if (isDriver && order.driver == null) {
      _showMessage('Chat driver tersedia setelah driver ditugaskan.');
      return;
    }

    final history = isDriver
        ? _driverChats.putIfAbsent(order.id, () => _initialDriverChat(order))
        : _customerChats.putIfAbsent(
            order.id, () => _initialCustomerChat(order));

    setState(() {
      if (isDriver) {
        order.unreadDriverMessages = 0;
      } else {
        order.unreadCustomerMessages = 0;
      }
    });

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => OrderChatSheet(
        orderId: order.id,
        title: isDriver ? 'Chat dengan ${order.driver!.name}' : 'Chat Customer',
        targetName: isDriver ? order.driver!.name : order.customer,
        isDriver: isDriver,
        messages: history,
        onSendMessage: (text, isMe) {
          history.add(
            OrderChatMessage(
              text: text,
              time: _currentTime(),
              isMe: isMe,
              sender: 'Pemilik Marketplace',
            ),
          );
          setState(() {});
        },
      ),
    );
  }

  List<OrderChatMessage> _initialCustomerChat(MarketplaceOrder order) {
    return [
      OrderChatMessage(
        text: 'Halo kak, pesanan saya sudah diproses belum?',
        time: order.time,
        isMe: false,
        sender: order.customer,
      ),
    ];
  }

  List<OrderChatMessage> _initialDriverChat(MarketplaceOrder order) {
    return [
      OrderChatMessage(
        text: 'Kak, saya sudah menuju outlet.',
        time: order.time,
        isMe: false,
        sender: order.driver?.name ?? 'Driver',
      ),
    ];
  }

  void _openTracking(MarketplaceOrder order) {
    if (order.driver == null) {
      _showMessage('Tracking aktif setelah driver ditugaskan.');
      return;
    }
    if (order.status == 'Selesai' || order.status == 'Dibatalkan') {
      _showMessage('Tracking live sudah selesai untuk order ini.');
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => DriverTrackingView(order: order),
      ),
    );
  }

  void _updateOrderStatus(
    MarketplaceOrder order,
    String status,
    StateSetter sheetSetState,
  ) {
    setState(() {
      order.status = status;
      if (status == 'Diambil' && order.driver != null) {
        order.driver!.stage = 'Driver sedang menuju customer';
        order.driver!.distance = '1,2 km';
        order.driver!.eta = '5 menit';
      }
    });
    sheetSetState(() {});
    _showMessage('Status order #${order.id} diubah menjadi $status.');
  }

  Future<void> _rejectOrder(
    MarketplaceOrder order,
    StateSetter sheetSetState,
  ) async {
    final reasonController = TextEditingController();
    final reason = await showDialog<String>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Tolak pesanan?'),
        content: TextField(
          controller: reasonController,
          maxLines: 3,
          decoration: const InputDecoration(
            hintText: 'Alasan penolakan (opsional)',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Batal'),
          ),
          FilledButton(
            onPressed: () =>
                Navigator.pop(dialogContext, reasonController.text),
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Tolak'),
          ),
        ],
      ),
    );
    reasonController.dispose();
    if (!mounted || reason == null) return;
    order.rejectionReason =
        reason.trim().isEmpty ? 'Ditolak oleh outlet' : reason.trim();
    _updateOrderStatus(order, 'Dibatalkan', sheetSetState);
  }

  void _showFilterSheet() {
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (sheetContext) => StatefulBuilder(
        builder: (context, sheetSetState) {
          final drivers = <String>{
            'Semua Driver',
            ..._orders.map((order) => order.driver?.name).whereType<String>(),
          }.toList();
          final customers = <String>{
            'Semua Customer',
            ..._orders.map((order) => order.customer),
          }.toList();

          return Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Filter Order',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 14),
                _filterDropdown(
                  label: 'Tanggal',
                  value: _selectedDate,
                  values: const ['Hari Ini', 'Kemarin', 'Semua Tanggal'],
                  onChanged: (value) =>
                      sheetSetState(() => _selectedDate = value),
                ),
                const SizedBox(height: 10),
                _filterDropdown(
                  label: 'Driver',
                  value: _selectedDriver,
                  values: drivers,
                  onChanged: (value) =>
                      sheetSetState(() => _selectedDriver = value),
                ),
                const SizedBox(height: 10),
                _filterDropdown(
                  label: 'Customer',
                  value: _selectedCustomer,
                  values: customers,
                  onChanged: (value) =>
                      sheetSetState(() => _selectedCustomer = value),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: () {
                      setState(() {});
                      Navigator.pop(sheetContext);
                    },
                    child: const Text('Terapkan Filter'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _filterDropdown({
    required String label,
    required String value,
    required List<String> values,
    required ValueChanged<String> onChanged,
  }) {
    return DropdownButtonFormField<String>(
      initialValue: value,
      isExpanded: true,
      decoration: InputDecoration(labelText: label),
      items: values
          .map((item) => DropdownMenuItem(value: item, child: Text(item)))
          .toList(),
      onChanged: (newValue) {
        if (newValue != null) onChanged(newValue);
      },
    );
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'Menunggu':
        return Colors.orange.shade700;
      case 'Diproses':
        return AppColors.primary;
      case 'Siap':
        return Colors.blue.shade700;
      case 'Diambil':
        return Colors.deepPurple.shade600;
      case 'Selesai':
        return Colors.green.shade700;
      default:
        return Colors.red.shade700;
    }
  }

  Widget _chip(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .12),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.bold,
          fontSize: 11,
        ),
      ),
    );
  }

  void _showMessage(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  String _currentTime() {
    final now = TimeOfDay.now();
    return '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
  }

  String _format(int value) => value
      .toString()
      .replaceAllMapped(RegExp(r'(?=(\d{3})+(?!\d))'), (_) => '.');
}

class DriverTrackingView extends StatefulWidget {
  final MarketplaceOrder order;

  const DriverTrackingView({super.key, required this.order});

  @override
  State<DriverTrackingView> createState() => _DriverTrackingViewState();
}

class _DriverTrackingViewState extends State<DriverTrackingView> {
  bool _isRefreshing = false;

  MarketplaceOrder get order => widget.order;
  DriverProfile get driver => order.driver!;

  Future<void> _refreshLocation() async {
    setState(() => _isRefreshing = true);
    await Future<void>.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    setState(() => _isRefreshing = false);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Lokasi driver sudah diperbarui.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text('Tracking #${order.id}'),
        actions: [
          IconButton(
            onPressed: _isRefreshing ? null : _refreshLocation,
            icon: _isRefreshing
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.refresh_rounded),
            tooltip: 'Perbarui lokasi',
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 26),
        children: [
          _buildMapPreview(),
          const SizedBox(height: 14),
          _buildTrackingSummary(),
          const SizedBox(height: 14),
          _buildDeliverySteps(),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () => Navigator.pop(context),
              icon: const Icon(Icons.chat_bubble_outline_rounded),
              label: const Text('Chat Driver dari Order Ini'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMapPreview() {
    return Container(
      height: 350,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: const Color(0xFFE9F0EA),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.border),
      ),
      child: Stack(
        children: [
          Positioned.fill(
            child: CustomPaint(
              painter: _RouteMapPainter(),
            ),
          ),
          Positioned(
            top: 14,
            left: 14,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x22000000),
                    blurRadius: 8,
                    offset: Offset(0, 3),
                  ),
                ],
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.circle, color: Colors.green, size: 9),
                  SizedBox(width: 6),
                  Text(
                    'Tracking order',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            top: 80,
            left: 28,
            child: _mapMarker(
              icon: Icons.delivery_dining_rounded,
              label: 'Driver',
              color: Colors.deepPurple,
            ),
          ),
          Positioned(
            bottom: 72,
            right: 30,
            child: _mapMarker(
              icon: Icons.storefront_outlined,
              label: 'Outlet',
              color: AppColors.primary,
            ),
          ),
          Positioned(
            bottom: 20,
            left: 26,
            child: _mapMarker(
              icon: Icons.person_pin_circle_outlined,
              label: 'Customer',
              color: Colors.orange.shade800,
            ),
          ),
          Positioned(
            right: 12,
            top: 14,
            child: IconButton(
              onPressed: _refreshLocation,
              style: IconButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: AppColors.primary,
              ),
              icon: const Icon(Icons.my_location_rounded, size: 19),
              tooltip: 'Perbarui posisi driver',
            ),
          ),
          Positioned(
            right: 12,
            bottom: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: .9),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text(
                'Map siap dihubungkan ke GPS',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 9,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _mapMarker({
    required IconData icon,
    required String label,
    required Color color,
  }) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(9),
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            boxShadow: const [
              BoxShadow(
                color: Color(0x33000000),
                blurRadius: 7,
                offset: Offset(0, 3),
              ),
            ],
          ),
          child: Icon(icon, color: Colors.white, size: 20),
        ),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            label,
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800),
          ),
        ),
      ],
    );
  }

  Widget _buildTrackingSummary() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: Colors.deepPurple.shade50,
                child: const Icon(
                  Icons.delivery_dining_rounded,
                  color: Colors.deepPurple,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      driver.name,
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      '${driver.vehicle} · ${driver.plateNumber}',
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                children: [
                  const Icon(Icons.star_rounded,
                      color: AppColors.ratingAmber, size: 16),
                  const SizedBox(width: 3),
                  Text(
                    driver.rating.toStringAsFixed(1),
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _metric(
                    Icons.location_on_outlined, 'Jarak', driver.distance),
              ),
              Expanded(
                child: _metric(
                    Icons.access_time_rounded, 'Estimasi tiba', driver.eta),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(11),
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.navigation_rounded,
                    color: AppColors.primary, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    driver.stage,
                    style: const TextStyle(
                      color: AppColors.primaryDark,
                      fontWeight: FontWeight.w800,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _metric(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 18),
        const SizedBox(width: 7),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style:
                  const TextStyle(color: AppColors.textSecondary, fontSize: 10),
            ),
            const SizedBox(height: 2),
            Text(value, style: const TextStyle(fontWeight: FontWeight.w900)),
          ],
        ),
      ],
    );
  }

  Widget _buildDeliverySteps() {
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
          const Text(
            'Rute Pengantaran',
            style: TextStyle(fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 14),
          _routeRow(Icons.storefront_outlined, 'Outlet', 'Lokasi marketplace',
              AppColors.primary),
          _routeLine(),
          _routeRow(Icons.person_pin_circle_outlined, 'Customer',
              order.customer, Colors.orange.shade800),
        ],
      ),
    );
  }

  Widget _routeRow(IconData icon, String title, String subtitle, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
              color: color.withValues(alpha: .12), shape: BoxShape.circle),
          child: Icon(icon, color: color, size: 18),
        ),
        const SizedBox(width: 10),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style:
                    const TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
            const SizedBox(height: 2),
            Text(subtitle,
                style: const TextStyle(
                    color: AppColors.textSecondary, fontSize: 11)),
          ],
        ),
      ],
    );
  }

  Widget _routeLine() {
    return Padding(
      padding: const EdgeInsets.only(left: 17, top: 2, bottom: 2),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Container(height: 20, width: 1.5, color: AppColors.border),
      ),
    );
  }
}

class _RouteMapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final background = Paint()..color = const Color(0xFFE9F0EA);
    canvas.drawRect(Offset.zero & size, background);

    final park = Paint()..color = const Color(0xFFD5E8D8);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(size.width * .55, size.height * .04, size.width * .35,
            size.height * .24),
        const Radius.circular(18),
      ),
      park,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(size.width * .04, size.height * .55, size.width * .28,
            size.height * .25),
        const Radius.circular(18),
      ),
      park,
    );

    final road = Paint()
      ..color = Colors.white.withValues(alpha: .95)
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    for (final points in [
      [
        Offset(size.width * .05, size.height * .32),
        Offset(size.width * .92, size.height * .14)
      ],
      [
        Offset(size.width * .18, size.height * .03),
        Offset(size.width * .58, size.height * .95)
      ],
      [
        Offset(size.width * .02, size.height * .73),
        Offset(size.width * .95, size.height * .62)
      ],
    ]) {
      final path = Path()..moveTo(points.first.dx, points.first.dy);
      path.lineTo(points.last.dx, points.last.dy);
      road.strokeWidth = 16;
      canvas.drawPath(path, road);
      road.color = const Color(0xFFDCE7DE);
      road.strokeWidth = 1.2;
      canvas.drawPath(path, road);
      road.color = Colors.white.withValues(alpha: .95);
    }

    final route = Paint()
      ..color = Colors.deepPurple
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;
    final routePath = Path()
      ..moveTo(size.width * .18, size.height * .77)
      ..cubicTo(
        size.width * .33,
        size.height * .62,
        size.width * .42,
        size.height * .42,
        size.width * .29,
        size.height * .21,
      )
      ..cubicTo(
        size.width * .45,
        size.height * .25,
        size.width * .58,
        size.height * .37,
        size.width * .73,
        size.height * .68,
      );
    canvas.drawPath(routePath, route);

    final pin = Paint()..color = Colors.deepPurple.withValues(alpha: .16);
    canvas.drawCircle(Offset(size.width * .29, size.height * .21), 24, pin);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class MarketplaceOrder {
  MarketplaceOrder({
    required this.id,
    required this.customer,
    required this.customerPhone,
    required this.items,
    required this.total,
    required this.time,
    required this.status,
    this.driver,
  });

  final String id;
  final String customer;
  final String customerPhone;
  final List<OrderItem> items;
  final int total;
  final String time;
  String status;
  DriverProfile? driver;
  String? rejectionReason;
  int unreadCustomerMessages = 1;
  int unreadDriverMessages = 1;

  int get subtotal => items.fold(0, (sum, item) => sum + item.total);
  int get deliveryFee => total > subtotal ? total - subtotal : 0;
  String get itemSummary =>
      items.map((item) => '${item.quantity}x ${item.name}').join(', ');
}

class OrderItem {
  const OrderItem({
    required this.name,
    required this.quantity,
    required this.price,
  });

  final String name;
  final int quantity;
  final int price;

  int get total => quantity * price;
}

class DriverProfile {
  DriverProfile({
    required this.name,
    required this.vehicle,
    required this.plateNumber,
    required this.rating,
    required this.stage,
    required this.distance,
    required this.eta,
  });

  final String name;
  final String vehicle;
  final String plateNumber;
  final double rating;
  String stage;
  String distance;
  String eta;
}

class OrderChatMessage {
  OrderChatMessage({
    required this.text,
    required this.time,
    required this.isMe,
    required this.sender,
  });

  final String text;
  final String time;
  final bool isMe;
  final String sender;
}

enum _TimelineState { done, active, pending, cancelled }

class _TimelineItem {
  const _TimelineItem(this.label, this.state);

  final String label;
  final _TimelineState state;
}
