import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text } from "react-native";
import { ScrollView, Stack, XStack } from "tamagui";
import { Button } from "../../../components/Button";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import type { Database } from "../../../lib/supabase";
import { supabase } from "../../../lib/supabase";

type Animal = Database["public"]["Tables"]["animals"]["Row"];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          console.log("No session found, redirecting to login");
          router.replace("/login");
          return;
        }

        // If we have a session but no user in context, wait a bit
        if (!user) {
          console.log("Session exists but no user in context, waiting...");
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        setIsCheckingAuth(false);
        fetchAnimals();
      } catch (err) {
        console.error("Error checking auth:", err);
        setError("Erreur de vérification d'authentification");
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [user]);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        console.log("No user ID available, skipping fetch");
        return;
      }

      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAnimals(data || []);
    } catch (err) {
      console.error("Error fetching animals:", err);
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <Stack flex={1} justifyContent="center" alignItems="center">
        <Text style={{ color: theme.colors.text.light }}>Vérification...</Text>
      </Stack>
    );
  }

  if (!user) {
    return (
      <Stack flex={1} justifyContent="center" alignItems="center">
        <Text style={{ color: theme.colors.text.light }}>Redirection...</Text>
      </Stack>
    );
  }

  return (
    <Stack flex={1} backgroundColor="$background" padding="$4">
      <Stack marginBottom="$6" height={60}>
        <Button
          onPress={() => router.push("/animal/register")}
          variant="primary"
          size="lg"
          fullWidth
          style={{
            height: "100%",
          }}
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            space="$2"
          >
            <MaterialCommunityIcons name="plus" size={24} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 16,
              }}
            >
              Ajouter un animal
            </Text>
          </Stack>
        </Button>
      </Stack>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 16,
          color: theme.colors.text.DEFAULT,
        }}
      >
        Mes Animaux ({animals.length})
      </Text>

      {error && (
        <Stack marginBottom="$4">
          <Text style={{ color: "red" }}>{error}</Text>
        </Stack>
      )}

      {loading ? (
        <Text
          style={{
            textAlign: "center",
            color: theme.colors.text.light,
          }}
        >
          Chargement...
        </Text>
      ) : animals.length === 0 ? (
        <Text
          style={{
            textAlign: "center",
            color: theme.colors.text.light,
          }}
        >
          Aucun animal enregistré
        </Text>
      ) : (
        <ScrollView>
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
                    source={{
                      uri: `${animal.image}`,
                    }}
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
                      }}
                    >
                      {animal.name}
                    </Text>
                    <Text style={{ color: theme.colors.text.light }}>
                      {animal.race} •{" "}
                      {animal.gender === "male" ? "Mâle" : "Femelle"}
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
        </ScrollView>
      )}
    </Stack>
  );
}
