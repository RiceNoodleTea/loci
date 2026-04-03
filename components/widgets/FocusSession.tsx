"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";

type Mode = "focus" | "break";

const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  break: 5 * 60,
};

export default function FocusSession() {
  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          const nextMode: Mode = mode === "focus" ? "break" : "focus";
          setMode(nextMode);
          return DURATIONS[nextMode];
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, mode, clearTimer]);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const progress = 1 - timeLeft / DURATIONS[mode];
  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="card flex flex-col items-center">
      <p className="label-caps self-start mb-4">Focus Session</p>

      <div className="flex gap-2 mb-6">
        {(["focus", "break"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setTimeLeft(DURATIONS[m]);
              setIsRunning(false);
            }}
            className={cn(
              "px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize",
              mode === m
                ? "bg-olive text-white"
                : "text-muted hover:bg-parchment-dark"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="relative w-[140px] h-[140px] mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="#E2DDD5"
            strokeWidth="4"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="#8B9A6B"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-5xl font-serif text-charcoal tabular-nums">
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setIsRunning((r) => !r)}
          className="btn-primary flex items-center gap-2"
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleReset} className="btn-secondary p-2">
          <RotateCcw size={16} />
        </button>
      </div>

      <p className="text-xs text-muted">
        Current Mode: <span className="font-medium">Pomodoro Technique</span>
      </p>
    </div>
  );
}
