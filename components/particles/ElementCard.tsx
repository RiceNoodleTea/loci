"use client";

import { cn } from "@/lib/utils";
import { Target } from "lucide-react";
import type { Element } from "@/lib/particles/types";

interface ElementProgress {
  protonsPercent: number;
  neutronsPercent: number;
  electronsPercent: number;
  overallPercent: number;
}

interface ElementCardProps {
  element: Element;
  isSelected?: boolean;
  isTarget?: boolean;
  progress?: ElementProgress;
  onClick?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "nonmetal": "bg-green-50",
  "noble gas": "bg-purple-50",
  "alkali metal": "bg-red-50",
  "alkaline earth metal": "bg-orange-50",
  "metalloid": "bg-teal-50",
  "halogen": "bg-cyan-50",
  "transition metal": "bg-amber-50",
  "post-transition metal": "bg-indigo-50",
};

function ProgressBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] text-muted w-3 shrink-0">{label}</span>
      <div className="flex-1 h-1 rounded-full bg-parchment-dark overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[9px] text-muted tabular-nums w-7 text-right">
        {percent}%
      </span>
    </div>
  );
}

export default function ElementCard({
  element,
  isSelected = false,
  isTarget = false,
  progress,
  onClick,
}: ElementCardProps) {
  const bgColor = CATEGORY_COLORS[element.category] ?? "bg-gray-50";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full rounded-xl p-2.5 text-center transition-all",
        "border shadow-card hover:shadow-card-hover",
        bgColor,
        isSelected
          ? "border-olive ring-2 ring-olive/20"
          : "border-border hover:border-olive/40",
        onClick ? "cursor-pointer" : "cursor-default"
      )}
    >
      {isTarget && (
        <div className="absolute top-1 right-1">
          <Target size={12} className="text-olive" />
        </div>
      )}

      <span className="block text-[10px] text-muted text-left tabular-nums">
        {element.atomicNumber}
      </span>

      <span className="block font-serif font-bold text-charcoal text-xl leading-none mt-0.5">
        {element.symbol}
      </span>

      <span className="block text-[10px] text-muted mt-1 truncate">
        {element.name}
      </span>

      {isTarget && progress && (
        <div className="mt-2 space-y-0.5">
          <ProgressBar label="p" percent={progress.protonsPercent} color="bg-orange-400" />
          <ProgressBar label="n" percent={progress.neutronsPercent} color="bg-gray-400" />
          <ProgressBar label="e" percent={progress.electronsPercent} color="bg-yellow-500" />
        </div>
      )}
    </button>
  );
}
