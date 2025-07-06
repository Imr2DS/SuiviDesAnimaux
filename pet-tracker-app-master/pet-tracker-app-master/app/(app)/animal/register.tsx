import { MaterialCommunityIcons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { Stack, XStack } from "tamagui";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function RegisterAnimalScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    race: "",
    gender: "male",
    birthdate: "",
    image: "",
    nfc: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fonction pour récupérer le dernier NFC non utilisé
  const checkLatestNfc = async () => {
    if (!user?.id) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      return;
    }

    setError(null);

    try {
      console.log("Vérification NFC pour user_id:", user.id);

      const { data, error } = await supabase
        .from("nfc_buffer")
        .select("nfc_id")
        .eq("user_id", user.id)
        .eq("is_used", false)
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Erreur Supabase:", error);
        Alert.alert("Erreur", error.message);
        return;
      }

      console.log("Données NFC récupérées:", data);

      if (data && data.nfc_id) {
        setFormData((prev) => ({ ...prev, nfc: data.nfc_id }));
        Alert.alert("NFC détecté", `Contenu : ${data.nfc_id}`);
      } else {
        Alert.alert("NFC non trouvé", "Aucun NFC non utilisé trouvé.");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération NFC:", err);
      Alert.alert("Erreur", "Impossible de récupérer le NFC.");
    }
  };




  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") throw new Error("Permission refusée");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      setUploading(true);
      const image = result.assets[0];
      if (!image.base64) throw new Error("Image invalide");

      const filePath = `${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("animal-images")
        .upload(filePath, decode(image.base64), {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("animal-images").getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, image: data.publicUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur image");
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.nfc) {
      setError("Le NFC est requis (scanner la carte)");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Insertion dans la table animals
      const { error: insertError } = await supabase.from("animals").insert({
        name: formData.name,
        race: formData.race,
        gender: formData.gender,
        birthdate: formData.birthdate,
        image:
          formData.image ||
          "https://api.dicebear.com/7.x/shapes/svg?seed=" + formData.name,
        owner_id: user?.id,
        nfc_id: formData.nfc,
      });

      if (insertError) throw insertError;

      // 2. Mettre à jour la ligne correspondante dans nfc_buffer
      const { error: updateError } = await supabase
        .from("nfc_buffer")
        .update({ is_used: true })
        .eq("nfc_id", formData.nfc)
        .eq("user_id", user?.id);

      if (updateError) throw updateError;

      Alert.alert("Succès", "Animal enregistré !");
      router.replace("/(app)");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };


  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        birthdate: selectedDate.toISOString(),
      }));
    }
  };

  const handleNfcScan = () => {
    if (!user?.id) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      return;
    }

    Linking.openURL(`nfcreaderapp://scan?user_id=${user.id}`).catch(() => {
      Alert.alert(
        "Erreur",
        "Impossible d'ouvrir l'application NFC. Vérifie qu'elle est installée."
      );
    });
  };

  return (
    <ScrollView>
      <Stack padding="$4" backgroundColor="$background">
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 24,
            color: theme.colors.text.DEFAULT,
          }}
        >
          Enregistrer un animal
        </Text>

        <Stack space="$4">
          <Stack alignItems="center" marginBottom="$4">
            <Image
              source={{
                uri:
                  formData.image ||
                  "https://api.dicebear.com/7.x/shapes/svg?seed=" + formData.name,
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: theme.colors.background.dark,
                marginBottom: 16,
              }}
            />
            <Button
              variant="outline"
              onPress={handleImageUpload}
              loading={uploading}
            >
              <XStack space="$2" alignItems="center">
                <MaterialCommunityIcons
                  name="camera-plus"
                  size={20}
                  color={theme.colors.primary.DEFAULT}
                />
                <Text style={{ color: theme.colors.primary.DEFAULT }}>
                  {uploading ? "Téléchargement..." : "Ajouter une photo"}
                </Text>
              </XStack>
            </Button>
          </Stack>

          <Input
            label="Nom"
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
          />

          <Stack>
            <Text style={{ marginBottom: 4, color: theme.colors.text.DEFAULT }}>
              Genre
            </Text>
            <XStack space="$2">
              <Stack flex={1}>
                <Button
                  variant={formData.gender === "male" ? "primary" : "outline"}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, gender: "male" }))
                  }
                >
                  Mâle
                </Button>
              </Stack>
              <Stack flex={1}>
                <Button
                  variant={formData.gender === "female" ? "primary" : "outline"}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, gender: "female" }))
                  }
                >
                  Femelle
                </Button>
              </Stack>
            </XStack>
          </Stack>

          <Input
            label="Race"
            value={formData.race}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, race: text }))
            }
          />

          <Stack>
            <Text style={{ marginBottom: 4, color: theme.colors.text.DEFAULT }}>
              Date de naissance
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 15,
                borderWidth: 1,
                borderColor: theme.colors.text.light,
              }}
            >
              <Text style={{ color: theme.colors.text.DEFAULT }}>
                {formData.birthdate
                  ? format(new Date(formData.birthdate), "dd/MM/yyyy", {
                      locale: fr,
                    })
                  : "JJ/MM/AAAA"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={
                  formData.birthdate ? new Date(formData.birthdate) : new Date()
                }
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </Stack>

          <Button onPress={handleNfcScan} variant="outline">
            <XStack alignItems="center" justifyContent="center" space="$2">
              <MaterialCommunityIcons
                name="cellphone-nfc"
                size={18}
                color={theme.colors.primary.DEFAULT}
              />
              <Text style={{ color: theme.colors.primary.DEFAULT }}>
                Scanner NFC
              </Text>
            </XStack>
          </Button>

          <Button onPress={checkLatestNfc} variant="outline">
            <Text style={{ color: theme.colors.primary.DEFAULT }}>
              Vérifier NFC
            </Text>
          </Button>

          {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

          <Button
            onPress={handleRegister}
            loading={loading}
            fullWidth
            style={{ marginTop: 16 }}
          >
            Enregistrer
          </Button>
        </Stack>
      </Stack>
    </ScrollView>
  );
}
