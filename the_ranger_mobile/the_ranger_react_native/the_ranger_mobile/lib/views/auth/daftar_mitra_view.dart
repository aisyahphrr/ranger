import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../../providers/app_provider.dart';

class DaftarMitraView extends StatefulWidget {
  const DaftarMitraView({super.key});

  @override
  State<DaftarMitraView> createState() => _DaftarMitraViewState();
}

class _DaftarMitraViewState extends State<DaftarMitraView> {
  int _step = 1; // 1: Pilih Peran, 2: Data Diri & NIK, 3: Detail Usaha, 4: Approved Success

  final Set<String> _selectedRoles = {"kos", "laundry"};

  // Form Step 2 Controllers
  final TextEditingController _nameController = TextEditingController(text: "Budi Santoso");
  final TextEditingController _nikController = TextEditingController(text: "320xxxxxxxxxxxxx");

  // Form Step 3 Controllers
  final TextEditingController _businessNameController = TextEditingController();
  final TextEditingController _businessAddressController = TextEditingController();

  final List<Map<String, dynamic>> _roleOptions = [
    {
      "id": "driver",
      "title": "Kurir / Driver",
      "icon": LucideIcons.bike,
      "color": const Color(0xFFEA580C),
      "bgColor": const Color(0xFFFFEDD5),
    },
    {
      "id": "kos",
      "title": "Pemilik Kos",
      "icon": LucideIcons.building,
      "color": const Color(0xFF9333EA),
      "bgColor": const Color(0xFFF3E8FF),
    },
    {
      "id": "laundry",
      "title": "Pemilik Laundry",
      "icon": LucideIcons.wind,
      "color": const Color(0xFF2563EB),
      "bgColor": const Color(0xFFEFF6FF),
    },
    {
      "id": "catering",
      "title": "Pemilik Catering",
      "icon": LucideIcons.coffee,
      "color": const Color(0xFFD97706),
      "bgColor": const Color(0xFFFEF3C7),
    },
    {
      "id": "marketplace",
      "title": "Pemilik Marketplace",
      "icon": LucideIcons.store,
      "color": const Color(0xFF16A34A),
      "bgColor": const Color(0xFFDCFCE7),
    },
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _nikController.dispose();
    _businessNameController.dispose();
    _businessAddressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double progressValue = 0.33;
    if (_step == 2) progressValue = 0.66;
    if (_step >= 3) progressValue = 1.0;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: _step > 1 && _step < 4
            ? IconButton(
                icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF0F172A)),
                onPressed: () {
                  setState(() {
                    _step--;
                  });
                },
              )
            : IconButton(
                icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF0F172A)),
                onPressed: () => Navigator.maybePop(context),
              ),
        title: const Text(
          "Daftar Mitra",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(4),
          child: LinearProgressIndicator(
            value: progressValue,
            backgroundColor: const Color(0xFFF1F5F9),
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF15803D)),
            minHeight: 4,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 250),
                child: _buildStepBody(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepBody() {
    switch (_step) {
      case 1:
        return _buildStep1SelectRole();
      case 2:
        return _buildStep2PersonalData();
      case 3:
        return _buildStep3BusinessDetail();
      case 4:
        return _buildStep4SuccessApproved();
      default:
        return _buildStep1SelectRole();
    }
  }

  // STEP 1: Pilih Peran Anda
  Widget _buildStep1SelectRole() {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Pilih Peran Anda",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  "Anda bisa memilih lebih dari satu peran. Dashboard akan menyesuaikan dengan pilihan Anda.",
                  style: TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w400,
                    height: 1.35,
                  ),
                ),
                const SizedBox(height: 24),

                // Selectable Roles Cards
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: _roleOptions.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final role = _roleOptions[index];
                    final isSelected = _selectedRoles.contains(role["id"]);

                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          if (isSelected) {
                            _selectedRoles.remove(role["id"]);
                          } else {
                            _selectedRoles.add(role["id"] as String);
                          }
                        });
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 180),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFFEDFBF4) : Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected ? const Color(0xFF15803D) : const Color(0xFFF1F5F9),
                            width: isSelected ? 1.8 : 1.2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.02),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            // Circular Icon Container
                            Container(
                              width: 46,
                              height: 46,
                              decoration: BoxDecoration(
                                color: role["bgColor"] as Color,
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                role["icon"] as IconData,
                                size: 22,
                                color: role["color"] as Color,
                              ),
                            ),
                            const SizedBox(width: 14),

                            // Role Title
                            Expanded(
                              child: Text(
                                role["title"] as String,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                            ),

                            // Selection Radio Circle
                            Container(
                              width: 22,
                              height: 22,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isSelected ? const Color(0xFF15803D) : Colors.transparent,
                                border: Border.all(
                                  color: isSelected ? const Color(0xFF15803D) : const Color(0xFFCBD5E1),
                                  width: 1.8,
                                ),
                              ),
                              child: isSelected
                                  ? const Icon(
                                      Icons.check_rounded,
                                      size: 14,
                                      color: Colors.white,
                                    )
                                  : null,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),

        // Bottom Button "Lanjutkan"
        Padding(
          padding: const EdgeInsets.all(20),
          child: SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: _selectedRoles.isNotEmpty
                  ? () {
                      setState(() {
                        _step = 2;
                      });
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: _selectedRoles.isNotEmpty ? const Color(0xFF15803D) : const Color(0xFFE2E8F0),
                foregroundColor: _selectedRoles.isNotEmpty ? Colors.white : const Color(0xFF94A3B8),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: const Text(
                "Lanjutkan",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // STEP 2: Data Diri & NIK
  Widget _buildStep2PersonalData() {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Data Diri & NIK",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  "Pastikan data sesuai dengan kartu identitas Anda yang berlaku.",
                  style: TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w400,
                    height: 1.35,
                  ),
                ),
                const SizedBox(height: 24),

                // Form Field 1: Nama Lengkap
                const Text(
                  "Nama Lengkap Sesuai KTP",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF64748B),
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
                    controller: _nameController,
                    style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A), fontWeight: FontWeight.w600),
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Form Field 2: NIK
                const Text(
                  "Nomor Induk Kependudukan (NIK)",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF64748B),
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
                    controller: _nikController,
                    style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A), fontWeight: FontWeight.w600),
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Form Field 3: Upload Foto KTP
                const Text(
                  "Upload Foto KTP",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: 6),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 28),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFCBD5E1), width: 1.2),
                  ),
                  child: Column(
                    children: const [
                      Icon(
                        LucideIcons.camera,
                        size: 32,
                        color: Color(0xFF94A3B8),
                      ),
                      SizedBox(height: 8),
                      Text(
                        "Ambil Foto KTP",
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Bottom Button "Lanjutkan"
        Padding(
          padding: const EdgeInsets.all(20),
          child: SizedBox(
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
              child: const Text(
                "Lanjutkan",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // STEP 3: Detail Usaha & Legalitas
  Widget _buildStep3BusinessDetail() {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Detail Usaha & Legalitas",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  "Lengkapi informasi spesifik untuk verifikasi pendaftaran peran Anda.",
                  style: TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w400,
                    height: 1.35,
                  ),
                ),
                const SizedBox(height: 24),

                // Form Container Card (Light Grey Background)
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
                      // Header Section Title
                      Row(
                        children: const [
                          Icon(LucideIcons.building2, size: 18, color: Color(0xFF15803D)),
                          SizedBox(width: 8),
                          Text(
                            "Data Properti & Lokasi Usaha",
                            style: TextStyle(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF15803D),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Input 1: Nama Usaha
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                        ),
                        child: TextField(
                          controller: _businessNameController,
                          style: const TextStyle(fontSize: 13.5, color: Color(0xFF0F172A)),
                          decoration: const InputDecoration(
                            hintText: "Nama Usaha (Cth: Kos Putri Melati)",
                            hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Input 2: Alamat Lengkap Usaha
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                        ),
                        child: TextField(
                          controller: _businessAddressController,
                          maxLines: 3,
                          style: const TextStyle(fontSize: 13.5, color: Color(0xFF0F172A)),
                          decoration: const InputDecoration(
                            hintText: "Alamat Lengkap Usaha...",
                            hintStyle: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Bottom Button "Kirim Pendaftaran"
        Padding(
          padding: const EdgeInsets.all(20),
          child: SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                setState(() {
                  _step = 4;
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
              child: const Text(
                "Kirim Pendaftaran",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // STEP 4: Pendaftaran Disetujui!
  Widget _buildStep4SuccessApproved() {
    final roleCount = _selectedRoles.length;
    final provider = Provider.of<AppProvider>(context, listen: false);

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Spacer(),

          // Green Circle Checkmark
          Container(
            width: 80,
            height: 80,
            decoration: const BoxDecoration(
              color: Color(0xFFDCFCE7),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_rounded,
              size: 46,
              color: Color(0xFF10B981),
            ),
          ),
          const SizedBox(height: 24),

          // Title
          const Text(
            "Pendaftaran Disetujui!",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 8),

          // Subtitle with Dynamic Services Count
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: RichText(
              textAlign: TextAlign.center,
              text: TextSpan(
                style: const TextStyle(
                  fontSize: 13.5,
                  color: Color(0xFF64748B),
                  fontWeight: FontWeight.w400,
                  height: 1.4,
                ),
                children: [
                  const TextSpan(text: "Selamat! Akun Mitra Anda sudah aktif. Anda sekarang memiliki akses ke "),
                  TextSpan(
                    text: "$roleCount jenis layanan",
                    style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const TextSpan(text: " di Rangers App."),
                ],
              ),
            ),
          ),
          const Spacer(),

          // Bottom Button "Masuk Dashboard"
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: () {
                provider.setRole(UserRole.driver);
                Navigator.popUntil(context, (route) => route.isFirst);
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
                "Masuk Dashboard",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
