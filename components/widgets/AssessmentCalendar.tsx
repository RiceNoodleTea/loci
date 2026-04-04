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
      <div className="absolute z-20 bg-white rounded-lg shadow-card-hover border border-border p-2 w-44 -translate-x-1/2 left-1/2 top-full mt-1">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold text-charcoal">{date}</p>
          <button onClick={onClose} className="text-muted hover:text-charcoal">
            <X size={10} />
          </button>
        </div>
        {assessments.map((a) => (
          <p key={a.id} className="text-[10px] text-muted truncate">
            {a.title}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-2 mt-2 shrink-0 overflow-y-auto max-h-[100px]">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-serif font-semibold text-charcoal">{date}</p>
        <button
          onClick={onClose}
          className="text-muted hover:text-charcoal transition-colors"
        >
          <X size={12} />
        </button>
      </div>
      <div className="space-y-1">
        {assessments.map((a) => {
          const remaining = daysUntil(a.dueDate);
          return (
            <div
              key={a.id}
              className="bg-parchment/60 rounded-lg px-2 py-1.5 text-[10px]"
            >
              <p className="font-semibold text-charcoal">{a.title}</p>
              <p className="text-muted">
                {remaining > 0
                  ? `${remaining}d left`
                  : remaining === 0
                  ? "Today"
                  : "Past"}
                {a.location && ` · ${a.location}`}
                {a.subject && ` · ${a.subject}`}
              </p>
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
    compact
      ? { month: "short", year: "numeric" }
      : { month: "long", year: "numeric" }
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

  const cellSize = compact ? "w-5 h-5 text-[10px]" : "w-7 h-7 text-xs";

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const hasEvent = assessmentsByDay.has(day);
    const todayHighlight = isToday(day);
    const isSelected = selectedDay === day;

    return (
      <div
        key={day}
        className="flex flex-col items-center justify-center relative"
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
          <span className="w-1 h-1 rounded-full bg-olive" />
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
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2
          className={cn(
            "font-serif font-semibold text-charcoal",
            compact ? "text-xs" : "text-sm"
          )}
        >
          Assessment Calendar
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            className="btn-ghost p-0.5 rounded-lg"
            aria-label="Previous month"
          >
            <ChevronLeft size={compact ? 12 : 14} />
          </button>
          <span
            className={cn(
              "font-medium text-charcoal text-center",
              compact ? "text-[10px] min-w-[60px]" : "text-xs min-w-[100px]"
            )}
          >
            {monthLabel}
          </span>
          <button
            onClick={goToNext}
            className="btn-ghost p-0.5 rounded-lg"
            aria-label="Next month"
          >
            <ChevronRight size={compact ? 12 : 14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 shrink-0">
        {headers.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className={cn(
              "text-center font-semibold uppercase tracking-wider text-muted",
              compact ? "text-[7px] py-0" : "text-[9px] py-0.5"
            )}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 min-h-0 overflow-hidden">
        {blanks}
        {days}
      </div>

      {!compact && selectedAssessments && selectedDay && (
        <DayDetail
          assessments={selectedAssessments}
          date={new Date(
            currentYear,
            currentMonth,
            selectedDay
          ).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
