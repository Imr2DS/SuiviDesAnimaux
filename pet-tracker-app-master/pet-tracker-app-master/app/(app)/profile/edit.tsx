import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { Stack } from "tamagui";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    cin: user?.cin || "",
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
          full_name: formData.full_name,
          cin: formData.cin,
          address: formData.address,
          mobile: formData.mobile,
        })
        .eq("id", user?.id);

      if (error) throw error;

      Alert.alert("Succès", "Profil mis à jour avec succès", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue"
      );
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
          Modifier le profil
        </Text>

        <Stack space="$4">
          <Input
            label="Nom complet"
            value={formData.full_name}
            onChangeText={(text) =>
              setFormData({ ...formData, full_name: text })
            }
          />

          <Input
            label="CIN"
            value={formData.cin}
            onChangeText={(text) => setFormData({ ...formData, cin: text })}
          />

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

          <Stack space="$4" marginTop="$4">
            <Button onPress={handleUpdateProfile} loading={loading}>
              Enregistrer
            </Button>

            <Button variant="outline" onPress={() => router.back()}>
              Annuler
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </ScrollView>
  );
}
