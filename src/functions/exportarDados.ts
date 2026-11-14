import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { initializeDatabase } from "@/database/database";

interface DadosExportados {
  versaoBackup: number;
  exportadoEm: string;
  days: unknown[];
  sleep_records: unknown[];
  study_sessions: unknown[];
  smoking_records: unknown[];
  habits: unknown[];
  habit_records: unknown[];
  daily_metrics: unknown[];
  insight_records: unknown[];
  settings: unknown[];
}

async function compartilharArquivo(
  nomeArquivo: string,
  conteudo: string,
  mimeType: string,
): Promise<void> {
  const file = new File(Paths.cache, nomeArquivo);

  if (file.exists) {
    file.delete();
  }

  file.create();
  file.write(conteudo);

  const disponivel = await Sharing.isAvailableAsync();

  if (!disponivel) {
    throw new Error("O compartilhamento de arquivos não está disponível.");
  }

  await Sharing.shareAsync(file.uri, {
    mimeType,
    dialogTitle: "Exportar dados do Produtividade Max",
  });
}

export async function exportarDadosJSON(): Promise<void> {
  const db = await initializeDatabase();

  const dados: DadosExportados = {
    versaoBackup: 1,
    exportadoEm: new Date().toISOString(),

    days: await db.getAllAsync("SELECT * FROM days ORDER BY date ASC"),

    sleep_records: await db.getAllAsync(
      "SELECT * FROM sleep_records ORDER BY day_id ASC, id ASC",
    ),

    study_sessions: await db.getAllAsync(
      "SELECT * FROM study_sessions ORDER BY day_id ASC, id ASC",
    ),

    smoking_records: await db.getAllAsync(
      "SELECT * FROM smoking_records ORDER BY day_id ASC, id ASC",
    ),

    habits: await db.getAllAsync("SELECT * FROM habits ORDER BY id ASC"),

    habit_records: await db.getAllAsync(
      "SELECT * FROM habit_records ORDER BY day_id ASC, id ASC",
    ),

    daily_metrics: await db.getAllAsync(
      "SELECT * FROM daily_metrics ORDER BY day_id ASC",
    ),

    insight_records: await db.getAllAsync(
      "SELECT * FROM insight_records ORDER BY id ASC",
    ),

    settings: await db.getAllAsync("SELECT * FROM settings ORDER BY key ASC"),
  };

  const json = JSON.stringify(dados, null, 2);

  const dataAtual = new Date().toISOString().slice(0, 10);

  await compartilharArquivo(
    `produtividade-max-${dataAtual}.json`,
    json,
    "application/json",
  );
}

function escaparCSV(valor: unknown): string {
  if (valor === null || valor === undefined) {
    return "";
  }

  const texto = String(valor);

  if (
    texto.includes('"') ||
    texto.includes(",") ||
    texto.includes("\n") ||
    texto.includes("\r")
  ) {
    return `"${texto.replace(/"/g, '""')}"`;
  }

  return texto;
}

export async function exportarDadosCSV(): Promise<void> {
  const db = await initializeDatabase();

  const dias = await db.getAllAsync<{
    id: number;
    date: string;
    notes: string | null;
    created_at: string;
  }>("SELECT * FROM days ORDER BY date ASC");

  const linhas: string[] = [];

  linhas.push(
    [
      "data",
      "sono_horario",
      "sono_acordar",
      "sono_minutos",
      "sono_qualidade",
      "estudos",
      "minutos_estudo",
      "questoes_total",
      "questoes_corretas",
      "questoes_erradas",
      "cigarros_manha",
      "cigarros_tarde",
      "cigarros_noite",
      "cigarros_total",
      "agua_ml",
      "energia",
      "humor",
      "habitos_concluidos",
      "habitos_total",
      "observacoes",
    ].join(","),
  );

  for (const dia of dias) {
    const sono = await db.getFirstAsync<{
      sleep_time: string | null;
      wake_time: string | null;
      duration_minutes: number | null;
      quality: number | null;
    }>(
      `
        SELECT
          sleep_time,
          wake_time,
          duration_minutes,
          quality
        FROM sleep_records
        WHERE day_id = ?
        LIMIT 1
      `,
      dia.id,
    );

    const estudos = await db.getFirstAsync<{
      quantidade: number;
      minutos: number;
      questoes_total: number;
      questoes_corretas: number;
      questoes_erradas: number;
    }>(
      `
        SELECT
          COUNT(*) AS quantidade,
          COALESCE(SUM(duration_minutes), 0) AS minutos,
          COALESCE(SUM(questions_total), 0) AS questoes_total,
          COALESCE(SUM(questions_correct), 0) AS questoes_corretas,
          COALESCE(SUM(questions_wrong), 0) AS questoes_erradas
        FROM study_sessions
        WHERE day_id = ?
      `,
      dia.id,
    );

    const cigarros = await db.getFirstAsync<{
      morning: number;
      afternoon: number;
      night: number;
      total: number;
    }>(
      `
        SELECT
          morning,
          afternoon,
          night,
          total
        FROM smoking_records
        WHERE day_id = ?
        LIMIT 1
      `,
      dia.id,
    );

    const metricas = await db.getFirstAsync<{
      water_ml: number;
      energy: number | null;
      mood: number | null;
    }>(
      `
        SELECT
          water_ml,
          energy,
          mood
        FROM daily_metrics
        WHERE day_id = ?
        LIMIT 1
      `,
      dia.id,
    );

    const habitos = await db.getFirstAsync<{
      concluidos: number;
      total: number;
    }>(
      `
        SELECT
          COUNT(
            CASE
              WHEN completed = 1 THEN 1
            END
          ) AS concluidos,
          COUNT(*) AS total
        FROM habit_records
        WHERE day_id = ?
      `,
      dia.id,
    );

    linhas.push(
      [
        escaparCSV(dia.date),
        escaparCSV(sono?.sleep_time),
        escaparCSV(sono?.wake_time),
        escaparCSV(sono?.duration_minutes),
        escaparCSV(sono?.quality),
        escaparCSV(estudos?.quantidade ?? 0),
        escaparCSV(estudos?.minutos ?? 0),
        escaparCSV(estudos?.questoes_total ?? 0),
        escaparCSV(estudos?.questoes_corretas ?? 0),
        escaparCSV(estudos?.questoes_erradas ?? 0),
        escaparCSV(cigarros?.morning ?? 0),
        escaparCSV(cigarros?.afternoon ?? 0),
        escaparCSV(cigarros?.night ?? 0),
        escaparCSV(cigarros?.total ?? 0),
        escaparCSV(metricas?.water_ml ?? 0),
        escaparCSV(metricas?.energy),
        escaparCSV(metricas?.mood),
        escaparCSV(habitos?.concluidos ?? 0),
        escaparCSV(habitos?.total ?? 0),
        escaparCSV(dia.notes),
      ].join(","),
    );
  }

  const csv = "\uFEFF" + linhas.join("\n");

  const dataAtual = new Date().toISOString().slice(0, 10);

  await compartilharArquivo(
    `produtividade-max-${dataAtual}.csv`,
    csv,
    "text/csv",
  );
}
