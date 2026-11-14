import { agendarNotificacaoDiaria } from "./notificationService";

export async function agendarNotificacoesAgua(
  horarios: string[],
): Promise<void> {
  for (const horario of horarios) {
    await agendarNotificacaoDiaria(
      horario,
      "💧 Hora da água",
      "Está na hora de beber água!",
      "agua",
    );
  }
}
