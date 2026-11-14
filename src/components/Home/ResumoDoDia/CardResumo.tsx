import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { criarStyles } from "./styles";

interface CardResumoProps {
  icon: string;
  value: number | string;
  final: string;
}

const CardResumo = ({ icon, value, final }: CardResumoProps) => {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);

  return (
    <View style={styles.item}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.contentCard}>
        <Text style={styles.valueCard}>{value}</Text>
        <Text style={styles.description}>{final}</Text>
      </View>
    </View>
  );
};

export default CardResumo;
