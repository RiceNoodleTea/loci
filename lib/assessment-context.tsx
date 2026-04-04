"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface Assessment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  location: string;
  weighting: string;
  notes: string;
  priority: "high" | "medium" | "low";
}

interface AssessmentContextValue {
  assessments: Assessment[];
  addAssessment: (a: Omit<Assessment, "id">) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  removeAssessment: (id: string) => void;
  selectedAssessment: Assessment | null;
  setSelectedAssessment: (a: Assessment | null) => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: "1",
    title: "Classical Mechanics Final",
    subject: "Physics",
    dueDate: new Date(Date.now() + 3 * 86_400_000).toISOString(),
    location: "Hall B, Room 204",
    weighting: "40%",
    notes: "Covers chapters 5-12. Bring calculator.",
    priority: "high",
  },
  {
    id: "2",
    title: "Literary Analysis Essay",
    subject: "English Literature",
    dueDate: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    location: "Online Submission",
    weighting: "25%",
    notes: "1500 words minimum. MLA format.",
    priority: "medium",
  },
  {
    id: "3",
    title: "Organic Chemistry Quiz",
    subject: "Chemistry",
    dueDate: new Date(Date.now() + 12 * 86_400_000).toISOString(),
    location: "Lab 3A",
    weighting: "10%",
    notes: "Focus on reaction mechanisms.",
    priority: "low",
  },
];

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [assessments, setAssessments] = useState<Assessment[]>(MOCK_ASSESSMENTS);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const addAssessment = useCallback((a: Omit<Assessment, "id">) => {
    setAssessments((prev) => [
      ...prev,
      { ...a, id: Date.now().toString() },
    ]);
  }, []);

  const updateAssessment = useCallback(
    (id: string, updates: Partial<Assessment>) => {
      setAssessments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
    },
    []
  );

  const removeAssessment = useCallback((id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        assessments,
        addAssessment,
        updateAssessment,
        removeAssessment,
        selectedAssessment,
        setSelectedAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessments() {
  const ctx = useContext(AssessmentContext);
  if (!ctx)
    throw new Error("useAssessments must be used within AssessmentProvider");
  return ctx;
}
