import type { InsightCandidato, MetricasSemana } from "./tipos";

function formatarMinutos(minutos: number): string {
  const horas = Math.floor(minutos / 60);

  const minutosRestantes = Math.round(minutos % 60);

  if (horas === 0) {
    return `${minutosRestantes} minutos`;
  }

  if (minutosRestantes === 0) {
    return `${horas}h`;
  }

  return `${horas}h${minutosRestantes.toString().padStart(2, "0")}`;
}

export function analisarSono(
  atual: MetricasSemana,
  anterior: MetricasSemana,
  metaSono: number,
): InsightCandidato | null {
  if (atual.sonoMedia === null) {
    return null;
  }

  const metaSonoMinutos = metaSono * 60;

  if (
    anterior.sonoMedia !== null &&
    atual.sonoMedia > anterior.sonoMedia + 30
  ) {
    const diferenca = Math.round(atual.sonoMedia - anterior.sonoMedia);

    return {
      tipo: "sono",
      pontuacao: Math.min(60 + Math.round(diferenca / 5), 100),
      mensagem: `😴 Sua média de sono aumentou para ${formatarMinutos(
        atual.sonoMedia,
      )}, melhorando em relação à semana anterior.`,
      evidencias: [
        {
          metrica: "Média diária de sono",
          valorAtual: Math.round(atual.sonoMedia),
          valorAnterior: Math.round(anterior.sonoMedia),
          diferencaPercentual: Math.round(
            (diferenca / anterior.sonoMedia) * 100,
          ),
          diasAnalisados: atual.diasComSono,
        },
      ],
    };
  }

  if (
    anterior.sonoMedia !== null &&
    atual.sonoMedia < anterior.sonoMedia - 30
  ) {
    const diferenca = Math.round(anterior.sonoMedia - atual.sonoMedia);

    return {
      tipo: "sono",
      pontuacao: Math.min(60 + Math.round(diferenca / 5), 100),
      mensagem: `😴 Sua média de sono caiu para ${formatarMinutos(
        atual.sonoMedia,
      )}. Essa redução merece atenção na sua rotina.`,
      evidencias: [
        {
          metrica: "Média diária de sono",
          valorAtual: Math.round(atual.sonoMedia),
          valorAnterior: Math.round(anterior.sonoMedia),
          diferencaPercentual: -Math.round(
            (diferenca / anterior.sonoMedia) * 100,
          ),
          diasAnalisados: atual.diasComSono,
        },
      ],
    };
  }

  if (atual.sonoMedia >= metaSonoMinutos) {
    return {
      tipo: "sono",
      pontuacao: 75,
      mensagem: `😴 Sua média de sono ficou em ${formatarMinutos(
        atual.sonoMedia,
      )}, atingindo sua meta de ${formatarMinutos(metaSonoMinutos)}.`,
      evidencias: [
        {
          metrica: "Média diária de sono",
          valorAtual: Math.round(atual.sonoMedia),
          diasAnalisados: atual.diasComSono,
        },
      ],
    };
  }

  if (atual.diasComSono >= 6) {
    return {
      tipo: "sono",
      pontuacao: 70,
      mensagem: `😴 Você registrou seu sono em ${atual.diasComSono} dos 7 dias, mantendo uma boa regularidade de registros.`,
      evidencias: [
        {
          metrica: "Dias com registro de sono",
          valorAtual: atual.diasComSono,
          diasAnalisados: atual.diasComSono,
        },
      ],
    };
  }

  return null;
}
