"use client";

import { BubbleMenu } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BubbleMenuBarProps {
  editor: Editor;
}

export default function BubbleMenuBar({ editor }: BubbleMenuBarProps) {
  const toggleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt("Enter URL:");
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  const buttonClass = (active: boolean) =>
    cn(
      "p-1.5 rounded-md transition-colors",
      active
        ? "bg-white/20 text-white"
        : "text-white/70 hover:text-white hover:bg-white/10"
    );

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 150 }}
      className="flex items-center gap-0.5 bg-charcoal rounded-lg p-1 shadow-lg"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive("underline"))}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-white/20 mx-0.5" />
      <button
        type="button"
        onClick={toggleLink}
        className={buttonClass(editor.isActive("link"))}
        title="Link"
      >
        <Link className="w-4 h-4" />
      </button>
    </BubbleMenu>
  );
}
