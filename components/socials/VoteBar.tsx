"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Vote, ChevronDown, Check, Save } from "lucide-react";
import { ELEMENTS } from "@/lib/particles/elements";

interface VoteBarProps {
  currentVote: string | null;
  onVote: (symbol: string | null) => void;
}

const VOTABLE_ELEMENTS = ELEMENTS.slice(0, 18);

export default function VoteBar({ currentVote, onVote }: VoteBarProps) {
  const [open, setOpen] = useState(false);
  const [vote, setVote] = useState<string | null>(currentVote);

  const voted = vote !== null && vote !== "SAVE";
  const isSaving = vote === "SAVE";
  const selectedElement = voted
    ? VOTABLE_ELEMENTS.find((e) => e.symbol === vote)
    : null;

  function handleSelect(symbol: string) {
    setVote(symbol);
    onVote(symbol);
    setOpen(false);
  }

  function handleSave() {
    setVote("SAVE");
    onVote(null);
    setOpen(false);
  }

  return (
    <div className="relative rounded-xl border border-border bg-white px-4 py-2.5 flex items-center gap-3">
      <Vote size={16} className="text-olive shrink-0" />
      <span className="text-xs font-medium text-muted whitespace-nowrap">
        This week&apos;s element:
      </span>

      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium transition-colors",
          voted
            ? "bg-olive/10 text-olive"
            : isSaving
            ? "bg-amber-50 text-amber-700"
            : "bg-parchment text-muted hover:text-charcoal"
        )}
      >
        {voted && selectedElement ? (
          <>
            <span className="font-serif font-bold">{selectedElement.symbol}</span>
            <span className="text-xs">{selectedElement.name}</span>
            <Check size={12} className="text-olive" />
          </>
        ) : isSaving ? (
          <>
            <Save size={13} />
            <span>Saving particles</span>
          </>
        ) : (
          <span>Not voted</span>
        )}
        <ChevronDown
          size={14}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-40 w-80 bg-white rounded-xl border border-border shadow-xl p-3 max-h-64 overflow-y-auto">
            <button
              onClick={handleSave}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 transition-colors",
                isSaving
                  ? "bg-amber-50 text-amber-700 font-medium"
                  : "text-muted hover:bg-parchment hover:text-charcoal"
              )}
            >
              <Save size={14} />
              Save particles (skip this week)
              {isSaving && <Check size={12} className="ml-auto" />}
            </button>

            <div className="border-t border-border my-1" />

            <div className="grid grid-cols-3 gap-1">
              {VOTABLE_ELEMENTS.map((el) => {
                const isSelected = vote === el.symbol;
                return (
                  <button
                    key={el.symbol}
                    onClick={() => handleSelect(el.symbol)}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors",
                      isSelected
                        ? "bg-olive/10 text-olive"
                        : "hover:bg-parchment text-charcoal"
                    )}
                  >
                    <span className="font-serif font-bold text-base w-6 text-center">
                      {el.symbol}
                    </span>
                    <span className="text-[11px] truncate">{el.name}</span>
                    {isSelected && (
                      <Check size={10} className="ml-auto text-olive shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
