import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: colors.backgroundScreenContainer,
    },

    container: {
      paddingBottom: 30,
      gap: 18,
      backgroundColor: colors.backgroundScreenContainer,
    },

    headerIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.headerIconBackground,
      alignItems: "center",
      justifyContent: "center",
    },

    headerIconText: {
      fontSize: 27,
    },

    headerContent: {
      flex: 1,
      gap: 3,
    },

    title: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.title,
    },

    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.subtitle,
    },

    summaryCard: {
      padding: 16,
      borderRadius: 18,
      backgroundColor: colors.summaryBackground,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 16,
    },

    summaryTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.summaryTitle,
    },

    summaryTotal: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.summaryTotal,
    },

    summaryItems: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    summaryItem: {
      alignItems: "center",
      gap: 3,
      minWidth: 48,
    },

    summaryIcon: {
      fontSize: 20,
    },

    summaryNumber: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.summaryNumber,
    },

    summaryLabel: {
      fontSize: 10,
      color: colors.summaryLabel,
    },

    filterSection: {
      gap: 9,
    },

    filterTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.filterTitle,
    },

    filters: {
      gap: 8,
      paddingVertical: 2,
    },

    filterButton: {
      minWidth: 44,
      height: 42,
      paddingHorizontal: 13,
      borderRadius: 12,
      backgroundColor: colors.cardBgItem,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      alignItems: "center",
      justifyContent: "center",
    },

    filterButtonActive: {
      backgroundColor: colors.filterActiveBackground,
      borderColor: colors.filterActiveBorder,
    },

    filterButtonText: {
      fontSize: 17,
      color: colors.filterText,
    },

    filterButtonTextActive: {
      color: colors.filterActiveText,
    },

    timeline: {
      gap: 0,
    },

    timelineItem: {
      flexDirection: "row",
    },

    timelineMarkerColumn: {
      width: 48,
      alignItems: "center",
    },

    timelineDot: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: colors.timelineDotBackground,
      borderWidth: 1,
      borderColor: colors.timelineDotBorder,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    },

    timelineDotText: {
      fontSize: 19,
    },

    timelineLine: {
      width: 2,
      flex: 1,
      minHeight: 18,
      backgroundColor: colors.divider,
    },

    timelineContent: {
      flex: 1,
      paddingLeft: 12,
      paddingBottom: 22,
      gap: 7,
    },

    weekHeader: {
      paddingTop: 2,
    },

    weekDate: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.filterText,
    },

    card: {
      backgroundColor: colors.cardContainer,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.divider,
      gap: 13,

      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.05,
      shadowRadius: 7,
      elevation: 2,
    },

    category: {
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },

    categoryIcon: {
      fontSize: 21,
    },

    cardTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.summaryTitle,
    },

    message: {
      fontSize: 15,
      lineHeight: 23,
      color: colors.filterTitle,
    },

    noResults: {
      alignItems: "center",
      paddingVertical: 35,
      paddingHorizontal: 20,
      gap: 8,
    },

    noResultsIcon: {
      fontSize: 34,
      marginBottom: 2,
    },

    noResultsTitle: {
      fontSize: 17,
      fontWeight: "800",
      textAlign: "center",
      color: colors.filterTitle,
    },

    noResultsText: {
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
      color: colors.noResultsText,
    },

    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 50,
      paddingHorizontal: 25,
      gap: 10,
      backgroundColor: colors.backgroundScreenContainer,
    },

    emptyIconContainer: {
      width: 78,
      height: 78,
      borderRadius: 24,
      backgroundColor: colors.headerIconBackground,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 5,
    },

    emptyIcon: {
      fontSize: 42,
    },

    emptyTitle: {
      fontSize: 19,
      fontWeight: "800",
      textAlign: "center",
      color: colors.emptyTitle,
    },
  });
};

export default criarStyles;
