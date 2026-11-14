import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    headerCabecalho: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 28,
    },

    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.title,
    },

    subtitle: {
      fontSize: 16,
      color: colors.subtitle,
      marginTop: 4,
    },
  });
};

export default criarStyles;
