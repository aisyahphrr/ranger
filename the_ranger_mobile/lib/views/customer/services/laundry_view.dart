import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/constants/mock_data.dart';
import '../../../models/models.dart';
import 'laundry_detail_view.dart';

class LaundryView extends StatefulWidget {
  const LaundryView({super.key});

  @override
  State<LaundryView> createState() => _LaundryViewState();
}

class _LaundryViewState extends State<LaundryView> {
  String _selectedCategory = 'Semua';
  String _searchQuery = '';
  bool _showPromoBanner = true;
  final List<int> _favoriteIds = [];

  List<Laundry> get _filteredLaundries {
    return MockData.laundries.where((laundry) {
      final matchesCategory = _selectedCategory == 'Semua' || laundry.type == _selectedCategory;
      final matchesSearch = laundry.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          laundry.address.toLowerCase().contains(_searchQuery.toLowerCase());
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
                          "Laundry",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                            height: 1.1,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          "Temukan laundry terbaik di sekitarmu",
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Action Search & Filter Buttons
                  _buildHeaderIconButton(
                    icon: LucideIcons.search,
                    onTap: () {},
                  ),
                  const SizedBox(width: 8),
                  _buildHeaderIconButton(
                    icon: LucideIcons.slidersHorizontal,
                    onTap: () {},
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
                      const SizedBox(height: 8),
                      // Search Input Box
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
                        ),
                        child: TextField(
                          onChanged: (val) {
                            setState(() {
                              _searchQuery = val;
                            });
                          },
                          decoration: const InputDecoration(
                            hintText: "Cari laundry terdekat...",
                            hintStyle: TextStyle(
                              color: Color(0xFF94A3B8),
                              fontSize: 14,
                              fontWeight: FontWeight.w400,
                            ),
                            prefixIcon: Icon(
                              LucideIcons.search,
                              color: Color(0xFF94A3B8),
                              size: 20,
                            ),
                            suffixIcon: Icon(
                              LucideIcons.mic,
                              color: Color(0xFF16A34A),
                              size: 20,
                            ),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Category Filter Chips
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
                              label: "Biasa",
                              icon: LucideIcons.shirt,
                              isSelected: _selectedCategory == "Biasa",
                              onTap: () => setState(() => _selectedCategory = "Biasa"),
                            ),
                            const SizedBox(width: 10),
                            _buildCategoryChip(
                              label: "Ekspres",
                              icon: LucideIcons.zap,
                              iconColor: _selectedCategory == "Ekspres"
                                  ? Colors.white
                                  : const Color(0xFFF97316),
                              isSelected: _selectedCategory == "Ekspres",
                              onTap: () => setState(() => _selectedCategory = "Ekspres"),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Promo Banner (Dismissible)
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
                              // Left Content
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Text(
                                    "Gratis Antar Jemput",
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w800,
                                      color: Color(0xFF046C4E),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text(
                                    "Untuk pesanan di atas Rp30.000",
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                      color: Color(0xFF374151),
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  InkWell(
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => const LaundryDetailView(),
                                        ),
                                      );
                                    },
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: const [
                                        Text(
                                          "Lihat detail",
                                          style: TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w700,
                                            color: Color(0xFF047857),
                                          ),
                                        ),
                                        SizedBox(width: 3),
                                        Icon(
                                          LucideIcons.chevronRight,
                                          size: 14,
                                          color: Color(0xFF047857),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),

                              // Close Button Top Right
                              Positioned(
                                top: 0,
                                right: 0,
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

                              // Scooter Graphic Bottom Right
                              Positioned(
                                bottom: -4,
                                right: 0,
                                child: const Icon(
                                  LucideIcons.bike,
                                  size: 42,
                                  color: Color(0xFFE11D48),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Laundry Cards List
                      if (_filteredLaundries.isEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(vertical: 40),
                          width: double.infinity,
                          child: Column(
                            children: const [
                              Icon(LucideIcons.searchX, size: 48, color: Color(0xFF94A3B8)),
                              SizedBox(height: 12),
                              Text(
                                "Tidak ada laundry ditemukan",
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
                          itemCount: _filteredLaundries.length,
                          separatorBuilder: (context, index) => const SizedBox(height: 16),
                          itemBuilder: (context, index) {
                            final laundry = _filteredLaundries[index];
                            final isFav = _favoriteIds.contains(laundry.id) || (laundry.isFavorite == true);

                            return _buildLaundryCard(laundry, isFav);
                          },
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
    Color? iconColor,
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
              color: isSelected ? Colors.white : (iconColor ?? const Color(0xFF475569)),
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

  Widget _buildLaundryCard(Laundry laundry, bool isFav) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => LaundryDetailView(laundry: laundry),
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
          // Image Section (Left)
          SizedBox(
            width: 125,
            height: 135,
            child: Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    laundry.img,
                    width: 125,
                    height: 135,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        width: 125,
                        height: 135,
                        color: Colors.grey.shade200,
                        child: const Icon(LucideIcons.washingMachine, color: Colors.grey, size: 40),
                      );
                    },
                  ),
                ),
                // Top-Left Badge: EKSPRES
                if (laundry.isExpress == true)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFF5722),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(LucideIcons.zap, size: 10, color: Colors.white),
                          SizedBox(width: 3),
                          Text(
                            "EKSPRES",
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                // Bottom Overlay Badge: Buka - Tutup 21.00
                Positioned(
                  bottom: 8,
                  left: 6,
                  right: 6,
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.75),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      laundry.openHours,
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 9.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),

          // Details Section (Right)
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title & Heart Favorite
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        laundry.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          if (_favoriteIds.contains(laundry.id)) {
                            _favoriteIds.remove(laundry.id);
                          } else {
                            _favoriteIds.add(laundry.id);
                          }
                        });
                      },
                      child: Icon(
                        isFav ? Icons.favorite : LucideIcons.heart,
                        size: 18,
                        color: isFav ? const Color(0xFFEF4444) : const Color(0xFFCBD5E1),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),

                // Rating & Distance Row
                Row(
                  children: [
                    const Icon(Icons.star_rounded, size: 16, color: Color(0xFFFFB800)),
                    const SizedBox(width: 3),
                    Text(
                      "${laundry.rating}",
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    Text(
                      " (${laundry.reviews})",
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF94A3B8),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 6),
                      child: Text(
                        "|",
                        style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 11),
                      ),
                    ),
                    const Icon(LucideIcons.mapPin, size: 13, color: Color(0xFF16A34A)),
                    const SizedBox(width: 3),
                    Text(
                      laundry.distance,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Feature Tag Pills
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  children: [
                    _buildFeatureTag(
                      label: "Antar Jemput",
                      icon: LucideIcons.truck,
                      bgColor: const Color(0xFFDCFCE7),
                      textColor: const Color(0xFF15803D),
                    ),
                    _buildFeatureTag(
                      label: "Ekspres 3 Jam",
                      icon: LucideIcons.zap,
                      bgColor: const Color(0xFFFFEDD5),
                      textColor: const Color(0xFFC2410C),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Price Footer & Action Button
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
                                text: laundry.formattedPrice,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF16A34A),
                                ),
                              ),
                              const TextSpan(
                                text: " /kg",
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

                    // Outline Button "Lihat Detail >"
                    InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => LaundryDetailView(laundry: laundry),
                          ),
                        );
                      },
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0FDF4),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF86EFAC), width: 1),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Text(
                              "Lihat Detail",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF15803D),
                              ),
                            ),
                            SizedBox(width: 2),
                            Icon(
                              LucideIcons.chevronRight,
                              size: 13,
                              color: Color(0xFF15803D),
                            ),
                          ],
                        ),
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

  Widget _buildFeatureTag({
    required String label,
    required IconData icon,
    required Color bgColor,
    required Color textColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 10, color: textColor),
          const SizedBox(width: 3),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}
