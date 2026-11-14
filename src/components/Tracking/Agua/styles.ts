import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStylesWater = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    waterValue: {
      fontSize: 32,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
      color: colors.value,
    },

    waterButtons: {
      flexDirection: "row",
      gap: 10,
    },
  });
};
