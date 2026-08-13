import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Nav } from "../../types";
import { Building2, Plus, Users, LogOut } from "lucide-react-native";
import { rp } from "../../utils/formatters";

export const PemilikKosHomeScreen: React.FC<Nav> = ({ navigate }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.storeInfo}>
          <View style={styles.avatar}>
            <Building2 size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.storeName}>Kos Putri Melati</Text>
            <Text style={styles.storeStatus}>Jl. Aster No. 7, Kamojang 🏠</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.roleSwitchBtn} onPress={() => navigate("role")} activeOpacity={0.7}>
          <LogOut size={14} color="#7C3AED" />
          <Text style={styles.roleSwitchText}>Ganti Peran</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Income Card */}
        <View style={styles.incomeCard}>
          <Text style={styles.incomeLabel}>Pendapatan Sewa Kos Bulan Ini</Text>
          <Text style={styles.incomeVal}>{rp(6750000)}</Text>
          <View style={styles.incomeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>9 / 10 Terisi</Text>
              <Text style={styles.statLbl}>Kamar Tersewa</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>1 Kosong</Text>
              <Text style={styles.statLbl}>Kamar Siap Huni</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Plus size={20} color="#7C3AED" />
            <Text style={styles.actionBtnText}>Kamar Baru</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Users size={20} color="#1B7A4E" />
            <Text style={styles.actionBtnText}>Daftar Penghuni</Text>
          </TouchableOpacity>
        </View>

        {/* Bookings / Enquiries */}
        <Text style={styles.sectionTitle}>Pengajuan Sewa Kamar Masuk</Text>

        <View style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.roomName}>Kamar No. 04 (Lantai 1)</Text>
            <Text style={styles.bookingBadge}>Menunggu Persetujuan</Text>
          </View>
          <Text style={styles.applicantName}>Calon Penghuni: Sdr. Rina Lariska</Text>
          <Text style={styles.durationText}>Durasi: 6 Bulan (Dimulai 1 Sep 2024)</Text>
          <View style={styles.bookingFooter}>
            <Text style={styles.bookingPrice}>{rp(750000)} / bulan</Text>
            <TouchableOpacity style={styles.approveBtn}>
              <Text style={styles.approveBtnText}>Setujui Sewa</Text>
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
    backgroundColor: "#7C3AED",
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
    backgroundColor: "#EDE9FE",
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7C3AED",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  incomeCard: {
    backgroundColor: "#4C1D95",
    borderRadius: 20,
    padding: 20,
  },
  incomeLabel: {
    fontSize: 12,
    color: "#DDD6FE",
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
    borderTopColor: "#6D28D9",
  },
  statItem: {
    flex: 1,
  },
  statVal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A78BFA",
  },
  statLbl: {
    fontSize: 11,
    color: "#DDD6FE",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#6D28D9",
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
  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    gap: 6,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  bookingBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7C3AED",
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  applicantName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  durationText: {
    fontSize: 12,
    color: "#6B7280",
  },
  bookingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  bookingPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#7C3AED",
  },
  approveBtn: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  approveBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
