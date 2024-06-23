// src/hooks/usePomodoroTimer.ts
import { useState, useEffect, useRef, useCallback } from "react";

export type TimerStatus = "idle" | "running" | "paused" | "finished";
export type TimerPhase = "work" | "shortBreak" | "longBreak";

interface UseTimerProps {
  workTime: number; // Work time in milliseconds
  shortBreakTime: number; // Short break time in milliseconds
  longBreakTime: number; // Long break time in milliseconds
  onTimerFinish?: () => void; // Optional callback when the timer finishes
  autoSwitch?: boolean; // Automatically switch phases
  autoNextCycle?: boolean; // Automatically start the next cycle
  cyclesBeforeLongBreak?: number; // Number of cycles before long break
}

const usePomodoroTimer = ({
  workTime,
  shortBreakTime,
  longBreakTime,
  onTimerFinish,
  autoSwitch = true,
  autoNextCycle = true,
  cyclesBeforeLongBreak = 4,
}: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const savedTimeLeft = localStorage.getItem("timeLeft");
    const savedTimestamp = localStorage.getItem("timestamp");
    const savedStatus = localStorage.getItem("status");
    const savedPhase = localStorage.getItem("phase");

    if (
      savedTimeLeft &&
      savedTimestamp &&
      savedStatus &&
      savedPhase &&
      savedStatus !== "finished" &&
      savedStatus !== "idle" &&
      savedStatus !== "paused"
    ) {
      const elapsed = Date.now() - parseInt(savedTimestamp);
      return Math.max(parseInt(savedTimeLeft) - elapsed, 0);
    }
    return parseInt(savedTimeLeft || workTime.toString());
  });

  const [status, setStatus] = useState<TimerStatus>(() => {
    const savedStatus = localStorage.getItem("status");
    return (savedStatus as TimerStatus) || "idle";
  });
  const [phase, setPhaseState] = useState<TimerPhase>(() => {
    const savedPhase = localStorage.getItem("phase");
    return (savedPhase as TimerPhase) || "work";
  });
  const [cycles, setCycles] = useState<number>(() => {
    const savedCycles = localStorage.getItem("cycles");
    return parseInt(savedCycles || "0", 10);
  });
  const [callback, setCallbackState] = useState<(() => void) | undefined>(
    onTimerFinish
  );
  const [autoSwitchState, setAutoSwitchState] = useState<boolean>(autoSwitch);
  const [autoNextCycleState, setAutoNextCycleState] =
    useState<boolean>(autoNextCycle);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const saveToLocalStorage = useCallback(
    (time: number, state: TimerStatus, phase: TimerPhase, cycles: number) => {
      localStorage.setItem("timeLeft", time.toString());
      localStorage.setItem("status", state);
      localStorage.setItem("phase", phase);
      localStorage.setItem("timestamp", Date.now().toString());
      localStorage.setItem("cycles", cycles.toString());
    },
    []
  );

  const start = useCallback(() => {
    if (status === "idle" || status === "finished") {
      let initialTime;
      if (phase === "work") {
        initialTime = workTime;
      } else if (phase === "shortBreak") {
        initialTime = shortBreakTime;
      } else {
        initialTime = longBreakTime;
      }
      setTimeLeft(initialTime);
      setStatus("running");
      saveToLocalStorage(initialTime, "running", phase, cycles);
    } else {
      setStatus("running");
      saveToLocalStorage(timeLeft, "running", phase, cycles);
    }
  }, [
    status,
    phase,
    workTime,
    shortBreakTime,
    longBreakTime,
    timeLeft,
    saveToLocalStorage,
    cycles,
  ]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (status !== "paused") {
      setStatus("paused");
      saveToLocalStorage(timeLeft, "paused", phase, cycles);
    }
  }, [status, timeLeft, saveToLocalStorage, phase, cycles]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeLeft(workTime);
    setPhaseState("work");
    setStatus("idle");
    setCycles(0);
    saveToLocalStorage(workTime, "idle", "work", 0);
  }, [workTime, saveToLocalStorage]);

  const resume = useCallback(() => {
    if (status === "paused") {
      setStatus("running");
      saveToLocalStorage(timeLeft, "running", phase, cycles);
    }
  }, [status, timeLeft, saveToLocalStorage, phase, cycles]);

  const setCallback = useCallback((callback: () => void) => {
    setCallbackState(() => callback);
  }, []);

  const setAutoSwitch = useCallback((value: boolean) => {
    setAutoSwitchState(value);
  }, []);

  const setAutoNextCycle = useCallback((value: boolean) => {
    setAutoNextCycleState(value);
  }, []);

  const updatePhase = useCallback(
    (newPhase: TimerPhase) => {
      setPhaseState(newPhase);
      setStatus("idle");
      if (newPhase === "work") {
        setTimeLeft(workTime);
        saveToLocalStorage(workTime, "idle", "work", cycles);
      } else if (newPhase === "shortBreak") {
        setTimeLeft(shortBreakTime);
        saveToLocalStorage(shortBreakTime, "idle", "shortBreak", cycles);
      } else if (newPhase === "longBreak") {
        setTimeLeft(longBreakTime);
        saveToLocalStorage(longBreakTime, "idle", "longBreak", cycles);
      }
    },
    [workTime, shortBreakTime, longBreakTime, saveToLocalStorage, cycles]
  );

  useEffect(() => {
    if (status === "running" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1000);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  useEffect(() => {
    if (status === "running" && timeLeft <= 0) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      setStatus("finished");
      saveToLocalStorage(0, "finished", phase, cycles);
    }
  }, [status, timeLeft, saveToLocalStorage, phase, cycles]);

  useEffect(() => {
    if (status === "finished" && timeLeft === 0) {
      if (phase === "work") {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        if (newCycles % cyclesBeforeLongBreak === 0) {
          if (autoSwitchState) {
            setPhaseState("longBreak");
            setTimeLeft(longBreakTime);
            setStatus("running");
            saveToLocalStorage(
              longBreakTime,
              "running",
              "longBreak",
              newCycles
            );
          } else {
            setPhaseState("longBreak");
            setStatus("idle");
            setTimeLeft(longBreakTime);
            saveToLocalStorage(longBreakTime, "idle", "longBreak", newCycles);
          }
        } else {
          if (autoSwitchState) {
            setPhaseState("shortBreak");
            setTimeLeft(shortBreakTime);
            setStatus("running");
            saveToLocalStorage(
              shortBreakTime,
              "running",
              "shortBreak",
              newCycles
            );
          } else {
            setPhaseState("shortBreak");
            setStatus("idle");
            setTimeLeft(shortBreakTime);
            saveToLocalStorage(shortBreakTime, "idle", "shortBreak", newCycles);
          }
        }
      } else {
        if (autoNextCycleState) {
          setPhaseState("work");
          setTimeLeft(workTime);
          setStatus("running");
          saveToLocalStorage(workTime, "running", "work", cycles);
        } else {
          setPhaseState("work");
          setStatus("idle");
          setTimeLeft(workTime);
          saveToLocalStorage(workTime, "idle", "work", cycles);
        }
      }
      if (callback) {
        callback();
      }
    }
  }, [
    status,
    timeLeft,
    phase,
    cycles,
    workTime,
    shortBreakTime,
    longBreakTime,
    saveToLocalStorage,
    callback,
    autoSwitchState,
    autoNextCycleState,
    cyclesBeforeLongBreak,
  ]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const percentage =
    phase === "work"
      ? ((workTime - timeLeft) / workTime) * 100
      : phase === "shortBreak"
      ? ((shortBreakTime - timeLeft) / shortBreakTime) * 100
      : ((longBreakTime - timeLeft) / longBreakTime) * 100;

  return {
    timeLeft,
    minutes,
    seconds,
    percentage,
    status,
    phase,
    cycles,
    start,
    stop,
    reset,
    resume,
    setCallback,
    setAutoSwitch,
    setAutoNextCycle,
    updatePhase,
  };
};

export default usePomodoroTimer;
