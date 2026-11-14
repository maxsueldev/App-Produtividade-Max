import type { DaySummary } from "@/database/days";

export type InsightTipo = "estudo" | "sono" | "cigarros" | "agua" | "habitos";

export interface InsightEvidencia {
  metrica: string;
  valorAtual?: number;
  valorAnterior?: number;
  diferencaPercentual?: number;
  diasAnalisados?: number;
}

export interface Insight {
  tipo: InsightTipo;
  mensagem: string;
  evidencias: InsightEvidencia[];
}

export interface InsightCandidato extends Insight {
  pontuacao: number;
}

export interface PeriodoSemanal {
  inicio: Date;
  fim: Date;
  dias: DaySummary[];
}

export interface MetricasSemana {
  diasRegistrados: number;

  estudoMinutos: number;
  diasComEstudo: number;

  sonoMedia: number | null;
  diasComSono: number;

  aguaMedia: number | null;
  diasComAgua: number;

  cigarrosMedia: number | null;
  diasComCigarros: number;

  habitosConcluidos: number;
  habitosPossiveis: number;
  taxaHabitos: number | null;
}
