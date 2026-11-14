import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundNavigationContainer,
      borderTopColor: colors.borderNavigationContainer,
      borderTopWidth: 1,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingTop: 10,
      paddingBottom: 23,
    },

    item: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },

    icon: {
      fontSize: 22,
      marginBottom: 3,
    },

    label: {
      fontSize: 12,
      color: modoEscuro ? "#FFFFFF" : "#666",
    },
  });
};

export default criarStyles;
