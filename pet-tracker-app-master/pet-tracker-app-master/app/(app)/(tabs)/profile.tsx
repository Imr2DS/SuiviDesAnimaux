import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text } from "react-native";
import { Stack } from "tamagui";
import { Button } from "../../../components/Button";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert(
      "Confirmer la déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnecter",
          style: "destructive",
          onPress: signOut,
        },
      ]
    );
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
          Profil
        </Text>

        <Stack space="$4">
          <Stack>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: theme.colors.text.DEFAULT,
                marginBottom: 4,
              }}
            >
              Nom complet
            </Text>
            <Text style={{ color: theme.colors.text.light, fontSize: 16 }}>
              {user?.full_name || "Non spécifié"}
            </Text>
          </Stack>

          <Stack>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: theme.colors.text.DEFAULT,
                marginBottom: 4,
              }}
            >
              Email
            </Text>
            <Text style={{ color: theme.colors.text.light, fontSize: 16 }}>
              {user?.email || "Non spécifié"}
            </Text>
          </Stack>

          <Stack>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: theme.colors.text.DEFAULT,
                marginBottom: 4,
              }}
            >
              CIN
            </Text>
            <Text style={{ color: theme.colors.text.light, fontSize: 16 }}>
              {user?.cin || "Non spécifié"}
            </Text>
          </Stack>

          <Stack>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: theme.colors.text.DEFAULT,
                marginBottom: 4,
              }}
            >
              Adresse
            </Text>
            <Text style={{ color: theme.colors.text.light, fontSize: 16 }}>
              {user?.address || "Non spécifiée"}
            </Text>
          </Stack>

          <Stack>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: theme.colors.text.DEFAULT,
                marginBottom: 4,
              }}
            >
              Téléphone mobile
            </Text>
            <Text style={{ color: theme.colors.text.light, fontSize: 16 }}>
              {user?.mobile || "Non spécifié"}
            </Text>
          </Stack>

          <Stack space="$4" marginTop="$4">
            <Button onPress={() => router.push("/profile/edit")}>
              Modifier le profil
            </Button>

            <Button
              onPress={handleSignOut}
              variant="outline"
              style={{
                borderColor: theme.colors.error,
              }}
            >
              Se déconnecter
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </ScrollView>
  );
}
