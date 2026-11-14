import { agendarNotificacaoDiaria } from "./notificationService";

export async function agendarNotificacoesEstudo(
  horarios: string[],
): Promise<void> {
  for (const horario of horarios) {
    await agendarNotificacaoDiaria(
      horario,
      "📚 Hora de estudar",
      "Reserve um tempo para seus estudos.",
      "estudo",
    );
  }
}
