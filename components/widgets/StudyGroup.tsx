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

function GroupList({ groups, compact }: { groups: GroupInfo[]; compact?: boolean }) {
  return (
    <div className="space-y-0.5 overflow-y-auto h-full">
      {groups.map((g) => (
        <div
          key={g.id}
          className={cn(
            "flex items-center gap-1.5 rounded-lg hover:bg-parchment/60 transition-colors cursor-pointer",
            compact ? "px-1 py-1" : "px-1.5 py-1.5"
          )}
        >
          <div
            className={cn(
              "rounded-full bg-olive flex items-center justify-center text-white font-serif font-bold shrink-0",
              compact ? "w-6 h-6 text-[10px]" : "w-7 h-7 text-xs"
            )}
          >
            {g.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "font-semibold text-charcoal truncate",
                compact ? "text-[10px]" : "text-xs"
              )}
            >
              {g.name}
            </p>
            {!compact && (
              <p className="text-[9px] text-muted">
                <Users size={9} className="inline mr-0.5" />
                {g.memberCount}
              </p>
            )}
          </div>
          {g.unread > 0 && (
            <span className="shrink-0 bg-olive text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
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
    <div className="space-y-1">
      <p className="text-[9px] text-muted uppercase tracking-wider font-semibold flex items-center gap-1">
        <Trophy size={9} />
        Weekly Top 3
      </p>
      {entries.map((e, i) => (
        <div key={e.rank} className="flex items-center gap-1.5">
          <span
            className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold",
              RANK_COLORS[i] || "bg-parchment-dark text-muted"
            )}
          >
            {e.rank}
          </span>
          <span className="text-[11px] text-charcoal flex-1 truncate">
            {e.name}
          </span>
          <span className="text-[11px] text-muted font-medium">{e.hours}h</span>
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
      <p className="text-[9px] text-muted uppercase tracking-wider font-semibold flex items-center gap-1 mb-1">
        <FlaskConical size={9} />
        Lab Progress
      </p>
      <div className="flex items-center gap-1.5">
        <div className="w-7 h-7 rounded-lg bg-olive-light flex items-center justify-center">
          <span className="text-xs font-bold text-olive">{symbol}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-charcoal font-medium">{element}</p>
          <div className="w-full h-1 bg-parchment-dark rounded-full mt-0.5">
            <div
              className="h-full bg-olive rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[8px] text-muted mt-0.5">
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
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <h2 className="text-xs font-serif font-semibold text-charcoal">
            Study Groups
          </h2>
          {totalUnread > 0 && (
            <span className="flex items-center gap-0.5 text-[9px] text-olive">
              <MessageCircle size={9} />
              {totalUnread}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <GroupList groups={MOCK_GROUPS} compact />
        </div>
      </div>
    );
  }

  if (size === "large") {
    return (
      <div className="card flex flex-col h-full">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h2 className="text-sm font-serif font-semibold text-charcoal">
            Study Groups
          </h2>
          {totalUnread > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-olive">
              <MessageCircle size={10} />
              {totalUnread} new
            </span>
          )}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-3 min-h-0 overflow-hidden">
          <div className="overflow-y-auto min-h-0">
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
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-sm font-serif font-semibold text-charcoal">
          Study Groups
        </h2>
        {totalUnread > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-olive">
            <MessageCircle size={10} />
            {totalUnread} new
          </span>
        )}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 min-h-0 overflow-hidden">
        <div className="overflow-y-auto min-h-0">
          <GroupList groups={MOCK_GROUPS} />
        </div>
        <div>
          <MiniLeaderboard entries={MOCK_LEADERBOARD} />
        </div>
      </div>
    </div>
  );
}
