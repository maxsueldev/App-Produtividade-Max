import type { SQLiteDatabase } from "expo-sqlite";

export interface StudyChartData {
  date: string;
  total_minutes: number;
  questions_total: number;
  questions_correct: number;
  questions_wrong: number;
}

export interface ReadingChartData {
  date: string;
  pages_read: number;
}

export interface SmokingChartData {
  date: string;
  total: number;
}

export interface WaterChartData {
  date: string;
  water_ml: number;
}

export interface SleepChartData {
  date: string;
  duration_minutes: number;
}

export interface MoodEnergyChartData {
  date: string;
  energy: number;
  mood: number;
}

export interface HabitChartData {
  date: string;
  completed: number;
  total: number;
}

export interface PeriodoAnteriorData {
  estudo: number;
  cigarros: number;
  agua: number;
  sono: number;
  humor: number;
  energia: number;
  habitos: number;
  leitura: number;
}

export async function getStudyChartData(
  db: SQLiteDatabase,
  days: number = 7,
): Promise<StudyChartData[]> {
  return await db.getAllAsync<StudyChartData>(
    `
      WITH RECURSIVE datas(date) AS (
        SELECT date('now', ?)

        UNION ALL

        SELECT date(date, '+1 day')
        FROM datas
        WHERE date < date('now')
      )

      SELECT
        datas.date,

        COALESCE(
          SUM(study_sessions.duration_minutes),
          0
        ) AS total_minutes,

        COALESCE(
          SUM(study_sessions.questions_total),
          0
        ) AS questions_total,

        COALESCE(
          SUM(study_sessions.questions_correct),
          0
        ) AS questions_correct,

        COALESCE(
          SUM(study_sessions.questions_wrong),
          0
        ) AS questions_wrong

      FROM datas

      LEFT JOIN days
        ON days.date = datas.date

      LEFT JOIN study_sessions
        ON study_sessions.day_id = days.id

      GROUP BY datas.date

      ORDER BY datas.date ASC
    `,
    `-${days - 1} days`,
  );
}

export async function getReadingChartData(
  db: SQLiteDatabase,
  days: number = 7,
): Promise<ReadingChartData[]> {
  return await db.getAllAsync<ReadingChartData>(
    `
      WITH RECURSIVE datas(date) AS (
        SELECT date('now', ?)

        UNION ALL

        SELECT date(date, '+1 day')
        FROM datas
        WHERE date < date('now')
      )

      SELECT
        datas.date,

        COALESCE(
          SUM(reading_records.pages_read),
          0
        ) AS pages_read

      FROM datas

      LEFT JOIN days
        ON days.date = datas.date

      LEFT JOIN reading_records
        ON reading_records.day_id = days.id

      GROUP BY datas.date

      ORDER BY datas.date ASC
    `,
    `-${days - 1} days`,
  );
}

export async function getSmokingChartData(
  db: SQLiteDatabase,
  days: number = 7,
): Promise<SmokingChartData[]> {
  return await db.getAllAsync<SmokingChartData>(
    `
      WITH RECURSIVE datas(date) AS (
        SELECT date('now', ?)

        UNION ALL

        SELECT date(date, '+1 day')
        FROM datas
        WHERE date < date('now')
      )

      SELECT
        datas.date,

        COALESCE(
          SUM(smoking_records.total),
          0
        ) AS total

      FROM datas

      LEFT JOIN days
        ON days.date = datas.date

      LEFT JOIN smoking_records
        ON smoking_records.day_id = days.id

      GROUP BY datas.date

      ORDER BY datas.date ASC
    `,
    `-${days - 1} days`,
  );
}

export async function getWaterChartData(
  db: SQLiteDatabase,
  days: number = 7,
): Promise<WaterChartData[]> {
  return await db.getAllAsync<WaterChartData>(
    `
      WITH RECURSIVE datas(date) AS (
        SELECT date('now', ?)

        UNION ALL

        SELECT date(date, '+1 day')
        FROM datas
        WHERE date < date('now')
      )

      SELECT
        datas.date,

        COALESCE(
          SUM(daily_metrics.water_ml),
          0
        ) AS water_ml

      FROM datas

      LEFT JOIN days
        ON days.date = datas.date

      LEFT JOIN daily_metrics
        ON daily_metrics.day_id = days.id

      GROUP BY datas.date

      ORDER BY datas.date ASC
    `,
    `-${days - 1} days`,
  );
}

export async function getSleepChartData(
  db: SQLiteDatabase,
  days: number = 7,
): Promise<SleepChartData[]> {
  return await db.getAllAsync<SleepChartData>(
    `
      WITH RECURSIVE datas(date) AS (
        SELECT date('now', ?)

        UNION ALL

        SELECT date(date, '+1 day')
        FROM datas
        WHERE date < date('now')
      )

      SELECT
        datas.date,

        COALESCE(
          SUM(sleep_records.duration_minutes),
          0
        ) AS duration_minutes

      FROM datas

      LEFT JOIN days
        ON days.date = datas.date

      LEFT JOIN sleep_records
        ON sleep_records.day_id = days.id

      GROUP BY datas.date

      ORDER BY datas.date ASC
    `,
    `-${days - 1} days`,
  );
}

