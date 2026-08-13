import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import { Nav } from "../../types";
import {
  Pencil,
  MapPin,
  HelpCircle,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  Home,
  Package,
  Users,
  Clock,
  Wallet,
  User,
  X,
  Shirt,
} from "lucide-react-native";

export const LaundryProfilScreen: React.FC<Nav> = ({ navigate }) => {
  const [activeNavTab, setActiveNavTab] = useState<"beranda" | "order" | "riwayat" | "pendapatan" | "profil">("profil");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B5D3F" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Profile */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Shirt size={40} color="#0D7A53" />
          </View>
          <Text style={styles.ownerName}>Pak Rahman</Text>
          <Text style={styles.storeName}>Ranger Laundry Express</Text>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>Mitra Laundry Active</Text>
          </View>
        </View>

        {/* Group AKUN */}
        <Text style={styles.sectionTitle}>AKUN LAUNDRY</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View style={[styles.iconBg, { backgroundColor: "#DCFCE7" }]}>
              <Pencil size={18} color="#0D7A53" />
            </View>
            <Text style={styles.menuText}>Edit Usaha Laundry</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View style={[styles.iconBg, { backgroundColor: "#DBEAFE" }]}>
              <MapPin size={18} color="#2563EB" />
            </View>
            <Text style={styles.menuText}>Alamat & Lokasi Outlet</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Group LAINNYA */}
        <Text style={styles.sectionTitle}>LAINNYA</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View style={[styles.iconBg, { backgroundColor: "#FEF3C7" }]}>
              <HelpCircle size={18} color="#D97706" />
            </View>
            <Text style={styles.menuText}>Bantuan & FAQ</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <View style={[styles.iconBg, { backgroundColor: "#F3F4F6" }]}>
              <Shield size={18} color="#4B5563" />
            </View>
            <Text style={styles.menuText}>Privasi & Keamanan</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuRow, { borderBottomWidth: 0 }]} activeOpacity={0.7}>
            <View style={[styles.iconBg, { backgroundColor: "#F3F4F6" }]}>
              <Settings size={18} color="#4B5563" />
            </View>
            <Text style={styles.menuText}>Pengaturan</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Card */}
        <View style={styles.logoutCard}>
          <TouchableOpacity style={styles.menuRow} onPress={() => setIsLogoutModalOpen(true)} activeOpacity={0.7}>
            <View style={[styles.iconBg, { backgroundColor: "#FEE2E2" }]}>
              <LogOut size={18} color="#DC2626" />
            </View>
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Rangers App v2.0 • Pemilik Laundry</Text>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navTab} onPress={() => navigate("pemilik_laundry_home")}>
          <Home size={22} color="#9CA3AF" />
          <Text style={styles.navText}>Beranda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => navigate("pemilik_laundry_order")}>
          <Package size={22} color="#9CA3AF" />
          <Text style={styles.navText}>Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => navigate("pemilik_laundry_user")}>
          <Users size={22} color="#9CA3AF" />
          <Text style={styles.navText}>User</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => navigate("pemilik_laundry_pendapatan")}>
          <Wallet size={22} color="#9CA3AF" />
          <Text style={styles.navText}>Keuangan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navTab} onPress={() => setActiveNavTab("profil")}>
          <User size={22} color="#0D7A53" />
          <Text style={[styles.navText, styles.navTextActive]}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Modal */}
      <Modal visible={isLogoutModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Konfirmasi Keluar</Text>
            <Text style={styles.confirmSub}>Apakah Anda yakin ingin keluar dari akun Pemilik Laundry?</Text>

            <View style={styles.confirmBtnRow}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setIsLogoutModalOpen(false)}>
                <Text style={styles.btnCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnLogout} onPress={() => { setIsLogoutModalOpen(false); navigate("role"); }}>
                <Text style={styles.btnLogoutText}>Ya, Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { paddingBottom: 20 },
  profileHeader: {
    backgroundColor: "#0B5D3F",
    paddingTop: 36,
    paddingBottom: 28,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  ownerName: { fontSize: 22, fontWeight: "900", color: "#FFFFFF" },
  storeName: { fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 2, marginBottom: 10 },
  badgePill: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgePillText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF" },

  sectionTitle: { fontSize: 12, fontWeight: "800", color: "#6B7280", marginHorizontal: 20, marginBottom: 8 },
  groupCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
  },
  logoutCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
    gap: 14,
  },
  iconBg: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  menuText: { flex: 1, fontSize: 14, fontWeight: "700", color: "#111827" },
  logoutText: { flex: 1, fontSize: 14, fontWeight: "800", color: "#DC2626" },
  versionText: { textAlign: "center", fontSize: 11, color: "#9CA3AF", marginTop: 4 },

  bottomNav: {
    flexDirection: "row",
    height: 64,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "space-around",
  },
  navTab: { alignItems: "center", justifyContent: "center" },
  navText: { fontSize: 10, color: "#9CA3AF", marginTop: 3 },
  navTextActive: { color: "#0D7A53", fontWeight: "700" },

  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  confirmCard: { width: "100%", maxWidth: 320, backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20 },
  confirmTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 8, textAlign: "center" },
  confirmSub: { fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 20 },
  confirmBtnRow: { flexDirection: "row", gap: 12 },
  btnCancel: { flex: 1, height: 44, borderRadius: 14, borderWidth: 1, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center" },
  btnCancelText: { fontSize: 13, fontWeight: "700", color: "#374151" },
  btnLogout: { flex: 1, height: 44, borderRadius: 14, backgroundColor: "#DC2626", alignItems: "center", justifyContent: "center" },
  btnLogoutText: { fontSize: 13, fontWeight: "800", color: "#FFFFFF" },
});
