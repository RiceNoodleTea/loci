import type { Element } from "./types";

export const ELEMENTS: Element[] = [
  { symbol: "H", name: "Hydrogen", atomicNumber: 1, protons: 1, neutrons: 0, electrons: 1, category: "nonmetal", commonIsotopes: [0, 1, 2] },
  { symbol: "He", name: "Helium", atomicNumber: 2, protons: 2, neutrons: 2, electrons: 2, category: "noble gas", commonIsotopes: [1, 2] },
  { symbol: "Li", name: "Lithium", atomicNumber: 3, protons: 3, neutrons: 4, electrons: 3, category: "alkali metal", commonIsotopes: [3, 4] },
  { symbol: "Be", name: "Beryllium", atomicNumber: 4, protons: 4, neutrons: 5, electrons: 4, category: "alkaline earth metal", commonIsotopes: [5] },
  { symbol: "B", name: "Boron", atomicNumber: 5, protons: 5, neutrons: 6, electrons: 5, category: "metalloid", commonIsotopes: [5, 6] },
  { symbol: "C", name: "Carbon", atomicNumber: 6, protons: 6, neutrons: 6, electrons: 6, category: "nonmetal", commonIsotopes: [6, 7] },
  { symbol: "N", name: "Nitrogen", atomicNumber: 7, protons: 7, neutrons: 7, electrons: 7, category: "nonmetal", commonIsotopes: [7, 8] },
  { symbol: "O", name: "Oxygen", atomicNumber: 8, protons: 8, neutrons: 8, electrons: 8, category: "nonmetal", commonIsotopes: [8, 9, 10] },
  { symbol: "F", name: "Fluorine", atomicNumber: 9, protons: 9, neutrons: 10, electrons: 9, category: "halogen", commonIsotopes: [10] },
  { symbol: "Ne", name: "Neon", atomicNumber: 10, protons: 10, neutrons: 10, electrons: 10, category: "noble gas", commonIsotopes: [10, 11, 12] },
  { symbol: "Na", name: "Sodium", atomicNumber: 11, protons: 11, neutrons: 12, electrons: 11, category: "alkali metal", commonIsotopes: [12] },
  { symbol: "Mg", name: "Magnesium", atomicNumber: 12, protons: 12, neutrons: 12, electrons: 12, category: "alkaline earth metal", commonIsotopes: [12, 13, 14] },
  { symbol: "Al", name: "Aluminum", atomicNumber: 13, protons: 13, neutrons: 14, electrons: 13, category: "post-transition metal", commonIsotopes: [14] },
  { symbol: "Si", name: "Silicon", atomicNumber: 14, protons: 14, neutrons: 14, electrons: 14, category: "metalloid", commonIsotopes: [14, 15, 16] },
  { symbol: "P", name: "Phosphorus", atomicNumber: 15, protons: 15, neutrons: 16, electrons: 15, category: "nonmetal", commonIsotopes: [16] },
  { symbol: "S", name: "Sulfur", atomicNumber: 16, protons: 16, neutrons: 16, electrons: 16, category: "nonmetal", commonIsotopes: [16, 17, 18, 20] },
  { symbol: "Cl", name: "Chlorine", atomicNumber: 17, protons: 17, neutrons: 18, electrons: 17, category: "halogen", commonIsotopes: [18, 20] },
  { symbol: "Ar", name: "Argon", atomicNumber: 18, protons: 18, neutrons: 22, electrons: 18, category: "noble gas", commonIsotopes: [18, 20, 22] },
  { symbol: "K", name: "Potassium", atomicNumber: 19, protons: 19, neutrons: 20, electrons: 19, category: "alkali metal", commonIsotopes: [20, 22] },
  { symbol: "Ca", name: "Calcium", atomicNumber: 20, protons: 20, neutrons: 20, electrons: 20, category: "alkaline earth metal", commonIsotopes: [20, 22, 23, 24, 26] },
  { symbol: "Sc", name: "Scandium", atomicNumber: 21, protons: 21, neutrons: 24, electrons: 21, category: "transition metal", commonIsotopes: [24] },
  { symbol: "Ti", name: "Titanium", atomicNumber: 22, protons: 22, neutrons: 26, electrons: 22, category: "transition metal", commonIsotopes: [24, 25, 26, 27, 28] },
  { symbol: "V", name: "Vanadium", atomicNumber: 23, protons: 23, neutrons: 28, electrons: 23, category: "transition metal", commonIsotopes: [27, 28] },
  { symbol: "Cr", name: "Chromium", atomicNumber: 24, protons: 24, neutrons: 28, electrons: 24, category: "transition metal", commonIsotopes: [26, 28, 29, 30] },
  { symbol: "Mn", name: "Manganese", atomicNumber: 25, protons: 25, neutrons: 30, electrons: 25, category: "transition metal", commonIsotopes: [30] },
  { symbol: "Fe", name: "Iron", atomicNumber: 26, protons: 26, neutrons: 30, electrons: 26, category: "transition metal", commonIsotopes: [28, 30, 31, 32] },
  { symbol: "Co", name: "Cobalt", atomicNumber: 27, protons: 27, neutrons: 32, electrons: 27, category: "transition metal", commonIsotopes: [32] },
  { symbol: "Ni", name: "Nickel", atomicNumber: 28, protons: 28, neutrons: 30, electrons: 28, category: "transition metal", commonIsotopes: [30, 32, 33, 34, 36] },
  { symbol: "Cu", name: "Copper", atomicNumber: 29, protons: 29, neutrons: 34, electrons: 29, category: "transition metal", commonIsotopes: [34, 36] },
  { symbol: "Zn", name: "Zinc", atomicNumber: 30, protons: 30, neutrons: 35, electrons: 30, category: "transition metal", commonIsotopes: [34, 36, 37, 38, 40] },
  { symbol: "Ga", name: "Gallium", atomicNumber: 31, protons: 31, neutrons: 39, electrons: 31, category: "post-transition metal", commonIsotopes: [38, 40] },
  { symbol: "Ge", name: "Germanium", atomicNumber: 32, protons: 32, neutrons: 41, electrons: 32, category: "metalloid", commonIsotopes: [38, 40, 41, 42, 44] },
  { symbol: "As", name: "Arsenic", atomicNumber: 33, protons: 33, neutrons: 42, electrons: 33, category: "metalloid", commonIsotopes: [42] },
  { symbol: "Se", name: "Selenium", atomicNumber: 34, protons: 34, neutrons: 45, electrons: 34, category: "nonmetal", commonIsotopes: [40, 42, 43, 44, 46, 48] },
  { symbol: "Br", name: "Bromine", atomicNumber: 35, protons: 35, neutrons: 45, electrons: 35, category: "halogen", commonIsotopes: [44, 46] },
  { symbol: "Kr", name: "Krypton", atomicNumber: 36, protons: 36, neutrons: 48, electrons: 36, category: "noble gas", commonIsotopes: [42, 44, 46, 47, 48, 50] },
];

export function getElement(symbol: string): Element | undefined {
  return ELEMENTS.find((e) => e.symbol === symbol);
}

export function getElementByNumber(n: number): Element | undefined {
  return ELEMENTS.find((e) => e.atomicNumber === n);
}
