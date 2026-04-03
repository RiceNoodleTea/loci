"use client";

import HeroBanner from "@/components/widgets/HeroBanner";
import FocusSession from "@/components/widgets/FocusSession";
import UpcomingAssessments, {
  type Assessment,
} from "@/components/widgets/UpcomingAssessments";
import ArchivesCalendar, {
  type CalendarEvent,
} from "@/components/widgets/ArchivesCalendar";
import DailyLedger from "@/components/widgets/DailyLedger";
import { Pencil } from "lucide-react";

const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: "1",
    title: "Classical Mechanics Final",
    subject: "Physics",
    dueDate: new Date(Date.now() + 3 * 86_400_000).toISOString(),
    location: "Hall B, Room 204",
    priority: "high",
  },
  {
    id: "2",
    title: "Literary Analysis Essay",
    subject: "English Literature",
    dueDate: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    location: "Online Submission",
    priority: "medium",
  },
  {
    id: "3",
    title: "Organic Chemistry Quiz",
    subject: "Chemistry",
    dueDate: new Date(Date.now() + 12 * 86_400_000).toISOString(),
    location: "Lab 3A",
    priority: "low",
  },
];

const MOCK_EVENTS: CalendarEvent[] = [
  { date: new Date(Date.now() + 3 * 86_400_000).toISOString(), title: "Physics Final" },
  { date: new Date(Date.now() + 7 * 86_400_000).toISOString(), title: "Essay Due" },
  { date: new Date(Date.now() + 12 * 86_400_000).toISOString(), title: "Chem Quiz" },
  { date: new Date(Date.now() - 2 * 86_400_000).toISOString(), title: "Study Group" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <HeroBanner userName="Scholar" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FocusSession />
        <UpcomingAssessments assessments={MOCK_ASSESSMENTS} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <ArchivesCalendar events={MOCK_EVENTS} />
        </div>
        <div className="lg:col-span-5">
          <DailyLedger />
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-charcoal text-white shadow-lg flex items-center justify-center hover:bg-charcoal/90 transition-colors z-50"
        aria-label="Quick action"
      >
        <Pencil size={20} />
      </button>
    </div>
  );
}
