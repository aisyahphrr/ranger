import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

// Show Action Menu BottomSheet (Image 2)
void showKamarActionMenuBottomSheet(BuildContext context, {required Function(Map<String, dynamic>) onRoomAdded}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) {
      return KamarActionMenuModal(onRoomAdded: onRoomAdded);
    },
  );
}

// Show Tambah Kamar Multi-Step Modal (Image 3, 4, 5)
void showTambahKamarModal(BuildContext context, {required Function(Map<String, dynamic>) onRoomAdded}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) {
      return TambahKamarModal(onRoomAdded: onRoomAdded);
    },
  );
}

// Image 2 Modal Component
class KamarActionMenuModal extends StatelessWidget {
  final Function(Map<String, dynamic>) onRoomAdded;

  const KamarActionMenuModal({super.key, required this.onRoomAdded});

  @override
  Widget build(BuildContext context) {
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
            children: [
              // Drag Handle
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
              const SizedBox(height: 20),

              // 1. Tambah Kamar Baru
              _buildMenuItem(
                context,
                icon: LucideIcons.plus,
                iconColor: const Color(0xFF15803D),
                iconBg: const Color(0xFFEDFBF4),
                title: "Tambah Kamar Baru",
                subtitle: "Buat kamar baru untuk disewakan",
                onTap: () {
                  Navigator.pop(context); // Close action menu
                  showTambahKamarModal(context, onRoomAdded: onRoomAdded);
                },
              ),
              const SizedBox(height: 12),

              // 2. Edit Kamar
              _buildMenuItem(
                context,
                icon: LucideIcons.pencil,
                iconColor: const Color(0xFF15803D),
                iconBg: const Color(0xFFEDFBF4),
                title: "Edit Kamar",
                subtitle: "Ubah informasi kamar yang sudah ada",
                onTap: () => Navigator.pop(context),
              ),
              const SizedBox(height: 12),

              // 3. Duplikat Kamar
              _buildMenuItem(
                context,
                icon: LucideIcons.copy,
                iconColor: const Color(0xFF15803D),
                iconBg: const Color(0xFFEDFBF4),
                title: "Duplikat Kamar",
                subtitle: "Salin data kamar untuk kamar baru",
                onTap: () => Navigator.pop(context),
              ),
              const SizedBox(height: 12),

              // 4. Nonaktifkan Kamar
              _buildMenuItem(
                context,
                icon: LucideIcons.eyeOff,
                iconColor: const Color(0xFFEA580C),
                iconBg: const Color(0xFFFEF3C7),
                title: "Nonaktifkan Kamar",
                subtitle: "Sembunyikan kamar dari pencarian",
                onTap: () => Navigator.pop(context),
              ),
              const SizedBox(height: 12),

              // 5. Hapus Kamar
              _buildMenuItem(
                context,
                icon: LucideIcons.trash2,
                iconColor: const Color(0xFFDC2626),
                iconBg: const Color(0xFFFEE2E8),
                title: "Hapus Kamar",
                subtitle: "Hapus kamar secara permanen",
                onTap: () => Navigator.pop(context),
              ),
              const SizedBox(height: 20),

              // Cancel Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF8FAFC),
                    foregroundColor: const Color(0xFF0F172A),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    "Batal",
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem(
    BuildContext context, {
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
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
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
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Multi-step Form Modal (Step 1, 2, 3)
class TambahKamarModal extends StatefulWidget {
  final Function(Map<String, dynamic>) onRoomAdded;

  const TambahKamarModal({super.key, required this.onRoomAdded});

  @override
  State<TambahKamarModal> createState() => _TambahKamarModalState();
}

class _TambahKamarModalState extends State<TambahKamarModal> {
  int _step = 1; // 1: Informasi Dasar, 2: Fasilitas & Foto, 3: Ringkasan & Status

  // Step 1 Controllers
  late TextEditingController _roomNumberController;
  late TextEditingController _priceController;
  late TextEditingController _descController;
  String _selectedRoomType = "Tipe AC";

  // Step 2 Facilities & Photos
  final Set<String> _selectedFacilities = {"AC", "WiFi", "KM Dalam", "Kasur", "Lemari", "Meja"};
  final List<String> _allFacilities = [
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
    "Parkir",
  ];

  // Step 3 Room Status
  String _roomStatus = "Tersedia"; // Tersedia / Tidak Tersedia

  @override
  void initState() {
    super.initState();
    _roomNumberController = TextEditingController(text: "1A");
    _priceController = TextEditingController(text: "1.200.000");
    _descController = TextEditingController(text: "Kamar nyaman dan bersih, cocok untuk mahasiswa atau pekerja.");
  }

  @override
  void dispose() {
    _roomNumberController.dispose();
    _priceController.dispose();
    _descController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: MediaQuery.of(context).padding.top + 30),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: SingleChildScrollView(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom + 20),
        child: Column(
          children: [
            const SizedBox(height: 14),
            // Header Bar (Title & Close Button)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const SizedBox(width: 24),
                  Column(
                    children: const [
                      Text(
                        "Tambah",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                          height: 1.1,
                        ),
                      ),
                      Text(
                        "Kamar Baru",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                          height: 1.1,
                        ),
                      ),
                    ],
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(
                        color: Color(0xFFF1F5F9),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(LucideIcons.x, size: 18, color: Color(0xFF64748B)),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const Divider(height: 1, color: Color(0xFFF1F5F9)),
            const SizedBox(height: 16),

            // Stepper Header (1 - 2 - 3)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: Row(
                children: [
                  _buildStepCircle(1),
                  Expanded(child: Container(height: 2, color: _step >= 2 ? const Color(0xFF15803D) : const Color(0xFFF1F5F9))),
                  _buildStepCircle(2),
                  Expanded(child: Container(height: 2, color: _step >= 3 ? const Color(0xFF15803D) : const Color(0xFFF1F5F9))),
                  _buildStepCircle(3),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Step Content Body
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              child: _buildCurrentStep(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepCircle(int stepNumber) {
    final isDone = _step > stepNumber;
    final isActive = _step == stepNumber;

    Color bg = const Color(0xFFF1F5F9);
    Color textColor = const Color(0xFF94A3B8);

    if (isDone || isActive) {
      bg = const Color(0xFF15803D);
      textColor = Colors.white;
    }

    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        color: bg,
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          "$stepNumber",
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w800,
            color: textColor,
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentStep() {
    switch (_step) {
      case 1:
        return _buildStep1Info();
      case 2:
        return _buildStep2Facilities();
      case 3:
        return _buildStep3Summary();
      default:
        return _buildStep1Info();
    }
  }

  // STEP 1: Informasi Dasar
  Widget _buildStep1Info() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Informasi Dasar",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 20),

          // Nomor Kamar
          RichText(
            text: const TextSpan(
              children: [
                TextSpan(text: "Nomor Kamar ", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                TextSpan(text: "*", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFFEF4444))),
              ],
            ),
          ),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
            ),
            child: TextField(
              controller: _roomNumberController,
              style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A), fontWeight: FontWeight.w600),
              decoration: const InputDecoration(
                hintText: "Contoh: 1A",
                hintStyle: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Tipe Kamar Dropdown
          RichText(
            text: const TextSpan(
              children: [
                TextSpan(text: "Tipe Kamar ", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                TextSpan(text: "*", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFFEF4444))),
              ],
            ),
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedRoomType,
                isExpanded: true,
                icon: const Icon(LucideIcons.chevronDown, size: 18, color: Color(0xFF64748B)),
                style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A), fontWeight: FontWeight.w600),
                onChanged: (val) {
                  if (val != null) {
                    setState(() {
                      _selectedRoomType = val;
                    });
                  }
                },
                items: ["Tipe AC", "Tipe Standar", "Tipe Eksklusif"]
                    .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                    .toList(),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Harga Sewa / bulan
          RichText(
            text: const TextSpan(
              children: [
                TextSpan(text: "Harga Sewa / bulan ", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                TextSpan(text: "*", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFFEF4444))),
              ],
            ),
          ),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
            ),
            child: TextField(
              controller: _priceController,
              keyboardType: TextInputType.number,
              style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A), fontWeight: FontWeight.w600),
              decoration: const InputDecoration(
                prefixText: "Rp  ",
                prefixStyle: TextStyle(fontSize: 14, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Deskripsi (Opsional)
          const Text(
            "Deskripsi (Opsional)",
            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
          ),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
            ),
            child: TextField(
              controller: _descController,
              maxLines: 3,
              style: const TextStyle(fontSize: 13.5, color: Color(0xFF0F172A)),
              decoration: const InputDecoration(
                hintText: "Tambahkan deskripsi kamar...",
                hintStyle: TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Lanjut Button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                setState(() {
                  _step = 2;
                });
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF15803D),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Text("Lanjut", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                  SizedBox(width: 8),
                  Icon(LucideIcons.arrowRight, size: 18),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // STEP 2: Fasilitas & Foto Kamar
  Widget _buildStep2Facilities() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Fasilitas Kamar",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            "Pilih fasilitas yang tersedia",
            style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 16),

          // Multi-Select Facilities Chips
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: _allFacilities.map((f) {
              final isSel = _selectedFacilities.contains(f);

              IconData icon = LucideIcons.wifi;
              if (f == "AC") icon = LucideIcons.tv;
              if (f == "Kipas") icon = LucideIcons.wind;
              if (f.contains("KM")) icon = LucideIcons.bath;
              if (f == "Kasur" || f == "Lemari" || f == "Meja" || f == "Kursi") icon = LucideIcons.home;

              return GestureDetector(
                onTap: () {
                  setState(() {
                    if (isSel) {
                      _selectedFacilities.remove(f);
                    } else {
                      _selectedFacilities.add(f);
                    }
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: isSel ? const Color(0xFFEDFBF4) : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSel ? const Color(0xFF15803D) : const Color(0xFFE2E8F0),
                      width: 1.2,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(icon, size: 16, color: isSel ? const Color(0xFF15803D) : const Color(0xFF475569)),
                      const SizedBox(width: 6),
                      Text(
                        f,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: isSel ? const Color(0xFF15803D) : const Color(0xFF334155),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          // Foto Kamar Section
          const Text(
            "Foto Kamar",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            "Tambahkan foto kamar (Maks. 5 foto)",
            style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 14),

          // Add Photo Dotted Box
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFCBD5E1), width: 1.2),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(LucideIcons.plus, size: 24, color: Color(0xFF15803D)),
                SizedBox(height: 4),
                Text(
                  "Tambah Foto",
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF15803D),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),

          // Lanjut Button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                setState(() {
                  _step = 3;
                });
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF15803D),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Text("Lanjut", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                  SizedBox(width: 8),
                  Icon(LucideIcons.arrowRight, size: 18),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // STEP 3: Ringkasan & Status Kamar
  Widget _buildStep3Summary() {
    final numStr = _roomNumberController.text.isEmpty ? "1A" : _roomNumberController.text;
    final priceStr = _priceController.text.isEmpty ? "1.200.000" : _priceController.text;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Ringkasan",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            "Periksa kembali informasi kamar Anda",
            style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 16),

          // Summary Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE2E8F0),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(LucideIcons.image, size: 28, color: Color(0xFF94A3B8)),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                numStr,
                                style: const TextStyle(
                                  fontSize: 18,
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
                                  _selectedRoomType,
                                  style: const TextStyle(
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF15803D),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          RichText(
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: "Rp $priceStr",
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF15803D),
                                  ),
                                ),
                                const TextSpan(
                                  text: " / bulan",
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF64748B),
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                const Divider(height: 1, color: Color(0xFFE2E8F0)),
                const SizedBox(height: 12),

                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(
                      width: 80,
                      child: Text(
                        "Fasilitas",
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
                      ),
                    ),
                    Expanded(
                      child: Text(
                        _selectedFacilities.join(", "),
                        style: const TextStyle(fontSize: 12.5, color: Color(0xFF334155), fontWeight: FontWeight.w500),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(
                      width: 80,
                      child: Text(
                        "Deskripsi",
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
                      ),
                    ),
                    Expanded(
                      child: Text(
                        _descController.text,
                        style: const TextStyle(fontSize: 12.5, color: Color(0xFF334155), fontWeight: FontWeight.w400, height: 1.3),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Status Kamar Radio Selection
          const Text(
            "Status Kamar",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 12),

          // Option 1: Tersedia
          GestureDetector(
            onTap: () {
              setState(() {
                _roomStatus = "Tersedia";
              });
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _roomStatus == "Tersedia" ? const Color(0xFFEDFBF4) : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: _roomStatus == "Tersedia" ? const Color(0xFF15803D) : const Color(0xFFE2E8F0),
                  width: _roomStatus == "Tersedia" ? 1.8 : 1.2,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _roomStatus == "Tersedia" ? const Color(0xFF15803D) : Colors.transparent,
                      border: Border.all(
                        color: _roomStatus == "Tersedia" ? const Color(0xFF15803D) : const Color(0xFFCBD5E1),
                        width: 2,
                      ),
                    ),
                    child: _roomStatus == "Tersedia"
                        ? const Icon(Icons.check_rounded, size: 14, color: Colors.white)
                        : null,
                  ),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        "Tersedia",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF15803D),
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        "Kamar siap disewakan",
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF64748B),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),

          // Option 2: Tidak Tersedia
          GestureDetector(
            onTap: () {
              setState(() {
                _roomStatus = "Tidak Tersedia";
              });
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _roomStatus == "Tidak Tersedia" ? const Color(0xFFFEF2F2) : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: _roomStatus == "Tidak Tersedia" ? const Color(0xFFDC2626) : const Color(0xFFE2E8F0),
                  width: _roomStatus == "Tidak Tersedia" ? 1.8 : 1.2,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _roomStatus == "Tidak Tersedia" ? const Color(0xFFDC2626) : Colors.transparent,
                      border: Border.all(
                        color: _roomStatus == "Tidak Tersedia" ? const Color(0xFFDC2626) : const Color(0xFFCBD5E1),
                        width: 2,
                      ),
                    ),
                    child: _roomStatus == "Tidak Tersedia"
                        ? const Icon(Icons.check_rounded, size: 14, color: Colors.white)
                        : null,
                  ),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        "Tidak Tersedia",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        "Sembunyikan kamar sementara",
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF64748B),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 28),

          // Simpan Kamar Primary Button
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                final newRoom = {
                  "number": numStr,
                  "type": _selectedRoomType,
                  "status": _roomStatus == "Tersedia" ? "Kosong" : "Tidak Tersedia",
                  "facilities": _selectedFacilities.toList(),
                  "furniture": "Kasur, Lemari, Meja",
                  "occupant": null,
                  "occupantAvatar": null,
                  "price": "Rp $priceStr",
                  "img": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&fit=crop",
                };

                widget.onRoomAdded(newRoom);
                Navigator.pop(context); // Close modal
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF15803D),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: const Text(
                "Simpan Kamar",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
