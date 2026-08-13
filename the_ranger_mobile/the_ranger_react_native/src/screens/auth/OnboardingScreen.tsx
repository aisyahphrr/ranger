import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { ShoppingBag, Utensils, Shirt, Home, TrendingUp, Star, MapPin, Award, ShieldCheck } from "lucide-react-native";
import { Nav } from "../../types";

const { width } = Dimensions.get("window");

// Custom Slide Illustrations
const Slide1Illustration = () => {
  return (
    <View style={illStyles.container}>
      <View style={[illStyles.bgCircle, { backgroundColor: "#ECFDF5" }]} />
      
      {/* Floating UMKM Product Card */}
      <View style={illStyles.card}>
        <View style={illStyles.cardImageContainer}>
          <ShoppingBag size={42} color="#10B981" strokeWidth={1.5} />
          <View style={illStyles.badge}>
            <Award size={10} color="#FFFFFF" />
            <Text style={illStyles.badgeText}>UMKM Pilihan</Text>
          </View>
        </View>
        
        <View style={illStyles.cardBody}>
          <Text style={illStyles.cardTitle}>Madu Hutan Kamojang</Text>
          <Text style={illStyles.cardSubtitle}>Murni & Organik • Ring 1</Text>
          
          <View style={illStyles.cardFooter}>
            <Text style={illStyles.cardPrice}>Rp 65.000</Text>
            <View style={illStyles.ratingRow}>
              <Star size={10} color="#FBBF24" fill="#FBBF24" />
              <Text style={illStyles.ratingText}>4.9 (42)</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Floating Info Badge */}
      <View style={[illStyles.miniCard, { top: 20, right: 15 }]}>
        <ShieldCheck size={14} color="#059669" />
        <Text style={illStyles.miniCardText}>100% Asli</Text>
      </View>
    </View>
  );
};

const Slide2Illustration = () => {
  return (
    <View style={illStyles.container}>
      <View style={[illStyles.bgCircle, { backgroundColor: "#F5F3FF" }]} />
      
      {/* Phone Mockup */}
      <View style={illStyles.phoneMockup}>
        <View style={illStyles.phoneScreen}>
          <View style={illStyles.phoneHomeIndicator} />
          <View style={illStyles.phoneHeader} />
          <View style={illStyles.phoneGrid}>
            <View style={illStyles.phoneGridItem} />
            <View style={illStyles.phoneGridItem} />
          </View>
        </View>
      </View>

      {/* Floating Services */}
      <View style={[illStyles.serviceBubble, { top: 20, left: 15, backgroundColor: "#E6F4EA" }]}>
        <ShoppingBag size={20} color="#137333" />
        <Text style={illStyles.serviceLabel}>Pasar</Text>
      </View>

      <View style={[illStyles.serviceBubble, { top: 20, right: 15, backgroundColor: "#FCE8E6" }]}>
        <Utensils size={20} color="#C5221F" />
        <Text style={illStyles.serviceLabel}>Katering</Text>
      </View>

      <View style={[illStyles.serviceBubble, { bottom: 20, left: 15, backgroundColor: "#E8F0FE" }]}>
        <Shirt size={20} color="#1A73E8" />
        <Text style={illStyles.serviceLabel}>Laundry</Text>
      </View>

      <View style={[illStyles.serviceBubble, { bottom: 20, right: 15, backgroundColor: "#FEF7E0" }]}>
        <Home size={20} color="#B06000" />
        <Text style={illStyles.serviceLabel}>Kos</Text>
      </View>
    </View>
  );
};

