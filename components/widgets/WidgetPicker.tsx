"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { WidgetDefinition } from "@/lib/widget-config";

interface WidgetPickerProps {
  available: WidgetDefinition[];
  onSelect: (widgetId: string) => void;
  onClose: () => void;
}

export default function WidgetPicker({
  available,
  onSelect,
  onClose,
}: WidgetPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-20 flex items-center justify-center bg-charcoal/10 rounded-2xl backdrop-blur-[2px]"
    >
      <div className="bg-white rounded-xl shadow-card-hover border border-border p-4 w-64 max-h-[80%] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif font-semibold text-sm text-charcoal">
            Choose Widget
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-charcoal transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        {available.length === 0 ? (
          <p className="text-xs text-muted text-center py-4">
            No widgets available for this slot
          </p>
        ) : (
          <div className="space-y-1">
            {available.map((w) => (
              <button
                key={w.id}
                onClick={() => onSelect(w.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-parchment transition-colors group"
              >
                <p className="text-sm font-semibold text-charcoal group-hover:text-olive transition-colors">
                  {w.name}
                </p>
                <p className="text-xs text-muted">{w.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
