import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    container: {
      marginTop: 2,
      marginBottom: 2,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },

    card: {
      width: "48%",
      backgroundColor: colors.cardBgItem,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      minHeight: 116,
    },

    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 9,
    },

    icon: {
      fontSize: 19,
      marginRight: 7,
    },

    cardTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.cardTitle,
    },

    value: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.value,
      marginBottom: 4,
    },

    description: {
      fontSize: 10,
      color: colors.cardDescription,
      marginBottom: 9,
    },

    progressBackground: {
      width: "100%",
      height: 7,
      backgroundColor: colors.progressBackground,
      borderRadius: 10,
      overflow: "hidden",
    },

    progressBar: {
      height: "100%",
      borderRadius: 10,
    },

    studyProgress: {
      backgroundColor: colors.studyColor,
    },

    smokingProgress: {
      backgroundColor: colors.smokingColor,
    },

    waterProgress: {
      backgroundColor: colors.waterColor,
    },

    sleepProgress: {
      backgroundColor: colors.sleepColor,
    },

    moodProgress: {
      backgroundColor: colors.moodColor,
    },

    energyProgress: {
      backgroundColor: colors.moodColor,
    },

    habitProgress: {
      backgroundColor: colors.habitColor,
    },

    readingProgress: {
      backgroundColor: colors.readingColor,
    },
  });
};

export default criarStyles;
