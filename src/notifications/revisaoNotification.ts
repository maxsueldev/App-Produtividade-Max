import { agendarNotificacaoDiaria } from "./notificationService";

export async function agendarNotificacaoRevisao(
  horario: string,
): Promise<void> {
  await agendarNotificacaoDiaria(
    horario,
    "📊 Hora de revisar seu dia",
    "Veja como foram seus estudos, água, hábitos, sono e cigarros hoje.",
    "revisao",
  );
}
