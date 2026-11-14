import type { DaySummary } from "@/database/days";

import type { MetricasSemana } from "./tipos";

function calcularMedia(valores: number[]): number | null {
  if (valores.length === 0) {
    return null;
  }

  const soma = valores.reduce((total, valor) => total + valor, 0);

  return soma / valores.length;
}

export function calcularMetricasSemana(dias: DaySummary[]): MetricasSemana {
  const estudos = dias.filter(
    (dia) => dia.study_minutes !== null && dia.study_minutes > 0,
  );

  const sono = dias.filter(
    (dia) => dia.sleep_minutes !== null && dia.sleep_minutes > 0,
  );

  const agua = dias.filter((dia) => dia.water_ml !== null && dia.water_ml > 0);

  const cigarros = dias.filter(
    (dia) => dia.cigarettes !== null && dia.cigarettes > 0,
  );

  const habitosPossiveis = dias.reduce(
    (total, dia) => total + dia.habits_total,
    0,
  );

  const habitosConcluidos = dias.reduce(
    (total, dia) => total + dia.habits_completed,
    0,
  );

  return {
    diasRegistrados: dias.length,

    estudoMinutos: estudos.reduce(
      (total, dia) => total + (dia.study_minutes ?? 0),
      0,
    ),

    diasComEstudo: estudos.length,

    sonoMedia: calcularMedia(sono.map((dia) => dia.sleep_minutes as number)),

    diasComSono: sono.length,

    aguaMedia: calcularMedia(agua.map((dia) => dia.water_ml as number)),

    diasComAgua: agua.length,

    cigarrosMedia: calcularMedia(
      cigarros.map((dia) => dia.cigarettes as number),
    ),

    diasComCigarros: cigarros.length,

    habitosConcluidos,

    habitosPossiveis,

    taxaHabitos:
      habitosPossiveis > 0
        ? (habitosConcluidos / habitosPossiveis) * 100
        : null,
  };
}
