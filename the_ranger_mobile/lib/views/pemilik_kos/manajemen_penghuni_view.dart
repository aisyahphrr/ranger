import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class ManajemenPenghuniView extends StatefulWidget {
  const ManajemenPenghuniView({super.key});

  @override
  State<ManajemenPenghuniView> createState() => _ManajemenPenghuniViewState();
}

class _ManajemenPenghuniViewState extends State<ManajemenPenghuniView> {
  String _selectedFilter = "Semua"; // "Semua", "Aktif", "Akan Keluar"

  final List<Map<String, dynamic>> _tenants = [
    {
      "name": "Budi Santoso",
      "status": "Aktif",
      "room": "Kamar 1A • Tipe AC",
      "phone": "081234567890",
      "entryDate": "15 Jan 2026",
      "remainingDays": "20 hari lagi",
      "remainingDaysColor": const Color(0xFF15803D),
      "price": "Rp 1.200.000",
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop",
    },
    {
      "name": "Dewi Lestari",
      "status": "Aktif",
      "room": "Kamar 2C • Tipe AC",
      "phone": "081324681357",
      "entryDate": "10 Feb 2026",
      "remainingDays": "16 hari lagi",
      "remainingDaysColor": const Color(0xFF15803D),
      "price": "Rp 1.300.000",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop",
    },
    {
      "name": "Ahmad Faisal",
      "status": "Aktif",
      "room": "Kamar 3B • Tipe Standar",
      "phone": "081987654321",
      "entryDate": "01 Mar 2026",
      "remainingDays": "7 hari lagi",
      "remainingDaysColor": const Color(0xFFEA580C),
      "price": "Rp 950.000",
      "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&fit=crop",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filteredTenants = _tenants.where((t) {
      if (_selectedFilter == "Aktif") return t["status"] == "Aktif";
      if (_selectedFilter == "Akan Keluar") return t["status"] == "Akan Keluar";
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF0F172A)),
                onPressed: () => Navigator.maybePop(context),
              )
            : null,
        title: const Text(
          "Manajemen\nPenghuni",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: Color(0xFF0F172A),
            height: 1.15,
          ),
        ),
        centerTitle: false,
        actions: [
          // Search Icon Button
          GestureDetector(
            onTap: () {},
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
              ),
              child: const Icon(
                LucideIcons.search,
                size: 18,
                color: Color(0xFF475569),
              ),
            ),
          ),
          const SizedBox(width: 8),

          // Add Tenant Plus Button
          GestureDetector(
            onTap: () => _showTambahPenghuniModal(context),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Color(0xFF15803D),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                LucideIcons.plus,
                size: 18,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Stack(
        children: [
          // Scrollable Content Body
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Subtitle Header
                const Text(
                  "Kelola semua penghuni kos Anda",
                  style: TextStyle(
                    fontSize: 12.5,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 16),

                // Top 3 Metric Cards Row (Total Penghuni, Aktif, Akan Keluar)
                Row(
                  children: [
                    _buildStatCard(
                      label: "Total Penghuni",
                      value: "10",
                      subtitle: "Orang",
                      valueColor: const Color(0xFF0F172A),
                    ),
                    const SizedBox(width: 10),
                    _buildStatCard(
                      label: "Aktif 🗹",
                      labelColor: const Color(0xFF15803D),
                      value: "10",
                      subtitle: "100%",
                      valueColor: const Color(0xFF15803D),
                      subtitleColor: const Color(0xFF15803D),
                    ),
                    const SizedBox(width: 10),
                    _buildStatCard(
                      label: "Akan Keluar",
                      labelColor: const Color(0xFFDC2626),
                      value: "0",
                      subtitle: "0%",
                      valueColor: const Color(0xFFDC2626),
                      subtitleColor: const Color(0xFFDC2626),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Filter Pills Row (Semua, Aktif, Akan Keluar)
                Row(
                  children: [
                    _buildFilterPill("Semua (10)"),
                    const SizedBox(width: 8),
                    _buildFilterPill("Aktif (10)"),
                    const SizedBox(width: 8),
                    _buildFilterPill("Akan Keluar (0)"),
                  ],
                ),
                const SizedBox(height: 16),

                // Tenant Cards List
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: filteredTenants.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 14),
                  itemBuilder: (context, index) {
                    final t = filteredTenants[index];
                    return _buildTenantCard(t, index);
                  },
                ),
                const SizedBox(height: 110), // Clearance for floating bottom dual cards
              ],
            ),
          ),

          // Sticky Bottom Compact Dual Cards (Pendapatan & Tunggakan)
          Positioned(
            left: 16,
            right: 16,
            bottom: 8,
            child: Row(
              children: [
                // Left Card: Pendapatan Bulan Ini
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEDFBF4),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFDCFCE7), width: 1),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(5),
                          decoration: const BoxDecoration(
                            color: Color(0xFF15803D),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(LucideIcons.banknote, size: 12, color: Colors.white),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              Text(
                                "Pendapatan",
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(fontSize: 9, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                              ),
                              Text(
                                "Rp 12.500.000",
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF15803D)),
                              ),
                            ],
                          ),
                        ),
                        const Icon(LucideIcons.chevronRight, size: 13, color: Color(0xFF15803D)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Right Card: Tunggakan
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF5F5),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFFEE2E8), width: 1),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.04),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(5),
                          decoration: const BoxDecoration(
                            color: Color(0xFFDC2626),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(LucideIcons.alertCircle, size: 12, color: Colors.white),
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              Text(
                                "Tunggakan",
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(fontSize: 9, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                              ),
                              Text(
                                "Rp 1.500.000",
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFFDC2626)),
                              ),
                            ],
                          ),
                        ),
                        const Icon(LucideIcons.chevronRight, size: 13, color: Color(0xFFDC2626)),
                      ],
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

  Widget _buildStatCard({
    required String label,
    Color? labelColor,
    required String value,
    required String subtitle,
    required Color valueColor,
    Color? subtitleColor,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
        ),
        child: Column(
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: labelColor ?? const Color(0xFF64748B),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: valueColor,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 11,
                color: subtitleColor ?? const Color(0xFF94A3B8),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterPill(String label) {
    final cleanLabel = label.split(" ")[0];
    final isSel = _selectedFilter == cleanLabel;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedFilter = cleanLabel;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSel ? const Color(0xFF15803D) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSel ? const Color(0xFF15803D) : const Color(0xFFE2E8F0),
            width: 1.2,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12.5,
            fontWeight: FontWeight.w800,
            color: isSel ? Colors.white : const Color(0xFF475569),
          ),
        ),
      ),
    );
  }

  Widget _buildTenantCard(Map<String, dynamic> tenant, int index) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left Avatar
          ClipRRect(
            borderRadius: BorderRadius.circular(27),
            child: Image.network(
              tenant["avatar"] as String,
              width: 54,
              height: 54,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 12),

          // Middle Column (Name, Room, Phone, Entry Date)
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      tenant["name"] as String,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEDFBF4),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        tenant["status"] as String,
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF15803D),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  tenant["room"] as String,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(LucideIcons.phone, size: 12, color: Color(0xFF94A3B8)),
                    const SizedBox(width: 4),
                    Text(
                      tenant["phone"] as String,
                      style: const TextStyle(
                        fontSize: 11.5,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(LucideIcons.calendar, size: 12, color: Color(0xFF94A3B8)),
                    const SizedBox(width: 4),
                    Text(
                      "Masuk: ${tenant['entryDate']}",
                      style: const TextStyle(
                        fontSize: 11.5,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Right Column (Options ..., Remaining Days, Price)
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              GestureDetector(
                onTap: () => _showTenantOptionsModal(context, tenant, index),
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Color(0xFFF8FAFC),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    LucideIcons.moreVertical,
                    size: 16,
                    color: Color(0xFF475569),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              const Text(
                "Sisa Sewa",
                style: TextStyle(
                  fontSize: 10.5,
                  color: Color(0xFF94A3B8),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 1),
              Text(
                tenant["remainingDays"] as String,
                style: TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w900,
                  color: tenant["remainingDaysColor"] as Color,
                ),
              ),
              const SizedBox(height: 8),
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: tenant["price"] as String,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF15803D),
                      ),
                    ),
                    const TextSpan(
                      text: "\n/ bulan",
                      style: TextStyle(
                        fontSize: 10,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // --- MODAL & DIALOG METHODS ---

  void _showTambahPenghuniModal(BuildContext context) {
    final nameController = TextEditingController();
    final phoneController = TextEditingController();
    final roomNumberController = TextEditingController();
    final priceController = TextEditingController();
    final entryDateController = TextEditingController(text: "10 Ags 2026");
    String selectedRoomType = "Tipe AC";
    String selectedStatus = "Aktif";

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
              child: Container(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.88,
                ),
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          "Tambah Penghuni Baru",
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                        ),
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: const Icon(LucideIcons.x, size: 20, color: Color(0xFF64748B)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    const SizedBox(height: 16),

                    Expanded(
                      child: SingleChildScrollView(
                        physics: const BouncingScrollPhysics(),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("Nama Lengkap Penghuni", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                            const SizedBox(height: 6),
                            TextField(
                              controller: nameController,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                              decoration: InputDecoration(
                                hintText: "Masukkan Nama Lengkap",
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                              ),
                            ),
                            const SizedBox(height: 14),

                            const Text("No. WhatsApp / HP", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                            const SizedBox(height: 6),
                            TextField(
                              controller: phoneController,
                              keyboardType: TextInputType.phone,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                              decoration: InputDecoration(
                                hintText: "Contoh: 081234567890",
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                              ),
                            ),
                            const SizedBox(height: 14),

                            Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text("Nomor Kamar", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                                      const SizedBox(height: 6),
                                      TextField(
                                        controller: roomNumberController,
                                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                                        decoration: InputDecoration(
                                          hintText: "Cth: Kamar 1A",
                                          filled: true,
                                          fillColor: const Color(0xFFF8FAFC),
                                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text("Tipe Kamar", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                                      const SizedBox(height: 6),
                                      DropdownButtonFormField<String>(
                                        initialValue: selectedRoomType,
                                        items: ["Tipe AC", "Tipe Standar", "Tipe VIP", "Tipe Deluxe"]
                                            .map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(fontSize: 13))))
                                            .toList(),
                                        onChanged: (val) {
                                          if (val != null) setModalState(() => selectedRoomType = val);
                                        },
                                        decoration: InputDecoration(
                                          filled: true,
                                          fillColor: const Color(0xFFF8FAFC),
                                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),

                            Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text("Tanggal Masuk", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                                      const SizedBox(height: 6),
                                      TextField(
                                        controller: entryDateController,
                                        readOnly: true,
                                        onTap: () async {
                                          final picked = await showDatePicker(
                                            context: context,
                                            initialDate: DateTime.now(),
                                            firstDate: DateTime(2020),
                                            lastDate: DateTime(2030),
                                          );
                                          if (picked != null) {
                                            setModalState(() {
                                              entryDateController.text = "${picked.day} Ags ${picked.year}";
                                            });
                                          }
                                        },
                                        decoration: InputDecoration(
                                          suffixIcon: const Icon(LucideIcons.calendar, size: 18, color: Color(0xFF15803D)),
                                          filled: true,
                                          fillColor: const Color(0xFFF8FAFC),
                                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text("Harga Sewa / Bulan", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                                      const SizedBox(height: 6),
                                      TextField(
                                        controller: priceController,
                                        keyboardType: TextInputType.number,
                                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                                        decoration: InputDecoration(
                                          prefixText: "Rp ",
                                          hintText: "1.200.000",
                                          filled: true,
                                          fillColor: const Color(0xFFF8FAFC),
                                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: () {
                          final name = nameController.text.trim();
                          final phone = phoneController.text.trim();
                          final roomNum = roomNumberController.text.trim();
                          final priceVal = priceController.text.trim();
                          final formattedPrice = priceVal.isNotEmpty ? "Rp $priceVal" : "Rp 1.200.000";
                          final fullRoom = roomNum.isNotEmpty ? "$roomNum • $selectedRoomType" : "Kamar 1A • $selectedRoomType";

                          if (name.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text("Masukkan nama penghuni terlebih dahulu!"), backgroundColor: Color(0xFFEF4444)),
                            );
                            return;
                          }

                          setState(() {
                            _tenants.insert(0, {
                              "name": name,
                              "status": selectedStatus,
                              "room": fullRoom,
                              "phone": phone.isNotEmpty ? phone : "081234567890",
                              "entryDate": entryDateController.text,
                              "remainingDays": "30 hari lagi",
                              "remainingDaysColor": const Color(0xFF15803D),
                              "price": formattedPrice,
                              "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop",
                            });
                          });

                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text("Penghuni $name Berhasil Ditambahkan!"),
                              backgroundColor: const Color(0xFF15803D),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF15803D),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: const Text("Simpan Penghuni Baru", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _showTenantOptionsModal(BuildContext context, Map<String, dynamic> tenant, int index) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: const Color(0xFFCBD5E1),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    "Opsi Penghuni ${tenant['name']}",
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "${tenant['room']} • Telp: ${tenant['phone']}",
                    style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 16),

                  // 1. Edit Data Penghuni
                  _buildOptionTile(
                    icon: LucideIcons.pencil,
                    iconColor: const Color(0xFF15803D),
                    iconBg: const Color(0xFFEDFBF4),
                    title: "Edit Data Penghuni",
                    subtitle: "Ubah nama, no hp, kamar, tgl masuk & harga",
                    onTap: () {
                      Navigator.pop(context);
                      _showEditPenghuniModal(context, tenant, index);
                    },
                  ),
                  const SizedBox(height: 10),

                  // 2. Hapus Data Penghuni
                  _buildOptionTile(
                    icon: LucideIcons.trash2,
                    iconColor: const Color(0xFFEF4444),
                    iconBg: const Color(0xFFFEF2F2),
                    title: "Hapus Penghuni",
                    subtitle: "Keluarkan & hapus data penghuni kos ini",
                    onTap: () {
                      Navigator.pop(context);
                      _showHapusPenghuniDialog(context, tenant, index);
                    },
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text("Batal", style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF475569))),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildOptionTile({
    required IconData icon,
    required Color iconColor,
    required Color iconBg,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: iconBg,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 20, color: iconColor),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                  ),
                ],
              ),
            ),
            const Icon(LucideIcons.chevronRight, size: 16, color: Color(0xFF94A3B8)),
          ],
        ),
      ),
    );
  }

  void _showEditPenghuniModal(BuildContext context, Map<String, dynamic> tenant, int index) {
    final nameController = TextEditingController(text: tenant["name"]);
    final phoneController = TextEditingController(text: tenant["phone"]);
    final roomController = TextEditingController(text: tenant["room"]);
    final entryDateController = TextEditingController(text: tenant["entryDate"]);
    final priceController = TextEditingController(
      text: tenant["price"].toString().replaceAll("Rp ", "").replaceAll(".", "").replaceAll(" ", ""),
    );

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
              child: Container(
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.88,
                ),
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(2)),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Edit Data ${tenant['name']}",
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                        ),
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: const Icon(LucideIcons.x, size: 20, color: Color(0xFF64748B)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    const SizedBox(height: 16),

                    Expanded(
                      child: SingleChildScrollView(
                        physics: const BouncingScrollPhysics(),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("Nama Lengkap", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                            const SizedBox(height: 6),
                            TextField(
                              controller: nameController,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                              ),
                            ),
                            const SizedBox(height: 14),

                            const Text("No. WhatsApp / HP", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                            const SizedBox(height: 6),
                            TextField(
                              controller: phoneController,
                              keyboardType: TextInputType.phone,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                              ),
                            ),
                            const SizedBox(height: 14),

                            const Text("Kamar & Tipe", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                            const SizedBox(height: 6),
                            TextField(
                              controller: roomController,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                              ),
                            ),
                            const SizedBox(height: 14),

                            Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text("Tanggal Masuk", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                                      const SizedBox(height: 6),
                                      TextField(
                                        controller: entryDateController,
                                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                                        decoration: InputDecoration(
                                          filled: true,
                                          fillColor: const Color(0xFFF8FAFC),
                                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text("Harga Sewa / Bulan", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                                      const SizedBox(height: 6),
                                      TextField(
                                        controller: priceController,
                                        keyboardType: TextInputType.number,
                                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                                        decoration: InputDecoration(
                                          prefixText: "Rp ",
                                          filled: true,
                                          fillColor: const Color(0xFFF8FAFC),
                                          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: () {
                          final name = nameController.text.trim();
                          final phone = phoneController.text.trim();
                          final room = roomController.text.trim();
                          final priceVal = priceController.text.trim();
                          final formattedPrice = priceVal.isNotEmpty ? "Rp $priceVal" : tenant["price"];

                          setState(() {
                            tenant["name"] = name.isNotEmpty ? name : tenant["name"];
                            tenant["phone"] = phone.isNotEmpty ? phone : tenant["phone"];
                            tenant["room"] = room.isNotEmpty ? room : tenant["room"];
                            tenant["entryDate"] = entryDateController.text.trim().isNotEmpty ? entryDateController.text.trim() : tenant["entryDate"];
                            tenant["price"] = formattedPrice;
                          });

                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text("Data Penghuni ${tenant['name']} Berhasil Diperbarui!"),
                              backgroundColor: const Color(0xFF15803D),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF15803D),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: const Text("Simpan Perubahan", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _showHapusPenghuniDialog(BuildContext context, Map<String, dynamic> tenant, int index) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: const [
              Icon(LucideIcons.trash2, color: Color(0xFFEF4444), size: 22),
              SizedBox(width: 8),
              Text("Hapus Penghuni?", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
            ],
          ),
          content: Text(
            "Apakah Anda yakin ingin menghapus data penghuni ${tenant['name']} dari ${tenant['room']}? Data penghuni akan dihapus dari sistem.",
            style: const TextStyle(fontSize: 13, color: Color(0xFF475569)),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Batal", style: TextStyle(color: Color(0xFF64748B))),
            ),
            ElevatedButton(
              onPressed: () {
                final removedName = tenant['name'];
                setState(() {
                  _tenants.removeAt(index);
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text("Penghuni $removedName berhasil dihapus."),
                    backgroundColor: const Color(0xFFEF4444),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444), foregroundColor: Colors.white),
              child: const Text("Hapus Permanen"),
            ),
          ],
        );
      },
    );
  }
}
