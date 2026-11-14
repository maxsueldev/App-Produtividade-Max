import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    content: {
      padding: 20,
      paddingBottom: 40,
    },

    // =========================
    // CARDS
    // =========================

    card: {
      backgroundColor: colors.cardContainer,
      borderRadius: 18,
      padding: 18,
      marginTop: 18,
      elevation: 3,
    },

    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 14,
    },

    // =========================
    // LINHAS
    // =========================

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },

    date: {
      fontSize: 15,
      color: colors.secondaryText,
    },

    value: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },

    // =========================
    // FILTRO DE PERÍODO
    // =========================

    periodContainer: {
      flexDirection: "row",
      marginTop: 18,
      marginBottom: 2,
    },

    insightsButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.buttonBackground,
      borderColor: colors.buttonBorder,
      borderWidth: 1,
      alignItems: "center",
      marginBottom: 10,
    },

    insightsButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },
  });
};

export default criarStyles;
