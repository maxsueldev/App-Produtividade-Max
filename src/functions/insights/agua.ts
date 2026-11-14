import type { InsightCandidato, MetricasSemana } from "./tipos";

export function analisarAgua(
  atual: MetricasSemana,
  anterior: MetricasSemana,
  metaAgua: number,
): InsightCandidato | null {
  if (atual.aguaMedia === null) {
    return null;
  }

  if (
    anterior.aguaMedia !== null &&
    atual.aguaMedia > anterior.aguaMedia * 1.15
  ) {
    const percentual = Math.round(
      ((atual.aguaMedia - anterior.aguaMedia) / anterior.aguaMedia) * 100,
    );

    return {
      tipo: "agua",
      pontuacao: Math.min(60 + percentual, 100),
      mensagem: `💧 Sua média diária de água aumentou ${percentual}% em relação à semana anterior.`,
      evidencias: [
        {
          metrica: "Média diária de água",
          valorAtual: Math.round(atual.aguaMedia),
          valorAnterior: Math.round(anterior.aguaMedia),
          diferencaPercentual: percentual,
          diasAnalisados: atual.diasComAgua,
        },
      ],
    };
  }

  if (
    anterior.aguaMedia !== null &&
    atual.aguaMedia < anterior.aguaMedia * 0.85
  ) {
    const percentual = Math.round(
      ((anterior.aguaMedia - atual.aguaMedia) / anterior.aguaMedia) * 100,
    );

    return {
      tipo: "agua",
      pontuacao: Math.min(60 + percentual, 100),
      mensagem: `💧 Sua média diária de água caiu ${percentual}% em relação à semana anterior.`,
      evidencias: [
        {
          metrica: "Média diária de água",
          valorAtual: Math.round(atual.aguaMedia),
          valorAnterior: Math.round(anterior.aguaMedia),
          diferencaPercentual: -percentual,
          diasAnalisados: atual.diasComAgua,
        },
      ],
    };
  }

  if (atual.aguaMedia >= metaAgua) {
    return {
      tipo: "agua",
      pontuacao: 75,
      mensagem: `💧 Sua média diária foi de ${Math.round(
        atual.aguaMedia,
      )} ml, atingindo sua meta de ${metaAgua} ml.`,
      evidencias: [
        {
          metrica: "Média diária de água",
          valorAtual: Math.round(atual.aguaMedia),
          diasAnalisados: atual.diasComAgua,
        },
      ],
    };
  }

  if (atual.diasComAgua >= 6) {
    return {
      tipo: "agua",
      pontuacao: 70,
      mensagem: `💧 Você registrou o consumo de água em ${atual.diasComAgua} dos 7 dias da semana.`,
      evidencias: [
        {
          metrica: "Dias com registro de água",
          valorAtual: atual.diasComAgua,
          diasAnalisados: atual.diasComAgua,
        },
      ],
    };
  }

  return null;
}
