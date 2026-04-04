"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import type { WidgetSize } from "@/lib/widget-config";

type TimerMode = "clock" | "pomodoro";
type PomodoroPhase = "focus" | "break";

interface StudyTimerProps {
  size: WidgetSize;
}

const RING_RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function TimerRing({
  progress,
  compact,
}: {
  progress: number;
  compact?: boolean;
}) {
  const offset = CIRCUMFERENCE * (1 - progress);
  const wrapSize = compact ? "w-[110px] h-[110px]" : "w-[140px] h-[140px]";
  return (
    <svg
      className={cn("shrink-0 -rotate-90", wrapSize)}
      viewBox="0 0 128 128"
    >
      <circle
        cx="64"
        cy="64"
        r={RING_RADIUS}
        fill="none"
        stroke="#E2DDD5"
        strokeWidth="4"
      />
      <circle
        cx="64"
        cy="64"
        r={RING_RADIUS}
        fill="none"
        stroke="#8B9A6B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-linear"
      />
    </svg>
  );
}

function ClockTimer({
  active,
  compact,
  grayed,
  onActivate,
}: {
  active: boolean;
  compact?: boolean;
  grayed?: boolean;
  onActivate?: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running || !active) {
      clear();
      return;
    }
    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return clear;
  }, [running, active, clear]);

  useEffect(() => {
    if (!active) setRunning(false);
  }, [active]);

  const reset = () => {
    setRunning(false);
    setElapsed(0);
  };

  const wrapClass = grayed
    ? "opacity-40 pointer-events-none cursor-pointer"
    : "";

  return (
    <div
      className={cn("flex flex-col items-center", wrapClass)}
      onClick={grayed ? onActivate : undefined}
    >
      <p className="label-caps mb-2 text-[10px]">Clock</p>
      <div className="relative">
        <TimerRing progress={0} compact={compact} />
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-serif text-charcoal tabular-nums",
            compact ? "text-3xl" : "text-4xl"
          )}
        >
          {formatTime(elapsed)}
        </span>
      </div>
      {active && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            {running ? <Pause size={13} /> : <Play size={13} />}
            {running ? "Pause" : "Start"}
          </button>
          <button onClick={reset} className="btn-secondary p-1.5">
            <RotateCcw size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

function PomodoroTimer({
  active,
  compact,
  grayed,
  onActivate,
}: {
  active: boolean;
  compact?: boolean;
  grayed?: boolean;
  onActivate?: () => void;
}) {
  const [focusMins, setFocusMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [phase, setPhase] = useState<PomodoroPhase>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalForPhase = phase === "focus" ? focusMins * 60 : breakMins * 60;

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running || !active) {
      clear();
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          const next: PomodoroPhase = phase === "focus" ? "break" : "focus";
          setPhase(next);
          return next === "focus" ? focusMins * 60 : breakMins * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return clear;
  }, [running, active, phase, focusMins, breakMins, clear]);

  useEffect(() => {
    if (!active) setRunning(false);
  }, [active]);

  const reset = () => {
    setRunning(false);
    setPhase("focus");
    setTimeLeft(focusMins * 60);
  };

  const progress = 1 - timeLeft / totalForPhase;

  const wrapClass = grayed
    ? "opacity-40 pointer-events-none cursor-pointer"
    : "";

  return (
    <div
      className={cn("flex flex-col items-center", wrapClass)}
      onClick={grayed ? onActivate : undefined}
    >
      <div className="flex items-center gap-2 mb-2">
        <p className="label-caps text-[10px]">Pomodoro</p>
        {active && !compact && (
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="text-muted hover:text-charcoal transition-colors"
          >
            <Settings size={12} />
          </button>
        )}
      </div>

      {showSettings && active && (
        <div className="flex gap-3 mb-2 text-xs">
          <label className="flex items-center gap-1 text-muted">
            Focus
            <input
              type="number"
              min={1}
              max={90}
              value={focusMins}
              onChange={(e) => {
                const v = Number(e.target.value);
                setFocusMins(v);
                if (phase === "focus" && !running) setTimeLeft(v * 60);
              }}
              className="input-base w-12 text-center py-0.5"
            />
            m
          </label>
          <label className="flex items-center gap-1 text-muted">
            Break
            <input
              type="number"
              min={1}
              max={30}
              value={breakMins}
              onChange={(e) => {
                const v = Number(e.target.value);
                setBreakMins(v);
                if (phase === "break" && !running) setTimeLeft(v * 60);
              }}
              className="input-base w-12 text-center py-0.5"
            />
            m
          </label>
        </div>
      )}

      <div className="relative">
        <TimerRing progress={progress} compact={compact} />
        <span
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center font-serif text-charcoal tabular-nums",
            compact ? "text-3xl" : "text-4xl"
          )}
        >
          {formatTime(timeLeft)}
          <span className="text-[10px] text-muted font-sans capitalize mt-0.5">
            {phase}
          </span>
        </span>
      </div>
      {active && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
          >
            {running ? <Pause size={13} /> : <Play size={13} />}
            {running ? "Pause" : "Start"}
          </button>
          <button onClick={reset} className="btn-secondary p-1.5">
            <RotateCcw size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function StudyTimer({ size }: StudyTimerProps) {
  const [activeMode, setActiveMode] = useState<TimerMode>("pomodoro");

  if (size === "small") {
    return (
      <div className="card flex flex-col items-center h-full">
        <div className="flex items-center gap-2 mb-3 w-full">
          <p className="label-caps text-xs flex-1">Study Timer</p>
          <div className="flex bg-parchment-dark rounded-lg p-0.5">
            {(["clock", "pomodoro"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMode(m)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors capitalize",
                  activeMode === m
                    ? "bg-white text-charcoal shadow-card"
                    : "text-muted hover:text-charcoal"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {activeMode === "clock" ? (
            <ClockTimer active compact />
          ) : (
            <PomodoroTimer active compact />
          )}
        </div>
      </div>
    );
  }

  // Medium: side-by-side, inactive is grayed
  return (
    <div className="card flex flex-col h-full">
      <p className="label-caps mb-4">Study Timer</p>
      <div className="flex-1 flex items-center justify-center gap-6">
        <ClockTimer
          active={activeMode === "clock"}
          grayed={activeMode !== "clock"}
          onActivate={() => setActiveMode("clock")}
        />
        <div className="w-px h-3/4 bg-border" />
        <PomodoroTimer
          active={activeMode === "pomodoro"}
          grayed={activeMode !== "pomodoro"}
          onActivate={() => setActiveMode("pomodoro")}
        />
      </div>
    </div>
  );
}
