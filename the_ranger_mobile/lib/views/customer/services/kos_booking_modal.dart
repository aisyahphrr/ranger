import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../models/models.dart';
import 'kos_chat_modal.dart';

void showKosBookingBottomSheet(BuildContext context, {KosItem? kos}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) {
      return KosBookingModal(kos: kos);
    },
  );
}

class KosBookingModal extends StatefulWidget {
  final KosItem? kos;

  const KosBookingModal({super.key, this.kos});

  @override
  State<KosBookingModal> createState() => _KosBookingModalState();
}

class _KosBookingModalState extends State<KosBookingModal> {
  int _step = 1; // 1: Form, 2: Payment, 3: E-Receipt Success

  // Step 1 Form Controllers
  TextEditingController? _nameController;
  TextEditingController? _phoneController;
  TextEditingController? _dateController;
  TextEditingController? _durationController;
  bool _showFormError = false;

  TextEditingController get nameController => _nameController ??= TextEditingController();
  TextEditingController get phoneController => _phoneController ??= TextEditingController();
  TextEditingController get dateController => _dateController ??= TextEditingController();
  TextEditingController get durationController => _durationController ??= TextEditingController(text: "$_durationMonths");

  int _durationMonths = 1;

  // Step 2 Payment Selection
  String _selectedPayment = "GoPay";

