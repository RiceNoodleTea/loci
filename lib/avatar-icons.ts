import {
  FlaskConical,
  Rocket,
  Atom,
  Microscope,
  TestTube,
  Telescope,
  Dna,
  Beaker,
  Orbit,
  Radiation,
  Magnet,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface AvatarOption {
  key: string;
  label: string;
  icon: LucideIcon;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { key: "flask", label: "Flask", icon: FlaskConical },
  { key: "rocket", label: "Rocket", icon: Rocket },
  { key: "atom", label: "Atom", icon: Atom },
  { key: "microscope", label: "Microscope", icon: Microscope },
  { key: "test-tube", label: "Test Tube", icon: TestTube },
  { key: "telescope", label: "Telescope", icon: Telescope },
  { key: "dna", label: "DNA", icon: Dna },
  { key: "beaker", label: "Beaker", icon: Beaker },
  { key: "orbit", label: "Orbit", icon: Orbit },
  { key: "radiation", label: "Radiation", icon: Radiation },
  { key: "magnet", label: "Magnet", icon: Magnet },
  { key: "zap", label: "Energy", icon: Zap },
];

export function getAvatarIcon(key: string): LucideIcon | null {
  return AVATAR_OPTIONS.find((o) => o.key === key)?.icon ?? null;
}
