"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getAvatarIcon } from "@/lib/avatar-icons";

export interface LeaderboardMember {
  id: string;
  name: string;
  avatar: string;
  weeklyStudyMinutes: number;
  isStudying: boolean;
  currentSessionStart?: string;
}

interface LeaderboardProps {
  members: LeaderboardMember[];
  currentUserId?: string;
}

function formatStudyTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function MemberCard({
  member,
  isCurrentUser,
}: {
  member: LeaderboardMember;
  isCurrentUser: boolean;
}) {
  const [liveMinutes, setLiveMinutes] = useState(member.weeklyStudyMinutes);

  useEffect(() => {
    if (!member.isStudying || !member.currentSessionStart) {
      setLiveMinutes(member.weeklyStudyMinutes);
      return;
    }
    const update = () => {
      const elapsed = Math.floor(
        (Date.now() - new Date(member.currentSessionStart!).getTime()) / 60000
      );
      setLiveMinutes(member.weeklyStudyMinutes + elapsed);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [member.isStudying, member.currentSessionStart, member.weeklyStudyMinutes]);

  const AvatarIcon = getAvatarIcon(member.avatar);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
        member.isStudying
          ? "border-olive bg-olive/5 shadow-card"
          : "border-border bg-parchment/40 opacity-50 grayscale-[30%]"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          member.isStudying
            ? "bg-olive text-white"
            : "bg-gray-300 text-white"
        )}
      >
        {AvatarIcon ? (
          <AvatarIcon size={22} />
        ) : (
          <span className="font-serif font-bold text-lg">
            {member.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-charcoal text-center truncate w-full">
        {member.name}
        {isCurrentUser && (
          <span className="text-[10px] text-muted font-normal block">
            (you)
          </span>
        )}
      </p>

      {/* Timer */}
      <div
        className={cn(
          "px-3 py-1 rounded-full text-xs font-mono font-medium",
          member.isStudying
            ? "bg-olive/10 text-olive"
            : "bg-gray-100 text-muted"
        )}
      >
        {formatStudyTime(liveMinutes)}
      </div>

      {/* Active indicator */}
      {member.isStudying && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
      )}
    </div>
  );
}

export default function Leaderboard({
  members,
  currentUserId = "current",
}: LeaderboardProps) {
  const sorted = [...members].sort((a, b) => {
    if (a.isStudying && !b.isStudying) return -1;
    if (!a.isStudying && b.isStudying) return 1;
    return b.weeklyStudyMinutes - a.weeklyStudyMinutes;
  });

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sorted.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isCurrentUser={member.id === currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
