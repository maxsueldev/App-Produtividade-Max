import { useTheme } from "@/context/ThemeContext";
import ICabecalho from "@/interfaces/ICabecalho";
import { Text, View } from "react-native";

import criarGlobalStyles from "@/styles/globalStyles";
import { criarStyles } from "./styles";

const Cabecalho = ({ title, subtitle }: ICabecalho) => {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = criarGlobalStyles(modoEscuro);

  return (
    <View style={globalStyles.headerContainer}>
      <View style={[globalStyles.header, styles.headerCabecalho]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

export default Cabecalho;
