import { criarStyles } from "@/app/registrar/styles";
import { useTheme } from "@/context/ThemeContext";
import { criarEstudo, removerEstudo } from "@/functions/estudos";
import type IStudyForm from "@/interfaces/IStudyForm";
import { obterCores } from "@/styles/colors";
import createGlobalStyles from "@/styles/globalStyles";
import type { Dispatch, SetStateAction } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { criarStylesStudy } from "./styles";

interface EstudosProps {
  studies: IStudyForm[];
  setStudies: Dispatch<SetStateAction<IStudyForm[]>>;

  studySubject: string;
  setStudySubject: Dispatch<SetStateAction<string>>;

  studyMinutes: string;
  setStudyMinutes: Dispatch<SetStateAction<string>>;

  questionsTotal: string;
  setQuestionsTotal: Dispatch<SetStateAction<string>>;

  questionsCorrect: string;
  setQuestionsCorrect: Dispatch<SetStateAction<string>>;

  showStudyForm: boolean;
  setShowStudyForm: Dispatch<SetStateAction<boolean>>;
}

const Estudos = ({
  studies,
  setStudies,
  studySubject,
  setStudySubject,
  studyMinutes,
  setStudyMinutes,
  questionsTotal,
  setQuestionsTotal,
  questionsCorrect,
  setQuestionsCorrect,
  showStudyForm,
  setShowStudyForm,
}: EstudosProps) => {
  const { modoEscuro } = useTheme();
  const styles = criarStyles(modoEscuro);
  const stylesStudy = criarStylesStudy(modoEscuro);
  const globalStyles = createGlobalStyles(modoEscuro);
  const colors = obterCores(modoEscuro);

  function adicionarEstudo() {
    const minutos = Number(studyMinutes);

    const total = questionsTotal.trim() === "" ? 0 : Number(questionsTotal);

    const acertos =
      questionsCorrect.trim() === "" ? 0 : Number(questionsCorrect);

    if (!studySubject.trim()) {
      return;
    }

    if (!studyMinutes || !Number.isFinite(minutos) || minutos <= 0) {
      return;
    }

    if (!Number.isFinite(total) || total < 0) {
      return;
    }

    if (!Number.isFinite(acertos) || acertos < 0) {
      return;
    }

    if (acertos > total) {
      return;
    }

    const novoEstudo = criarEstudo({
      subject: studySubject.trim(),
      minutes: studyMinutes,
      questionsTotal: String(total),
      questionsCorrect: String(acertos),
    });

    if (!novoEstudo) {
      return;
    }

    setStudies((currentStudies) => [...currentStudies, novoEstudo]);

    setStudySubject("");
    setStudyMinutes("");
    setQuestionsTotal("");
    setQuestionsCorrect("");

    setShowStudyForm(false);
  }

  function handleRemoverEstudo(id: number) {
    setStudies((currentStudies) => removerEstudo(currentStudies, id));
  }

  function cancelarEstudo() {
    setStudySubject("");
    setStudyMinutes("");
    setQuestionsTotal("");
    setQuestionsCorrect("");
    setShowStudyForm(false);
  }

  const erros =
    questionsTotal !== "" && questionsCorrect !== ""
      ? Math.max(0, Number(questionsTotal) - Number(questionsCorrect))
      : null;

  return (
    <View style={globalStyles.cardContainer}>
      <Text style={globalStyles.cardTitle}>📚 Estudos</Text>

      {studies.length === 0 && !showStudyForm && (
        <Text style={globalStyles.emptyText}>
          Nenhuma sessão de estudo registrada.
        </Text>
      )}

      {studies.map((study) => (
        <View key={study.id} style={stylesStudy.studyItem}>
          <View style={stylesStudy.studyInfo}>
            <Text style={stylesStudy.studySubject}>{study.subject}</Text>

            <Text style={stylesStudy.studyDuration}>
              {study.duration} minutos
            </Text>

            <Text style={stylesStudy.studyQuestions}>
              {study.questionsTotal} questões • {study.questionsCorrect} acertos
              • {study.questionsWrong} erros
            </Text>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoverEstudo(study.id)}
          >
            <Text style={styles.removeButtonText}>−</Text>
          </TouchableOpacity>
        </View>
      ))}

      {showStudyForm && (
        <View style={stylesStudy.studyForm}>
          <View>
            <Text style={globalStyles.label}>Matéria</Text>

            <TextInput
              style={globalStyles.input}
              placeholder="Ex: Português"
              placeholderTextColor={colors.placeholder}
              value={studySubject}
              onChangeText={setStudySubject}
            />
          </View>
          <View>
            <Text style={globalStyles.label}>Tempo estudado (minutos)</Text>

            <TextInput
              style={globalStyles.input}
              placeholder="Ex: 90"
              placeholderTextColor={colors.placeholder}
              value={studyMinutes}
              onChangeText={setStudyMinutes}
              keyboardType="numeric"
            />
          </View>
          <View>
            <Text style={globalStyles.label}>Questões totais</Text>

            <TextInput
              style={globalStyles.input}
              placeholder="Ex: 20"
              placeholderTextColor={colors.placeholder}
              value={questionsTotal}
              onChangeText={setQuestionsTotal}
              keyboardType="numeric"
            />
          </View>
          <View>
            <Text style={globalStyles.label}>Acertos</Text>

            <TextInput
              style={globalStyles.input}
              placeholder="Ex: 17"
              placeholderTextColor={colors.placeholder}
              value={questionsCorrect}
              onChangeText={setQuestionsCorrect}
              keyboardType="numeric"
            />
            {erros !== null && (
              <Text style={stylesStudy.calculatedErrors}>Erros: {erros}</Text>
            )}
          </View>

          <View style={stylesStudy.studyFormButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelarEstudo}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addButton}
              onPress={adicionarEstudo}
            >
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!showStudyForm && (
        <TouchableOpacity
          style={stylesStudy.addStudyButton}
          onPress={() => setShowStudyForm(true)}
        >
          <Text style={stylesStudy.studySubject}>＋ Adicionar estudo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Estudos;
