import type { SQLiteDatabase } from "expo-sqlite";

export interface HomeData {
  id: number;
  date: string;

  sleep: {
    sleep_time: string;
    wake_time: string;
    duration_minutes: number | null;
    naps_minutes: number;
    naps_count: number;
  } | null;

  reading: {
    pages_read: number;
  } | null;

  studies: {
    count: number;
    total_minutes: number;
    questions_total: number;
    questions_correct: number;
    questions_wrong: number;
    subjects: {
      subject: string;
      duration_minutes: number;
      questions_total: number;
      questions_correct: number;
      questions_wrong: number;
    }[];
  };

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
    total: number;
    completed: number;
    items: {
      id: number;
      name: string;
      completed: boolean;
    }[];
  };
}

export async function getHomeData(
  db: SQLiteDatabase,
  date: string,
): Promise<HomeData> {
  const day = await db.getFirstAsync<{
    id: number;
    date: string;
  }>(
    `
    SELECT
      id,
      date
    FROM days
    WHERE date = ?
    LIMIT 1
  `,
    date,
  );

  const sleep = await db.getFirstAsync<{
    sleep_time: string;
    wake_time: string;
    duration_minutes: number | null;
    naps_minutes: number;
    naps_count: number;
  }>(
    `
    SELECT
      sleep_records.sleep_time,
      sleep_records.wake_time,
      sleep_records.duration_minutes,
      COALESCE(
        (
          SELECT SUM(nap_records.duration_minutes)
          FROM nap_records
          WHERE nap_records.day_id = sleep_records.day_id
        ),
        0
      ) AS naps_minutes,
      COALESCE(
        (
          SELECT COUNT(*)
          FROM nap_records
          WHERE nap_records.day_id = sleep_records.day_id
        ),
        0
      ) AS naps_count
    FROM sleep_records
    INNER JOIN days
      ON days.id = sleep_records.day_id
    WHERE days.date = ?
    LIMIT 1
  `,
    date,
  );

  const reading = await db.getFirstAsync<{
    pages_read: number;
  }>(
    `
    SELECT
      reading_records.pages_read
    FROM reading_records
    INNER JOIN days
      ON days.id = reading_records.day_id
    WHERE days.date = ?
    LIMIT 1
  `,
    date,
  );

  const studies = await db.getFirstAsync<{
    count: number;
    total_minutes: number;
    questions_total: number;
    questions_correct: number;
    questions_wrong: number;
  }>(
    `
      SELECT
        COUNT(*) AS count,
        COALESCE(SUM(duration_minutes), 0) AS total_minutes,
        COALESCE(SUM(questions_total), 0) AS questions_total,
        COALESCE(SUM(questions_correct), 0) AS questions_correct,
        COALESCE(SUM(questions_wrong), 0) AS questions_wrong
      FROM study_sessions
      INNER JOIN days
        ON days.id = study_sessions.day_id
      WHERE days.date = ?
    `,
    date,
  );

  const subjects = await db.getAllAsync<{
    subject: string;
    duration_minutes: number;
    questions_total: number;
    questions_correct: number;
    questions_wrong: number;
  }>(
    `
      SELECT
        subject,
        COALESCE(SUM(duration_minutes), 0) AS duration_minutes,
        COALESCE(SUM(questions_total), 0) AS questions_total,
        COALESCE(SUM(questions_correct), 0) AS questions_correct,
        COALESCE(SUM(questions_wrong), 0) AS questions_wrong
      FROM study_sessions
      INNER JOIN days
        ON days.id = study_sessions.day_id
      WHERE days.date = ?
      GROUP BY subject
      ORDER BY subject ASC
    `,
    date,
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
      INNER JOIN days
        ON days.id = smoking_records.day_id
      WHERE days.date = ?
      LIMIT 1
    `,
    date,
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
      INNER JOIN days
        ON days.id = daily_metrics.day_id
      WHERE days.date = ?
      LIMIT 1
    `,
    date,
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
      COALESCE(habit_records.completed, 0) AS completed
    FROM habits
    LEFT JOIN habit_records
      ON habit_records.habit_id = habits.id
      AND habit_records.day_id = (
        SELECT id
        FROM days
        WHERE date = ?
      )
    WHERE habits.active = 1
    ORDER BY habits.name ASC
  `,
    date,
  );

  return {
    id: day?.id ?? 0,
    date,

    sleep: sleep ?? null,

    reading: reading ?? null,

    studies: {
      count: studies?.count ?? 0,
      total_minutes: studies?.total_minutes ?? 0,
      questions_total: studies?.questions_total ?? 0,
      questions_correct: studies?.questions_correct ?? 0,
      questions_wrong: studies?.questions_wrong ?? 0,
      subjects,
    },

    smoking: smoking ?? null,

    metrics: metrics ?? null,

    habits: {
      total: habits.length,
      completed: habits.filter((habit) => habit.completed === 1).length,
      items: habits.map((habit) => ({
        id: habit.id,
        name: habit.name,
        completed: habit.completed === 1,
      })),
    },
  };
}
