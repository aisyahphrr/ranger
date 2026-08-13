import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Nav } from "../../types";
import { AuthAccount } from "../auth/authTypes";
import { Wind, Plus, PackageCheck, LogOut } from "lucide-react-native";
import { rp } from "../../utils/formatters";

interface LaundryHomeProps extends Nav {
  authAccount?: AuthAccount | null;
}

export const PemilikLaundryHomeScreen: React.FC<LaundryHomeProps> = ({ navigate, authAccount }) => {
  const laundryName = authAccount?.roleData.businessName || "Nama laundry belum diatur";
  const laundryAddress = authAccount?.roleData.businessAddress || authAccount?.address || "Alamat outlet belum diatur";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.storeInfo}>
          <View style={styles.avatar}>
            <Wind size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.storeName}>{laundryName}</Text>
            <Text style={styles.storeStatus}>Layanan Laundry Kiloan & Ekspres 🧺</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.roleSwitchBtn} onPress={() => navigate("login")} activeOpacity={0.7}>
          <LogOut size={14} color="#0284C7" />
          <Text style={styles.roleSwitchText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card Ringkasan */}
        <View style={styles.incomeCard}>
          <Text style={styles.incomeLabel}>Pendapatan Laundry Bulan Ini</Text>
          <Text style={styles.incomeVal}>{rp(1950000)}</Text>
          <View style={styles.incomeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>325 kg</Text>
              <Text style={styles.statLbl}>Pakaian Dicuci</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>4.8 ★</Text>
              <Text style={styles.statLbl}>Rating Pelanggan</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Plus size={20} color="#0284C7" />
            <Text style={styles.actionBtnText}>Order Masuk Baru</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <PackageCheck size={20} color="#1B7A4E" />
            <Text style={styles.actionBtnText}>Status Pengerjaan</Text>
          </TouchableOpacity>
        </View>

        {/* Orders in progress */}
        <Text style={styles.sectionTitle}>Order Laundry Sedang Dikerjakan</Text>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>#LND-402</Text>
            <Text style={styles.orderBadge}>Sedang Dicuci</Text>
          </View>
          <Text style={styles.orderDetail}>Pakaian Kiloan Ekspres (4.5 kg)</Text>
          <Text style={styles.orderOwner}>Pemesan: Kak Anita (Kos Melati No. 7)</Text>
          <View style={styles.orderFooter}>
            <Text style={styles.orderTotal}>{rp(27000)}</Text>
            <TouchableOpacity style={styles.doneBtn}>
              <Text style={styles.doneBtnText}>Tandai Selesai</Text>
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
    backgroundColor: "#0284C7",
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
    backgroundColor: "#E0F2FE",
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0284C7",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  incomeCard: {
    backgroundColor: "#0C4A6E",
    borderRadius: 20,
    padding: 20,
  },
  incomeLabel: {
    fontSize: 12,
    color: "#BAE6FD",
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
    borderTopColor: "#0369A1",
  },
  statItem: {
    flex: 1,
  },
  statVal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#38BDF8",
  },
  statLbl: {
    fontSize: 11,
    color: "#BAE6FD",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#0369A1",
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
    gap: 6,
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
    color: "#0284C7",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  orderDetail: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  orderOwner: {
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
    color: "#0284C7",
  },
  doneBtn: {
    backgroundColor: "#0284C7",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
