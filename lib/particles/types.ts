export type ParticleType =
  | "up_quark"
  | "down_quark"
  | "proton"
  | "neutron"
  | "electron";

export interface ParticleInventory {
  upQuarks: number;
  downQuarks: number;
  protons: number;
  neutrons: number;
  electrons: number;
}

export interface ParticleEvent {
  id: string;
  groupId: string;
  userId: string;
  eventType:
    | "solo_study"
    | "pair_study"
    | "quiz_complete"
    | "flashcard_complete";
  particleEarned: ParticleType;
  createdAt: string;
}

export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  protons: number;
  neutrons: number;
  electrons: number;
  category: string;
  commonIsotopes: number[];
}

export interface Atom {
  id: string;
  groupId: string;
  element: Element;
  builtAt: string;
  builtWeek: string;
}

export interface Molecule {
  id: string;
  groupId: string;
  formula: string;
  name: string;
  atoms: Atom[];
  builtAt: string;
}

export interface MoleculeRecipe {
  formula: string;
  name: string;
  atomRequirements: { symbol: string; count: number }[];
}

export interface ElementVote {
  userId: string;
  elementSymbol: string;
  votedAt: string;
}

export interface WeeklyCompetition {
  groupId: string;
  weekStart: string;
  particlesEarned: number;
  atomsBuilt: number;
  bestMolecule: Molecule | null;
}
