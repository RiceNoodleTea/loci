export type WidgetSize = "small" | "medium" | "large";
export type SlotId = "row1-left" | "row1-right" | "row2-left" | "row2-right";

export const SLOT_SIZE_MAP: Record<SlotId, WidgetSize> = {
  "row1-left": "medium",
  "row1-right": "medium",
  "row2-left": "large",
  "row2-right": "small",
};

export const SLOT_IDS: SlotId[] = [
  "row1-left",
  "row1-right",
  "row2-left",
  "row2-right",
];

export interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  availableSizes: WidgetSize[];
}

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  {
    id: "study-timer",
    name: "Study Timer",
    description: "Clock and Pomodoro timer",
    availableSizes: ["small", "medium"],
  },
  {
    id: "upcoming-assessments",
    name: "Upcoming Assessments",
    description: "Upcoming exams and due dates",
    availableSizes: ["small", "medium", "large"],
  },
  {
    id: "assessment-calendar",
    name: "Assessment Calendar",
    description: "Calendar view of assessments",
    availableSizes: ["small", "medium", "large"],
  },
  {
    id: "daily-ledger",
    name: "Daily Ledger",
    description: "Daily to-do checklist",
    availableSizes: ["small", "medium", "large"],
  },
  {
    id: "study-stats",
    name: "Study Stats",
    description: "Study time and streak metrics",
    availableSizes: ["small", "medium", "large"],
  },
  {
    id: "recent-notes",
    name: "Recent Notes",
    description: "Recently edited notes",
    availableSizes: ["small", "medium", "large"],
  },
  {
    id: "study-group",
    name: "Study Group",
    description: "Groups, leaderboard, and lab progress",
    availableSizes: ["small", "medium", "large"],
  },
];

export type WidgetLayout = Record<SlotId, string | null>;

export const DEFAULT_LAYOUT: WidgetLayout = {
  "row1-left": "study-timer",
  "row1-right": "upcoming-assessments",
  "row2-left": "assessment-calendar",
  "row2-right": "daily-ledger",
};

const STORAGE_KEY = "loci-widget-layout";

export function loadLayout(): WidgetLayout {
  if (typeof window === "undefined") return DEFAULT_LAYOUT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as WidgetLayout;
  } catch {
    // ignore
  }
  return DEFAULT_LAYOUT;
}

export function saveLayout(layout: WidgetLayout) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // ignore
  }
}

export function getAvailableWidgets(
  layout: WidgetLayout,
  slotId: SlotId
): WidgetDefinition[] {
  const slotSize = SLOT_SIZE_MAP[slotId];
  const usedIds = new Set(Object.values(layout).filter(Boolean));
  return WIDGET_REGISTRY.filter(
    (w) => !usedIds.has(w.id) && w.availableSizes.includes(slotSize)
  );
}

export function getWidgetDef(id: string): WidgetDefinition | undefined {
  return WIDGET_REGISTRY.find((w) => w.id === id);
}
