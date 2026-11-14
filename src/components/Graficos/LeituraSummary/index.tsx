import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type { ReadingChartData } from "@/database/graficos";

import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "../stylesSummary";

interface ReadingSummaryProps {
  data: ReadingChartData[];
  periodo: 7 | 30 | 90;
  metaLeitura: number;
}

export default function LeituraSummary({
  data,
  periodo,
  metaLeitura,
}: ReadingSummaryProps) {
  const { modoEscuro } = useTheme();
  const globalStyles = createGlobalStyles(modoEscuro);
  const styles = criarStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const totalPaginas = data.reduce((total, item) => total + item.pages_read, 0);

  const mediaDiaria = Math.round(totalPaginas / periodo);

  const diasNaMeta = data.filter(
    (item) => item.pages_read >= metaLeitura,
  ).length;

  const metaPeriodo = metaLeitura * periodo;

  const percentualMeta =
    metaPeriodo > 0 ? (totalPaginas / metaPeriodo) * 100 : 0;

  const percentualBarra = Math.min(percentualMeta, 100);

  return (
    <View style={styles.container}>
      {/* Destaque principal */}
      <View
        style={[
          styles.destaque,
          {
            backgroundColor: colors.destaqueBackgroundReading,
            borderColor: colors.destaqueBorderReading,
          },
        ]}
      >
        <Text style={styles.destaqueLabel}>Páginas lidas no período</Text>

        <Text style={styles.destaqueValue}>{totalPaginas} páginas</Text>

        {/* Meta */}
        <View>
          <View style={globalStyles.header}>
            <Text style={styles.goalProgressLabel}>
              Meta de {metaPeriodo} páginas
            </Text>

            <Text style={styles.goalProgressValue}>
              {Math.round(percentualMeta)}%
            </Text>
          </View>

          <View style={styles.goalProgressBar}>
            <View
              style={[
                styles.goalProgressFill,
                {
                  width: `${percentualBarra}%`,
                  backgroundColor: colors.readingColor,
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

          <Text style={styles.value}>{mediaDiaria} pág./dia</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Dias na meta</Text>

          <Text style={styles.value}>
            {diasNaMeta}/{periodo}
          </Text>
        </View>
      </View>

      {/* Meta diária */}
      <View style={styles.metaCard}>
        <View style={globalStyles.header}>
          <View>
            <Text style={styles.metaLabel}>Média atual</Text>

            <Text style={styles.metaValue}>{mediaDiaria} pág./dia</Text>
          </View>

          <View style={styles.metaDireita}>
            <Text style={styles.metaLabel}>Meta</Text>

            <Text style={styles.metaValue}>{metaLeitura} pág./dia</Text>
          </View>
        </View>

        <View style={styles.metaBarra}>
          <View
            style={[
              styles.metaProgresso,
              {
                width: `${Math.min((mediaDiaria / metaLeitura) * 100, 100)}%`,
                backgroundColor: colors.readingColor,
              },
            ]}
          />
        </View>

        <Text style={styles.metaRestante}>
          {mediaDiaria >= metaLeitura
            ? "Meta diária atingida"
            : `Faltam ${metaLeitura - mediaDiaria} páginas para a meta`}
        </Text>
      </View>
    </View>
  );
}
