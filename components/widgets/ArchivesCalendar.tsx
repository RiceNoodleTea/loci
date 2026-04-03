"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalendarEvent {
  date: string;
  title: string;
}

interface ArchivesCalendarProps {
  events?: CalendarEvent[];
}

const DAY_HEADERS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function ArchivesCalendar({ events = [] }: ArchivesCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const eventDates = new Set(
    events
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .map((e) => new Date(e.date).getDate())
  );

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
  };

  const goToNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const blanks = Array.from({ length: firstDay }, (_, i) => (
    <div key={`blank-${i}`} />
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const hasEvent = eventDates.has(day);
    const todayHighlight = isToday(day);

    return (
      <div
        key={day}
        className="flex flex-col items-center justify-center py-1"
      >
        <span
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors",
            todayHighlight
              ? "bg-olive text-white font-semibold"
              : "text-charcoal hover:bg-parchment-dark"
          )}
        >
          {day}
        </span>
        {hasEvent && (
          <span className="w-1 h-1 rounded-full bg-olive mt-0.5" />
        )}
      </div>
    );
  });

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-semibold text-charcoal">
          Archives Calendar
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            className="btn-ghost p-1.5 rounded-lg"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-charcoal min-w-[130px] text-center">
            {monthLabel}
          </span>
          <button
            onClick={goToNext}
            className="btn-ghost p-1.5 rounded-lg"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {blanks}
        {days}
      </div>
    </div>
  );
}
