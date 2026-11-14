import { useTheme } from "@/context/ThemeContext";
import { carregarHabitos } from "@/functions/habitos";
import IHabitWithRecord from "@/interfaces/IHabitWithRecord";
import createGlobalStyles from "@/styles/globalStyles";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { createStylesHabit } from "./styles";

interface HabitosProps {
  habits: IHabitWithRecord[];
  setHabits: Dispatch<SetStateAction<IHabitWithRecord[]>>;
}

const Habitos = ({ habits, setHabits }: HabitosProps) => {
  const { modoEscuro } = useTheme();
  const globalStyles = createGlobalStyles(modoEscuro);
  const stylesHabit = createStylesHabit(modoEscuro);

  useEffect(() => {
    atualizarHabitos();
  }, []);

  async function atualizarHabitos() {
    try {
      const lista = await carregarHabitos();
      setHabits(lista);
    } catch (error) {
      console.error("Erro ao carregar hábitos:", error);
    }
  }

  function alternarHabito(habitId: number) {
    setHabits((currentHabits) =>
      currentHabits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              completed: !habit.completed,
            }
          : habit,
      ),
    );
  }

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>✅ Hábitos</Text>

      {habits.length === 0 && (
        <Text style={globalStyles.emptyText}>Nenhum hábito registrado.</Text>
      )}

      {habits.map((habit) => (
        <View key={habit.id} style={stylesHabit.habitItem}>
          <TouchableOpacity
            style={[
              stylesHabit.habitCheck,
              habit.completed && stylesHabit.habitCheckCompleted,
              habit.completed &&
                modoEscuro && {
                  borderColor: "#FFFFFF",
                },
            ]}
            onPress={() => alternarHabito(habit.id)}
          >
            <Text
              style={[
                stylesHabit.habitCheckText,
                modoEscuro && {
                  color: "#FFFFFF",
                },
              ]}
            >
              {habit.completed ? "✓" : ""}
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              stylesHabit.habitName,
              modoEscuro && {
                color: "#FFFFFF",
              },
              habit.completed && stylesHabit.habitCompleted,
              habit.completed &&
                modoEscuro && {
                  color: "#888888",
                },
            ]}
          >
            {habit.name}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default Habitos;
