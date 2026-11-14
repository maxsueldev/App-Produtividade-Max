import type IStudyForm from "@/interfaces/IStudyForm";

interface CriarEstudoParams {
  subject: string;
  minutes: string;
  questionsTotal: string;
  questionsCorrect: string;
}

export function criarEstudo({
  subject,
  minutes,
  questionsTotal,
  questionsCorrect,
}: CriarEstudoParams): IStudyForm | null {
  // Matéria e tempo continuam obrigatórios
  if (!subject.trim() || !minutes.trim()) {
    return null;
  }

  const duration = Number(minutes);

  // Se não informou questões, considera 0
  const total = questionsTotal.trim() ? Number(questionsTotal) : 0;
  const correct = questionsCorrect.trim() ? Number(questionsCorrect) : 0;

  // Verifica se os números são válidos
  if (Number.isNaN(duration) || Number.isNaN(total) || Number.isNaN(correct)) {
    return null;
  }

  // Valores inválidos
  if (duration <= 0 || total < 0 || correct < 0) {
    return null;
  }

  // Não pode ter mais acertos que questões
  if (correct > total) {
    return null;
  }

  return {
    id: Date.now(),
    subject: subject.trim(),
    duration,
    questionsTotal: total,
    questionsCorrect: correct,
    questionsWrong: total - correct,
  };
}

export function removerEstudo(studies: IStudyForm[], id: number): IStudyForm[] {
  return studies.filter((study) => study.id !== id);
}
