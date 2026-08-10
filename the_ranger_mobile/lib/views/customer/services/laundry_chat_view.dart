import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

class LaundryChatView extends StatefulWidget {
  final String laundryName;

  const LaundryChatView({
    super.key,
    this.laundryName = "Laundry Express Pak Dedi",
  });

  @override
  State<LaundryChatView> createState() => _LaundryChatViewState();
}

class _LaundryChatViewState extends State<LaundryChatView> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<Map<String, dynamic>> _messages = [
    {
      "isUser": false,
      "text": "Halo! Ada yang bisa kami bantu seputar layanan Laundry Express Pak Dedi?",
      "time": "15.27",
    },
  ];

  void _sendMessage({String? customText, Map<String, dynamic>? attachment}) {
    final text = customText ?? _messageController.text.trim();
    if (text.isEmpty && attachment == null) return;

    final now = DateTime.now();
    final timeStr = "${now.hour.toString().padLeft(2, '0')}.${now.minute.toString().padLeft(2, '0')}";

    setState(() {
      _messages.add({
        "isUser": true,
        "text": text,
        "time": timeStr,
        "attachment": attachment,
      });
      if (customText == null) _messageController.clear();
    });

    _scrollToBottom();

    // Simulated Auto Reply from Laundry merchant
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (!mounted) return;
      final replyNow = DateTime.now();
      final replyTimeStr =
          "${replyNow.hour.toString().padLeft(2, '0')}.${replyNow.minute.toString().padLeft(2, '0')}";

      String replyText = "Terima kasih telah menghubungi kami! Tim ${widget.laundryName} siap melayani penjemputan pakaian Anda.";
      if (attachment != null) {
        if (attachment["type"] == "image") {
          replyText = "Foto pakaian telah kami terima! Penimbangan & pemeriksaan kondisi akan dilakukan saat penjemputan.";
        } else if (attachment["type"] == "document") {
          replyText = "File instruksi cuci telah diterima. Kami akan sesuaikan dengan instruksi khusus Anda.";
        } else if (attachment["type"] == "location") {
          replyText = "Lokasi penjemputan diterima! Kurir kami segera meluncur ke lokasi Anda.";
        }
      }

      setState(() {
        _messages.add({
          "isUser": false,
          "text": replyText,
          "time": replyTimeStr,
        });
      });
      _scrollToBottom();
    });
  }

  void _showAttachmentOptions() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Lampirkan Berkas / File",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(LucideIcons.x, size: 20, color: Color(0xFF64748B)),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildAttachmentTile(
                    icon: LucideIcons.camera,
                    color: const Color(0xFF2563EB),
                    bgColor: const Color(0xFFEFF6FF),
                    label: "Kamera / Foto",
                    onTap: () {
                      Navigator.pop(context);
                      _sendMessage(
                        customText: "Mengirim foto sampel pakaian",
                        attachment: {
                          "type": "image",
                          "name": "foto_pakaian_cucian.jpg",
                          "size": "1.8 MB",
                          "url": "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=500&fit=crop",
                        },
                      );
                    },
                  ),
                  _buildAttachmentTile(
                    icon: LucideIcons.fileText,
                    color: const Color(0xFFD97706),
                    bgColor: const Color(0xFFFEF3C7),
                    label: "Dokumen",
                    onTap: () {
                      Navigator.pop(context);
                      _sendMessage(
                        customText: "Instruksi Khusus Cuci (PDF)",
                        attachment: {
                          "type": "document",
                          "name": "catatan_instruksi_cuci.pdf",
                          "size": "320 KB",
                        },
                      );
                    },
                  ),
                  _buildAttachmentTile(
                    icon: LucideIcons.mapPin,
                    color: const Color(0xFF16A34A),
                    bgColor: const Color(0xFFDCFCE7),
                    label: "Titik Lokasi",
                    onTap: () {
                      Navigator.pop(context);
                      _sendMessage(
                        customText: "Lokasi Penjemputan Pakaian",
                        attachment: {
                          "type": "location",
                          "name": "Jln. Kamojang No. 42B",
                          "detail": "Patokan dekat Masjid Al-Berkah",
                        },
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAttachmentTile({
    required IconData icon,
    required Color color,
    required Color bgColor,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: bgColor,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: Color(0xFF334155),
            ),
          ),
        ],
      ),
    );
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Color(0xFF1E293B)),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: Text(
          widget.laundryName,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.phone, color: Color(0xFF16A34A)),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Menghubungi nomor Pak Dedi..."),
                  duration: Duration(seconds: 2),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Today Header Badge
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Text(
                "Hari Ini",
                style: TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF64748B),
                ),
              ),
            ),
          ),

          // Messages List
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg["isUser"] as bool;
                final text = msg["text"] as String;
                final time = msg["time"] as String;
                final attachment = msg["attachment"] as Map<String, dynamic>?;

                if (isUser) {
                  return _buildUserBubble(text, time, attachment);
                } else {
                  return _buildMerchantBubble(text, time);
                }
              },
            ),
          ),

          // Bottom Input Bar with Attachment Paperclip Button
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
            child: SafeArea(
              child: Row(
                children: [
                  // Attachment Paperclip Button
                  InkWell(
                    onTap: _showAttachmentOptions,
                    borderRadius: BorderRadius.circular(24),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: const BoxDecoration(
                        color: Color(0xFFF1F5F9),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        LucideIcons.paperclip,
                        color: Color(0xFF475569),
                        size: 20,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),

                  // Text Input Field
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: TextField(
                        controller: _messageController,
                        onSubmitted: (_) => _sendMessage(),
                        style: const TextStyle(fontSize: 14, color: Color(0xFF0F172A)),
                        decoration: const InputDecoration(
                          hintText: "Ketik pesan...",
                          hintStyle: TextStyle(
                            color: Color(0xFF94A3B8),
                            fontSize: 14,
                            fontWeight: FontWeight.w400,
                          ),
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),

                  // Send Green Button
                  InkWell(
                    onTap: () => _sendMessage(),
                    borderRadius: BorderRadius.circular(24),
                    child: Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: const Color(0xFF16A34A),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF16A34A).withValues(alpha: 0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: const Icon(
                        LucideIcons.send,
                        color: Colors.white,
                        size: 20,
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

  Widget _buildMerchantBubble(String text, String time) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: const BoxDecoration(
              color: Color(0xFFE0F2FE),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              LucideIcons.store,
              size: 18,
              color: Color(0xFF0284C7),
            ),
          ),
          const SizedBox(width: 10),
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(4),
                  topRight: Radius.circular(18),
                  bottomLeft: Radius.circular(18),
                  bottomRight: Radius.circular(18),
                ),
                border: Border.all(color: const Color(0xFFF1F5F9), width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    text,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF334155),
                      height: 1.35,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Align(
                    alignment: Alignment.bottomRight,
                    child: Text(
                      time,
                      style: const TextStyle(
                        fontSize: 10.5,
                        color: Color(0xFF94A3B8),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 40),
        ],
      ),
    );
  }

  Widget _buildUserBubble(String text, String time, Map<String, dynamic>? attachment) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          const SizedBox(width: 40),
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF16A34A),
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(18),
                  topRight: Radius.circular(4),
                  bottomLeft: Radius.circular(18),
                  bottomRight: Radius.circular(18),
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF16A34A).withValues(alpha: 0.25),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // Attachment Rendering inside user bubble
                  if (attachment != null) ...[
                    _buildAttachmentPreview(attachment),
                    const SizedBox(height: 8),
                  ],
                  if (text.isNotEmpty)
                    Text(
                      text,
                      style: const TextStyle(
                        fontSize: 14,
                        color: Colors.white,
                        height: 1.35,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  const SizedBox(height: 6),
                  Text(
                    time,
                    style: TextStyle(
                      fontSize: 10.5,
                      color: Colors.white.withValues(alpha: 0.8),
                      fontWeight: FontWeight.w500,
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

  Widget _buildAttachmentPreview(Map<String, dynamic> attachment) {
    final type = attachment["type"] as String;
    if (type == "image") {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              attachment["url"] as String,
              width: 200,
              height: 120,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                width: 200,
                height: 120,
                color: Colors.white24,
                child: const Icon(LucideIcons.image, color: Colors.white),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            "${attachment['name']} (${attachment['size']})",
            style: const TextStyle(fontSize: 11, color: Colors.white70),
          ),
        ],
      );
    } else if (type == "document") {
      return Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.2),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(LucideIcons.fileText, color: Colors.white, size: 24),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  attachment["name"] as String,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  attachment["size"] as String,
                  style: const TextStyle(fontSize: 11, color: Colors.white70),
                ),
              ],
            ),
          ],
        ),
      );
    } else if (type == "location") {
      return Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.2),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(LucideIcons.mapPin, color: Colors.white, size: 24),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  attachment["name"] as String,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  attachment["detail"] as String,
                  style: const TextStyle(fontSize: 11, color: Colors.white70),
                ),
              ],
            ),
          ],
        ),
      );
    }
    return const SizedBox.shrink();
  }
}
