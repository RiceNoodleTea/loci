"use client";

import { useState } from "react";
import { Plus, X, ChevronLeft } from "lucide-react";
import { cn, daysUntil } from "@/lib/utils";
import { useAssessments, type Assessment } from "@/lib/assessment-context";
import type { WidgetSize } from "@/lib/widget-config";

interface UpcomingAssessmentsProps {
  size: WidgetSize;
}

const BORDER_COLORS: Record<Assessment["priority"], string> = {
  high: "border-l-red-500",
  medium: "border-l-olive",
  low: "border-l-border",
};

const PRIORITY_BADGE: Record<Assessment["priority"], string> = {
  high: "bg-red-50 text-red-600",
  medium: "bg-olive-light text-olive-hover",
  low: "bg-parchment-dark text-muted",
};

function AssessmentRow({
  a,
  size,
  onClick,
}: {
  a: Assessment;
  size: WidgetSize;
  onClick: () => void;
}) {
  const remaining = daysUntil(a.dueDate);
  const dateObj = new Date(a.dueDate);
  const dateStr = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left border-l-[3px] rounded-lg bg-parchment/60 px-3 py-2 flex items-start justify-between gap-2 hover:bg-parchment transition-colors",
        BORDER_COLORS[a.priority]
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="font-serif font-semibold text-sm text-charcoal truncate">
          {a.title}
        </p>
        <p className="text-xs text-muted mt-0.5 truncate">
          {dateStr}
          {" · "}
          {remaining > 0
            ? `${remaining}d left`
            : remaining === 0
            ? "Today"
            : "Past"}
          {a.location && ` · ${a.location}`}
          {size !== "small" && a.subject && ` · ${a.subject}`}
          {size === "large" && a.weighting && ` · ${a.weighting}`}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 text-[10px] font-semibold rounded px-1.5 py-0.5 leading-tight mt-0.5",
          PRIORITY_BADGE[a.priority]
        )}
      >
        {a.priority}
      </span>
    </button>
  );
}

function AssessmentDetail({
  a,
  onClose,
}: {
  a: Assessment;
  onClose: () => void;
}) {
  const dateObj = new Date(a.dueDate);
  const remaining = daysUntil(a.dueDate);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <button
        onClick={onClose}
        className="flex items-center gap-1 text-sm text-muted hover:text-charcoal transition-colors mb-2 self-start shrink-0"
      >
        <ChevronLeft size={14} />
        Back
      </button>
      <h3 className="font-serif font-bold text-base text-charcoal mb-1 shrink-0">
        {a.title}
      </h3>
      <div className="space-y-1.5 text-sm flex-1 overflow-y-auto min-h-0">
        <DetailRow label="Date">
          {dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </DetailRow>
        <DetailRow label="Time Until">
          {remaining > 0
            ? `${remaining} day${remaining !== 1 ? "s" : ""}`
            : remaining === 0
            ? "Today"
            : "Past due"}
        </DetailRow>
        {a.location && <DetailRow label="Location">{a.location}</DetailRow>}
        {a.subject && <DetailRow label="Subject">{a.subject}</DetailRow>}
        {a.weighting && <DetailRow label="Weight">{a.weighting}</DetailRow>}
        {a.notes && (
          <div className="pt-1.5 border-t border-border">
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-0.5">
              Notes
            </p>
            <p className="text-charcoal text-xs whitespace-pre-wrap">{a.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-muted w-16 shrink-0">{label}</span>
      <span className="text-charcoal">{children}</span>
    </div>
  );
}

function CreateForm({ onClose }: { onClose: () => void }) {
  const { addAssessment } = useAssessments();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [location, setLocation] = useState("");
  const [weighting, setWeighting] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Assessment["priority"]>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    addAssessment({
      title: title.trim(),
      subject,
      dueDate: new Date(dueDate).toISOString(),
      location,
      weighting,
      notes,
      priority,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h3 className="font-serif font-semibold text-sm text-charcoal">
          New Assessment
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-charcoal"
        >
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 space-y-1.5 overflow-y-auto min-h-0">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Assessment name *"
          className="input-base w-full text-xs"
          required
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input-base w-full text-xs"
          required
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="input-base w-full text-xs"
        />
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="input-base w-full text-xs"
        />
        <input
          value={weighting}
          onChange={(e) => setWeighting(e.target.value)}
          placeholder="Weighting (e.g. 30%)"
          className="input-base w-full text-xs"
        />
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as Assessment["priority"])
          }
          className="input-base w-full text-xs"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          rows={2}
          className="input-base w-full text-xs resize-none"
        />
      </div>
      <button type="submit" className="btn-primary text-xs mt-2 w-full shrink-0">
        Add Assessment
      </button>
    </form>
  );
}

export default function UpcomingAssessments({ size }: UpcomingAssessmentsProps) {
  const { assessments, selectedAssessment, setSelectedAssessment } =
    useAssessments();
  const [showCreate, setShowCreate] = useState(false);

  if (selectedAssessment) {
    return (
      <div className="card h-full">
        <AssessmentDetail
          a={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
        />
      </div>
    );
  }

  if (showCreate) {
    return (
      <div className="card h-full">
        <CreateForm onClose={() => setShowCreate(false)} />
      </div>
    );
  }

  const sorted = [...assessments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h2 className="text-sm font-serif font-semibold text-charcoal">
          Upcoming Assessments
        </h2>
        <div className="flex items-center gap-2">
          <span className="bg-olive text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {assessments.length}
          </span>
          <button
            onClick={() => setShowCreate(true)}
            className="text-olive hover:text-olive-hover transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto min-h-0">
        {sorted.map((a) => (
          <AssessmentRow
            key={a.id}
            a={a}
            size={size}
            onClick={() => setSelectedAssessment(a)}
          />
        ))}
        {sorted.length === 0 && (
          <p className="text-xs text-muted text-center py-4">
            No upcoming assessments
          </p>
        )}
      </div>
    </div>
  );
}
