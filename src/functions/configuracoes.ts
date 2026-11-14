import * as SQLite from "expo-sqlite";

import { getSetting, saveSetting } from "@/database/settings";
import { agendarNotificacoesAgua } from "@/notifications/aguaNotification";
import { agendarNotificacoesCigarros } from "@/notifications/cigarroNotification";
import { agendarNotificacoesEstudo } from "@/notifications/estudoNotification";
import { agendarNotificacoesHabitos } from "@/notifications/habitosNotification";
import { agendarNotificacaoInsight } from "@/notifications/insightNotification";
import { agendarNotificacoesLeitura } from "@/notifications/leituraNotification";
import {
  cancelarNotificacaoInsight,
  cancelarNotificacoesFixas,
} from "@/notifications/notificationService";
import { agendarNotificacaoRegistro } from "@/notifications/registroNotification";
import { agendarNotificacaoRevisao } from "@/notifications/revisaoNotification";
import { agendarNotificacaoSono } from "@/notifications/sonoNotification";
import { formatarHorario, horarioValido, numeroValido } from "./data";

export interface Configuracoes {
  nome: string;
  sobrenome: string;

  // Módulos ativos
  acompanharSono: boolean;
  acompanharEstudos: boolean;
  acompanharCigarros: boolean;
  acompanharAgua: boolean;
  acompanharHumor: boolean;
  acompanharEnergia: boolean;
  acompanharHabitos: boolean;
  acompanharLeitura: boolean;

  // Metas
  metaCigarros: number;
  metaSono: number;
  metaEstudo: number;
  metaAgua: number;
  metaQuestoes: number;
  metaHabitos: number;
  metaLeitura: number;

  // Lembretes por módulo
  lembreteAgua: string[];
  lembreteEstudos: string[];
  lembreteLeitura: string[];
  lembreteHabitos: string[];
  lembreteCigarros: string[];

  // Lembretes gerais
  lembreteRegistro: string;
  lembreteSono: string;
  lembreteRevisao: string;
  lembreteInsight: string;

  modoEscuro: boolean;
}

const configuracoesPadrao: Configuracoes = {
  nome: "",
  sobrenome: "",

  // Todos os módulos começam ativos
  acompanharSono: true,
  acompanharEstudos: true,
  acompanharCigarros: false,
  acompanharAgua: true,
  acompanharHumor: true,
  acompanharEnergia: true,
  acompanharHabitos: true,
  acompanharLeitura: true,

  // Metas
  metaCigarros: 15,
  metaSono: 8,
  metaEstudo: 180,
  metaAgua: 2500,
  metaQuestoes: 50,
  metaHabitos: 100,
  metaLeitura: 50,

  // Lembretes por módulo
  lembreteAgua: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],

  lembreteEstudos: ["09:00", "14:00", "19:00"],

  lembreteLeitura: ["20:00"],

  lembreteHabitos: ["08:30", "20:30"],

  lembreteCigarros: ["11:00", "17:00", "22:00"],

  // Lembretes gerais
  lembreteRegistro: "21:30",
  lembreteSono: "23:00",
  lembreteRevisao: "21:45",
  lembreteInsight: "20:00",

  modoEscuro: false,
};

function converterNumero(valor: string | null, padrao: number): number {
  if (valor === null) {
    return padrao;
  }

  const numero = Number(valor);

  return Number.isFinite(numero) ? numero : padrao;
}

function converterBooleano(valor: string | null, padrao: boolean): boolean {
  if (valor === null) {
    return padrao;
  }

  return valor === "1";
}

function converterArray(valor: string | null, padrao: string[]): string[] {
  if (valor === null) {
    return padrao;
  }

  try {
    const array = JSON.parse(valor);

    if (Array.isArray(array)) {
      return array;
    }

    return padrao;
  } catch {
    return padrao;
  }
}

