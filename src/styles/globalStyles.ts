import { StyleSheet } from "react-native";
import { obterCores } from "./colors";

function createGlobalStyles(modoEscuro: boolean) {
  const colors = obterCores(modoEscuro);
  return StyleSheet.create({
    headerContainer: {
      width: "100%",
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },

    cardContainer: {
      backgroundColor: colors.cardContainer,
      borderRadius: 18,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.cardContainer,
      elevation: 3,
    },

    cardTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.cardTitle,
      marginBottom: 14,
    },

    cardDescription: {
      fontSize: 14,
      color: colors.secondaryText,
      marginTop: 5,
    },

    totalContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
    },

    goal: {
      fontSize: 12,
      color: colors.mutedText,
      marginTop: 2,
    },

    progressBackground: {
      height: 8,
      backgroundColor: colors.progressBackground,
      borderRadius: 10,
      overflow: "hidden",
    },

    progress: {
      height: "100%",
      borderRadius: 10,
    },

    percentage: {
      fontSize: 14,
      color: colors.subtitle,
      marginTop: 5,
    },

    totalLabel: {
      fontSize: 14,
      color: colors.secondaryText,
    },

    emptyText: {
      fontSize: 14,
      textAlign: "center",
      lineHeight: 20,
      color: colors.emptyText,
    },

    bigValue: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },

    pagination: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.pagination,
    },

    input: {
      height: 48,
      borderRadius: 10,
      paddingHorizontal: 14,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      fontSize: 15,
      color: colors.text,
    },

    label: {
      fontSize: 14,
      color: colors.secondaryText,
      marginBottom: 7,
    },
  });
}

export default createGlobalStyles;
