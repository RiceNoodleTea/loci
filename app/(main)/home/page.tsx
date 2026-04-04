"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Check } from "lucide-react";
import HeroBanner from "@/components/widgets/HeroBanner";
import WidgetSlot from "@/components/widgets/WidgetSlot";
import { AssessmentProvider } from "@/lib/assessment-context";
import {
  type SlotId,
  type WidgetLayout,
  DEFAULT_LAYOUT,
  loadLayout,
  saveLayout,
} from "@/lib/widget-config";

export default function DashboardPage() {
  const [layout, setLayout] = useState<WidgetLayout>(DEFAULT_LAYOUT);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLayout(loadLayout());
    setMounted(true);
  }, []);

  const updateLayout = useCallback((next: WidgetLayout) => {
    setLayout(next);
    saveLayout(next);
  }, []);

  const handleRemove = useCallback(
    (slotId: SlotId) => {
      updateLayout({ ...layout, [slotId]: null });
    },
    [layout, updateLayout]
  );

  const handleAdd = useCallback(
    (slotId: SlotId, widgetId: string) => {
      updateLayout({ ...layout, [slotId]: widgetId });
    },
    [layout, updateLayout]
  );

  if (!mounted) return null;

  return (
    <AssessmentProvider>
      <div className="flex flex-col h-[calc(100vh-56px-2rem)] md:h-[calc(100vh-56px-3rem)] overflow-hidden">
        <div className="shrink-0">
          <HeroBanner userName="Scholar" />
        </div>

        <div className="flex-1 grid grid-rows-2 gap-4 mt-4 min-h-0">
          {/* Row 1: two 1/2 slots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
            <WidgetSlot
              slotId="row1-left"
              layout={layout}
              isCustomizing={isCustomizing}
              onRemove={handleRemove}
              onAdd={handleAdd}
            />
            <WidgetSlot
              slotId="row1-right"
              layout={layout}
              isCustomizing={isCustomizing}
              onRemove={handleRemove}
              onAdd={handleAdd}
            />
          </div>

          {/* Row 2: 2/3 + 1/3 slots */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
            <div className="lg:col-span-8">
              <WidgetSlot
                slotId="row2-left"
                layout={layout}
                isCustomizing={isCustomizing}
                onRemove={handleRemove}
                onAdd={handleAdd}
              />
            </div>
            <div className="lg:col-span-4">
              <WidgetSlot
                slotId="row2-right"
                layout={layout}
                isCustomizing={isCustomizing}
                onRemove={handleRemove}
                onAdd={handleAdd}
              />
            </div>
          </div>
        </div>

        {/* FAB: customize toggle */}
        <button
          onClick={() => setIsCustomizing((c) => !c)}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors z-50 ${
            isCustomizing
              ? "bg-olive text-white hover:bg-olive-hover"
              : "bg-charcoal text-white hover:bg-charcoal/90"
          }`}
          aria-label={isCustomizing ? "Done customizing" : "Customize widgets"}
        >
          {isCustomizing ? <Check size={20} /> : <Pencil size={20} />}
        </button>
      </div>
    </AssessmentProvider>
  );
}
