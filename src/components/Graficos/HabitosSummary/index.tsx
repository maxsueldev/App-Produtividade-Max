import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

import { obterCores } from "@/styles/colors";
import { criarStyles } from "../stylesSummary";

interface HabitChartData {
  date: string;
  total: number;
  completed: number;
}

interface HabitosSummaryProps {
  data: HabitChartData[];
  periodo: 7 | 30 | 90;
}

export default function HabitosSummary({ data, periodo }: HabitosSummaryProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const completados = data.reduce((total, item) => total + item.completed, 0);

  const totalHabitos = data.reduce((total, item) => total + item.total, 0);

  const mediaDiaria = data.length > 0 ? Math.round(completados / periodo) : 0;

  const menoresDias =
    data.length > 0 ? Math.min(...data.map((item) => item.completed)) : 0;

  const maioresDias =
    data.length > 0 ? Math.max(...data.map((item) => item.completed)) : 0;

  const diasNaMeta = data.filter(
    (item) => item.total > 0 && item.completed === item.total,
  ).length;

  return (
    <View style={styles.container}>
      {/* Total */}
      <View
        style={[
          styles.destaque,
          {
            backgroundColor: colors.destaqueBackgroundHabit,
            borderColor: colors.destaqueBorderHabit,
          },
        ]}
      >
        <Text style={styles.destaqueLabel}>Hábitos concluídos no período</Text>

        <View style={styles.totalRow}>
          <Text style={styles.totalValue}>
            {completados}/{totalHabitos}
          </Text>
        </View>
      </View>

      {/* Média + Dias na meta */}
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Média diária</Text>

          <Text style={styles.value}>
            {mediaDiaria} <Text style={styles.label}>hábitos concluídos</Text>
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Dias na meta</Text>

          <Text style={styles.value}>
            {diasNaMeta}/{periodo}
          </Text>
        </View>
      </View>

      {/* Menor + Maior */}
      <View style={styles.grid}>
        <View style={styles.item}>
          <Text style={styles.label}>Menor dia</Text>

          <Text style={styles.value}>
            {menoresDias} <Text style={styles.label}>conclusões</Text>
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Maior dia</Text>

          <Text style={styles.value}>
            {maioresDias} <Text style={styles.label}>conclusões</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
