"use client";

import { Search, Bell, Moon, Sun, Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useThemeStore } from "@/lib/store/theme";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [query, setQuery] = useState("");
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    const stored = localStorage.getItem("loci-theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, [setTheme]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "l") {
        e.preventDefault();
        toggleTheme();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  return (
    <header className="sticky top-0 z-20 bg-parchment/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-muted hover:text-charcoal hover:bg-parchment-dark transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search archive..."
              className="w-full pl-9 pr-16 py-2 rounded-full border border-border bg-white/60 text-sm
                         placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-olive/30
                         focus:border-olive transition-colors"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 text-[10px] text-muted font-medium bg-parchment-dark px-1.5 py-0.5 rounded">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-end gap-1">
          <button className="p-2 rounded-lg text-muted hover:text-charcoal hover:bg-parchment-dark transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-olive rounded-full" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted hover:text-charcoal hover:bg-parchment-dark transition-colors"
            title="Toggle dark mode (⌘⇧L)"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="p-2 rounded-lg text-muted hover:text-charcoal hover:bg-parchment-dark transition-colors">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
