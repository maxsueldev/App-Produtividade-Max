import { useTheme } from "@/context/ThemeContext";
import { ScrollView, Text, View } from "react-native";
import { criarStylesChart } from "../stylesChart";
import { criarStyles as criarStylesReg } from "./styles";

import type { SmokingChartData } from "@/database/graficos";

interface CigarrosChartProps {
  data: SmokingChartData[];
  periodo: 7 | 30 | 90;
  metaCigarros: number;
}

const ALTURA_BARRA = 170;
const LARGURA_POR_DIA = 60;
const LARGURA_MINIMA = 350;

function formatarData(data: string): string {
  const [, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

export default function CigarrosChart({
  data,
  metaCigarros,
}: CigarrosChartProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStylesChart(modoEscuro);
  const stylesReg = criarStylesReg(modoEscuro);

  const maiorValor = Math.max(
    ...data.map((item) => item.total),
    metaCigarros,
    1,
  );

  const posicaoMeta = (metaCigarros / maiorValor) * ALTURA_BARRA;

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
            {[5, 10, metaCigarros].map((quantidade) => {
              if (quantidade > maiorValor) {
                return null;
              }

              const posicao = (quantidade / maiorValor) * ALTURA_BARRA;

              return (
                <View
                  key={quantidade}
                  pointerEvents="none"
                  style={[
                    stylesReg.referenceLine,
                    {
                      bottom: 28 + posicao,
                    },
                  ]}
                >
                  <Text style={stylesReg.referenceText}>{quantidade}</Text>
                </View>
              );
            })}

            {[...data].reverse().map((item) => {
              const altura = (item.total / maiorValor) * 100;

              return (
                <View key={item.date} style={styles.column}>
                  <Text style={styles.value}>{item.total}</Text>

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
              <Text style={stylesReg.metaText}>Limite: {metaCigarros}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
