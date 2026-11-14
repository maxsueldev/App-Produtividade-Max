import * as SQLite from "expo-sqlite";

export interface Day {
  id: number;
  date: string;
  notes?: string;
  created_at: string;
}

export interface DaySummary {
  id: number;
  date: string;
  sleep_minutes: number | null;
  naps_minutes: number;
  naps_count: number;
  studies_count: number;
  study_minutes: number | null;
  cigarettes: number | null;
  water_ml: number | null;
  pages_read: number | null;
  habits_completed: number;
  habits_total: number;
}

export async function createDay(
  db: SQLite.SQLiteDatabase,
  day: Omit<Day, "id" | "created_at">,
) {
  const result = await db.runAsync(
    `
      INSERT INTO days (date, notes)
      VALUES (?, ?)
    `,
    day.date,
    day.notes ?? null,
  );

  return result.lastInsertRowId;
}

export async function getDayById(db: SQLite.SQLiteDatabase, id: number) {
  const day = await db.getFirstAsync<Day>(
    `
      SELECT *
      FROM days
      WHERE id = ?
    `,
    id,
  );

  return day;
}

export async function getDayByDate(
  db: SQLite.SQLiteDatabase,
  date: string,
): Promise<Day | null> {
  const day = await db.getFirstAsync<Day>(
    `
      SELECT *
      FROM days
      WHERE date = ?
    `,
    date,
  );

  return day ?? null;
}

export async function getDays(db: SQLite.SQLiteDatabase) {
  const days = await db.getAllAsync<Day>(
    `
      SELECT *
      FROM days
      ORDER BY date DESC
    `,
  );

  return days;
}

export async function updateDay(
  db: SQLite.SQLiteDatabase,
  id: number,
  day: Partial<Omit<Day, "id" | "created_at">>,
  date: string,
  notes?: string,
) {
  await db.runAsync(
    `
      UPDATE days
      SET date = ?, notes = ?
      WHERE id = ?
    `,
    date,
    notes ?? null,
    id,
  );
}

export async function getOrCreateDay(
  db: SQLite.SQLiteDatabase,
  date: string,
): Promise<number> {
  const existingDay = await getDayByDate(db, date);

  if (existingDay) {
    return existingDay.id;
  }

  return await createDay(db, {
    date,
  });
}

export async function getAllDays(db: SQLite.SQLiteDatabase): Promise<Day[]> {
  return await db.getAllAsync<Day>(
    `
      SELECT *
      FROM days
      ORDER BY date DESC
    `,
  );
}

export async function getDaysSummary(
  db: SQLite.SQLiteDatabase,
): Promise<DaySummary[]> {
  return await db.getAllAsync<DaySummary>(
    `
      SELECT
        days.id,
        days.date,

        (
          SELECT sleep_records.duration_minutes
          FROM sleep_records
          WHERE sleep_records.day_id = days.id
          LIMIT 1
        ) AS sleep_minutes,

        (
          SELECT COALESCE(SUM(nap_records.duration_minutes), 0)
          FROM nap_records
          WHERE nap_records.day_id = days.id
        ) AS naps_minutes,

        (
          SELECT COUNT(*)
          FROM nap_records
          WHERE nap_records.day_id = days.id
        ) AS naps_count,

        (
          SELECT COUNT(*)
          FROM study_sessions
          WHERE study_sessions.day_id = days.id
        ) AS studies_count,

        (
          SELECT SUM(study_sessions.duration_minutes)
          FROM study_sessions
          WHERE study_sessions.day_id = days.id
        ) AS study_minutes,

        (
          SELECT smoking_records.total
          FROM smoking_records
          WHERE smoking_records.day_id = days.id
          LIMIT 1
        ) AS cigarettes,

        (
          SELECT daily_metrics.water_ml
          FROM daily_metrics
          WHERE daily_metrics.day_id = days.id
          LIMIT 1
        ) AS water_ml,

        (
          SELECT reading_records.pages_read
          FROM reading_records
          WHERE reading_records.day_id = days.id
          LIMIT 1
        ) AS pages_read,

        (
          SELECT COUNT(*)
          FROM habit_records
          WHERE habit_records.day_id = days.id
          AND habit_records.completed = 1
        ) AS habits_completed,

        (
          SELECT COUNT(*)
          FROM habit_records
          WHERE habit_records.day_id = days.id
        ) AS habits_total

      FROM days

      ORDER BY days.date DESC
    `,
  );
}

export async function deleteDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM sleep_records WHERE day_id = ?", dayId);
    await db.runAsync("DELETE FROM nap_records WHERE day_id = ?", dayId);
    await db.runAsync("DELETE FROM study_sessions WHERE day_id = ?", dayId);
    await db.runAsync("DELETE FROM smoking_records WHERE day_id = ?", dayId);
    await db.runAsync("DELETE FROM daily_metrics WHERE day_id = ?", dayId);
    await db.runAsync("DELETE FROM reading_records WHERE day_id = ?", dayId);
    await db.runAsync("DELETE FROM habit_records WHERE day_id = ?", dayId);
    await db.runAsync("DELETE FROM days WHERE id = ?", dayId);
  });
}
