import { registrarInsightBackgroundTask } from "@/background/insightTask";
import { initializeDatabase } from "@/database/database";
import { agendarTodasNotificacoes } from "@/notifications";
import { configurarNotificacoes } from "@/notifications/notificationService";

import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider } from "@/context/ThemeContext";

export default function Layout() {
  useEffect(() => {
    async function inicializarAplicacao() {
      try {
        const db = await initializeDatabase();

        const permitido = await configurarNotificacoes();

        if (permitido) {
          await agendarTodasNotificacoes(db);
        }

        await registrarInsightBackgroundTask();
      } catch (error) {
        console.error("❌ Erro ao inicializar aplicação:", error);
      }
    }

    inicializarAplicacao();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="home" options={{ headerShown: false }} />

          <Stack.Screen name="registrar" options={{ headerShown: false }} />

          <Stack.Screen name="historico" options={{ headerShown: false }} />

          <Stack.Screen
            name="historico/[id]"
            options={{ headerShown: false }}
          />

          <Stack.Screen name="graficos" options={{ headerShown: false }} />

          <Stack.Screen name="configuracoes" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
