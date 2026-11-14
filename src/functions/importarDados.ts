import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";

import { initializeDatabase } from "@/database/database";

interface BackupDados {
  versaoBackup: number;
  exportadoEm?: string;
  days: any[];
  sleep_records: any[];
  study_sessions: any[];
  smoking_records: any[];
  habits: any[];
  habit_records: any[];
  daily_metrics: any[];
  insight_records: any[];
  settings: any[];
}

function validarBackup(dados: any): dados is BackupDados {
  if (!dados || typeof dados !== "object") {
    return false;
  }

  if (
    typeof dados.versaoBackup !== "number" ||
    !Number.isInteger(dados.versaoBackup) ||
    dados.versaoBackup < 1
  ) {
    return false;
  }

  const tabelasObrigatorias = [
    "days",
    "sleep_records",
    "study_sessions",
    "smoking_records",
    "habits",
    "habit_records",
    "daily_metrics",
    "insight_records",
    "settings",
  ];

  return tabelasObrigatorias.every((tabela) => Array.isArray(dados[tabela]));
}

export async function importarDadosJSON(): Promise<{
  importado: boolean;
  quantidadeDias: number;
}> {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (resultado.canceled) {
    return {
      importado: false,
      quantidadeDias: 0,
    };
  }

  const arquivoSelecionado = resultado.assets[0];

  if (!arquivoSelecionado?.uri) {
    throw new Error("Não foi possível acessar o arquivo selecionado.");
  }

  const arquivo = new File(arquivoSelecionado.uri);
  const conteudo = await arquivo.text();

  let dados: unknown;

  try {
    dados = JSON.parse(conteudo);
  } catch {
    throw new Error("O arquivo selecionado não contém um JSON válido.");
  }

  if (!validarBackup(dados)) {
    throw new Error(
      "Este arquivo não é um backup válido do Produtividade Max.",
    );
  }

  const db = await initializeDatabase();

  await db.withTransactionAsync(async () => {
    /*
     * Primeiro removemos as tabelas que possuem
     * relacionamento com outras tabelas.
     */
    await db.runAsync("DELETE FROM habit_records");
    await db.runAsync("DELETE FROM sleep_records");
    await db.runAsync("DELETE FROM study_sessions");
    await db.runAsync("DELETE FROM smoking_records");
    await db.runAsync("DELETE FROM daily_metrics");
    await db.runAsync("DELETE FROM insight_records");

    /*
     * Depois removemos as tabelas principais.
     */
    await db.runAsync("DELETE FROM habits");
    await db.runAsync("DELETE FROM days");
    await db.runAsync("DELETE FROM settings");

    /*
     * DAYS
     */
    for (const dia of dados.days) {
      await db.runAsync(
        `
          INSERT INTO days (
            id,
            date,
            notes,
            created_at
          )
          VALUES (?, ?, ?, ?)
        `,
        dia.id,
        dia.date,
        dia.notes ?? null,
        dia.created_at,
      );
    }

    /*
     * HABITS
     */
    for (const habito of dados.habits) {
      await db.runAsync(
        `
          INSERT INTO habits (
            id,
            name,
            description,
            active,
            created_at
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        habito.id,
        habito.name,
        habito.description ?? null,
        habito.active ?? 1,
        habito.created_at,
      );
    }

    /*
     * SLEEP
     */
    for (const sono of dados.sleep_records) {
      await db.runAsync(
        `
          INSERT INTO sleep_records (
            id,
            day_id,
            sleep_time,
            wake_time,
            duration_minutes,
            quality
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        sono.id,
        sono.day_id,
        sono.sleep_time,
        sono.wake_time,
        sono.duration_minutes ?? null,
        sono.quality ?? null,
      );
    }

    /*
     * STUDY
     */
    for (const estudo of dados.study_sessions) {
      await db.runAsync(
        `
          INSERT INTO study_sessions (
            id,
            day_id,
            subject,
            start_time,
            end_time,
            duration_minutes,
            questions_total,
            questions_correct,
            questions_wrong,
            notes
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        estudo.id,
        estudo.day_id,
        estudo.subject,
        estudo.start_time ?? null,
        estudo.end_time ?? null,
        estudo.duration_minutes ?? null,
        estudo.questions_total ?? 0,
        estudo.questions_correct ?? 0,
        estudo.questions_wrong ?? 0,
        estudo.notes ?? null,
      );
    }

    /*
     * SMOKING
     */
    for (const cigarro of dados.smoking_records) {
      await db.runAsync(
        `
          INSERT INTO smoking_records (
            id,
            day_id,
            morning,
            afternoon,
            night,
            total
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        cigarro.id,
        cigarro.day_id,
        cigarro.morning ?? 0,
        cigarro.afternoon ?? 0,
        cigarro.night ?? 0,
        cigarro.total ?? 0,
      );
    }

    /*
     * DAILY METRICS
     */
    for (const metrica of dados.daily_metrics) {
      await db.runAsync(
        `
          INSERT INTO daily_metrics (
            id,
            day_id,
            energy,
            mood,
            water_ml
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        metrica.id,
        metrica.day_id,
        metrica.energy ?? null,
        metrica.mood ?? null,
        metrica.water_ml ?? 0,
      );
    }

    /*
     * HABIT RECORDS
     */
    for (const registro of dados.habit_records) {
      await db.runAsync(
        `
          INSERT INTO habit_records (
            id,
            day_id,
            habit_id,
            completed,
            notes
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        registro.id,
        registro.day_id,
        registro.habit_id,
        registro.completed ?? 0,
        registro.notes ?? null,
      );
    }

    /*
     * INSIGHTS
     */
    for (const insight of dados.insight_records) {
      await db.runAsync(
        `
          INSERT INTO insight_records (
            id,
            type,
            message,
            week_start,
            created_at
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        insight.id,
        insight.type,
        insight.message,
        insight.week_start,
        insight.created_at,
      );
    }

    /*
     * SETTINGS
     */
    for (const setting of dados.settings) {
      await db.runAsync(
        `
          INSERT INTO settings (
            id,
            key,
            value
          )
          VALUES (?, ?, ?)
        `,
        setting.id,
        setting.key,
        setting.value,
      );
    }
  });

  return {
    importado: true,
    quantidadeDias: dados.days.length,
  };
}
