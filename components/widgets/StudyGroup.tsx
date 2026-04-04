"use client";

import { cn } from "@/lib/utils";
import { Users, Trophy, MessageCircle, FlaskConical } from "lucide-react";
import type { WidgetSize } from "@/lib/widget-config";

interface StudyGroupProps {
  size: WidgetSize;
}

interface GroupInfo {
  id: string;
  name: string;
  memberCount: number;
  unread: number;
}

interface LeaderEntry {
  rank: number;
  name: string;
  hours: number;
}

const MOCK_GROUPS: GroupInfo[] = [
  { id: "g1", name: "Physics Study Group", memberCount: 5, unread: 3 },
  { id: "g2", name: "English Literature", memberCount: 4, unread: 0 },
  { id: "g3", name: "Chemistry Lab Crew", memberCount: 6, unread: 12 },
  { id: "g4", name: "Maths Olympiad Prep", memberCount: 3, unread: 1 },
];

const MOCK_LEADERBOARD: LeaderEntry[] = [
  { rank: 1, name: "Alex", hours: 18.5 },
  { rank: 2, name: "Jordan", hours: 15.2 },
  { rank: 3, name: "Sam", hours: 12.8 },
];

const MOCK_LAB = {
  element: "Carbon",
  symbol: "C",
  particlesCollected: 4,
  particlesNeeded: 6,
};

const RANK_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-gray-100 text-gray-500",
  "bg-orange-100 text-orange-700",
];

function GroupList({
  groups,
  compact,
}: {
  groups: GroupInfo[];
  compact?: boolean;
}) {
  return (
    <div className={cn("space-y-1 overflow-y-auto", compact ? "max-h-full" : "max-h-[200px]")}>
      {groups.map((g) => (
        <div
          key={g.id}
          className={cn(
            "flex items-center gap-2 rounded-lg hover:bg-parchment/60 transition-colors cursor-pointer",
            compact ? "px-1.5 py-1.5" : "px-2 py-2"
          )}
        >
          <div
            className={cn(
              "rounded-full bg-olive flex items-center justify-center text-white font-serif font-bold shrink-0",
              compact ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm"
            )}
          >
            {g.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "font-semibold text-charcoal truncate",
                compact ? "text-xs" : "text-sm"
              )}
            >
              {g.name}
            </p>
            <p className="text-[10px] text-muted">
              <Users size={10} className="inline mr-0.5" />
              {g.memberCount}
            </p>
          </div>
          {g.unread > 0 && (
            <span className="shrink-0 bg-olive text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {g.unread}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function MiniLeaderboard({ entries }: { entries: LeaderEntry[] }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
        <Trophy size={10} />
        Weekly Top 3
      </p>
      {entries.map((e, i) => (
        <div key={e.rank} className="flex items-center gap-2">
          <span
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
              RANK_COLORS[i] || "bg-parchment-dark text-muted"
            )}
          >
            {e.rank}
          </span>
          <span className="text-xs text-charcoal flex-1 truncate">
            {e.name}
          </span>
          <span className="text-xs text-muted font-medium">{e.hours}h</span>
        </div>
      ))}
    </div>
  );
}

function LabProgress({
  element,
  symbol,
  collected,
  needed,
}: {
  element: string;
  symbol: string;
  collected: number;
  needed: number;
}) {
  const pct = Math.min((collected / needed) * 100, 100);
  return (
    <div>
      <p className="text-[10px] text-muted uppercase tracking-wider font-semibold flex items-center gap-1 mb-1.5">
        <FlaskConical size={10} />
        Lab Progress
      </p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-olive-light flex items-center justify-center">
          <span className="text-sm font-bold text-olive">{symbol}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-charcoal font-medium">{element}</p>
          <div className="w-full h-1.5 bg-parchment-dark rounded-full mt-1">
            <div
              className="h-full bg-olive rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted mt-0.5">
            {collected}/{needed} particles
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StudyGroup({ size }: StudyGroupProps) {
  const totalUnread = MOCK_GROUPS.reduce((sum, g) => sum + g.unread, 0);

  if (size === "small") {
    return (
      <div className="card flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-serif font-semibold text-charcoal">
            Study Groups
          </h2>
          {totalUnread > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-olive">
              <MessageCircle size={10} />
              {totalUnread}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <GroupList groups={MOCK_GROUPS} compact />
        </div>
      </div>
    );
  }

  if (size === "large") {
    return (
      <div className="card flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-serif font-semibold text-charcoal">
            Study Groups
          </h2>
          {totalUnread > 0 && (
            <span className="flex items-center gap-1 text-xs text-olive">
              <MessageCircle size={12} />
              {totalUnread} new
            </span>
          )}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-4">
          <div className="overflow-hidden">
            <GroupList groups={MOCK_GROUPS} />
          </div>
          <div>
            <MiniLeaderboard entries={MOCK_LEADERBOARD} />
          </div>
          <div>
            <LabProgress
              element={MOCK_LAB.element}
              symbol={MOCK_LAB.symbol}
              collected={MOCK_LAB.particlesCollected}
              needed={MOCK_LAB.particlesNeeded}
            />
          </div>
        </div>
      </div>
    );
  }

  // Medium
  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-serif font-semibold text-charcoal">
          Study Groups
        </h2>
        {totalUnread > 0 && (
          <span className="flex items-center gap-1 text-xs text-olive">
            <MessageCircle size={12} />
            {totalUnread} new
          </span>
        )}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="overflow-hidden">
          <GroupList groups={MOCK_GROUPS} />
        </div>
        <div>
          <MiniLeaderboard entries={MOCK_LEADERBOARD} />
        </div>
      </div>
    </div>
  );
}
