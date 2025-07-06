import { theme } from "@/constants/theme";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";
import { AuthProvider } from "../../contexts/AuthContext";
import tamaguiConfig from "../../tamagui.config";

export default function AppLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      {/*  eslint-disable-next-line react/no-children-prop */}
      <AuthProvider children={undefined}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary.DEFAULT,
            },
            headerTintColor: theme.colors.text.dark,
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "Retour" }}
          />
          <Stack.Screen
            name="animal/[id]"
            options={{ title: "Infomartion d'animal" }}
          />
          <Stack.Screen
            name="animal/edit/[id]"
            options={{ title: "Modifier un animal" }}
          />
          <Stack.Screen
            name="animal/register"
            options={{ title: "Enregistrer un animal" }}
          />
          <Stack.Screen
            name="profile/edit"
            options={{ title: "Modifier le profil" }}
          />
        </Stack>
      </AuthProvider>
    </TamaguiProvider>
  );
}
