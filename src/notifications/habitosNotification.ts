import { agendarNotificacaoDiaria } from "./notificationService";

export async function agendarNotificacoesHabitos(
  horarios: string[],
): Promise<void> {
  for (const horario of horarios) {
    await agendarNotificacaoDiaria(
      horario,
      "✅ Seus hábitos",
      "Não esqueça de registrar seus hábitos.",
      "habitos",
    );
  }
}
