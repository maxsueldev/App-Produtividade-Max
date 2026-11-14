import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type { StudyChartData } from "@/database/graficos";

import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import criarStyles from "../stylesSummary";

interface StudySummaryProps {
  data: StudyChartData[];
  periodo: 7 | 30 | 90;
  metaEstudo: number;
}

function formatarDuracao(minutos: number): string {
  if (minutos <= 0) {
    return "0 min";
  }

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (horas === 0) {
    return `${minutosRestantes} min`;
  }

  if (minutosRestantes === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${minutosRestantes}min`;
}

export default function EstudosSummary({
  data,
  periodo,
  metaEstudo,
}: StudySummaryProps) {
  const { modoEscuro } = useTheme();
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);
  const styles = criarStyles(modoEscuro);

  const tempoTotal = data.reduce(
    (total, item) => total + item.total_minutes,
    0,
  );

  const questoesTotais = data.reduce(
    (total, item) => total + item.questions_total,
    0,
  );

  const acertos = data.reduce(
    (total, item) => total + item.questions_correct,
    0,
  );

  const erros = data.reduce((total, item) => total + item.questions_wrong, 0);

  const diasEstudados = data.filter((item) => item.total_minutes > 0).length;

  const mediaDiaria = Math.round(tempoTotal / periodo);

  const taxaAcerto = questoesTotais > 0 ? (acertos / questoesTotais) * 100 : 0;

  // Meta total esperada para o período
  const metaPeriodo = metaEstudo * periodo;

  // Percentual da meta atingida
  const percentualMeta = metaPeriodo > 0 ? (tempoTotal / metaPeriodo) * 100 : 0;

  // Limita a barra visualmente a 100%
  const percentualBarra = Math.min(percentualMeta, 100);

  return (
    <View style={styles.container}>
      {/* Destaque principal */}
      <View
        style={[
          styles.destaque,
          {
            backgroundColor: colors.destaqueBackgroundStudy,
            borderColor: colors.destaqueBorderStudy,
          },
        ]}
      >
        <Text style={styles.destaqueLabel}>Tempo estudado no período</Text>

        <Text style={styles.destaqueValue}>{formatarDuracao(tempoTotal)}</Text>

        {/* Meta */}
        <View>
          <View style={globalStyles.header}>
            <Text style={styles.goalProgressLabel}>
              Meta de {formatarDuracao(metaPeriodo)}
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
                  backgroundColor: colors.studyColor,
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
          <Text style={styles.label}>Dias estudados</Text>

          <Text style={styles.value}>
            {diasEstudados}/{periodo}
          </Text>
        </View>
      </View>

      {/* Desempenho */}
      <View style={styles.desempenho}>
        <Text style={styles.desempenhoTitulo}>Desempenho nas questões</Text>

        <View style={styles.questoes}>
          <View style={styles.questaoItem}>
            <Text style={styles.questaoLabel}>Questões</Text>

            <Text style={styles.questaoValue}>{questoesTotais}</Text>
          </View>

          <View style={styles.questaoItem}>
            <Text style={styles.questaoLabel}>Acertos</Text>

            <Text style={styles.questaoValue}>{acertos}</Text>
          </View>

          <View style={styles.questaoItem}>
            <Text style={styles.questaoLabel}>Erros</Text>

            <Text style={styles.questaoValue}>{erros}</Text>
          </View>
        </View>

        <View
          style={[
            styles.taxa,
            {
              backgroundColor: colors.destaqueBackgroundStudy,
              borderColor: colors.destaqueBorderStudy,
            },
          ]}
        >
          <Text style={styles.taxaLabel}>Taxa de acerto</Text>

          <Text style={styles.taxaValue}>
            {taxaAcerto.toFixed(1).replace(".", ",")}%
          </Text>

          <View style={styles.taxaBarra}>
            <View
              style={[
                styles.taxaProgresso,
                {
                  width: `${taxaAcerto}%`,
                  backgroundColor: colors.studyColor,
                },
              ]}
            />
          </View>
        </View>
      </View>

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
              {formatarDuracao(metaEstudo)}/dia
            </Text>
          </View>
        </View>

        <View style={styles.metaBarra}>
          <View
            style={[
              styles.metaProgresso,
              {
                width: `${Math.min((mediaDiaria / metaEstudo) * 100, 100)}%`,
                backgroundColor: colors.studyColor,
              },
            ]}
          />
        </View>

        <Text style={styles.metaRestante}>
          {mediaDiaria >= metaEstudo
            ? "Meta diária atingida"
            : `Faltam ${formatarDuracao(metaEstudo - mediaDiaria)} para a meta`}
        </Text>
      </View>
    </View>
  );
}
