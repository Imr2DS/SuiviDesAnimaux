import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { supabase } from "../../../../lib/supabase";
import { Stack, XStack } from "tamagui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../../contexts/AuthContext";
import { theme } from "../../../../constants/theme";

export default function SearchScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [scannedNfc, setScannedNfc] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animals, setAnimals] = useState<any[]>([]);

  useEffect(() => {
    const handleUrl = (event: { url: string }) => {
      try {
        const url = event.url;
        const match = url.match(/nfc_id=([^&]+)/);
        if (match && match[1]) {
          setScannedNfc(match[1]);
          Alert.alert("NFC scanné", `ID NFC: ${match[1]}`);
        }
      } catch {}
    };

    const subscription = Linking.addEventListener("url", handleUrl);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const searchByNfc = useCallback(async () => {
    if (!user?.id) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      return;
    }

    setLoading(true);
    setError(null);
    setAnimals([]);

    try {
      const { data: nfcBuffer } = await supabase
        .from("nfc_buffer")
        .select("nfc_id")
        .eq("user_id", user.id)
        .eq("is_used", false)
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!nfcBuffer || !nfcBuffer.nfc_id) {
        setError("Aucun tag NFC non utilisé trouvé.");
        return;
      }

      setScannedNfc(nfcBuffer.nfc_id);

      const { data: animal } = await supabase
        .from("animals")
        .select("*")
        .eq("nfc_id", nfcBuffer.nfc_id)
        .maybeSingle();

      if (!animal) {
        setError("Aucun animal trouvé avec ce tag NFC.");
        return;
      }

      setAnimals([animal]);
    } catch (err) {
      setError("Erreur lors de la recherche via NFC.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleScanNfc = () => {
    if (!user?.id) {
      Alert.alert("Erreur", "Utilisateur non connecté");
      return;
    }
    Linking.openURL(`nfcreaderapp://scan?user_id=${user.id}`).catch(() => {
      Alert.alert("Erreur", "Impossible d'ouvrir l'application NFC.");
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Erreur", "Champ de recherche vide");
      return;
    }

    setLoading(true);
    setError(null);
    setAnimals([]);

    try {
      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .or(`name.ilike.%${searchQuery}%,race.ilike.%${searchQuery}%`)
        .order("name");

      if (error || !data || data.length === 0) {
        setError("Aucun animal trouvé");
        return;
      }

      setAnimals(data);
    } catch {
      setError("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
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
          Rechercher un animal
        </Text>

        <Stack space="$4">
          <Button onPress={handleScanNfc} variant="outline">
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

          <Button onPress={searchByNfc} variant="outline">
            <XStack alignItems="center" justifyContent="center" space="$2">
              <MaterialCommunityIcons
                name="magnify"
                size={18}
                color={theme.colors.primary.DEFAULT}
              />
              <Text style={{ color: theme.colors.primary.DEFAULT }}>
                Rechercher l'animal scanné
              </Text>
            </XStack>
          </Button>

          <Input
            label="Recherche texte"
            placeholder="Nom ou race"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />

          <Button onPress={handleSearch} variant="primary">
            <XStack space="$2" alignItems="center" justifyContent="center">
              <MaterialCommunityIcons name="magnify" size={24} color="white" />
              <Text style={{ color: "white", fontSize: 16 }}>Rechercher</Text>
            </XStack>
          </Button>

          {loading && <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />}

          {error && (
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          )}

          {animals.length > 0 && (
            <Stack>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 16,
                  color: theme.colors.text.DEFAULT,
                }}
              >
                Résultats ({animals.length})
              </Text>
              {animals.map((animal) => (
                <Stack
                  key={animal.id}
                  backgroundColor="$background"
                  padding="$4"
                  borderRadius="$4"
                  marginBottom="$4"
                  shadowColor="$shadow"
                  shadowOffset={{ width: 0, height: 1 }}
                  shadowOpacity={0.1}
                  shadowRadius={2}
                >
                  <Button
                    onPress={() =>
                      router.push({
                        pathname: "/animal/[id]",
                        params: { id: animal.id },
                      })
                    }
                    variant="ghost"
                  >
                    <XStack space="$4" alignItems="center">
                      <Image
                        source={{ uri: animal.image }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          backgroundColor: theme.colors.background.dark,
                        }}
                      />
                      <Stack flex={1}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: theme.colors.text.DEFAULT,
                          }}
                        >
                          {animal.name}
                        </Text>
                        <Text style={{ color: theme.colors.text.light }}>
                          {animal.race} • {animal.gender === "male" ? "Mâle" : "Femelle"}
                        </Text>
                      </Stack>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={theme.colors.text.light}
                      />
                    </XStack>
                  </Button>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </ScrollView>
  );
}
