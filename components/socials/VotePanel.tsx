"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Vote } from "lucide-react";

interface ElementOption {
  symbol: string;
  name: string;
  atomicNumber: number;
  protons: number;
  neutrons: number;
  electrons: number;
}

interface VotePanelProps {
  options: ElementOption[];
  currentVote: string | null;
  onVote: (symbol: string) => void;
}

export default function VotePanel({
  options,
  currentVote: initialVote,
  onVote,
}: VotePanelProps) {
  const [selected, setSelected] = useState<string | null>(initialVote);

  function handleSelect(symbol: string) {
    setSelected(symbol);
  }

  function handleVote() {
    if (!selected) return;
    onVote(selected);
  }

  const hasChanged = selected !== initialVote;

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-1">
        <Vote size={20} className="text-olive" />
        <h3 className="font-serif font-bold text-charcoal text-lg">
          Vote for This Week&apos;s Element
        </h3>
      </div>
      <p className="text-sm text-muted mb-5">
        Voting closes Wednesday at midnight
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {options.map((el) => {
          const isSelected = selected === el.symbol;
          return (
            <button
              key={el.symbol}
              onClick={() => handleSelect(el.symbol)}
              className={cn(
                "relative p-4 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? "border-olive bg-olive-light shadow-card"
                  : "border-border bg-white hover:border-olive/40 hover:shadow-card"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-olive rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}

              <p className="font-serif font-bold text-2xl text-charcoal mb-0.5">
                {el.symbol}
              </p>
              <p className="text-sm font-semibold text-charcoal">{el.name}</p>
              <p className="text-[11px] text-muted mt-0.5">
                #{el.atomicNumber}
              </p>

              <div className="mt-3 pt-2 border-t border-border space-y-0.5">
                <p className="text-[11px] text-muted">
                  {el.protons}p &middot; {el.neutrons}n &middot; {el.electrons}e
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleVote}
        disabled={!selected || (!hasChanged && initialVote !== null)}
        className={cn(
          "btn-primary w-full",
          (!selected || (!hasChanged && initialVote !== null)) &&
            "opacity-40 cursor-not-allowed"
        )}
      >
        {initialVote && !hasChanged
          ? "Voted"
          : initialVote
          ? "Change Vote"
          : "Cast Vote"}
      </button>
    </div>
  );
}
