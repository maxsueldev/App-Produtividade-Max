import { useTheme } from "@/context/ThemeContext";
import createGlobalStyles from "@/styles/globalStyles";
import { Text, View } from "react-native";

interface EnergyCardProps {
  energy: number | null;
}

function obterDescricao(valor: number | null): string {
  if (valor === null) {
    return "Não informado";
  }

  if (valor <= 2) {
    return "Baixo";
  }

  if (valor === 3) {
    return "Normal";
  }

  if (valor === 4) {
    return "Bom";
  }

  return "Excelente";
}

export default function EnergyCard({ energy }: EnergyCardProps) {
  const { modoEscuro } = useTheme();
  const globalStyles = createGlobalStyles(modoEscuro);

  return (
    <View style={[globalStyles.cardContainer, { flex: 1 }]}>
      <Text style={globalStyles.cardTitle}>⚡ Energia</Text>

      <Text style={globalStyles.bigValue}>
        {energy !== null ? `${energy}/5` : "--"}
      </Text>

      <Text style={globalStyles.cardDescription}>{obterDescricao(energy)}</Text>
    </View>
  );
}
