"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Vote, Check, Crown, Lock } from "lucide-react";
import { tallyVotes, getWeekStart } from "@/lib/particles/engine";
import ElementCard from "@/components/particles/ElementCard";
import type { Element, ElementVote } from "@/lib/particles/types";

interface ElementVoteSystemProps {
  elements: Element[];
  currentVotes: ElementVote[];
  userId: string;
  onVote: (symbol: string) => void;
}

function getVotingWindow(): {
  isOpen: boolean;
  openDate: string;
  closeDate: string;
  label: string;
} {
  const now = new Date();
  const weekStartStr = getWeekStart(now);
  const monday = new Date(weekStartStr + "T00:00:00");

  const openDate = new Date(monday);
  const closeDate = new Date(monday);
  closeDate.setDate(closeDate.getDate() + 2);
  closeDate.setHours(23, 59, 59);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const day = now.getDay();
  const isOpen = day >= 1 && day <= 3;

  return {
    isOpen,
    openDate: fmt(openDate),
    closeDate: fmt(closeDate),
    label: isOpen
      ? `Open until ${fmt(closeDate)}`
      : `Opens ${fmt(openDate)}`,
  };
}

function ResultsBar({
  symbol,
  count,
  maxCount,
  elementName,
  isWinner,
}: {
  symbol: string;
  count: number;
  maxCount: number;
  elementName: string;
  isWinner: boolean;
}) {
  const widthPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 shrink-0 text-right">
        <span
          className={cn(
            "font-serif font-bold text-sm",
            isWinner ? "text-olive" : "text-charcoal"
          )}
        >
          {symbol}
        </span>
      </div>
      <div className="flex-1 h-7 rounded-lg bg-parchment-dark overflow-hidden relative">
        <div
          className={cn(
            "h-full rounded-lg transition-all duration-700 ease-out",
            isWinner ? "bg-olive" : "bg-olive/50"
          )}
          style={{ width: `${Math.max(widthPercent, 4)}%` }}
        />
        <span className="absolute inset-0 flex items-center px-3 text-xs font-medium text-charcoal">
          {elementName}
        </span>
      </div>
      <span className="w-12 text-right text-sm font-semibold text-charcoal tabular-nums shrink-0">
        {count} vote{count !== 1 && "s"}
      </span>
    </div>
  );
}

export default function ElementVoteSystem({
  elements,
  currentVotes,
  userId,
  onVote,
}: ElementVoteSystemProps) {
  const userVote = currentVotes.find((v) => v.userId === userId);
  const [selected, setSelected] = useState<string | null>(
    userVote?.elementSymbol ?? null
  );

  const votingWindow = getVotingWindow();
  const tally = useMemo(() => tallyVotes(currentVotes), [currentVotes]);
  const maxCount = tally[0]?.count ?? 0;

  const talliedSymbols = new Set(tally.map((t) => t.symbol));
  const elementMap = useMemo(() => {
    const map = new Map<string, Element>();
    for (const el of elements) map.set(el.symbol, el);
    return map;
  }, [elements]);

  const hasChanged = selected !== (userVote?.elementSymbol ?? null);
  const winner = !votingWindow.isOpen && tally.length > 0 ? tally[0] : null;
  const winnerElement = winner ? elementMap.get(winner.symbol) : null;

  return (
    <div className="card space-y-6">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <Vote size={20} className="text-olive" />
          <h3 className="font-serif font-bold text-charcoal text-lg">
            This Week&apos;s Element Vote
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
              votingWindow.isOpen
                ? "bg-green-100 text-green-700"
                : "bg-parchment-dark text-muted"
            )}
          >
            {votingWindow.isOpen ? (
              <Check size={11} />
            ) : (
              <Lock size={11} />
            )}
            {votingWindow.isOpen ? "Open" : "Closed"}
          </span>
          <span className="text-sm text-muted">{votingWindow.label}</span>
        </div>
      </div>

      {/* Winner banner when voting is closed */}
      {winner && winnerElement && (
        <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Crown size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="label-caps text-amber-700 mb-0.5">
              Winning Element
            </p>
            <p className="font-serif font-bold text-xl text-charcoal">
              {winnerElement.symbol}{" "}
              <span className="font-sans font-normal text-sm text-muted">
                {winnerElement.name}
              </span>
            </p>
            <p className="text-xs text-muted mt-0.5">
              {winner.count} vote{winner.count !== 1 && "s"}
            </p>
          </div>
        </div>
      )}

      {/* Results bar chart */}
      {tally.length > 0 && (
        <div>
          <p className="label-caps mb-3">Current Results</p>
          <div className="space-y-2">
            {tally.map((t, i) => (
              <ResultsBar
                key={t.symbol}
                symbol={t.symbol}
                count={t.count}
                maxCount={maxCount}
                elementName={elementMap.get(t.symbol)?.name ?? t.symbol}
                isWinner={!votingWindow.isOpen && i === 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Element selection grid */}
      {votingWindow.isOpen && (
        <div>
          <p className="label-caps mb-3">Select an Element</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {elements.map((el) => (
              <ElementCard
                key={el.symbol}
                element={el}
                isSelected={selected === el.symbol}
                onClick={() => setSelected(el.symbol)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Vote button */}
      {votingWindow.isOpen && (
        <button
          onClick={() => selected && onVote(selected)}
          disabled={!selected || (!hasChanged && userVote != null)}
          className={cn(
            "btn-primary w-full",
            (!selected || (!hasChanged && userVote != null)) &&
              "opacity-40 cursor-not-allowed"
          )}
        >
          {userVote && !hasChanged
            ? "Voted"
            : userVote
              ? "Change Vote"
              : "Cast Vote"}
        </button>
      )}
    </div>
  );
}
