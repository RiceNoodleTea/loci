"use client";

import { FlaskConical, Beaker } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { Molecule, MoleculeRecipe } from "@/lib/particles/types";

interface MoleculeGalleryProps {
  molecules: Molecule[];
  recipes?: MoleculeRecipe[];
}

function AtomBadge({ symbol, count }: { symbol: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] text-muted bg-parchment rounded-md px-1.5 py-0.5">
      <span className="font-medium text-charcoal">{symbol}</span>
      {count > 1 && <span className="text-muted">x{count}</span>}
    </span>
  );
}

function MoleculeCard({ molecule }: { molecule: Molecule }) {
  const atomCounts = new Map<string, number>();
  for (const atom of molecule.atoms) {
    const sym = atom.element.symbol;
    atomCounts.set(sym, (atomCounts.get(sym) ?? 0) + 1);
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-border shadow-card p-4",
        "hover:shadow-card-hover transition-shadow"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-serif font-bold text-charcoal text-2xl leading-none">
          {molecule.formula}
        </span>
        <FlaskConical size={14} className="text-olive mt-1 shrink-0" />
      </div>

      <p className="text-sm text-muted mb-3">{molecule.name}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {Array.from(atomCounts.entries()).map(([symbol, count]) => (
          <AtomBadge key={symbol} symbol={symbol} count={count} />
        ))}
      </div>

      <p className="text-[11px] text-muted">
        Built {formatDate(molecule.builtAt)}
      </p>
    </div>
  );
}

export default function MoleculeGallery({
  molecules,
  recipes,
}: MoleculeGalleryProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Beaker size={18} className="text-olive" />
        <h3 className="font-serif font-bold text-charcoal text-base">
          Molecule Gallery
        </h3>
        {molecules.length > 0 && (
          <span className="ml-auto text-xs text-muted tabular-nums">
            {molecules.length} built
            {recipes ? ` / ${recipes.length} possible` : ""}
          </span>
        )}
      </div>

      {molecules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-parchment-dark flex items-center justify-center mb-3">
            <FlaskConical size={20} className="text-muted" />
          </div>
          <p className="text-sm text-muted max-w-[260px]">
            No molecules built yet. Study together to earn fusion opportunities!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {molecules.map((molecule) => (
            <MoleculeCard key={molecule.id} molecule={molecule} />
          ))}
        </div>
      )}
    </div>
  );
}
