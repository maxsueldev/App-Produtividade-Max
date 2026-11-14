import { agendarNotificacaoDiaria } from "./notificationService";

export async function agendarNotificacaoRegistro(
  horario: string,
): Promise<void> {
  await agendarNotificacaoDiaria(
    horario,
    "📝 Hora de registrar o dia",
    "Não esqueça de registrar seus estudos, hábitos, água e como foi seu dia.",
    "registro",
  );
}
