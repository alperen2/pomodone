import { create } from "zustand";
import { notify } from "../utils/common";
import { ITask, TaskStatuses } from "../types/Todo";
import { ITimer } from "../types/Timer";

export interface ITodoStore {
  tasks: ITask[];
  activeTask: ITask | undefined;
  timer: ITimer | undefined;
  getTask: (id: number) => ITask | undefined;
  addTask: (task: ITask) => void;
  updateTask: (task: ITask) => void;
  updateTaskStatus: (id: number, status: TaskStatuses) => void;
  setTaksPomodoroCount: (id: number, count: number) => void;
  removeTask: (id: number) => void;
  setActiveTask: (id: number) => void;
}

const useTasksStore = create<ITodoStore>()((set, get) => ({
  tasks: JSON.parse(window.localStorage.getItem("todo") ?? "[]"),
  activeTask: JSON.parse(window.localStorage.getItem("activeTask") || "null"),
  timer: undefined,
  getTask: (id: number) => get().tasks.find((task) => task.id === id),
  addTask: (task) => {
    set((state) => ({
      tasks: [task, ...state.tasks],
    }));

    notify("New task added", "success");
  },
  updateTaskStatus: (taskId, status) => {
    const updatedTasks = get().tasks.map((task) => {
      if (task.id === taskId) {
        task.status = status;
      }

      return task;
    });

    set(() => ({
      tasks: updatedTasks,
    }));
  },
  setTaksPomodoroCount: (taskId, count) => {
    const updatedTasks = get().tasks.map((task) => {
      if (task.id === taskId) {
        task.requiredCycles = count;
      }
      return task;
    });

    set({
      tasks: updatedTasks,
    });

    notify("Pomodoro count updated", "success");
  },
  updateTask: (task) => {
    const updatedTasks = get().tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      }

      return t;
    });

    set({
      tasks: updatedTasks,
    });

    notify("Task updated", "success");
  },
  removeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));

    notify("Task removed", "success");
  },
  setActiveTask: (id) => {
    if (id === 0) {
      set({ activeTask: undefined });
      return;
    }

    const task = get().tasks.find((task) => task.id === id);

    set({
      activeTask: task,
    });

    window.localStorage.setItem("activeTask", JSON.stringify(task));
  },
}));

export default useTasksStore;
