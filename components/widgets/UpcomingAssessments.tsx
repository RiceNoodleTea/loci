"use client";

import { cn, daysUntil } from "@/lib/utils";

export interface Assessment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  location: string;
  priority: "high" | "medium" | "low";
}

interface UpcomingAssessmentsProps {
  assessments: Assessment[];
}

const BORDER_COLORS: Record<Assessment["priority"], string> = {
  high: "border-l-red-500",
  medium: "border-l-olive",
  low: "border-l-border",
};

const PRIORITY_LABELS: Record<Assessment["priority"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const PRIORITY_BADGE: Record<Assessment["priority"], string> = {
  high: "bg-red-50 text-red-600",
  medium: "bg-olive-light text-olive-hover",
  low: "bg-parchment-dark text-muted",
};

export default function UpcomingAssessments({
  assessments,
}: UpcomingAssessmentsProps) {
  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-semibold text-charcoal">
          Upcoming Assessments
        </h2>
        <span className="bg-olive text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
          {assessments.length}
        </span>
      </div>

      <div className="flex-1 space-y-3">
        {assessments.map((a) => {
          const remaining = daysUntil(a.dueDate);
          const dateObj = new Date(a.dueDate);
          const dateStr = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          const timeStr = dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          });

          return (
            <div
              key={a.id}
              className={cn(
                "border-l-[3px] rounded-lg bg-parchment/60 px-4 py-3 flex items-start justify-between gap-3",
                BORDER_COLORS[a.priority]
              )}
            >
              <div className="min-w-0">
                <p className="font-serif font-semibold text-sm text-charcoal truncate">
                  {a.title}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {dateStr} · {timeStr}
                  {a.location && <> · {a.location}</>}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                {remaining > 0 ? (
                  <span className="text-xs font-medium text-muted whitespace-nowrap">
                    {remaining} {remaining === 1 ? "Day" : "Days"} Left
                  </span>
                ) : (
                  <span className="text-xs font-medium text-red-500">
                    Today
                  </span>
                )}
                <span
                  className={cn(
                    "block mt-1 text-[10px] font-semibold rounded px-1.5 py-0.5 leading-tight",
                    PRIORITY_BADGE[a.priority]
                  )}
                >
                  {PRIORITY_LABELS[a.priority]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="text-olive text-sm font-medium hover:text-olive-hover transition-colors mt-4 text-left">
        View Examination Calendar →
      </button>
    </div>
  );
}
