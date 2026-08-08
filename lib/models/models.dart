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
    final currencyFormatter = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);
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
  });

  String get formattedMinOrder {
    final currencyFormatter = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);
    return currencyFormatter.format(minOrder);
  }
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

  OrderModel({
    required this.id,
    required this.type,
    required this.item,
    required this.detail,
    required this.status,
    required this.date,
    required this.total,
  });
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