export async function buscarConfiguracoes(
  db: SQLite.SQLiteDatabase,
): Promise<Configuracoes> {
  return {
    nome: (await getSetting(db, "nome")) ?? configuracoesPadrao.nome,

    sobrenome:
      (await getSetting(db, "sobrenome")) ?? configuracoesPadrao.sobrenome,

    // ==========================================
    // MÓDULOS
    // ==========================================

    acompanharSono: converterBooleano(
      await getSetting(db, "acompanhar_sono"),
      configuracoesPadrao.acompanharSono,
    ),

    acompanharEstudos: converterBooleano(
      await getSetting(db, "acompanhar_estudos"),
      configuracoesPadrao.acompanharEstudos,
    ),

    acompanharCigarros: converterBooleano(
      await getSetting(db, "acompanhar_cigarros"),
      configuracoesPadrao.acompanharCigarros,
    ),

    acompanharAgua: converterBooleano(
      await getSetting(db, "acompanhar_agua"),
      configuracoesPadrao.acompanharAgua,
    ),

    acompanharHumor: converterBooleano(
      await getSetting(db, "acompanhar_humor"),
      configuracoesPadrao.acompanharHumor,
    ),

    acompanharEnergia: converterBooleano(
      await getSetting(db, "acompanhar_energia"),
      configuracoesPadrao.acompanharEnergia,
    ),

    acompanharHabitos: converterBooleano(
      await getSetting(db, "acompanhar_habitos"),
      configuracoesPadrao.acompanharHabitos,
    ),

    acompanharLeitura: converterBooleano(
      await getSetting(db, "acompanhar_leitura"),
      configuracoesPadrao.acompanharLeitura,
    ),

    // ==========================================
    // METAS
    // ==========================================

    metaCigarros: converterNumero(
      await getSetting(db, "meta_cigarros"),
      configuracoesPadrao.metaCigarros,
    ),

    metaSono: converterNumero(
      await getSetting(db, "meta_sono"),
      configuracoesPadrao.metaSono,
    ),

    metaEstudo: converterNumero(
      await getSetting(db, "meta_estudo"),
      configuracoesPadrao.metaEstudo,
    ),

    metaAgua: converterNumero(
      await getSetting(db, "meta_agua"),
      configuracoesPadrao.metaAgua,
    ),

    metaQuestoes: converterNumero(
      await getSetting(db, "meta_questoes"),
      configuracoesPadrao.metaQuestoes,
    ),

    metaHabitos: converterNumero(
      await getSetting(db, "meta_habitos"),
      configuracoesPadrao.metaHabitos,
    ),

    metaLeitura: converterNumero(
      await getSetting(db, "meta_leitura"),
      configuracoesPadrao.metaLeitura,
    ),

    // ==========================================
    // LEMBRETES POR MÓDULO
    // ==========================================

    lembreteAgua: converterArray(
      await getSetting(db, "lembrete_agua"),
      configuracoesPadrao.lembreteAgua,
    ),

    lembreteEstudos: converterArray(
      await getSetting(db, "lembrete_estudos"),
      configuracoesPadrao.lembreteEstudos,
    ),

    lembreteLeitura: converterArray(
      await getSetting(db, "lembrete_leitura"),
      configuracoesPadrao.lembreteLeitura,
    ),

    lembreteHabitos: converterArray(
      await getSetting(db, "lembrete_habitos"),
      configuracoesPadrao.lembreteHabitos,
    ),

    lembreteCigarros: converterArray(
      await getSetting(db, "lembrete_cigarros"),
      configuracoesPadrao.lembreteCigarros,
    ),

    // ==========================================
    // LEMBRETES GERAIS
    // ==========================================

    lembreteRegistro:
      (await getSetting(db, "lembrete_registro")) ??
      configuracoesPadrao.lembreteRegistro,

    lembreteSono:
      (await getSetting(db, "lembrete_sono")) ??
      configuracoesPadrao.lembreteSono,

    lembreteRevisao:
      (await getSetting(db, "lembrete_revisao")) ??
      configuracoesPadrao.lembreteRevisao,

    lembreteInsight:
      (await getSetting(db, "lembrete_insight")) ??
      configuracoesPadrao.lembreteInsight,

    // ==========================================
    // APARÊNCIA
    // ==========================================

    modoEscuro: converterBooleano(
      await getSetting(db, "modo_escuro"),
      configuracoesPadrao.modoEscuro,
    ),
  };
}

export async function salvarConfiguracoes(
  db: SQLite.SQLiteDatabase,
  configuracoes: Configuracoes,
): Promise<void> {
  const valores: Record<string, string> = {
    nome: configuracoes.nome,
    sobrenome: configuracoes.sobrenome,

    // ==========================================
    // MÓDULOS
    // ==========================================

    acompanhar_sono: configuracoes.acompanharSono ? "1" : "0",
    acompanhar_estudos: configuracoes.acompanharEstudos ? "1" : "0",
    acompanhar_cigarros: configuracoes.acompanharCigarros ? "1" : "0",
    acompanhar_agua: configuracoes.acompanharAgua ? "1" : "0",
    acompanhar_humor: configuracoes.acompanharHumor ? "1" : "0",
    acompanhar_energia: configuracoes.acompanharEnergia ? "1" : "0",
    acompanhar_habitos: configuracoes.acompanharHabitos ? "1" : "0",
    acompanhar_leitura: configuracoes.acompanharLeitura ? "1" : "0",

    // ==========================================
    // METAS
    // ==========================================

    meta_cigarros: String(configuracoes.metaCigarros),
    meta_sono: String(configuracoes.metaSono),
    meta_estudo: String(configuracoes.metaEstudo),
    meta_agua: String(configuracoes.metaAgua),
    meta_questoes: String(configuracoes.metaQuestoes),
    meta_habitos: String(configuracoes.metaHabitos),
    meta_leitura: String(configuracoes.metaLeitura),

    // ==========================================
    // LEMBRETES POR MÓDULO
    // ==========================================

    lembrete_agua: JSON.stringify(configuracoes.lembreteAgua),
    lembrete_estudos: JSON.stringify(configuracoes.lembreteEstudos),
    lembrete_leitura: JSON.stringify(configuracoes.lembreteLeitura),
    lembrete_habitos: JSON.stringify(configuracoes.lembreteHabitos),
    lembrete_cigarros: JSON.stringify(configuracoes.lembreteCigarros),

    // ==========================================
    // LEMBRETES GERAIS
    // ==========================================

    lembrete_registro: configuracoes.lembreteRegistro,
    lembrete_sono: configuracoes.lembreteSono,
    lembrete_revisao: configuracoes.lembreteRevisao,
    lembrete_insight: configuracoes.lembreteInsight,

    // ==========================================
    // APARÊNCIA
    // ==========================================

    modo_escuro: configuracoes.modoEscuro ? "1" : "0",
  };

  for (const [key, value] of Object.entries(valores)) {
    await saveSetting(db, key, value);
  }
}

