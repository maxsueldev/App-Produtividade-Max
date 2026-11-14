import type IHabit from "@/interfaces/IHabit";
import type { SQLiteDatabase } from "expo-sqlite";

export async function createHabit(
  db: SQLiteDatabase,
  name: string,
  description?: string,
): Promise<number> {
  // Verifica se já existe um hábito com esse nome
  const habitExistente = await db.getFirstAsync<{
    id: number;
    active: number;
  }>(
    `
      SELECT id, active
      FROM habits
      WHERE name = ?
    `,
    name,
  );

  // Se existe, mas está inativo, reativa o hábito
  if (habitExistente && habitExistente.active === 0) {
    await db.runAsync(
      `
        UPDATE habits
        SET active = 1,
            description = ?
        WHERE id = ?
      `,
      description ?? null,
      habitExistente.id,
    );

    return habitExistente.id;
  }

  // Se já existe e está ativo, não permite duplicação
  if (habitExistente && habitExistente.active === 1) {
    throw new Error("Já existe um hábito com esse nome.");
  }

  // Caso não exista, cria normalmente
  const result = await db.runAsync(
    `
      INSERT INTO habits (name, description)
      VALUES (?, ?)
    `,
    name,
    description ?? null,
  );

  return result.lastInsertRowId;
}

export async function getHabitById(
  db: SQLiteDatabase,
  id: number,
): Promise<IHabit | null> {
  const habit = await db.getFirstAsync<IHabit>(
    `
      SELECT *
      FROM habits
      WHERE id = ?
    `,
    id,
  );

  return habit ?? null;
}

export async function getHabits(db: SQLiteDatabase): Promise<IHabit[]> {
  return await db.getAllAsync<IHabit>(
    `
      SELECT *
      FROM habits
      WHERE active = 1
      ORDER BY id ASC
    `,
  );
}

export async function updateHabit(
  db: SQLiteDatabase,
  id: number,
  name: string,
  description?: string,
): Promise<void> {
  // Verifica se outro hábito ativo já possui esse nome
  const habitExistente = await db.getFirstAsync<{ id: number }>(
    `
      SELECT id
      FROM habits
      WHERE name = ?
        AND active = 1
        AND id != ?
    `,
    name,
    id,
  );

  if (habitExistente) {
    throw new Error("Já existe um hábito com esse nome.");
  }

  await db.runAsync(
    `
      UPDATE habits
      SET name = ?,
          description = ?
      WHERE id = ?
    `,
    name,
    description ?? null,
    id,
  );
}

export async function deleteHabit(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  // Mantém o hábito no banco para preservar o histórico,
  // apenas o torna inativo.
  await db.runAsync(
    `
      UPDATE habits
      SET active = 0
      WHERE id = ?
    `,
    id,
  );
}
