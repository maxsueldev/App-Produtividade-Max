import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type { SleepChartData } from "@/database/graficos";

import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "../stylesSummary";

interface SonoSummaryProps {
  data: SleepChartData[];
  periodo: 7 | 30 | 90;
  metaSono: number;
}

function formatarDuracao(minutos: number): string {
  if (minutos <= 0) {
    return "0h";
  }

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (horas === 0) {
    return `${minutosRestantes}min`;
  }

  if (minutosRestantes === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${minutosRestantes}min`;
}

export default function SonoSummary({
  data,
  periodo,
  metaSono,
}: SonoSummaryProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const metaSonoMinutos = metaSono * 60;

  const totalSono = data.reduce(
    (total, item) => total + item.duration_minutes,
    0,
  );

  const mediaDiaria = Math.round(totalSono / periodo);
  const metaPeriodo = metaSonoMinutos * periodo;
  const percentualMeta = metaPeriodo > 0 ? (totalSono / metaPeriodo) * 100 : 0;
  const percentualBarra = Math.min(percentualMeta, 100);
  const atingiuMeta = percentualMeta >= 100;

  const diasNaMeta = data.filter(
    (item) => item.duration_minutes >= metaSonoMinutos,
  ).length;

  const menorDia = Math.min(...data.map((item) => item.duration_minutes));
  const maiorDia = Math.max(...data.map((item) => item.duration_minutes));

  const faltam = Math.max(metaSonoMinutos - mediaDiaria, 0);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.sonoTotalSection,
          {
            backgroundColor: colors.destaqueBackgroundSleep,
            borderColor: colors.destaqueBorderSleep,
          },
        ]}
      >
        <Text style={styles.totalLabel}>Sono no período</Text>

        <View style={styles.totalRow}>
          <Text style={styles.totalValue}>{formatarDuracao(totalSono)}</Text>
        </View>

        <View>
          <View style={globalStyles.header}>
            <Text style={styles.goalProgressLabel}>
              Meta de {formatarDuracao(metaPeriodo)}
            </Text>

            <Text
              style={[
                styles.goalProgressValue,
                atingiuMeta && {
                  color: modoEscuro ? "#B39DDB" : "#6A4C93",
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
                  backgroundColor: colors.sleepColor,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Indicadores */}
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Média diária</Text>

          <Text style={styles.value}>{formatarDuracao(mediaDiaria)}</Text>
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
          <Text style={styles.label}>Menor dia</Text>

          <Text style={styles.value}>{formatarDuracao(menorDia)}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Maior dia</Text>

          <Text style={styles.value}>{formatarDuracao(maiorDia)}</Text>
        </View>
      </View>

      {/* Card média x meta */}
      <View style={styles.metaCard}>
        <View style={globalStyles.header}>
          <View>
            <Text style={styles.metaLabel}>Média atual</Text>

            <Text style={styles.metaValue}>
              {formatarDuracao(mediaDiaria)}/dia
            </Text>
          </View>

          <View style={styles.metaDireita}>
            <Text style={styles.metaLabel}>Meta</Text>

            <Text style={styles.metaValue}>
              {formatarDuracao(metaSonoMinutos)}/dia
            </Text>
          </View>
        </View>

        <View style={styles.metaBarra}>
          <View
            style={[
              styles.metaProgresso,
              {
                width: `${percentualBarra}%`,
                backgroundColor: colors.sleepColor,
              },
            ]}
          />
        </View>

        <Text style={styles.metaRestante}>
          {mediaDiaria >= metaSonoMinutos
            ? "Meta diária atingida"
            : `Faltam ${formatarDuracao(faltam)} para a meta`}
        </Text>
      </View>
    </View>
  );
}
