import { useTheme } from "@/context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";

import type ICounterProps from "@/interfaces/ICounterProps";

import { criarStyles } from "./styles";

export default function Counter({
  label,
  value,
  onDecrease,
  onIncrease,
}: ICounterProps) {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);

  return (
    <View style={styles.counter}>
      <Text style={styles.counterLabel}>{label}</Text>

      <View style={styles.counterControls}>
        <TouchableOpacity style={styles.counterButton} onPress={onDecrease}>
          <Text style={styles.counterButtonText}>−</Text>
        </TouchableOpacity>

        <Text style={styles.counterValue}>{value}</Text>

        <TouchableOpacity style={styles.counterButton} onPress={onIncrease}>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
