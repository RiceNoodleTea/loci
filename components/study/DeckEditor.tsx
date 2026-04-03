"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface CardEntry {
  front: string;
  back: string;
}

interface DeckData {
  title: string;
  description: string;
  cards: CardEntry[];
}

interface DeckEditorProps {
  initialDeck?: DeckData;
  onSave: (deck: DeckData) => void;
}

export default function DeckEditor({ initialDeck, onSave }: DeckEditorProps) {
  const [title, setTitle] = useState(initialDeck?.title ?? "");
  const [description, setDescription] = useState(
    initialDeck?.description ?? "",
  );
  const [cards, setCards] = useState<CardEntry[]>(
    initialDeck?.cards ?? [{ front: "", back: "" }],
  );

  function updateCard(index: number, field: "front" | "back", value: string) {
    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    );
  }

  function removeCard(index: number) {
    setCards((prev) => prev.filter((_, i) => i !== index));
  }

  function addCard() {
    setCards((prev) => [...prev, { front: "", back: "" }]);
  }

  function handleSave() {
    onSave({ title, description, cards });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Deck Title"
            className="w-full text-2xl font-serif font-bold text-charcoal bg-transparent border-none outline-none placeholder:text-muted/50"
          />
        </div>
        <button onClick={handleSave} className="btn-primary shrink-0">
          Save Deck
        </button>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description..."
        rows={2}
        className="input-base resize-none"
      />

      <div className="space-y-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className={cn(
              "card flex items-start gap-3",
            )}
          >
            <span className="label-caps mt-3 shrink-0 w-6 text-center">
              {index + 1}
            </span>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input
                type="text"
                value={card.front}
                onChange={(e) => updateCard(index, "front", e.target.value)}
                placeholder="Front (term)"
                className="input-base"
              />
              <input
                type="text"
                value={card.back}
                onChange={(e) => updateCard(index, "back", e.target.value)}
                placeholder="Back (definition)"
                className="input-base"
              />
            </div>
            <button
              onClick={() => removeCard(index)}
              className="btn-ghost text-muted hover:text-red-500 mt-1.5"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addCard}
        className="btn-secondary flex items-center gap-2 w-full justify-center"
      >
        <Plus size={16} />
        Add Card
      </button>
    </div>
  );
}
