"use client";

import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isActive: boolean;
  onClick?: () => void;
}

export default function GroupCard({
  name,
  description,
  memberCount,
  isActive,
  onClick,
}: GroupCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn("card-hover text-left w-full cursor-pointer")}
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-olive flex items-center justify-center text-white font-serif font-bold text-lg shrink-0">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-charcoal text-base mb-1">
            {name}
          </h3>
          <p className="text-sm text-muted line-clamp-2 mb-3">{description}</p>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Users size={14} />
              {memberCount} members
            </span>

            {isActive ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-olive bg-olive-light px-3 py-1 rounded-full">
                Joined
              </span>
            ) : (
              <span className="btn-primary text-xs px-3 py-1">Enter</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
