export default {
  name: "Pet Tracker",
  slug: "pet-tracker",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#4F46E5",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.pettracker.app",
    infoPlist: {
      NSCameraUsageDescription: "We need to use the camera to scan QR codes",
      NSPhotoLibraryUsageDescription:
        "We need to access your photos to upload pet images",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#4F46E5",
    },
    package: "com.pettracker.app",
    permissions: ["CAMERA", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-image-picker",
    "expo-camera",
    "expo-barcode-scanner",
  ],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    disableAuth: process.env.EXPO_PUBLIC_DISABLE_AUTH === "true",
  },
};
