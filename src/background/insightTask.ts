import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";

import { DIA_INSIGHT } from "@/constants";
import { initializeDatabase } from "@/database/database";
import { getDaysSummary } from "@/database/days";
import {
  createInsightRecord,
  deleteInsightByWeek,
  getInsightByWeek,
} from "@/database/insights";
import { buscarConfiguracoes } from "@/functions/configuracoes";
import {
  gerarInsight,
  getTiposInsightsRecentes,
  getUltimasOcorrenciasPorTipo,
} from "@/functions/insights";
import {
  agendarNotificacaoEmData,
  existeNotificacaoInsight,
} from "@/notifications/notificationService";

export const INSIGHT_BACKGROUND_TASK = "produtividade-max-insight-weekly";

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

export async function processarInsightSemanal(): Promise<void> {
  console.log("💡 Background Task: iniciando análise do Insight...");

  const db = await initializeDatabase();

  const configuracoes = await buscarConfiguracoes(db);

  const inicioSemana = obterInicioUltimaSemanaCompleta(new Date());

  const weekStart = formatarData(inicioSemana);

  console.log("💡 Background Task: semana analisada:", weekStart);

  /*
   * Primeiro verificamos se o Insight dessa semana
   * já existe no SQLite.
   */
  const insightExistente = await getInsightByWeek(db, weekStart);

  /*
   * Se o Insight já foi salvo, verificamos apenas
   * se a notificação ainda está agendada.
   */
  if (insightExistente) {
    const notificacaoExiste = await existeNotificacaoInsight(weekStart);

    if (!notificacaoExiste) {
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

      console.log("💡 Background Task: notificação do Insight recriada.");
    } else {
      console.log("💡 Background Task: Insight e notificação já existem.");
    }

    return;
  }

  /*
   * Ainda não existe Insight para essa semana.
   * Buscamos os dados do histórico.
   */
  const dias = await getDaysSummary(db);

  const tiposInsightsRecentes = await getTiposInsightsRecentes(db);

  const ultimasOcorrencias = await getUltimasOcorrenciasPorTipo(db);

  const insight = gerarInsight(
    dias,
    configuracoes,
    tiposInsightsRecentes,
    ultimasOcorrencias,
  );

  if (!insight) {
    return;
  }

  /*
   * Salva o Insight no histórico.
   */
  await createInsightRecord(db, insight.tipo, insight.mensagem, weekStart);

  /*
   * Agenda a notificação para o próximo domingo
   * no horário configurado pelo usuário.
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

  console.log(
    "💡 Background Task: novo Insight criado e notificação agendada.",
    {
      semana: weekStart,
      dataNotificacao,
      mensagem: insight.mensagem,
    },
  );
}

/*
 * IMPORTANTE:
 *
 * A tarefa precisa ser definida no escopo global.
 * Não coloque isso dentro de componente React.
 */
TaskManager.defineTask(INSIGHT_BACKGROUND_TASK, async () => {
  try {
    await processarInsightSemanal();

    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("❌ Background Task: erro ao gerar Insight:", error);

    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

/*
 * Registra a tarefa no Android.
 *
 * O intervalo é de 24 horas.
 * Isso NÃO significa que ela será executada exatamente
 * a cada 24 horas. O Android decide o momento.
 */
export async function registrarInsightBackgroundTask(): Promise<void> {
  const registrada = await TaskManager.isTaskRegisteredAsync(
    INSIGHT_BACKGROUND_TASK,
  );

  if (registrada) {
    return;
  }

  await BackgroundTask.registerTaskAsync(INSIGHT_BACKGROUND_TASK, {
    minimumInterval: 24 * 60,
  });
}

export async function limparInsightSemanalTeste(): Promise<void> {
  const db = await initializeDatabase();

  const inicioSemana = obterInicioUltimaSemanaCompleta(new Date());

  const weekStart = formatarData(inicioSemana);

  await deleteInsightByWeek(db, weekStart);

  console.log("🧹 Insight de teste removido:", weekStart);
}
