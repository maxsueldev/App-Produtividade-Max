import * as SQLite from "expo-sqlite";

export interface SleepRecord {
  id: number;
  day_id: number;

  sleep_time: string;
  wake_time: string;

  duration_minutes?: number;

  quality?: number;
}

export async function createSleepRecord(
  db: SQLite.SQLiteDatabase,
  sleep: Omit<SleepRecord, "id">,
) {
  const result = await db.runAsync(
    `
      INSERT INTO sleep_records (
        day_id,
        sleep_time,
        wake_time,
        duration_minutes,
        quality
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    sleep.day_id,
    sleep.sleep_time,
    sleep.wake_time,
    sleep.duration_minutes ?? null,
    sleep.quality ?? null,
  );

  return result.lastInsertRowId;
}

export async function getSleepRecordByDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
) {
  const sleep = await db.getFirstAsync<SleepRecord>(
    `
      SELECT *
      FROM sleep_records
      WHERE day_id = ?
    `,
    dayId,
  );

  return sleep;
}

export async function getSleepRecordById(
  db: SQLite.SQLiteDatabase,
  id: number,
) {
  const sleep = await db.getFirstAsync<SleepRecord>(
    `
      SELECT *
      FROM sleep_records
      WHERE id = ?
    `,
    id,
  );

  return sleep;
}

export async function updateSleepRecord(
  db: SQLite.SQLiteDatabase,
  id: number,
  sleep: Partial<Omit<SleepRecord, "id">>,
) {
  // CRUD será implementado posteriormente
}

export async function deleteSleepRecord(db: SQLite.SQLiteDatabase, id: number) {
  // CRUD será implementado posteriormente
}

export async function deleteSleepRecordsByDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
) {
  await db.runAsync(
    `
      DELETE FROM sleep_records
      WHERE day_id = ?
    `,
    dayId,
  );
}
