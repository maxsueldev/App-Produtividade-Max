import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    container: {
      marginTop: 10,
      marginBottom: 10,
    },

    /* =========================
       DESTAQUE PRINCIPAL
    ========================= */

    destaque: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
    },

    destaqueLabel: {
      fontSize: 12,
      color: colors.secondaryText,
      marginBottom: 5,
    },

    destaqueValue: {
      fontSize: 30,
      fontWeight: "700",
      color: colors.cardTitle,
    },

    destaqueDescricao: {
      fontSize: 11,
      color: colors.destaqueDescricao,
      marginTop: 5,
    },

    /* =========================
       INDICADORES
    ========================= */

    grid: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 14,
    },

    item: {
      flex: 1,
      backgroundColor: colors.cardBgItem,
      borderRadius: 14,
      padding: 13,
      borderWidth: 1,
      borderColor: colors.border,
    },

    label: {
      fontSize: 11,
      color: colors.mutedText,
      marginBottom: 6,
    },

    value: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.cardTitle,
    },

    /* =========================
       DESEMPENHO
    ========================= */

    desempenho: {
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },

    desempenhoTitulo: {
      fontSize: 13,
      fontWeight: "600",
      color: modoEscuro ? "#E0E0E0" : "#444444",
      marginBottom: 12,
    },

    questoes: {
      flexDirection: "row",
      gap: 8,
    },

    questaoItem: {
      flex: 1,
      backgroundColor: colors.questaoBackground,
      borderRadius: 12,
      padding: 11,
    },

    questaoLabel: {
      fontSize: 11,
      color: colors.lightText,
      marginBottom: 5,
    },

    questaoValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.cardTitle,
    },

    /* =========================
       TAXA DE ACERTO
    ========================= */

    taxa: {
      marginTop: 12,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
    },

    taxaLabel: {
      fontSize: 12,
      color: colors.secondaryText,
      marginBottom: 7,
    },

    taxaValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.cardTitle,
    },

    /* =========================
       BARRA DA TAXA
    ========================= */

    taxaBarra: {
      height: 7,
      backgroundColor: colors.taxaBarBackground,
      borderRadius: 4,
      overflow: "hidden",
      marginTop: 8,
    },

    taxaProgresso: {
      height: "100%",
      borderRadius: 4,
    },

    days: {
      marginTop: 6,
      fontSize: 12,
      color: colors.mutedText,
      textAlign: "center",
    },

    totalLabel: {
      fontSize: 11,
      color: modoEscuro ? "#B5A5A5" : "#8A7777",
      marginBottom: 3,
    },

    totalRow: {
      flexDirection: "row",
      alignItems: "baseline",
    },

    totalValue: {
      fontSize: 30,
      fontWeight: "800",
      color: colors.cardTitle,
    },

    totalUnit: {
      fontSize: 12,
      color: colors.mutedText,
      marginLeft: 5,
    },

    goalProgressLabel: {
      fontSize: 11,
      color: colors.mutedText,
    },

    goalProgressValue: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.cardTitle,
    },

    goalProgressBar: {
      height: 7,
      backgroundColor: colors.progressBackground,
      borderRadius: 4,
      overflow: "hidden",
    },

    goalProgressFill: {
      height: "100%",
      borderRadius: 4,
    },

    cigarrosTotalSection: {
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      marginBottom: 10,
    },

    mediaCigarros: {
      fontSize: 13,
      color: colors.mutedText,
      marginTop: 4,
    },

    limiteCigarros: {
      fontSize: 11,
      color: colors.lightText,
      marginTop: 10,
      textAlign: "center",
    },

    aguaTotalSection: {
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      marginBottom: 10,
    },

    mediaAgua: {
      fontSize: 13,
      color: colors.mutedText,
      marginTop: 4,
    },

    metaAgua: {
      fontSize: 11,
      color: colors.lightText,
      marginTop: 10,
      textAlign: "center",
    },

    sonoTotalSection: {
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      marginBottom: 10,
    },

    energiaHumorTotalSection: {
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      marginBottom: 10,
    },

    mediaSono: {
      fontSize: 13,
      color: colors.mutedText,
      marginTop: 4,
    },

    metaSono: {
      fontSize: 11,
      color: colors.lightText,
      marginTop: 10,
      textAlign: "center",
    },

    habitosTotalSection: {
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      marginBottom: 10,
    },

    mediaHabitos: {
      fontSize: 13,
      color: colors.mutedText,
      marginTop: 4,
    },

    metaHabitos: {
      fontSize: 11,
      color: colors.lightText,
      marginTop: 10,
      textAlign: "center",
    },

    cigarrosInfoRow: {
      flexDirection: "row",
      marginTop: 18,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.cigarrosSeparator,
    },

    cigarrosInfoItem: {
      flex: 1,
      alignItems: "flex-end",
    },

    cigarrosInfoDivider: {
      width: 1,
      height: 38,
      backgroundColor: colors.cigarrosDivider,
    },

    cigarrosInfoLabel: {
      fontSize: 11,
      color: colors.lightText,
      marginBottom: 4,
    },

    cigarrosInfoValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.cardTitle,
    },

    metaCard: {
      backgroundColor: colors.metaCardBackground,
      borderRadius: 16,
      padding: 16,
      marginTop: 14,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.metaCardBorder,
    },

    metaDireita: {
      alignItems: "flex-end",
    },

    metaLabel: {
      fontSize: 11,
      color: colors.lightText,
      marginBottom: 4,
    },

    metaValue: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.cardTitle,
    },

    metaBarra: {
      height: 8,
      backgroundColor: colors.metaBarBackground,
      borderRadius: 4,
      overflow: "hidden",
      marginTop: 16,
    },

    metaProgresso: {
      height: "100%",
      borderRadius: 4,
    },

    metaRestante: {
      fontSize: 11,
      color: colors.mutedText,
      marginTop: 9,
    },
  });
};

export default criarStyles;
