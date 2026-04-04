"use client";

import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import type { WidgetSize } from "@/lib/widget-config";

interface RecentNotesProps {
  size: WidgetSize;
}

interface NotePreview {
  id: string;
  title: string;
  updatedAt: string;
  preview: string;
  folder?: string;
}

const MOCK_NOTES: NotePreview[] = [
  {
    id: "n1",
    title: "Newtonian Mechanics Summary",
    updatedAt: new Date(Date.now() - 30 * 60_000).toISOString(),
    preview:
      "Newton's first law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by...",
    folder: "Physics",
  },
  {
    id: "n2",
    title: "Hamlet Act 3 Analysis",
    updatedAt: new Date(Date.now() - 3 * 3_600_000).toISOString(),
    preview:
      "The 'To be or not to be' soliloquy reflects Hamlet's internal conflict between action and inaction, raising existential...",
    folder: "English",
  },
  {
    id: "n3",
    title: "Organic Reaction Mechanisms",
    updatedAt: new Date(Date.now() - 8 * 3_600_000).toISOString(),
    preview:
      "SN1 vs SN2: SN1 reactions proceed via a carbocation intermediate and are favored by tertiary substrates...",
    folder: "Chemistry",
  },
  {
    id: "n4",
    title: "Integration Techniques",
    updatedAt: new Date(Date.now() - 24 * 3_600_000).toISOString(),
    preview: "Integration by parts: ∫u dv = uv - ∫v du. Choose u using LIATE...",
    folder: "Maths",
  },
];

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function RecentNotes({ size }: RecentNotesProps) {
  const maxItems = size === "small" ? 4 : size === "medium" ? 4 : 5;
  const notes = MOCK_NOTES.slice(0, maxItems);

  const navigate = (id: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `/notes/${id}`;
    }
  };

  if (size === "small") {
    return (
      <div className="card flex flex-col h-full">
        <h2 className="text-sm font-serif font-semibold text-charcoal mb-2">
          Recent Notes
        </h2>
        <div className="flex-1 space-y-1 overflow-hidden">
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => navigate(n.id)}
              className="w-full text-left flex items-center gap-2 px-1.5 py-1.5 rounded hover:bg-parchment/60 transition-colors"
            >
              <FileText size={13} className="text-muted shrink-0" />
              <span className="text-xs text-charcoal truncate">{n.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (size === "large") {
    return (
      <div className="card flex flex-col h-full">
        <h2 className="text-base font-serif font-semibold text-charcoal mb-3">
          Recent Notes
        </h2>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => navigate(n.id)}
              className="w-full text-left bg-parchment/60 rounded-lg px-3 py-2.5 hover:bg-parchment transition-colors"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-serif font-semibold text-sm text-charcoal truncate">
                  {n.title}
                </span>
                <span className="text-[10px] text-muted shrink-0 ml-2">
                  {relativeTime(n.updatedAt)}
                </span>
              </div>
              <p className="text-xs text-muted line-clamp-2">{n.preview}</p>
              {n.folder && (
                <span className="inline-block mt-1 text-[10px] text-muted bg-parchment-dark rounded px-1.5 py-0.5">
                  {n.folder}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Medium
  return (
    <div className="card flex flex-col h-full">
      <h2 className="text-base font-serif font-semibold text-charcoal mb-3">
        Recent Notes
      </h2>
      <div className="flex-1 space-y-1.5 overflow-y-auto">
        {notes.map((n) => (
          <button
            key={n.id}
            onClick={() => navigate(n.id)}
            className="w-full text-left flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-parchment/60 transition-colors"
          >
            <FileText size={15} className="text-muted shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-semibold text-charcoal truncate">
                  {n.title}
                </span>
                <span className="text-[10px] text-muted shrink-0 ml-2">
                  {relativeTime(n.updatedAt)}
                </span>
              </div>
              <p className="text-xs text-muted truncate mt-0.5">{n.preview}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
