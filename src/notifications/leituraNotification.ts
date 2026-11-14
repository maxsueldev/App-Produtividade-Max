import { agendarNotificacaoDiaria } from "./notificationService";

export async function agendarNotificacoesLeitura(
  horarios: string[],
): Promise<void> {
  for (const horario of horarios) {
    await agendarNotificacaoDiaria(
      horario,
      "📖 Hora da leitura",
      "Reserve um tempo para sua leitura.",
      "leitura",
    );
  }
}
