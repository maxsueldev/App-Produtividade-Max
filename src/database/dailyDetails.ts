import type { SQLiteDatabase } from "expo-sqlite";

export interface DailyDetails {
  id: number;
  date: string;

  sleep: {
    sleep_time: string;
    wake_time: string;
    duration_minutes: number | null;
  } | null;

  naps: {
    id: number;
    sleep_time: string;
    wake_time: string;
    duration_minutes: number | null;
  }[];

  studies: {
    id: number;
    subject: string;
    duration_minutes: number | null;
    questions_total: number;
    questions_correct: number;
    questions_wrong: number;
  }[];

  smoking: {
    morning: number;
    afternoon: number;
    night: number;
    total: number;
  } | null;

  metrics: {
    energy: number | null;
    mood: number | null;
    water_ml: number;
  } | null;

  habits: {
    id: number;
    name: string;
    completed: number;
  }[];

  pages_read: number | null;
}

export async function getDailyDetails(
  db: SQLiteDatabase,
  dayId: number,
): Promise<DailyDetails | null> {
  const day = await db.getFirstAsync<{
    date: string;
  }>(
    `
      SELECT date
      FROM days
      WHERE id = ?
    `,
    dayId,
  );

  if (!day) {
    return null;
  }

  const sleep = await db.getFirstAsync<{
    sleep_time: string;
    wake_time: string;
    duration_minutes: number | null;
  }>(
    `
      SELECT
        sleep_time,
        wake_time,
        duration_minutes
      FROM sleep_records
      WHERE day_id = ?
      LIMIT 1
    `,
    dayId,
  );

  const naps = await db.getAllAsync<{
    id: number;
    sleep_time: string;
    wake_time: string;
    duration_minutes: number | null;
  }>(
    `
    SELECT
      id,
      sleep_time,
      wake_time,
      duration_minutes
    FROM nap_records
    WHERE day_id = ?
    ORDER BY sleep_time ASC
  `,
    dayId,
  );

  const studies = await db.getAllAsync<{
    id: number;
    subject: string;
    duration_minutes: number | null;
    questions_total: number;
    questions_correct: number;
    questions_wrong: number;
  }>(
    `
      SELECT
        id,
        subject,
        duration_minutes,
        questions_total,
        questions_correct,
        questions_wrong
      FROM study_sessions
      WHERE day_id = ?
      ORDER BY id ASC
    `,
    dayId,
  );

  const smoking = await db.getFirstAsync<{
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
    dayId,
  );

  const metrics = await db.getFirstAsync<{
    energy: number | null;
    mood: number | null;
    water_ml: number;
  }>(
    `
      SELECT
        energy,
        mood,
        water_ml
      FROM daily_metrics
      WHERE day_id = ?
      LIMIT 1
    `,
    dayId,
  );

  const habits = await db.getAllAsync<{
    id: number;
    name: string;
    completed: number;
  }>(
    `
      SELECT
        habits.id,
        habits.name,
        habit_records.completed
      FROM habit_records
      INNER JOIN habits
        ON habits.id = habit_records.habit_id
      WHERE habit_records.day_id = ?
      ORDER BY habits.id ASC
    `,
    dayId,
  );

  const reading = await db.getFirstAsync<{
    pages_read: number;
  }>(
    `
      SELECT
        pages_read
      FROM reading_records
      WHERE day_id = ?
      LIMIT 1
    `,
    dayId,
  );

  return {
    id: dayId,
    date: day.date,
    sleep: sleep ?? null,
    naps,
    studies,
    smoking: smoking ?? null,
    metrics: metrics ?? null,
    habits,
    pages_read: reading?.pages_read ?? null,
  };
}
