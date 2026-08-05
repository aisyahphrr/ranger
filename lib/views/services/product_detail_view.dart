import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_provider.dart';
import 'cart_view.dart';

class ProductDetailView extends StatefulWidget {
  final Product product;

  const ProductDetailView({super.key, required this.product});

  @override
  State<ProductDetailView> createState() => _ProductDetailViewState();
}

class _ProductDetailViewState extends State<ProductDetailView> {
  int _quantity = 1;
  int _currentImageIndex = 0;
  late final List<String> _images;

  @override
  void initState() {
    super.initState();
    // Create a mock image gallery using Unsplash tags corresponding to categories
    String fallBack1 = "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=400&fit=crop&q=80";
    String fallBack2 = "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&h=400&fit=crop&q=80";

    if (widget.product.cat == "Makanan" || widget.product.cat == "Minuman") {
      fallBack1 = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop&q=80";
      fallBack2 = "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&h=400&fit=crop&q=80";
    } else if (widget.product.cat == "Fashion") {
      fallBack1 = "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=400&fit=crop&q=80";
      fallBack2 = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=400&fit=crop&q=80";
    }

    _images = [
      widget.product.img,
      fallBack1,
      fallBack2,
    ];
  }

  void _increment() {
    setState(() => _quantity++);
  }

  void _decrement() {
    if (_quantity > 1) {
      setState(() => _quantity--);
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);
    final totalPrice = widget.product.price * _quantity;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // ── SCROLLABLE CONTENTS ──
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Swipable Image Gallery
                Stack(
                  children: [
                    SizedBox(
                      height: 320,
                      child: PageView.builder(
                        itemCount: _images.length,
                        onPageChanged: (index) {
                          setState(() => _currentImageIndex = index);
                        },
                        itemBuilder: (context, index) {
                          return Image.network(
                            _images[index],
                            fit: BoxFit.cover,
                            width: double.infinity,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                color: Colors.grey.shade200,
                                child: const Icon(LucideIcons.image, size: 48, color: Colors.grey),
                              );
                            },
                          );
                        },
                      ),
                    ),
                    // Indicator Dots Overlay
                    Positioned(
                      bottom: 16,
                      left: 0,
                      right: 0,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                          _images.length,
                          (i) => AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            width: _currentImageIndex == i ? 18 : 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: _currentImageIndex == i ? Colors.white : Colors.white60,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                
                // 2. Info Details Card
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Price & Like
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            widget.product.formattedPrice,
                            style: const TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w900,
                              color: AppColors.primary,
                            ),
                          ),
                          IconButton(
                            icon: Icon(
                              widget.product.liked ? LucideIcons.heart : LucideIcons.heart,
                              color: widget.product.liked ? Colors.red : AppColors.textMuted,
                            ),
                            onPressed: () {
                              appState.toggleLike(widget.product.id);
                              setState(() {
                                widget.product.liked = !widget.product.liked;
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      
                      // Title
                      Text(
                        widget.product.name,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 12),
                      
                      // Rating & Sales Count Row
                      Row(
                        children: [
                          const Icon(LucideIcons.star, size: 16, color: AppColors.ratingAmber),
                          const SizedBox(width: 4),
                          Text(
                            widget.product.rating.toString(),
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          const SizedBox(width: 6),
                          const Text(
                            "(120+ ulasan)",
                            style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            "•",
                            style: TextStyle(color: AppColors.textMuted),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.background,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              "${widget.product.sold} Terjual",
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),

                // 3. Shop Profile Card
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      // Custom shop avatar
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: AppColors.primaryLight,
                        child: Text(
                          widget.product.store[0],
                          style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 18),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  widget.product.store,
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                ),
                                const SizedBox(width: 4),
                                const Icon(LucideIcons.checkCircle, size: 14, color: Colors.blue),
                              ],
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              "Toko Terverifikasi • Kamojang",
                              style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                      OutlinedButton(
                        onPressed: () {},
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.primary),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        ),
                        child: const Text("Kunjungi", style: TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),

                // 4. Product Description Card
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.all(20),
                  width: double.infinity,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Deskripsi Produk",
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "Dapatkan kelezatan dan kualitas terbaik dari ${widget.product.name} yang diproses langsung secara tradisional oleh ${widget.product.store} dengan standar kebersihan tinggi.\n\nCocok untuk dinikmati kapan saja bersama keluarga maupun teman. Produk ini diproduksi segar menggunakan bahan baku lokal terbaik di kawasan Kamojang guna membantu perekonomian komunitas lokal.",
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                          height: 1.6,
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 120), // Spacing for Sticky Bottom Bar
              ],
            ),
          ),
          
          // ── FLOATING TOP ACTION BAR ──
          Positioned(
            top: 40,
            left: 20,
            child: CircleAvatar(
              backgroundColor: Colors.white.withValues(alpha: 0.9),
              child: IconButton(
                icon: const Icon(LucideIcons.arrowLeft, color: AppColors.textPrimary),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ),
          Positioned(
            top: 40,
            right: 20,
            child: CircleAvatar(
              backgroundColor: Colors.white.withValues(alpha: 0.9),
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  IconButton(
                    icon: const Icon(LucideIcons.shoppingCart, color: AppColors.textPrimary),
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => const CartView()));
                    },
                  ),
                  if (appState.cartItems.isNotEmpty)
                    Positioned(
                      right: -2,
                      top: -2,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          appState.cartItems.length.toString(),
                          style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // ── STICKY BOTTOM ACTION BAR ──
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 15,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Quantity Selector
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.border),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(LucideIcons.minus, size: 14, color: AppColors.textPrimary),
                          onPressed: _decrement,
                        ),
                        Text(
                          _quantity.toString(),
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        IconButton(
                          icon: const Icon(LucideIcons.plus, size: 14, color: AppColors.textPrimary),
                          onPressed: _increment,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  
                  // Add to Cart / Buy Button
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 0,
                      ),
                      onPressed: () {
                        appState.addToCart(widget.product, quantity: _quantity);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text("${_quantity}x ${widget.product.name} dimasukkan ke keranjang!"),
                            action: SnackBarAction(
                              label: "Keranjang",
                              textColor: Colors.amberAccent,
                              onPressed: () {
                                Navigator.push(context, MaterialPageRoute(builder: (_) => const CartView()));
                              },
                            ),
                          ),
                        );
                      },
                      child: Text(
                        "Tambah • Rp ${totalPrice.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}",
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
