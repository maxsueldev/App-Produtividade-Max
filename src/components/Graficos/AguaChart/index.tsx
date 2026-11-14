import { useTheme } from "@/context/ThemeContext";
import { ScrollView, Text, View } from "react-native";

import { criarStylesChart } from "../stylesChart";
import { criarStyles as criarStylesReg } from "./styles";

import type { WaterChartData } from "@/database/graficos";

interface AguaChartProps {
  data: WaterChartData[];
  periodo: 7 | 30 | 90;
  metaAgua: number;
}

const ALTURA_BARRA = 170;
const LARGURA_POR_DIA = 60;
const LARGURA_MINIMA = 350;

function formatarData(data: string): string {
  const [, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

function formatarAgua(ml: number): string {
  if (ml >= 1000) {
    const litros = ml / 1000;

    return Number.isInteger(litros) ? `${litros}L` : `${litros.toFixed(1)}L`;
  }

  return `${ml}ml`;
}

export default function AguaChart({ data, metaAgua }: AguaChartProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStylesChart(modoEscuro);
  const stylesReg = criarStylesReg(modoEscuro);

  const maiorValor = Math.max(
    ...data.map((item) => item.water_ml),
    metaAgua,
    1,
  );

  const posicaoMeta = (metaAgua / maiorValor) * ALTURA_BARRA;

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
            {[500, 1500, metaAgua].map((ml) => {
              if (ml > maiorValor) {
                return null;
              }

              const posicao = (ml / maiorValor) * ALTURA_BARRA;

              return (
                <View
                  key={ml}
                  pointerEvents="none"
                  style={[
                    stylesReg.referenceLine,
                    {
                      bottom: 28 + posicao,
                    },
                  ]}
                >
                  <Text style={stylesReg.referenceText}>
                    {formatarAgua(ml)}
                  </Text>
                </View>
              );
            })}

            {[...data].reverse().map((item) => {
              const altura = (item.water_ml / maiorValor) * 100;

              return (
                <View key={item.date} style={styles.column}>
                  <Text style={styles.value}>
                    {formatarAgua(item.water_ml)}
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
                Meta: {formatarAgua(metaAgua)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
