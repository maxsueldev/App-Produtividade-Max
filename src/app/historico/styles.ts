import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.backgroundScreenContainer,
    },

    card: {
      marginHorizontal: 10,
      marginBottom: 24,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      color: colors.text,
    },

    list: {
      paddingBottom: 30,
    },

    date: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },

    description: {
      marginTop: 5,
      color: colors.secondaryText,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    content: {
      padding: 20,
      paddingBottom: 40,
    },

    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundScreenContainer,
    },

    loadingText: {
      fontSize: 16,
      color: colors.secondaryText,
    },

    backButton: {
      marginBottom: 20,
    },

    backText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
    },

    headerIcon: {
      fontSize: 36,
      marginRight: 12,
    },

    headerTitle: {
      fontSize: 25,
      fontWeight: "bold",
      color: colors.text,
    },

    headerDate: {
      fontSize: 16,
      color: colors.mutedText,
      marginTop: 3,
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 6,
    },

    infoLabel: {
      fontSize: 15,
      color: colors.secondaryText,
    },

    infoValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },

    separator: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: 15,
    },

    studyContainer: {
      backgroundColor: colors.innerBackground,
      borderRadius: 10,
      padding: 12,
      marginBottom: 10,
    },

    studySubject: {
      fontSize: 17,
      fontWeight: "bold",
      marginBottom: 8,
      color: colors.text,
    },

    totalBox: {
      marginTop: 15,
      padding: 12,
      borderRadius: 10,
      backgroundColor: colors.totalBackground,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    totalLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },

    totalValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },

    metric: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
    },

    metricLabel: {
      fontSize: 16,
      color: colors.secondaryText,
    },

    metricValue: {
      fontSize: 17,
      fontWeight: "bold",
      color: colors.text,
    },

    habitRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 7,
    },

    habitIcon: {
      fontSize: 20,
      marginRight: 10,
    },

    habitName: {
      fontSize: 16,
      color: colors.text,
    },

    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },

    summaryItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      width: "48%",
    },

    icon: {
      fontSize: 25,
      marginRight: 8,
      marginTop: 2,
    },

    label: {
      fontSize: 12,
      color: colors.mutedText,
    },

    value: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      marginTop: 2,
    },

    details: {
      textAlign: "right",
      fontSize: 13,
      color: colors.secondaryText,
      marginTop: 5,
    },

    desempenho: {
      marginBottom: 16,
    },

    desempenhoLabel: {
      fontSize: 12,
      color: colors.mutedText,
    },

    desempenhoPorcentagem: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },

    desempenhoBarra: {
      height: 9,
      backgroundColor: colors.progressBackground,
      borderRadius: 5,
      overflow: "hidden",
    },

    desempenhoProgresso: {
      height: "100%",
      backgroundColor: colors.statusSuccess,
      borderRadius: 5,
    },

    excluirButton: {
      backgroundColor: colors.deleteButton,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
    },

    excluirButtonText: {
      color: colors.deleteButtonText,
      fontSize: 16,
      fontWeight: "700",
    },

    studySubjects: {
      marginTop: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: modoEscuro ? "#333333" : "#E0E0E0",
    },

    studySubjectsTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: modoEscuro ? "#FFFFFF" : "#333333",
      marginBottom: 6,
    },

    studySubjectsList: {
      gap: 3,
    },

    studyContent: {
      flex: 1,
      alignItems: "flex-start",
    },

    studySubjectName: {
      fontSize: 13,
      color: modoEscuro ? "#AAAAAA" : "#666666",
      marginTop: 6,
      lineHeight: 18,
    },

    pagination: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 14,
    },

    paginationButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: modoEscuro ? "#333333" : "#E5E5E5",
    },

    paginationButtonDisabled: {
      opacity: 0.4,
    },
  });
};

export default criarStyles;
