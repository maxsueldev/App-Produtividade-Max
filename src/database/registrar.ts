import type { SQLiteDatabase } from "expo-sqlite";

import type IHabitWithRecord from "@/interfaces/IHabitWithRecord";

export interface RegistrarData {
  sleep: {
    sleepTime: string;
    wakeTime: string;
    durationMinutes: number | null;
  } | null;

  studies: {
    id: number;
    subject: string;
    duration: number;
    questionsTotal: number;
    questionsCorrect: number;
    questionsWrong: number;
  }[];

  smoking: {
    morning: number;
    afternoon: number;
    night: number;
  } | null;

  habits: IHabitWithRecord[];

  metrics: {
    energy: number | null;
    mood: number | null;
    waterMl: number;
  } | null;
}

export async function getRegistrarData(
  db: SQLiteDatabase,
  date: string,
): Promise<RegistrarData> {
  const sleep = await db.getFirstAsync<{
    sleep_time: string;
    wake_time: string;
    durationMinutes: number | null;
  }>(
    `
      SELECT
        sleep_time,
        wake_time,
        duration_minutes
      FROM sleep_records
      INNER JOIN days
        ON days.id = sleep_records.day_id
      WHERE days.date = ?
      LIMIT 1
    `,
    date,
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
        study_sessions.id,
        subject,
        duration_minutes,
        questions_total,
        questions_correct,
        questions_wrong
      FROM study_sessions
      INNER JOIN days
        ON days.id = study_sessions.day_id
      WHERE days.date = ?
      ORDER BY study_sessions.id ASC
    `,
    date,
  );

  const smoking = await db.getFirstAsync<{
    morning: number;
    afternoon: number;
    night: number;
  }>(
    `
      SELECT
        morning,
        afternoon,
        night
      FROM smoking_records
      INNER JOIN days
        ON days.id = smoking_records.day_id
      WHERE days.date = ?
      LIMIT 1
    `,
    date,
  );

  const habits = await db.getAllAsync<{
    id: number;
    name: string;
    description: string | null;
    active: number;
    created_at: string;
    completed: number;
  }>(
    `
      SELECT
        habits.id,
        habits.name,
        habits.description,
        habits.active,
        habits.created_at,
        COALESCE(
          habit_records.completed,
          0
        ) AS completed
      FROM habits
      LEFT JOIN habit_records
        ON habit_records.habit_id = habits.id
        AND habit_records.day_id = (
          SELECT id
          FROM days
          WHERE date = ?
        )
      WHERE habits.active = 1
      ORDER BY habits.id ASC
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

  return {
    sleep: sleep
      ? {
          sleepTime: sleep.sleep_time,
          wakeTime: sleep.wake_time,
          durationMinutes: sleep.durationMinutes,
        }
      : null,

    studies: studies.map((study) => ({
      id: study.id,
      subject: study.subject,
      duration: study.duration_minutes ?? 0,
      questionsTotal: study.questions_total ?? 0,
      questionsCorrect: study.questions_correct ?? 0,
      questionsWrong: study.questions_wrong ?? 0,
    })),

    smoking: smoking
      ? {
          morning: smoking.morning,
          afternoon: smoking.afternoon,
          night: smoking.night,
        }
      : null,

    habits: habits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      ...(habit.description !== null && {
        description: habit.description,
      }),
      active: habit.active,
      created_at: habit.created_at,
      completed: habit.completed === 1,
    })),

    metrics: metrics
      ? {
          energy: metrics.energy,
          mood: metrics.mood,
          waterMl: metrics.water_ml,
        }
      : null,
  };
}
