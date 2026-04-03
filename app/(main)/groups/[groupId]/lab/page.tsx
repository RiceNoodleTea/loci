"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Atom, FlaskConical, Microscope, Target, X, Sparkles } from "lucide-react";
import ParticleInventoryGrid from "@/components/particles/ParticleInventory";
import ElementCard from "@/components/particles/ElementCard";
import MoleculeGallery from "@/components/particles/MoleculeGallery";
import { MOLECULE_RECIPES, canBuildMolecule } from "@/lib/particles/molecules";
import { ELEMENTS } from "@/lib/particles/elements";
import type {
  ParticleInventory,
  Element,
  Atom as AtomType,
  Molecule,
  MoleculeRecipe,
} from "@/lib/particles/types";

const AtomViewer = dynamic(
  () => import("@/components/particles/AtomViewer"),
  { ssr: false, loading: () => <ViewerSkeleton /> }
);

const MoleculeViewer = dynamic(
  () => import("@/components/particles/MoleculeViewer"),
  { ssr: false, loading: () => <ViewerSkeleton /> }
);

function ViewerSkeleton() {
  return (
    <div className="min-h-[400px] rounded-2xl bg-[#1a1a2e] flex items-center justify-center">
      <div className="text-center">
        <Atom size={32} className="text-[#8B9A6B] mx-auto mb-2 animate-spin" />
        <p className="text-sm text-[#F5F1EB]/60">Loading 3D viewer…</p>
      </div>
    </div>
  );
}

const HYDROGEN: Element = ELEMENTS.find((e) => e.symbol === "H")!;
const HELIUM: Element = ELEMENTS.find((e) => e.symbol === "He")!;
const OXYGEN: Element = ELEMENTS.find((e) => e.symbol === "O")!;
const CARBON: Element = ELEMENTS.find((e) => e.symbol === "C")!;

const MOCK_INVENTORY: ParticleInventory = {
  upQuarks: 12,
  downQuarks: 8,
  protons: 4,
  neutrons: 3,
  electrons: 5,
};

const MOCK_ATOMS: AtomType[] = [
  { id: "h1", groupId: "g1", element: HYDROGEN, builtAt: "2026-03-20", builtWeek: "2026-W12" },
  { id: "h2", groupId: "g1", element: HYDROGEN, builtAt: "2026-03-21", builtWeek: "2026-W12" },
  { id: "he1", groupId: "g1", element: HELIUM, builtAt: "2026-03-25", builtWeek: "2026-W13" },
];

const MOCK_MOLECULES: Molecule[] = [
  {
    id: "m1",
    groupId: "g1",
    formula: "H₂O",
    name: "Water",
    atoms: [
      { id: "wh1", groupId: "g1", element: HYDROGEN, builtAt: "2026-03-15", builtWeek: "2026-W11" },
      { id: "wh2", groupId: "g1", element: HYDROGEN, builtAt: "2026-03-15", builtWeek: "2026-W11" },
      { id: "wo1", groupId: "g1", element: OXYGEN, builtAt: "2026-03-16", builtWeek: "2026-W11" },
    ],
    builtAt: "2026-03-18",
  },
];

const TARGET_ELEMENT = CARBON;

const TARGET_PROGRESS = {
  protonsPercent: Math.round((MOCK_INVENTORY.protons / TARGET_ELEMENT.protons) * 100),
  neutronsPercent: Math.round((MOCK_INVENTORY.neutrons / TARGET_ELEMENT.neutrons) * 100),
  electronsPercent: Math.round((MOCK_INVENTORY.electrons / TARGET_ELEMENT.electrons) * 100),
  overallPercent: Math.round(
    ((Math.min(MOCK_INVENTORY.protons, TARGET_ELEMENT.protons) +
      Math.min(MOCK_INVENTORY.neutrons, TARGET_ELEMENT.neutrons) +
      Math.min(MOCK_INVENTORY.electrons, TARGET_ELEMENT.electrons)) /
      (TARGET_ELEMENT.protons + TARGET_ELEMENT.neutrons + TARGET_ELEMENT.electrons)) *
      100
  ),
};

const IS_ATOM_COMPLETE =
  MOCK_INVENTORY.protons >= TARGET_ELEMENT.protons &&
  MOCK_INVENTORY.neutrons >= TARGET_ELEMENT.neutrons &&
  MOCK_INVENTORY.electrons >= TARGET_ELEMENT.electrons;

function atomCountsBySymbol(atoms: AtomType[]) {
  const map = new Map<string, { element: Element; count: number }>();
  for (const a of atoms) {
    const entry = map.get(a.element.symbol);
    if (entry) {
      entry.count++;
    } else {
      map.set(a.element.symbol, { element: a.element, count: 1 });
    }
  }
  return Array.from(map.values());
}

