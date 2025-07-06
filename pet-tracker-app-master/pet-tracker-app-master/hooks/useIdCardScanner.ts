import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";

type IdCardData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  idNumber: string;
};

export function useIdCardScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScanning = useCallback(async () => {
    try {
      setError(null);
      setIsScanning(true);

      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        throw new Error(
          "L'accès à la caméra est nécessaire pour scanner les documents"
        );
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1.586, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        throw new Error("Échec du scan");
      }

      // Mock ID card data for development
      return {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        idNumber: "123456789",
      } as IdCardData;
    } catch (err) {
      console.error("Error scanning ID card:", err);
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
      return null;
    } finally {
      setIsScanning(false);
    }
  }, []);

  return {
    isScanning,
    error,
    startScanning,
  };
}
