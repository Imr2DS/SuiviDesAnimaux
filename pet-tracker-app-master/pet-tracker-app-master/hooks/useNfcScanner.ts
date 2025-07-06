import { useEffect, useState } from "react";

// Mock NFC tag data for development
const MOCK_NFC_TAG = {
  id: "mock-nfc-id-123",
  type: "mock-type",
  techList: ["mock-tech"],
};

export function useNfcScanner() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkNfcSupport();
  }, []);

  const checkNfcSupport = async () => {
    try {
      // In Expo Go, we'll always return false for NFC support
      setIsSupported(false);
      setIsEnabled(false);
    } catch (err) {
      console.error("Error checking NFC support:", err);
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    }
  };

  const startScanning = async () => {
    try {
      // In Expo Go, return mock data
      console.log("Using mock NFC data in Expo Go");
      return MOCK_NFC_TAG;
    } catch (err) {
      console.error("Error scanning NFC:", err);
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
      return null;
    }
  };

  return {
    isSupported,
    isEnabled,
    error,
    startScanning,
  };
}
