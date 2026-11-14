import type IHabit from "./IHabit";

export default interface IHabitWithRecord extends IHabit {
  completed: boolean;
}
