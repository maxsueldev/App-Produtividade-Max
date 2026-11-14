import { initializeDatabase } from "@/database/database";

import {
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit,
} from "@/database/habits";

import { getHabitRecordByDayAndHabit } from "@/database/habitRecords";

import { getDayByDate } from "@/database/days";

import { obterDataAtual } from "@/functions/data";

import type IHabitWithRecord from "@/interfaces/IHabitWithRecord";

export async function carregarHabitos(): Promise<IHabitWithRecord[]> {
  const db = await initializeDatabase();

  const lista = await getHabits(db);

  const dataAtual = obterDataAtual();

  const day = await getDayByDate(db, dataAtual);

  if (!day) {
    return lista.map((habit) => ({
      ...habit,
      completed: false,
    }));
  }

  const listaComStatus = await Promise.all(
    lista.map(async (habit) => {
      const registro = await getHabitRecordByDayAndHabit(db, day.id, habit.id);

      return {
        ...habit,
        completed: registro?.completed === 1,
      };
    }),
  );

  return listaComStatus;
}

export async function adicionarHabito(nome: string): Promise<void> {
  const nomeNormalizado = nome.trim();

  if (!nomeNormalizado) {
    throw new Error("O nome do hábito não pode ficar vazio.");
  }

  const db = await initializeDatabase();

  await createHabit(db, nomeNormalizado);
}

export async function alterarHabito(id: number, nome: string): Promise<void> {
  const nomeNormalizado = nome.trim();

  if (!nomeNormalizado) {
    throw new Error("O nome do hábito não pode ficar vazio.");
  }

  const db = await initializeDatabase();

  await updateHabit(db, id, nomeNormalizado);
}

export async function removerHabito(id: number): Promise<void> {
  const db = await initializeDatabase();

  await deleteHabit(db, id);
}
