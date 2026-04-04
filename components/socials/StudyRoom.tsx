"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LogIn, LogOut, Users, Plus, X } from "lucide-react";

export interface StudyRoomParticipant {
  id: string;
  name: string;
  isActive: boolean;
  personalMinutes: number;
}

interface StudyRoomProps {
  title: string;
  participants: StudyRoomParticipant[];
  roomCreatedAt: string;
  onJoin: () => void;
  onLeave: () => void;
  onClose?: () => void;
  isInRoom: boolean;
}

function formatTimer(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function StudyRoom({
  title,
  participants,
  roomCreatedAt,
  onJoin,
  onLeave,
  onClose,
  isInRoom,
}: StudyRoomProps) {
  const [overallElapsed, setOverallElapsed] = useState(0);
  const [personalElapsed, setPersonalElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(roomCreatedAt).getTime();
    const update = () => {
      setOverallElapsed(Math.floor((Date.now() - start) / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [roomCreatedAt]);

  useEffect(() => {
    if (!isInRoom) {
      setPersonalElapsed(0);
      return;
    }
    const interval = setInterval(
      () => setPersonalElapsed((s) => s + 1),
      1000
    );
    return () => clearInterval(interval);
  }, [isInRoom]);

  const activeCount = participants.filter((p) => p.isActive).length;

  return (
    <div className="rounded-xl border-2 border-green-300 bg-green-50/30 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <h4 className="font-serif font-bold text-charcoal text-sm">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted">
            <Users size={13} />
            {activeCount}
          </span>
          <span className="font-mono text-xs text-charcoal bg-white px-2 py-0.5 rounded-md border border-border">
            {formatTimer(overallElapsed)}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-red-100 text-muted hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Personal timer when in room */}
      {isInRoom && (
        <div className="bg-olive-light rounded-lg px-3 py-2 mb-3 flex items-center justify-between">
          <span className="text-xs text-olive font-medium">Your session</span>
          <span className="font-mono text-sm font-bold text-charcoal">
            {formatTimer(personalElapsed)}
          </span>
        </div>
      )}

      {/* Participants grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
        {participants.map((p) => (
          <div
            key={p.id}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg border",
              p.isActive
                ? "border-green-200 bg-white"
                : "border-border bg-parchment/50 opacity-60"
            )}
          >
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full bg-olive flex items-center justify-center text-white text-[10px] font-bold">
                {p.name.charAt(0).toUpperCase()}
              </div>
              {p.isActive && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-charcoal truncate">
                {p.name}
              </p>
              {p.isActive && (
                <p className="text-[10px] text-muted font-mono">
                  {p.personalMinutes}m
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Join / Leave */}
      <button
        onClick={isInRoom ? onLeave : onJoin}
        className={cn(
          "w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors",
          isInRoom
            ? "bg-white border border-border text-charcoal hover:bg-parchment"
            : "bg-olive text-white hover:bg-olive-hover"
        )}
      >
        {isInRoom ? (
          <>
            <LogOut size={13} /> Leave Room
          </>
        ) : (
          <>
            <LogIn size={13} /> Join Room
          </>
        )}
      </button>
    </div>
  );
}

interface CreateStudyRoomButtonProps {
  onCreate: (title: string) => void;
}

export function CreateStudyRoomButton({ onCreate }: CreateStudyRoomButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");

  function handleSubmit() {
    const t = title.trim();
    if (!t) return;
    onCreate(t);
    setTitle("");
    setShowForm(false);
  }

  if (showForm) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-white p-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Study room title..."
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted text-charcoal"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className={cn(
            "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
            title.trim()
              ? "bg-olive text-white hover:bg-olive-hover"
              : "bg-parchment-dark text-muted cursor-not-allowed"
          )}
        >
          Create
        </button>
        <button
          onClick={() => {
            setShowForm(false);
            setTitle("");
          }}
          className="p-1 text-muted hover:text-charcoal transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-olive hover:bg-olive/10 transition-colors border border-olive/20"
    >
      <Plus size={13} />
      Create Study Room
    </button>
  );
}
