import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    container: {
      marginTop: 10,
    },

    legend: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 20,
      marginBottom: 15,
    },

    legendItem: {
      flexDirection: "row",
      alignItems: "center",
    },

    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 5,
    },

    energyDot: {
      backgroundColor: colors.energy,
    },

    moodDot: {
      backgroundColor: colors.mood,
    },

    legendText: {
      fontSize: 12,
      color: colors.text,
    },

    scrollContent: {
      paddingRight: 40,
    },

    chartWrapper: {
      flexDirection: "row",
      height: 250,
    },

    yAxis: {
      width: 25,
      height: 200,
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingVertical: 2,
      marginRight: 5,
    },

    yAxisLabel: {
      fontSize: 10,
      color: colors.secondaryText,
    },

    chartArea: {
      height: 250,
      position: "relative",
      width: "100%",
    },

    valuesLayer: {
      position: "absolute",
      top: -24,
      left: 0,
      height: 25,
    },

    valueGroup: {
      position: "absolute",
      width: 30,
      alignItems: "center",
    },

    energyValue: {
      fontSize: 10,
      color: colors.energy,
      fontWeight: "600",
    },

    moodValue: {
      fontSize: 10,
      color: colors.mood,
      fontWeight: "600",
    },

    datesLayer: {
      position: "absolute",
      top: 207,
      left: 0,
      height: 25,
    },

    date: {
      position: "absolute",
      width: 40,
      textAlign: "center",
      fontSize: 10,
      color: colors.text,
    },

    referenceDot: {
      backgroundColor: "#9CA3AF",
    },

    metaLine: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 1,
      borderTopWidth: 1,
      borderStyle: "dashed",
      borderColor: colors.lineMeta,
      zIndex: 10,
    },

    metaText: {
      position: "absolute",
      right: 0,
      bottom: 4,
      fontSize: 10,
      color: colors.lineMeta,
      backgroundColor: colors.fundoTexto,
      paddingHorizontal: 4,
    },

    chartScrollArea: {
      width: "100%",
      overflow: "hidden",
    },
  });
};

export default criarStyles;
