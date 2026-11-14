import React, { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

import { useTheme } from "@/context/ThemeContext";

import createGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "./styles";

interface MoodEnergyChartData {
  date: string;
  energy: number;
  mood: number;
}

interface HumorEnergiaChartProps {
  data: MoodEnergyChartData[];
  mostrarHumor: boolean;
  mostrarEnergia: boolean;
}

const ALTURA_GRAFICO = 200;
const MARGEM_VERTICAL = 12;
const REFERENCIA_HUMOR_ENERGIA = 3;
const MARGEM_HORIZONTAL = 20;
const LARGURA_EIXO_Y = 30;

const LARGURA_POR_DIA = 60;
const LARGURA_MINIMA = 350;

function formatarData(data: string): string {
  const [, mes, dia] = data.split("-");
  return `${dia}/${mes}`;
}

function limitarValor(valor: number): number {
  return Math.max(0, Math.min(valor, 5));
}

export default function HumorEnergiaChart({
  data,
  mostrarHumor,
  mostrarEnergia,
}: HumorEnergiaChartProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);

  const [larguraContainer, setLarguraContainer] = useState(0);

  const larguraGrafico = useMemo(() => {
    if (larguraContainer <= 0) {
      return 1;
    }

    const larguraDisponivel = Math.max(larguraContainer - LARGURA_EIXO_Y, 1);

    if (data.length <= 7) {
      return larguraDisponivel;
    }

    const larguraMinima = Math.max(
      data.length * LARGURA_POR_DIA,
      LARGURA_MINIMA,
    );

    return Math.max(larguraDisponivel, larguraMinima);
  }, [data.length, larguraContainer]);

  const espacamento = useMemo(() => {
    if (data.length <= 1) {
      return 0;
    }

    return (larguraGrafico - MARGEM_HORIZONTAL * 2) / (data.length - 1);
  }, [data.length, larguraGrafico]);

  function calcularY(valor: number): number {
    const valorLimitado = limitarValor(valor);
    const alturaUtil = ALTURA_GRAFICO - MARGEM_VERTICAL * 2;

    return MARGEM_VERTICAL + alturaUtil - (valorLimitado / 5) * alturaUtil;
  }

  function deveMostrarData(index: number): boolean {
    if (dadosInvertidos.length <= 7) {
      return true;
    }

    if (dadosInvertidos.length <= 30) {
      return index % 5 === 0 || index === dadosInvertidos.length - 1;
    }

    return index % 10 === 0 || index === dadosInvertidos.length - 1;
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[globalStyles.emptyText, { paddingVertical: 30 }]}>
          Nenhum registro de humor e energia.
        </Text>
      </View>
    );
  }

  // Cria uma cópia para não alterar o array original.
  // O dia mais recente (hoje) ficará primeiro.
  const dadosInvertidos = [...data].reverse();

  const yReferencia = calcularY(REFERENCIA_HUMOR_ENERGIA);

  const grafico = (
    <View
      style={[
        styles.chartWrapper,
        {
          width: larguraGrafico + LARGURA_EIXO_Y,
        },
      ]}
    >
      <View
        style={[
          styles.yAxis,
          {
            width: LARGURA_EIXO_Y,
            height: ALTURA_GRAFICO,
            position: "relative",
          },
        ]}
      >
        {[5, 4, 3, 2, 1, 0].map((valor) => {
          const y = calcularY(valor);

          return (
            <Text
              key={valor}
              style={[
                styles.yAxisLabel,
                {
                  position: "absolute",
                  top: y - 9,
                  right: 5,
                },
              ]}
            >
              {valor}
            </Text>
          );
        })}
      </View>

      <View
        style={[
          styles.chartArea,
          {
            width: larguraGrafico,
          },
        ]}
      >
        <Svg
          width={larguraGrafico}
          height={ALTURA_GRAFICO}
          viewBox={`0 0 ${larguraGrafico} ${ALTURA_GRAFICO}`}
        >
          {[0, 1, 2, 3, 4, 5].map((valor) => {
            const y = calcularY(valor);

            return (
              <Line
                key={`grid-${valor}`}
                x1={0}
                y1={y}
                x2={larguraGrafico}
                y2={y}
                stroke={modoEscuro ? "#333333" : "#E5E7EB"}
                strokeWidth={1}
              />
            );
          })}

          <Line
            x1={0}
            y1={yReferencia}
            x2={larguraGrafico}
            y2={yReferencia}
            stroke={modoEscuro ? "#777777" : "#9CA3AF"}
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />

          {/* Linha de energia */}
          {mostrarEnergia &&
            dadosInvertidos.map((item, index) => {
              if (index === 0) {
                return null;
              }

              const anterior = dadosInvertidos[index - 1];

              const x1 = MARGEM_HORIZONTAL + (index - 1) * espacamento;

              const x2 = MARGEM_HORIZONTAL + index * espacamento;

              return (
                <Line
                  key={`energy-line-${item.date}`}
                  x1={x1}
                  y1={calcularY(anterior.energy)}
                  x2={x2}
                  y2={calcularY(item.energy)}
                  stroke="#FF9800"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              );
            })}

          {/* Linha de humor */}
          {mostrarHumor &&
            dadosInvertidos.map((item, index) => {
              if (index === 0) {
                return null;
              }

              const anterior = dadosInvertidos[index - 1];

              const x1 = MARGEM_HORIZONTAL + (index - 1) * espacamento;

              const x2 = MARGEM_HORIZONTAL + index * espacamento;

              return (
                <Line
                  key={`mood-line-${item.date}`}
                  x1={x1}
                  y1={calcularY(anterior.mood)}
                  x2={x2}
                  y2={calcularY(item.mood)}
                  stroke="#2196F3"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              );
            })}

          {/* Pontos */}
          {dadosInvertidos.map((item, index) => {
            const x = MARGEM_HORIZONTAL + index * espacamento;

            return (
              <React.Fragment key={item.date}>
                {mostrarEnergia && (
                  <Circle
                    cx={x}
                    cy={calcularY(item.energy)}
                    r={4}
                    fill="#FF9800"
                  />
                )}

                {mostrarHumor && (
                  <Circle
                    cx={x}
                    cy={calcularY(item.mood)}
                    r={4}
                    fill="#2196F3"
                  />
                )}
              </React.Fragment>
            );
          })}
        </Svg>

        {/* Valores */}
        <View
          style={[
            styles.valuesLayer,
            {
              width: larguraGrafico,
            },
          ]}
        >
          {dadosInvertidos.map((item, index) => {
            const x = MARGEM_HORIZONTAL + index * espacamento;

            return (
              <View
                key={`values-${item.date}`}
                style={[
                  styles.valueGroup,
                  {
                    left: x - 15,
                  },
                ]}
              >
                {mostrarEnergia && (
                  <Text style={styles.energyValue}>{item.energy}</Text>
                )}

                {mostrarHumor && (
                  <Text style={styles.moodValue}>{item.mood}</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Datas */}
        <View
          style={[
            styles.datesLayer,
            {
              width: larguraGrafico,
            },
          ]}
        >
          {dadosInvertidos.map((item, index) => {
            if (!deveMostrarData(index)) {
              return null;
            }

            const x = MARGEM_HORIZONTAL + index * espacamento;

            let left = x - 20;

            if (index === 0) {
              left = 0;
            }

            if (index === dadosInvertidos.length - 1) {
              left = larguraGrafico - 40;
            }

            return (
              <Text
                key={`date-${item.date}`}
                style={[
                  styles.date,
                  {
                    left,
                  },
                ]}
              >
                {formatarData(item.date)}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        setLarguraContainer(event.nativeEvent.layout.width);
      }}
    >
      <View style={styles.legend}>
        {mostrarEnergia && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.energyDot]} />

            <Text style={styles.legendText}>Energia</Text>
          </View>
        )}

        {mostrarHumor && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.moodDot]} />

            <Text style={styles.legendText}>Humor</Text>
          </View>
        )}

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.referenceDot]} />

          <Text style={styles.legendText}>Referência: 3</Text>
        </View>
      </View>

      {data.length <= 7 ? (
        <View style={styles.chartScrollArea}>{grafico}</View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
        >
          {grafico}
        </ScrollView>
      )}
    </View>
  );
}
