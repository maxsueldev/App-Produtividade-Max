import * as SQLite from "expo-sqlite";

export interface StudySession {
  id: number;
  day_id: number;

  subject: string;

  start_time?: string;
  end_time?: string;

  duration_minutes?: number;

  questions_total: number;
  questions_correct: number;
  questions_wrong: number;

  notes?: string;
}

export interface StudySubjectSummary {
  day_id: number;
  subject: string;
}

export async function createStudySession(
  db: SQLite.SQLiteDatabase,
  study: Omit<StudySession, "id">,
) {
  const result = await db.runAsync(
    `
      INSERT INTO study_sessions (
        day_id,
        subject,
        start_time,
        end_time,
        duration_minutes,
        questions_total,
        questions_correct,
        questions_wrong,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    study.day_id,
    study.subject,
    study.start_time ?? null,
    study.end_time ?? null,
    study.duration_minutes ?? null,
    study.questions_total,
    study.questions_correct,
    study.questions_wrong,
    study.notes ?? null,
  );

  return result.lastInsertRowId;
}

export async function getStudySessionById(
  db: SQLite.SQLiteDatabase,
  id: number,
) {
  // CRUD será implementado aqui
}

export async function getStudySessionsByDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
) {
  // CRUD será implementado aqui
}

export async function updateStudySession(
  db: SQLite.SQLiteDatabase,
  id: number,
  study: Partial<Omit<StudySession, "id">>,
) {
  // CRUD será implementado aqui
}

export async function deleteStudySession(
  db: SQLite.SQLiteDatabase,
  id: number,
) {
  // CRUD será implementado aqui
}

export async function deleteStudySessionsByDay(
  db: SQLite.SQLiteDatabase,
  dayId: number,
) {
  await db.runAsync(
    `
      DELETE FROM study_sessions
      WHERE day_id = ?
    `,
    dayId,
  );
}

/**
 * Retorna as disciplinas estudadas em cada dia.
 * Disciplinas repetidas no mesmo dia aparecem apenas uma vez.
 */
export async function getStudySubjectSummaryByDays(
  db: SQLite.SQLiteDatabase,
  dayIds: number[],
): Promise<StudySubjectSummary[]> {
  if (dayIds.length === 0) {
    return [];
  }

  const placeholders = dayIds.map(() => "?").join(", ");

  return await db.getAllAsync<StudySubjectSummary>(
    `
      SELECT DISTINCT
        day_id,
        subject
      FROM study_sessions
      WHERE day_id IN (${placeholders})
      ORDER BY day_id DESC, subject COLLATE NOCASE ASC
    `,
    ...dayIds,
  );
}
