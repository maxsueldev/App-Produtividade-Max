import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    goalProgress: {
      height: "100%",
      backgroundColor: colors.sleepColor,
      borderRadius: 10,
    },

    bar: {
      width: "100%",
      backgroundColor: colors.sleepColor,
      borderRadius: 8,
    },

    metaLine: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 1,
      borderTopWidth: 1,
      borderStyle: "dashed",
      borderTopColor: colors.lineMeta,
      zIndex: 10,
    },

    metaText: {
      position: "absolute",
      right: 0,
      bottom: 4,
      fontSize: 10,
      color: colors.lineMeta,
      backgroundColor: colors.fundoTexto,
      paddingHorizontal: 4,
    },

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
      paddingRight: 4,
    },
  });
};

export default criarStyles;
