"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock, ChevronDown, Atom, FlaskConical, Sparkles } from "lucide-react";
import type { WeeklyCompetition } from "@/lib/particles/types";

interface CompetitionHistoryProps {
  history: WeeklyCompetition[];
}

function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${fmt(start)} – ${fmt(end)}`;
}

function formatYear(weekStart: string): string {
  return new Date(weekStart + "T00:00:00").getFullYear().toString();
}

export default function CompetitionHistory({
  history,
}: CompetitionHistoryProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());

  const sorted = [...history].sort(
    (a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
  );

  function toggleWeek(weekStart: string) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekStart)) {
        next.delete(weekStart);
      } else {
        next.add(weekStart);
      }
      return next;
    });
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2.5 mb-5">
        <Clock size={20} className="text-olive" />
        <h3 className="font-serif font-bold text-charcoal text-lg">
          Competition History
        </h3>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-10">
          <Sparkles size={32} className="mx-auto text-muted mb-3 opacity-40" />
          <p className="text-sm font-medium text-charcoal mb-1">
            No history yet
          </p>
          <p className="text-xs text-muted max-w-xs mx-auto">
            Complete your first week of studying to see competition results
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((comp) => {
            const isExpanded = expandedWeeks.has(comp.weekStart);

            return (
              <div
                key={comp.weekStart}
                className="rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => toggleWeek(comp.weekStart)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 text-left transition-colors",
                    "hover:bg-parchment",
                    isExpanded && "bg-parchment"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal">
                      {formatWeekRange(comp.weekStart)}
                    </p>
                    <p className="text-[11px] text-muted">
                      {formatYear(comp.weekStart)}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-charcoal tabular-nums shrink-0">
                    {comp.particlesEarned} pts
                  </span>

                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-muted transition-transform shrink-0",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-border bg-parchment/50">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-white">
                        <p className="label-caps mb-1">Particles</p>
                        <p className="text-lg font-bold text-charcoal tabular-nums">
                          {comp.particlesEarned.toLocaleString()}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-white">
                        <div className="flex items-center gap-1 mb-1">
                          <Atom size={11} className="text-olive" />
                          <p className="label-caps">Atoms Built</p>
                        </div>
                        <p className="text-lg font-bold text-charcoal tabular-nums">
                          {comp.atomsBuilt}
                        </p>
                      </div>

                      <div className="col-span-2 p-3 rounded-lg bg-white">
                        <div className="flex items-center gap-1 mb-1">
                          <FlaskConical size={11} className="text-olive" />
                          <p className="label-caps">Best Molecule</p>
                        </div>
                        {comp.bestMolecule ? (
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-charcoal text-lg">
                              {comp.bestMolecule.formula}
                            </span>
                            <span className="text-sm text-muted">
                              {comp.bestMolecule.name}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-muted">
                            No molecules built this week
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
