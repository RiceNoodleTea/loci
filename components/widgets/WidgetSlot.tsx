"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type SlotId,
  type WidgetSize,
  SLOT_SIZE_MAP,
  getAvailableWidgets,
  type WidgetLayout,
} from "@/lib/widget-config";
import WidgetPicker from "./WidgetPicker";
import StudyTimer from "./StudyTimer";
import UpcomingAssessments from "./UpcomingAssessments";
import AssessmentCalendar from "./AssessmentCalendar";
import DailyLedger from "./DailyLedger";
import StudyStats from "./StudyStats";
import RecentNotes from "./RecentNotes";
import StudyGroup from "./StudyGroup";

function renderWidget(widgetId: string, size: WidgetSize) {
  switch (widgetId) {
    case "study-timer":
      return <StudyTimer size={size} />;
    case "upcoming-assessments":
      return <UpcomingAssessments size={size} />;
    case "assessment-calendar":
      return <AssessmentCalendar size={size} />;
    case "daily-ledger":
      return <DailyLedger size={size} />;
    case "study-stats":
      return <StudyStats size={size} />;
    case "recent-notes":
      return <RecentNotes size={size} />;
    case "study-group":
      return <StudyGroup size={size} />;
    default:
      return null;
  }
}

interface WidgetSlotProps {
  slotId: SlotId;
  layout: WidgetLayout;
  isCustomizing: boolean;
  onRemove: (slotId: SlotId) => void;
  onAdd: (slotId: SlotId, widgetId: string) => void;
}

export default function WidgetSlot({
  slotId,
  layout,
  isCustomizing,
  onRemove,
  onAdd,
}: WidgetSlotProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const widgetId = layout[slotId];
  const size = SLOT_SIZE_MAP[slotId];

  if (!widgetId) {
    return (
      <div className="relative h-full">
        <div className="card h-full flex items-center justify-center border-2 border-dashed border-border">
          {isCustomizing ? (
            <button
              onClick={() => setPickerOpen(true)}
              className="flex flex-col items-center gap-2 text-muted hover:text-olive transition-colors"
            >
              <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center">
                <Plus size={20} />
              </div>
              <span className="text-xs font-medium">Add Widget</span>
            </button>
          ) : (
            <p className="text-sm text-muted">Empty Slot</p>
          )}
        </div>
        {pickerOpen && (
          <WidgetPicker
            available={getAvailableWidgets(layout, slotId)}
            onSelect={(id) => {
              onAdd(slotId, id);
              setPickerOpen(false);
            }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {renderWidget(widgetId, size)}
      {isCustomizing && (
        <button
          onClick={() => onRemove(slotId)}
          className={cn(
            "absolute bottom-3 right-3 z-10",
            "w-8 h-8 rounded-full bg-red-500 text-white shadow-lg",
            "flex items-center justify-center",
            "hover:bg-red-600 transition-colors",
            "animate-fade-in"
          )}
          aria-label="Remove widget"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