export async function sincronizarNotificacoes(
  db: SQLite.SQLiteDatabase,
  configuracoesAtuais: Configuracoes,
): Promise<void> {
  await cancelarNotificacoesFixas();

  if (configuracoesAtuais.acompanharAgua) {
    await agendarNotificacoesAgua(configuracoesAtuais.lembreteAgua);
  }

  if (configuracoesAtuais.acompanharCigarros) {
    await agendarNotificacoesCigarros(configuracoesAtuais.lembreteCigarros);
  }

  if (configuracoesAtuais.acompanharEstudos) {
    await agendarNotificacoesEstudo(configuracoesAtuais.lembreteEstudos);
  }

  if (configuracoesAtuais.acompanharLeitura) {
    await agendarNotificacoesLeitura(configuracoesAtuais.lembreteLeitura);
  }

  if (configuracoesAtuais.acompanharHabitos) {
    await agendarNotificacoesHabitos(configuracoesAtuais.lembreteHabitos);
  }

  if (configuracoesAtuais.acompanharSono) {
    await agendarNotificacaoSono(configuracoesAtuais.lembreteSono);
  }

  await agendarNotificacaoRegistro(configuracoesAtuais.lembreteRegistro);

  await agendarNotificacaoRevisao(configuracoesAtuais.lembreteRevisao);

  await cancelarNotificacaoInsight();

  await agendarNotificacaoInsight(db, configuracoesAtuais);
}

type TipoHorario = "agua" | "estudos" | "leitura" | "habitos";

export function adicionarHorario(
  anterior: Configuracoes,
  tipo: TipoHorario,
): Configuracoes {
  if (tipo === "agua") {
    return {
      ...anterior,
      lembreteAgua: [...anterior.lembreteAgua, "08:00"],
    };
  }

  if (tipo === "estudos") {
    return {
      ...anterior,
      lembreteEstudos: [...anterior.lembreteEstudos, "09:00"],
    };
  }

  if (tipo === "leitura") {
    return {
      ...anterior,
      lembreteLeitura: [...anterior.lembreteLeitura, "20:00"],
    };
  }

  return {
    ...anterior,
    lembreteHabitos: [...anterior.lembreteHabitos, "08:30"],
  };
}

export function removerHorario(
  anterior: Configuracoes,
  tipo: TipoHorario,
  index: number,
): Configuracoes {
  if (tipo === "agua") {
    return {
      ...anterior,
      lembreteAgua: anterior.lembreteAgua.filter(
        (_, indice) => indice !== index,
      ),
    };
  }

  if (tipo === "estudos") {
    return {
      ...anterior,
      lembreteEstudos: anterior.lembreteEstudos.filter(
        (_, indice) => indice !== index,
      ),
    };
  }

  if (tipo === "leitura") {
    return {
      ...anterior,
      lembreteLeitura: anterior.lembreteLeitura.filter(
        (_, indice) => indice !== index,
      ),
    };
  }

  return {
    ...anterior,
    lembreteHabitos: anterior.lembreteHabitos.filter(
      (_, indice) => indice !== index,
    ),
  };
}

