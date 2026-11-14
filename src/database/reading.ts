import type { SQLiteDatabase } from "expo-sqlite";

export interface ReadingRecord {
  id: number;
  day_id: number;
  pages_read: number;
}

/**
 * Busca o registro de leitura de um determinado dia.
 */
export async function buscarLeituraDoDia(
  db: SQLiteDatabase,
  date: string,
): Promise<ReadingRecord | null> {
  const leitura = await db.getFirstAsync<ReadingRecord>(
    `
      SELECT
        reading_records.id,
        reading_records.day_id,
        reading_records.pages_read
      FROM reading_records
      INNER JOIN days
        ON days.id = reading_records.day_id
      WHERE days.date = ?
      LIMIT 1
    `,
    date,
  );

  return leitura ?? null;
}

/**
 * Salva ou atualiza a quantidade de páginas lidas no dia.
 */
export async function salvarLeitura(
  db: SQLiteDatabase,
  date: string,
  pagesRead: number,
): Promise<void> {
  const day = await db.getFirstAsync<{ id: number }>(
    `
      SELECT id
      FROM days
      WHERE date = ?
      LIMIT 1
    `,
    date,
  );

  if (!day) {
    throw new Error(
      `Não foi possível salvar a leitura: dia ${date} não encontrado.`,
    );
  }

  await db.runAsync(
    `
      INSERT INTO reading_records (
        day_id,
        pages_read
      )
      VALUES (?, ?)
      ON CONFLICT(day_id)
      DO UPDATE SET
        pages_read = excluded.pages_read
    `,
    day.id,
    Math.max(0, Math.floor(pagesRead)),
  );
}

/**
 * Adiciona páginas ao registro de leitura do dia.
 */
export async function adicionarPaginasLidas(
  db: SQLiteDatabase,
  date: string,
  pages: number,
): Promise<void> {
  const leitura = await buscarLeituraDoDia(db, date);

  const paginasAtuais = leitura?.pages_read ?? 0;

  await salvarLeitura(db, date, paginasAtuais + pages);
}

export async function salvarLeituraPorDia(
  db: SQLiteDatabase,
  dayId: number,
  pagesRead: number,
): Promise<void> {
  await db.runAsync(
    `
      INSERT INTO reading_records (
        day_id,
        pages_read
      )
      VALUES (?, ?)
      ON CONFLICT(day_id)
      DO UPDATE SET
        pages_read = excluded.pages_read
    `,
    dayId,
    Math.max(0, Math.floor(pagesRead)),
  );
}
