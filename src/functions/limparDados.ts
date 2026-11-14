import { initializeDatabase } from "@/database/database";

export async function limparTodosDados(): Promise<void> {
  const db = await initializeDatabase();

  await db.withTransactionAsync(async () => {
    // Primeiro removemos os registros que dependem de outras tabelas
    await db.runAsync("DELETE FROM habit_records");
    await db.runAsync("DELETE FROM sleep_records");
    await db.runAsync("DELETE FROM study_sessions");
    await db.runAsync("DELETE FROM smoking_records");
    await db.runAsync("DELETE FROM daily_metrics");

    // Depois removemos os hábitos e os dias
    await db.runAsync("DELETE FROM habits");
    await db.runAsync("DELETE FROM days");

    // Por último, removemos as configurações
    await db.runAsync("DELETE FROM settings");
  });
}