export async function getMoodEnergyChartData(
  db: SQLiteDatabase,
  days: number = 7,
): Promise<MoodEnergyChartData[]> {
  return await db.getAllAsync<MoodEnergyChartData>(
    `
      WITH RECURSIVE datas(date) AS (
        SELECT date('now', ?)

        UNION ALL

        SELECT date(date, '+1 day')
        FROM datas
        WHERE date < date('now')
      )

      SELECT
        datas.date,

        COALESCE(
          AVG(daily_metrics.energy),
          0
        ) AS energy,

        COALESCE(
          AVG(daily_metrics.mood),
          0
        ) AS mood

      FROM datas

      LEFT JOIN days
        ON days.date = datas.date

      LEFT JOIN daily_metrics
        ON daily_metrics.day_id = days.id

      GROUP BY datas.date

      ORDER BY datas.date ASC
    `,
    `-${days - 1} days`,
  );
}

export async function getHabitChartData(
  db: SQLiteDatabase,
  days: number = 7,
): Promise<HabitChartData[]> {
  return await db.getAllAsync<HabitChartData>(
    `
      WITH RECURSIVE datas(date) AS (
        SELECT date('now', ?)

        UNION ALL

        SELECT date(date, '+1 day')
        FROM datas
        WHERE date < date('now')
      )

      SELECT
        datas.date,

        COALESCE(
          SUM(
            CASE
              WHEN habit_records.completed = 1 THEN 1
              ELSE 0
            END
          ),
          0
        ) AS completed,

        COUNT(
          DISTINCT habits.id
        ) AS total

      FROM datas

      LEFT JOIN days
        ON days.date = datas.date

      LEFT JOIN habits
        ON habits.active = 1

      LEFT JOIN habit_records
        ON habit_records.day_id = days.id
        AND habit_records.habit_id = habits.id

      GROUP BY datas.date

      ORDER BY datas.date ASC
    `,
    `-${days - 1} days`,
  );
}

export async function getComparacaoPeriodo(
  db: SQLiteDatabase,
  days: number = 7,
): Promise<PeriodoAnteriorData> {
  const resultado = await db.getFirstAsync<PeriodoAnteriorData>(
    `
      SELECT

        COALESCE(
          (
            SELECT SUM(study_sessions.duration_minutes)
            FROM study_sessions
            INNER JOIN days
              ON days.id = study_sessions.day_id
            WHERE days.date >= date('now', ?)
              AND days.date < date('now', ?)
          ),
          0
        ) AS estudo,

        COALESCE(
          (
            SELECT SUM(smoking_records.total)
            FROM smoking_records
            INNER JOIN days
              ON days.id = smoking_records.day_id
            WHERE days.date >= date('now', ?)
              AND days.date < date('now', ?)
          ),
          0
        ) AS cigarros,

        COALESCE(
          (
            SELECT SUM(daily_metrics.water_ml)
            FROM daily_metrics
            INNER JOIN days
              ON days.id = daily_metrics.day_id
            WHERE days.date >= date('now', ?)
              AND days.date < date('now', ?)
          ),
          0
        ) AS agua,

        COALESCE(
          (
            SELECT SUM(sleep_records.duration_minutes)
            FROM sleep_records
            INNER JOIN days
              ON days.id = sleep_records.day_id
            WHERE days.date >= date('now', ?)
              AND days.date < date('now', ?)
          ),
          0
        ) AS sono,

        COALESCE(
          (
            SELECT AVG(daily_metrics.mood)
            FROM daily_metrics
            INNER JOIN days
              ON days.id = daily_metrics.day_id
            WHERE days.date >= date('now', ?)
              AND days.date < date('now', ?)
          ),
          0
        ) AS humor,

        COALESCE(
          (
            SELECT AVG(daily_metrics.energy)
            FROM daily_metrics
            INNER JOIN days
              ON days.id = daily_metrics.day_id
            WHERE days.date >= date('now', ?)
              AND days.date < date('now', ?)
          ),
          0
        ) AS energia,

        COALESCE(
          (
            SELECT
              CAST(
                SUM(
                  CASE
                    WHEN habit_records.completed = 1 THEN 1
                    ELSE 0
                  END
                ) AS REAL
              )
              / NULLIF(COUNT(habit_records.id), 0)
              * 100
            FROM habit_records
            INNER JOIN days
              ON days.id = habit_records.day_id
            WHERE days.date >= date('now', ?)
              AND days.date < date('now', ?)
          ),
          0
        ) AS habitos,

        COALESCE(
          (
            SELECT
              CAST(SUM(reading_records.pages_read) AS REAL)
            FROM reading_records
            INNER JOIN days
              ON days.id = reading_records.day_id
            WHERE days.date >= date('now', ?)
              AND days.date < date('now', ?)
          ),
          0
        ) AS leitura
    `,
    `-${days * 2 - 1} days`,
    `-${days - 1} days`,

    `-${days * 2 - 1} days`,
    `-${days - 1} days`,

    `-${days * 2 - 1} days`,
    `-${days - 1} days`,

    `-${days * 2 - 1} days`,
    `-${days - 1} days`,

    `-${days * 2 - 1} days`,
    `-${days - 1} days`,

    `-${days * 2 - 1} days`,
    `-${days - 1} days`,

    `-${days * 2 - 1} days`,
    `-${days - 1} days`,

    `-${days * 2 - 1} days`,
    `-${days - 1} days`,
  );

  return (
    resultado ?? {
      estudo: 0,
      cigarros: 0,
      agua: 0,
      sono: 0,
      humor: 0,
      energia: 0,
      habitos: 0,
      leitura: 0,
    }
  );
}
