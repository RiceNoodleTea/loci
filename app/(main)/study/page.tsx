"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Plus, BrainCircuit } from "lucide-react";
import DeckCard from "@/components/study/DeckCard";
import QuizRow from "@/components/study/QuizRow";
import FocusPulse from "@/components/study/FocusPulse";

const mockDecks = [
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
];

const mockQuizzes = [
  {
    id: "quiz-1",
    title: "Cell Biology Chapter 5 Review",
    status: "in_progress" as const,
    progress: "3/5",
  },
  {
    id: "quiz-2",
    title: "Linear Algebra: Eigenvalues",
    status: "not_started" as const,
  },
  {
    id: "quiz-3",
    title: "Psychology 101 Midterm Prep",
    status: "completed" as const,
    progress: "5/5",
  },
];

export default function StudyPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-charcoal">
          Study Workshop
        </h1>
        <p className="text-muted mt-1">
          Master your material with flashcards and active recall quizzes
        </p>
      </div>

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Action cards */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/study/flashcards")}
              className="card-hover text-left flex items-center gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-olive-light flex items-center justify-center shrink-0">
                <Plus size={22} className="text-olive" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-charcoal">
                  New Flashcard Deck
                </h3>
                <p className="text-sm text-muted mt-0.5">
                  Create cards for spaced repetition
                </p>
              </div>
            </button>

            <button
              onClick={() => router.push("/study/quizzes")}
              className="card-hover text-left flex items-center gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-olive-light flex items-center justify-center shrink-0">
                <BrainCircuit size={22} className="text-olive" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-charcoal">
                  New Recall Quiz
                </h3>
                <p className="text-sm text-muted mt-0.5">
                  Test your knowledge with active recall
                </p>
              </div>
            </button>
          </div>

          {/* Flashcard Decks */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-olive" />
                <h2 className="font-serif font-bold text-charcoal text-lg">
                  Flashcard Decks
                </h2>
              </div>
              <button
                onClick={() => router.push("/study/flashcards")}
                className="btn-ghost text-xs"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockDecks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  {...deck}
                  onClick={() =>
                    router.push(`/study/flashcards/${deck.id}`)
                  }
                />
              ))}
            </div>
          </section>

          {/* Active Recall Quizzes */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit size={18} className="text-olive" />
                <h2 className="font-serif font-bold text-charcoal text-lg">
                  Active Recall Quizzes
                </h2>
              </div>
              <button
                onClick={() => router.push("/study/quizzes")}
                className="btn-ghost text-xs"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {mockQuizzes.map((quiz) => (
                <QuizRow
                  key={quiz.id}
                  {...quiz}
                  onAction={() =>
                    router.push(`/study/quizzes/${quiz.id}`)
                  }
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-[340px] shrink-0 hidden lg:block">
          <FocusPulse />
        </div>
      </div>
    </div>
  );
}