const Slide3Illustration = () => {
  return (
    <View style={illStyles.container}>
      <View style={[illStyles.bgCircle, { backgroundColor: "#FEF3C7" }]} />
      
      {/* Mini Active Route Card */}
      <View style={[illStyles.card, { width: 190, height: 160, padding: 10 }]}>
        <Text style={illStyles.mapHeader}>Rute: Kamojang - Cihawuk</Text>
        
        <View style={illStyles.mapCanvas}>
          <Svg width="100%" height="80">
            {/* Road Path */}
            <Path 
              d="M 15,60 C 35,20, 75,70, 110,30 C 130,10, 150,20, 170,10" 
              fill="none" 
              stroke="#E5E7EB" 
              strokeWidth={6} 
              strokeLinecap="round" 
            />
            {/* Active route */}
            <Path 
              d="M 15,60 C 35,20, 75,70, 110,30" 
              fill="none" 
              stroke="#10B981" 
              strokeWidth={3} 
              strokeLinecap="round" 
            />
            <Circle cx={15} cy={60} r={4} fill="#3B82F6" />
            <Circle cx={110} cy={30} r={6} fill="#10B981" />
            <Circle cx={110} cy={30} r={2} fill="#FFFFFF" />
            <Circle cx={170} cy={10} r={4} fill="#EF4444" />
          </Svg>
        </View>

        <View style={illStyles.mapFooter}>
          <MapPin size={10} color="#EF4444" />
          <Text style={illStyles.mapFooterText}>Estimasi: 8 menit</Text>
        </View>
      </View>

      {/* Driver Earning Info */}
      <View style={[illStyles.miniCard, { bottom: 20, right: 10, flexDirection: "column", alignItems: "flex-start", gap: 2 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <TrendingUp size={14} color="#059669" />
          <Text style={illStyles.miniCardText}>Dompet Ranger</Text>
        </View>
        <Text style={illStyles.earningsText}>Rp 185.000</Text>
      </View>
    </View>
  );
};

const SLIDES = [
  {
    title: "Belanja Lokal,\nDukung UMKM",
    desc: "Temukan produk UMKM terbaik dari komunitas Ring 1–3 Kamojang. Kualitas lokal, harga bersahabat.",
    renderIllustration: () => <Slide1Illustration />,
  },
  {
    title: "Semua Layanan\ndi Satu Tempat",
    desc: "Marketplace, catering, laundry, dan kos tersedia dalam satu aplikasi. Praktis dan mudah!",
    renderIllustration: () => <Slide2Illustration />,
  },
  {
    title: "Bergabung &\nBerpenghasilan",
    desc: "Daftar sebagai driver Rangers dan mulai berpenghasilan dari komunitas Anda sendiri.",
    renderIllustration: () => <Slide3Illustration />,
  },
];

export const OnboardingScreen: React.FC<Nav> = ({ navigate }) => {
  const [slide, setSlide] = useState(0);
  const currentSlide = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipRow}>
        {!isLast ? (
          <TouchableOpacity onPress={() => navigate("login")} activeOpacity={0.7}>
            <Text style={styles.skipText}>Lewati</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 20 }} />
        )}
      </View>

      <View style={styles.content}>
        {currentSlide.renderIllustration()}
        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.desc}>{currentSlide.desc}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === slide ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => (isLast ? navigate("login") : setSlide(slide + 1))}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isLast ? "Mulai Sekarang" : "Lanjut"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styling for Illustrations
const illStyles = StyleSheet.create({
  container: {
    width: width * 0.85,
    height: width * 0.65,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  bgCircle: {
    position: "absolute",
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    opacity: 0.8,
  },
  card: {
    width: 170,
    height: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    elevation: 8,
    shadowColor: "#1B7A4E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#EAF2EE",
  },
  cardImageContainer: {
    height: 105,
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  badge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#10B981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "700",
  },
  cardBody: {
    marginTop: 8,
    paddingHorizontal: 2,
    gap: 2,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1B7A4E",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 9,
    color: "#4B5563",
    fontWeight: "600",
  },
  miniCard: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  miniCardText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#374151",
  },
  earningsText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
  },
  phoneMockup: {
    width: 80,
    height: 150,
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 3,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    padding: 5,
    justifyContent: "space-between",
  },
  phoneHeader: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    width: "50%",
    alignSelf: "center",
    marginTop: 2,
  },
  phoneGrid: {
    flex: 1,
    marginTop: 10,
    gap: 4,
  },
  phoneGridItem: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  phoneHomeIndicator: {
    position: "absolute",
    bottom: 3,
    width: 24,
    height: 2,
    backgroundColor: "#E5E7EB",
    borderRadius: 1,
    alignSelf: "center",
  },
  serviceBubble: {
    position: "absolute",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    gap: 3,
    width: 70,
  },
  serviceLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#374151",
  },
  mapHeader: {
    fontSize: 9,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 4,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    overflow: "hidden",
  },
  mapFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  mapFooterText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#4B5563",
  },
});

// Styling for Main Onboarding Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  skipRow: {
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 16,
    height: 40,
  },
  skipText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 34,
  },
  desc: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    gap: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: "#1B7A4E",
  },
  dotInactive: {
    width: 8,
    backgroundColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "#1B7A4E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#1B7A4E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
