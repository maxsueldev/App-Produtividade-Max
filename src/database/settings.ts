import * as SQLite from "expo-sqlite";

export async function getSetting(
  db: SQLite.SQLiteDatabase,
  key: string,
): Promise<string | null> {
  const resultado = await db.getFirstAsync<{ value: string }>(
    `
      SELECT value
      FROM settings
      WHERE key = ?
    `,
    key,
  );

  return resultado?.value ?? null;
}

export async function saveSetting(
  db: SQLite.SQLiteDatabase,
  key: string,
  value: string,
): Promise<void> {
  await db.runAsync(
    `
      INSERT INTO settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key)
      DO UPDATE SET value = excluded.value
    `,
    key,
    value,
  );
}
