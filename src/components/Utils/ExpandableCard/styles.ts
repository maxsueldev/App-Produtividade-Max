import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    card: {
      backgroundColor: colors.cardContainer,
      borderRadius: 18,
      marginTop: 18,
      elevation: 3,
      overflow: "hidden",
    },

    header: {
      minHeight: 56,
      paddingHorizontal: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: "600",
      color: colors.counterText,
    },

    arrow: {
      fontSize: 14,
      color: colors.arrow,
      marginLeft: 12,
    },

    content: {
      paddingHorizontal: 18,
      paddingBottom: 18,
    },
  });
};

export default criarStyles;
