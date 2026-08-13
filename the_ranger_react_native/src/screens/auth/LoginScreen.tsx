import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Nav } from "../../types";

export const LoginScreen: React.FC<Nav> = ({ navigate }) => {
  const [phone, setPhone] = useState("");
  const [tab, setTab] = useState<"login" | "daftar">("login");
  const [name, setName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>R</Text>
          </View>
          <Text style={styles.headerTitle}>Rangers App</Text>
          <Text style={styles.headerSubtitle}>Layanan Komunitas PGE Kamojang</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, tab === "login" && styles.tabActive]}
              onPress={() => setTab("login")}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, tab === "login" && styles.tabTextActive]}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, tab === "daftar" && styles.tabActive]}
              onPress={() => setTab("daftar")}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, tab === "daftar" && styles.tabTextActive]}>Daftar</Text>
            </TouchableOpacity>
          </View>

          {tab === "daftar" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama sesuai KTP"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nomor WhatsApp</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+62</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="812-xxxx-xxxx"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigate("role")}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {tab === "login" ? "Kirim Kode OTP" : "Daftar Akun Baru"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#1B7A4E",
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoBadgeText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1B7A4E",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#A7F3D0",
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#1B7A4E",
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },
  phoneInputRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    overflow: "hidden",
  },
  countryCode: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#D1D5DB",
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },
  submitButton: {
    backgroundColor: "#1B7A4E",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
