import type { SQLiteDatabase } from "expo-sqlite";

export interface HabitRecord {
  id: number;
  day_id: number;
  habit_id: number;
  completed: number;
  notes?: string;
}

export async function createHabitRecord(
  db: SQLiteDatabase,
  habitRecord: Omit<HabitRecord, "id">,
): Promise<number> {
  const result = await db.runAsync(
    `
      INSERT INTO habit_records (
        day_id,
        habit_id,
        completed,
        notes
      )
      VALUES (?, ?, ?, ?)
    `,
    habitRecord.day_id,
    habitRecord.habit_id,
    habitRecord.completed,
    habitRecord.notes ?? null,
  );

  return result.lastInsertRowId;
}

export async function getHabitRecordById(
  db: SQLiteDatabase,
  id: number,
): Promise<HabitRecord | null> {
  const record = await db.getFirstAsync<HabitRecord>(
    `
      SELECT *
      FROM habit_records
      WHERE id = ?
    `,
    id,
  );

  return record ?? null;
}

export async function getHabitRecordsByDay(
  db: SQLiteDatabase,
  dayId: number,
): Promise<HabitRecord[]> {
  return await db.getAllAsync<HabitRecord>(
    `
      SELECT *
      FROM habit_records
      WHERE day_id = ?
      ORDER BY id ASC
    `,
    dayId,
  );
}

export async function getHabitRecordsByHabit(
  db: SQLiteDatabase,
  habitId: number,
): Promise<HabitRecord[]> {
  return await db.getAllAsync<HabitRecord>(
    `
      SELECT *
      FROM habit_records
      WHERE habit_id = ?
      ORDER BY day_id ASC
    `,
    habitId,
  );
}

export async function updateHabitRecord(
  db: SQLiteDatabase,
  id: number,
  completed: boolean,
  notes?: string,
): Promise<void> {
  await db.runAsync(
    `
      UPDATE habit_records
      SET completed = ?, notes = ?
      WHERE id = ?
    `,
    completed ? 1 : 0,
    notes ?? null,
    id,
  );
}

export async function deleteHabitRecord(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM habit_records
      WHERE id = ?
    `,
    id,
  );
}

export async function deleteHabitRecordsByDay(
  db: SQLiteDatabase,
  dayId: number,
): Promise<void> {
  await db.runAsync(
    `
      DELETE FROM habit_records
      WHERE day_id = ?
    `,
    dayId,
  );
}

export async function getHabitRecordByDayAndHabit(
  db: SQLiteDatabase,
  dayId: number,
  habitId: number,
): Promise<HabitRecord | null> {
  const record = await db.getFirstAsync<HabitRecord>(
    `
      SELECT *
      FROM habit_records
      WHERE day_id = ?
        AND habit_id = ?
    `,
    dayId,
    habitId,
  );

  return record ?? null;
}
