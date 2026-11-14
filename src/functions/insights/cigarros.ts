import type { InsightCandidato, MetricasSemana } from "./tipos";

export function analisarCigarros(
  atual: MetricasSemana,
  anterior: MetricasSemana,
  metaCigarros: number,
): InsightCandidato | null {
  if (atual.cigarrosMedia === null) {
    return null;
  }

  if (
    anterior.cigarrosMedia !== null &&
    atual.cigarrosMedia < anterior.cigarrosMedia * 0.85
  ) {
    const percentual = Math.round(
      ((anterior.cigarrosMedia - atual.cigarrosMedia) /
        anterior.cigarrosMedia) *
        100,
    );

    return {
      tipo: "cigarros",
      pontuacao: Math.min(60 + percentual, 100),
      mensagem: `🚬 Sua média diária de cigarros caiu ${percentual}% em relação à semana anterior.`,
      evidencias: [
        {
          metrica: "Média diária de cigarros",
          valorAtual: atual.cigarrosMedia,
          valorAnterior: anterior.cigarrosMedia,
          diferencaPercentual: -percentual,
          diasAnalisados: atual.diasComCigarros,
        },
      ],
    };
  }

  if (
    anterior.cigarrosMedia !== null &&
    atual.cigarrosMedia > anterior.cigarrosMedia * 1.15
  ) {
    const percentual = Math.round(
      ((atual.cigarrosMedia - anterior.cigarrosMedia) /
        anterior.cigarrosMedia) *
        100,
    );

    return {
      tipo: "cigarros",
      pontuacao: Math.min(60 + percentual, 100),
      mensagem: `🚬 Sua média diária de cigarros aumentou ${percentual}% em relação à semana anterior.`,
      evidencias: [
        {
          metrica: "Média diária de cigarros",
          valorAtual: atual.cigarrosMedia,
          valorAnterior: anterior.cigarrosMedia,
          diferencaPercentual: percentual,
          diasAnalisados: atual.diasComCigarros,
        },
      ],
    };
  }

  if (atual.cigarrosMedia <= metaCigarros) {
    return {
      tipo: "cigarros",
      pontuacao: 70,
      mensagem: `🚬 Sua média diária ficou em ${atual.cigarrosMedia.toFixed(
        1,
      )} cigarros, dentro da meta de ${metaCigarros}.`,
      evidencias: [
        {
          metrica: "Média diária de cigarros",
          valorAtual: atual.cigarrosMedia,
          diasAnalisados: atual.diasComCigarros,
        },
      ],
    };
  }

  return null;
}
