import { comporInsight } from "./compor";
import type { InsightCandidato, InsightTipo } from "./tipos";

function calcularConfianca(candidato: InsightCandidato): number {
  const dias = candidato.evidencias.reduce(
    (maior, evidencia) => Math.max(maior, evidencia.diasAnalisados ?? 0),
    0,
  );

  if (dias >= 7) return 100;
  if (dias >= 6) return 90;
  if (dias >= 5) return 80;
  if (dias >= 4) return 70;

  return 50;
}

function obterPrioridadeTipo(tipo: InsightTipo): number {
  const prioridades: Record<InsightTipo, number> = {
    estudo: 5,
    sono: 5,
    cigarros: 5,
    agua: 4,
    habitos: 4,
  };

  return prioridades[tipo];
}

function calcularPenalidadeConsecutiva(
  tipo: InsightTipo,
  tiposRecentes: InsightTipo[],
): number {
  if (tiposRecentes[0] === tipo) {
    return 30;
  }

  return 0;
}

function calcularPenalidadeFrequencia(
  tipo: InsightTipo,
  tiposRecentes: InsightTipo[],
): number {
  const repeticoes = tiposRecentes.filter(
    (tipoRecente) => tipoRecente === tipo,
  ).length;

  if (repeticoes === 0) return 0;
  if (repeticoes === 1) return 10;
  if (repeticoes === 2) return 25;

  return 45;
}

function ajustarPorEvidencia(
  penalidade: number,
  forcaEvidencia: number,
): number {
  if (forcaEvidencia >= 90) {
    return Math.round(penalidade * 0.2);
  }

  if (forcaEvidencia >= 75) {
    return Math.round(penalidade * 0.5);
  }

  return penalidade;
}

function calcularBonusTempo(semanasSemAparecer: number): number {
  if (semanasSemAparecer === Infinity) {
    return 30;
  }

  if (semanasSemAparecer >= 4) {
    return 25;
  }

  if (semanasSemAparecer >= 3) {
    return 18;
  }

  if (semanasSemAparecer >= 2) {
    return 10;
  }

  if (semanasSemAparecer >= 1) {
    return 3;
  }

  return 0;
}

export function calcularPenalidadeRepeticao(
  tipo: InsightTipo,
  tiposRecentes: InsightTipo[],
  semanasSemAparecer: number,
  forcaEvidencia: number,
): number {
  const penalidade =
    calcularPenalidadeConsecutiva(tipo, tiposRecentes) +
    calcularPenalidadeFrequencia(tipo, tiposRecentes);

  const penalidadeAjustada = ajustarPorEvidencia(penalidade, forcaEvidencia);

  const bonus = calcularBonusTempo(semanasSemAparecer);

  return Math.max(0, penalidadeAjustada - bonus);
}

function calcularPontuacaoFinal(
  candidato: InsightCandidato,
  tiposRecentes: InsightTipo[],
  ultimasOcorrencias: UltimaOcorrenciaInsight,
): number {
  const confianca = calcularConfianca(candidato);

  const prioridade = obterPrioridadeTipo(candidato.tipo);

  const semanasSemAparecer = calcularSemanasSemAparecer(
    ultimasOcorrencias[candidato.tipo],
  );

  const penalidade = calcularPenalidadeRepeticao(
    candidato.tipo,
    tiposRecentes,
    semanasSemAparecer,
    confianca,
  );

  const pontuacaoFinal =
    candidato.pontuacao * 0.7 +
    confianca * 0.25 +
    prioridade * 0.5 -
    penalidade;

  return Math.max(pontuacaoFinal, 0);
}

type UltimaOcorrenciaInsight = Partial<Record<InsightTipo, string>>;

export function selecionarMelhorInsight(
  candidatos: InsightCandidato[],
  tiposRecentes: InsightTipo[] = [],
  ultimasOcorrencias: UltimaOcorrenciaInsight = {},
): InsightCandidato | null {
  if (candidatos.length === 0) {
    return null;
  }

  const candidatosComPontuacao = candidatos.map((candidato) => ({
    candidato,
    pontuacaoFinal: calcularPontuacaoFinal(
      candidato,
      tiposRecentes,
      ultimasOcorrencias,
    ),
  }));

  candidatosComPontuacao.sort((a, b) => b.pontuacaoFinal - a.pontuacaoFinal);

  const candidatosOrdenados = candidatosComPontuacao.map(
    (item) => item.candidato,
  );

  return comporInsight(candidatosOrdenados);
}

function calcularSemanasSemAparecer(
  weekStartUltimaOcorrencia: string | undefined,
): number {
  if (!weekStartUltimaOcorrencia) {
    return Infinity;
  }

  const ultimaData = new Date(`${weekStartUltimaOcorrencia}T00:00:00`);

  const hoje = new Date();

  const diaSemana = hoje.getDay();

  const diasDesdeSegunda = diaSemana === 0 ? 6 : diaSemana - 1;

  const inicioSemanaAtual = new Date(hoje);

  inicioSemanaAtual.setHours(0, 0, 0, 0);

  inicioSemanaAtual.setDate(inicioSemanaAtual.getDate() - diasDesdeSegunda);

  const diferencaMs = inicioSemanaAtual.getTime() - ultimaData.getTime();

  if (diferencaMs <= 0) {
    return 0;
  }

  return Math.floor(diferencaMs / (7 * 24 * 60 * 60 * 1000));
}
