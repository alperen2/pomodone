export interface ITimer {
    type: TimerType,
    startingTime: number;
    endingTime: number;
    stop: string;
}

export enum TimerType {
    workTime,
    shortBreak,
    longBreak
}