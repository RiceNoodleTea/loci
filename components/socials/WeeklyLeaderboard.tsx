"use client";

import { cn } from "@/lib/utils";
import { Trophy, Atom, FlaskConical } from "lucide-react";
import type { WeeklyCompetition } from "@/lib/particles/types";

interface WeeklyLeaderboardProps {
  competitions: WeeklyCompetition[];
  currentGroupId: string;
}

const RANK_STYLES: Record<number, { bg: string; text: string; ring: string; label: string }> = {
  1: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-300", label: "Gold" },
  2: { bg: "bg-gray-100", text: "text-gray-500", ring: "ring-gray-300", label: "Silver" },
  3: { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-300", label: "Bronze" },
};

const GROUP_NAMES: Record<string, string> = {
  "group-1": "Organic Chemistry Squad",
  "group-2": "Physics Pioneers",
  "group-3": "Bio Lab Crew",
  "group-4": "Math Mavericks",
  "group-5": "Chem Catalysts",
};

function formatWeekPeriod(weekStart: string): string {
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const year = end.getFullYear();
  return `${fmt(start)} – ${fmt(end)}, ${year}`;
}

export default function WeeklyLeaderboard({
  competitions,
  currentGroupId,
}: WeeklyLeaderboardProps) {
  const sorted = [...competitions].sort(
    (a, b) => b.particlesEarned - a.particlesEarned
  );

  const weekStart = sorted[0]?.weekStart;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <Trophy size={20} className="text-olive" />
          <h3 className="font-serif font-bold text-charcoal text-lg">
            Weekly Rankings
          </h3>
        </div>
      </div>

      {weekStart && (
        <p className="text-sm text-muted mb-5">
          {formatWeekPeriod(weekStart)}
        </p>
      )}

      <div className="space-y-2">
        {sorted.map((comp, i) => {
          const rank = i + 1;
          const isTopThree = rank <= 3;
          const style = RANK_STYLES[rank];
          const isCurrent = comp.groupId === currentGroupId;
          const groupName = GROUP_NAMES[comp.groupId] ?? comp.groupId;

          return (
            <div
              key={comp.groupId}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors",
                isCurrent && "bg-olive-light",
                !isCurrent && "hover:bg-parchment"
              )}
            >
              {isTopThree && style ? (
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 shrink-0",
                    style.bg,
                    style.text,
                    style.ring
                  )}
                >
                  {rank === 1 ? <Trophy size={14} /> : rank}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-muted bg-parchment-dark shrink-0">
                  {rank}
                </div>
              )}

              <div className="w-9 h-9 rounded-full bg-olive flex items-center justify-center text-white text-sm font-bold shrink-0">
                {groupName.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-charcoal truncate">
                  {groupName}
                  {isCurrent && (
                    <span className="text-xs text-muted font-normal ml-1.5">
                      (your group)
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-[11px] text-muted">
                    <Atom size={11} />
                    {comp.atomsBuilt} atom{comp.atomsBuilt !== 1 && "s"}
                  </span>
                  {comp.bestMolecule && (
                    <span className="flex items-center gap-1 text-[11px] text-muted">
                      <FlaskConical size={11} />
                      {comp.bestMolecule.formula}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-charcoal tabular-nums">
                  {comp.particlesEarned.toLocaleString()}
                </p>
                <p className="text-[11px] text-muted">particles</p>
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <p className="text-sm text-muted text-center py-8">
          No competition data yet. Start studying to earn particles!
        </p>
      )}
    </div>
  );
}
