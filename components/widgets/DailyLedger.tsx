"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WidgetSize } from "@/lib/widget-config";

interface LedgerItem {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
}

interface DailyLedgerProps {
  size: WidgetSize;
}

const INITIAL_ITEMS: LedgerItem[] = [
  { id: "1", text: "Review chapter 5 notes", completed: false, category: "Physics" },
  { id: "2", text: "Complete practice problems", completed: true, category: "Maths" },
  { id: "3", text: "Organise research materials", completed: false },
];

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <span className="relative flex-shrink-0 w-[16px] h-[16px]">
      <span
        className={cn(
          "absolute inset-0 rounded border-2 transition-colors",
          checked ? "bg-olive border-olive" : "border-border group-hover:border-olive/50"
        )}
      />
      {checked && (
        <svg
          className="absolute inset-0 w-full h-full text-white p-[2px]"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 6l3 3 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

export default function DailyLedger({ size }: DailyLedgerProps) {
  const [items, setItems] = useState<LedgerItem[]>(INITIAL_ITEMS);
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addItem = () => {
    const text = newText.trim();
    if (!text) return;
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), text, completed: false },
    ]);
    setNewText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addItem();
    if (e.key === "Escape") {
      setIsAdding(false);
      setNewText("");
    }
  };

  const openInput = () => {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const completed = items.filter((i) => i.completed).length;
  const maxVisible = size === "small" ? 4 : size === "medium" ? 6 : 8;
  const visibleItems = items.slice(0, maxVisible);

  if (size === "small") {
    return (
      <div className="card flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-serif font-semibold text-charcoal">
            Daily Ledger
          </h2>
          <span className="text-[10px] text-muted">
            {completed}/{items.length}
          </span>
        </div>
        <div className="flex-1 space-y-0.5 overflow-hidden">
          {visibleItems.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 px-1 py-1 rounded hover:bg-parchment/60 cursor-pointer group"
            >
              <CheckIcon checked={item.completed} />
              <span
                className={cn(
                  "text-xs truncate",
                  item.completed ? "line-through text-muted" : "text-charcoal"
                )}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggle(item.id)}
                  className="sr-only"
                />
                {item.text}
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={openInput}
          className="btn-ghost flex items-center gap-1 mt-1 text-xs self-start"
        >
          <Plus size={12} />
        </button>
        {isAdding && (
          <div className="flex gap-1 mt-1">
            <input
              ref={inputRef}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="New task…"
              className="input-base flex-1 text-xs py-1"
            />
          </div>
        )}
      </div>
    );
  }

  if (size === "large") {
    return (
      <div className="card flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-serif font-semibold text-charcoal">
            Daily Ledger
          </h2>
          <span className="text-xs text-muted">
            {completed}/{items.length} done
          </span>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-parchment/60 cursor-pointer group"
            >
              <CheckIcon checked={item.completed} />
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggle(item.id)}
                className="sr-only"
              />
              <span
                className={cn(
                  "font-serif text-sm flex-1",
                  item.completed ? "line-through text-muted" : "text-charcoal"
                )}
              >
                {item.text}
              </span>
              {item.category && (
                <span className="text-[10px] text-muted bg-parchment-dark rounded px-1.5 py-0.5 shrink-0">
                  {item.category}
                </span>
              )}
            </label>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            ref={inputRef}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsAdding(true)}
            placeholder="Add new task…"
            className="input-base flex-1 text-sm"
          />
          {newText.trim() && (
            <button onClick={addItem} className="btn-primary text-sm px-3">
              Add
            </button>
          )}
        </div>
      </div>
    );
  }

  // Medium (default, matches original)
  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-serif font-semibold text-charcoal">
          Daily Ledger
        </h2>
        <span className="text-xs text-muted">
          {completed}/{items.length} done
        </span>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-parchment/60 cursor-pointer group"
          >
            <CheckIcon checked={item.completed} />
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggle(item.id)}
              className="sr-only"
            />
            <span
              className={cn(
                "font-serif text-sm",
                item.completed ? "line-through text-muted" : "text-charcoal"
              )}
            >
              {item.text}
            </span>
          </label>
        ))}
      </div>
      {isAdding ? (
        <div className="flex gap-2 mt-3">
          <input
            ref={inputRef}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New task…"
            className="input-base flex-1 text-sm"
          />
          <button onClick={addItem} className="btn-primary text-sm px-3">
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={openInput}
          className="btn-ghost flex items-center gap-1.5 mt-3 text-sm self-start"
        >
          <Plus size={14} />
          Add task
        </button>
      )}
    </div>
  );
}
