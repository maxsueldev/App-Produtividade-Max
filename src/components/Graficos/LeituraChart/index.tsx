import { ScrollView, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import type { ReadingChartData } from "@/database/graficos";

import { obterCores } from "@/styles/colors";
import { criarStylesChart } from "../stylesChart";

interface ReadingChartProps {
  data: ReadingChartData[];
  periodo: 7 | 30 | 90;
  metaLeitura: number;
}

const ALTURA_BARRA = 170;
const LARGURA_POR_DIA = 60;
const LARGURA_MINIMA = 350;

function formatarData(data: string): string {
  const [, mes, dia] = data.split("-");

  return `${dia}/${mes}`;
}

export default function LeituraChart({
  data,
  periodo,
  metaLeitura,
}: ReadingChartProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStylesChart(modoEscuro);
  const colors = obterCores(modoEscuro);

  const maiorValor = Math.max(
    ...data.map((item) => item.pages_read),
    metaLeitura,
    1,
  );

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
            {[...data].reverse().map((item) => {
              const altura = (item.pages_read / maiorValor) * 100;

              return (
                <View key={item.date} style={styles.column}>
                  <Text style={styles.value}>{item.pages_read} pág.</Text>

                  <View style={styles.barArea}>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          {
                            height: `${altura}%`,
                            backgroundColor: colors.readingColor,
                            borderRadius: 10,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <Text style={styles.date}>{formatarData(item.date)}</Text>
                </View>
              );
            })}

            {/* Linha visual da meta */}
            {metaLeitura <= maiorValor && (
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 28 + (metaLeitura / maiorValor) * ALTURA_BARRA,
                  borderTopWidth: 1,
                  borderTopColor: colors.lineMeta,
                  borderStyle: "dashed",
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 3,
                    fontSize: 10,
                    fontWeight: "600",
                    color: colors.lineMeta,
                  }}
                >
                  Meta: {metaLeitura} pág.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
