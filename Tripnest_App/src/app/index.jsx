import React from "react";
import { useRouter } from "expo-router";
import SplashScreen from "../components/SplashScreen";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const router = useRouter();
  const { checkAuthStatus } = useAuth();

  const handleFinish = async () => {
    try {
      const authState = await checkAuthStatus();

      // Rule 1: Authenticated (valid access token or newly generated access token via refresh token) -> Go to Home Screen
      if (authState.isAuthenticated) {
        router.replace("/(tabs)");
        return;
      }

      // Rule 2: Unauthenticated
      // Welcome Screen is ONLY shown first time to a new user / new device (hasSeenWelcome = false)
      if (authState.hasSeenWelcome) {
        // User has seen welcome screen before on this device -> Go directly to Login Screen
        router.replace("/Auth/LoginScreen");
      } else {
        // New user or new device -> Show Welcome Screen
        router.replace("/Auth/WelcomeScreen");
      }
    } catch (error) {
      console.error("Splash Screen auth check error:", error);
      router.replace("/Auth/LoginScreen");
    }
  };

  return <SplashScreen onFinish={handleFinish} />;
}
