import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../Theme/colors";

// ============================================================================
// TOP-DOWN CAR SVG COMPONENT
// Realistic vector vehicle featuring front headlights, tinted windshields,
// panoramic glass roof, side mirrors, wheels, and taillights.
// ============================================================================
const CAR_WIDTH = wp(7.6);
const CAR_HEIGHT = wp(13.6);

const TopDownCar = () => {
  return (
    <View style={styles.carContainer}>
      <Svg
        width={CAR_WIDTH}
        height={CAR_HEIGHT}
        viewBox="0 0 34 58"
        fill="none"
      >
        <Defs>
          {/* Headlight beam gradient */}
          <SvgLinearGradient id="beamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#FEF08A" stopOpacity="0.55" />
            <Stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
          </SvgLinearGradient>

          {/* Car chassis gradient */}
          <SvgLinearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="50%" stopColor="#F3F4F6" />
            <Stop offset="100%" stopColor="#E5E7EB" />
          </SvgLinearGradient>

          {/* Glass / Windshield gradient */}
          <SvgLinearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1E293B" />
            <Stop offset="100%" stopColor="#0F172A" />
          </SvgLinearGradient>
        </Defs>

        {/* Forward Headlight Cones (shining onto the asphalt) */}
        <Path d="M 7 14 L -4 -4 L 13 -4 Z" fill="url(#beamGrad)" />
        <Path d="M 27 14 L 21 -4 L 38 -4 Z" fill="url(#beamGrad)" />

        {/* Ground Drop Shadow */}
        <Rect
          x="4"
          y="8"
          width="26"
          height="45"
          rx="9"
          fill="rgba(0, 0, 0, 0.35)"
        />

        {/* 4 Rubber Tires */}
        <Rect x="2" y="13" width="3" height="9" rx="1.5" fill="#111827" />
        <Rect x="29" y="13" width="3" height="9" rx="1.5" fill="#111827" />
        <Rect x="2" y="38" width="3" height="9" rx="1.5" fill="#111827" />
        <Rect x="29" y="38" width="3" height="9" rx="1.5" fill="#111827" />

        {/* Aerodynamic Car Body */}
        <Rect
          x="5"
          y="8"
          width="24"
          height="45"
          rx="8"
          fill="url(#carBodyGrad)"
          stroke="#D1D5DB"
          strokeWidth="0.8"
        />

        {/* Side Mirrors */}
        <Rect x="2.5" y="18" width="3.5" height="4" rx="1.2" fill="#FFFFFF" />
        <Rect x="28" y="18" width="3.5" height="4" rx="1.2" fill="#FFFFFF" />

        {/* Front Windshield */}
        <Path
          d="M 8 18 L 26 18 L 24 26 L 10 26 Z"
          fill="url(#glassGrad)"
        />

        {/* Panoramic Glass Roof */}
        <Rect
          x="10"
          y="27"
          width="14"
          height="12"
          rx="2"
          fill="#0F172A"
        />

        {/* Rear Windshield */}
        <Path
          d="M 10 40 L 24 40 L 25 45 L 9 45 Z"
          fill="url(#glassGrad)"
        />

        {/* Front LED Headlights */}
        <Rect x="7" y="8" width="4.5" height="2" rx="1" fill="#FACC15" />
        <Rect x="22.5" y="8" width="4.5" height="2" rx="1" fill="#FACC15" />

        {/* Rear Red Taillights */}
        <Rect x="7" y="50" width="4.5" height="2" rx="1" fill="#EF4444" />
        <Rect x="22.5" y="50" width="4.5" height="2" rx="1" fill="#EF4444" />
      </Svg>
    </View>
  );
};


const DESTINATIONS = [
  {
    id: "udaipur",
    name: "Udaipur",
    tagline: "City of Lakes",
    rating: "4.9",
    image: require("../../../assets/images/onboarding/udaipur.jpg"),
    side: "right",
    topPercent: 57.5,
    horizontalPercent: 6,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    tagline: "Pink City Forts",
    rating: "4.8",
    image: require("../../../assets/images/onboarding/jaipur.jpg"),
    side: "left",
    topPercent: 41.5,
    horizontalPercent: 6,
  },
  {
    id: "goa",
    name: "Goa",
    tagline: "Coastal Paradise",
    rating: "4.9",
    image: require("../../../assets/images/onboarding/goa.jpg"),
    side: "right",
    topPercent: 25.5,
    horizontalPercent: 6,
  },
  {
    id: "jaisalmer",
    name: "Jaisalmer",
    tagline: "Golden Desert",
    rating: "4.7",
    image: require("../../../assets/images/onboarding/jaisalmer.jpg"),
    side: "left",
    topPercent: 9.5,
    horizontalPercent: 6,
  },
];

