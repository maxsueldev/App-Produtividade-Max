import { useTheme } from "@/context/ThemeContext";
import { Text, View } from "react-native";
import { criarStyles } from "../stylesSummary";

import type { WaterChartData } from "@/database/graficos";
import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";

interface AguaSummaryProps {
  data: WaterChartData[];
  periodo: 7 | 30 | 90;
  metaAgua: number;
}

function formatarAgua(ml: number): string {
  if (ml >= 1000) {
    const litros = ml / 1000;

    return Number.isInteger(litros) ? `${litros}L` : `${litros.toFixed(1)}L`;
  }

  return `${ml}ml`;
}

export default function AguaSummary({
  data,
  periodo,
  metaAgua,
}: AguaSummaryProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const totalAgua = data.reduce((total, item) => total + item.water_ml, 0);
  const mediaDiaria = Math.round(totalAgua / periodo);

  const metaPeriodo = metaAgua * periodo;

  const percentualMeta = metaPeriodo > 0 ? (totalAgua / metaPeriodo) * 100 : 0;

  const percentualBarra = Math.min(percentualMeta, 100);
  const atingiuMeta = percentualMeta >= 100;

  const melhorDia = Math.max(...data.map((item) => item.water_ml));

  const diasNaMeta = data.filter((item) => item.water_ml >= metaAgua).length;

  const faltam = Math.max(metaAgua - mediaDiaria, 0);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.aguaTotalSection,
          {
            backgroundColor: colors.destaqueBackgroundWater,
            borderColor: colors.destaqueBorderWater,
          },
        ]}
      >
        <Text style={styles.totalLabel}>Água no período</Text>

        <View style={styles.totalRow}>
          <Text style={styles.totalValue}>{formatarAgua(totalAgua)}</Text>
        </View>

        <View>
          <View style={globalStyles.header}>
            <Text style={styles.goalProgressLabel}>
              Meta de {formatarAgua(metaPeriodo)}
            </Text>

            <Text
              style={[
                styles.goalProgressValue,
                atingiuMeta && {
                  color: colors.metaSuccess,
                },
              ]}
            >
              {Math.round(percentualMeta)}%
            </Text>
          </View>

          <View style={styles.goalProgressBar}>
            <View
              style={[
                styles.goalProgressFill,
                {
                  width: `${percentualBarra}%`,
                  backgroundColor: colors.waterColor,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Indicadores */}
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Total</Text>

          <Text style={styles.value}>{formatarAgua(totalAgua)}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Dias na meta</Text>

          <Text style={styles.value}>
            {diasNaMeta}/{periodo}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Média diária</Text>

          <Text style={styles.value}>{formatarAgua(mediaDiaria)}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Melhor dia</Text>

          <Text style={styles.value}>{formatarAgua(melhorDia)}</Text>
        </View>
      </View>

      {/* Card média x meta */}
      <View style={styles.metaCard}>
        <View style={globalStyles.header}>
          <View>
            <Text style={styles.metaLabel}>Média atual</Text>

            <Text style={styles.metaValue}>
              {(mediaDiaria / 1000).toFixed(2)} L/dia
            </Text>
          </View>

          <View style={styles.metaDireita}>
            <Text style={styles.metaLabel}>Meta</Text>

            <Text style={styles.metaValue}>
              {(metaAgua / 1000).toFixed(1)} L/dia
            </Text>
          </View>
        </View>

        <View style={styles.metaBarra}>
          <View
            style={[
              styles.metaProgresso,
              {
                width: `${percentualBarra}%`,
                backgroundColor: colors.waterColor,
              },
            ]}
          />
        </View>

        <Text style={styles.metaRestante}>
          {mediaDiaria >= metaAgua
            ? "Meta diária atingida"
            : `Faltam ${(faltam / 1000).toFixed(2)} L para a meta`}
        </Text>
      </View>
    </View>
  );
}