export function alterarHorario(
  anterior: Configuracoes,
  tipo: TipoHorario,
  index: number,
  horarioFormatado: string,
): Configuracoes {
  if (tipo === "agua") {
    const novosHorarios = [...anterior.lembreteAgua];

    novosHorarios[index] = horarioFormatado;

    return {
      ...anterior,
      lembreteAgua: novosHorarios,
    };
  }

  if (tipo === "estudos") {
    const novosHorarios = [...anterior.lembreteEstudos];

    novosHorarios[index] = horarioFormatado;

    return {
      ...anterior,
      lembreteEstudos: novosHorarios,
    };
  }

  if (tipo === "leitura") {
    const novosHorarios = [...anterior.lembreteLeitura];

    novosHorarios[index] = horarioFormatado;

    return {
      ...anterior,
      lembreteLeitura: novosHorarios,
    };
  }

  const novosHorarios = [...anterior.lembreteHabitos];

  novosHorarios[index] = horarioFormatado;

  return {
    ...anterior,
    lembreteHabitos: novosHorarios,
  };
}

type CampoLembreteIndividual =
  | "lembreteRegistro"
  | "lembreteSono"
  | "lembreteRevisao"
  | "lembreteInsight";

export function alterarLembreteIndividual(
  anterior: Configuracoes,
  campo: CampoLembreteIndividual,
  valor: string,
): Configuracoes {
  const horarioFormatado = formatarHorario(valor);

  return {
    ...anterior,
    [campo]: horarioFormatado,
  };
}

export function validarConfiguracoes(
  configuracoes: Configuracoes,
): string | null {
  const {
    acompanharSono,
    acompanharEstudos,
    acompanharCigarros,
    acompanharAgua,
    acompanharLeitura,
    acompanharHabitos,

    metaCigarros,
    metaSono,
    metaEstudo,
    metaAgua,
    metaQuestoes,
    metaLeitura,
    metaHabitos,

    lembreteAgua,
    lembreteEstudos,
    lembreteLeitura,
    lembreteHabitos,
    lembreteCigarros,

    lembreteRegistro,
    lembreteSono,
    lembreteRevisao,
    lembreteInsight,
  } = configuracoes;

  if (acompanharCigarros && !numeroValido(metaCigarros, 0)) {
    return "A meta de cigarros deve ser um número inteiro igual ou maior que 0.";
  }

  if (acompanharSono && !numeroValido(metaSono, 1, 24)) {
    return "A meta de sono deve ser um número inteiro entre 1 e 24 horas.";
  }

  if (acompanharEstudos && !numeroValido(metaEstudo, 1)) {
    return "A meta de estudo deve ser um número inteiro de pelo menos 1 minuto.";
  }

  if (acompanharAgua && !numeroValido(metaAgua, 1)) {
    return "A meta de água deve ser um número inteiro de pelo menos 1 ml.";
  }

  if (acompanharEstudos && !numeroValido(metaQuestoes, 1)) {
    return "A meta de questões deve ser um número inteiro de pelo menos 1 questão.";
  }

  if (acompanharHabitos && !numeroValido(metaHabitos, 1, 100)) {
    return "A meta de hábitos deve ser um número inteiro entre 1 e 100.";
  }

  if (acompanharLeitura && !numeroValido(metaLeitura, 1)) {
    return "A meta de leitura deve ser um número inteiro de pelo menos 1 página.";
  }

  if (
    acompanharAgua &&
    lembreteAgua.some((horario) => !horarioValido(horario))
  ) {
    return "Verifique os horários dos lembretes de água. Use o formato HH:MM.";
  }

  if (acompanharCigarros) {
    if (lembreteCigarros.length !== 3) {
      return "Os lembretes de cigarros devem possuir exatamente três horários: manhã, tarde e noite.";
    }

    if (lembreteCigarros.some((horario) => !horarioValido(horario))) {
      return "Verifique os três horários dos lembretes de cigarros. Use o formato HH:MM.";
    }
  }

  if (
    acompanharEstudos &&
    lembreteEstudos.some((horario) => !horarioValido(horario))
  ) {
    return "Verifique os horários dos lembretes de estudos. Use o formato HH:MM.";
  }

  if (
    acompanharLeitura &&
    lembreteLeitura.some((horario) => !horarioValido(horario))
  ) {
    return "Verifique os horários dos lembretes de leitura. Use o formato HH:MM.";
  }

  if (
    acompanharHabitos &&
    lembreteHabitos.some((horario) => !horarioValido(horario))
  ) {
    return "Verifique os horários dos lembretes de hábitos. Use o formato HH:MM.";
  }

  if (!horarioValido(lembreteRegistro)) {
    return "Verifique o horário do registro diário. Use o formato HH:MM.";
  }

  if (acompanharSono && !horarioValido(lembreteSono)) {
    return "Verifique o horário do sono. Use o formato HH:MM.";
  }

  if (!horarioValido(lembreteRevisao)) {
    return "Verifique o horário da revisão. Use o formato HH:MM.";
  }

  if (!horarioValido(lembreteInsight)) {
    return "Verifique o horário do insight semanal. Use o formato HH:MM.";
  }

  return null;
}
