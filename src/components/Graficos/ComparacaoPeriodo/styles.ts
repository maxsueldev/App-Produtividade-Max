import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    container: {
      marginTop: 2,
      marginBottom: 2,
    },

    title: {
      fontSize: 19,
      fontWeight: "700",
      color: colors.cardTitle,
      marginBottom: 4,
    },

    subtitle: {
      fontSize: 11,
      color: colors.cardDescription,
      marginBottom: 14,
    },

    item: {
      backgroundColor: colors.cardBgItem,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
    },

    itemHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    icon: {
      fontSize: 20,
      marginRight: 7,
    },

    itemTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.filterTitle,
    },

    values: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    label: {
      fontSize: 10,
      color: "#999999",
      marginBottom: 2,
    },

    value: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.value,
    },

    previous: {
      alignItems: "flex-end",
    },

    previousValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.subtitle,
    },

    arrowContainer: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },

    variation: {
      fontSize: 13,
      fontWeight: "700",
    },

    variationPositive: {
      color: colors.statusSuccess,
    },

    variationNegative: {
      color: colors.negativeStatus,
    },
  });
};

export default criarStyles;
