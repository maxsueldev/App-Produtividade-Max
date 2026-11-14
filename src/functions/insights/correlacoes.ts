import type { DaySummary } from "@/database/days";
import type { InsightCandidato } from "./tipos";

interface DiaComparavel {
  estudo: number;
  sono: number;
  agua: number;
  cigarros: number;
  habitos: number;
}

function calcularMedia(valores: number[]): number {
  if (valores.length === 0) {
    return 0;
  }

  return valores.reduce((total, valor) => total + valor, 0) / valores.length;
}

function obterDiasComparaveis(dias: DaySummary[]): DiaComparavel[] {
  return dias
    .filter(
      (dia) =>
        dia.study_minutes !== null &&
        dia.study_minutes > 0 &&
        dia.sleep_minutes !== null &&
        dia.sleep_minutes > 0,
    )
    .map((dia) => {
      let habitos = 0;

      if (dia.habits_total > 0) {
        habitos = (dia.habits_completed / dia.habits_total) * 100;
      }

      return {
        estudo: dia.study_minutes as number,
        sono: dia.sleep_minutes as number,
        agua: dia.water_ml !== null && dia.water_ml > 0 ? dia.water_ml : 0,
        cigarros:
          dia.cigarettes !== null && dia.cigarettes > 0 ? dia.cigarettes : 0,
        habitos,
      };
    });
}

function calcularPontuacao(diferenca: number, quantidadeDias: number): number {
  const forcaDiferenca = Math.min(diferenca, 40);

  const forcaDias = Math.min(quantidadeDias * 3, 21);

  return Math.min(Math.round(55 + forcaDiferenca + forcaDias), 100);
}

function analisarSonoEstudo(dias: DaySummary[]): InsightCandidato | null {
  const comparaveis = obterDiasComparaveis(dias);

  if (comparaveis.length < 4) {
    return null;
  }

  const mediaSono = calcularMedia(comparaveis.map((dia) => dia.sono));

  const acimaMedia = comparaveis.filter((dia) => dia.sono > mediaSono);

  const abaixoMedia = comparaveis.filter((dia) => dia.sono <= mediaSono);

  if (acimaMedia.length < 2 || abaixoMedia.length < 2) {
    return null;
  }

  const estudoComMaisSono = calcularMedia(acimaMedia.map((dia) => dia.estudo));

  const estudoComMenosSono = calcularMedia(
    abaixoMedia.map((dia) => dia.estudo),
  );

  if (estudoComMenosSono === 0) {
    return null;
  }

  const diferencaEstudo =
    ((estudoComMaisSono - estudoComMenosSono) / estudoComMenosSono) * 100;

  if (diferencaEstudo < 20) {
    return null;
  }

  const diferencaSono =
    calcularMedia(acimaMedia.map((dia) => dia.sono)) -
    calcularMedia(abaixoMedia.map((dia) => dia.sono));

  const pontuacao = calcularPontuacao(diferencaEstudo, comparaveis.length);

  return {
    tipo: "estudo",
    pontuacao,
    mensagem: `😴📚 Nos dias em que você dormiu acima da sua média, seu tempo de estudo foi cerca de ${Math.round(
      diferencaEstudo,
    )}% maior. Nesses dias, você dormiu em média ${Math.round(
      diferencaSono,
    )} minutos a mais.`,

    evidencias: [
      {
        metrica: "Sono acima da média x estudo",
        valorAtual: Math.round(estudoComMaisSono),
        valorAnterior: Math.round(estudoComMenosSono),
        diferencaPercentual: Math.round(diferencaEstudo),
        diasAnalisados: comparaveis.length,
      },
      {
        metrica: "Diferença média de sono",
        valorAtual: Math.round(diferencaSono),
        diasAnalisados: comparaveis.length,
      },
    ],
  };
}

