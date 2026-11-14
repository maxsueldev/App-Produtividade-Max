import type { InsightCandidato, MetricasSemana } from "./tipos";

export function analisarEstudo(
  atual: MetricasSemana,
  anterior: MetricasSemana,
  metaEstudo: number,
): InsightCandidato | null {
  if (atual.diasComEstudo === 0) {
    return null;
  }

  const mediaAtual = atual.estudoMinutos / atual.diasComEstudo;

  const mediaAnterior =
    anterior.diasComEstudo > 0
      ? anterior.estudoMinutos / anterior.diasComEstudo
      : null;

  if (
    mediaAnterior !== null &&
    Math.round(mediaAtual * 100) > Math.round(mediaAnterior * 1.15 * 100)
  ) {
    const percentual = Math.round(
      ((mediaAtual - mediaAnterior) / mediaAnterior) * 100,
    );

    return {
      tipo: "estudo",
      pontuacao: Math.min(60 + percentual, 100),
      mensagem: `📚 Sua média diária de estudos aumentou ${percentual}% em relação à semana anterior. Você estudou em ${atual.diasComEstudo} dias.`,
      evidencias: [
        {
          metrica: "Média diária de estudos",
          valorAtual: Math.round(mediaAtual),
          valorAnterior: Math.round(mediaAnterior),
          diferencaPercentual: percentual,
          diasAnalisados: atual.diasComEstudo,
        },
      ],
    };
  }

  if (
    mediaAnterior !== null &&
    Math.round(mediaAtual * 100) < Math.round(mediaAnterior * 0.85 * 100)
  ) {
    const percentual = Math.round(
      ((mediaAnterior - mediaAtual) / mediaAnterior) * 100,
    );

    return {
      tipo: "estudo",
      pontuacao: Math.min(60 + percentual, 100),
      mensagem: `📚 Sua média diária de estudos caiu ${percentual}% em relação à semana anterior. Vale observar o que mudou na sua rotina.`,
      evidencias: [
        {
          metrica: "Média diária de estudos",
          valorAtual: Math.round(mediaAtual),
          valorAnterior: Math.round(mediaAnterior),
          diferencaPercentual: -percentual,
          diasAnalisados: atual.diasComEstudo,
        },
      ],
    };
  }

  const metaSemanal = metaEstudo * 7;

  if (atual.estudoMinutos >= metaSemanal) {
    return {
      tipo: "estudo",
      pontuacao: 75,
      mensagem: `📚 Você atingiu sua meta semanal de estudos, acumulando ${atual.estudoMinutos} minutos ao longo da semana.`,
      evidencias: [
        {
          metrica: "Minutos de estudo na semana",
          valorAtual: atual.estudoMinutos,
          diasAnalisados: atual.diasComEstudo,
        },
      ],
    };
  }

  if (atual.diasComEstudo >= 5) {
    return {
      tipo: "estudo",
      pontuacao: 50 + atual.diasComEstudo * 5,
      mensagem: `📚 Você estudou em ${atual.diasComEstudo} dos 7 dias da semana, mostrando uma rotina consistente de estudos.`,
      evidencias: [
        {
          metrica: "Dias com estudo",
          valorAtual: atual.diasComEstudo,
          diasAnalisados: atual.diasComEstudo,
        },
      ],
    };
  }

  return null;
}
