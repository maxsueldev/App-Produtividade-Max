import * as SQLite from "expo-sqlite";

import { buscarConfiguracoes } from "@/functions/configuracoes";

import { agendarNotificacoesAgua } from "./aguaNotification";
import { agendarNotificacoesCigarros } from "./cigarroNotification";
import { agendarNotificacoesEstudo } from "./estudoNotification";
import { agendarNotificacoesHabitos } from "./habitosNotification";
import { agendarNotificacaoInsight } from "./insightNotification";
import { cancelarNotificacoesFixas } from "./notificationService";
import { agendarNotificacaoRegistro } from "./registroNotification";
import { agendarNotificacaoRevisao } from "./revisaoNotification";
import { agendarNotificacaoSono } from "./sonoNotification";

let agendamentoEmAndamento: Promise<void> | null = null;

export function agendarTodasNotificacoes(
  db: SQLite.SQLiteDatabase,
): Promise<void> {
  if (agendamentoEmAndamento) {
    return agendamentoEmAndamento;
  }

  agendamentoEmAndamento = executarAgendamento(db);

  return agendamentoEmAndamento;
}

async function executarAgendamento(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    /*
     * Busca as configurações uma única vez.
     */
    const configuracoes = await buscarConfiguracoes(db);

    /*
     * Remove somente as notificações fixas
     * antes de recriá-las.
     */
    await cancelarNotificacoesFixas();

    if (configuracoes.acompanharAgua) {
      await agendarNotificacoesAgua(configuracoes.lembreteAgua);
    }

    if (configuracoes.acompanharEstudos) {
      await agendarNotificacoesEstudo(configuracoes.lembreteEstudos);
    }

    if (configuracoes.acompanharHabitos) {
      await agendarNotificacoesHabitos(configuracoes.lembreteHabitos);
    }

    await agendarNotificacaoRegistro(configuracoes.lembreteRegistro);

    if (configuracoes.acompanharSono) {
      await agendarNotificacaoSono(configuracoes.lembreteSono);
    }

    await agendarNotificacaoRevisao(configuracoes.lembreteRevisao);

    if (configuracoes.acompanharCigarros) {
      await agendarNotificacoesCigarros(configuracoes.lembreteCigarros);
    }

    await agendarNotificacaoInsight(db, configuracoes);
  } finally {
    agendamentoEmAndamento = null;
  }
}
