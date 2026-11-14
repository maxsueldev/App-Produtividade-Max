import { obterCores } from "@/styles/colors";
import { StyleSheet } from "react-native";

export function criarStyles(modoEscuro: boolean) {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    meta: {
      fontSize: 14,
      color: colors.subtitle,
      marginBottom: 16,
    },
  });
}
