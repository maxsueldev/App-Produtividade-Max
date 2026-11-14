import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export function criarStyles(modoEscuro: boolean) {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    item: {
      width: "48%",
      minHeight: 64,
      backgroundColor: colors.cardBgItem,
      borderRadius: 14,
      padding: 11,
      flexDirection: "row",
      alignItems: "center",
    },

    icon: {
      fontSize: 22,
      marginRight: 9,
    },

    contentCard: {
      flex: 1,
    },

    valueCard: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.cardTitle,
    },

    description: {
      fontSize: 11,
      color: colors.cardDescription,
      marginTop: 2,
    },
  });
}
