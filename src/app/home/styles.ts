import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  return StyleSheet.create({
    content: {
      padding: 20,
    },

    energyMoodContainer: {
      flexDirection: "row",
      gap: 15,
      marginBottom: 15,
    },
  });
};

export default criarStyles;
