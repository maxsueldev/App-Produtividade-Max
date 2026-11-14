import * as Notifications from "expo-notifications";

import { agendarNotificacaoDiaria } from "./notificationService";

export async function agendarNotificacoesCigarros(
  lembretes: string[],
): Promise<void> {
  const mensagens = [
    {
      titulo: "🚬 Registro de cigarros",
      mensagem: "Registre os cigarros da manhã.",
    },
    {
      titulo: "🚬 Registro de cigarros",
      mensagem: "Registre os cigarros da tarde.",
    },
    {
      titulo: "🚬 Registro de cigarros",
      mensagem: "Registre os cigarros da noite.",
    },
  ];

  for (let i = 0; i < lembretes.length; i++) {
    const horario = lembretes[i];

    if (!horario) {
      continue;
    }

    const mensagem = mensagens[i];

    if (!mensagem) {
      continue;
    }

    await agendarNotificacaoDiaria(
      horario,
      mensagem.titulo,
      mensagem.mensagem,
      "cigarros",
    );
  }
}

export async function verificarLimiteCigarros(
  quantidadeAnterior: number,
  quantidadeAtual: number,
  metaCigarros: number,
): Promise<void> {
  if (quantidadeAnterior <= metaCigarros && quantidadeAtual > metaCigarros) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🚬 Limite de cigarros ultrapassado",
        body: `Você já registrou ${quantidadeAtual} cigarros hoje. Sua meta é ${metaCigarros}.`,
        sound: true,
        data: {
          tipo: "cigarros",
        },
      },
      trigger: null,
    });
  }
}
