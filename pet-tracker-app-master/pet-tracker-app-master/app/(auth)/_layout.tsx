import { Stack } from "expo-router";
import { theme } from "../../constants/theme";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary.DEFAULT,
        },
        headerTintColor: theme.colors.text.dark,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Connexion",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Inscription",
        }}
      />
    </Stack>
  );
}
