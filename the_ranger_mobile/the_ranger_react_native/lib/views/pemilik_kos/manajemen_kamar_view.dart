import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'tambah_kamar_modal.dart';

class ManajemenKamarView extends StatefulWidget {
  const ManajemenKamarView({super.key});

  @override
  State<ManajemenKamarView> createState() => _ManajemenKamarViewState();
}

class _ManajemenKamarViewState extends State<ManajemenKamarView> {

  final List<Map<String, dynamic>> _rooms = [
    {
      "number": "1A",
      "type": "Tipe AC",
      "status": "Terisi", // Terisi / Kosong
      "facilities": ["AC", "WiFi", "KM Dalam"],
      "furniture": "Kasur, Lemari, Meja",
      "occupant": "Budi Santoso",
      "occupantAvatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop",
      "price": "Rp 1.200.000",
      "img": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&fit=crop",
    },
    {
      "number": "2B",
      "type": "Tipe Standar",
      "status": "Kosong",
      "facilities": ["Kipas", "WiFi", "KM Luar"],
      "furniture": "Kasur, Lemari",
      "occupant": null,
      "occupantAvatar": null,
      "price": "Rp 950.000",
      "img": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&fit=crop",
    },
    {
      "number": "2C",
      "type": "Tipe AC",
      "status": "Terisi",
      "facilities": ["AC", "WiFi", "KM Dalam"],
      "furniture": "Kasur, Lemari, Meja, Meja Belajar",
      "occupant": "Ahmad Yani",
      "occupantAvatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&fit=crop",
      "price": "Rp 1.200.000",
      "img": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&fit=crop",
    },
  ];

