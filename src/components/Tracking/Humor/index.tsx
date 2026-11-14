import { useTheme } from "@/context/ThemeContext";
import createGlobalStyles from "@/styles/globalStyles";
import { Dispatch, SetStateAction } from "react";
import { Text, View } from "react-native";
import Rating from "../../Utils/Rating";

interface HumorProps {
  mood: number;
  setMood: Dispatch<SetStateAction<number>>;
}

const Humor = ({ mood, setMood }: HumorProps) => {
  const { modoEscuro } = useTheme();
  const globalStyles = createGlobalStyles(modoEscuro);

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>😊 Humor</Text>

      <Rating value={mood} onChange={setMood} />
    </View>
  );
};

export default Humor;
