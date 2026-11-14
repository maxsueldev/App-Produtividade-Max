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
      marginBottom: 16,
    },

    list: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },

    item: {
      width: "48%",
      backgroundColor: colors.cardBgItem,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      minHeight: 112,
    },

    icon: {
      fontSize: 26,
      marginBottom: 8,
    },

    info: {
      flex: 1,
    },

    label: {
      fontSize: 11,
      color: "#999999",
      lineHeight: 15,
      marginBottom: 3,
    },

    value: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.value,
    },

    date: {
      fontSize: 10,
      color: "#999999",
      marginTop: 4,
    },
  });
};

export default criarStyles;
