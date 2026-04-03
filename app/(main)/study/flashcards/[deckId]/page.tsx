"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, BookOpen } from "lucide-react";
import FlashcardViewer from "@/components/study/FlashcardViewer";
import DeckEditor from "@/components/study/DeckEditor";

const mockDecksData: Record<
  string,
  {
    title: string;
    description: string;
    cards: { id: string; front: string; back: string }[];
  }
> = {
  "deck-1": {
    title: "Organic Chemistry Reactions",
    description: "Key reactions and mechanisms for Orgo II final exam.",
    cards: [
      { id: "c1", front: "What is an SN2 reaction?", back: "A bimolecular nucleophilic substitution where the nucleophile attacks the substrate at the same time the leaving group departs, resulting in inversion of stereochemistry." },
      { id: "c2", front: "Define Markovnikov's Rule", back: "In the addition of HX to an alkene, the hydrogen adds to the carbon with the most hydrogens, and X adds to the carbon with fewer hydrogens (more substituted carbon)." },
      { id: "c3", front: "What is a Diels-Alder reaction?", back: "A [4+2] cycloaddition between a conjugated diene and a dienophile to form a six-membered ring." },
      { id: "c4", front: "E1 vs E2 elimination", back: "E1 is unimolecular (two-step, carbocation intermediate, favored by weak bases). E2 is bimolecular (one-step concerted, favored by strong bulky bases)." },
      { id: "c5", front: "What is a Grignard reagent?", back: "An organomagnesium halide (RMgX) used as a strong nucleophile to form new C–C bonds by reacting with carbonyl compounds." },
    ],
  },
  "deck-2": {
    title: "World History: Renaissance",
    description: "Important figures, events, and concepts from the Renaissance period.",
    cards: [
      { id: "c1", front: "When did the Renaissance begin?", back: "The Renaissance began in Italy around the 14th century (1300s) and spread across Europe through the 17th century." },
      { id: "c2", front: "Who painted the Sistine Chapel ceiling?", back: "Michelangelo, commissioned by Pope Julius II, painted it between 1508 and 1512." },
      { id: "c3", front: "What was humanism?", back: "An intellectual movement emphasizing human potential, classical learning, and secular concerns rather than purely religious ones." },
      { id: "c4", front: "What was the printing press's impact?", back: "Gutenberg's movable type press (c. 1440) democratized knowledge, accelerated literacy, and fueled the Reformation and Scientific Revolution." },
    ],
  },
  "deck-3": {
    title: "Spanish Vocabulary",
    description: "Common Spanish words and phrases for conversational fluency.",
    cards: [
      { id: "c1", front: "Madrugada", back: "Dawn / early morning (the hours before sunrise)" },
      { id: "c2", front: "Sobremesa", back: "The time spent at the table after a meal, chatting and enjoying company" },
      { id: "c3", front: "Estrenar", back: "To use or wear something for the first time" },
      { id: "c4", front: "Desvelado", back: "Unable to sleep / kept awake" },
      { id: "c5", front: "Aprovecharse", back: "To take advantage of something" },
      { id: "c6", front: "Tutear", back: "To address someone informally using 'tú'" },
    ],
  },
};

const fallbackDeck = {
  title: "Sample Deck",
  description: "A sample flashcard deck.",
  cards: [
    { id: "c1", front: "Sample front", back: "Sample back" },
    { id: "c2", front: "Another question", back: "Another answer" },
  ],
};

export default function DeckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;

  const deckData = useMemo(
    () => mockDecksData[deckId] ?? fallbackDeck,
    [deckId],
  );

  const [mode, setMode] = useState<"study" | "edit">("study");
  const [ratings, setRatings] = useState<Record<string, number>>({});

  function handleRate(cardId: string, quality: number) {
    setRatings((prev) => ({ ...prev, [cardId]: quality }));
  }

  function handleSave(deck: {
    title: string;
    description: string;
    cards: { front: string; back: string }[];
  }) {
    console.log("Saving deck:", deck);
    setMode("study");
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/study/flashcards")}
          className="btn-ghost flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("study")}
            className={mode === "study" ? "btn-primary flex items-center gap-1.5" : "btn-secondary flex items-center gap-1.5"}
          >
            <BookOpen size={14} />
            Study
          </button>
          <button
            onClick={() => setMode("edit")}
            className={mode === "edit" ? "btn-primary flex items-center gap-1.5" : "btn-secondary flex items-center gap-1.5"}
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-serif font-bold text-charcoal mb-1">
        {deckData.title}
      </h1>
      <p className="text-muted text-sm mb-6">{deckData.description}</p>

      {mode === "study" ? (
        <FlashcardViewer cards={deckData.cards} onRate={handleRate} />
      ) : (
        <DeckEditor
          initialDeck={{
            title: deckData.title,
            description: deckData.description,
            cards: deckData.cards.map((c) => ({
              front: c.front,
              back: c.back,
            })),
          }}
          onSave={handleSave}
        />
      )}

      {/* Study stats */}
      {mode === "study" && Object.keys(ratings).length > 0 && (
        <div className="card mt-6">
          <p className="label-caps mb-2">Session Progress</p>
          <p className="text-sm text-muted">
            {Object.keys(ratings).length} of {deckData.cards.length} cards
            rated this session
          </p>
        </div>
      )}
    </div>
  );
}
