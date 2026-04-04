"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn, daysUntil } from "@/lib/utils";
import { useAssessments, type Assessment } from "@/lib/assessment-context";
import type { WidgetSize } from "@/lib/widget-config";

interface AssessmentCalendarProps {
  size: WidgetSize;
}

const DAY_HEADERS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_HEADERS_LONG = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function DayDetail({
  assessments,
  date,
  onClose,
  compact,
}: {
  assessments: Assessment[];
  date: string;
  onClose: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="absolute z-20 bg-white rounded-lg shadow-card-hover border border-border p-3 w-48 -translate-x-1/2 left-1/2 top-full mt-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-charcoal">{date}</p>
          <button onClick={onClose} className="text-muted hover:text-charcoal">
            <X size={12} />
          </button>
        </div>
        {assessments.map((a) => (
          <p key={a.id} className="text-xs text-muted truncate">
            {a.title}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-3 mt-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-serif font-semibold text-charcoal">{date}</p>
        <button
          onClick={onClose}
          className="text-muted hover:text-charcoal transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      <div className="space-y-2 overflow-y-auto max-h-[120px]">
        {assessments.map((a) => {
          const remaining = daysUntil(a.dueDate);
          return (
            <div
              key={a.id}
              className="bg-parchment/60 rounded-lg px-3 py-2 text-xs"
            >
              <p className="font-semibold text-charcoal">{a.title}</p>
              <p className="text-muted mt-0.5">
                {remaining > 0
                  ? `${remaining}d left`
                  : remaining === 0
                  ? "Today"
                  : "Past"}
                {a.location && ` · ${a.location}`}
                {a.subject && ` · ${a.subject}`}
                {a.weighting && ` · ${a.weighting}`}
              </p>
              {a.notes && (
                <p className="text-muted mt-1 line-clamp-2">{a.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AssessmentCalendar({ size }: AssessmentCalendarProps) {
  const { assessments } = useAssessments();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const compact = size === "small";
  const headers = compact ? DAY_HEADERS : DAY_HEADERS_LONG;

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString(
    "en-US",
    compact ? { month: "short", year: "numeric" } : { month: "long", year: "numeric" }
  );

  const assessmentsByDay = new Map<number, Assessment[]>();
  assessments.forEach((a) => {
    const d = new Date(a.dueDate);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const day = d.getDate();
      if (!assessmentsByDay.has(day)) assessmentsByDay.set(day, []);
      assessmentsByDay.get(day)!.push(a);
    }
  });

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const goToPrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const goToNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const blanks = Array.from({ length: firstDay }, (_, i) => (
    <div key={`blank-${i}`} />
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const hasEvent = assessmentsByDay.has(day);
    const todayHighlight = isToday(day);
    const isSelected = selectedDay === day;
    const cellSize = compact ? "w-6 h-6 text-[11px]" : "w-8 h-8 text-sm";

    return (
      <div
        key={day}
        className="flex flex-col items-center justify-center py-0.5 relative"
      >
        <button
          onClick={() => {
            if (hasEvent) setSelectedDay(isSelected ? null : day);
          }}
          className={cn(
            "flex items-center justify-center rounded-full transition-colors",
            cellSize,
            todayHighlight
              ? "bg-olive text-white font-semibold"
              : isSelected
              ? "bg-olive-light text-charcoal font-semibold"
              : hasEvent
              ? "text-charcoal hover:bg-parchment-dark cursor-pointer"
              : "text-charcoal/60"
          )}
        >
          {day}
        </button>
        {hasEvent && (
          <span className="w-1 h-1 rounded-full bg-olive mt-0.5" />
        )}
        {isSelected && compact && assessmentsByDay.has(day) && (
          <DayDetail
            assessments={assessmentsByDay.get(day)!}
            date={`${monthLabel} ${day}`}
            onClose={() => setSelectedDay(null)}
            compact
          />
        )}
      </div>
    );
  });

  const selectedAssessments =
    selectedDay && assessmentsByDay.has(selectedDay)
      ? assessmentsByDay.get(selectedDay)!
      : null;

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2
          className={cn(
            "font-serif font-semibold text-charcoal",
            compact ? "text-sm" : "text-base"
          )}
        >
          Assessment Calendar
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            className="btn-ghost p-1 rounded-lg"
            aria-label="Previous month"
          >
            <ChevronLeft size={compact ? 14 : 16} />
          </button>
          <span
            className={cn(
              "font-medium text-charcoal text-center",
              compact ? "text-xs min-w-[80px]" : "text-sm min-w-[130px]"
            )}
          >
            {monthLabel}
          </span>
          <button
            onClick={goToNext}
            className="btn-ghost p-1 rounded-lg"
            aria-label="Next month"
          >
            <ChevronRight size={compact ? 14 : 16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {headers.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className={cn(
              "text-center font-semibold uppercase tracking-wider text-muted py-0.5",
              compact ? "text-[8px]" : "text-[10px]"
            )}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">{blanks}{days}</div>

      {!compact && selectedAssessments && selectedDay && (
        <DayDetail
          assessments={selectedAssessments}
          date={`${new Date(currentYear, currentMonth, selectedDay).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
