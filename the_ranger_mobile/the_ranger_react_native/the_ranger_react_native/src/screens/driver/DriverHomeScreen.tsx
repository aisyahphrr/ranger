import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Nav } from "../../types";
import { DRIVER_ORDERS } from "../../constants/mockData";
import { rp } from "../../utils/formatters";
import { Wallet, Package, MapPin, CheckCircle2, LogOut } from "lucide-react-native";

export const DriverHomeScreen: React.FC<Nav> = ({ navigate }) => {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.driverInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>D</Text>
          </View>
          <View>
            <Text style={styles.driverName}>Pak Asep (Driver)</Text>
            <Text style={styles.vehicleInfo}>Motor • D 4521 ABC</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.roleSwitchBtn} onPress={() => navigate("role")} activeOpacity={0.7}>
          <LogOut size={14} color="#EA580C" />
          <Text style={styles.roleSwitchText}>Ganti Peran</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Toggle Card */}
        <View style={[styles.statusCard, isOnline ? styles.statusCardOnline : styles.statusCardOffline]}>
          <View>
            <Text style={styles.statusTitle}>
              {isOnline ? "Status: Siap Terima Order 🟢" : "Status: Offline 🔴"}
            </Text>
            <Text style={styles.statusSub}>
              {isOnline ? "Anda akan menerima notifikasi pesanan masuk" : "Aktifkan untuk menerima pesanan"}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: "#D1D5DB", true: "#A7F3D0" }}
            thumbColor={isOnline ? "#1B7A4E" : "#9CA3AF"}
          />
        </View>

        {/* Daily Summary */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBg, { backgroundColor: "#E8F5EE" }]}>
              <Wallet size={20} color="#1B7A4E" />
            </View>
            <Text style={styles.summaryVal}>{rp(130000)}</Text>
            <Text style={styles.summaryLbl}>Pendapatan Hari Ini</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconBg, { backgroundColor: "#FFEDD5" }]}>
              <Package size={20} color="#EA580C" />
            </View>
            <Text style={styles.summaryVal}>8 Order</Text>
            <Text style={styles.summaryLbl}>Selesai Hari Ini</Text>
          </View>
        </View>

        {/* Active / Incoming Orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Orderan Tersedia</Text>
        </View>

        {DRIVER_ORDERS.map((ord) => (
          <View key={ord.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderBadge}>
                <Text style={styles.orderBadgeText}>{ord.type}</Text>
              </View>
              <Text style={styles.orderTime}>{ord.time}</Text>
            </View>

            <View style={styles.routeContainer}>
              <View style={styles.routePoint}>
                <MapPin size={14} color="#EA580C" />
                <Text style={styles.routeText} numberOfLines={1}>
                  Dari: {ord.from}
                </Text>
              </View>
              <View style={styles.routePoint}>
                <MapPin size={14} color="#1B7A4E" />
                <Text style={styles.routeText} numberOfLines={1}>
                  Ke: {ord.to}
                </Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <View>
                <Text style={styles.distText}>{ord.dist}</Text>
                <Text style={styles.payText}>{rp(ord.pay)}</Text>
              </View>
              <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8}>
                <CheckCircle2 size={16} color="#FFFFFF" />
                <Text style={styles.acceptBtnText}>Terima Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EA580C",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  driverName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  vehicleInfo: {
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
    backgroundColor: "#FFEDD5",
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#EA580C",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  statusCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusCardOnline: {
    backgroundColor: "#E8F5EE",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  statusCardOffline: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  statusSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    gap: 4,
  },
  summaryIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  summaryLbl: {
    fontSize: 11,
    color: "#6B7280",
  },
  sectionHeader: {
    marginTop: 8,
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
    gap: 12,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  orderTime: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  routeContainer: {
    gap: 6,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  routeText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },
  orderFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  distText: {
    fontSize: 11,
    color: "#6B7280",
  },
  payText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1B7A4E",
  },
  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B7A4E",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  acceptBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
