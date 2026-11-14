import { ScrollView, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

import { criarStylesChart } from "../stylesChart";
import { criarStyles as criarStylesReg } from "./styles";

interface StudyChartData {
  date: string;
  total_minutes: number;
}

interface StudyChartProps {
  data: StudyChartData[];
  periodo: 7 | 30 | 90;
  metaEstudo: number;
}

const ALTURA_BARRA = 170;
const LARGURA_POR_DIA = 60;
const LARGURA_MINIMA = 350;

function formatarData(data: string): string {
  const [, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

function formatarDuracao(minutos: number): string {
  if (minutos <= 0) return "0 min";

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

export default function EstudosChart({
  data,
  periodo,
  metaEstudo,
}: StudyChartProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStylesChart(modoEscuro);
  const stylesReg = criarStylesReg(modoEscuro);

  const maiorValor = Math.max(
    ...data.map((item) => item.total_minutes),
    metaEstudo,
    1,
  );

  const posicaoMeta = (metaEstudo / maiorValor) * ALTURA_BARRA;

  const larguraGrafico = Math.max(
    data.length * LARGURA_POR_DIA,
    LARGURA_MINIMA,
  );

  return (
    <View style={styles.chartContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={[styles.chart, { width: larguraGrafico }]}>
          <View style={styles.columns}>
            {[60, 120, metaEstudo].map((minutos) => {
              if (minutos > maiorValor) {
                return null;
              }

              const posicao = (minutos / maiorValor) * ALTURA_BARRA;

              return (
                <View
                  key={minutos}
                  pointerEvents="none"
                  style={[
                    stylesReg.referenceLine,
                    {
                      bottom: 28 + posicao,
                    },
                  ]}
                >
                  <Text style={stylesReg.referenceText}>
                    {formatarDuracao(minutos)}
                  </Text>
                </View>
              );
            })}

            {[...data].reverse().map((item) => {
              const altura = (item.total_minutes / maiorValor) * 100;

              return (
                <View key={item.date} style={styles.column}>
                  <Text style={styles.value}>
                    {formatarDuracao(item.total_minutes)}
                  </Text>

                  <View style={styles.barArea}>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          stylesReg.bar,
                          {
                            height: `${altura}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <Text style={styles.date}>{formatarData(item.date)}</Text>
                </View>
              );
            })}

            <View
              pointerEvents="none"
              style={[
                stylesReg.metaLine,
                {
                  bottom: 28 + posicaoMeta,
                },
              ]}
            >
              <Text style={stylesReg.metaText}>
                Meta: {formatarDuracao(metaEstudo)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
