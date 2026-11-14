import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configurarNotificacoes(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("produtividade", {
      name: "Produtividade Max",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "alert_notification.wav",
      vibrationPattern: [0, 250, 150, 250],
    });
  }

  const { status } = await Notifications.getPermissionsAsync();

  if (status === Notifications.PermissionStatus.GRANTED) {
    return true;
  }

  const resultado = await Notifications.requestPermissionsAsync();

  return resultado.status === Notifications.PermissionStatus.GRANTED;
}

export async function cancelarTodasNotificacoes(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function cancelarNotificacoesFixas(): Promise<void> {
  const notificacoes = await Notifications.getAllScheduledNotificationsAsync();

  const tiposFixos = [
    "agua",
    "estudo",
    "leitura",
    "habitos",
    "registro",
    "sono",
    "revisao",
    "cigarros",
  ];

  for (const notificacao of notificacoes) {
    const tipo = notificacao.content.data?.tipo;

    if (typeof tipo === "string" && tiposFixos.includes(tipo)) {
      await Notifications.cancelScheduledNotificationAsync(
        notificacao.identifier,
      );
    }
  }
}

export async function agendarNotificacaoDiaria(
  hora: string,
  titulo: string,
  mensagem: string,
  tipo:
    | "agua"
    | "estudo"
    | "leitura"
    | "habitos"
    | "registro"
    | "sono"
    | "revisao"
    | "cigarros",
): Promise<string> {
  const [horas, minutos] = hora.split(":").map(Number);

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      sound: "alert_notification.wav",
      data: {
        tipo,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: horas,
      minute: minutos,
      channelId: "produtividade",
    },
  });
}

export async function agendarNotificacaoSemanal(
  diaSemana: number,
  hora: string,
  titulo: string,
  mensagem: string,
  tipo:
    | "agua"
    | "estudo"
    | "leitura"
    | "habitos"
    | "registro"
    | "sono"
    | "revisao"
    | "cigarros",
): Promise<string> {
  const [horas, minutos] = hora.split(":").map(Number);

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      sound: "alert_notification.wav",
      data: {
        tipo,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: diaSemana,
      hour: horas,
      minute: minutos,
      channelId: "produtividade",
    },
  });
}

export async function agendarNotificacaoEmData(
  data: Date,
  titulo: string,
  mensagem: string,
  tipo: "insight",
  weekStart: string,
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      sound: "alert_notification.wav",
      data: {
        tipo,
        weekStart,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: data,
      channelId: "produtividade",
    },
  });
}

export async function cancelarNotificacaoInsight(): Promise<void> {
  const notificacoes = await Notifications.getAllScheduledNotificationsAsync();

  for (const notificacao of notificacoes) {
    const tipo = notificacao.content.data?.tipo;

    if (tipo === "insight") {
      await Notifications.cancelScheduledNotificationAsync(
        notificacao.identifier,
      );
    }
  }
}

export async function listarNotificacoesAgendadas(): Promise<void> {
  const notificacoes = await Notifications.getAllScheduledNotificationsAsync();

  console.log(`🔔 NOTIFICAÇÕES AGENDADAS: ${notificacoes.length}`);

  for (const notificacao of notificacoes) {
    console.log({
      id: notificacao.identifier,
      titulo: notificacao.content.title,
      tipo: notificacao.content.data?.tipo,
      trigger: notificacao.trigger,
    });
  }
}

export async function existeNotificacaoInsight(
  weekStart: string,
): Promise<boolean> {
  const notificacoes = await Notifications.getAllScheduledNotificationsAsync();

  return notificacoes.some((notificacao) => {
    const tipo = notificacao.content.data?.tipo;

    const semana = notificacao.content.data?.weekStart;

    return tipo === "insight" && semana === weekStart;
  });
}
