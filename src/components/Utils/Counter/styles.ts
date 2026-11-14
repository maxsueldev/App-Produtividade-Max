import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    counter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      backgroundColor: colors.counter,
      borderBottomColor: "#EEEEEE",
    },

    counterLabel: {
      fontSize: 16,
      color: colors.text,
    },

    counterControls: {
      flexDirection: "row",
      alignItems: "center",
    },

    counterButton: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: colors.counterBgItem,
      borderColor: colors.counterBorder,
      alignItems: "center",
      justifyContent: "center",
    },

    counterButtonText: {
      fontSize: 22,
      color: colors.cardTitle,
    },

    counterValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginHorizontal: 18,
    },
  });
};
