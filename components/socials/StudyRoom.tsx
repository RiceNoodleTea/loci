"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LogIn, LogOut, Users } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  isActive: boolean;
  studyingMinutes: number;
}

interface StudyRoomProps {
  participants: Participant[];
  onJoin: () => void;
  onLeave: () => void;
  isInRoom: boolean;
  compact?: boolean;
}

export default function StudyRoom({
  participants,
  onJoin,
  onLeave,
  isInRoom,
  compact = false,
}: StudyRoomProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isInRoom) {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isInRoom]);

  const activeCount = participants.filter((p) => p.isActive).length;

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timerDisplay = `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <h3
            className={cn(
              "font-serif font-bold text-charcoal",
              compact ? "text-lg" : "text-xl"
            )}
          >
            Study Room
          </h3>
          {activeCount > 0 && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
          )}
        </div>

        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Users size={15} />
          {activeCount} {activeCount === 1 ? "person" : "people"} studying
        </span>
      </div>

      {isInRoom && (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-6 mb-5 bg-olive-light rounded-2xl",
            !compact && "py-10"
          )}
        >
          <p className="label-caps mb-2">Your Session</p>
          <p
            className={cn(
              "font-mono font-bold text-charcoal",
              compact ? "text-4xl" : "text-6xl"
            )}
          >
            {timerDisplay}
          </p>
        </div>
      )}

      <div
        className={cn(
          "grid gap-3 mb-5",
          compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
        )}
      >
        {participants.map((p) => (
          <div
            key={p.id}
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-xl border border-border",
              p.isActive ? "bg-white" : "bg-parchment opacity-60"
            )}
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-olive flex items-center justify-center text-white text-sm font-bold">
                {p.name.charAt(0).toUpperCase()}
              </div>
              {p.isActive && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-charcoal truncate">
                {p.name}
              </p>
              {p.isActive && (
                <p className="text-[11px] text-muted">
                  studying for {p.studyingMinutes}m
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={isInRoom ? onLeave : onJoin}
        className={cn(
          "w-full flex items-center justify-center gap-2",
          isInRoom ? "btn-secondary" : "btn-primary"
        )}
      >
        {isInRoom ? (
          <>
            <LogOut size={16} /> Leave Room
          </>
        ) : (
          <>
            <LogIn size={16} /> Join Room
          </>
        )}
      </button>
    </div>
  );
}
