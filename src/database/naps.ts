import * as SQLite from "expo-sqlite";

export interface NapRecord {
  id: number;
  day_id: number;

  sleep_time: string;
  wake_time: string;

  duration_minutes?: number;
}

export async function createNapRecord(
  db: SQLite.SQLiteDatabase,
  nap: Omit<NapRecord, "id">,
) {
  const result = await db.runAsync(
    `
      INSERT INTO nap_records (
        day_id,
        sleep_time,
        wake_time,
        duration_minutes
      )
      VALUES (?, ?, ?, ?)
    `,
    nap.day_id,
    nap.sleep_time,
    nap.wake_time,
    nap.duration_minutes ?? null,
  );

  return result.lastInsertRowId;
}

export async function getNapRecordsByDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
) {
  const naps = await db.getAllAsync<NapRecord>(
    `
      SELECT *
      FROM nap_records
      WHERE day_id = ?
      ORDER BY sleep_time ASC
    `,
    dayId,
  );

  return naps;
}

export async function getNapRecordById(db: SQLite.SQLiteDatabase, id: number) {
  const nap = await db.getFirstAsync<NapRecord>(
    `
      SELECT *
      FROM nap_records
      WHERE id = ?
    `,
    id,
  );

  return nap;
}

export async function updateNapRecord(
  db: SQLite.SQLiteDatabase,
  id: number,
  nap: Partial<Omit<NapRecord, "id">>,
) {
  // CRUD será implementado posteriormente
}

export async function deleteNapRecord(db: SQLite.SQLiteDatabase, id: number) {
  await db.runAsync(
    `
      DELETE FROM nap_records
      WHERE id = ?
    `,
    id,
  );
}

export async function deleteNapRecordsByDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
) {
  await db.runAsync(
    `
      DELETE FROM nap_records
      WHERE day_id = ?
    `,
    dayId,
  );
}
