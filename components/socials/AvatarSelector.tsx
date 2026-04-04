"use client";

import { cn } from "@/lib/utils";
import { AVATAR_OPTIONS } from "@/lib/avatar-icons";

interface AvatarSelectorProps {
  selected: string | null;
  onSelect: (key: string) => void;
}

export default function AvatarSelector({
  selected,
  onSelect,
}: AvatarSelectorProps) {
  return (
    <div>
      <p className="text-xs font-medium text-muted mb-2">Choose your avatar</p>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {AVATAR_OPTIONS.map(({ key, label, icon: Icon }) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              title={label}
              className={cn(
                "flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all",
                isSelected
                  ? "border-olive bg-olive/10 shadow-card"
                  : "border-transparent bg-parchment hover:border-olive/30"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-olive text-white"
                    : "bg-parchment-dark text-charcoal"
                )}
              >
                <Icon size={18} />
              </div>
              <span className="text-[10px] text-muted">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