  final List<Map<String, String>> _paymentMethods = [
    {
      "id": "GoPay",
      "title": "GoPay",
      "subtitle": "Bayar instan dengan GoPay",
      "color": "0xFF2563EB",
    },
    {
      "id": "BCA Virtual Account",
      "title": "BCA Virtual Account",
      "subtitle": "Transfer otomatis",
      "color": "0xFF2563EB",
    },
    {
      "id": "OVO",
      "title": "OVO",
      "subtitle": "Cashback hingga 10k",
      "color": "0xFF9333EA",
    },
    {
      "id": "ShopeePay",
      "title": "ShopeePay",
      "subtitle": "Gratis biaya admin",
      "color": "0xFFEA580C",
    },
  ];

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _phoneController = TextEditingController();
    _dateController = TextEditingController();
    _durationController = TextEditingController(text: "$_durationMonths");
  }

  @override
  void dispose() {
    _nameController?.dispose();
    _phoneController?.dispose();
    _dateController?.dispose();
    _durationController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 40,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: SingleChildScrollView(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom + 20,
        ),
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 250),
          child: _buildCurrentStepView(),
        ),
      ),
    );
  }

  Widget _buildCurrentStepView() {
    switch (_step) {
      case 1:
        return _buildStep1Form();
      case 2:
        return _buildStep2Payment();
      case 3:
        return _buildStep3Success();
      default:
        return _buildStep1Form();
    }
  }

  // STEP 1: Form Booking Kos
  Widget _buildStep1Form() {
    final kosName = widget.kos?.name ?? "Kos Putri Melati";
    final kosPrice = widget.kos?.formattedPrice ?? "Rp 750.000";
    final rawPrice = widget.kos?.price ?? 750000;
    final totalPrice = rawPrice * _durationMonths;
    final dpAmount = (totalPrice * 0.20).round();

    final formattedTotal = "Rp ${totalPrice.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}";
    final formattedDP = "Rp ${dpAmount.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}";

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
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
          const SizedBox(height: 12),

          // Modal Header
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      "Form Booking Kos",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      "Amankan kamar dengan DP 20%",
                      style: TextStyle(
                        fontSize: 12,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: Color(0xFFF1F5F9),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    LucideIcons.x,
                    size: 18,
                    color: Color(0xFF64748B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(height: 1, color: Color(0xFFF1F5F9)),
          const SizedBox(height: 16),

          // Selected Kos Card
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFEDFBF4),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(
                    widget.kos?.img ??
                        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=200&fit=crop",
                    width: 48,
                    height: 48,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      kosName,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "$kosPrice / bln",
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF16A34A),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Form Field: Nama Penyewa
          const Text(
            "Nama Penyewa",
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: Color(0xFF64748B),
            ),
          ),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: (_showFormError && nameController.text.trim().isEmpty) ? const Color(0xFFFEF2F2) : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: (_showFormError && nameController.text.trim().isEmpty) ? const Color(0xFFEF4444) : const Color(0xFFE2E8F0),
                width: (_showFormError && nameController.text.trim().isEmpty) ? 1.5 : 1.2,
              ),
            ),
            child: TextField(
              controller: nameController,
              onChanged: (_) => setState(() {}),
              style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A), fontWeight: FontWeight.w600),
              decoration: const InputDecoration(
                hintText: "Masukkan Nama Lengkap",
                hintStyle: TextStyle(fontSize: 13, color: Color(0xFF94A3B8), fontWeight: FontWeight.w400),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),
          if (_showFormError && nameController.text.trim().isEmpty) ...[
            const SizedBox(height: 4),
            const Text(
              "Wajib mengisi nama penyewa!",
              style: TextStyle(color: Color(0xFFEF4444), fontSize: 11, fontWeight: FontWeight.w600),
            ),
          ],
          const SizedBox(height: 14),

          // Form Field: No WhatsApp Aktif
          const Text(
            "No WhatsApp Aktif",
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: Color(0xFF64748B),
            ),
          ),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: (_showFormError && phoneController.text.trim().isEmpty) ? const Color(0xFFFEF2F2) : const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: (_showFormError && phoneController.text.trim().isEmpty) ? const Color(0xFFEF4444) : const Color(0xFFE2E8F0),
                width: (_showFormError && phoneController.text.trim().isEmpty) ? 1.5 : 1.2,
              ),
            ),
            child: TextField(
              controller: phoneController,
              onChanged: (_) => setState(() {}),
              keyboardType: TextInputType.phone,
              style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A), fontWeight: FontWeight.w600),
              decoration: const InputDecoration(
                hintText: "Contoh: 081234567890",
                hintStyle: TextStyle(fontSize: 13, color: Color(0xFF94A3B8), fontWeight: FontWeight.w400),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),
          if (_showFormError && phoneController.text.trim().isEmpty) ...[
            const SizedBox(height: 4),
            const Text(
              "Wajib mengisi nomor WhatsApp!",
              style: TextStyle(color: Color(0xFFEF4444), fontSize: 11, fontWeight: FontWeight.w600),
            ),
          ],
          const SizedBox(height: 14),

          // Row: Tgl Masuk Kos & Durasi
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Tgl Masuk
              Expanded(
                flex: 3,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Tgl. Masuk Kos",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF64748B),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: (_showFormError && dateController.text.trim().isEmpty) ? const Color(0xFFFEF2F2) : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: (_showFormError && dateController.text.trim().isEmpty) ? const Color(0xFFEF4444) : const Color(0xFFE2E8F0),
                          width: (_showFormError && dateController.text.trim().isEmpty) ? 1.5 : 1.2,
                        ),
                      ),
                      child: TextField(
                        controller: dateController,
                        readOnly: true,
                        onTap: () async {
                          final pickedDate = await showDatePicker(
                            context: context,
                            initialDate: DateTime.now(),
                            firstDate: DateTime.now(),
                            lastDate: DateTime.now().add(const Duration(days: 365)),
                          );
                          if (pickedDate != null) {
                            final formatted = "${pickedDate.day.toString().padLeft(2, '0')}/${pickedDate.month.toString().padLeft(2, '0')}/${pickedDate.year}";
                            setState(() {
                              dateController.text = formatted;
                            });
                          }
                        },
                        style: const TextStyle(fontSize: 13, color: Color(0xFF0F172A), fontWeight: FontWeight.w600),
                        decoration: const InputDecoration(
                          hintText: "DD/MM/YYYY",
                          hintStyle: TextStyle(fontSize: 13, color: Color(0xFF94A3B8), fontWeight: FontWeight.w400),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          suffixIcon: Icon(LucideIcons.calendar, size: 16, color: Color(0xFF64748B)),
                        ),
                      ),
                    ),
                    if (_showFormError && dateController.text.trim().isEmpty) ...[
                      const SizedBox(height: 4),
                      const Text(
                        "Wajib isi tanggal!",
                        style: TextStyle(color: Color(0xFFEF4444), fontSize: 11, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(width: 12),

              // Durasi (Bln)
              Expanded(
                flex: 2,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Durasi (Bln)",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF64748B),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                      ),
                      child: Row(
                        children: [
                          InkWell(
                            onTap: () {
                              if (_durationMonths > 1) {
                                setState(() {
                                  _durationMonths--;
                                  durationController.text = "$_durationMonths";
                                });
                              }
                            },
                            borderRadius: BorderRadius.circular(12),
                            child: const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 12),
                              child: Icon(LucideIcons.minus, size: 14, color: Color(0xFF64748B)),
                            ),
                          ),
                          Expanded(
                            child: TextField(
                              controller: durationController,
                              keyboardType: TextInputType.number,
                              textAlign: TextAlign.center,
                              onChanged: (val) {
                                final parsed = int.tryParse(val);
                                if (parsed != null && parsed > 0) {
                                  setState(() {
                                    _durationMonths = parsed;
                                  });
                                }
                              },
                              style: const TextStyle(
                                fontSize: 14,
                                color: Color(0xFF0F172A),
                                fontWeight: FontWeight.w800,
                              ),
                              decoration: const InputDecoration(
                                border: InputBorder.none,
                                isDense: true,
                                contentPadding: EdgeInsets.zero,
                                suffixText: "bln",
                                suffixStyle: TextStyle(
                                  fontSize: 11.5,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                          InkWell(
                            onTap: () {
                              setState(() {
                                _durationMonths++;
                                durationController.text = "$_durationMonths";
                              });
                            },
                            borderRadius: BorderRadius.circular(12),
                            child: const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 12),
                              child: Icon(LucideIcons.plus, size: 14, color: Color(0xFF15803D)),
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
          const SizedBox(height: 20),

          const Divider(height: 1, color: Color(0xFFF1F5F9)),
          const SizedBox(height: 16),

          // Total & DP Calculation Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Total Harga Sewa",
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF64748B),
                ),
              ),
              Text(
                formattedTotal,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // DP Box
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFFEDFBF4),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFDCFCE7), width: 1),
            ),
            child: Row(
              children: [
                const Icon(LucideIcons.wallet, size: 20, color: Color(0xFF15803D)),
                const SizedBox(width: 10),
                const Text(
                  "DP (20%)",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF15803D),
                  ),
                ),
                const Spacer(),
                Text(
                  formattedDP,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF15803D),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Primary Button "Bayar DP Rp 150.000 >"
          Builder(
            builder: (context) {
              final isFormFilled = nameController.text.trim().isNotEmpty &&
                  phoneController.text.trim().isNotEmpty &&
                  dateController.text.trim().isNotEmpty;

              return SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    if (!isFormFilled) {
                      setState(() {
                        _showFormError = true;
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text("Lengkapi Nama Penyewa, No. WhatsApp, dan Tgl. Masuk Kos terlebih dahulu!"),
                          backgroundColor: Color(0xFFEF4444),
                          duration: Duration(seconds: 2),
                        ),
                      );
                      return;
                    }

                    setState(() {
                      _step = 2;
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isFormFilled ? const Color(0xFF15803D) : const Color(0xFF94A3B8),
                    foregroundColor: Colors.white,
                    elevation: isFormFilled ? 2 : 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Bayar DP $formattedDP",
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(LucideIcons.chevronRight, size: 18),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // STEP 2: Pilih Pembayaran
  Widget _buildStep2Payment() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
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
          const SizedBox(height: 12),

          // Header with Back Button
          Row(
            children: [
              InkWell(
                onTap: () {
                  setState(() {
                    _step = 1;
                  });
                },
                borderRadius: BorderRadius.circular(24),
                child: Container(
                  width: 38,
                  height: 38,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF1F5F9),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    LucideIcons.arrowLeft,
                    size: 18,
                    color: Color(0xFF0F172A),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                "Pilih Pembayaran",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Payment Options List
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _paymentMethods.length,
            separatorBuilder: (context, index) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final method = _paymentMethods[index];
              final isSelected = _selectedPayment == method["id"];

              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedPayment = method["id"]!;
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFFEDFBF4) : Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: isSelected ? const Color(0xFF15803D) : const Color(0xFFF1F5F9),
                      width: isSelected ? 1.8 : 1.2,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          color: const Color(0xFFEFF6FF),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          LucideIcons.wallet,
                          size: 20,
                          color: Color(0xFF2563EB),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              method["title"]!,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              method["subtitle"]!,
                              style: const TextStyle(
                                fontSize: 11.5,
                                color: Color(0xFF64748B),
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Checkmark circle
                      Container(
                        width: 22,
                        height: 22,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isSelected ? const Color(0xFF15803D) : Colors.transparent,
                          border: Border.all(
                            color: isSelected ? const Color(0xFF15803D) : const Color(0xFFCBD5E1),
                            width: 1.5,
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
          const SizedBox(height: 24),

          // Button "Lanjutkan Pembayaran >"
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
                  Text(
                    "Lanjutkan Pembayaran",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  SizedBox(width: 8),
                  Icon(LucideIcons.chevronRight, size: 18),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // STEP 3: Booking Berhasil! E-Receipt
  Widget _buildStep3Success() {
    final kosName = widget.kos?.name ?? "Kos Putri Melati";
    final rawPrice = widget.kos?.price ?? 750000;
    final dpAmount = (rawPrice * 0.20).round();
    final formattedDP = "Rp ${dpAmount.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}";

    return Padding(
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
          const SizedBox(height: 16),

          // Success Header Card (Mint Green)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
            decoration: BoxDecoration(
              color: const Color(0xFFEDFBF4),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              children: [
                // White Check Circle
                Container(
                  width: 56,
                  height: 56,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    size: 32,
                    color: Color(0xFF10B981),
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  "Booking Berhasil!",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  "Kamar Anda telah diamankan.",
                  style: TextStyle(
                    fontSize: 13,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // E-Receipt Ticket Container Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                const Text(
                  "E-RECEIPT",
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF94A3B8),
                    letterSpacing: 1.2,
                  ),
                ),
                const SizedBox(height: 2),
                const Text(
                  "INV/KOS/1553",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 16),

                _buildReceiptRow("Kos", kosName),
                const SizedBox(height: 8),
                _buildReceiptRow("Tanggal Masuk", dateController.text),
                const SizedBox(height: 8),
                _buildReceiptRow("Metode", _selectedPayment),

                const SizedBox(height: 14),
                const Divider(height: 1, color: Color(0xFFF1F5F9)),
                const SizedBox(height: 14),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "Total DP (20%)",
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    Text(
                      formattedDP,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF16A34A),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Button: Unduh Invoice
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Invoice INV/KOS/1553 Berhasil Diunduh!"),
                    backgroundColor: Color(0xFF15803D),
                  ),
                );
              },
              icon: const Icon(LucideIcons.download, size: 18, color: Color(0xFF16A34A)),
              label: const Text(
                "Unduh Invoice",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF16A34A),
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFEDFBF4),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),

          // Row 2 Action Buttons (Chat Pemilik & Selesai Kembali)
          Row(
            children: [
              // Chat Pemilik Button
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(context); // Close booking modal
                      showKosChatBottomSheet(context, kosName: kosName);
                    },
                    icon: const Icon(LucideIcons.messageCircle, size: 18, color: Color(0xFF15803D)),
                    label: const Text(
                      "Chat Pemilik",
                      style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFE2E8F0), width: 1.2),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),

              // Selesai & Kembali Button
              Expanded(
                child: SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F172A),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text(
                      "Selesai & Kembali",
                      style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildReceiptRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 12.5,
            color: Color(0xFF64748B),
            fontWeight: FontWeight.w500,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
      ],
    );
  }
}
