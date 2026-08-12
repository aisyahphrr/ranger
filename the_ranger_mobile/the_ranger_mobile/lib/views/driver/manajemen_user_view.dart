import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class ManajemenUserView extends StatefulWidget {
  const ManajemenUserView({super.key});

  @override
  State<ManajemenUserView> createState() => _ManajemenUserViewState();
}

class _ManajemenUserViewState extends State<ManajemenUserView> {
  int _currentBottomNavIndex = 0;
  String _searchQuery = "";

  final List<Map<String, dynamic>> _customers = [
    {
      "name": "Siti Aminah",
      "phone": "0812 1987 6543",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop",
      "totalOrder": 12,
      "tier": "VIP",
      "tierBg": const Color(0xFFFEF3C7),
      "tierTextColor": const Color(0xFFEA580C),
    },
    {
      "name": "Ahmad Faisal",
      "phone": "0812 3456 7890",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop",
      "totalOrder": 8,
      "tier": "Reguler",
      "tierBg": const Color(0xFFDCFCE7),
      "tierTextColor": const Color(0xFF15803D),
    },
    {
      "name": "Dewi Lestari",
      "phone": "0812 5678 9012",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop",
      "totalOrder": 5,
      "tier": "Reguler",
      "tierBg": const Color(0xFFDCFCE7),
      "tierTextColor": const Color(0xFF15803D),
    },
    {
      "name": "Budi Santoso",
      "phone": "0812 1111 2222",
      "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&fit=crop",
      "totalOrder": 3,
      "tier": "Reguler",
      "tierBg": const Color(0xFFDCFCE7),
      "tierTextColor": const Color(0xFF15803D),
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filteredCustomers = _customers.where((c) {
      final query = _searchQuery.toLowerCase();
      final nameMatches = (c["name"] as String).toLowerCase().contains(query);
      final phoneMatches = (c["phone"] as String).contains(query);
      return nameMatches || phoneMatches;
    }).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: const Text(
          "Pelanggan",
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
          // Fixed Top Search Input
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Container(
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
              ),
              child: TextField(
                onChanged: (val) {
                  setState(() {
                    _searchQuery = val;
                  });
                },
                style: const TextStyle(fontSize: 13.5, color: Color(0xFF0F172A)),
                decoration: const InputDecoration(
                  hintText: "Cari nama / no hp",
                  hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                  prefixIcon: Icon(LucideIcons.search, size: 18, color: Color(0xFF94A3B8)),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(vertical: 12),
                ),
              ),
            ),
          ),

          // Scrollable Customer List
          Expanded(
            child: ListView.separated(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.all(16),
              itemCount: filteredCustomers.length,
              separatorBuilder: (context, index) => const Divider(height: 1, color: Color(0xFFF1F5F9)),
              itemBuilder: (context, index) {
                final customer = filteredCustomers[index];
                return _buildCustomerItem(customer);
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

  Widget _buildCustomerItem(Map<String, dynamic> customer) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Row(
        children: [
          // Left Avatar
          ClipRRect(
            borderRadius: BorderRadius.circular(27),
            child: Image.network(
              customer["avatar"] as String,
              width: 54,
              height: 54,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 14),

          // Middle Column: Name & Phone
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  customer["name"] as String,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  customer["phone"] as String,
                  style: const TextStyle(
                    fontSize: 12.5,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),

          // Right Column: Total Order & Tier Badge
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                "Total Order: ${customer['totalOrder']}",
                style: const TextStyle(
                  fontSize: 11,
                  color: Color(0xFF94A3B8),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: customer["tierBg"] as Color,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  customer["tier"] as String,
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w800,
                    color: customer["tierTextColor"] as Color,
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
