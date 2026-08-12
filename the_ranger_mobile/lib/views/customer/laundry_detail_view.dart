import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../models/models.dart';
import 'laundry_chat_view.dart';
import 'laundry_tracking_view.dart';

class LaundryDetailView extends StatefulWidget {
  final Laundry? laundry;

  const LaundryDetailView({super.key, this.laundry});

  @override
  State<LaundryDetailView> createState() => _LaundryDetailViewState();
}

class _LaundryDetailViewState extends State<LaundryDetailView> {
  bool _isFavorite = false;

  @override
  void initState() {
    super.initState();
    _isFavorite = widget.laundry?.isFavorite ?? false;
  }

  void _showOrderBottomSheet(BuildContext context, {String initialService = "Cuci Komplit"}) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return _OrderBottomSheetContent(
          initialService: initialService,
          laundryName: widget.laundry?.name ?? "Laundry Express Pak Dedi",
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final laundryName = widget.laundry?.name ?? "Laundry Express Pak Dedi";
    final laundryImg = widget.laundry?.img ??
        "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&h=400&fit=crop&auto=format&q=80";

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Scrollable Body Content
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Hero Image Section
                SizedBox(
                  height: 280,
                  width: double.infinity,
                  child: Stack(
                    children: [
                      // Background Image
                      Image.network(
                        laundryImg,
                        width: double.infinity,
                        height: 280,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: Colors.grey.shade300,
                            child: const Center(
                              child: Icon(LucideIcons.washingMachine, size: 60, color: Colors.grey),
                            ),
                          );
                        },
                      ),

                      // Gradient Bottom Vignette
                      Positioned.fill(
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.black.withValues(alpha: 0.3),
                                Colors.transparent,
                                Colors.black.withValues(alpha: 0.7),
                              ],
                              stops: const [0.0, 0.4, 1.0],
                            ),
                          ),
                        ),
                      ),

                      // Floating Header Actions (Back, Favorite, Share)
                      SafeArea(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: Row(
                            children: [
                              // Back Button
                              InkWell(
                                onTap: () => Navigator.maybePop(context),
                                borderRadius: BorderRadius.circular(24),
                                child: Container(
                                  width: 44,
                                  height: 44,
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    LucideIcons.arrowLeft,
                                    color: Color(0xFF1E293B),
                                    size: 20,
                                  ),
                                ),
                              ),
                              const Spacer(),
                              // Favorite Heart Button
                              InkWell(
                                onTap: () {
                                  setState(() {
                                    _isFavorite = !_isFavorite;
                                  });
                                },
                                borderRadius: BorderRadius.circular(24),
                                child: Container(
                                  width: 44,
                                  height: 44,
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    _isFavorite ? Icons.favorite : LucideIcons.heart,
                                    color: _isFavorite ? const Color(0xFFEF4444) : const Color(0xFF1E293B),
                                    size: 20,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              // Share Button
                              InkWell(
                                onTap: () {},
                                borderRadius: BorderRadius.circular(24),
                                child: Container(
                                  width: 44,
                                  height: 44,
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    LucideIcons.share2,
                                    color: Color(0xFF1E293B),
                                    size: 20,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Top-Left Badge: EKSPRES 3 JAM
                      Positioned(
                        left: 16,
                        bottom: 60,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFF5722),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              Icon(LucideIcons.zap, size: 12, color: Colors.white),
                              SizedBox(width: 4),
                              Text(
                                "EKSPRES 3 JAM",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 0.3,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Bottom Overlays (Antar Jemput & Rating)
                      Positioned(
                        left: 16,
                        right: 16,
                        bottom: 12,
                        child: Row(
                          children: [
                            // Left Badge: GRATIS ANTAR JEMPUT
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.75),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(LucideIcons.bike, size: 14, color: Colors.white),
                                  const SizedBox(width: 6),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: const [
                                      Text(
                                        "GRATIS ANTAR JEMPUT",
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 10,
                                          fontWeight: FontWeight.w900,
                                        ),
                                      ),
                                      Text(
                                        "Min. order Rp30.000",
                                        style: TextStyle(
                                          color: Color(0xFFCBD5E1),
                                          fontSize: 9,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            const Spacer(),
                            // Right Badge: RATING 4.8
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.75),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: const [
                                  Icon(Icons.star_rounded, size: 16, color: Color(0xFFFFB800)),
                                  SizedBox(width: 4),
                                  Text(
                                    "4.8",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 13,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                  SizedBox(width: 3),
                                  Text(
                                    "(256 ulasan)",
                                    style: TextStyle(
                                      color: Color(0xFF94A3B8),
                                      fontSize: 10,
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
                ),

                // 2. Dots Carousel Indicator
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 24,
                      height: 6,
                      decoration: BoxDecoration(
                        color: const Color(0xFF16A34A),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                    const SizedBox(width: 4),
                    _buildDotIndicator(),
                    const SizedBox(width: 4),
                    _buildDotIndicator(),
                    const SizedBox(width: 4),
                    _buildDotIndicator(),
                  ],
                ),

                // 3. Title & Address Header
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              laundryName,
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.all(3),
                            decoration: const BoxDecoration(
                              color: Color(0xFFECFDF5),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.verified,
                              color: Color(0xFF10B981),
                              size: 22,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: const [
                          Icon(LucideIcons.mapPin, size: 15, color: Color(0xFF16A34A)),
                          SizedBox(width: 4),
                          Text(
                            "Jl. Raya Kamojang No. 12  •  0.5 km",
                            style: TextStyle(
                              fontSize: 13,
                              color: Color(0xFF64748B),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const Divider(height: 1, color: Color(0xFFF1F5F9)),

                // 4. Key Highlights Row (4 Icon Circle Highlights)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildHighlightItem(
                        icon: LucideIcons.bike,
                        label: "Gratis Antar\nJemput",
                      ),
                      _buildHighlightItem(
                        icon: LucideIcons.clock,
                        label: "Express 3 Jam",
                      ),
                      _buildHighlightItem(
                        icon: LucideIcons.shieldCheck,
                        label: "Pakaian Aman\n& Wangi",
                      ),
                      _buildHighlightItem(
                        icon: LucideIcons.shirt,
                        label: "Bersih & Rapi",
                      ),
                    ],
                  ),
                ),

                const Divider(height: 1, color: Color(0xFFF1F5F9)),
                const SizedBox(height: 16),

                // 5. Service Grid Section ("Pilih Layanan")
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: const [
                          Text(
                            "Pilih Layanan",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          Row(
                            children: [
                              Text(
                                "Lihat semua",
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF16A34A),
                                ),
                              ),
                              SizedBox(width: 2),
                              Icon(
                                LucideIcons.chevronRight,
                                size: 14,
                                color: Color(0xFF16A34A),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // 2x2 Grid of Services
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: 14,
                        crossAxisSpacing: 14,
                        childAspectRatio: 0.95,
                        children: [
                          _buildServiceCard(
                            context: context,
                            icon: LucideIcons.shirt,
                            iconBgColor: const Color(0xFFDCFCE7),
                            iconColor: const Color(0xFF15803D),
                            title: "Cuci Komplit",
                            subtitle: "Cuci, kering, setrika, dan lipat",
                            price: "Rp 6.000",
                            unit: "/kg",
                          ),
                          _buildServiceCard(
                            context: context,
                            icon: LucideIcons.zap,
                            iconBgColor: const Color(0xFFFFEDD5),
                            iconColor: const Color(0xFFC2410C),
                            title: "Setrika Saja",
                            subtitle: "Setrika rapi siap pakai",
                            price: "Rp 4.000",
                            unit: "/kg",
                          ),
                          _buildServiceCard(
                            context: context,
                            icon: LucideIcons.wind,
                            iconBgColor: const Color(0xFFE0F2FE),
                            iconColor: const Color(0xFF0369A1),
                            title: "Cuci Kering",
                            subtitle: "Cuci kering tanpa disetrika",
                            price: "Rp 5.000",
                            unit: "/kg",
                          ),
                          _buildServiceCard(
                            context: context,
                            icon: LucideIcons.box,
                            iconBgColor: const Color(0xFFF3E8FF),
                            iconColor: const Color(0xFF7E22CE),
                            title: "Cuci Sepatu",
                            subtitle: "Bersih menyeluruh, cepat kering",
                            price: "Rp 25.000",
                            unit: "/pasang",
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // 6. Safe Guarantee Banner ("Garansi Pakaian Aman")
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEDFBF4),
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: const Color(0xFFD1FAE5), width: 1.2),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                LucideIcons.shieldCheck,
                                size: 22,
                                color: Color(0xFF16A34A),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: const [
                                  Text(
                                    "Garansi Pakaian Aman",
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w800,
                                      color: Color(0xFF0F172A),
                                    ),
                                  ),
                                  SizedBox(height: 2),
                                  Text(
                                    "Jika pakaian rusak atau hilang, kami ganti 100%",
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: Color(0xFF475569),
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(
                              LucideIcons.chevronRight,
                              size: 18,
                              color: Color(0xFF16A34A),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 140), // Spacing for Sticky Bottom Bar
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Sticky Bottom Pickup Order Bar
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.08),
                    blurRadius: 16,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Top Row: Chat + Pesan Pickup Button
                      Row(
                        children: [
                          // Chat Button
                          InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => LaundryChatView(
                                    laundryName: laundryName,
                                  ),
                                ),
                              );
                            },
                            borderRadius: BorderRadius.circular(16),
                            child: Container(
                              width: 68,
                              height: 64,
                              decoration: BoxDecoration(
                                color: const Color(0xFFEDFBF4),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: const Color(0xFFDCFCE7), width: 1.2),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: const [
                                  Icon(LucideIcons.messageCircle, size: 22, color: Color(0xFF16A34A)),
                                  SizedBox(height: 4),
                                  Text(
                                    "Chat",
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF16A34A),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),

                          // Pesan Pickup Sekarang Button
                          Expanded(
                            child: InkWell(
                              onTap: () => _showOrderBottomSheet(context),
                              borderRadius: BorderRadius.circular(16),
                              child: Container(
                                height: 64,
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF15803D),
                                  borderRadius: BorderRadius.circular(16),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF15803D).withValues(alpha: 0.3),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Row(
                                  children: [
                                    // Bike Circle Icon
                                    Container(
                                      width: 40,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: Colors.white.withValues(alpha: 0.2),
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Icon(
                                        LucideIcons.bike,
                                        color: Colors.white,
                                        size: 20,
                                      ),
                                    ),
                                    const SizedBox(width: 10),

                                    // Main Text Column
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: const [
                                          Text(
                                            "Pesan Pickup Sekarang",
                                            style: TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w800,
                                              color: Colors.white,
                                            ),
                                          ),
                                          SizedBox(height: 1),
                                          Text(
                                            "Gratis antar jemput ke lokasi Anda",
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: TextStyle(
                                              fontSize: 10.5,
                                              color: Color(0xFFDCFCE7),
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const Icon(
                                      LucideIcons.chevronRight,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),

                      // Bottom Trust Highlights Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildTrustBadge(
                            icon: LucideIcons.clock,
                            title: "Buka Setiap Hari",
                            subtitle: "07.00 - 21.00",
                          ),
                          Container(width: 1, height: 20, color: const Color(0xFFE2E8F0)),
                          _buildTrustBadge(
                            icon: Icons.check_circle_outline,
                            title: "+1000",
                            subtitle: "Pelanggan Puas",
                          ),
                          Container(width: 1, height: 20, color: const Color(0xFFE2E8F0)),
                          _buildTrustBadge(
                            icon: LucideIcons.shieldCheck,
                            title: "Aman & Terpercaya",
                            subtitle: "Berpengalaman",
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDotIndicator() {
    return Container(
      width: 6,
      height: 6,
      decoration: const BoxDecoration(
        color: Color(0xFFE2E8F0),
        shape: BoxShape.circle,
      ),
    );
  }

  Widget _buildHighlightItem({
    required IconData icon,
    required String label,
  }) {
    return Column(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: const Color(0xFFF0FDF4),
            shape: BoxShape.circle,
            border: Border.all(color: const Color(0xFFDCFCE7), width: 1.2),
          ),
          child: Icon(
            icon,
            color: const Color(0xFF16A34A),
            size: 22,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 10.5,
            fontWeight: FontWeight.w600,
            color: Color(0xFF334155),
            height: 1.2,
          ),
        ),
      ],
    );
  }

  Widget _buildServiceCard({
    required BuildContext context,
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required String title,
    required String subtitle,
    required String price,
    required String unit,
  }) {
    return GestureDetector(
      onTap: () => _showOrderBottomSheet(context, initialService: title),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconBgColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 18, color: iconColor),
            ),
            const SizedBox(height: 8),
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
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 10.5,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w400,
                height: 1.2,
              ),
            ),
            const Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: price,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF16A34A),
                        ),
                      ),
                      TextSpan(
                        text: unit,
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 26,
                  height: 26,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF8FAFC),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    LucideIcons.chevronRight,
                    size: 14,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrustBadge({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Row(
      children: [
        Icon(icon, size: 14, color: const Color(0xFF64748B)),
        const SizedBox(width: 4),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 9.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF334155),
              ),
            ),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 8.5,
                color: Color(0xFF94A3B8),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

// Interactive Order Modal Bottom Sheet
class _OrderBottomSheetContent extends StatefulWidget {
  final String initialService;
  final String laundryName;

  const _OrderBottomSheetContent({
    required this.initialService,
    required this.laundryName,
  });

  @override
  State<_OrderBottomSheetContent> createState() => _OrderBottomSheetContentState();
}

class _OrderBottomSheetContentState extends State<_OrderBottomSheetContent> {
  late String _selectedService;
  final TextEditingController _addressController = TextEditingController();
  bool _addressError = false;

  final List<Map<String, dynamic>> _services = [
    {
      "title": "Cuci Komplit",
      "subtitle": "Cuci, kering, setrika, dan lipat",
      "price": "Rp 6.000",
      "priceValue": 12000,
      "icon": LucideIcons.shirt,
    },
    {
      "title": "Setrika Saja",
      "subtitle": "Setrika rapi siap pakai",
      "price": "Rp 4.000",
      "priceValue": 8000,
      "icon": LucideIcons.zap,
    },
    {
      "title": "Cuci Kering",
      "subtitle": "Cuci kering tanpa disetrika",
      "price": "Rp 5.000",
      "priceValue": 10000,
      "icon": LucideIcons.wind,
    },
    {
      "title": "Cuci Sepatu",
      "subtitle": "Bersih menyeluruh, cepat kering",
      "price": "Rp 25.000",
      "priceValue": 25000,
      "icon": LucideIcons.box,
    },
  ];

  @override
  void initState() {
    super.initState();
    _selectedService = widget.initialService;
  }

  @override
  void dispose() {
    _addressController.dispose();
    super.dispose();
  }

  int get _calculatedPrice {
    final service = _services.firstWhere(
      (element) => element["title"] == _selectedService,
      orElse: () => _services.first,
    );
    return service["priceValue"] as int;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      padding: EdgeInsets.only(
        left: 16,
        right: 16,
        top: 12,
        bottom: MediaQuery.of(context).viewInsets.bottom + 16,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag Handle Bar
            Center(
              child: Container(
                width: 42,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFCBD5E1),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Modal Header (Title & Close Button)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Detail Pesanan",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(6),
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

            // Section 1: Pilih Layanan
            const Text(
              "Pilih Layanan",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 10),

            // List of 4 Services Cards
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _services.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final item = _services[index];
                final isSelected = item["title"] == _selectedService;

                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedService = item["title"] as String;
                    });
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFF0FDF4) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? const Color(0xFF10B981) : const Color(0xFFE2E8F0),
                        width: isSelected ? 1.5 : 1.2,
                      ),
                    ),
                    child: Row(
                      children: [
                        // Left Check Icon / Service Icon
                        Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0xFF16A34A) : const Color(0xFFF8FAFC),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            isSelected ? Icons.check_rounded : (item["icon"] as IconData),
                            size: 18,
                            color: isSelected ? Colors.white : const Color(0xFF94A3B8),
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Title & Subtitle Column
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item["title"] as String,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                  color: isSelected ? const Color(0xFF15803D) : const Color(0xFF0F172A),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                item["subtitle"] as String,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Price Right
                        Text(
                          item["price"] as String,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 18),

            // Section 2: Alamat Penjemputan
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Alamat Penjemputan",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                  ),
                ),
                InkWell(
                  onTap: () => _showGoogleMapsLocationPicker(context),
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDCFCE7),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF86EFAC), width: 1),
                    ),
                    child: Row(
                      children: const [
                        Icon(LucideIcons.mapPin, size: 13, color: Color(0xFF15803D)),
                        SizedBox(width: 4),
                        Text(
                          "Pilih via Maps",
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF15803D),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),

            Container(
              decoration: BoxDecoration(
                color: _addressError ? const Color(0xFFFEF2F2) : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: _addressError ? const Color(0xFFEF4444) : const Color(0xFFE2E8F0),
                  width: _addressError ? 1.5 : 1.2,
                ),
              ),
              child: TextField(
                controller: _addressController,
                maxLines: 3,
                onChanged: (val) {
                  if (_addressError && val.trim().isNotEmpty) {
                    setState(() {
                      _addressError = false;
                    });
                  }
                },
                style: const TextStyle(fontSize: 13, color: Color(0xFF0F172A)),
                decoration: const InputDecoration(
                  hintText: "Contoh: Jl. Mawar No. 12, RT 01/02 (Rumah cat hijau)",
                  hintStyle: TextStyle(
                    color: Color(0xFF94A3B8),
                    fontSize: 12.5,
                    fontWeight: FontWeight.w400,
                  ),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.all(14),
                ),
              ),
            ),
            if (_addressError) ...[
              const SizedBox(height: 6),
              Row(
                children: const [
                  Icon(Icons.error_outline_rounded, size: 14, color: Color(0xFFEF4444)),
                  SizedBox(width: 4),
                  Text(
                    "Wajib mengisi alamat penjemputan terlebih dahulu!",
                    style: TextStyle(
                      color: Color(0xFFEF4444),
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 20),

            const Divider(height: 1, color: Color(0xFFF1F5F9)),
            const SizedBox(height: 14),

            // Footer Price Estimation
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      "Estimasi Biaya",
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF64748B),
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      "*Berdasarkan asumsi berat 2kg per layanan",
                      style: TextStyle(
                        fontSize: 10,
                        color: Color(0xFF94A3B8),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),

                // Total Price Value
                Text(
                  "Rp ${_calculatedPrice.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}",
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Confirm Order Primary Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  final address = _addressController.text.trim();
                  if (address.isEmpty) {
                    setState(() {
                      _addressError = true;
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Wajib mengisi alamat penjemputan terlebih dahulu!"),
                        backgroundColor: Color(0xFFEF4444),
                        duration: Duration(seconds: 2),
                      ),
                    );
                    return;
                  }

                  Navigator.pop(context); // Close BottomSheet
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => LaundryTrackingView(
                        laundryName: "Pesanan ${widget.laundryName}",
                      ),
                    ),
                  );
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
                      "Konfirmasi & Pesan",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    SizedBox(width: 8),
                    Icon(
                      Icons.check_circle_outline_rounded,
                      size: 20,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  void _showGoogleMapsLocationPicker(BuildContext parentContext) {
    String selectedMapAddress = "Jl. Raya Kamojang No. 88, Samarang, Garut";
    final TextEditingController landmarkController = TextEditingController(text: "Rumah cat hijau depan warung");

    showModalBottomSheet(
      context: parentContext,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.85,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Column(
                children: [
                  const SizedBox(height: 8),
                  Center(
                    child: Container(
                      width: 42,
                      height: 4,
                      decoration: BoxDecoration(
                        color: const Color(0xFFCBD5E1),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Header
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: const [
                            Icon(LucideIcons.map, color: Color(0xFF15803D), size: 20),
                            SizedBox(width: 8),
                            Text(
                              "Pilih Titik Lokasi Maps",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(LucideIcons.x, color: Color(0xFF64748B)),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),

                  // Simulated Map Box View
                  Expanded(
                    child: Stack(
                      children: [
                        // Map Background Canvas Simulation
                        Container(
                          width: double.infinity,
                          color: const Color(0xFFE2E8F0),
                          child: CustomPaint(
                            size: Size.infinite,
                            painter: _MapPainter(),
                          ),
                        ),

                        // Center Map Pin Pointer
                        Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF0F172A),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Text(
                                  "Geser peta untuk menentukan titik",
                                  style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Icon(
                                LucideIcons.mapPin,
                                size: 40,
                                color: Color(0xFFEF4444),
                              ),
                              Container(
                                width: 12,
                                height: 4,
                                decoration: BoxDecoration(
                                  color: Colors.black26,
                                  borderRadius: BorderRadius.circular(2),
                                ),
                              ),
                            ],
                          ),
                        ),

                        // GPS Current Location Floating Button
                        Positioned(
                          right: 16,
                          bottom: 16,
                          child: FloatingActionButton.small(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF15803D),
                            onPressed: () {
                              setModalState(() {
                                selectedMapAddress = "Jl. Raya Kamojang No. 88, Samarang, Garut (Lokasi GPS)";
                              });
                            },
                            child: const Icon(LucideIcons.crosshair, size: 20),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Address Details Panel Bottom
                  Container(
                    padding: const EdgeInsets.all(16),
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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Alamat Terpilih dari Titik Peta:",
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(LucideIcons.mapPin, size: 18, color: Color(0xFFEF4444)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                selectedMapAddress,
                                style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        // Landmark / Detail Catatan Input
                        TextField(
                          controller: landmarkController,
                          style: const TextStyle(fontSize: 13),
                          decoration: InputDecoration(
                            hintText: "Patokan (Cth: Rumah cat hijau depan warung)",
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),

                        // Confirm Map Location Button
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton(
                            onPressed: () {
                              final fullAddress = "$selectedMapAddress (${landmarkController.text.trim()})";
                              setState(() {
                                _addressController.text = fullAddress;
                                _addressError = false;
                              });
                              Navigator.pop(context);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF15803D),
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            child: const Text(
                              "Gunakan Lokasi Ini",
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}

class _MapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paintRoad = Paint()
      ..color = Colors.white
      ..strokeWidth = 14
      ..style = PaintingStyle.stroke;

    final paintSecondaryRoad = Paint()
      ..color = const Color(0xFFFEF08A)
      ..strokeWidth = 8
      ..style = PaintingStyle.stroke;

    final path1 = Path()
      ..moveTo(0, size.height * 0.4)
      ..cubicTo(size.width * 0.3, size.height * 0.3, size.width * 0.7, size.height * 0.6, size.width, size.height * 0.5);
    canvas.drawPath(path1, paintRoad);

    final path2 = Path()
      ..moveTo(size.width * 0.5, 0)
      ..cubicTo(size.width * 0.4, size.height * 0.4, size.width * 0.6, size.height * 0.7, size.width * 0.5, size.height);
    canvas.drawPath(path2, paintRoad);

    final path3 = Path()
      ..moveTo(0, size.height * 0.7)
      ..lineTo(size.width, size.height * 0.2);
    canvas.drawPath(path3, paintSecondaryRoad);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
