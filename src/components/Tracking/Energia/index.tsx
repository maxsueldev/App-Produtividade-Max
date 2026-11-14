import { useTheme } from "@/context/ThemeContext";
import createGlobalStyles from "@/styles/globalStyles";
import { Dispatch, SetStateAction } from "react";
import { Text, View } from "react-native";
import Rating from "../../Utils/Rating";

interface EnergiaProps {
  energy: number;
  setEnergy: Dispatch<SetStateAction<number>>;
}

const Energia = ({ energy, setEnergy }: EnergiaProps) => {
  const { modoEscuro } = useTheme();
  const globalStyles = createGlobalStyles(modoEscuro);

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>⚡ Energia</Text>

      <Rating value={energy} onChange={setEnergy} />
    </View>
  );
};

export default Energia;
