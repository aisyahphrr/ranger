import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_provider.dart';

class CustomerReviewView extends StatefulWidget {
  final OrderModel order;

  const CustomerReviewView({super.key, required this.order});

  @override
  State<CustomerReviewView> createState() => _CustomerReviewViewState();
}

class _CustomerReviewViewState extends State<CustomerReviewView> {
  int _rating = 0;
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Beri Ulasan')),
        backgroundColor: AppColors.background,
        body: ListView(padding: const EdgeInsets.all(16), children: [
          Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.border)),
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.order.detail,
                        style: const TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w900)),
                    const SizedBox(height: 6),
                    Text(widget.order.item,
                        style: const TextStyle(
                            color: AppColors.textSecondary, fontSize: 13)),
                    const SizedBox(height: 20),
                    const Text('Bagaimana pengalaman Anda?',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 10),
                    Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(
                            5,
                            (index) => IconButton(
                                onPressed: () =>
                                    setState(() => _rating = index + 1),
                                icon: Icon(LucideIcons.star,
                                    color: index < _rating
                                        ? AppColors.ratingAmber
                                        : AppColors.border,
                                    size: 32)))),
                    const SizedBox(height: 12),
                    TextField(
                        controller: _controller,
                        maxLines: 5,
                        decoration: const InputDecoration(
                            hintText: 'Tulis ulasan...',
                            filled: true,
                            fillColor: AppColors.background,
                            border: OutlineInputBorder())),
                    const SizedBox(height: 16),
                    SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                            onPressed: _rating == 0 ? null : _submit,
                            child: const Text('Kirim Ulasan')))
                  ])),
        ]),
      );

  Future<void> _submit() async {
    await context.read<AppProvider>().submitReview(
        orderId: widget.order.id, rating: _rating, text: _controller.text);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ulasan tersimpan di profil lokal.')));
    Navigator.pop(context);
  }
}
