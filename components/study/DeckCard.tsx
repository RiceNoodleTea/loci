"use client";

import { cn } from "@/lib/utils";

interface DeckCardProps {
  id: string;
  title: string;
  cardCount: number;
  lastPracticed: string | null;
  mastery: number;
  icon: string;
  onClick: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default function DeckCard({
  title,
  cardCount,
  lastPracticed,
  mastery,
  icon,
  onClick,
}: DeckCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn("card-hover text-left w-full cursor-pointer")}
    >
      <div className="w-11 h-11 rounded-xl bg-olive-light flex items-center justify-center text-xl mb-4">
        {icon}
      </div>

      <h3 className="font-serif font-bold text-charcoal text-base mb-1">
        {title}
      </h3>

      <p className="label-caps mb-4">
        {cardCount} cards
        {lastPracticed && <> &bull; last practiced {timeAgo(lastPracticed)}</>}
      </p>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="label-caps">Mastery</span>
          <span className="text-xs font-semibold text-charcoal">
            {mastery}%
          </span>
        </div>
        <div className="h-1.5 bg-parchment-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-olive rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, mastery))}%` }}
          />
        </div>
      </div>
    </button>
  );
}
