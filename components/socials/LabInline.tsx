"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import {
  Atom,
  CircleDot,
  Zap,
  BookOpen,
} from "lucide-react";
import type { ParticleInventory } from "@/lib/particles/types";
import type { NucleusResult } from "@/lib/particles/nuclei";

const NucleiBuilder = dynamic(
  () => import("@/components/particles/NucleiBuilder"),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl bg-[#1a1a2e] flex items-center justify-center h-[360px]">
        <div className="text-center">
          <Atom
            size={28}
            className="text-[#8B9A6B] mx-auto mb-2 animate-spin"
          />
          <p className="text-xs text-[#F5F1EB]/60">Loading 3D viewer...</p>
        </div>
      </div>
    ),
  }
);

const PARTICLE_RULES = [
  {
    key: "quarks",
    label: "Up / Down Quarks",
    icon: CircleDot,
    color: "bg-red-500",
    rule: "1 hour studied = 1 quark to claim",
    progress: 3,
    max: 5,
    unit: "hours this week",
  },
  {
    key: "nucleons",
    label: "Protons & Neutrons",
    icon: Atom,
    color: "bg-orange-400",
    rule: "All members complete a quiz/flashcard set (min 5)",
    progress: 2,
    max: 3,
    unit: "members completed",
  },
  {
    key: "electrons",
    label: "Electrons",
    icon: Zap,
    color: "bg-yellow-400",
    rule: "30 min with ≥ half the group in a study room",
    progress: 18,
    max: 30,
    unit: "min accumulated",
  },
];

const INVENTORY_ITEMS = [
  { key: "upQuarks" as const, label: "Up", color: "bg-red-500" },
  { key: "downQuarks" as const, label: "Down", color: "bg-blue-500" },
  { key: "protons" as const, label: "p+", color: "bg-orange-400" },
  { key: "neutrons" as const, label: "n", color: "bg-gray-400" },
  { key: "electrons" as const, label: "e-", color: "bg-yellow-400" },
];

export default function LabInline() {
  const [inventory, setInventory] = useState<ParticleInventory>({
    upQuarks: 12,
    downQuarks: 8,
    protons: 4,
    neutrons: 3,
    electrons: 5,
  });

  const [builtAtoms, setBuiltAtoms] = useState<string[]>([]);

  function handleAtomBuilt(result: NucleusResult) {
    if (result.valid && result.element) {
      setBuiltAtoms((prev) => [...prev, result.element!.symbol]);
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top row: Particle Progress + Inventory */}
      <div className="flex gap-3 mb-3 shrink-0">
        {/* Particle Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen size={13} className="text-olive" />
            <h4 className="text-xs font-semibold text-charcoal">
              How to Earn
            </h4>
          </div>
          <div className="space-y-1.5">
            {PARTICLE_RULES.map((rule) => {
              const Icon = rule.icon;
              const pct = Math.min(
                100,
                Math.round((rule.progress / rule.max) * 100)
              );
              return (
                <div
                  key={rule.key}
                  className="flex items-center gap-2 p-2 rounded-lg bg-parchment/50 border border-border"
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                      rule.color
                    )}
                  >
                    <Icon size={12} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-charcoal truncate">
                      {rule.label}
                    </p>
                    <p className="text-[9px] text-muted truncate">
                      {rule.rule}
                    </p>
                  </div>
                  <div className="w-16 shrink-0">
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-olive rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[8px] text-muted text-right mt-0.5">
                      {rule.progress}/{rule.max}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory badges */}
        <div className="w-36 shrink-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Atom size={13} className="text-olive" />
            <h4 className="text-xs font-semibold text-charcoal">Inventory</h4>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {INVENTORY_ITEMS.map(({ key, label, color }) => (
              <div
                key={key}
                className="flex items-center gap-1.5 p-1.5 rounded-lg bg-parchment/50 border border-border"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                    color
                  )}
                >
                  <span className="text-[7px] font-bold text-white">
                    {label}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-charcoal tabular-nums">
                  {inventory[key]}
                </span>
              </div>
            ))}
          </div>
          {builtAtoms.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-[9px] text-muted mb-1">Built this session</p>
              <div className="flex flex-wrap gap-1">
                {builtAtoms.map((sym, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded text-[10px] font-serif font-bold bg-olive/10 text-olive"
                  >
                    {sym}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nuclei Builder (main) */}
      <div className="flex-1 min-h-0">
        <NucleiBuilder
          inventory={inventory}
          onInventoryChange={setInventory}
          onAtomBuilt={handleAtomBuilt}
        />
      </div>
    </div>
  );
}
