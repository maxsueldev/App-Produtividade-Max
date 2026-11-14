import type { InsightCandidato, MetricasSemana } from "./tipos";

export function analisarHabitos(
  atual: MetricasSemana,
  anterior: MetricasSemana,
): InsightCandidato | null {
  if (atual.taxaHabitos === null) {
    return null;
  }

  if (
    anterior.taxaHabitos !== null &&
    atual.taxaHabitos > anterior.taxaHabitos + 10
  ) {
    const diferenca = Math.round(atual.taxaHabitos - anterior.taxaHabitos);

    return {
      tipo: "habitos",
      pontuacao: Math.min(60 + diferenca, 100),
      mensagem: `✅ Sua taxa de conclusão dos hábitos aumentou de ${Math.round(
        anterior.taxaHabitos,
      )}% para ${Math.round(atual.taxaHabitos)}%.`,
      evidencias: [
        {
          metrica: "Taxa de conclusão dos hábitos",
          valorAtual: Math.round(atual.taxaHabitos),
          valorAnterior: Math.round(anterior.taxaHabitos),
          diferencaPercentual: diferenca,
          diasAnalisados: atual.diasRegistrados,
        },
      ],
    };
  }

  if (
    anterior.taxaHabitos !== null &&
    atual.taxaHabitos < anterior.taxaHabitos - 10
  ) {
    const diferenca = Math.round(anterior.taxaHabitos - atual.taxaHabitos);

    return {
      tipo: "habitos",
      pontuacao: Math.min(60 + diferenca, 100),
      mensagem: `✅ Sua taxa de conclusão dos hábitos caiu de ${Math.round(
        anterior.taxaHabitos,
      )}% para ${Math.round(atual.taxaHabitos)}%.`,
      evidencias: [
        {
          metrica: "Taxa de conclusão dos hábitos",
          valorAtual: Math.round(atual.taxaHabitos),
          valorAnterior: Math.round(anterior.taxaHabitos),
          diferencaPercentual: -diferenca,
          diasAnalisados: atual.diasRegistrados,
        },
      ],
    };
  }

  if (atual.taxaHabitos >= 90) {
    return {
      tipo: "habitos",
      pontuacao: 85,
      mensagem: `✅ Você concluiu ${Math.round(
        atual.taxaHabitos,
      )}% dos seus hábitos possíveis nesta semana.`,
      evidencias: [
        {
          metrica: "Taxa de conclusão dos hábitos",
          valorAtual: Math.round(atual.taxaHabitos),
          diasAnalisados: atual.diasRegistrados,
        },
      ],
    };
  }

  return null;
}
