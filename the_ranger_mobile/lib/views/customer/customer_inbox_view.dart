import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_theme.dart';
import '../../models/models.dart';
import '../../providers/app_provider.dart';
import 'customer_chat_view.dart';

class CustomerInboxView extends StatelessWidget {
  const CustomerInboxView({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context);

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Notifikasi & Inbox'),
          actions: [
            if (appState.unreadInboxCount > 0)
              TextButton(
                onPressed: appState.markAllInboxRead,
                child: const Text('Tandai dibaca'),
              ),
          ],
          bottom: const TabBar(
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.textMuted,
            indicatorColor: AppColors.primary,
            tabs: [
              Tab(text: 'Notifikasi'),
              Tab(text: 'Chat'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            appState.notifications.isEmpty
                ? const _EmptyInbox(
                    message: 'Belum ada notifikasi dari pesanan atau layanan.',
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: appState.notifications.length,
                    itemBuilder: (context, index) => _NotificationTile(
                      notification: appState.notifications[index],
                    ),
                  ),
            appState.chatThreads.isEmpty
                ? const _EmptyInbox(
                    message:
                        'Belum ada percakapan. Buka chat dari detail pesanan untuk mulai menghubungi toko atau driver.',
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: appState.chatThreads.length,
                    itemBuilder: (context, index) => _ChatThreadTile(
                      thread: appState.chatThreads[index],
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}

class _NotificationTile extends StatelessWidget {
  final CustomerNotification notification;

  const _NotificationTile({required this.notification});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context, listen: false);
    final icon = notification.type == 'review'
        ? LucideIcons.star
        : LucideIcons.shoppingBag;
    final color = notification.type == 'review'
        ? Colors.amber.shade800
        : AppColors.primary;

    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: () {
        appState.markNotificationRead(notification.id);
        appState.setCustomerTab(2);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: notification.isRead
              ? Colors.white
              : AppColors.secondary.withValues(alpha: .4),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: .12),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    notification.title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    notification.description,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    notification.time,
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
            if (!notification.isRead)
              const Padding(
                padding: EdgeInsets.only(left: 8, top: 4),
                child: CircleAvatar(
                  radius: 4,
                  backgroundColor: AppColors.accent,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _ChatThreadTile extends StatelessWidget {
  final CustomerChatThread thread;

  const _ChatThreadTile({required this.thread});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppProvider>(context, listen: false);
    final order = appState.orders.cast<OrderModel?>().firstWhere(
          (item) => item?.id == thread.orderId,
          orElse: () => null,
        );

    return InkWell(
      borderRadius: BorderRadius.circular(15),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => CustomerChatView(
              threadId: thread.id,
              orderId: thread.orderId,
              participantType: thread.participantType,
              participantName: thread.participantName,
              order: order,
            ),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(13),
        decoration: BoxDecoration(
          color: thread.unreadCount > 0
              ? AppColors.secondary.withValues(alpha: .45)
              : Colors.white,
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            _ChatIcon(type: thread.participantType),
            const SizedBox(width: 11),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          thread.participantName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                      Text(
                        _formatThreadTime(thread.updatedAt),
                        style: const TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 9,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    thread.lastMessage.isEmpty
                        ? 'Percakapan baru'
                        : thread.lastMessage,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Order #${thread.orderId} · ${thread.participantType == 'driver' ? 'Driver' : 'Toko'}',
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 9,
                    ),
                  ),
                ],
              ),
            ),
            if (thread.unreadCount > 0) ...[
              const SizedBox(width: 8),
              Container(
                constraints: const BoxConstraints(minWidth: 18),
                padding: const EdgeInsets.symmetric(
                  horizontal: 5,
                  vertical: 3,
                ),
                decoration: const BoxDecoration(
                  color: AppColors.accent,
                  shape: BoxShape.circle,
                ),
                child: Text(
                  '${thread.unreadCount}',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ChatIcon extends StatelessWidget {
  final String type;

  const _ChatIcon({required this.type});

  @override
  Widget build(BuildContext context) {
    final isDriver = type == 'driver';
    return Container(
      width: 42,
      height: 42,
      decoration: BoxDecoration(
        color: isDriver ? const Color(0xFFE5F5EE) : AppColors.primaryLight,
        shape: BoxShape.circle,
      ),
      child: Icon(
        isDriver ? LucideIcons.bike : LucideIcons.store,
        color: AppColors.primary,
        size: 20,
      ),
    );
  }
}

class _EmptyInbox extends StatelessWidget {
  final String message;

  const _EmptyInbox({required this.message});

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                LucideIcons.inbox,
                size: 48,
                color: AppColors.textMuted,
              ),
              const SizedBox(height: 14),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 13,
                  height: 1.5,
                ),
              ),
            ],
          ),
        ),
      );
}

String _formatThreadTime(String value) {
  final date = DateTime.tryParse(value)?.toLocal();
  if (date == null) return '';
  final hour = date.hour.toString().padLeft(2, '0');
  final minute = date.minute.toString().padLeft(2, '0');
  return '$hour:$minute';
}
