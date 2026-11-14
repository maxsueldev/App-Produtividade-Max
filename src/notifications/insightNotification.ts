import * as SQLite from "expo-sqlite";

import { DIA_INSIGHT } from "@/constants";
import { getDaysSummary } from "@/database/days";
import { createInsightRecord, getInsightByWeek } from "@/database/insights";
import type { Configuracoes } from "@/functions/configuracoes";
import { gerarInsight } from "@/functions/insights";

import {
  agendarNotificacaoEmData,
  existeNotificacaoInsight,
} from "./notificationService";

function obterInicioUltimaSemanaCompleta(data: Date): Date {
  const resultado = new Date(data);

  resultado.setHours(0, 0, 0, 0);

  const diaSemana = resultado.getDay();

  const diasDesdeSegunda = diaSemana === 0 ? 6 : diaSemana - 1;

  resultado.setDate(resultado.getDate() - diasDesdeSegunda);

  resultado.setDate(resultado.getDate() - 7);

  return resultado;
}

function formatarData(data: Date): string {
  const ano = data.getFullYear();

  const mes = String(data.getMonth() + 1).padStart(2, "0");

  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function obterProximaOcorrenciaInsight(horarioInsight: string): Date {
  const [horas, minutos] = horarioInsight.split(":").map(Number);

  const agora = new Date();

  const data = new Date(agora);

  const diaAtual = data.getDay();

  let diasAteInsight = (DIA_INSIGHT - diaAtual + 7) % 7;

  if (diasAteInsight === 0) {
    const horarioJaPassou =
      agora.getHours() > horas ||
      (agora.getHours() === horas && agora.getMinutes() >= minutos);

    if (horarioJaPassou) {
      diasAteInsight = 7;
    }
  }

  data.setDate(data.getDate() + diasAteInsight);

  data.setHours(horas, minutos, 0, 0);

  return data;
}

export async function agendarNotificacaoInsight(
  db: SQLite.SQLiteDatabase,
  configuracoes: Configuracoes,
): Promise<void> {
  const inicioSemanaInsight = obterInicioUltimaSemanaCompleta(new Date());

  const weekStart = formatarData(inicioSemanaInsight);

  /*
   * Verifica se já existe um Insight dessa semana.
   */
  const insightExistente = await getInsightByWeek(db, weekStart);

  /*
   * Se já existe, só precisamos garantir
   * que a notificação correspondente existe.
   */
  if (insightExistente) {
    const notificacaoExiste = await existeNotificacaoInsight(weekStart);

    if (notificacaoExiste) {
      console.log("💡 Insight e notificação já existem.");

      return;
    }

    const dataNotificacao = obterProximaOcorrenciaInsight(
      configuracoes.lembreteInsight,
    );

    await agendarNotificacaoEmData(
      dataNotificacao,
      "💡 Insight da semana",
      insightExistente.message,
      "insight",
      weekStart,
    );

    console.log("💡 Notificação do Insight recriada.");

    return;
  }

  /*
   * Ainda não existe Insight.
   */
  const dias = await getDaysSummary(db);

  const insight = gerarInsight(dias, configuracoes);

  if (!insight) {
    return;
  }

  /*
   * Salva no SQLite.
   */
  await createInsightRecord(db, insight.tipo, insight.mensagem, weekStart);

  /*
   * Agenda a notificação.
   */
  const dataNotificacao = obterProximaOcorrenciaInsight(
    configuracoes.lembreteInsight,
  );

  await agendarNotificacaoEmData(
    dataNotificacao,
    "💡 Insight da semana",
    insight.mensagem,
    "insight",
    weekStart,
  );

  console.log("💡 Insight criado e notificação agendada.", {
    weekStart,
    dataNotificacao,
  });
}
