import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/constants/mock_data.dart';
import '../../../models/models.dart';
import 'kos_detail_view.dart';

class KosView extends StatefulWidget {
  const KosView({super.key});

  @override
  State<KosView> createState() => _KosViewState();
}

class _KosViewState extends State<KosView> {
  String _selectedCategory = 'Semua';
  String _searchQuery = '';
  bool _showPromoBanner = true;
  final List<int> _favoriteIds = [];

  List<KosItem> get _filteredKosList {
    return MockData.kosList.where((kos) {
      final matchesCategory = _selectedCategory == 'Semua' || kos.type == _selectedCategory;
      final matchesSearch = kos.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          kos.address.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          kos.facilities.any((f) => f.toLowerCase().contains(_searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFAFA),
      body: SafeArea(
        child: Column(
          children: [
            // Custom Header Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  // Back Button
                  InkWell(
                    onTap: () => Navigator.maybePop(context),
                    borderRadius: BorderRadius.circular(24),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white,
                        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                      ),
                      child: const Icon(
                        LucideIcons.arrowLeft,
                        size: 20,
                        color: Color(0xFF1E293B),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Title & Subtitle
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          "Kos-kosan",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                            height: 1.1,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          "Temukan kos terbaik sesuai kebutuhanmu",
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Map & Filter Buttons
                  _buildHeaderIconButton(
                    icon: LucideIcons.map,
                    onTap: () {},
                  ),
                  const SizedBox(width: 8),
                  Stack(
                    children: [
                      _buildHeaderIconButton(
                        icon: LucideIcons.slidersHorizontal,
                        onTap: () {},
                      ),
                      Positioned(
                        top: 4,
                        right: 4,
                        child: Container(
                          width: 9,
                          height: 9,
                          decoration: const BoxDecoration(
                            color: Color(0xFF16A34A),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),

                      // Search Bar with "Dekat saya" Location Button
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                        ),
                        child: Row(
                          children: [
                            const SizedBox(width: 14),
                            const Icon(
                              LucideIcons.search,
                              color: Color(0xFF94A3B8),
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: TextField(
                                onChanged: (val) {
                                  setState(() {
                                    _searchQuery = val;
                                  });
                                },
                                decoration: const InputDecoration(
                                  hintText: "Cari lokasi, nama kos, atau fa...",
                                  hintStyle: TextStyle(
                                    color: Color(0xFF94A3B8),
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w400,
                                  ),
                                  border: InputBorder.none,
                                  contentPadding: EdgeInsets.symmetric(vertical: 14),
                                ),
                              ),
                            ),
                            // "Dekat saya" Pill Button
                            GestureDetector(
                              onTap: () {},
                              child: Container(
                                margin: const EdgeInsets.only(right: 6),
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFEDFBF4),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Row(
                                  children: const [
                                    Icon(
                                      LucideIcons.mapPin,
                                      size: 14,
                                      color: Color(0xFF16A34A),
                                    ),
                                    SizedBox(width: 4),
                                    Text(
                                      "Dekat saya",
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFF16A34A),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Category Filter Chips (Horizontal Scroll)
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        child: Row(
                          children: [
                            _buildCategoryChip(
                              label: "Semua",
                              icon: LucideIcons.layoutGrid,
                              isSelected: _selectedCategory == "Semua",
                              onTap: () => setState(() => _selectedCategory = "Semua"),
                            ),
                            const SizedBox(width: 10),
                            _buildCategoryChip(
                              label: "Putra",
                              icon: LucideIcons.user,
                              isSelected: _selectedCategory == "Putra",
                              onTap: () => setState(() => _selectedCategory = "Putra"),
                            ),
                            const SizedBox(width: 10),
                            _buildCategoryChip(
                              label: "Putri",
                              icon: LucideIcons.user,
                              isSelected: _selectedCategory == "Putri",
                              onTap: () => setState(() => _selectedCategory = "Putri"),
                            ),
                            const SizedBox(width: 10),
                            _buildCategoryChip(
                              label: "Campur",
                              icon: LucideIcons.users,
                              isSelected: _selectedCategory == "Campur",
                              onTap: () => setState(() => _selectedCategory = "Campur"),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Discount Promo Banner (Dismissible)
                      if (_showPromoBanner) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEDFBF4),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFFD1FAE5), width: 1.2),
                          ),
                          child: Stack(
                            children: [
                              Row(
                                children: [
                                  // White Percentage Card Icon
                                  Container(
                                    width: 60,
                                    height: 60,
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(16),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withValues(alpha: 0.03),
                                          blurRadius: 8,
                                          offset: const Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    child: const Center(
                                      child: Text(
                                        "%",
                                        style: TextStyle(
                                          fontSize: 30,
                                          fontWeight: FontWeight.w900,
                                          color: Color(0xFF16A34A),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 14),

                                  // Banner Title & Subtitle Column
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          "Diskon Spesial!",
                                          style: TextStyle(
                                            fontSize: 15,
                                            fontWeight: FontWeight.w800,
                                            color: Color(0xFF0F172A),
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        const Text(
                                          "Dapatkan potongan harga hingga 15% untuk pemesanan bulan ini",
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w400,
                                            color: Color(0xFF475569),
                                            height: 1.25,
                                          ),
                                        ),
                                        const SizedBox(height: 10),

                                        // "Lihat Promo >" Button
                                        InkWell(
                                          onTap: () {},
                                          borderRadius: BorderRadius.circular(14),
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFF16A34A),
                                              borderRadius: BorderRadius.circular(14),
                                            ),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: const [
                                                Text(
                                                  "Lihat Promo",
                                                  style: TextStyle(
                                                    fontSize: 12,
                                                    fontWeight: FontWeight.w800,
                                                    color: Colors.white,
                                                  ),
                                                ),
                                                SizedBox(width: 4),
                                                Icon(
                                                  LucideIcons.chevronRight,
                                                  size: 13,
                                                  color: Colors.white,
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),

                              // Close Button Top Right
                              Positioned(
                                top: -4,
                                right: -4,
                                child: GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _showPromoBanner = false;
                                    });
                                  },
                                  child: const Icon(
                                    LucideIcons.x,
                                    size: 18,
                                    color: Color(0xFF9CA3AF),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Kos Item Cards List
                      if (_filteredKosList.isEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 40),
                          width: double.infinity,
                          child: Column(
                            children: const [
                              Icon(LucideIcons.searchX, size: 48, color: Color(0xFF94A3B8)),
                              SizedBox(height: 12),
                              Text(
                                "Tidak ada kosan ditemukan",
                                style: TextStyle(
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        )
                      else
                        ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _filteredKosList.length,
                          separatorBuilder: (context, index) => const SizedBox(height: 16),
                          itemBuilder: (context, index) {
                            final kos = _filteredKosList[index];
                            final isFav = _favoriteIds.contains(kos.id) || (kos.isFavorite == true);

                            return _buildKosCard(kos, isFav);
                          },
                        ),
                      const SizedBox(height: 24),

                      // Bottom Trust Highlights Row
                      const Divider(height: 1, color: Color(0xFFE2E8F0)),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: _buildTrustBadge(
                              icon: LucideIcons.shieldCheck,
                              title: "Aman & Terverifikasi",
                              subtitle: "Kos diverifikasi",
                            ),
                          ),
                          Container(width: 1, height: 24, color: const Color(0xFFE2E8F0)),
                          Expanded(
                            child: _buildTrustBadge(
                              icon: LucideIcons.users,
                              title: "+2.000 Kos",
                              subtitle: "Pilihan terbaikmu",
                            ),
                          ),
                          Container(width: 1, height: 24, color: const Color(0xFFE2E8F0)),
                          Expanded(
                            child: _buildTrustBadge(
                              icon: LucideIcons.headphoneOff,
                              title: "Layanan 24/7",
                              subtitle: "Siap membantu",
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeaderIconButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Colors.white,
          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
        ),
        child: Icon(
          icon,
          size: 20,
          color: const Color(0xFF1E293B),
        ),
      ),
    );
  }

  Widget _buildCategoryChip({
    required String label,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    const activeBg = Color(0xFF16A34A);
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? activeBg : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? activeBg : const Color(0xFFE2E8F0),
            width: 1.2,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: activeBg.withValues(alpha: 0.25),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 18,
              color: isSelected ? Colors.white : const Color(0xFF475569),
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: isSelected ? Colors.white : const Color(0xFF334155),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildKosCard(KosItem kos, bool isFav) {
    // Gender Tag Styling
    Color genderBg;
    Color genderTextColor;
    IconData genderIcon;

    if (kos.type == "Putri") {
      genderBg = const Color(0xFFFCE7F3);
      genderTextColor = const Color(0xFFDB2777);
      genderIcon = LucideIcons.user;
    } else if (kos.type == "Putra") {
      genderBg = const Color(0xFFEFF6FF);
      genderTextColor = const Color(0xFF2563EB);
      genderIcon = LucideIcons.user;
    } else {
      genderBg = const Color(0xFFFEF3C7);
      genderTextColor = const Color(0xFFD97706);
      genderIcon = LucideIcons.users;
    }

    // Availability Tag Styling
    final isAvailable = kos.available == true;
    final availBg = isAvailable ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E8);
    final availTextColor = isAvailable ? const Color(0xFF15803D) : const Color(0xFFDC2626);
    final availText = isAvailable ? "Tersedia" : "Penuh";

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => KosDetailView(kos: kos),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left Image Stack (Photo with overlays)
          SizedBox(
            width: 135,
            height: 155,
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    kos.img,
                    width: 135,
                    height: 155,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        width: 135,
                        height: 155,
                        color: Colors.grey.shade200,
                        child: const Icon(LucideIcons.home, color: Colors.grey, size: 40),
                      );
                    },
                  ),
                ),

                // Top Right Heart Button
                Positioned(
                  top: 8,
                  right: 8,
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        if (_favoriteIds.contains(kos.id)) {
                          _favoriteIds.remove(kos.id);
                        } else {
                          _favoriteIds.add(kos.id);
                        }
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.85),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isFav ? Icons.favorite : LucideIcons.heart,
                        size: 15,
                        color: isFav ? const Color(0xFFEF4444) : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                ),

                // Bottom Left Overlay: Photo Count
                Positioned(
                  left: 8,
                  bottom: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.75),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(LucideIcons.camera, size: 10, color: Colors.white),
                        const SizedBox(width: 4),
                        Text(
                          "${kos.photoCount} Foto",
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Bottom Right Overlay: Dots Carousel
                Positioned(
                  right: 8,
                  bottom: 11,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(width: 4, height: 4, decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle)),
                      const SizedBox(width: 3),
                      Container(width: 4, height: 4, decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.5), shape: BoxShape.circle)),
                      const SizedBox(width: 3),
                      Container(width: 4, height: 4, decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.5), shape: BoxShape.circle)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),

          // Right Details Section
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Row: Gender Tag & Availability Status Tag
                Row(
                  children: [
                    // Gender Tag
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: genderBg,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(genderIcon, size: 10, color: genderTextColor),
                          const SizedBox(width: 3),
                          Text(
                            kos.type,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: genderTextColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Spacer(),

                    // Availability Tag
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: availBg,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        availText,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: availTextColor,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),

                // Kos Title
                Text(
                  kos.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 15.5,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 3),

                // Location Address
                Row(
                  children: [
                    const Icon(LucideIcons.mapPin, size: 12, color: Color(0xFF94A3B8)),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        kos.address,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 11.5,
                          color: Color(0xFF64748B),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),

                // Rating Row
                Row(
                  children: [
                    const Icon(Icons.star_rounded, size: 15, color: Color(0xFFFFB800)),
                    const SizedBox(width: 3),
                    Text(
                      "${kos.rating}",
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    Text(
                      " (${kos.reviews})",
                      style: const TextStyle(
                        fontSize: 11.5,
                        color: Color(0xFF94A3B8),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Facilities Wrap
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  children: kos.facilities.map((f) => _buildFacilityTag(f)).toList(),
                ),
                const SizedBox(height: 10),

                // Price Footer & Action Circle Button
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Mulai dari",
                          style: TextStyle(
                            fontSize: 10,
                            color: Color(0xFF94A3B8),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        RichText(
                          text: TextSpan(
                            children: [
                              TextSpan(
                                text: kos.formattedPrice,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF16A34A),
                                ),
                              ),
                              const TextSpan(
                                text: " /bulan",
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                  color: Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    // Circular Green Arrow Button
                    Container(
                      width: 32,
                      height: 32,
                      decoration: const BoxDecoration(
                        color: Color(0xFFEDFBF4),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        LucideIcons.chevronRight,
                        size: 16,
                        color: Color(0xFF16A34A),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ),
    );
  }

  Widget _buildFacilityTag(String facility) {
    IconData icon;
    if (facility.toLowerCase().contains("wifi")) {
      icon = LucideIcons.wifi;
    } else if (facility.toLowerCase().contains("ac")) {
      icon = LucideIcons.snowflake;
    } else if (facility.toLowerCase().contains("km")) {
      icon = LucideIcons.bath;
    } else if (facility.toLowerCase().contains("dapur")) {
      icon = LucideIcons.utensils;
    } else if (facility.toLowerCase().contains("laundry")) {
      icon = LucideIcons.shirt;
    } else {
      icon = LucideIcons.bike;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 10, color: const Color(0xFF475569)),
          const SizedBox(width: 3),
          Text(
            facility,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: Color(0xFF334155),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrustBadge({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, size: 14, color: const Color(0xFF64748B)),
        const SizedBox(width: 4),
        Flexible(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 9.5,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF334155),
                ),
              ),
              Text(
                subtitle,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 8.5,
                  color: Color(0xFF94A3B8),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
