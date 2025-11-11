import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { green } from "react-native-reanimated/lib/typescript/Colors";

export default function TabLayout() {
    // 1. Importamos el router para poder navegar
    const router = useRouter();

    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary, // Usamos tu color primario [cite: 90]
                headerShown: false,
                tabBarStyle: {
                    height: 65 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 8,
                },
            }}
        >
            <Tabs.Screen
                name="index" // Esto enlaza con app/(tabs)/index.tsx
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />

            {/* ESTA ES LA CORRECCIÓN CLAVE
        El Taller la nombra 'explore', pero no necesita un archivo.
      */}
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Nueva Receta",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "add-circle" : "add-circle-outline"}
                            size={28}
                            color={"#4caf50"}
                        />
                    ),
                }}
                // 2. Añadimos un "listener" que intercepta el clic
                listeners={{
                    tabPress: (e) => {
                        // 3. Prevenimos la navegación por defecto (que fallaría)
                        e.preventDefault();
                        // 4. Navegamos manualmente a la pantalla modal de crear receta [cite: 157, 170]
                        router.push("/recipe/crear");
                    },
                }}
            />
        </Tabs>
    );
}