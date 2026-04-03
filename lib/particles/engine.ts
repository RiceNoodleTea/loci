import type {
  ParticleInventory,
  ParticleType,
  Element,
  Atom,
  Molecule,
  MoleculeRecipe,
  ElementVote,
} from "./types";

export function earnParticleFromSoloStudy(
  currentInventory: ParticleInventory,
  totalSoloHours: number
): { inventory: ParticleInventory; earned: ParticleType } {
  const earned: ParticleType =
    totalSoloHours % 2 === 0 ? "up_quark" : "down_quark";
  const inventory = { ...currentInventory };

  if (earned === "up_quark") {
    inventory.upQuarks += 1;
  } else {
    inventory.downQuarks += 1;
  }

  return { inventory, earned };
}

export function earnParticleFromPairStudy(
  inventory: ParticleInventory,
  choice: "proton" | "neutron"
): { inventory: ParticleInventory; earned: ParticleType } | { error: string } {
  const next = { ...inventory };

  if (choice === "proton") {
    if (next.upQuarks < 2 || next.downQuarks < 1) {
      return {
        error: `Need 2 up quarks and 1 down quark to fuse a proton. You have ${next.upQuarks} up and ${next.downQuarks} down.`,
      };
    }
    next.upQuarks -= 2;
    next.downQuarks -= 1;
    next.protons += 1;
    return { inventory: next, earned: "proton" };
  }

  if (next.upQuarks < 1 || next.downQuarks < 2) {
    return {
      error: `Need 1 up quark and 2 down quarks to fuse a neutron. You have ${next.upQuarks} up and ${next.downQuarks} down.`,
    };
  }
  next.upQuarks -= 1;
  next.downQuarks -= 2;
  next.neutrons += 1;
  return { inventory: next, earned: "neutron" };
}

export function earnElectron(
  inventory: ParticleInventory
): ParticleInventory {
  return { ...inventory, electrons: inventory.electrons + 1 };
}

export function canBuildElement(
  element: Element,
  inventory: ParticleInventory
): boolean {
  return (
    inventory.protons >= element.protons &&
    inventory.neutrons >= element.neutrons &&
    inventory.electrons >= element.electrons
  );
}

export function buildAtom(
  element: Element,
  inventory: ParticleInventory,
  groupId: string
): { inventory: ParticleInventory; atom: Atom } | { error: string } {
  if (!canBuildElement(element, inventory)) {
    const missing: string[] = [];
    if (inventory.protons < element.protons)
      missing.push(
        `${element.protons - inventory.protons} more proton(s)`
      );
    if (inventory.neutrons < element.neutrons)
      missing.push(
        `${element.neutrons - inventory.neutrons} more neutron(s)`
      );
    if (inventory.electrons < element.electrons)
      missing.push(
        `${element.electrons - inventory.electrons} more electron(s)`
      );
    return { error: `Cannot build ${element.name}. Need ${missing.join(", ")}.` };
  }

  const next: ParticleInventory = {
    upQuarks: inventory.upQuarks,
    downQuarks: inventory.downQuarks,
    protons: inventory.protons - element.protons,
    neutrons: inventory.neutrons - element.neutrons,
    electrons: inventory.electrons - element.electrons,
  };

  const now = new Date();
  const atom: Atom = {
    id: crypto.randomUUID(),
    groupId,
    element,
    builtAt: now.toISOString(),
    builtWeek: getWeekStart(now),
  };

  return { inventory: next, atom };
}

export function buildMolecule(
  recipe: MoleculeRecipe,
  availableAtoms: Atom[],
  groupId: string
):
  | { remainingAtoms: Atom[]; molecule: Molecule }
  | { error: string } {
  const pool = [...availableAtoms];
  const consumed: Atom[] = [];

  for (const req of recipe.atomRequirements) {
    let found = 0;
    for (let i = pool.length - 1; i >= 0 && found < req.count; i--) {
      if (pool[i].element.symbol === req.symbol) {
        consumed.push(pool[i]);
        pool.splice(i, 1);
        found++;
      }
    }
    if (found < req.count) {
      return {
        error: `Not enough ${req.symbol} atoms. Need ${req.count}, have ${found}.`,
      };
    }
  }

  const molecule: Molecule = {
    id: crypto.randomUUID(),
    groupId,
    formula: recipe.formula,
    name: recipe.name,
    atoms: consumed,
    builtAt: new Date().toISOString(),
  };

  return { remainingAtoms: pool, molecule };
}

export function tallyVotes(
  votes: ElementVote[]
): { symbol: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const vote of votes) {
    counts.set(
      vote.elementSymbol,
      (counts.get(vote.elementSymbol) ?? 0) + 1
    );
  }
  return Array.from(counts.entries())
    .map(([symbol, count]) => ({ symbol, count }))
    .sort((a, b) => b.count - a.count);
}

export function getWeekStart(date?: Date): string {
  const d = date ? new Date(date) : new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}

export function calculateProgress(
  inventory: ParticleInventory,
  targetElement: Element
): {
  protonsPercent: number;
  neutronsPercent: number;
  electronsPercent: number;
  overallPercent: number;
} {
  const pct = (have: number, need: number) =>
    need === 0 ? 100 : Math.min(100, Math.round((have / need) * 100));

  const protonsPercent = pct(inventory.protons, targetElement.protons);
  const neutronsPercent = pct(inventory.neutrons, targetElement.neutrons);
  const electronsPercent = pct(inventory.electrons, targetElement.electrons);

  const totalNeed =
    targetElement.protons + targetElement.neutrons + targetElement.electrons;
  const totalHave = Math.min(inventory.protons, targetElement.protons)
    + Math.min(inventory.neutrons, targetElement.neutrons)
    + Math.min(inventory.electrons, targetElement.electrons);
  const overallPercent = totalNeed === 0 ? 100 : Math.round((totalHave / totalNeed) * 100);

  return { protonsPercent, neutronsPercent, electronsPercent, overallPercent };
}