function analisarAguaEstudo(dias: DaySummary[]): InsightCandidato | null {
  const comparaveis = obterDiasComparaveis(dias);

  if (comparaveis.length < 4) {
    return null;
  }

  const diasComAgua = comparaveis.filter((dia) => dia.agua > 0);

  const diasSemAgua = comparaveis.filter((dia) => dia.agua === 0);

  if (diasComAgua.length < 2 || diasSemAgua.length < 2) {
    return null;
  }

  const estudoComAgua = calcularMedia(diasComAgua.map((dia) => dia.estudo));

  const estudoSemAgua = calcularMedia(diasSemAgua.map((dia) => dia.estudo));

  if (estudoSemAgua === 0) {
    return null;
  }

  const diferencaEstudo =
    ((estudoComAgua - estudoSemAgua) / estudoSemAgua) * 100;

  if (diferencaEstudo < 20) {
    return null;
  }

  const aguaMedia = calcularMedia(diasComAgua.map((dia) => dia.agua));

  const pontuacao = calcularPontuacao(diferencaEstudo, comparaveis.length);

  return {
    tipo: "agua",
    pontuacao,
    mensagem: `💧📚 Nos dias em que você registrou consumo de água, seu tempo de estudo foi cerca de ${Math.round(
      diferencaEstudo,
    )}% maior. Nesses dias, seu consumo médio registrado foi de ${Math.round(
      aguaMedia,
    )} ml.`,

    evidencias: [
      {
        metrica: "Água registrada x estudo",
        valorAtual: Math.round(estudoComAgua),
        valorAnterior: Math.round(estudoSemAgua),
        diferencaPercentual: Math.round(diferencaEstudo),
        diasAnalisados: comparaveis.length,
      },
      {
        metrica: "Média de água nos dias registrados",
        valorAtual: Math.round(aguaMedia),
        diasAnalisados: diasComAgua.length,
      },
    ],
  };
}

function analisarCigarrosEstudo(dias: DaySummary[]): InsightCandidato | null {
  const comparaveis = obterDiasComparaveis(dias);

  if (comparaveis.length < 4) {
    return null;
  }

  const diasComPoucos = comparaveis.filter(
    (dia) => dia.cigarros > 0 && dia.cigarros <= 10,
  );

  const diasComMais = comparaveis.filter((dia) => dia.cigarros > 10);

  if (diasComPoucos.length < 2 || diasComMais.length < 2) {
    return null;
  }

  const estudoPoucos = calcularMedia(diasComPoucos.map((dia) => dia.estudo));

  const estudoMais = calcularMedia(diasComMais.map((dia) => dia.estudo));

  if (estudoMais === 0) {
    return null;
  }

  const diferencaEstudo = ((estudoPoucos - estudoMais) / estudoMais) * 100;

  if (diferencaEstudo < 20) {
    return null;
  }

  const cigarrosPoucos = calcularMedia(
    diasComPoucos.map((dia) => dia.cigarros),
  );

  const cigarrosMais = calcularMedia(diasComMais.map((dia) => dia.cigarros));

  const diferencaCigarros = cigarrosMais - cigarrosPoucos;

  const pontuacao = calcularPontuacao(diferencaEstudo, comparaveis.length);

  return {
    tipo: "cigarros",
    pontuacao,
    mensagem: `🚬📚 Nos dias em que você registrou menos cigarros, seu tempo de estudo foi cerca de ${Math.round(
      diferencaEstudo,
    )}% maior. Nesses dias, você consumiu em média ${cigarrosPoucos.toFixed(
      1,
    )} cigarros, contra ${cigarrosMais.toFixed(1)} nos dias com maior consumo.`,

    evidencias: [
      {
        metrica: "Menos cigarros x estudo",
        valorAtual: Math.round(estudoPoucos),
        valorAnterior: Math.round(estudoMais),
        diferencaPercentual: Math.round(diferencaEstudo),
        diasAnalisados: comparaveis.length,
      },
      {
        metrica: "Consumo médio de cigarros",
        valorAtual: Number(cigarrosPoucos.toFixed(1)),
        valorAnterior: Number(cigarrosMais.toFixed(1)),
        diferencaPercentual: -Math.round(
          (diferencaCigarros / cigarrosMais) * 100,
        ),
        diasAnalisados: comparaveis.length,
      },
    ],
  };
}

