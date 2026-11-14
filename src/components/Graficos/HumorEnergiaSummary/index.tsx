import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

import { criarStyles } from "../stylesSummary";

interface MoodEnergyChartData {
  date: string;
  mood: number;
  energy: number;
}

interface HumorEnergiaSummaryProps {
  data: MoodEnergyChartData[];
  periodo: 7 | 30 | 90;
  mostrarHumor: boolean;
  mostrarEnergia: boolean;
}

function formatarNota(valor: number): string {
  return valor.toFixed(1).replace(".", ",");
}

export default function HumorEnergiaSummary({
  data,
  periodo,
  mostrarHumor,
  mostrarEnergia,
}: HumorEnergiaSummaryProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);

  const mediaEnergia =
    data.length > 0
      ? data.reduce((total, item) => total + item.energy, 0) / periodo
      : 0;

  const mediaHumor =
    data.length > 0
      ? data.reduce((total, item) => total + item.mood, 0) / periodo
      : 0;

  const menorEnergia =
    data.length > 0 ? Math.min(...data.map((item) => item.energy)) : 0;

  const maiorEnergia =
    data.length > 0 ? Math.max(...data.map((item) => item.energy)) : 0;

  const menorHumor =
    data.length > 0 ? Math.min(...data.map((item) => item.mood)) : 0;

  const maiorHumor =
    data.length > 0 ? Math.max(...data.map((item) => item.mood)) : 0;

  return (
    <View style={styles.container}>
      {/* ==============================
          ENERGIA
          ============================== */}

      {mostrarEnergia && (
        <>
          <View
            style={[
              styles.energiaHumorTotalSection,
              {
                backgroundColor: modoEscuro ? "#2A241B" : "#FFF9F0",
                borderColor: modoEscuro ? "#4A3D28" : "#F1E4CC",
              },
            ]}
          >
            <Text style={styles.destaqueLabel}>
              Média de energia no período
            </Text>

            <Text style={styles.destaqueValue}>
              {formatarNota(mediaEnergia)}
            </Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.item}>
              <Text style={styles.label}>Pior energia</Text>

              <Text style={styles.value}>{menorEnergia}/5</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Melhor energia</Text>

              <Text style={styles.value}>{maiorEnergia}/5</Text>
            </View>
          </View>
        </>
      )}

      {/* ==============================
          HUMOR
          ============================== */}

      {mostrarHumor && (
        <>
          <View
            style={[
              styles.energiaHumorTotalSection,
              {
                backgroundColor: modoEscuro ? "#2A241B" : "#FFF9F0",
                borderColor: modoEscuro ? "#4A3D28" : "#F1E4CC",
              },
            ]}
          >
            <Text style={styles.destaqueLabel}>Média de humor no período</Text>

            <Text style={styles.destaqueValue}>{formatarNota(mediaHumor)}</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.item}>
              <Text style={styles.label}>Pior humor</Text>

              <Text style={styles.value}>{menorHumor}/5</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.label}>Melhor humor</Text>

              <Text style={styles.value}>{maiorHumor}/5</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
