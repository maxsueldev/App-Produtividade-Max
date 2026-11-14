import * as SQLite from "expo-sqlite";

export interface DailyMetrics {
  id: number;

  day_id: number;

  energy?: number;
  mood?: number;

  water_ml: number;
}

export async function createDailyMetrics(
  db: SQLite.SQLiteDatabase,
  metrics: Omit<DailyMetrics, "id">,
) {
  const result = await db.runAsync(
    `
      INSERT INTO daily_metrics (
        day_id,
        energy,
        mood,
        water_ml
      )
      VALUES (?, ?, ?, ?)
    `,
    metrics.day_id,
    metrics.energy ?? null,
    metrics.mood ?? null,
    metrics.water_ml,
  );

  return result.lastInsertRowId;
}

export async function getDailyMetricsById(
  db: SQLite.SQLiteDatabase,
  id: number,
) {
  // CRUD será implementado aqui
}

export async function getDailyMetricsByDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
) {
  // CRUD será implementado aqui
}

export async function updateDailyMetrics(
  db: SQLite.SQLiteDatabase,
  id: number,
  metrics: Partial<Omit<DailyMetrics, "id">>,
) {
  // CRUD será implementado aqui
}

export async function deleteDailyMetrics(
  db: SQLite.SQLiteDatabase,
  id: number,
) {
  // CRUD será implementado aqui
}

export async function deleteDailyMetricsByDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
) {
  await db.runAsync(
    `
      DELETE FROM daily_metrics
      WHERE day_id = ?
    `,
    dayId,
  );
}
