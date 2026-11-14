import { useTheme } from "@/context/ThemeContext";
import { Text, TextInput, View } from "react-native";

import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "./styles";

interface LeituraProps {
  pagesRead: number;
  setPagesRead: (value: number) => void;
  metaLeitura: number;
}

export default function Leitura({
  pagesRead,
  setPagesRead,
  metaLeitura,
}: LeituraProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>📖 Leitura</Text>

      <Text style={styles.meta}>Meta diária: {metaLeitura} páginas</Text>

      <Text style={globalStyles.label}>Páginas lidas hoje</Text>

      <TextInput
        value={pagesRead === 0 ? "" : String(pagesRead)}
        onChangeText={(value) => {
          const numero = Number(value.replace(/[^0-9]/g, ""));

          setPagesRead(Number.isFinite(numero) ? numero : 0);
        }}
        keyboardType="number-pad"
        placeholder="Ex.: 20"
        placeholderTextColor={colors.placeholder}
        style={globalStyles.input}
      />
    </View>
  );
}
