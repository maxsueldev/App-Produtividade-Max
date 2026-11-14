import { useTheme } from "@/context/ThemeContext";
import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import { StyleSheet, Text, View } from "react-native";

interface StudySubject {
  subject: string;
  duration_minutes: number;
  questions_total: number;
  questions_correct: number;
  questions_wrong: number;
}

interface StudyCardProps {
  totalMinutes: number;
  subjects: StudySubject[];
  metaEstudo: number;
  metaQuestoes: number;
}

function formatarMinutos(minutos: number): string {
  if (minutos <= 0) {
    return "0min";
  }

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (horas === 0) {
    return `${minutosRestantes}min`;
  }

  if (minutosRestantes === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${minutosRestantes}min`;
}

export default function StudyCard({
  totalMinutes,
  subjects,
  metaEstudo,
  metaQuestoes,
}: StudyCardProps) {
  const { modoEscuro } = useTheme();

  const styles = criarStyles(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  const porcentagemEstudo =
    metaEstudo > 0 ? Math.min((totalMinutes / metaEstudo) * 100, 100) : 0;

  const totalQuestoes = subjects.reduce(
    (total, subject) => total + subject.questions_total,
    0,
  );

  const porcentagemQuestoes =
    metaQuestoes > 0 ? Math.min((totalQuestoes / metaQuestoes) * 100, 100) : 0;

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>📚 Estudos</Text>

      {/* META DE TEMPO */}
      <View style={styles.metaSection}>
        <View style={styles.valueRow}>
          <Text style={globalStyles.bigValue}>
            {formatarMinutos(totalMinutes)}
          </Text>

          <Text style={globalStyles.goal}>/ {formatarMinutos(metaEstudo)}</Text>
        </View>

        <View style={globalStyles.progressBackground}>
          <View
            style={[
              globalStyles.progress,
              {
                backgroundColor: colors.studyColor,
                width: `${porcentagemEstudo}%`,
              },
            ]}
          />
        </View>

        <Text style={globalStyles.percentage}>
          {Math.round(porcentagemEstudo)}% da meta
        </Text>
      </View>

      {/* META DE QUESTÕES */}
      <View style={styles.metaSection}>
        <View style={styles.valueRow}>
          <Text style={globalStyles.bigValue}>{totalQuestoes}</Text>

          <Text style={globalStyles.goal}>/ {metaQuestoes} questões</Text>
        </View>

        <View style={globalStyles.progressBackground}>
          <View
            style={[
              globalStyles.progress,
              {
                backgroundColor: colors.studyColor,
                width: `${porcentagemQuestoes}%`,
              },
            ]}
          />
        </View>

        <Text style={globalStyles.percentage}>
          {Math.round(porcentagemQuestoes)}% da meta
        </Text>
      </View>

      {/* MATÉRIAS */}
      {subjects.length > 0 && (
        <View style={styles.subjectsContainer}>
          {subjects.map((subject) => (
            <View key={subject.subject} style={styles.subject}>
              <Text style={styles.subjectName}>
                {subject.subject}

                <Text style={styles.subjectDuration}>
                  - {formatarMinutos(subject.duration_minutes)}
                </Text>
              </Text>

              <Text style={styles.subjectInfo}>
                {subject.questions_total} questões • {subject.questions_correct}{" "}
                acertos • {subject.questions_wrong} erros
              </Text>
            </View>
          ))}
        </View>
      )}

      {subjects.length === 0 && (
        <Text style={globalStyles.emptyText}>
          Nenhum estudo registrado hoje.
        </Text>
      )}
    </View>
  );
}

const criarStyles = (modoEscuro: boolean) => {
  const colors = obterCores(modoEscuro);

  return StyleSheet.create({
    metaSection: {
      marginBottom: 20,
    },

    valueRow: {
      flexDirection: "row",
      alignItems: "baseline",
    },

    subjectsContainer: {
      marginTop: 0,
    },

    subject: {
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    subjectName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.title,
    },

    subjectDuration: {
      fontWeight: "normal",
      color: colors.title,
    },

    subjectInfo: {
      fontSize: 14,
      color: colors.secondaryText,
      marginTop: 4,
    },
  });
};
