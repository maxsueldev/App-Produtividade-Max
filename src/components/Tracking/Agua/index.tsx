import { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

import { criarStyles } from "@/app/registrar/styles";
import createGlobalStyles from "@/styles/globalStyles";
import { criarStylesWater } from "./styles";

interface AguaProps {
  water: number;
  setWater: Dispatch<SetStateAction<number>>;
}

const Agua = ({ water, setWater }: AguaProps) => {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const stylesWater = criarStylesWater(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>💧 Água</Text>

      <Text style={stylesWater.waterValue}>{water} ml</Text>

      <View style={stylesWater.waterButtons}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setWater((value) => Math.max(0, value - 250))}
        >
          <Text style={styles.buttonText}>- 250 ml</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setWater((value) => value + 250)}
        >
          <Text style={styles.buttonTextWhite}>+ 250 ml</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Agua;
