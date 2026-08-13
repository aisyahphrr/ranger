import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native";
import { Nav } from "../../types";
import { Store, Plus, Package, TrendingUp, LogOut } from "lucide-react-native";
import { rp } from "../../utils/formatters";

export const PemilikMarketplaceHomeScreen: React.FC<Nav> = ({ navigate }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.storeInfo}>
          <View style={styles.avatar}>
            <Store size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.storeName}>Toko Batik Kamojang</Text>
            <Text style={styles.storeStatus}>Mitra UMKM Ring 1 • Buka 🛍️</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.roleSwitchBtn} onPress={() => navigate("role")} activeOpacity={0.7}>
          <LogOut size={14} color="#059669" />
          <Text style={styles.roleSwitchText}>Ganti Peran</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Income Card */}
        <View style={styles.incomeCard}>
          <Text style={styles.incomeLabel}>Penjualan Produk UMKM</Text>
          <Text style={styles.incomeVal}>{rp(3180000)}</Text>
          <View style={styles.incomeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>42 Produk</Text>
              <Text style={styles.statLbl}>Terjual Bulan Ini</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>4.9 ★</Text>
              <Text style={styles.statLbl}>Ulasan Pembeli</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Plus size={20} color="#059669" />
            <Text style={styles.actionBtnText}>Tambah Produk</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Package size={20} color="#1B7A4E" />
            <Text style={styles.actionBtnText}>Kelola Stok</Text>
          </TouchableOpacity>
        </View>

        {/* Product Stock */}
        <Text style={styles.sectionTitle}>Produk Toko Anda</Text>

        <View style={styles.productRow}>
          <View style={styles.productCard}>
            <Text style={styles.productTitle}>Batik Kawung Premium</Text>
            <Text style={styles.productPrice}>{rp(185000)}</Text>
            <Text style={styles.stockText}>Stok: 14 Pcs</Text>
          </View>

          <View style={styles.productCard}>
            <Text style={styles.productTitle}>Tas Anyaman Rotan</Text>
            <Text style={styles.productPrice}>{rp(75000)}</Text>
            <Text style={styles.stockText}>Stok: 8 Pcs</Text>
          </View>
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
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
  },
  storeName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  storeStatus: {
    fontSize: 11,
    color: "#6B7280",
  },
  roleSwitchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#D1FAE5",
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  incomeCard: {
    backgroundColor: "#064E3B",
    borderRadius: 20,
    padding: 20,
  },
  incomeLabel: {
    fontSize: 12,
    color: "#A7F3D0",
  },
  incomeVal: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 4,
  },
  incomeStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#047857",
  },
  statItem: {
    flex: 1,
  },
  statVal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#34D399",
  },
  statLbl: {
    fontSize: 11,
    color: "#A7F3D0",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#047857",
  },
  actionGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  productRow: {
    flexDirection: "row",
    gap: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    gap: 4,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#059669",
  },
  stockText: {
    fontSize: 11,
    color: "#6B7280",
  },
});
