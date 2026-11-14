import { useTheme } from "@/context/ThemeContext";
import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { StyleSheet, Text, View } from "react-native";

interface Habit {
  id: number;
  name: string;
  completed: boolean;
}

interface HabitCardProps {
  total: number;
  completed: number;
  habits: Habit[];
}

export default function HabitCard({
  total,
  completed,
  habits,
}: HabitCardProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const porcentagem = total > 0 ? Math.min((completed / total) * 100, 100) : 0;

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>🎯 Hábitos</Text>

      {total === 0 ? (
        <Text style={globalStyles.emptyText}>Nenhum hábito cadastrado.</Text>
      ) : (
        <>
          <View style={globalStyles.totalContainer}>
            <Text style={styles.total}>
              {completed}/{total}
            </Text>

            <View>
              <Text style={globalStyles.totalLabel}>hábitos concluídos</Text>

              <Text style={globalStyles.goal}>meta: concluir todos</Text>
            </View>
          </View>

          <View style={globalStyles.progressBackground}>
            <View
              style={[
                globalStyles.progress,
                {
                  backgroundColor: colors.habitColor,
                  width: `${porcentagem}%`,
                },
              ]}
            />
          </View>

          <Text style={globalStyles.percentage}>
            {Math.round(porcentagem)}% da meta
          </Text>

          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.status,
                {
                  color:
                    completed === total
                      ? colors.statusSuccess
                      : colors.statusWarning,
                },
              ]}
            >
              {completed === total
                ? "✓ Todos os hábitos foram concluídos!"
                : `Faltam ${total - completed} ${
                    total - completed === 1 ? "hábito" : "hábitos"
                  }`}
            </Text>
          </View>

          <View style={styles.habits}>
            {habits.map((habit) => (
              <View key={habit.id} style={styles.habit}>
                <Text
                  style={[
                    styles.habitIcon,
                    habit.completed
                      ? styles.habitIconCompleted
                      : styles.habitIconPending,
                  ]}
                >
                  {habit.completed ? "✓" : "○"}
                </Text>

                <Text
                  style={[
                    styles.habitName,
                    habit.completed && styles.habitCompleted,
                  ]}
                >
                  {habit.name}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    total: {
      fontSize: 36,
      fontWeight: "700",
      color: colors.text,
    },

    statusContainer: {
      marginTop: 12,
      marginBottom: 16,
    },

    status: {
      fontSize: 13,
      fontWeight: "600",
    },

    habits: {
      gap: 10,
    },

    habit: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    habitIcon: {
      fontSize: 18,
      fontWeight: "700",
      width: 22,
    },

    habitIconCompleted: {
      color: colors.statusSuccess,
    },

    habitIconPending: {
      color: colors.secondaryText,
    },

    habitName: {
      fontSize: 14,
      color: colors.habitName,
    },

    habitCompleted: {
      textDecorationLine: "line-through",
      color: colors.mutedText,
    },
  });
};
