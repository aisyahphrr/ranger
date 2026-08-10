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
  });

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
  final String reviews;
  final bool open;
  final String openHours;
  final String distance;
  final String type;
  final String img;
  final List<String> tags;
  final bool isFavorite;
  final bool isExpress;

  Laundry({
    required this.id,
    required this.name,
    required this.address,
    required this.price,
    required this.rating,
    this.reviews = "1.2k",
    required this.open,
    this.openHours = "Buka - Tutup 21.00",
    required this.distance,
    required this.type,
    required this.img,
    this.tags = const ["Antar Jemput", "Ekspres 3 Jam"],
    this.isFavorite = false,
    this.isExpress = true,
  });

  String get formattedPrice {
    final currencyFormatter = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);
    return currencyFormatter.format(price);
  }
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
  final double rating;
  final String reviews;
  final bool isFavorite;
  final int photoCount;

  KosItem({
    required this.id,
    required this.name,
    required this.address,
    required this.price,
    required this.type,
    required this.facilities,
    required this.available,
    required this.img,
    this.rating = 4.8,
    this.reviews = "120 ulasan",
    this.isFavorite = false,
    this.photoCount = 8,
  });

  String get formattedPrice {
    final currencyFormatter = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ', decimalDigits: 0);
    return currencyFormatter.format(price);
  }
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
