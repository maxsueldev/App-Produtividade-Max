import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import criarStyles from "./styles";

export default function BottomNavigation() {
  const router = useRouter();
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);

  function abrirHome() {
    router.push("/home");
  }

  function abrirRegistrar() {
    router.push("/registrar");
  }

  function abrirHistorico() {
    router.push("/historico");
  }

  function abrirGraficos() {
    router.push("/graficos");
  }

  function abrirConfiguracoes() {
    router.push("/configuracoes");
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={abrirHome}>
        <Text style={styles.icon}>🏠</Text>
        <Text style={styles.label}>Hoje</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={abrirHistorico}>
        <Text style={styles.icon}>📋</Text>
        <Text style={styles.label}>Histórico</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={abrirRegistrar}>
        <Text style={styles.icon}>➕</Text>
        <Text style={styles.label}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={abrirGraficos}>
        <Text style={styles.icon}>📊</Text>
        <Text style={styles.label}>Evolução</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={abrirConfiguracoes}>
        <Text style={styles.icon}>⚙️</Text>
        <Text style={styles.label}>Config.</Text>
      </TouchableOpacity>
    </View>
  );
}
