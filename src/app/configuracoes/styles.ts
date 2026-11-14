import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    section: {
      marginBottom: 20,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "700" as const,
      marginBottom: 4,
      color: colors.text,
      opacity: 0.7,
    },

    card: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: colors.cardBgConfigItem,
    },

    inputContainer: {
      marginBottom: 14,
    },

    label: {
      fontSize: 13,
      fontWeight: "600" as const,
      marginBottom: 6,
      color: colors.text,
    },

    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: 10,
    },

    deleteButton: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      gap: 12,
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.deleteConfigBackground,
      borderColor: "#3A3A3A",
      borderWidth: 1,
    },

    deleteTitle: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: colors.deleteConfigText,
    },

    deleteDescription: {
      fontSize: 13,
      marginTop: 3,
      color: colors.deleteConfigText,
      opacity: 0.7,
    },

    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
    },

    settingInfo: {
      flex: 1,
      paddingRight: 12,
    },

    settingTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },

    settingDescription: {
      fontSize: 12,
      color: colors.secondaryText,
      marginTop: 3,
    },

    smallInput: {
      width: 70,
      height: 42,
      borderRadius: 10,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      textAlign: "center",
      fontSize: 15,
      color: colors.text,
    },

    timeInput: {
      width: 75,
      height: 42,
      borderRadius: 10,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      textAlign: "center",
      fontSize: 15,
      color: colors.text,
    },

    backupsTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 10,
      color: colors.text,
    },

    emptyBackup: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 24,
      borderRadius: 12,
      backgroundColor: colors.emptyBackground,
    },

    emptyBackupText: {
      fontSize: 13,
      color: colors.secondaryText,
      marginTop: 8,
    },

    exportButton: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 64,
      gap: 12,
      paddingVertical: 10,
    },

    exportButtonIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.iconBackground,
    },

    exportButtonContent: {
      flex: 1,
    },

    exportButtonTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },

    exportButtonDescription: {
      fontSize: 12,
      color: colors.secondaryText,
      marginTop: 3,
    },

    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: 50,
      borderRadius: 14,
      backgroundColor: colors.primary,
      marginBottom: 20,
    },

    saveButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: "700",
    },

    reminderGroup: {
      marginBottom: 4,
    },

    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },

    timeNumber: {
      width: 28,
      fontSize: 14,
      color: colors.secondaryText,
    },

    removeTimeButton: {
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 6,
    },

    addTimeButton: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 14,
      paddingVertical: 8,
    },

    addTimeText: {
      marginLeft: 6,
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },

    habitAddContainer: {
      paddingVertical: 8,
    },

    habitAddRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      gap: 8,
    },

    habitInput: {
      flex: 1,
      height: 42,
      borderRadius: 10,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      paddingHorizontal: 12,
      fontSize: 15,
      color: colors.text,
    },

    habitAddButton: {
      width: 42,
      height: 42,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
    },

    habitRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      gap: 4,
    },

    habitInfo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    habitName: {
      flex: 1,
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
    },

    habitActionButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },

    emptyHabits: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 24,
      borderRadius: 12,
      backgroundColor: colors.emptyBackground,
    },

    emptyHabitsText: {
      fontSize: 13,
      color: colors.secondaryText,
      marginTop: 8,
    },

    remindersGrid: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
    },

    remindersColumn: {
      width: "42%",
      gap: 10,
    },
  });
};

export default criarStyles;
