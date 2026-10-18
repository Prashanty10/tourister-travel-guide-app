import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  ActivityIndicator,
} from "react-native";

import { router } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  // Logo starts above its final position
  const translateY = useRef(new Animated.Value(-hp("100%"))).current;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer;

    const animation = Animated.spring(translateY, {
      toValue: 0,
      tension: 30,
      friction: 7,
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished) {
        setIsLoading(true);

        timer = setTimeout(() => {
          router.replace("/Authentication/LoginScreen");
        }, 2500);
      }
    });

    return () => {
      animation.stop();

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [translateY]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Centered logo */}
      <View style={styles.content}>
        <Animated.Image
          source={require("../../assets/images/logo.png")}
          style={[
            styles.logo,
            {
              transform: [{ translateY }],
            },
          ]}
          resizeMode="contain"
        />

        {/* Loading section */}
        <View style={styles.loadingContainer}>
          {isLoading && (
            <>
              <Text style={styles.loadingText}>Loading...</Text>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("8%"),
  },

  logo: {
    width: wp("29%"),
    height: wp("29%"),
    maxWidth: 180,
    maxHeight: 180,
  },

  loadingContainer: {
    minHeight: hp("5%"),
    marginTop: hp("2%"),
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  loadingText: {
    color: "#2F2F2F",
    fontSize: wp("3.5%"),
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});
