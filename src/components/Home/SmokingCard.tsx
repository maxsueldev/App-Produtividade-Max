import { useTheme } from "@/context/ThemeContext";
import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { StyleSheet, Text, View } from "react-native";

interface SmokingCardProps {
  total: number;
  morning: number;
  afternoon: number;
  night: number;
  metaCigarros: number;
}

export default function SmokingCard({
  total,
  morning,
  afternoon,
  night,
  metaCigarros,
}: SmokingCardProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const porcentagem =
    metaCigarros > 0
      ? total <= metaCigarros
        ? 100
        : Math.max((metaCigarros / total) * 100, 0)
      : 0;

  const dentroDaMeta = total <= metaCigarros;
  const diferenca = Math.abs(total - metaCigarros);

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>🚬 Cigarros</Text>

      <View style={globalStyles.totalContainer}>
        <Text style={styles.total}>{total}</Text>

        <View>
          <Text style={globalStyles.totalLabel}>consumidos</Text>
          <Text style={globalStyles.goal}>meta: {metaCigarros} por dia</Text>
        </View>
      </View>

      <View style={globalStyles.progressBackground}>
        <View
          style={[
            globalStyles.progress,
            { backgroundColor: colors.smokingColor, width: `${porcentagem}%` },
          ]}
        />
      </View>

      <Text style={globalStyles.percentage}>
        {Math.round(porcentagem)}% da meta
      </Text>

      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.status,
            {
              color: dentroDaMeta ? colors.statusSuccess : colors.statusWarning,
            },
          ]}
        >
          {dentroDaMeta
            ? `✓ ${diferenca} ${
                diferenca === 1 ? "cigarro" : "cigarros"
              } abaixo da meta`
            : `⚠ ${diferenca} ${
                diferenca === 1 ? "cigarro" : "cigarros"
              } acima da meta`}
        </Text>
      </View>

      <View style={styles.periods}>
        <View style={styles.period}>
          <Text style={styles.periodLabel}>Manhã</Text>
          <Text style={styles.periodValue}>{morning}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.period}>
          <Text style={styles.periodLabel}>Tarde</Text>
          <Text style={styles.periodValue}>{afternoon}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.period}>
          <Text style={styles.periodLabel}>Noite</Text>
          <Text style={styles.periodValue}>{night}</Text>
        </View>
      </View>
    </View>
  );
}

const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    total: {
      fontSize: 42,
      fontWeight: "700",
      color: colors.text,
    },

    statusContainer: {
      marginTop: 12,
      marginBottom: 18,
    },

    status: {
      fontSize: 13,
      fontWeight: "600",
    },

    periods: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    period: {
      flex: 1,
      alignItems: "center",
    },

    periodLabel: {
      fontSize: 12,
      color: colors.secondaryText,
      marginBottom: 4,
    },

    periodValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },

    divider: {
      width: 1,
      height: 32,
      backgroundColor: colors.divider,
    },
  });
};
