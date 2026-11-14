import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStylesStudy = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    studyItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
    },

    studyInfo: {
      flex: 1,
    },

    studySubject: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.cardTitle,
    },

    studyDuration: {
      fontSize: 14,
      color: "#777",
      marginTop: 3,
    },

    studyForm: {
      display: "flex",
      gap: 20,
      marginTop: 20,
    },

    studyFormButtons: {
      flexDirection: "row",
      gap: 10,
    },

    addStudyButton: {
      marginTop: 15,
      paddingVertical: 13,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#DDDDDD",
      alignItems: "center",
    },

    addStudyButtonText: {
      fontSize: 15,
      fontWeight: "600",
      color: "#444",
    },

    studyQuestions: {
      fontSize: 13,
      color: "#888",
      marginTop: 3,
    },

    calculatedErrors: {
      fontSize: 14,
      color: "#777",
      marginBottom: 15,
      fontWeight: "600",
    },
  });
};
