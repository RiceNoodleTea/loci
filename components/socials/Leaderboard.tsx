"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface LeaderboardMember {
  id: string;
  name: string;
  studyMinutes: number;
  particlesEarned: number;
}

interface LeaderboardProps {
  members: LeaderboardMember[];
  period: "weekly" | "monthly";
  currentUserId?: string;
}

function formatStudyTime(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const RANK_STYLES: Record<number, { bg: string; text: string; ring: string }> = {
  1: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-300" },
  2: { bg: "bg-gray-100", text: "text-gray-500", ring: "ring-gray-300" },
  3: { bg: "bg-orange-100", text: "text-orange-700", ring: "ring-orange-300" },
};

export default function Leaderboard({
  members,
  period: initialPeriod,
  currentUserId = "current",
}: LeaderboardProps) {
  const [period, setPeriod] = useState<"weekly" | "monthly">(initialPeriod);

  const sorted = [...members].sort(
    (a, b) => b.studyMinutes - a.studyMinutes
  );

  return (
    <div>
      <div className="flex items-center gap-1 bg-parchment-dark rounded-lg p-1 mb-5 w-fit">
        {(["weekly", "monthly"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize",
              period === p
                ? "bg-white text-charcoal shadow-card"
                : "text-muted hover:text-charcoal"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {sorted.map((member, i) => {
          const rank = i + 1;
          const isTopThree = rank <= 3;
          const style = RANK_STYLES[rank];
          const isCurrentUser = member.id === currentUserId;

          return (
            <div
              key={member.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-colors",
                isCurrentUser && "bg-olive-light",
                !isCurrentUser && "hover:bg-parchment"
              )}
            >
              {isTopThree && style ? (
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2",
                    style.bg,
                    style.text,
                    style.ring
                  )}
                >
                  {rank === 1 ? (
                    <Trophy size={14} />
                  ) : (
                    rank
                  )}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-muted bg-parchment-dark">
                  {rank}
                </div>
              )}

              <div className="w-9 h-9 rounded-full bg-olive flex items-center justify-center text-white text-sm font-bold shrink-0">
                {member.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-charcoal truncate">
                  {member.name}
                  {isCurrentUser && (
                    <span className="text-xs text-muted font-normal ml-1.5">
                      (you)
                    </span>
                  )}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-charcoal">
                  {formatStudyTime(member.studyMinutes)}
                </p>
                <p className="text-[11px] text-muted">
                  {member.particlesEarned} particles
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
