"use client";

import { Atom, CircleDot, Minus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParticleInventory as ParticleInventoryType } from "@/lib/particles/types";

interface ParticleInventoryProps {
  inventory: ParticleInventoryType;
}

const PARTICLE_CONFIG = [
  { key: "upQuarks" as const, label: "Up Quarks", color: "bg-red-500", icon: CircleDot },
  { key: "downQuarks" as const, label: "Down Quarks", color: "bg-blue-500", icon: CircleDot },
  { key: "protons" as const, label: "Protons", color: "bg-orange-400", icon: Atom },
  { key: "neutrons" as const, label: "Neutrons", color: "bg-gray-400", icon: Atom },
  { key: "electrons" as const, label: "Electrons", color: "bg-yellow-400", icon: Zap },
] as const;

export default function ParticleInventory({ inventory }: ParticleInventoryProps) {
  const total =
    inventory.upQuarks +
    inventory.downQuarks +
    inventory.protons +
    inventory.neutrons +
    inventory.electrons;

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Atom size={18} className="text-olive" />
        <h3 className="font-serif font-bold text-charcoal text-base">
          Particle Inventory
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {PARTICLE_CONFIG.map(({ key, label, color, icon: Icon }) => (
          <div
            key={key}
            className={cn(
              "bg-white rounded-xl p-3 flex flex-col items-center gap-2",
              "border border-border shadow-card"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                color
              )}
            >
              <Icon size={14} className="text-white" />
            </div>
            <span className="text-xs text-muted text-center leading-tight">
              {label}
            </span>
            <span className="text-2xl font-serif font-bold text-charcoal tabular-nums">
              {inventory[key]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted flex items-center gap-1.5">
          <Minus size={14} />
          Total Particles
        </span>
        <span className="font-serif font-bold text-charcoal text-lg tabular-nums">
          {total}
        </span>
      </div>
    </div>
  );
}
