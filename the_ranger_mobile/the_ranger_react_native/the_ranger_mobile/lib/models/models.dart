import 'dart:typed_data';

import 'package:intl/intl.dart';

class Product {
  final int id;
  final String name;
  final String store;
  final int price;
  final double rating;
  final int sold;
  final String img;
  bool liked;
  final String cat;
  final String description;
  final int stock;
  final bool isActive;
  final Uint8List? imageBytes;

  Product({
    required this.id,
    required this.name,
    required this.store,
    required this.price,
    required this.rating,
    required this.sold,
    required this.img,
    this.liked = false,
    required this.cat,
    this.description = '',
    this.stock = 10,
    this.isActive = true,
    this.imageBytes,
  });

  bool get isAvailable => isActive && stock > 0;

  Product copyWith({
    String? name,
    String? store,
    int? price,
    String? img,
    String? cat,
    String? description,
    int? stock,
    bool? isActive,
    Uint8List? imageBytes,
  }) {
    return Product(
      id: id,
      name: name ?? this.name,
      store: store ?? this.store,
      price: price ?? this.price,
      rating: rating,
      sold: sold,
      img: img ?? this.img,
      liked: liked,
      cat: cat ?? this.cat,
      description: description ?? this.description,
      stock: stock ?? this.stock,
      isActive: isActive ?? this.isActive,
      imageBytes: imageBytes ?? this.imageBytes,
    );
  }

  String get formattedPrice {
    final currencyFormatter =
        NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);
    return currencyFormatter.format(price);
  }
}

class Restaurant {
  final int id;
  final String name;
  final String cuisine;
  final double rating;
  final double distance;
  final int minOrder;
  final String img;
  final List<String> tags;
  final bool open;
  final int priceStarts;
  final int reviewCount;
  final String address;
  final String description;
  final String openingHours;

  Restaurant({
    required this.id,
    required this.name,
    required this.cuisine,
    required this.rating,
    required this.distance,
    required this.minOrder,
    required this.img,
    required this.tags,
    required this.open,
    required this.priceStarts,
    this.reviewCount = 0,
    this.address = '',
    this.description = '',
    this.openingHours = '',
  });

  String get formattedMinOrder {
    final currencyFormatter =
        NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);
    return currencyFormatter.format(minOrder);
  }
}

class OrderLine {
  final int productId;
  final String name;
  final int price;
  final int quantity;

  const OrderLine({
    required this.productId,
    required this.name,
    required this.price,
    required this.quantity,
  });

  int get total => price * quantity;
}

class Laundry {
  final int id;
  final String name;
  final String address;
  final int price;
  final double rating;
  final bool open;
  final String distance;
  final String type;
  final String img;

  Laundry({
    required this.id,
    required this.name,
    required this.address,
    required this.price,
    required this.rating,
    required this.open,
    required this.distance,
    required this.type,
    required this.img,
  });
}

class KosItem {
  final int id;
  final String name;
  final String address;
  final int price;
  final String type; // Putra / Putri / Campur
  final List<String> facilities;
  final bool available;
  final String img;

  KosItem({
    required this.id,
    required this.name,
    required this.address,
    required this.price,
    required this.type,
    required this.facilities,
    required this.available,
    required this.img,
  });
}

class OrderModel {
  final String id;
  final String type;
  final String item;
  final String detail;
  final String status;
  final String date;
  final int total;
  final List<OrderLine> lines;
  final String address;
  final String paymentMethod;
  final String? driverId;
  final String? driverName;
  final String? driverPhone;
  final String? driverVehicle;

  OrderModel({
    required this.id,
    required this.type,
    required this.item,
    required this.detail,
    required this.status,
    required this.date,
    required this.total,
    this.lines = const [],
    this.address = '',
    this.paymentMethod = '',
    this.driverId,
    this.driverName,
    this.driverPhone,
    this.driverVehicle,
  });

  bool get hasAssignedDriver =>
      (driverId?.trim().isNotEmpty ?? false) ||
      (driverName?.trim().isNotEmpty ?? false);
}

class CustomerNotification {
  final String id;
  final String title;
  final String description;
  final String time;
  final String type;
  final String? orderId;
  final bool isRead;

  const CustomerNotification({
    required this.id,
    required this.title,
    required this.description,
    required this.time,
    required this.type,
    this.orderId,
    this.isRead = false,
  });

  CustomerNotification copyWith({bool? isRead}) {
    return CustomerNotification(
      id: id,
      title: title,
      description: description,
      time: time,
      type: type,
      orderId: orderId,
      isRead: isRead ?? this.isRead,
    );
  }
}

class CustomerChatMessage {
  final String id;
  final String threadId;
  final String text;
  final String senderType;
  final String sentAt;

  const CustomerChatMessage({
    required this.id,
    required this.threadId,
    required this.text,
    required this.senderType,
    required this.sentAt,
  });

  bool get isCustomer => senderType == 'customer';
}

class CustomerChatThread {
  final String id;
  final String orderId;
  final String participantType;
  final String participantName;
  final String lastMessage;
  final String updatedAt;
  final int unreadCount;

  const CustomerChatThread({
    required this.id,
    required this.orderId,
    required this.participantType,
    required this.participantName,
    required this.lastMessage,
    required this.updatedAt,
    this.unreadCount = 0,
  });

  CustomerChatThread copyWith({
    String? lastMessage,
    String? updatedAt,
    int? unreadCount,
    String? participantName,
  }) {
    return CustomerChatThread(
      id: id,
      orderId: orderId,
      participantType: participantType,
      participantName: participantName ?? this.participantName,
      lastMessage: lastMessage ?? this.lastMessage,
      updatedAt: updatedAt ?? this.updatedAt,
      unreadCount: unreadCount ?? this.unreadCount,
    );
  }
}

class CustomerPromotion {
  final String id;
  final String title;
  final String subtitle;
  final String? code;
  final String ctaLabel;

  const CustomerPromotion({
    required this.id,
    required this.title,
    required this.subtitle,
    this.code,
    this.ctaLabel = 'Lihat Promo',
  });
}

class CustomerReview {
  final String orderId;
  final int rating;
  final String text;
  final String date;

  const CustomerReview(
      {required this.orderId,
      required this.rating,
      required this.text,
      required this.date});
}

class DriverOrder {
  final String id;
  final String type;
  final String from;
  final String to;
  final String dist;
  final int pay;
  final String time;

  DriverOrder({
    required this.id,
    required this.type,
    required this.from,
    required this.to,
    required this.dist,
    required this.pay,
    required this.time,
  });
}
