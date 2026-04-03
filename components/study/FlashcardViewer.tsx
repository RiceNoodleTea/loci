"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
}

interface FlashcardViewerProps {
  cards: FlashcardData[];
  onRate: (cardId: string, quality: number) => void;
}

const ratingButtons = [
  { label: "Again", quality: 1, color: "bg-red-100 text-red-700 hover:bg-red-200" },
  { label: "Hard", quality: 2, color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { label: "Good", quality: 3, color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  { label: "Easy", quality: 5, color: "bg-olive-light text-olive-hover hover:bg-olive/20" },
];

export default function FlashcardViewer({ cards, onRate }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const card = cards[currentIndex];
  const total = cards.length;

  const goTo = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < total) {
        setCurrentIndex(idx);
        setIsFlipped(false);
      }
    },
    [total],
  );

  const handleRate = useCallback(
    (quality: number) => {
      onRate(card.id, quality);
      if (currentIndex < total - 1) {
        goTo(currentIndex + 1);
      }
    },
    [card, currentIndex, total, goTo, onRate],
  );

  if (!card) {
    return (
      <div className="card flex items-center justify-center min-h-[300px]">
        <p className="text-muted">No cards to study.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="label-caps text-center">
        Card {currentIndex + 1} of {total}
      </p>

      {/* Card with 3D flip */}
      <div
        className="relative w-full cursor-pointer"
        style={{ perspective: "1200px" }}
        onClick={() => setIsFlipped((f) => !f)}
      >
        <div
          className={cn(
            "relative w-full min-h-[300px] transition-transform duration-500",
          )}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 card flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xl font-serif font-semibold text-charcoal text-center">
              {card.front}
            </p>
            <p className="text-muted text-sm mt-6">Click to reveal</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 card flex flex-col items-center justify-center p-8"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-xl font-serif font-semibold text-charcoal text-center">
              {card.back}
            </p>
          </div>
        </div>
      </div>

      {/* Rating buttons (visible when flipped) */}
      {isFlipped && (
        <div className="flex items-center justify-center gap-3">
          {ratingButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={(e) => {
                e.stopPropagation();
                handleRate(btn.quality);
              }}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                btn.color,
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={cn(
            "btn-ghost flex items-center gap-1",
            currentIndex === 0 && "opacity-40 cursor-not-allowed",
          )}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === total - 1}
          className={cn(
            "btn-ghost flex items-center gap-1",
            currentIndex === total - 1 && "opacity-40 cursor-not-allowed",
          )}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
