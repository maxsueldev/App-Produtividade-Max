import { agendarNotificacaoDiaria } from "./notificationService";

export async function agendarNotificacaoSono(horario: string): Promise<void> {
  await agendarNotificacaoDiaria(
    horario,
    "😴 Hora de descansar",
    "Que tal começar a desacelerar? Registre seu horário de dormir.",
    "sono",
  );
}
