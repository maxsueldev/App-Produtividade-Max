import type { DaySummary } from "@/database/days";

import type { PeriodoSemanal } from "./tipos";

function obterData(date: string): Date {
  const [ano, mes, dia] = date.split("-").map(Number);

  return new Date(ano, mes - 1, dia);
}

function obterHoje(): Date {
  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);

  return hoje;
}

function obterInicioUltimaSemanaCompleta(data: Date): Date {
  const resultado = new Date(data);

  resultado.setHours(0, 0, 0, 0);

  const diaSemana = resultado.getDay();

  const diasDesdeSegunda = diaSemana === 0 ? 6 : diaSemana - 1;

  resultado.setDate(resultado.getDate() - diasDesdeSegunda);

  resultado.setDate(resultado.getDate() - 7);

  return resultado;
}

function obterInicioSemanaAnterior(inicioSemanaAtual: Date): Date {
  const resultado = new Date(inicioSemanaAtual);

  resultado.setDate(resultado.getDate() - 7);

  return resultado;
}

function obterFimSemana(inicioSemana: Date): Date {
  const resultado = new Date(inicioSemana);

  resultado.setDate(resultado.getDate() + 6);

  resultado.setHours(23, 59, 59, 999);

  return resultado;
}

function criarPeriodo(inicio: Date, dias: DaySummary[]): PeriodoSemanal {
  const fim = obterFimSemana(inicio);

  const diasDoPeriodo = dias.filter((dia) => {
    const data = obterData(dia.date);

    return data >= inicio && data <= fim;
  });

  return {
    inicio,
    fim,
    dias: diasDoPeriodo,
  };
}

export function obterPeriodosSemanais(dias: DaySummary[]): {
  atual: PeriodoSemanal;
  anterior: PeriodoSemanal;
} {
  const hoje = obterHoje();

  const inicioAtual = obterInicioUltimaSemanaCompleta(hoje);

  const inicioAnterior = obterInicioSemanaAnterior(inicioAtual);

  return {
    atual: criarPeriodo(inicioAtual, dias),
    anterior: criarPeriodo(inicioAnterior, dias),
  };
}
