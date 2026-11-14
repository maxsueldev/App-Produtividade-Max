import * as SQLite from "expo-sqlite";

export interface SmokingRecord {
  id: number;
  day_id: number;

  morning: number;
  afternoon: number;
  night: number;

  total: number;
}

export async function createSmokingRecord(
  db: SQLite.SQLiteDatabase,
  smoking: Omit<SmokingRecord, "id">,
) {
  const result = await db.runAsync(
    `
      INSERT INTO smoking_records (
        day_id,
        morning,
        afternoon,
        night,
        total
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    smoking.day_id,
    smoking.morning,
    smoking.afternoon,
    smoking.night,
    smoking.total,
  );

  return result.lastInsertRowId;
}

export async function getSmokingRecordById(
  db: SQLite.SQLiteDatabase,
  id: number,
) {
  // CRUD será implementado aqui
}

export async function getSmokingRecordByDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
): Promise<SmokingRecord | null> {
  const record = await db.getFirstAsync<SmokingRecord>(
    `
      SELECT
        id,
        day_id,
        morning,
        afternoon,
        night,
        total
      FROM smoking_records
      WHERE day_id = ?
    `,
    dayId,
  );

  return record ?? null;
}

export async function updateSmokingRecord(
  db: SQLite.SQLiteDatabase,
  id: number,
  smoking: Partial<Omit<SmokingRecord, "id">>,
) {
  // CRUD será implementado aqui
}

export async function deleteSmokingRecord(
  db: SQLite.SQLiteDatabase,
  id: number,
) {
  // CRUD será implementado aqui
}

export async function deleteSmokingRecordsByDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
) {
  await db.runAsync(
    `
      DELETE FROM smoking_records
      WHERE day_id = ?
    `,
    dayId,
  );
}
