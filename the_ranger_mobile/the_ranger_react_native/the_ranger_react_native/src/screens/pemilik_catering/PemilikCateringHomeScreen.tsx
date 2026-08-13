import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Nav } from "../../types";
import { Coffee, Plus, ShoppingBag, Wallet, LogOut } from "lucide-react-native";
import { rp } from "../../utils/formatters";

export const PemilikCateringHomeScreen: React.FC<Nav> = ({ navigate }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.storeInfo}>
          <View style={styles.avatar}>
            <Coffee size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.storeName}>Catering Bu Haji Nani</Text>
            <Text style={styles.storeStatus}>Mitra Catering Ring 1 • Aktif 🟢</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.roleSwitchBtn} onPress={() => navigate("role")} activeOpacity={0.7}>
          <LogOut size={14} color="#D97706" />
          <Text style={styles.roleSwitchText}>Ganti Peran</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ringkasan Pendapatan */}
        <View style={styles.incomeCard}>
          <Text style={styles.incomeLabel}>Total Pendapatan Bulan Ini</Text>
          <Text style={styles.incomeVal}>{rp(4250000)}</Text>
          <View style={styles.incomeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>18 Pax</Text>
              <Text style={styles.statLbl}>Pesanan Prasmanan</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>4.8 ★</Text>
              <Text style={styles.statLbl}>Rating Dapur</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Plus size={20} color="#D97706" />
            <Text style={styles.actionBtnText}>Tambah Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <ShoppingBag size={20} color="#1B7A4E" />
            <Text style={styles.actionBtnText}>Pesanan Masuk</Text>
          </TouchableOpacity>
        </View>

        {/* Orders list */}
        <Text style={styles.sectionTitle}>Pesanan Catering Masuk</Text>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>#CAT-8812</Text>
            <Text style={styles.orderBadge}>Perlu Diproses</Text>
          </View>
          <Text style={styles.orderItem}>Nasi Box Komplit Ayam Bakar (30 Pax)</Text>
          <Text style={styles.orderNote}>Untuk acara Balai Desa Kamojang • Pkl 12:00 WIB</Text>
          <View style={styles.orderFooter}>
            <Text style={styles.orderTotal}>{rp(750000)}</Text>
            <TouchableOpacity style={styles.processBtn}>
              <Text style={styles.processBtnText}>Terima & Masak</Text>
            </TouchableOpacity>
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
    backgroundColor: "#D97706",
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
    backgroundColor: "#FEF3C7",
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  incomeCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 20,
  },
  incomeLabel: {
    fontSize: 12,
    color: "#9CA3AF",
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
    borderTopColor: "#374151",
  },
  statItem: {
    flex: 1,
  },
  statVal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FBBF24",
  },
  statLbl: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#374151",
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
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    gap: 8,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  orderBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  orderItem: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  orderNote: {
    fontSize: 12,
    color: "#6B7280",
  },
  orderFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1B7A4E",
  },
  processBtn: {
    backgroundColor: "#D97706",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  processBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
