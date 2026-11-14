import { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity } from "react-native";

import styles from "./styles";

type Periodo = 7 | 30 | 90;

interface PeriodoBotaoProps {
  value: Periodo;
  periodo: number;
  setPeriodo: Dispatch<SetStateAction<Periodo>>;
  setMostrarInsights: Dispatch<SetStateAction<boolean>>;
}

const PeriodoBotao = ({
  value,
  periodo,
  setPeriodo,
  setMostrarInsights,
}: PeriodoBotaoProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.periodButton,
        periodo === value && styles.periodButtonActive,
      ]}
      onPress={() => {
        setPeriodo(value);
        setMostrarInsights(false);
      }}
    >
      <Text
        style={[
          styles.periodButtonText,
          periodo === value && styles.periodButtonTextActive,
        ]}
      >
        {value} dias
      </Text>
    </TouchableOpacity>
  );
};

export default PeriodoBotao;