// Number of sample points for high-fidelity car interpolation along curves
const NUM_PATH_SAMPLES = 80;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  // Screen responsive dimensions
  const screenW = wp(100);
  const screenH = hp(100);

  // --------------------------------------------------------------------------
  // ANIMATION REFS
  // --------------------------------------------------------------------------
  const roadAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(DESTINATIONS.map(() => new Animated.Value(0))).current;
  const carOpacity = useRef(new Animated.Value(0)).current;
  const carProgress = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  // --------------------------------------------------------------------------
  // ROAD GEOMETRY & CURVES (Responsive S-Shape Mountain Road)
  // --------------------------------------------------------------------------
  const { pathD, samples, summitPoint } = useMemo(() => {
    // 4 Cubic Bezier Segments weaving up the screen:
    // P0: bottom center-right
    // P1: curves left
    // P2: curves right
    // P3: curves left
    // P4: summit destination at top
    const segments = [
      {
        p0: { x: wp(52), y: hp(75) },
        c0: { x: wp(52), y: hp(67) },
        c1: { x: wp(34), y: hp(64) },
        p1: { x: wp(34), y: hp(57) },
      },
      {
        p0: { x: wp(34), y: hp(57) },
        c0: { x: wp(34), y: hp(49) },
        c1: { x: wp(66), y: hp(46) },
        p1: { x: wp(66), y: hp(39) },
      },
      {
        p0: { x: wp(66), y: hp(39) },
        c0: { x: wp(66), y: hp(31) },
        c1: { x: wp(34), y: hp(28) },
        p1: { x: wp(34), y: hp(22) },
      },
      {
        p0: { x: wp(34), y: hp(22) },
        c0: { x: wp(34), y: hp(15) },
        c1: { x: wp(52), y: hp(12) },
        p1: { x: wp(52), y: hp(6.5) },
      },
    ];

    // SVG Path description
    const d =
      `M ${segments[0].p0.x} ${segments[0].p0.y} ` +
      segments
        .map(
          (s) =>
            `C ${s.c0.x} ${s.c0.y}, ${s.c1.x} ${s.c1.y}, ${s.p1.x} ${s.p1.y}`
        )
        .join(" ");

    // Cubic Bezier evaluation
    const evaluateBezier = (p0, c0, c1, p1, t) => {
      const mt = 1 - t;
      const x =
        mt * mt * mt * p0.x +
        3 * mt * mt * t * c0.x +
        3 * mt * t * t * c1.x +
        t * t * t * p1.x;
      const y =
        mt * mt * mt * p0.y +
        3 * mt * mt * t * c0.y +
        3 * mt * t * t * c1.y +
        t * t * t * p1.y;
      return { x, y };
    };

    // Raw coordinates along the curve
    const rawCoords = [];
    for (let i = 0; i <= NUM_PATH_SAMPLES; i++) {
      const globalT = i / NUM_PATH_SAMPLES;
      const segIndex = Math.min(Math.floor(globalT * 4), 3);
      const localT = globalT * 4 - segIndex;
      const seg = segments[segIndex];
      rawCoords.push(
        evaluateBezier(seg.p0, seg.c0, seg.c1, seg.p1, localT)
      );
    }

    // Compute tangent angles using smoothed secant vector
    const pathSamples = [];
    for (let i = 0; i <= NUM_PATH_SAMPLES; i++) {
      const prev = rawCoords[Math.max(0, i - 1)];
      const next = rawCoords[Math.min(NUM_PATH_SAMPLES, i + 1)];
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      // Angle in degrees where 0deg points straight UP (-y direction)
      const angle = Math.atan2(dx, -dy) * (180 / Math.PI);
      pathSamples.push({
        t: i / NUM_PATH_SAMPLES,
        x: rawCoords[i].x,
        y: rawCoords[i].y,
        angle,
      });
    }

    return {
      pathD: d,
      samples: pathSamples,
      summitPoint: segments[3].p1,
    };
  }, [screenW, screenH]);

  // --------------------------------------------------------------------------
  // CAR INTERPOLATIONS (Follows the road curves + turns dynamically)
  // --------------------------------------------------------------------------
  const { carTranslateX, carTranslateY, carRotate } = useMemo(() => {
    const inputRange = samples.map((s) => s.t);
    const outputRangeX = samples.map((s) => s.x);
    const outputRangeY = samples.map((s) => s.y);
    const outputRangeRotate = samples.map((s) => `${s.angle.toFixed(1)}deg`);

    return {
      carTranslateX: carProgress.interpolate({
        inputRange,
        outputRange: outputRangeX,
      }),
      carTranslateY: carProgress.interpolate({
        inputRange,
        outputRange: outputRangeY,
      }),
      carRotate: carProgress.interpolate({
        inputRange,
        outputRange: outputRangeRotate,
      }),
    };
  }, [carProgress, samples]);

  // --------------------------------------------------------------------------
  // ANIMATION ORCHESTRATION SEQUENCE
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Step 1: Road Entrance (fades and rises into view)
    const entranceAnimation = Animated.sequence([
      Animated.timing(roadAnim, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // Step 2 & 3: Staggered Destination Cards + Travelling Car
      Animated.parallel([
        // Step 2: Destination Cards staggered reveal
        Animated.stagger(
          240,
          cardAnims.map((anim) =>
            Animated.spring(anim, {
              toValue: 1,
              friction: 7,
              tension: 40,
              useNativeDriver: true,
            })
          )
        ),

        // Step 3: Car emerges and travels along the winding road
        Animated.sequence([
          Animated.delay(350),
          Animated.parallel([
            Animated.timing(carOpacity, {
              toValue: 1,
              duration: 350,
              useNativeDriver: true,
            }),
            Animated.timing(carProgress, {
              toValue: 1,
              duration: 3800,
              easing: Easing.bezier(0.35, 0.05, 0.25, 1),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),

      // Step 4: Get Started action panel smoothly glides up
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 8,
        tension: 45,
        useNativeDriver: true,
      }),
    ]);

    entranceAnimation.start();

    // Clean up animation on unmount
    return () => {
      entranceAnimation.stop();
    };
  }, [roadAnim, cardAnims, carOpacity, carProgress, buttonAnim]);

  // --------------------------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------------------------
  const handleGetStarted = () => {
    // Navigate to existing Login / Authentication screen
    router.push("/Authentication/LoginScreen");
  };

  const handleSkip = () => {
    // Instant navigation for users who prefer skipping the intro
    router.push("/Authentication/LoginScreen");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Subtle Background Ambience */}
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={["#FFFFFF", "#FAFAFA", "#FFF7ED"]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>

      {/* ====================================================================
          WINDING ROAD SVG LAYER (Step 1)
          ==================================================================== */}
      <Animated.View
        style={[
          styles.roadContainer,
          {
            opacity: roadAnim,
            transform: [
              {
                translateY: roadAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [hp(5), 0],
                }),
              },
            ],
          },
        ]}
      >
        <Svg width={screenW} height={screenH} style={StyleSheet.absoluteFillObject}>
          {/* Layer 1: Road Ground Shadow */}
          <Path
            d={pathD}
            stroke="rgba(0, 0, 0, 0.06)"
            strokeWidth={wp(10.5)}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Layer 2: Road Curb / Outer Edge Bed */}
          <Path
            d={pathD}
            stroke="#374151"
            strokeWidth={wp(9.2)}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Layer 3: Realistic Dark Grey Asphalt Road Surface */}
          <Path
            d={pathD}
            stroke="#1F2428"
            strokeWidth={wp(8.4)}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Layer 4: Center Dashed Lane Markings */}
          <Path
            d={pathD}
            stroke={COLORS.white}
            strokeWidth={2.4}
            strokeDasharray="8, 9"
            strokeLinecap="round"
            strokeOpacity={0.9}
            fill="none"
          />

          {/* Road Start Marker Line (Bottom) */}
          <Circle
            cx={wp(52)}
            cy={hp(75)}
            r={wp(2.2)}
            fill={COLORS.primary}
            stroke={COLORS.white}
            strokeWidth={2}
          />

          {/* Summit Destination Goal Badge (Top) */}
          <Circle
            cx={summitPoint.x}
            cy={summitPoint.y}
            r={wp(3.4)}
            fill={COLORS.primary}
            stroke={COLORS.white}
            strokeWidth={2.5}
          />
        </Svg>
      </Animated.View>

      {/* ====================================================================
          DESTINATION CARDS (Step 2: Staggered Alternating Cards)
          ==================================================================== */}
      {DESTINATIONS.map((dest, index) => {
        const anim = cardAnims[index];
        const isLeft = dest.side === "left";

        const cardSlide = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [isLeft ? -wp(8) : wp(8), 0],
        });

        const cardScale = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.82, 1],
        });

        return (
          <Animated.View
            key={dest.id}
            style={[
              styles.destinationCard,
              {
                top: hp(dest.topPercent),
                [isLeft ? "left" : "right"]: wp(dest.horizontalPercent),
                opacity: anim,
                transform: [{ translateX: cardSlide }, { scale: cardScale }],
              },
            ]}
          >
            {/* Scenic Destination Photography */}
            <Image
              source={dest.image}
              style={styles.cardImage}
              resizeMode="cover"
            />

            {/* Dark Vignette Overlay for Text Legibility */}
            <LinearGradient
              colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.82)"]}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Glassmorphic Rating Chip */}
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={wp(2.6)} color="#FBBF24" />
              <Text style={styles.ratingText}>{dest.rating}</Text>
            </View>

            {/* Destination Name & Category */}
            <View style={styles.cardContent}>
              <View style={styles.cardTitleRow}>
                <Ionicons
                  name="location-sharp"
                  size={wp(3.2)}
                  color={COLORS.primaryLight}
                  style={styles.locationPin}
                />
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {dest.name}
                </Text>
              </View>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {dest.tagline}
              </Text>
            </View>
          </Animated.View>
        );
      })}

      {/* ====================================================================
          TRAVELLING CAR (Step 3: Follows S-Curves + Heading Rotation)
          ==================================================================== */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.carWrapper,
          {
            opacity: carOpacity,
            transform: [
              { translateX: carTranslateX },
              { translateY: carTranslateY },
              { rotate: carRotate },
            ],
          },
        ]}
      >
        <TopDownCar />
      </Animated.View>

      {/* ====================================================================
          TOP NAVIGATION HEADER (Branding & Skip Button)
          ==================================================================== */}
      <View style={[styles.headerContainer, { top: Math.max(insets.top, hp(2)) + hp(0.5) }]}>
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Ionicons name="compass" size={wp(4.2)} color={COLORS.primary} />
          </View>
          <Text style={styles.brandTitle}>Tripnest</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.skipButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={handleSkip}
          hitSlop={12}
        >
          <Text style={styles.skipText}>Skip</Text>
          <Ionicons name="chevron-forward" size={wp(3.4)} color={COLORS.secondaryText} />
        </Pressable>
      </View>

      {/* ====================================================================
          BOTTOM ACTION PANEL (Step 4: Get Started Reveal)
          ==================================================================== */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            paddingBottom: Math.max(insets.bottom, hp(2)) + hp(1.2),
            opacity: buttonAnim,
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [hp(14), 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Subtle pill tag */}
        <View style={styles.pillTag}>
          <Ionicons name="sparkles" size={wp(3)} color={COLORS.primary} />
          <Text style={styles.pillTagText}>START YOUR ADVENTURE</Text>
        </View>

        {/* Heading & Subtitle */}
        <Text style={styles.mainTitle}>Your Journey Begins Here</Text>
        <Text style={styles.mainSubtitle}>
          Discover hidden gems, explore amazing places, and make every journey unforgettable.
        </Text>

        {/* Get Started Button */}
        <Pressable
          style={({ pressed }) => [
            styles.getStartedButton,
            pressed && styles.getStartedButtonPressed,
          ]}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <View style={styles.buttonIconCircle}>
            <Ionicons name="arrow-forward" size={wp(4.2)} color={COLORS.primary} />
          </View>
        </Pressable>

        {/* Secondary Login Option */}
        <View style={styles.loginRow}>
          <Text style={styles.loginPromptText}>Already have an account? </Text>
          <Pressable onPress={() => router.push("/Authentication/LoginScreen")}>
            <Text style={styles.loginLinkText}>Log In</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

// ============================================================================
// STYLESHEET
// Responsive layout leveraging wp() and hp() throughout
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Road SVG Container
  roadContainer: {
    ...StyleSheet.absoluteFillObject,
  },

  // Car wrapper positioned and centered on the road
  carWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    width: CAR_WIDTH,
    height: CAR_HEIGHT,
    marginLeft: -CAR_WIDTH / 2,
    marginTop: -CAR_HEIGHT / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  carContainer: {
    width: CAR_WIDTH,
    height: CAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  // Header Bar
  headerContainer: {
    position: "absolute",
    left: wp(5.5),
    right: wp(5.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandBadge: {
    width: wp(8.2),
    height: wp(8.2),
    borderRadius: wp(4.1),
    backgroundColor: "rgba(255, 107, 0, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2.2),
  },
  brandTitle: {
    fontSize: wp(4.8),
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingHorizontal: wp(3.2),
    paddingVertical: hp(0.7),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skipText: {
    fontSize: wp(3.3),
    fontWeight: "600",
    color: COLORS.secondaryText,
    marginRight: wp(0.5),
  },

  // Destination Image Cards
  destinationCard: {
    position: "absolute",
    width: wp(34),
    height: hp(11.2),
    borderRadius: wp(3.8),
    overflow: "hidden",
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
    // Subtle premium shadow
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  ratingBadge: {
    position: "absolute",
    top: hp(0.8),
    right: wp(2),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    paddingHorizontal: wp(1.8),
    paddingVertical: hp(0.3),
    borderRadius: wp(2),
  },
  ratingText: {
    fontSize: wp(2.6),
    fontWeight: "700",
    color: COLORS.white,
    marginLeft: wp(0.8),
  },
  cardContent: {
    position: "absolute",
    bottom: hp(0.8),
    left: wp(2.2),
    right: wp(2.2),
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationPin: {
    marginRight: wp(0.8),
  },
  cardTitle: {
    fontSize: wp(3.2),
    fontWeight: "700",
    color: COLORS.white,
    flexShrink: 1,
  },
  cardSubtitle: {
    fontSize: wp(2.4),
    fontWeight: "500",
    color: "#E5E7EB",
    marginTop: hp(0.2),
  },

  // Bottom Action Sheet
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: wp(7.5),
    borderTopRightRadius: wp(7.5),
    paddingTop: hp(2.6),
    paddingHorizontal: wp(6.5),
    borderTopWidth: 1,
    borderTopColor: "rgba(229, 231, 235, 0.6)",
    // Premium soft card shadow
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  pillTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 107, 0, 0.1)",
    paddingHorizontal: wp(2.8),
    paddingVertical: hp(0.4),
    borderRadius: wp(3),
    marginBottom: hp(1.1),
  },
  pillTagText: {
    fontSize: wp(2.7),
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: wp(1.2),
    letterSpacing: 0.6,
  },
  mainTitle: {
    fontSize: wp(6.4),
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.4,
  },
  mainSubtitle: {
    fontSize: wp(3.4),
    color: COLORS.secondaryText,
    lineHeight: hp(2.3),
    marginTop: hp(0.7),
    marginBottom: hp(2.4),
  },

  // Get Started Button
  getStartedButton: {
    height: hp(6.6),
    backgroundColor: COLORS.primary,
    borderRadius: wp(3.6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(5),
    // Button glow shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  getStartedButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  getStartedText: {
    fontSize: wp(4.2),
    fontWeight: "700",
    color: COLORS.white,
    marginRight: wp(2.5),
    letterSpacing: 0.2,
  },
  buttonIconCircle: {
    width: wp(6.8),
    height: wp(6.8),
    borderRadius: wp(3.4),
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  // Secondary Login Link
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(1.8),
  },
  loginPromptText: {
    fontSize: wp(3.3),
    color: COLORS.secondaryText,
  },
  loginLinkText: {
    fontSize: wp(3.3),
    fontWeight: "700",
    color: COLORS.primary,
  },
});