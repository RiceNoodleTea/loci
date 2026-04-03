"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import type { JSONContent } from "@tiptap/core";
import Editor from "@/components/editor/Editor";

const mockContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Getting Started" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Welcome to your note. Start writing here, or use the toolbar above to format your text. Type '/' to access quick commands.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "Key features:",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Rich text formatting with the toolbar",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Slash commands for quick actions" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Auto-saving as you type" }],
            },
          ],
        },
      ],
    },
  ],
};

export default function NoteEditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState("Philosophy of Mind");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  const handleSave = useCallback((content: JSONContent) => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
    }, 500);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.push("/notes")}
          className="btn-ghost flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notes
        </button>

        <div className="flex items-center gap-2 text-sm text-muted">
          {saveStatus === "saving" ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5 text-olive" />
              <span>Saved</span>
            </>
          )}
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="w-full text-4xl font-serif text-charcoal bg-transparent border-none outline-none placeholder:text-muted/40 mb-6"
      />

      <Editor initialContent={mockContent} onSave={handleSave} />
    </div>
  );
}
