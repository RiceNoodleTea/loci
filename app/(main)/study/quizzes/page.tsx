"use client";

import { useRouter } from "next/navigation";
import { Plus, BrainCircuit } from "lucide-react";
import QuizRow from "@/components/study/QuizRow";

const allQuizzes = [
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
  {
    id: "quiz-4",
    title: "American Literature: Modernism",
    status: "not_started" as const,
  },
  {
    id: "quiz-5",
    title: "Thermodynamics Concepts",
    status: "completed" as const,
    progress: "5/5",
  },
  {
    id: "quiz-6",
    title: "Macro Economics Final Review",
    status: "in_progress" as const,
    progress: "2/5",
  },
];

export default function QuizzesPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit size={24} className="text-olive" />
            <h1 className="text-3xl font-serif font-bold text-charcoal">
              Active Recall Quizzes
            </h1>
          </div>
          <p className="text-muted">
            Test your knowledge with timed quizzes and track your accuracy
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          New Quiz
        </button>
      </div>

      <div className="space-y-3">
        {allQuizzes.map((quiz) => (
          <QuizRow
            key={quiz.id}
            {...quiz}
            onAction={() => router.push(`/study/quizzes/${quiz.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
