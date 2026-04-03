"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  questionType: "multiple_choice" | "short_answer" | "true_false";
  options?: string[];
  correctAnswer: string;
}

interface QuizPlayerProps {
  questions: Question[];
  onComplete: (score: number, total: number) => void;
}

export default function QuizPlayer({ questions, onComplete }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;
  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / total) * 100;
  const isLast = currentIndex === total - 1;

  const setAnswer = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
    },
    [question],
  );

  function handleNext() {
    if (isLast) {
      setSubmitted(true);
      const score = questions.reduce(
        (acc, q) =>
          acc +
          (answers[q.id]?.trim().toLowerCase() ===
          q.correctAnswer.trim().toLowerCase()
            ? 1
            : 0),
        0,
      );
      onComplete(score, total);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  if (submitted) {
    const score = questions.reduce(
      (acc, q) =>
        acc +
        (answers[q.id]?.trim().toLowerCase() ===
        q.correctAnswer.trim().toLowerCase()
          ? 1
          : 0),
      0,
    );
    const pct = Math.round((score / total) * 100);

    return (
      <div className="space-y-6">
        <div className="card text-center py-10">
          <p className="label-caps mb-2">Quiz Complete</p>
          <p className="text-5xl font-serif font-bold text-charcoal">
            {score}/{total}
          </p>
          <p className="text-muted mt-2">{pct}% correct</p>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const userAns = answers[q.id] ?? "";
            const correct =
              userAns.trim().toLowerCase() ===
              q.correctAnswer.trim().toLowerCase();
            return (
              <div
                key={q.id}
                className={cn(
                  "card border-l-4",
                  correct ? "border-l-emerald-500" : "border-l-red-400",
                )}
              >
                <div className="flex items-start gap-3">
                  {correct ? (
                    <CheckCircle2
                      size={20}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                  ) : (
                    <XCircle
                      size={20}
                      className="text-red-400 shrink-0 mt-0.5"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-charcoal">
                      {idx + 1}. {q.questionText}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="text-muted">Your answer: </span>
                      <span
                        className={
                          correct ? "text-emerald-600" : "text-red-500"
                        }
                      >
                        {userAns || "(no answer)"}
                      </span>
                    </p>
                    {!correct && (
                      <p className="text-sm mt-0.5">
                        <span className="text-muted">Correct: </span>
                        <span className="text-emerald-600 font-medium">
                          {q.correctAnswer}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="h-2 bg-parchment-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-olive rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="card space-y-6">
        <p className="label-caps">
          Question {currentIndex + 1} of {total}
        </p>
        <h2 className="text-xl font-serif font-semibold text-charcoal">
          {question.questionText}
        </h2>

        {/* Multiple choice */}
        {question.questionType === "multiple_choice" &&
          question.options && (
            <div className="space-y-2">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswer(opt)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border transition-colors text-sm",
                    answers[question.id] === opt
                      ? "border-olive bg-olive-light text-charcoal font-medium"
                      : "border-border bg-white hover:bg-parchment text-charcoal",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

        {/* True / False */}
        {question.questionType === "true_false" && (
          <div className="grid grid-cols-2 gap-3">
            {["True", "False"].map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswer(opt)}
                className={cn(
                  "py-4 rounded-xl border text-center font-medium transition-colors",
                  answers[question.id] === opt
                    ? "border-olive bg-olive-light text-charcoal"
                    : "border-border bg-white hover:bg-parchment text-charcoal",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Short answer */}
        {question.questionType === "short_answer" && (
          <input
            type="text"
            value={answers[question.id] ?? ""}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="input-base"
          />
        )}
      </div>

      {/* Next / Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!answers[question.id]}
          className={cn(
            "btn-primary",
            !answers[question.id] && "opacity-50 cursor-not-allowed",
          )}
        >
          {isLast ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
