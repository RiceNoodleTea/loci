"use client";

import { cn } from "@/lib/utils";
import { FileQuestion } from "lucide-react";

interface QuizRowProps {
  id: string;
  title: string;
  status: "not_started" | "in_progress" | "completed";
  progress?: string;
  onAction: () => void;
}

const statusConfig = {
  not_started: {
    label: "Not Started",
    badge: "bg-parchment-dark text-muted",
    action: "Start Quiz",
  },
  in_progress: {
    label: "In Progress",
    badge: "bg-amber-100 text-amber-700",
    action: "Resume Session",
  },
  completed: {
    label: "Completed",
    badge: "bg-emerald-100 text-emerald-700",
    action: "Review",
  },
} as const;

export default function QuizRow({
  title,
  status,
  progress,
  onAction,
}: QuizRowProps) {
  const cfg = statusConfig[status];

  return (
    <div className="card flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-olive-light flex items-center justify-center shrink-0">
        <FileQuestion size={18} className="text-olive" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-charcoal truncate">{title}</h4>
        {progress && (
          <p className="label-caps mt-0.5">{progress}</p>
        )}
      </div>

      <span
        className={cn(
          "text-xs font-medium px-2.5 py-1 rounded-full shrink-0",
          cfg.badge,
        )}
      >
        {cfg.label}
      </span>

      <button onClick={onAction} className="btn-secondary shrink-0 text-xs">
        {cfg.action}
      </button>
    </div>
  );
}
