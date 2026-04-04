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
        compact ? "px-2 py-2" : "px-3 py-3"
      )}
    >
      <div className="w-8 h-8 rounded-full bg-olive-light flex items-center justify-center shrink-0">
        <Icon size={14} className="text-olive" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted uppercase tracking-wider">
          {label}
        </p>
        <p
          className={cn(
            "font-serif font-bold text-charcoal",
            compact ? "text-sm" : "text-base"
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
    <div className="flex items-end gap-1.5 h-[60px]">
      {data.map((val, i) => (
        <div key={labels[i]} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-olive/70 rounded-t transition-all"
            style={{
              height: `${Math.max((val / max) * 48, 2)}px`,
            }}
          />
          <span className="text-[8px] text-muted">{labels[i]}</span>
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
        <h2 className="text-sm font-serif font-semibold text-charcoal mb-3">
          Study Stats
        </h2>
        <div className="flex-1 flex flex-col gap-2 justify-center">
          <StatCard
            icon={Clock}
            label="Today"
            value={formatStudyTime(s.todayMinutes)}
            compact
          />
          <StatCard
            icon={Flame}
            label="Streak"
            value={`${s.streak} days`}
            compact
          />
          <StatCard
            icon={TrendingUp}
            label="This Week"
            value={formatStudyTime(s.weekMinutes)}
            compact
          />
        </div>
      </div>
    );
  }

  if (size === "large") {
    return (
      <div className="card flex flex-col h-full">
        <h2 className="text-base font-serif font-semibold text-charcoal mb-3">
          Study Stats
        </h2>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <StatCard
            icon={Clock}
            label="Today"
            value={formatStudyTime(s.todayMinutes)}
          />
          <StatCard
            icon={Calendar}
            label="This Week"
            value={formatStudyTime(s.weekMinutes)}
          />
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={formatStudyTime(s.monthMinutes)}
          />
          <StatCard
            icon={Flame}
            label="Streak"
            value={`${s.streak} days`}
          />
        </div>
        <div>
          <p className="text-[10px] text-muted uppercase tracking-wider mb-2">
            Past 7 Days
          </p>
          <MiniBarChart data={s.dailyHistory} labels={s.dailyLabels} />
        </div>
      </div>
    );
  }

  // Medium
  return (
    <div className="card flex flex-col h-full">
      <h2 className="text-base font-serif font-semibold text-charcoal mb-3">
        Study Stats
      </h2>
      <div className="flex-1 grid grid-cols-2 gap-2">
        <StatCard
          icon={Clock}
          label="Today"
          value={formatStudyTime(s.todayMinutes)}
        />
        <StatCard
          icon={Calendar}
          label="This Week"
          value={formatStudyTime(s.weekMinutes)}
        />
        <StatCard
          icon={TrendingUp}
          label="This Month"
          value={formatStudyTime(s.monthMinutes)}
        />
        <StatCard
          icon={Flame}
          label="Streak"
          value={`${s.streak} days`}
        />
      </div>
    </div>
  );
}
