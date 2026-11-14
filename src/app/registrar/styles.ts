import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    content: {
      padding: 20,
      paddingBottom: 40,
    },

    primaryButton: {
      flex: 1,
      backgroundColor: colors.statusSuccess,
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
    },

    secondaryButton: {
      flex: 1,
      backgroundColor: colors.secondaryButton,
      padding: 14,
      borderRadius: 12,
      alignItems: "center",
    },

    buttonText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.buttonText,
    },

    buttonTextWhite: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.white,
    },

    saveButton: {
      backgroundColor: "#222222",
      paddingVertical: 17,
      borderRadius: 14,
      alignItems: "center",
      marginTop: 5,
    },

    saveButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "bold",
    },

    removeButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: "#F1F1F1",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 10,
    },

    removeButtonText: {
      fontSize: 24,
      color: "#777777",
    },

    cancelButton: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 12,
      backgroundColor: colors.secondaryButton,
      alignItems: "center",
    },

    cancelButtonText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#555555",
    },

    addButton: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 12,
      backgroundColor: "#222222",
      alignItems: "center",
    },

    addButtonText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.white,
    },

    deleteButton: {
      marginTop: 12,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: colors.deleteConfigText,
    },

    deleteButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "700",
    },
  });
};
