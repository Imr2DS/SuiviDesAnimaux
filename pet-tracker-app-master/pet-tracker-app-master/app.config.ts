import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Pet Tracker",
  slug: "pet-tracker-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#4F46E5",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.pettracker",
    infoPlist: {
      NFCReaderUsageDescription:
        "Cette application utilise le NFC pour scanner les puces d'identification des animaux.",
      NSCameraUsageDescription:
        "Cette application utilise la caméra pour scanner les cartes d'identité.",
      NSPhotoLibraryUsageDescription:
        "Cette application utilise la galerie pour accéder aux photos des animaux.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#4F46E5",
    },
    package: "com.yourcompany.pettracker",
    permissions: [
      "NFC",
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
    ],
  },
  web: {
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-camera",
    "expo-image-picker",
    "expo-localization",
  ],
  scheme: "pettracker",
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    disableAuth: process.env.EXPO_PUBLIC_DISABLE_AUTH === "true",
  },
});
