import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type { SmokingChartData } from "@/database/graficos";

import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "../stylesSummary";

interface CigarrosSummaryProps {
  data: SmokingChartData[];
  periodo: 7 | 30 | 90;
  metaCigarros: number;
}

export default function CigarrosSummary({
  data,
  periodo,
  metaCigarros,
}: CigarrosSummaryProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const totalCigarros = data.reduce((total, item) => total + item.total, 0);

  const mediaDiaria = Math.round(totalCigarros / periodo);

  const limitePeriodo = metaCigarros * periodo;

  const percentualLimite =
    limitePeriodo > 0
      ? totalCigarros <= limitePeriodo
        ? 100
        : (limitePeriodo / totalCigarros) * 100
      : 0;

  const percentualBarra = Math.min(percentualLimite, 100);

  const ultrapassouLimite = totalCigarros > limitePeriodo;

  const diasNaMeta = data.filter((item) => item.total <= metaCigarros).length;

  const menorDia = Math.min(...data.map((item) => item.total));
  const maiorDia = Math.max(...data.map((item) => item.total));

  const atingiuMeta = mediaDiaria <= metaCigarros;
  const faltam = Math.max(metaCigarros - mediaDiaria, 0);

  const metaPeriodo = metaCigarros * periodo;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.cigarrosTotalSection,
          {
            backgroundColor: colors.destaqueBackgroundSmoking,
            borderColor: colors.destaqueBorderSmoking,
          },
        ]}
      >
        <Text style={styles.totalLabel}>Cigarros no período</Text>

        <View style={styles.totalRow}>
          <Text style={styles.totalValue}>{totalCigarros}</Text>

          <Text style={styles.totalUnit}>cigarros</Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <View style={globalStyles.header}>
            <Text style={styles.goalProgressLabel}>
              Limite de {metaPeriodo} cigarros
            </Text>

            <Text
              style={[
                styles.goalProgressValue,
                ultrapassouLimite && {
                  color: colors.smokingColor,
                },
              ]}
            >
              {Math.round(percentualLimite)}%
            </Text>
          </View>

          <View style={styles.goalProgressBar}>
            <View
              style={[
                styles.goalProgressFill,
                {
                  width: `${percentualBarra}%`,
                  backgroundColor: ultrapassouLimite ? "#D32F2F" : "#E57373",
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.cigarrosInfoRow}>
          <View style={styles.cigarrosInfoItem}>
            <Text style={styles.cigarrosInfoLabel}>
              Limite diário:
              <Text style={styles.cigarrosInfoValue}>{metaCigarros}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Indicadores */}
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Média diária</Text>

          <Text style={styles.value}>{mediaDiaria}</Text>
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

          <Text style={styles.value}>{menorDia}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Maior dia</Text>

          <Text style={styles.value}>{maiorDia}</Text>
        </View>
      </View>

      {/* Card média x meta */}
      <View style={styles.metaCard}>
        <View style={globalStyles.header}>
          <View>
            <Text style={styles.metaLabel}>Média atual</Text>

            <Text style={styles.metaValue}>{mediaDiaria} cigarros/dia</Text>
          </View>

          <View style={styles.metaDireita}>
            <Text style={styles.metaLabel}>Meta</Text>

            <Text style={styles.metaValue}>{metaCigarros}/dia</Text>
          </View>
        </View>

        <View style={styles.metaBarra}>
          <View
            style={[
              styles.metaProgresso,
              {
                width: `${percentualBarra}%`,
                backgroundColor: atingiuMeta ? "#E57373" : "#D32F2F",
              },
            ]}
          />
        </View>

        <Text style={styles.metaRestante}>
          {mediaDiaria <= metaCigarros
            ? `Faltam ${faltam} cigarros para o limite`
            : `Você ultrapassou o limite em ${
                mediaDiaria - metaCigarros
              } cigarros`}
        </Text>
      </View>
    </View>
  );
}
