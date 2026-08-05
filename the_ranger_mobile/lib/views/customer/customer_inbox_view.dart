import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/theme/app_theme.dart';

class CustomerInboxView extends StatelessWidget {
  const CustomerInboxView({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text("Inbox & Notifikasi"),
          bottom: const TabBar(
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.textMuted,
            indicatorColor: AppColors.primary,
            tabs: [
              Tab(text: "Notifikasi"),
              Tab(text: "Pesan Chat"),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Tab 1: Notifications
            ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _NotifTile(
                  icon: LucideIcons.bike,
                  color: Colors.blue,
                  title: "Pesanan Dikirim 🚴",
                  subtitle: "Pesanan #RNG001 sedang dalam perjalanan ke lokasi Anda",
                  time: "5 mnt lalu",
                  unread: true,
                ),
                _NotifTile(
                  icon: LucideIcons.percent,
                  color: Colors.orange,
                  title: "🎉 Promo Spesial Hari Ini!",
                  subtitle: "Diskon 20% untuk semua laundry. Gunakan kode BERSIH20",
                  time: "1 jam lalu",
                  unread: true,
                ),
                _NotifTile(
                  icon: LucideIcons.info,
                  color: Colors.green,
                  title: "Fitur Baru: Kos Online",
                  subtitle: "Temukan kos-kosan di sekitar Kamojang dengan mudah di Rangers App",
                  time: "2 jam lalu",
                  unread: false,
                ),
              ],
            ),

            // Tab 2: Chat Messages
            ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _ChatTile(
                  name: "Asep Kurir (Driver)",
                  message: "Halo kak, pesanan nasi timbel sudah saya ambil yaa",
                  time: "10:42",
                  unreadCount: 1,
                ),
                _ChatTile(
                  name: "Warung Bu Siti",
                  message: "Terima kasih sudah memesan!",
                  time: "Kemarin",
                  unreadCount: 0,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _NotifTile extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  final String time;
  final bool unread;

  const _NotifTile({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
    required this.time,
    required this.unread,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: unread ? AppColors.secondary.withValues(alpha: 0.4) : Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 4),
                Text(subtitle, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, height: 1.3)),
                const SizedBox(height: 6),
                Text(time, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ChatTile extends StatelessWidget {
  final String name;
  final String message;
  final String time;
  final int unreadCount;

  const _ChatTile({
    required this.name,
    required this.message,
    required this.time,
    required this.unreadCount,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: AppColors.primaryLight,
            child: Text(name[0], style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 2),
                Text(message, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(time, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
              if (unreadCount > 0) ...[
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(color: AppColors.accent, shape: BoxShape.circle),
                  child: Text(unreadCount.toString(), style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}
