import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class ManajemenOrderView extends StatefulWidget {
  const ManajemenOrderView({super.key});

  @override
  State<ManajemenOrderView> createState() => _ManajemenOrderViewState();
}

class _ManajemenOrderViewState extends State<ManajemenOrderView> {
  int _currentBottomNavIndex = 0;
  String _selectedStatus = "Semua"; // "Semua", "Baru", "Diproses", "Selesai"

  final List<Map<String, dynamic>> _orders = [
    {
      "id": "#LND-924",
      "customer": "Siti Aminah",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop",
      "status": "Baru",
      "statusBg": const Color(0xFFDCFCE7),
      "statusTextColor": const Color(0xFF15803D),
      "weightService": "3 kg • Express 3 Jam",
      "dateTime": "14 Jul 2026, 13:00",
      "price": "-",
    },
    {
      "id": "#LND-923",
      "customer": "Ahmad Faisal",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop",
      "status": "Diproses",
      "statusBg": const Color(0xFFEFF6FF),
      "statusTextColor": const Color(0xFF2563EB),
      "weightService": "5 kg • Biasa",
      "dateTime": "14 Jul 2026, 15:00",
      "price": "Rp 40.000",
    },
    {
      "id": "#LND-922",
      "customer": "Dewi Lestari",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop",
      "status": "Menunggu Harga",
      "statusBg": const Color(0xFFFEF3C7),
      "statusTextColor": const Color(0xFFEA580C),
      "weightService": "4.5 kg • Cuci Komplit",
      "dateTime": "16 Jul 2026, 15:00",
      "price": "-",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filteredOrders = _orders.where((o) {
      if (_selectedStatus == "Baru") return o["status"] == "Baru";
      if (_selectedStatus == "Diproses") return o["status"] == "Diproses";
      if (_selectedStatus == "Selesai") return o["status"] == "Selesai";
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: const Text(
          "Manajemen Order",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: Color(0xFF0F172A),
          ),
        ),
        centerTitle: false,
        actions: [
          // Plus Button
          GestureDetector(
            onTap: () {},
            child: Container(
              margin: const EdgeInsets.only(right: 16),
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Color(0xFF0F5132),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                LucideIcons.plus,
                size: 18,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Fixed Top Search Bar & Filter Section
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Column(
              children: [
                // Search Input & Filter Icon Row
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                        ),
                        child: const TextField(
                          style: TextStyle(fontSize: 13.5, color: Color(0xFF0F172A)),
                          decoration: const InputDecoration(
                            hintText: "Cari order / nama / no hp",
                            hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                            prefixIcon: Icon(LucideIcons.search, size: 18, color: Color(0xFF94A3B8)),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                      ),
                      child: const Icon(LucideIcons.slidersHorizontal, size: 18, color: Color(0xFF475569)),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Status Filter Chips Row
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  child: Row(
                    children: [
                      _buildStatusFilterChip("Semua"),
                      const SizedBox(width: 8),
                      _buildStatusFilterChip("Baru"),
                      const SizedBox(width: 8),
                      _buildStatusFilterChip("Diproses"),
                      const SizedBox(width: 8),
                      _buildStatusFilterChip("Selesai"),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Scrollable Orders List
          Expanded(
            child: ListView.separated(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.all(16),
              itemCount: filteredOrders.length,
              separatorBuilder: (context, index) => const SizedBox(height: 14),
              itemBuilder: (context, index) {
                final order = filteredOrders[index];
                return _buildOrderCard(order);
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentBottomNavIndex,
          onTap: (idx) {
            setState(() {
              _currentBottomNavIndex = idx;
            });
          },
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFF15803D),
          unselectedItemColor: const Color(0xFF94A3B8),
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 11),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
          items: const [
            BottomNavigationBarItem(icon: Icon(LucideIcons.home), label: "Beranda"),
            BottomNavigationBarItem(icon: Icon(LucideIcons.box), label: "Order"),
            BottomNavigationBarItem(icon: Icon(LucideIcons.clock), label: "Riwayat"),
            BottomNavigationBarItem(icon: Icon(LucideIcons.wallet), label: "Pendapatan"),
            BottomNavigationBarItem(icon: Icon(LucideIcons.user), label: "Profil"),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusFilterChip(String label) {
    final isSel = _selectedStatus == label;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedStatus = label;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 9),
        decoration: BoxDecoration(
          color: isSel ? const Color(0xFF0F5132) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSel ? const Color(0xFF0F5132) : const Color(0xFFE2E8F0),
            width: 1.2,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: isSel ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }

  Widget _buildOrderCard(Map<String, dynamic> order) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Row: Avatar with verified check, Order ID & Status Badge
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar with Small Green Verified Badge
              Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: Image.network(
                      order["avatar"] as String,
                      width: 48,
                      height: 48,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.check_circle_rounded,
                        size: 14,
                        color: Color(0xFF15803D),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 12),

              // Title & Customer Name Column
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      order["id"] as String,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      order["customer"] as String,
                      style: const TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),

              // Status Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: order["statusBg"] as Color,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  order["status"] as String,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: order["statusTextColor"] as Color,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Price Row (Right Aligned if present)
          if (order["price"] != "-") ...[
            Align(
              alignment: Alignment.centerRight,
              child: Text(
                order["price"] as String,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
            ),
            const SizedBox(height: 8),
          ] else ...[
            const Align(
              alignment: Alignment.centerRight,
              child: Text(
                "-",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
            ),
            const SizedBox(height: 8),
          ],

          // Footer Row: Weight/Service & Date/Time with Chevron Arrow
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                order["weightService"] as String,
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF64748B),
                  fontWeight: FontWeight.w500,
                ),
              ),
              Row(
                children: [
                  Text(
                    order["dateTime"] as String,
                    style: const TextStyle(
                      fontSize: 11.5,
                      color: Color(0xFF94A3B8),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(
                    LucideIcons.chevronRight,
                    size: 14,
                    color: Color(0xFFCBD5E1),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
