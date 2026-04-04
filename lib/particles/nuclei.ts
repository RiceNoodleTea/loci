import { ELEMENTS } from "./elements";
import type { Element } from "./types";

export interface NucleusResult {
  valid: boolean;
  element?: Element;
  isotopeName?: string;
  error?: string;
}

export function validateNucleus(
  protons: number,
  neutrons: number,
  electrons: number
): NucleusResult {
  if (protons <= 0) {
    return { valid: false, error: "Add at least one proton to form a nucleus." };
  }

  if (electrons !== protons) {
    return {
      valid: false,
      error: `Electrons (${electrons}) must equal protons (${protons}) to form a neutral atom.`,
    };
  }

  const element = ELEMENTS.find((e) => e.atomicNumber === protons);
  if (!element) {
    return {
      valid: false,
      error: `No known element has ${protons} proton${protons !== 1 ? "s" : ""}.`,
    };
  }

  if (!element.commonIsotopes.includes(neutrons)) {
    const massNumbers = element.commonIsotopes
      .map((n) => `${element.symbol}-${protons + n}`)
      .join(", ");
    return {
      valid: false,
      error: `No known isotope of ${element.name} has ${neutrons} neutron${neutrons !== 1 ? "s" : ""}. Known isotopes: ${massNumbers}.`,
    };
  }

  const massNumber = protons + neutrons;
  const isotopeName = `${element.name}-${massNumber}`;

  return {
    valid: true,
    element,
    isotopeName,
  };
}
