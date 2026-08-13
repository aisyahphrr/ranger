import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
} from "react-native";
import { Screen } from "../../types";
import { KOS_LIST } from "../../constants/mockData";
import { BackHeader } from "../../components/BackHeader";
import { rp } from "../../utils/formatters";
import { Building, MessageSquare, Heart, MapPin, BadgeCheck, CheckCircle2 } from "lucide-react-native";
import { CustomerChatThread } from "./Inbox";

interface KosScreenProps {
  navigate: (s: Screen) => void;
  chatThreads: CustomerChatThread[];
  setChatThreads: React.Dispatch<React.SetStateAction<CustomerChatThread[]>>;
}

export const KosScreen: React.FC<KosScreenProps> = ({
  navigate,
  chatThreads,
  setChatThreads,
}) => {
  const [filterType, setFilterType] = useState<"Semua" | "Putra" | "Putri" | "Campur">("Semua");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const handleToggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((wId) => wId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const handleContactOwner = (kos: any) => {
    // Generate a new chat thread for this kos enquiry
    const threadId = `ch_kos_${kos.id}`;
    
    // Check if thread already exists
    const exists = chatThreads.some((t) => t.id === threadId);
    
    if (!exists) {
      const newThread: CustomerChatThread = {
        id: threadId,
        orderId: `KOS0${kos.id}`,
        participantType: "merchant",
        participantName: `Pemilik ${kos.name}`,
        lastMessage: `Halo, saya tertarik menanyakan ketersediaan kamar di ${kos.name}.`,
        updatedAt: "Baru saja",
        unreadCount: 0,
      };
      setChatThreads([newThread, ...chatThreads]);
    }

    Alert.alert(
      "Pesan Terkirim 💬",
      `Pesan penawaran kos telah dikirim ke pemilik ${kos.name}. Anda dapat melanjutkan percakapan di tab Inbox -> Chat.`,
      [
        { text: "Batal" },
        { 
          text: "Buka Inbox", 
          onPress: () => {
            // Redirect to home and we can suggest looking at inbox tab
            navigate("c_home");
          } 
        }
      ]
    );
  };

  const filteredKos = KOS_LIST.filter((k) => {
    return filterType === "Semua" || k.type === filterType;
  });

  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "Putri":
        return { bg: "#FDF2F8", fg: "#DB2777" };
      case "Putra":
        return { bg: "#EFF6FF", fg: "#2563EB" };
      default:
        return { bg: "#FAF5FF", fg: "#7C3AED" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Kos & Penginapan" onBack={() => navigate("c_home")} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Cari Kos Aman & Nyaman</Text>
          <Text style={styles.heroSub}>Temukan ribuan pilihan hunian sementara di sekitar Kamojang dengan harga terbaik dan fasilitas terlengkap.</Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          {(["Semua", "Putra", "Putri", "Campur"] as const).map((type) => {
            const active = filterType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setFilterType(type)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Kos List */}
        <View style={styles.listContainer}>
          {filteredKos.map((k) => {
            const isFav = wishlist.includes(k.id);
            const badge = getTypeBadgeStyles(k.type);
            return (
              <View key={k.id} style={styles.kosCard}>
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: k.img }} style={styles.kosImg} />
                  <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() => handleToggleWishlist(k.id)}
                  >
                    <Heart size={14} color={isFav ? "#EF4444" : "#9CA3AF"} fill={isFav ? "#EF4444" : "none"} />
                  </TouchableOpacity>
                  <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.typeText, { color: badge.fg }]}>Kos {k.type}</Text>
                  </View>
                </View>

                <View style={styles.kosInfo}>
                  <View style={styles.headerRow}>
                    <Text style={styles.kosName}>{k.name}</Text>
                    <View style={styles.availableRow}>
                      <BadgeCheck size={14} color="#10B981" />
                      <Text style={styles.availableText}>Tersedia</Text>
                    </View>
                  </View>

                  <View style={styles.addressRow}>
                    <MapPin size={12} color="#6B7280" />
                    <Text style={styles.addressText} numberOfLines={1}>{k.address}</Text>
                  </View>

                  {/* Facilities Grid */}
                  <View style={styles.facilitiesRow}>
                    {k.facilities.map((fac, idx) => (
                      <View key={idx} style={styles.facilityBadge}>
                        <Text style={styles.facilityText}>{fac}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.priceLabel}>Biaya Sewa</Text>
                      <Text style={styles.priceVal}>{rp(k.price)}<Text style={styles.priceUnit}>/bln</Text></Text>
                    </View>

                    <TouchableOpacity
                      style={styles.chatBtn}
                      onPress={() => handleContactOwner(k)}
                      activeOpacity={0.8}
                    >
                      <MessageSquare size={14} color="#FFFFFF" />
                      <Text style={styles.chatBtnText}>Tanya Kos</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7F5",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    backgroundColor: "#9333EA",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    gap: 6,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  heroSub: {
    color: "#F3E8FF",
    fontSize: 11,
    lineHeight: 16,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  filterPill: {
    flex: 1,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  filterPillActive: {
    backgroundColor: "#9333EA",
    borderColor: "#9333EA",
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  kosCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrapper: {
    position: "relative",
  },
  kosImg: {
    width: "100%",
    height: 150,
    backgroundColor: "#F3F4F6",
  },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  typeBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  kosInfo: {
    padding: 14,
    gap: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kosName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  availableRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  availableText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "700",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addressText: {
    fontSize: 11,
    color: "#6B7280",
    flex: 1,
  },
  facilitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
    marginBottom: 10,
  },
  facilityBadge: {
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  facilityText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#4B5563",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
  },
  priceLabel: {
    fontSize: 9,
    color: "#6B7280",
  },
  priceVal: {
    fontSize: 15,
    fontWeight: "900",
    color: "#9333EA",
    marginTop: 2,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9333EA",
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 12,
    gap: 6,
  },
  chatBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
