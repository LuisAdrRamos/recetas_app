import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";
// Importamos los colores de tu propio theme del taller [cite: 90]
import { colors } from "../../src/styles/theme";

export default function TabLayout() {
    // 1. Importamos el router para poder navegar
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary, // Usamos tu color primario [cite: 90]
                headerShown: false,
                tabBarStyle: {
                    paddingTop: 8, // Un poco de espacio
                },
            }}
        >
            <Tabs.Screen
                name="index" // Esto enlaza con app/(tabs)/index.tsx
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Text style={{ color: color, fontSize: 28 }}>🏠</Text>
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
                    tabBarIcon: ({ color }) => (
                        <Text style={{ color: color, fontSize: 28 }}>🍳</Text>
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