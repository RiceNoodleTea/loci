"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import QuizPlayer from "@/components/study/QuizPlayer";

const mockQuestions = [
  {
    id: "q1",
    questionText:
      "Which organelle is responsible for producing ATP in eukaryotic cells?",
    questionType: "multiple_choice" as const,
    options: [
      "Golgi apparatus",
      "Mitochondria",
      "Endoplasmic reticulum",
      "Ribosome",
    ],
    correctAnswer: "Mitochondria",
  },
  {
    id: "q2",
    questionText: "DNA replication is a semi-conservative process.",
    questionType: "true_false" as const,
    correctAnswer: "True",
  },
  {
    id: "q3",
    questionText:
      "What is the primary function of ribosomes?",
    questionType: "multiple_choice" as const,
    options: [
      "Lipid synthesis",
      "Protein synthesis",
      "DNA replication",
      "Cell division",
    ],
    correctAnswer: "Protein synthesis",
  },
  {
    id: "q4",
    questionText:
      "Name the phase of mitosis where chromosomes align at the cell's equator.",
    questionType: "short_answer" as const,
    correctAnswer: "Metaphase",
  },
  {
    id: "q5",
    questionText: "The cell membrane is primarily composed of a phospholipid bilayer.",
    questionType: "true_false" as const,
    correctAnswer: "True",
  },
];

export default function QuizSessionPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  const [completed, setCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });

  function handleComplete(score: number, total: number) {
    setFinalScore({ score, total });
    setCompleted(true);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/study/quizzes")}
          className="btn-ghost flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Quizzes
        </button>
        <span className="label-caps">Quiz {quizId.replace("quiz-", "#")}</span>
      </div>

      <QuizPlayer questions={mockQuestions} onComplete={handleComplete} />

      {completed && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/study/quizzes")}
            className="btn-primary"
          >
            Back to All Quizzes
          </button>
        </div>
      )}
    </div>
  );
}
