import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text } from "react-native";
import { Stack, XStack } from "tamagui";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { theme } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      await signIn(formData.email, formData.password);
      router.replace("/(app)");
    } catch (err) {
      console.error("Sign in error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la connexion"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack flex={1} backgroundColor="$background" padding="$4">
      <Stack flex={1} justifyContent="center" alignItems="center" space="$4">
        {/* <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 120, height: 120, marginBottom: 32 }}
        /> */}

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 24,
            color: theme.colors.text.DEFAULT,
          }}
        >
          Connexion
        </Text>

        <Stack width="100%" space="$4">
          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Mot de passe"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            secureTextEntry
          />

          {error && (
            <Text
              style={{
                color: theme.colors.error,
              }}
            >
              {error}
            </Text>
          )}

          <Button
            onPress={handleSignIn}
            loading={loading}
            style={{
              marginTop: 16,
            }}
          >
            Se connecter
          </Button>

          <XStack justifyContent="center" alignItems="center" space="$2">
            <Text style={{ color: theme.colors.text.DEFAULT }}>
              Pas encore de compte ?
            </Text>
            <Button variant="ghost" onPress={() => router.push("/signup")}>
              S&apos;inscrire
            </Button>
          </XStack>
        </Stack>
      </Stack>
    </Stack>
  );
}
