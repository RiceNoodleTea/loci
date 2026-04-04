"use client";

import { cn } from "@/lib/utils";
import { Flame, Clock, TrendingUp, Calendar } from "lucide-react";
import type { WidgetSize } from "@/lib/widget-config";

interface StudyStatsProps {
  size: WidgetSize;
}

const MOCK_STATS = {
  todayMinutes: 127,
  weekMinutes: 845,
  monthMinutes: 3420,
  streak: 12,
  dailyHistory: [45, 90, 120, 80, 60, 127, 0],
  dailyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

function formatStudyTime(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  compact,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-parchment/60 rounded-lg flex items-center gap-2",
        compact ? "px-2 py-1.5" : "px-2.5 py-2"
      )}
    >
      <div
        className={cn(
          "rounded-full bg-olive-light flex items-center justify-center shrink-0",
          compact ? "w-6 h-6" : "w-7 h-7"
        )}
      >
        <Icon size={compact ? 11 : 12} className="text-olive" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] text-muted uppercase tracking-wider leading-tight">
          {label}
        </p>
        <p
          className={cn(
            "font-serif font-bold text-charcoal leading-tight",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function MiniBarChart({
  data,
  labels,
}: {
  data: number[];
  labels: string[];
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-[50px]">
      {data.map((val, i) => (
        <div key={labels[i]} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className="w-full bg-olive/70 rounded-t transition-all"
            style={{
              height: `${Math.max((val / max) * 38, 2)}px`,
            }}
          />
          <span className="text-[7px] text-muted leading-tight">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function StudyStats({ size }: StudyStatsProps) {
  const s = MOCK_STATS;

  if (size === "small") {
    return (
      <div className="card flex flex-col h-full">
        <h2 className="text-xs font-serif font-semibold text-charcoal mb-2 shrink-0">
          Study Stats
        </h2>
        <div className="flex-1 flex flex-col gap-1.5 justify-center min-h-0 overflow-hidden">
          <StatCard icon={Clock} label="Today" value={formatStudyTime(s.todayMinutes)} compact />
          <StatCard icon={Flame} label="Streak" value={`${s.streak} days`} compact />
          <StatCard icon={TrendingUp} label="Week" value={formatStudyTime(s.weekMinutes)} compact />
        </div>
      </div>
    );
  }

  if (size === "large") {
    return (
      <div className="card flex flex-col h-full">
        <h2 className="text-sm font-serif font-semibold text-charcoal mb-2 shrink-0">
          Study Stats
        </h2>
        <div className="grid grid-cols-4 gap-1.5 shrink-0">
          <StatCard icon={Clock} label="Today" value={formatStudyTime(s.todayMinutes)} />
          <StatCard icon={Calendar} label="Week" value={formatStudyTime(s.weekMinutes)} />
          <StatCard icon={TrendingUp} label="Month" value={formatStudyTime(s.monthMinutes)} />
          <StatCard icon={Flame} label="Streak" value={`${s.streak}d`} />
        </div>
        <div className="mt-2 flex-1 min-h-0">
          <p className="text-[9px] text-muted uppercase tracking-wider mb-1">Past 7 Days</p>
          <MiniBarChart data={s.dailyHistory} labels={s.dailyLabels} />
        </div>
      </div>
    );
  }

  // Medium
  return (
    <div className="card flex flex-col h-full">
      <h2 className="text-sm font-serif font-semibold text-charcoal mb-2 shrink-0">
        Study Stats
      </h2>
      <div className="flex-1 grid grid-cols-2 gap-1.5 min-h-0 overflow-hidden">
        <StatCard icon={Clock} label="Today" value={formatStudyTime(s.todayMinutes)} />
        <StatCard icon={Calendar} label="Week" value={formatStudyTime(s.weekMinutes)} />
        <StatCard icon={TrendingUp} label="Month" value={formatStudyTime(s.monthMinutes)} />
        <StatCard icon={Flame} label="Streak" value={`${s.streak} days`} />
      </div>
    </div>
  );
}
