import { useTheme } from "@/context/ThemeContext";
import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { StyleSheet, Text, View } from "react-native";

interface WaterCardProps {
  waterMl: number;
  metaAgua: number;
}

export default function WaterCard({ waterMl, metaAgua }: WaterCardProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const litros = waterMl / 1000;

  const porcentagem =
    metaAgua > 0 ? Math.min((waterMl / metaAgua) * 100, 100) : 0;

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>💧 Água</Text>

      <View style={styles.valueRow}>
        <Text style={globalStyles.bigValue}>
          {litros.toFixed(1).replace(".", ",")} L
        </Text>

        <Text style={[globalStyles.goal, { marginBottom: 16 }]}>
          / {metaAgua / 1000} L
        </Text>
      </View>

      <View style={globalStyles.progressBackground}>
        <View
          style={[
            globalStyles.progress,
            {
              backgroundColor: colors.waterColor,
              width: `${porcentagem}%`,
            },
          ]}
        />
      </View>

      <Text style={globalStyles.percentage}>
        {Math.round(porcentagem)}% da meta
      </Text>
    </View>
  );
}

const criarStyles = (modoEscuro: boolean) => {
  return StyleSheet.create({
    valueRow: {
      flexDirection: "row",
      alignItems: "baseline",
    },
  });
};