function analisarHabitosEstudo(dias: DaySummary[]): InsightCandidato | null {
  const comparaveis = obterDiasComparaveis(dias);

  if (comparaveis.length < 4) {
    return null;
  }

  const diasComHabitos = comparaveis.filter((dia) => dia.habitos >= 80);

  const diasComPoucosHabitos = comparaveis.filter((dia) => dia.habitos < 80);

  if (diasComHabitos.length < 2 || diasComPoucosHabitos.length < 2) {
    return null;
  }

  const estudoComHabitos = calcularMedia(
    diasComHabitos.map((dia) => dia.estudo),
  );

  const estudoComPoucosHabitos = calcularMedia(
    diasComPoucosHabitos.map((dia) => dia.estudo),
  );

  if (estudoComPoucosHabitos === 0) {
    return null;
  }

  const diferencaEstudo =
    ((estudoComHabitos - estudoComPoucosHabitos) / estudoComPoucosHabitos) *
    100;

  if (diferencaEstudo < 20) {
    return null;
  }

  const mediaHabitosCompletos = calcularMedia(
    diasComHabitos.map((dia) => dia.habitos),
  );

  const mediaHabitosIncompletos = calcularMedia(
    diasComPoucosHabitos.map((dia) => dia.habitos),
  );

  const diferencaHabitos = mediaHabitosCompletos - mediaHabitosIncompletos;

  const pontuacao = calcularPontuacao(diferencaEstudo, comparaveis.length);

  return {
    tipo: "habitos",
    pontuacao,
    mensagem: `✅📚 Nos dias em que você concluiu pelo menos 80% dos hábitos, seu tempo de estudo foi cerca de ${Math.round(
      diferencaEstudo,
    )}% maior. Nesses dias, sua conclusão média dos hábitos foi de ${Math.round(
      mediaHabitosCompletos,
    )}%, contra ${Math.round(mediaHabitosIncompletos)}% nos demais dias.`,

    evidencias: [
      {
        metrica: "Hábitos concluídos x estudo",
        valorAtual: Math.round(estudoComHabitos),
        valorAnterior: Math.round(estudoComPoucosHabitos),
        diferencaPercentual: Math.round(diferencaEstudo),
        diasAnalisados: comparaveis.length,
      },
      {
        metrica: "Conclusão média dos hábitos",
        valorAtual: Math.round(mediaHabitosCompletos),
        valorAnterior: Math.round(mediaHabitosIncompletos),
        diferencaPercentual: Math.round(diferencaHabitos),
        diasAnalisados: comparaveis.length,
      },
    ],
  };
}

function analisarSonoCigarros(dias: DaySummary[]): InsightCandidato | null {
  const comparaveis = obterDiasComparaveis(dias).filter(
    (dia) => dia.cigarros > 0,
  );

  if (comparaveis.length < 4) {
    return null;
  }

  const mediaSono = calcularMedia(comparaveis.map((dia) => dia.sono));

  const diasComMaisSono = comparaveis.filter((dia) => dia.sono > mediaSono);

  const diasComMenosSono = comparaveis.filter((dia) => dia.sono <= mediaSono);

  if (diasComMaisSono.length < 2 || diasComMenosSono.length < 2) {
    return null;
  }

  const cigarrosMaisSono = calcularMedia(
    diasComMaisSono.map((dia) => dia.cigarros),
  );

  const cigarrosMenosSono = calcularMedia(
    diasComMenosSono.map((dia) => dia.cigarros),
  );

  if (cigarrosMaisSono === 0) {
    return null;
  }

  const reducaoCigarros =
    ((cigarrosMenosSono - cigarrosMaisSono) / cigarrosMenosSono) * 100;

  if (reducaoCigarros < 20) {
    return null;
  }

  const diferencaSono =
    calcularMedia(diasComMaisSono.map((dia) => dia.sono)) -
    calcularMedia(diasComMenosSono.map((dia) => dia.sono));

  const pontuacao = calcularPontuacao(reducaoCigarros, comparaveis.length);

  return {
    tipo: "cigarros",
    pontuacao,
    mensagem: `😴🚬 Nos dias em que você dormiu acima da sua média, seu consumo de cigarros foi cerca de ${Math.round(
      reducaoCigarros,
    )}% menor. Nesses dias, você dormiu em média ${Math.round(
      diferencaSono,
    )} minutos a mais.`,

    evidencias: [
      {
        metrica: "Mais sono x consumo de cigarros",
        valorAtual: Number(cigarrosMaisSono.toFixed(1)),
        valorAnterior: Number(cigarrosMenosSono.toFixed(1)),
        diferencaPercentual: -Math.round(reducaoCigarros),
        diasAnalisados: comparaveis.length,
      },
      {
        metrica: "Diferença média de sono",
        valorAtual: Math.round(diferencaSono),
        diasAnalisados: comparaveis.length,
      },
    ],
  };
}

export function analisarCorrelacoes(
  dias: DaySummary[],
): InsightCandidato | null {
  const candidatos = [
    analisarSonoEstudo(dias),
    analisarHabitosEstudo(dias),
    analisarCigarrosEstudo(dias),
    analisarAguaEstudo(dias),
    analisarSonoCigarros(dias),
  ].filter((insight): insight is InsightCandidato => insight !== null);

  if (candidatos.length === 0) {
    return null;
  }

  return candidatos.reduce((melhor, atual) =>
    atual.pontuacao > melhor.pontuacao ? atual : melhor,
  );
}
