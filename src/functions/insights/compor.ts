import type { InsightCandidato } from "./tipos";

function removerEmoji(mensagem: string): string {
  return mensagem.replace(/^[^\p{L}\p{N}]+/u, "");
}

function extrairCorpo(mensagem: string): string {
  const corpo = removerEmoji(mensagem);

  return corpo.charAt(0).toLowerCase() + corpo.slice(1);
}

export function comporInsight(
  candidatos: InsightCandidato[],
): InsightCandidato | null {
  if (candidatos.length === 0) {
    return null;
  }

  const ordenados = candidatos;
  const principal = ordenados[0];

  const secundario = ordenados.find(
    (candidato) =>
      candidato.tipo !== principal.tipo && candidato.pontuacao >= 75,
  );

  if (!secundario) {
    return principal;
  }

  const mensagem = criarMensagemCombinada(principal, secundario);

  return {
    tipo: principal.tipo,
    pontuacao: Math.min(principal.pontuacao + 10, 100),
    mensagem,
    evidencias: [...principal.evidencias, ...secundario.evidencias],
  };
}

function criarMensagemCombinada(
  principal: InsightCandidato,
  secundario: InsightCandidato,
): string {
  const combinacoes: Record<string, string> = {
    "estudo-sono":
      "Seu sono e seus estudos apresentaram mudanças positivas na mesma semana. Observar essa relação pode ajudar você a entender quais condições favorecem seus estudos.",

    "sono-estudo":
      "Seu sono e seus estudos apresentaram mudanças positivas na mesma semana. Observar essa relação pode ajudar você a entender quais condições favorecem seus estudos.",

    "estudo-habitos":
      "Sua rotina de estudos e seus hábitos apresentaram sinais positivos juntos. Manter uma rotina organizada pode estar acompanhando uma maior consistência nos estudos.",

    "habitos-estudo":
      "Sua rotina de estudos e seus hábitos apresentaram sinais positivos juntos. Manter uma rotina organizada pode estar acompanhando uma maior consistência nos estudos.",

    "estudo-cigarros":
      "Seu tempo de estudo e seu consumo de cigarros apresentaram mudanças na mesma semana. Acompanhar esses dois indicadores pode ajudar você a identificar padrões na sua rotina.",

    "cigarros-estudo":
      "Seu tempo de estudo e seu consumo de cigarros apresentaram mudanças na mesma semana. Acompanhar esses dois indicadores pode ajudar você a identificar padrões na sua rotina.",

    "estudo-agua":
      "Seu consumo de água e seu tempo de estudo apresentaram mudanças positivas na mesma semana. Acompanhar esses indicadores juntos pode ajudar você a entender melhor sua rotina.",

    "agua-estudo":
      "Seu consumo de água e seu tempo de estudo apresentaram mudanças positivas na mesma semana. Acompanhar esses indicadores juntos pode ajudar você a entender melhor sua rotina.",

    "sono-cigarros":
      "Seu sono e seu consumo de cigarros apresentaram uma relação interessante nesta semana. Continuar registrando os dois pode ajudar a identificar se esse padrão se mantém.",

    "cigarros-sono":
      "Seu sono e seu consumo de cigarros apresentaram uma relação interessante nesta semana. Continuar registrando os dois pode ajudar a identificar se esse padrão se mantém.",
  };

  const chave = `${principal.tipo}-${secundario.tipo}`;

  const mensagem = combinacoes[chave];

  if (mensagem) {
    return `💡 ${mensagem}`;
  }

  return `💡 ${extrairCorpo(principal.mensagem)} Além disso, ${extrairCorpo(
    secundario.mensagem,
  )}. Esses padrões apareceram juntos nesta semana e podem ajudar você a entender melhor sua rotina.`;
}
