import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStylesChart = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    chartContainer: {
      marginTop: 10,
      marginBottom: 10,
    },

    // =========================
    // GRÁFICO
    // =========================

    chart: {
      height: 260,
    },

    columns: {
      height: 230,
      position: "relative",
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },

    column: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "flex-end",
      marginHorizontal: 3,
      position: "relative",
    },

    // Valor acima da barra
    value: {
      position: "absolute",
      top: 0,
      fontSize: 10,
      fontWeight: "600",
      color: colors.value,
    },

    // Área da barra
    barArea: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 28,
      height: 170,
      alignItems: "center",
      justifyContent: "flex-end",
    },

    // Fundo da barra
    barContainer: {
      width: "48%",
      minWidth: 12,
      maxWidth: 28,
      height: 170,
      justifyContent: "flex-end",
      backgroundColor: colors.barBackground,
      borderRadius: 10,
      overflow: "hidden",
    },

    // Data
    date: {
      position: "absolute",
      bottom: 2,
      fontSize: 10,
      fontWeight: "500",
      color: colors.arrow,
    },
  });
};

export default criarStylesChart;
