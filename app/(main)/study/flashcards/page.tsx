"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import DeckCard from "@/components/study/DeckCard";

const allDecks = [
  {
    id: "deck-1",
    title: "Organic Chemistry Reactions",
    cardCount: 48,
    lastPracticed: new Date(Date.now() - 2 * 3600000).toISOString(),
    mastery: 72,
    icon: "🧪",
  },
  {
    id: "deck-2",
    title: "World History: Renaissance",
    cardCount: 36,
    lastPracticed: new Date(Date.now() - 86400000).toISOString(),
    mastery: 85,
    icon: "🏛️",
  },
  {
    id: "deck-3",
    title: "Spanish Vocabulary",
    cardCount: 120,
    lastPracticed: new Date(Date.now() - 3 * 86400000).toISOString(),
    mastery: 54,
    icon: "🇪🇸",
  },
  {
    id: "deck-4",
    title: "Anatomy & Physiology",
    cardCount: 64,
    lastPracticed: new Date(Date.now() - 5 * 86400000).toISOString(),
    mastery: 41,
    icon: "🫀",
  },
  {
    id: "deck-5",
    title: "JavaScript Design Patterns",
    cardCount: 28,
    lastPracticed: null,
    mastery: 0,
    icon: "💻",
  },
  {
    id: "deck-6",
    title: "Music Theory Fundamentals",
    cardCount: 42,
    lastPracticed: new Date(Date.now() - 7 * 86400000).toISOString(),
    mastery: 63,
    icon: "🎵",
  },
];

export default function FlashcardsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = allDecks.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">
            Flashcard Library
          </h1>
          <p className="text-muted mt-1">
            {allDecks.length} decks &bull; {allDecks.reduce((a, d) => a + d.cardCount, 0)} total cards
          </p>
        </div>
        <button
          onClick={() => router.push("/study/flashcards/new")}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          New Deck
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search decks..."
          className="input-base pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-muted">No decks match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((deck) => (
            <DeckCard
              key={deck.id}
              {...deck}
              onClick={() => router.push(`/study/flashcards/${deck.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
