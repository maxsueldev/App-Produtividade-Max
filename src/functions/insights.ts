import type { DaySummary } from "@/database/days";
import * as SQLite from "expo-sqlite";

import { analisarAgua } from "./insights/agua";
import { analisarCigarros } from "./insights/cigarros";
import { analisarCorrelacoes } from "./insights/correlacoes";
import { analisarEstudo } from "./insights/estudo";
import { analisarHabitos } from "./insights/habitos";
import { calcularMetricasSemana } from "./insights/metricas";
import { obterPeriodosSemanais } from "./insights/periodo";
import { analisarSono } from "./insights/sono";

import type { InsightTipo } from "@/functions/insights/tipos";
import { selecionarMelhorInsight } from "./insights/engine";
import type { Insight, InsightCandidato } from "./insights/tipos";

import type { Configuracoes } from "@/functions/configuracoes";

export type { Insight };

export interface InsightRecord {
  id: number;
  type: string;
  message: string;
  week_start: string;
  created_at: string;
}

export function gerarInsight(
  dias: DaySummary[],
  configuracoes: Configuracoes,
  tiposInsightsRecentes: Insight["tipo"][] = [],
  ultimasOcorrencias: UltimaOcorrenciaInsight = {},
): Insight | null {
  if (dias.length === 0) {
    return null;
  }

  const periodos = obterPeriodosSemanais(dias);

  const metricasAtual = calcularMetricasSemana(periodos.atual.dias);

  const metricasAnterior = calcularMetricasSemana(periodos.anterior.dias);

  const candidatos: InsightCandidato[] = [];

  const insightCorrelacao = analisarCorrelacoes(periodos.atual.dias);

  if (insightCorrelacao) {
    candidatos.push(insightCorrelacao);
  }

  const insightEstudo = analisarEstudo(
    metricasAtual,
    metricasAnterior,
    configuracoes.metaEstudo,
  );

  if (insightEstudo) {
    candidatos.push(insightEstudo);
  }

  const insightSono = analisarSono(
    metricasAtual,
    metricasAnterior,
    configuracoes.metaSono,
  );

  if (insightSono) {
    candidatos.push(insightSono);
  }

  const insightAgua = analisarAgua(
    metricasAtual,
    metricasAnterior,
    configuracoes.metaAgua,
  );

  if (insightAgua) {
    candidatos.push(insightAgua);
  }

  const insightCigarros = analisarCigarros(
    metricasAtual,
    metricasAnterior,
    configuracoes.metaCigarros,
  );

  if (insightCigarros) {
    candidatos.push(insightCigarros);
  }

  const insightHabitos = analisarHabitos(metricasAtual, metricasAnterior);

  if (insightHabitos) {
    candidatos.push(insightHabitos);
  }

  if (candidatos.length === 0) {
    return null;
  }

  const melhorCandidato = selecionarMelhorInsight(
    candidatos,
    tiposInsightsRecentes,
    ultimasOcorrencias,
  );

  if (!melhorCandidato) {
    return null;
  }

  return {
    tipo: melhorCandidato.tipo,
    mensagem: melhorCandidato.mensagem,
    evidencias: melhorCandidato.evidencias,
  };
}

export async function getTiposInsightsRecentes(
  db: SQLite.SQLiteDatabase,
  limite: number = 4,
): Promise<InsightTipo[]> {
  const registros = await db.getAllAsync<{
    type: string;
  }>(
    `
      SELECT type
      FROM insight_records
      ORDER BY created_at DESC
      LIMIT ?
    `,
    limite,
  );

  return registros
    .map((registro) => registro.type)
    .filter(
      (tipo): tipo is InsightTipo =>
        tipo === "estudo" ||
        tipo === "sono" ||
        tipo === "cigarros" ||
        tipo === "agua" ||
        tipo === "habitos",
    );
}

export type UltimaOcorrenciaInsight = Partial<Record<InsightTipo, string>>;

export async function getUltimasOcorrenciasPorTipo(
  db: SQLite.SQLiteDatabase,
): Promise<UltimaOcorrenciaInsight> {
  const registros = await db.getAllAsync<{
    type: string;
    week_start: string;
  }>(
    `
      SELECT type, week_start
      FROM insight_records
      WHERE type IN (
        'estudo',
        'sono',
        'cigarros',
        'agua',
        'habitos'
      )
      ORDER BY week_start DESC
    `,
  );

  const ultimasOcorrencias: UltimaOcorrenciaInsight = {};

  for (const registro of registros) {
    const tipo = registro.type;

    if (
      tipo !== "estudo" &&
      tipo !== "sono" &&
      tipo !== "cigarros" &&
      tipo !== "agua" &&
      tipo !== "habitos"
    ) {
      continue;
    }

    if (!ultimasOcorrencias[tipo]) {
      ultimasOcorrencias[tipo] = registro.week_start;
    }
  }

  return ultimasOcorrencias;
}
