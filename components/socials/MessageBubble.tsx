"use client";

import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  userName: string;
  content: string;
  createdAt: string;
  isOwn: boolean;
}

function formatTimestamp(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function MessageBubble({
  userName,
  content,
  createdAt,
  isOwn,
}: MessageBubbleProps) {
  return (
    <div
      className={cn("flex gap-2.5 max-w-[75%]", isOwn ? "ml-auto flex-row-reverse" : "")}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
          isOwn
            ? "bg-olive text-white"
            : "bg-parchment-dark text-charcoal"
        )}
      >
        {userName.charAt(0).toUpperCase()}
      </div>

      <div className={cn("min-w-0", isOwn ? "text-right" : "")}>
        <div
          className={cn(
            "flex items-baseline gap-2 mb-1",
            isOwn ? "justify-end flex-row-reverse" : ""
          )}
        >
          <span className="text-xs font-semibold text-charcoal">
            {isOwn ? "You" : userName}
          </span>
          <span className="text-[10px] text-muted">
            {formatTimestamp(createdAt)}
          </span>
        </div>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
            isOwn
              ? "bg-olive-light text-charcoal rounded-tr-sm"
              : "bg-white text-charcoal rounded-tl-sm shadow-card"
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
