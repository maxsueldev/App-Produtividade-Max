import { ScrollView, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

import { criarStylesChart } from "../stylesChart";
import { criarStyles as criarStylesReg } from "./styles";

import type { HabitChartData } from "@/database/graficos";

interface HabitosChartProps {
  data: HabitChartData[];
  periodo: 7 | 30 | 90;
  metaHabitos: number;
}

const ALTURA_BARRA = 170;
const LARGURA_POR_DIA = 60;
const LARGURA_MINIMA = 350;

function formatarData(data: string): string {
  const [, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

export default function HabitosChart({ data, metaHabitos }: HabitosChartProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStylesChart(modoEscuro);
  const stylesReg = criarStylesReg(modoEscuro);

  const maiorValor = 100;

  const posicaoMeta = (metaHabitos / maiorValor) * ALTURA_BARRA;

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
            {[25, 50, 75, metaHabitos].map((percentual) => {
              const posicao = (percentual / maiorValor) * ALTURA_BARRA;

              return (
                <View
                  key={percentual}
                  pointerEvents="none"
                  style={[
                    stylesReg.referenceLine,
                    {
                      bottom: 28 + posicao,
                    },
                  ]}
                >
                  <Text style={stylesReg.referenceText}>{percentual}%</Text>
                </View>
              );
            })}

            {[...data].reverse().map((item) => {
              const percentual =
                item.total > 0 ? (item.completed / item.total) * 100 : 0;

              return (
                <View key={item.date} style={styles.column}>
                  <Text style={styles.value}>{Math.round(percentual)}%</Text>

                  <View style={styles.barArea}>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          stylesReg.bar,
                          {
                            height: `${percentual}%`,
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
              <Text style={stylesReg.metaText}>Meta: {metaHabitos}%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
