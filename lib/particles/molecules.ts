import type { MoleculeRecipe, Atom } from "./types";

export const MOLECULE_RECIPES: MoleculeRecipe[] = [
  {
    formula: "H₂",
    name: "Hydrogen Gas",
    atomRequirements: [{ symbol: "H", count: 2 }],
  },
  {
    formula: "O₂",
    name: "Oxygen Gas",
    atomRequirements: [{ symbol: "O", count: 2 }],
  },
  {
    formula: "N₂",
    name: "Nitrogen Gas",
    atomRequirements: [{ symbol: "N", count: 2 }],
  },
  {
    formula: "H₂O",
    name: "Water",
    atomRequirements: [
      { symbol: "H", count: 2 },
      { symbol: "O", count: 1 },
    ],
  },
  {
    formula: "CO₂",
    name: "Carbon Dioxide",
    atomRequirements: [
      { symbol: "C", count: 1 },
      { symbol: "O", count: 2 },
    ],
  },
  {
    formula: "NaCl",
    name: "Sodium Chloride",
    atomRequirements: [
      { symbol: "Na", count: 1 },
      { symbol: "Cl", count: 1 },
    ],
  },
  {
    formula: "CH₄",
    name: "Methane",
    atomRequirements: [
      { symbol: "C", count: 1 },
      { symbol: "H", count: 4 },
    ],
  },
  {
    formula: "NH₃",
    name: "Ammonia",
    atomRequirements: [
      { symbol: "N", count: 1 },
      { symbol: "H", count: 3 },
    ],
  },
  {
    formula: "C₂H₆",
    name: "Ethane",
    atomRequirements: [
      { symbol: "C", count: 2 },
      { symbol: "H", count: 6 },
    ],
  },
  {
    formula: "C₂H₄",
    name: "Ethylene",
    atomRequirements: [
      { symbol: "C", count: 2 },
      { symbol: "H", count: 4 },
    ],
  },
  {
    formula: "HCl",
    name: "Hydrochloric Acid",
    atomRequirements: [
      { symbol: "H", count: 1 },
      { symbol: "Cl", count: 1 },
    ],
  },
  {
    formula: "H₂SO₄",
    name: "Sulfuric Acid",
    atomRequirements: [
      { symbol: "H", count: 2 },
      { symbol: "S", count: 1 },
      { symbol: "O", count: 4 },
    ],
  },
  {
    formula: "NaOH",
    name: "Sodium Hydroxide",
    atomRequirements: [
      { symbol: "Na", count: 1 },
      { symbol: "O", count: 1 },
      { symbol: "H", count: 1 },
    ],
  },
  {
    formula: "CaCO₃",
    name: "Calcium Carbonate",
    atomRequirements: [
      { symbol: "Ca", count: 1 },
      { symbol: "C", count: 1 },
      { symbol: "O", count: 3 },
    ],
  },
  {
    formula: "Fe₂O₃",
    name: "Iron Oxide",
    atomRequirements: [
      { symbol: "Fe", count: 2 },
      { symbol: "O", count: 3 },
    ],
  },
  {
    formula: "C₆H₁₂O₆",
    name: "Glucose",
    atomRequirements: [
      { symbol: "C", count: 6 },
      { symbol: "H", count: 12 },
      { symbol: "O", count: 6 },
    ],
  },
  {
    formula: "C₂H₅OH",
    name: "Ethanol",
    atomRequirements: [
      { symbol: "C", count: 2 },
      { symbol: "H", count: 6 },
      { symbol: "O", count: 1 },
    ],
  },
  {
    formula: "NO₂",
    name: "Nitrogen Dioxide",
    atomRequirements: [
      { symbol: "N", count: 1 },
      { symbol: "O", count: 2 },
    ],
  },
  {
    formula: "SO₂",
    name: "Sulfur Dioxide",
    atomRequirements: [
      { symbol: "S", count: 1 },
      { symbol: "O", count: 2 },
    ],
  },
  {
    formula: "H₂O₂",
    name: "Hydrogen Peroxide",
    atomRequirements: [
      { symbol: "H", count: 2 },
      { symbol: "O", count: 2 },
    ],
  },
];

export function canBuildMolecule(
  recipe: MoleculeRecipe,
  availableAtoms: Atom[]
): boolean {
  const counts = new Map<string, number>();
  for (const atom of availableAtoms) {
    counts.set(
      atom.element.symbol,
      (counts.get(atom.element.symbol) ?? 0) + 1
    );
  }
  return recipe.atomRequirements.every(
    (req) => (counts.get(req.symbol) ?? 0) >= req.count
  );
}

export function getMoleculesByComplexity(): MoleculeRecipe[] {
  return [...MOLECULE_RECIPES].sort((a, b) => {
    const totalA = a.atomRequirements.reduce((sum, r) => sum + r.count, 0);
    const totalB = b.atomRequirements.reduce((sum, r) => sum + r.count, 0);
    return totalA - totalB;
  });
}
