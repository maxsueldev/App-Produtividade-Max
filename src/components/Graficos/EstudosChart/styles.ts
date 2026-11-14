import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  const cores = {
    textoMeta: modoEscuro ? "#FFB74D" : "#C87500",
  };

  return StyleSheet.create({
    // =========================
    // BARRAS
    // =========================

    bar: {
      width: "100%",
      backgroundColor: colors.studyColor,
      borderRadius: 10,
    },

    // =========================
    // META
    // =========================

    metaLine: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 1,
      borderTopWidth: 1,
      borderStyle: "dashed",
      borderColor: colors.lineMeta,
      zIndex: 10,
    },

    metaText: {
      position: "absolute",
      right: 0,
      bottom: 5,
      fontSize: 10,
      fontWeight: "600",
      color: cores.textoMeta,
      backgroundColor: colors.fundoTexto,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 5,
    },

    // =========================
    // LINHAS DE REFERÊNCIA
    // =========================

    referenceLine: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 1,
      borderTopWidth: 1,
      borderStyle: "dotted",
      borderColor: colors.referencia,
      zIndex: 1,
    },

    referenceText: {
      position: "absolute",
      left: 0,
      bottom: 3,
      fontSize: 9,
      color: colors.referenciaTexto,
      backgroundColor: colors.fundoTexto,
      paddingRight: 5,
    },
  });
};

export default criarStyles;
