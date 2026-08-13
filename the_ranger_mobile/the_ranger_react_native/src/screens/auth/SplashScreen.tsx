import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Nav } from "../../types";

const { width } = Dimensions.get("window");

export const SplashScreen: React.FC<Nav> = ({ navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("onboarding");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <View style={styles.logoWrapper}>
        <View style={styles.logoContainer}>
          <Svg width={72} height={72} viewBox="0 0 100 100">
            {/* Soft mint green background circle */}
            <Circle cx="50" cy="50" r="44" fill="#EAF7F0" />
            
            {/* Top Red triangle/pointer */}
            <Path 
              d="M50 18 L60 30 H40 Z" 
              fill="#E1261C" 
            />
            
            {/* Upper green arch (outstretched wings/shelter) */}
            <Path 
              d="M26 50 C26 34, 74 34, 74 50 C66 42, 34 42, 26 50 Z" 
              fill="#10B981" 
            />
            
            {/* Head circle */}
            <Circle cx="50" cy="53" r="8" fill="#111827" />
            
            {/* Lower green arch (base support) */}
            <Path 
              d="M32 60 C40 52, 60 52, 68 60 C60 56, 40 56, 32 60 Z" 
              fill="#059669" 
            />
          </Svg>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Rangers App</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2.0</Text>
            </View>
            <Text style={styles.subtitle}>by PGE Kamojang</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.tagline}>Untuk Komunitas, Dari Komunitas</Text>
        
        {/* Loading Dots */}
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B7A4E",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 24,
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    top: -width * 0.4,
    right: -width * 0.4,
  },
  bgCircle2: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    bottom: -width * 0.2,
    left: -width * 0.3,
  },
  bgCircle3: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    left: -100,
    top: "30%",
  },
  logoWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  logoContainer: {
    width: 108,
    height: 108,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  subtitle: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "600",
  },
  footerContainer: {
    alignItems: "center",
    width: "100%",
    gap: 32,
  },
  tagline: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dotActive: {
    backgroundColor: "#FFFFFF",
    transform: [{ scale: 1.2 }],
  },
});
