"use client";

import { useState, useRef, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  ChevronDown,
  Palette,
  Highlighter,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  editor: Editor;
}

const fontFamilies = [
  { label: "Sans", value: "DM Sans, system-ui, sans-serif" },
  { label: "Serif", value: "Playfair Display, Georgia, serif" },
  { label: "Mono", value: "JetBrains Mono, monospace" },
];

const fontSizes = [
  { label: "S", value: "0.875rem" },
  { label: "M", value: "1rem" },
  { label: "L", value: "1.25rem" },
];

const textColors = [
  "#2D2D2D",
  "#8B9A6B",
  "#B91C1C",
  "#1D4ED8",
  "#7C3AED",
  "#D97706",
  "#059669",
  "#DB2777",
  "#6B7280",
];

const highlightColors = [
  "#FEF08A",
  "#BBF7D0",
  "#BFDBFE",
  "#FED7AA",
  "#E9D5FF",
  "#FECDD3",
  "#D1FAE5",
  "#DBEAFE",
];

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded-md transition-colors",
        isActive
          ? "bg-olive text-white"
          : "text-charcoal hover:bg-parchment-dark",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

function Dropdown({
  trigger,
  children,
  isOpen,
  onToggle,
  onClose,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-charcoal hover:bg-parchment-dark transition-colors"
      >
        {trigger}
        <ChevronDown className="w-3 h-3" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-card-hover border border-border p-1.5 z-50 min-w-[140px]">
          {children}
        </div>
      )}
    </div>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-border mx-1" />;
}

export default function Toolbar({ editor }: ToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) =>
    setOpenDropdown((prev) => (prev === name ? null : name));
  const closeDropdown = () => setOpenDropdown(null);

  const currentFontFamily = fontFamilies.find((f) =>
    editor.isActive("textStyle", { fontFamily: f.value })
  );

  return (
    <div className="sticky top-0 z-10 flex items-center gap-0.5 flex-wrap bg-parchment border border-border rounded-xl px-2 py-1.5 mb-2 shadow-card">
      {/* Font Family */}
      <Dropdown
        trigger={
          <span className="flex items-center gap-1.5">
            <Type className="w-4 h-4" />
            <span className="text-xs font-medium">
              {currentFontFamily?.label || "Sans"}
            </span>
          </span>
        }
        isOpen={openDropdown === "font"}
        onToggle={() => toggleDropdown("font")}
        onClose={closeDropdown}
      >
        {fontFamilies.map((font) => (
          <button
            key={font.value}
            type="button"
            onClick={() => {
              editor.chain().focus().setFontFamily(font.value).run();
              closeDropdown();
            }}
            className={cn(
              "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
              editor.isActive("textStyle", { fontFamily: font.value })
                ? "bg-olive-light text-olive font-medium"
                : "hover:bg-parchment"
            )}
            style={{ fontFamily: font.value }}
          >
            {font.label}
          </button>
        ))}
      </Dropdown>

      <ToolbarDivider />

      {/* Font Size */}
      {fontSizes.map((size) => (
        <ToolbarButton
          key={size.label}
          onClick={() => editor.chain().focus().setFontSize(size.value).run()}
          isActive={editor.isActive("textStyle", { fontSize: size.value })}
          title={`Font size: ${size.label}`}
        >
          <span className="text-xs font-semibold w-5 h-5 flex items-center justify-center">
            {size.label}
          </span>
        </ToolbarButton>
      ))}

      <ToolbarDivider />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text Color */}
      <Dropdown
        trigger={
          <span className="flex items-center gap-1">
            <Palette className="w-4 h-4" />
          </span>
        }
        isOpen={openDropdown === "color"}
        onToggle={() => toggleDropdown("color")}
        onClose={closeDropdown}
      >
        <div className="grid grid-cols-5 gap-1 p-1">
          {textColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                editor.chain().focus().setColor(color).run();
                closeDropdown();
              }}
              className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().unsetColor().run();
              closeDropdown();
            }}
            className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform flex items-center justify-center text-[10px] text-muted"
            title="Remove color"
          >
            ✕
          </button>
        </div>
      </Dropdown>

      {/* Highlight Color */}
      <Dropdown
        trigger={
          <span className="flex items-center gap-1">
            <Highlighter className="w-4 h-4" />
          </span>
        }
        isOpen={openDropdown === "highlight"}
        onToggle={() => toggleDropdown("highlight")}
        onClose={closeDropdown}
      >
        <div className="grid grid-cols-4 gap-1 p-1">
          {highlightColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHighlight({ color }).run();
                closeDropdown();
              }}
              className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().unsetHighlight().run();
              closeDropdown();
            }}
            className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform flex items-center justify-center text-[10px] text-muted"
            title="Remove highlight"
          >
            ✕
          </button>
        </div>
      </Dropdown>

      <ToolbarDivider />

      {/* Text Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Align left"
      >
        <AlignLeft className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Align center"
      >
        <AlignCenter className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Align right"
      >
        <AlignRight className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo2 className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}
