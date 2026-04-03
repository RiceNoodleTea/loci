"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LedgerItem {
  id: string;
  text: string;
  completed: boolean;
}

const INITIAL_ITEMS: LedgerItem[] = [
  { id: "1", text: "Review chapter 5 notes", completed: false },
  { id: "2", text: "Complete practice problems", completed: true },
  { id: "3", text: "Organise research materials", completed: false },
];

export default function DailyLedger() {
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

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-serif font-semibold text-charcoal">
          Daily Ledger
        </h2>
        <span className="text-xs text-muted">
          {completed}/{items.length} done
        </span>
      </div>

      <div className="flex-1 space-y-1">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-parchment/60 cursor-pointer transition-colors group"
          >
            <span className="relative flex-shrink-0 w-[18px] h-[18px]">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggle(item.id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "absolute inset-0 rounded border-2 transition-colors",
                  item.completed
                    ? "bg-olive border-olive"
                    : "border-border group-hover:border-olive/50"
                )}
              />
              {item.completed && (
                <svg
                  className="absolute inset-0 w-full h-full text-white p-[3px]"
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
            <span
              className={cn(
                "font-serif text-sm transition-colors",
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
          Add task to ledger
        </button>
      )}
    </div>
  );
}
