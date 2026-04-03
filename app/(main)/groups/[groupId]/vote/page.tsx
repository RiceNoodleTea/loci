"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Beaker, Package } from "lucide-react";
import { ELEMENTS } from "@/lib/particles/elements";
import { canBuildElement, getWeekStart } from "@/lib/particles/engine";
import ElementVoteSystem from "@/components/socials/ElementVoteSystem";
import CompetitionHistory from "@/components/socials/CompetitionHistory";
import type {
  Element,
  ElementVote,
  WeeklyCompetition,
  Molecule,
  ParticleInventory,
} from "@/lib/particles/types";

const MOCK_USER_ID = "user-current";

const MOCK_INVENTORY: ParticleInventory = {
  upQuarks: 14,
  downQuarks: 11,
  protons: 8,
  neutrons: 9,
  electrons: 7,
};

const VOTE_ELEMENTS: Element[] = ELEMENTS.filter((el) =>
  ["H", "He", "Li", "C", "N", "O", "B", "Be"].includes(el.symbol)
);

const weekStart = getWeekStart(new Date());

const MOCK_VOTES: ElementVote[] = [
  { userId: "user-1", elementSymbol: "C", votedAt: new Date().toISOString() },
  { userId: "user-2", elementSymbol: "O", votedAt: new Date().toISOString() },
  { userId: "user-3", elementSymbol: "C", votedAt: new Date().toISOString() },
  { userId: "user-4", elementSymbol: "N", votedAt: new Date().toISOString() },
  { userId: "user-5", elementSymbol: "H", votedAt: new Date().toISOString() },
];

function makeMolecule(
  formula: string,
  name: string,
  groupId: string,
  weeksAgo: number
): Molecule {
  const date = new Date();
  date.setDate(date.getDate() - weeksAgo * 7);
  return {
    id: crypto.randomUUID(),
    groupId,
    formula,
    name,
    atoms: [],
    builtAt: date.toISOString(),
  };
}

function pastWeekStart(weeksAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - weeksAgo * 7);
  return getWeekStart(d);
}

const MOCK_HISTORY: WeeklyCompetition[] = [
  {
    groupId: "group-1",
    weekStart: pastWeekStart(1),
    particlesEarned: 142,
    atomsBuilt: 5,
    bestMolecule: makeMolecule("H₂O", "Water", "group-1", 1),
  },
  {
    groupId: "group-1",
    weekStart: pastWeekStart(2),
    particlesEarned: 98,
    atomsBuilt: 3,
    bestMolecule: null,
  },
  {
    groupId: "group-1",
    weekStart: pastWeekStart(3),
    particlesEarned: 210,
    atomsBuilt: 8,
    bestMolecule: makeMolecule("CH₄", "Methane", "group-1", 3),
  },
];

function InventoryRow({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <div className={cn("w-2.5 h-2.5 rounded-full", color)} />
        <span className="text-sm text-charcoal">{label}</span>
      </div>
      <span className="text-sm font-semibold text-charcoal tabular-nums">
        {count}
      </span>
    </div>
  );
}

export default function VotePage() {
  const [votes, setVotes] = useState<ElementVote[]>(MOCK_VOTES);

  function handleVote(symbol: string) {
    setVotes((prev) => {
      const filtered = prev.filter((v) => v.userId !== MOCK_USER_ID);
      return [
        ...filtered,
        {
          userId: MOCK_USER_ID,
          elementSymbol: symbol,
          votedAt: new Date().toISOString(),
        },
      ];
    });
  }

  const affordable = VOTE_ELEMENTS.filter((el) =>
    canBuildElement(el, MOCK_INVENTORY)
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif font-bold text-2xl text-charcoal">
          Element Vote
        </h1>
        <p className="text-sm text-muted mt-1">
          Vote for the element your group will build this week
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6">
          <ElementVoteSystem
            elements={VOTE_ELEMENTS}
            currentVotes={votes}
            userId={MOCK_USER_ID}
            onVote={handleVote}
          />

          {/* Affordable Elements */}
          <div className="card">
            <div className="flex items-center gap-2.5 mb-4">
              <Beaker size={20} className="text-olive" />
              <h3 className="font-serif font-bold text-charcoal text-lg">
                Affordable Elements
              </h3>
            </div>

            {affordable.length > 0 ? (
              <>
                <p className="text-sm text-muted mb-4">
                  Your group can currently build these elements based on your
                  particle inventory.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {affordable.map((el) => (
                    <div
                      key={el.symbol}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-white hover:border-olive/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-olive-light flex items-center justify-center shrink-0">
                        <span className="font-serif font-bold text-charcoal text-lg">
                          {el.symbol}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-charcoal truncate">
                          {el.name}
                        </p>
                        <p className="text-[11px] text-muted">
                          {el.protons}p · {el.neutrons}n · {el.electrons}e
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted text-center py-6">
                Not enough particles to build any elements yet. Keep studying!
              </p>
            )}
          </div>

          <CompetitionHistory history={MOCK_HISTORY} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card lg:sticky lg:top-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Package size={18} className="text-olive" />
              <h3 className="font-serif font-bold text-charcoal text-base">
                Particle Inventory
              </h3>
            </div>

            <div className="divide-y divide-border">
              <InventoryRow
                label="Up Quarks"
                count={MOCK_INVENTORY.upQuarks}
                color="bg-red-400"
              />
              <InventoryRow
                label="Down Quarks"
                count={MOCK_INVENTORY.downQuarks}
                color="bg-blue-400"
              />
              <InventoryRow
                label="Protons"
                count={MOCK_INVENTORY.protons}
                color="bg-orange-400"
              />
              <InventoryRow
                label="Neutrons"
                count={MOCK_INVENTORY.neutrons}
                color="bg-gray-400"
              />
              <InventoryRow
                label="Electrons"
                count={MOCK_INVENTORY.electrons}
                color="bg-yellow-500"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Total Sub-atomic</span>
                <span className="text-xs font-semibold text-charcoal tabular-nums">
                  {MOCK_INVENTORY.upQuarks +
                    MOCK_INVENTORY.downQuarks +
                    MOCK_INVENTORY.protons +
                    MOCK_INVENTORY.neutrons +
                    MOCK_INVENTORY.electrons}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
