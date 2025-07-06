import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { TamaguiProvider } from "tamagui";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import tamaguiConfig from "../../../tamagui.config";

export default function AppLayout() {
  const { signOut } = useAuth();

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary.DEFAULT,
          },
          headerTintColor: theme.colors.text.dark,
          tabBarActiveTintColor: theme.colors.primary.DEFAULT,
          tabBarInactiveTintColor: theme.colors.text.light,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Mes Animaux",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="paw" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="animal/search"
          options={{
            title: "Rechercher",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </TamaguiProvider>
  );
}