export default function LabPage() {
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null);

  const atomGroups = atomCountsBySymbol(MOCK_ATOMS);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <Atom size={24} className="text-olive" />
        <h1 className="font-serif font-bold text-2xl text-charcoal">
          Particle Lab
        </h1>
      </div>

      {/* Particle Inventory */}
      <section className="mb-6">
        <ParticleInventoryGrid inventory={MOCK_INVENTORY} />
      </section>

      {/* Current Target */}
      <section className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-olive" />
          <h2 className="font-serif font-bold text-lg text-charcoal">
            Current Target
          </h2>
          <span className="ml-auto text-xs text-muted tabular-nums">
            {TARGET_PROGRESS.overallPercent}% complete
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <div>
            <ElementCard
              element={TARGET_ELEMENT}
              isTarget
              progress={TARGET_PROGRESS}
            />
          </div>
          <AtomViewer
            element={TARGET_ELEMENT}
            inventory={MOCK_INVENTORY}
            isComplete={IS_ATOM_COMPLETE}
          />
        </div>
      </section>

      {/* Atom Collection */}
      <section className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Microscope size={18} className="text-olive" />
          <h2 className="font-serif font-bold text-lg text-charcoal">
            Atom Collection
          </h2>
          <span className="ml-auto text-xs text-muted tabular-nums">
            {MOCK_ATOMS.length} atoms built
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {atomGroups.map(({ element, count }) => (
            <div
              key={element.symbol}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-white hover:shadow-card transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-olive flex items-center justify-center text-white font-serif font-bold text-lg">
                {element.symbol}
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">
                  {element.name}
                </p>
                <p className="text-[11px] text-muted">
                  &times;{count} built
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Molecule Gallery */}
      <section className="mb-6">
        <MoleculeGallery molecules={MOCK_MOLECULES} recipes={MOLECULE_RECIPES} />
      </section>

      {/* Molecule 3D Viewer */}
      {selectedMolecule && (
        <section className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical size={18} className="text-olive" />
            <h2 className="font-serif font-bold text-lg text-charcoal">
              Molecule Viewer — {selectedMolecule.name}
            </h2>
            <button
              onClick={() => setSelectedMolecule(null)}
              className="ml-auto p-1 rounded-lg hover:bg-parchment-dark transition-colors"
            >
              <X size={16} className="text-muted" />
            </button>
          </div>
          <MoleculeViewer molecule={selectedMolecule} />
        </section>
      )}

      {/* View molecule button */}
      {MOCK_MOLECULES.length > 0 && !selectedMolecule && (
        <section className="mb-6 flex justify-center">
          <button
            onClick={() => setSelectedMolecule(MOCK_MOLECULES[0])}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all",
              "bg-olive text-white hover:bg-olive-hover shadow-card hover:shadow-card-hover"
            )}
          >
            <FlaskConical size={16} />
            View Molecule in 3D
          </button>
        </section>
      )}

      {/* Build Molecule Button */}
      <section className="mb-8 flex justify-center">
        <button
          onClick={() => setShowRecipeModal(true)}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all",
            "bg-charcoal text-parchment hover:bg-charcoal/90 shadow-card hover:shadow-card-hover"
          )}
        >
          <Sparkles size={16} />
          Build Molecule
        </button>
      </section>

      {/* Recipe Modal */}
      {showRecipeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm"
          onClick={() => setShowRecipeModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <FlaskConical size={18} className="text-olive" />
                <h3 className="font-serif font-bold text-lg text-charcoal">
                  Molecule Recipes
                </h3>
              </div>
              <button
                onClick={() => setShowRecipeModal(false)}
                className="p-1.5 rounded-lg hover:bg-parchment-dark transition-colors"
              >
                <X size={18} className="text-muted" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-3">
              {MOLECULE_RECIPES.map((recipe) => {
                const buildable = canBuildMolecule(recipe, MOCK_ATOMS);
                return (
                  <RecipeCard
                    key={recipe.formula}
                    recipe={recipe}
                    buildable={buildable}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RecipeCard({
  recipe,
  buildable,
}: {
  recipe: MoleculeRecipe;
  buildable: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all",
        buildable
          ? "border-olive bg-olive/5 shadow-card"
          : "border-border bg-white opacity-60"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-serif font-bold text-charcoal text-lg">
            {recipe.formula}
          </span>
          <span className="ml-2 text-sm text-muted">{recipe.name}</span>
        </div>
        {buildable && (
          <span className="text-[11px] font-medium text-olive bg-olive/10 px-2 py-0.5 rounded-full">
            Ready
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {recipe.atomRequirements.map((req) => (
          <span
            key={req.symbol}
            className="text-xs text-muted bg-parchment rounded-md px-2 py-0.5"
          >
            {req.symbol} &times;{req.count}
          </span>
        ))}
      </div>
    </div>
  );
}
