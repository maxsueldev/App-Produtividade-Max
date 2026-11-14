import * as SQLite from "expo-sqlite";

let database: SQLite.SQLiteDatabase | null = null;
let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return Promise.resolve(database);
  }

  if (databasePromise) {
    return databasePromise;
  }

  databasePromise = (async () => {
    try {
      const db = await SQLite.openDatabaseAsync("produtividadeMax.db");

      await db.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS days (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL UNIQUE,
          notes TEXT,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sleep_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_id INTEGER NOT NULL,
          sleep_time TEXT NOT NULL,
          wake_time TEXT NOT NULL,
          duration_minutes INTEGER,
          quality INTEGER,
          FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS nap_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_id INTEGER NOT NULL,
          sleep_time TEXT NOT NULL,
          wake_time TEXT NOT NULL,
          duration_minutes INTEGER,
          FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS study_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_id INTEGER NOT NULL,
          subject TEXT NOT NULL,
          start_time TEXT,
          end_time TEXT,
          duration_minutes INTEGER,
          questions_total INTEGER DEFAULT 0,
          questions_correct INTEGER DEFAULT 0,
          questions_wrong INTEGER DEFAULT 0,
          notes TEXT,
          FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS smoking_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_id INTEGER NOT NULL,
          morning INTEGER NOT NULL DEFAULT 0,
          afternoon INTEGER NOT NULL DEFAULT 0,
          night INTEGER NOT NULL DEFAULT 0,
          total INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS habits (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS habit_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_id INTEGER NOT NULL,
          habit_id INTEGER NOT NULL,
          completed INTEGER NOT NULL DEFAULT 0,
          notes TEXT,
          FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE,
          FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
          UNIQUE(day_id, habit_id)
        );

        CREATE TABLE IF NOT EXISTS daily_metrics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_id INTEGER NOT NULL UNIQUE,
          energy INTEGER,
          mood INTEGER,
          water_ml INTEGER DEFAULT 0,
          FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS reading_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          day_id INTEGER NOT NULL UNIQUE,
          pages_read INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS insight_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          message TEXT NOT NULL,
          week_start TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(week_start)
        );

        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT NOT NULL UNIQUE,
          value TEXT NOT NULL
        );
      `);

      database = db;

      return db;
    } catch (error) {
      database = null;
      databasePromise = null;

      console.error("❌ ERRO AO INICIALIZAR SQLITE:", error);

      throw error;
    }
  })();

  return databasePromise;
}
