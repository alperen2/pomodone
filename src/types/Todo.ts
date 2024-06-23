export enum TaskStatuses {
    waiting,
    inprogress,
    done
}

export interface ITask {
    id: number;
    task: string;
    status: TaskStatuses;
    pomodoroCount: number;
}