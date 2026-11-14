import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const createStylesHabit = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    habitItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },

    habitCheck: {
      width: 28,
      height: 28,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.habitCheck,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    habitCheckText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },

    habitName: {
      flex: 1,
      fontSize: 16,
      color: "#333",
    },

    habitForm: {
      marginTop: 10,
    },

    habitCheckCompleted: {
      borderColor: "#222",
    },

    habitCompleted: {
      textDecorationLine: "line-through",
      color: "#999",
    },
  });
};
