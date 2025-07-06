import React, { useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { Stack } from "tamagui";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { theme } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    address: user?.address || "",
    mobile: user?.mobile || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProfile = async () => {
    try {
      setError(null);
      setLoading(true);

      const { error } = await supabase
        .from("users")
        .update({
          address: formData.address,
          mobile: formData.mobile,
        })
        .eq("id", user?.id);

      if (error) throw error;

      Alert.alert("Succès", "Profil mis à jour avec succès");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
    } finally {
      setLoading(false);
    }
  };

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
          <Input label="Email" value={formData.email} editable={false} />

          <Input
            label="Adresse"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
          />

          <Input
            label="Téléphone mobile"
            value={formData.mobile}
            onChangeText={(text) => setFormData({ ...formData, mobile: text })}
            keyboardType="phone-pad"
            style={{
              marginBottom: 20,
            }}
          />

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

          <Stack space="$4">
            <Button onPress={handleUpdateProfile} loading={loading}>
              Mettre à jour
            </Button>

            <Button onPress={handleSignOut} variant="outline">
              Se déconnecter
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </ScrollView>
  );
}
