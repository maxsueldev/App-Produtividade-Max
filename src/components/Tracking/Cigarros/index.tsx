import { Dispatch, SetStateAction } from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import Counter from "../../Utils/Counter";

import { criarStyles } from "@/app/registrar/styles";
import createGlobalStyles from "@/styles/globalStyles";

interface CigarrosProps {
  morningCigarettes: number;
  setMorningCigarettes: Dispatch<SetStateAction<number>>;
  afternoonCigarettes: number;
  setAfternoonCigarettes: Dispatch<SetStateAction<number>>;
  nightCigarettes: number;
  setNightCigarettes: Dispatch<SetStateAction<number>>;
}

const Cigarros = ({
  morningCigarettes,
  setMorningCigarettes,
  afternoonCigarettes,
  setAfternoonCigarettes,
  nightCigarettes,
  setNightCigarettes,
}: CigarrosProps) => {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>🚬 Cigarros</Text>

      <Counter
        label="Manhã"
        value={morningCigarettes}
        onDecrease={() =>
          setMorningCigarettes((value) => Math.max(0, value - 1))
        }
        onIncrease={() => setMorningCigarettes((value) => value + 1)}
      />

      <Counter
        label="Tarde"
        value={afternoonCigarettes}
        onDecrease={() =>
          setAfternoonCigarettes((value) => Math.max(0, value - 1))
        }
        onIncrease={() => setAfternoonCigarettes((value) => value + 1)}
      />

      <Counter
        label="Noite"
        value={nightCigarettes}
        onDecrease={() => setNightCigarettes((value) => Math.max(0, value - 1))}
        onIncrease={() => setNightCigarettes((value) => value + 1)}
      />
    </View>
  );
};

export default Cigarros;
