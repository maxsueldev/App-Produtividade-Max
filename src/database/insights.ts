import * as SQLite from "expo-sqlite";

export interface InsightRecord {
  id: number;
  type: string;
  message: string;
  week_start: string;
  created_at: string;
}

export async function createInsightRecord(
  db: SQLite.SQLiteDatabase,
  type: string,
  message: string,
  weekStart: string,
): Promise<number> {
  const result = await db.runAsync(
    `
      INSERT INTO insight_records
        (
          type,
          message,
          week_start
        )
      VALUES (?, ?, ?)
    `,
    type,
    message,
    weekStart,
  );

  return result.lastInsertRowId;
}

export async function getInsightRecords(
  db: SQLite.SQLiteDatabase,
): Promise<InsightRecord[]> {
  return await db.getAllAsync<InsightRecord>(
    `
      SELECT *
      FROM insight_records
      ORDER BY created_at DESC
    `,
  );
}

export async function getInsightByWeek(
  db: SQLite.SQLiteDatabase,
  weekStart: string,
): Promise<InsightRecord | null> {
  const insight = await db.getFirstAsync<InsightRecord>(
    `
        SELECT *
        FROM insight_records
        WHERE week_start = ?
      `,
    weekStart,
  );

  return insight ?? null;
}

export async function deleteInsightRecord(
  db: SQLite.SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM insight_records
      WHERE id = ?
    `,
    id,
  );
}

export async function deleteAllInsightRecords(
  db: SQLite.SQLiteDatabase,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM insight_records
    `,
  );
}

export async function deleteInsightByWeek(
  db: SQLite.SQLiteDatabase,
  weekStart: string,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM insight_records
      WHERE week_start = ?
    `,
    weekStart,
  );
}
