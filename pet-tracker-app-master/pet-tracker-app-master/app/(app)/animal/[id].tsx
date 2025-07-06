import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Platform, Text, TouchableOpacity } from "react-native";
import { ScrollView, Stack, XStack } from "tamagui";
import { Button } from "../../../components/Button";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import type { Database } from "../../../lib/supabase";
import { supabase } from "../../../lib/supabase";

type Animal = Database["public"]["Tables"]["animals"]["Row"];

export default function AnimalDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Animal>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchAnimal();
  }, [id]);

  const fetchAnimal = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setAnimal(data);
    } catch (err) {
      console.error("Error fetching animal:", err);
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cet animal ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setError(null);
              const { error } = await supabase
                .from("animals")
                .delete()
                .eq("id", id);

              if (error) throw error;
              router.replace("/(app)");
            } catch (err) {
              console.error("Error deleting animal:", err);
              setError(
                err instanceof Error
                  ? err.message
                  : "Une erreur inconnue est survenue"
              );
            }
          },
        },
      ]
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, birthdate: selectedDate.toISOString() });
    }
  };

  if (loading) {
    return (
      <Stack flex={1} justifyContent="center" alignItems="center">
        <Text style={{ color: theme.colors.text.light }}>Chargement...</Text>
      </Stack>
    );
  }

  if (!animal) {
    return (
      <Stack flex={1} justifyContent="center" alignItems="center">
        <Text style={{ color: theme.colors.text.light }}>
          Animal non trouvé
        </Text>
      </Stack>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background.DEFAULT,
      }}
    >
      <Stack padding="$4" space="$4">
        <Stack space="$4">
          <Image
            source={{
              uri:
                animal.image ||
                "https://api.dicebear.com/7.x/shapes/svg?seed=" + animal.name,
            }}
            style={{
              width: 250,
              height: 250,
              borderRadius: 125,
              backgroundColor: theme.colors.background.dark,
              alignSelf: "center",
            }}
          />


          <Stack space="$4" padding="$2">
            <Stack space="$2">
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: theme.colors.text.DEFAULT,
                }}
              >
                {animal.name}
              </Text>

              <XStack space="$4" alignItems="center">
                <Stack
                  backgroundColor={
                    animal.gender === "male" ? "#0011ff" : "#f28cd9"
                  }
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                  borderRadius="$4"
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {animal.gender === "male" ? "Mâle" : "Femelle"}
                  </Text>
                </Stack>
              </XStack>

              <Stack marginTop="$4">
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: theme.colors.text.DEFAULT,
                    marginBottom: 5,
                  }}
                >
                  Race :
                </Text>
                <Text style={{ color: theme.colors.text.light, fontSize: 16 }}>
                  {animal.race}
                </Text>
              </Stack>

              <Stack marginTop="$4">
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: theme.colors.text.DEFAULT,
                    marginBottom: 5,
                  }}
                >
                  Date de naissance :
                </Text>
                <Text style={{ color: theme.colors.text.light, fontSize: 16 }}>
                  {animal?.birthdate
                    ? format(new Date(animal.birthdate), "dd/MM/yyyy", {
                        locale: fr,
                      })
                    : "Non spécifiée"}
                </Text>
              </Stack>

              <Stack marginTop="$4">
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: theme.colors.text.DEFAULT,
                    marginBottom: 5,
                  }}
                >
                  Place de naissance :
                </Text>
                <Text style={{ color: theme.colors.text.light, fontSize: 16 }}>
                  {animal?.birthplace}
                </Text>
              </Stack>
            </Stack>

            {error && (
              <Stack
                backgroundColor={theme.colors.error}
                padding="$3"
                borderRadius="$4"
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  {error}
                </Text>
              </Stack>
            )}

            <XStack space="$4" marginTop="$4" flexDirection="column">
              {user?.id === animal.owner_id && (
                <>
                  <Stack flex={1}>
                    <Button
                      variant="primary"
                      onPress={() => router.push(`/animal/edit/${id}`)}
                    >
                      Modifier
                    </Button>
                  </Stack>

                  <Stack flex={1} marginTop="$4">
                    <Button variant="outline" onPress={handleDelete}>
                      Supprimer
                    </Button>
                  </Stack>
                </>
              )}

              <Stack flex={1}>
                <Button variant="outline" onPress={() => router.back()}>
                  Retour
                </Button>
              </Stack>
            </XStack>
          </Stack>
        </Stack>
      </Stack>
    </ScrollView>
  );
}
