"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Plus, Search, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

const mockNotes = [
  {
    id: "1",
    title: "Philosophy of Mind",
    preview:
      "Exploring consciousness, intentionality, and the mind-body problem through historical and contemporary lenses...",
    updatedAt: "2026-04-01T10:30:00Z",
  },
  {
    id: "2",
    title: "Research Methodology Notes",
    preview:
      "Qualitative vs quantitative approaches. Mixed methods design considerations for the upcoming thesis...",
    updatedAt: "2026-03-28T14:15:00Z",
  },
  {
    id: "3",
    title: "Lecture: Ancient Greek Ethics",
    preview:
      "Aristotle's Nicomachean Ethics — virtue as a mean between extremes. Eudaimonia and the good life...",
    updatedAt: "2026-03-25T09:00:00Z",
  },
  {
    id: "4",
    title: "Reading List — Spring 2026",
    preview:
      "Kant's Critique of Pure Reason, Heidegger's Being and Time, Wittgenstein's Philosophical Investigations...",
    updatedAt: "2026-03-20T16:45:00Z",
  },
  {
    id: "5",
    title: "Thesis Outline Draft",
    preview:
      "Chapter 1: Introduction and problem statement. Chapter 2: Literature review. Chapter 3: Methodology...",
    updatedAt: "2026-03-15T11:20:00Z",
  },
  {
    id: "6",
    title: "Seminar Discussion Notes",
    preview:
      "Key points from today's seminar on phenomenology. Husserl's notion of intentionality revisited...",
    updatedAt: "2026-03-10T13:30:00Z",
  },
];

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = mockNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif text-charcoal">Notes</h1>
        <NextLink
          href="/notes/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Note
        </NextLink>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-base pl-10"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-12 h-12 text-muted/40 mb-4" />
          <p className="text-muted text-sm">No notes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NextLink key={note.id} href={`/notes/${note.id}`}>
              <div className="card-hover group cursor-pointer h-full flex flex-col">
                <h3 className="font-serif text-lg text-charcoal mb-2 group-hover:text-olive transition-colors line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-sm text-muted line-clamp-3 flex-1">
                  {note.preview}
                </p>
                <p className="text-xs text-muted/60 mt-3 pt-3 border-t border-border">
                  {formatDate(note.updatedAt)}
                </p>
              </div>
            </NextLink>
          ))}
        </div>
      )}
    </div>
  );
}