  @override
  Widget build(BuildContext context) {
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
          "Manajemen Kamar",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: Color(0xFF0F172A),
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

          // Add Room Plus Button
          GestureDetector(
            onTap: () {
              showTambahKamarModal(
                context,
                onRoomAdded: (newRoom) {
                  setState(() {
                    _rooms.insert(0, newRoom);
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text("Kamar ${newRoom['number']} Berhasil Ditambahkan!"),
                      backgroundColor: const Color(0xFF15803D),
                    ),
                  );
                },
              );
            },
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
          // Scrollable Body Content
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Subtitle Header
                const Text(
                  "Kelola semua kamar kos Anda",
                  style: TextStyle(
                    fontSize: 12.5,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 16),

                // Top 3 Metric Cards Row (Total Kamar, Terisi, Kosong)
                Row(
                  children: [
                    _buildStatCard(
                      label: "Total Kamar",
                      value: "12",
                      subtitle: "Semua kamar",
                      valueColor: const Color(0xFF0F172A),
                    ),
                    const SizedBox(width: 10),
                    _buildStatCard(
                      label: "Terisi 🟢",
                      value: "10",
                      subtitle: "83%",
                      valueColor: const Color(0xFF0F172A),
                    ),
                    const SizedBox(width: 10),
                    _buildStatCard(
                      label: "Kosong",
                      labelColor: const Color(0xFFEA580C),
                      value: "2",
                      subtitle: "17%",
                      valueColor: const Color(0xFFEA580C),
                      subtitleColor: const Color(0xFFEA580C),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Category Tab Indicator
                Container(
                  width: 100,
                  height: 3,
                  decoration: BoxDecoration(
                    color: const Color(0xFF15803D),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 16),

                // Room Cards List
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _rooms.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 16),
                  itemBuilder: (context, index) {
                    final room = _rooms[index];
                    return _buildRoomCard(room, index);
                  },
                ),
                const SizedBox(height: 24),
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
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
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
                fontSize: 11.5,
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

  Widget _buildRoomCard(Map<String, dynamic> room, int index) {
    final isOccupied = room["status"] == "Terisi";
    final isNonaktif = room["status"] == "Nonaktif";

    final statusBg = isOccupied
        ? const Color(0xFFDCFCE7)
        : isNonaktif
            ? const Color(0xFFF1F5F9)
            : const Color(0xFFFFF7ED);
    final statusTextColor = isOccupied
        ? const Color(0xFF15803D)
        : isNonaktif
            ? const Color(0xFF64748B)
            : const Color(0xFFFF6B00);

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Left Image Container with Status Overlay Badge
          SizedBox(
            width: 105,
            height: 125,
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    room["img"] as String,
                    width: 105,
                    height: 125,
                    fit: BoxFit.cover,
                  ),
                ),
                // Top Left Overlay Badge (Terisi / Kosong / Nonaktif)
                Positioned(
                  top: 6,
                  left: 6,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: statusBg,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.08),
                          blurRadius: 4,
                        ),
                      ],
                    ),
                    child: Text(
                      room["status"] as String,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: statusTextColor,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),

          // Right Details Column (Fixed 125px height matching image)
          Expanded(
            child: SizedBox(
              height: 125,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Top Row: Room Number, Type Badge & Options Button (...)
                  Row(
                    children: [
                      Text(
                        room["number"] as String,
                        style: const TextStyle(
                          fontSize: 19,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Flexible(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEDFBF4),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            room["type"] as String,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 10.5,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF15803D),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 4),

                      // Three Dots (...) Options Button in a clean round target
                      GestureDetector(
                        onTap: () => _showRoomOptionsModal(context, room, index),
                        child: Container(
                          padding: const EdgeInsets.all(5),
                          decoration: const BoxDecoration(
                            color: Color(0xFFF8FAFC),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            LucideIcons.moreHorizontal,
                            size: 18,
                            color: Color(0xFF475569),
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Facilities Row
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    physics: const BouncingScrollPhysics(),
                    child: Row(
                      children: (room["facilities"] as List<String>).map((f) {
                        IconData icon = LucideIcons.wifi;
                        if (f == "AC") icon = LucideIcons.tv;
                        if (f == "KM Dalam" || f == "KM Luar") icon = LucideIcons.bath;
                        if (f == "Kipas") icon = LucideIcons.wind;

                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: Row(
                            children: [
                              Icon(icon, size: 12, color: const Color(0xFF64748B)),
                              const SizedBox(width: 3),
                              Text(
                                f,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),

                  // Furniture Subtitle Row
                  Row(
                    children: [
                      const Icon(LucideIcons.home, size: 12, color: Color(0xFF94A3B8)),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          room["furniture"] as String,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 11,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ),
                    ],
                  ),

                  // Footer Row: Occupant Info (or Status) & Price
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      if (isOccupied && room["occupant"] != null)
                        Expanded(
                          child: Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(10),
                                child: Image.network(
                                  room["occupantAvatar"] as String,
                                  width: 22,
                                  height: 22,
                                  fit: BoxFit.cover,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      "Penghuni",
                                      style: TextStyle(
                                        fontSize: 9,
                                        color: Color(0xFF94A3B8),
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    Text(
                                      room["occupant"] as String,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w800,
                                        color: Color(0xFF0F172A),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        )
                      else
                        Row(
                          children: const [
                            Icon(LucideIcons.store, size: 12, color: Color(0xFFFF6B00)),
                            SizedBox(width: 4),
                            Text(
                              "Tersedia",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFFFF6B00),
                              ),
                            ),
                          ],
                        ),

                      // Price Text
                      Flexible(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          alignment: Alignment.centerRight,
                          child: RichText(
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: room["price"] as String,
                                  style: const TextStyle(
                                    fontSize: 15.5,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF15803D),
                                  ),
                                ),
                                const TextSpan(
                                  text: " /bln",
                                  style: TextStyle(
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.w500,
                                    color: Color(0xFF64748B),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showRoomOptionsModal(BuildContext context, Map<String, dynamic> room, int index) {
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
                    "Opsi Kamar ${room['number']}",
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Tipe: ${room['type']} • Status: ${room['status']}",
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF64748B),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // 1. Edit Kamar
                  _buildOptionTile(
                    icon: LucideIcons.pencil,
                    iconColor: const Color(0xFF15803D),
                    iconBg: const Color(0xFFEDFBF4),
                    title: "Edit Kamar",
                    subtitle: "Ubah informasi kamar yang sudah ada",
                    onTap: () {
                      Navigator.pop(context);
                      _showEditKamarModal(context, room, index);
                    },
                  ),
                  const SizedBox(height: 10),

                  // 2. Duplikat Kamar
                  _buildOptionTile(
                    icon: LucideIcons.copy,
                    iconColor: const Color(0xFF15803D),
                    iconBg: const Color(0xFFEDFBF4),
                    title: "Duplikat Kamar",
                    subtitle: "Salin data kamar untuk kamar baru",
                    onTap: () {
                      Navigator.pop(context);
                      _showDuplikatKamarDialog(context, room, index);
                    },
                  ),
                  const SizedBox(height: 10),

                  // 3. Nonaktifkan Kamar
                  _buildOptionTile(
                    icon: LucideIcons.eyeOff,
                    iconColor: const Color(0xFFEA580C),
                    iconBg: const Color(0xFFFFF7ED),
                    title: room["status"] == "Nonaktif" ? "Aktifkan Kamar" : "Nonaktifkan Kamar",
                    subtitle: "Sembunyikan atau tampilkan kamar dari pencarian",
                    onTap: () {
                      Navigator.pop(context);
                      _showToggleActiveKamarDialog(context, room, index);
                    },
                  ),
                  const SizedBox(height: 10),

                  // 4. Hapus Kamar
                  _buildOptionTile(
                    icon: LucideIcons.trash2,
                    iconColor: const Color(0xFFEF4444),
                    iconBg: const Color(0xFFFEF2F2),
                    title: "Hapus Kamar",
                    subtitle: "Hapus kamar secara permanen",
                    onTap: () {
                      Navigator.pop(context);
                      _showHapusKamarDialog(context, room, index);
                    },
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text(
                        "Batal",
                        style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF475569)),
                      ),
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
    return GestureDetector(
      onTap: onTap,
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
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: iconBg,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 11.5,
                      color: Color(0xFF64748B),
                    ),
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

  // 1. Modal Edit Kamar (No Kamar, Tipe, Harga, Deskripsi, Fasilitas Chip, Foto)
  void _showEditKamarModal(BuildContext context, Map<String, dynamic> room, int index) {
    final numberController = TextEditingController(text: room["number"]);
    final priceController = TextEditingController(
      text: room["price"].toString().replaceAll("Rp ", "").replaceAll(".", "").replaceAll(" ", ""),
    );
    final descController = TextEditingController(
      text: room["desc"] as String? ?? "Kamar bersih dan nyaman lengkap dengan perabotan serta pencahayaan alami yang baik.",
    );

    String selectedType = room["type"] as String? ?? "Tipe AC";
    String selectedPhoto = room["img"] as String? ?? "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&fit=crop";

    final Set<String> selectedFacilities = Set<String>.from(room["facilities"] as List<String>? ?? ["AC", "WiFi", "KM Dalam"]);
    if (room["furniture"] != null) {
      final furnitureItems = (room["furniture"] as String).split(", ");
      for (var f in furnitureItems) {
        if (f.isNotEmpty) selectedFacilities.add(f.trim());
      }
    }

    final List<String> allFacilitiesOptions = [
      "AC",
      "Kipas",
      "WiFi",
      "KM Dalam",
      "KM Luar",
      "Kasur",
      "Lemari",
      "Meja",
      "Kursi",
      "TV",
      "Dispenser",
      "Kulkas",
      "Balkon",
      "Parkir",
    ];

    final List<String> samplePhotos = [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&fit=crop",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&fit=crop",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&fit=crop",
    ];

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
                        Text(
                          "Edit Kamar ${room['number']}",
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
                            // 1. Nomor Kamar
                            const Text("Nomor Kamar", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                            const SizedBox(height: 6),
                            TextField(
                              controller: numberController,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                              ),
                            ),
                            const SizedBox(height: 16),

                            // 2. Tipe Kamar
                            const Text("Tipe Kamar", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                            const SizedBox(height: 6),
                            DropdownButtonFormField<String>(
                              initialValue: ["Tipe AC", "Tipe Standar", "Tipe VIP", "Tipe Deluxe", "Kos Putra", "Kos Putri", "Campur"].contains(selectedType)
                                  ? selectedType
                                  : "Tipe AC",
                              items: ["Tipe AC", "Tipe Standar", "Tipe VIP", "Tipe Deluxe", "Kos Putra", "Kos Putri", "Campur"]
                                  .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                                  .toList(),
                              onChanged: (val) {
                                if (val != null) setModalState(() => selectedType = val);
                              },
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                              ),
                            ),
                            const SizedBox(height: 16),

                            // 3. Harga Sewa / Bulan (Rp)
                            const Text("Harga Sewa / Bulan (Rp)", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
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
                            const SizedBox(height: 16),

                            // 4. Deskripsi Kamar
                            const Text("Deskripsi Kamar", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                            const SizedBox(height: 6),
                            TextField(
                              controller: descController,
                              maxLines: 3,
                              style: const TextStyle(fontSize: 13, color: Color(0xFF0F172A)),
                              decoration: InputDecoration(
                                hintText: "Masukkan deskripsi fasilitas atau ketentuan kamar...",
                                filled: true,
                                fillColor: const Color(0xFFF8FAFC),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                              ),
                            ),
                            const SizedBox(height: 18),

                            // 5. Fasilitas & Perabotan Kamar (Pilih Chips, BUKAN isi manual)
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text("Fasilitas Kamar", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                                Text(
                                  "${selectedFacilities.length} dipilih",
                                  style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Color(0xFF15803D)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              "Pilih fasilitas yang tersedia di dalam kamar",
                              style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                            ),
                            const SizedBox(height: 10),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: allFacilitiesOptions.map((f) {
                                final isSelected = selectedFacilities.contains(f);

                                IconData icon = LucideIcons.wifi;
                                if (f == "AC") icon = LucideIcons.tv;
                                if (f == "Kipas") icon = LucideIcons.wind;
                                if (f.contains("KM")) icon = LucideIcons.bath;
                                if (f == "Kasur" || f == "Lemari" || f == "Meja" || f == "Kursi") icon = LucideIcons.home;

                                return GestureDetector(
                                  onTap: () {
                                    setModalState(() {
                                      if (isSelected) {
                                        selectedFacilities.remove(f);
                                      } else {
                                        selectedFacilities.add(f);
                                      }
                                    });
                                  },
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 180),
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: isSelected ? const Color(0xFFEDFBF4) : const Color(0xFFF8FAFC),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: isSelected ? const Color(0xFF15803D) : const Color(0xFFE2E8F0),
                                        width: 1.2,
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Icon(icon, size: 14, color: isSelected ? const Color(0xFF15803D) : const Color(0xFF64748B)),
                                        const SizedBox(width: 6),
                                        Text(
                                          f,
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w700,
                                            color: isSelected ? const Color(0xFF15803D) : const Color(0xFF334155),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                            const SizedBox(height: 20),

                            // 6. Foto Kamar (Pilih / Switch Foto)
                            const Text("Foto Kamar", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                            const SizedBox(height: 4),
                            const Text("Pilih gambar sampel atau ganti foto kamar", style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B))),
                            const SizedBox(height: 10),

                            // Selected Main Photo Preview
                            ClipRRect(
                              borderRadius: BorderRadius.circular(16),
                              child: Stack(
                                children: [
                                  Image.network(
                                    selectedPhoto,
                                    width: double.infinity,
                                    height: 160,
                                    fit: BoxFit.cover,
                                  ),
                                  Positioned(
                                    right: 12,
                                    top: 12,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                      decoration: BoxDecoration(
                                        color: Colors.black.withValues(alpha: 0.6),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Row(
                                        children: const [
                                          Icon(LucideIcons.camera, size: 14, color: Colors.white),
                                          SizedBox(width: 4),
                                          Text("Foto Aktif", style: TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w700)),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 12),

                            // Sample Photos Selection Carousel
                            SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              physics: const BouncingScrollPhysics(),
                              child: Row(
                                children: samplePhotos.map((photoUrl) {
                                  final isCurrentPhoto = selectedPhoto == photoUrl;

                                  return GestureDetector(
                                    onTap: () {
                                      setModalState(() {
                                        selectedPhoto = photoUrl;
                                      });
                                    },
                                    child: Container(
                                      margin: const EdgeInsets.only(right: 10),
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(
                                          color: isCurrentPhoto ? const Color(0xFF15803D) : Colors.transparent,
                                          width: 2.5,
                                        ),
                                      ),
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(10),
                                        child: Image.network(
                                          photoUrl,
                                          width: 70,
                                          height: 70,
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ),
                            const SizedBox(height: 24),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 12),

                    // Simpan Perubahan Button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: () {
                          final newNum = numberController.text.trim();
                          final newPriceVal = priceController.text.trim();
                          final formattedPrice = newPriceVal.isNotEmpty ? "Rp $newPriceVal" : room["price"];

                          // Categorize facilities into room facilities list and furniture summary string
                          final roomFacilitiesList = selectedFacilities.where((f) => ["AC", "Kipas", "WiFi", "KM Dalam", "KM Luar"].contains(f)).toList();
                          if (roomFacilitiesList.isEmpty && selectedFacilities.isNotEmpty) {
                            roomFacilitiesList.add(selectedFacilities.first);
                          }

                          final furnitureSummary = selectedFacilities.where((f) => ["Kasur", "Lemari", "Meja", "Kursi", "TV", "Dispenser", "Kulkas", "Balkon", "Parkir"].contains(f)).join(", ");

                          setState(() {
                            room["number"] = newNum.isNotEmpty ? newNum : room["number"];
                            room["type"] = selectedType;
                            room["price"] = formattedPrice;
                            room["desc"] = descController.text.trim();
                            room["facilities"] = roomFacilitiesList.isNotEmpty ? roomFacilitiesList : (room["facilities"] as List<String>);
                            room["furniture"] = furnitureSummary.isNotEmpty ? furnitureSummary : room["furniture"];
                            room["img"] = selectedPhoto;
                          });

                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text("Data Kamar ${room['number']} Berhasil Diperbarui!"),
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

  // 2. Dialog Duplikat Kamar
  void _showDuplikatKamarDialog(BuildContext context, Map<String, dynamic> room, int index) {
    final numberController = TextEditingController(text: "${room['number']}-Copy");

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: const [
              Icon(LucideIcons.copy, color: Color(0xFF15803D), size: 22),
              SizedBox(width: 8),
              Text("Duplikat Kamar", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Sistem akan menyalin spesifikasi kamar ${room['number']} (harga & perabotan) ke kamar baru.",
                style: const TextStyle(fontSize: 13, color: Color(0xFF475569)),
              ),
              const SizedBox(height: 14),
              const Text("Nomor Kamar Baru:", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
              const SizedBox(height: 6),
              TextField(
                controller: numberController,
                decoration: InputDecoration(
                  hintText: "Contoh: 1B atau 1A-Copy",
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Batal", style: TextStyle(color: Color(0xFF64748B))),
            ),
            ElevatedButton(
              onPressed: () {
                final newNum = numberController.text.trim();
                final duplicatedRoom = Map<String, dynamic>.from(room);
                duplicatedRoom["number"] = newNum.isNotEmpty ? newNum : "${room['number']}-Copy";
                duplicatedRoom["status"] = "Kosong";
                duplicatedRoom["occupant"] = null;
                duplicatedRoom["occupantAvatar"] = null;

                setState(() {
                  _rooms.insert(index + 1, duplicatedRoom);
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text("Kamar ${duplicatedRoom['number']} berhasil dibuat dari hasil duplikasi!"),
                    backgroundColor: const Color(0xFF15803D),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF15803D), foregroundColor: Colors.white),
              child: const Text("Duplikat Kamar"),
            ),
          ],
        );
      },
    );
  }

  // 3. Dialog Nonaktifkan / Aktifkan Kamar
  void _showToggleActiveKamarDialog(BuildContext context, Map<String, dynamic> room, int index) {
    final isCurrentlyDisabled = room["status"] == "Nonaktif";

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: [
              Icon(
                isCurrentlyDisabled ? LucideIcons.eye : LucideIcons.eyeOff,
                color: const Color(0xFFEA580C),
                size: 22,
              ),
              const SizedBox(width: 8),
              Text(
                isCurrentlyDisabled ? "Aktifkan Kamar?" : "Nonaktifkan Kamar?",
                style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
              ),
            ],
          ),
          content: Text(
            isCurrentlyDisabled
                ? "Kamar ${room['number']} akan kembali ditampilkan dalam daftar pencarian pencari kos."
                : "Kamar ${room['number']} akan disembunyikan sementara dari daftar pencarian kos.",
            style: const TextStyle(fontSize: 13, color: Color(0xFF475569)),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Batal", style: TextStyle(color: Color(0xFF64748B))),
            ),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  if (isCurrentlyDisabled) {
                    room["status"] = "Kosong";
                  } else {
                    room["status"] = "Nonaktif";
                  }
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text("Kamar ${room['number']} ${isCurrentlyDisabled ? 'berhasil diaktifkan kembali' : 'berhasil dinonaktifkan'}."),
                    backgroundColor: const Color(0xFFEA580C),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEA580C), foregroundColor: Colors.white),
              child: Text(isCurrentlyDisabled ? "Ya, Aktifkan" : "Ya, Nonaktifkan"),
            ),
          ],
        );
      },
    );
  }

  // 4. Dialog Hapus Kamar
  void _showHapusKamarDialog(BuildContext context, Map<String, dynamic> room, int index) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Row(
            children: const [
              Icon(LucideIcons.trash2, color: Color(0xFFEF4444), size: 22),
              SizedBox(width: 8),
              Text("Hapus Kamar?", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
            ],
          ),
          content: Text(
            "Apakah Anda yakin ingin menghapus Kamar ${room['number']}? Data kamar akan dihapus secara permanen dari sistem.",
            style: const TextStyle(fontSize: 13, color: Color(0xFF475569)),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Batal", style: TextStyle(color: Color(0xFF64748B))),
            ),
            ElevatedButton(
              onPressed: () {
                final removedNumber = room['number'];
                setState(() {
                  _rooms.removeAt(index);
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text("Kamar $removedNumber berhasil dihapus secara permanen."),
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
