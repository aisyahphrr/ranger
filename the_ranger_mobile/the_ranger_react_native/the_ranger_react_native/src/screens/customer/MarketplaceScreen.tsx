import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Nav } from "../../types";
import { PRODUCTS } from "../../constants/mockData";
import { BackHeader } from "../../components/BackHeader";
import { Stars } from "../../components/Stars";
import { rp } from "../../utils/formatters";
import { ShoppingBag } from "lucide-react-native";

export const MarketplaceScreen: React.FC<Nav> = ({ navigate }) => {
  const [cat, setCat] = useState("Semua");
  const categories = ["Semua", "Makanan", "Fashion", "Minuman", "Kesehatan", "Kerajinan"];

  const filteredProducts =
    cat === "Semua" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Marketplace UMKM" onBack={() => navigate("c_home")} />

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catScroll}
      >
        {categories.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.catPill, cat === c && styles.catPillActive]}
            onPress={() => setCat(c)}
            activeOpacity={0.7}
          >
            <Text style={[styles.catPillText, cat === c && styles.catPillTextActive]}>
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product Grid */}
      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredProducts.map((p) => (
            <TouchableOpacity key={p.id} style={styles.card} activeOpacity={0.8}>
              <Image source={{ uri: p.img }} style={styles.cardImg} />
              <View style={styles.cardBody}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={styles.cardStore} numberOfLines={1}>
                  {p.store}
                </Text>
                <View style={styles.ratingRow}>
                  <Stars rating={p.rating} />
                  <Text style={styles.soldText}>{p.sold} terjual</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>{rp(p.price)}</Text>
                  <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
                    <ShoppingBag size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  catScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  catPillActive: {
    backgroundColor: "#1B7A4E",
    borderColor: "#1B7A4E",
  },
  catPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  catPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardImg: {
    width: "100%",
    height: 120,
  },
  cardBody: {
    padding: 10,
    gap: 4,
  },
  cardName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  cardStore: {
    fontSize: 11,
    color: "#6B7280",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  soldText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1B7A4E",
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1B7A4E",
    alignItems: "center",
    justifyContent: "center",
  },
});
