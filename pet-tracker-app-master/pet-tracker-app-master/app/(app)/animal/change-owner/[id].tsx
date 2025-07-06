import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { Stack, XStack } from "tamagui";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { theme } from "../../../../constants/theme";
import { useAuth } from "../../../../contexts/AuthContext";
import type { Database } from "../../../../lib/supabase";
import { supabase } from "../../../../lib/supabase";

type Animal = Database["public"]["Tables"]["animals"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export default function ChangeOwnerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newOwner, setNewOwner] = useState<User | null>(null);

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

      if (data.owner_id !== user?.id) {
        throw new Error("Vous n'êtes pas autorisé à modifier cet animal");
      }

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

  const searchNewOwner = async () => {
    try {
      setError(null);
      if (!newOwnerEmail) {
        setError("Veuillez entrer une adresse email");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", newOwnerEmail)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setError("Aucun utilisateur trouvé avec cette adresse email");
        } else {
          throw error;
        }
        return;
      }

      setNewOwner(data);
    } catch (err) {
      console.error("Error searching user:", err);
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    }
  };

  const handleChangeOwner = async () => {
    if (!newOwner) {
      setError("Veuillez d'abord rechercher un utilisateur");
      return;
    }

    Alert.alert(
      "Confirmer le changement de propriétaire",
      `Êtes-vous sûr de vouloir transférer ${animal?.name} à ${newOwner.email} ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);
              setError(null);

              const { error } = await supabase
                .from("animals")
                .update({ owner_id: newOwner.id })
                .eq("id", id);

              if (error) throw error;

              router.replace(`/animal/${id}`);
            } catch (err) {
              console.error("Error changing owner:", err);
              setError(
                err instanceof Error
                  ? err.message
                  : "Une erreur inconnue est survenue"
              );
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <Stack flex={1} justifyContent="center" alignItems="center">
        <Text style={{ color: theme.colors.text.light }}>Chargement...</Text>
      </Stack>
    );
  }

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
          Changer le propriétaire
        </Text>

        <Stack space="$4">
          <Stack>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: theme.colors.text.DEFAULT,
                marginBottom: 8,
              }}
            >
              Rechercher un utilisateur
            </Text>
            <XStack space="$2">
              <Stack flex={1}>
                <Input
                  placeholder="Email de l'utilisateur"
                  value={newOwnerEmail}
                  onChangeText={setNewOwnerEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Stack>
              <Button onPress={searchNewOwner}>Rechercher</Button>
            </XStack>
          </Stack>

          {newOwner && (
            <Stack
              backgroundColor={theme.colors.background.dark}
              padding="$4"
              borderRadius="$4"
              space="$2"
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: theme.colors.text.DEFAULT,
                }}
              >
                Nouveau propriétaire
              </Text>
              <Text style={{ color: theme.colors.text.light }}>
                {newOwner.email}
              </Text>
            </Stack>
          )}

          {error && (
            <Text
              style={{
                marginBottom: 16,
                color: theme.colors.error,
              }}
            >
              {error}
            </Text>
          )}

          <XStack space="$4" flexDirection="column" marginTop="$4">
            <Button variant="outline" onPress={() => router.back()}>
              Annuler
            </Button>

            {newOwner && (
              <Button onPress={handleChangeOwner} loading={saving}>
                <XStack space="$2" alignItems="center">
                  <MaterialCommunityIcons
                    name="account-switch"
                    size={20}
                    color="white"
                  />
                  <Text style={{ color: "white" }}>
                    Transférer à {newOwner.email}
                  </Text>
                </XStack>
              </Button>
            )}
          </XStack>
        </Stack>
      </Stack>
    </ScrollView>
  );
}
