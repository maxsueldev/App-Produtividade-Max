import { Text, TouchableOpacity, View } from "react-native";

import type IRatingProps from "@/interfaces/IRatingProps";

import styles from "./styles";

export default function Rating({ value, onChange }: IRatingProps) {
  return (
    <View style={styles.rating}>
      {[1, 2, 3, 4, 5].map((item) => (
        <TouchableOpacity key={item} onPress={() => onChange(item)}>
          <Text style={[styles.star, item <= value && styles.selectedStar]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
