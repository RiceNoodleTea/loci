"use client";

import { useState, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { cn } from "@/lib/utils";
import { Plus, Minus, Check, X, Sparkles, RotateCcw } from "lucide-react";
import NucleonParticle from "./NucleonParticle";
import ElectronOrbit from "./ElectronOrbit";
import { validateNucleus, type NucleusResult } from "@/lib/particles/nuclei";
import type { ParticleInventory } from "@/lib/particles/types";

interface NucleiBuilderProps {
  inventory: ParticleInventory;
  onInventoryChange: (inv: ParticleInventory) => void;
  onAtomBuilt?: (result: NucleusResult) => void;
}

const SHELL_CAPACITIES = [2, 8, 18, 32];

function distributeElectrons(total: number): number[] {
  const shells: number[] = [];
  let remaining = total;
  for (const cap of SHELL_CAPACITIES) {
    if (remaining <= 0) break;
    shells.push(Math.min(remaining, cap));
    remaining -= Math.min(remaining, cap);
  }
  return shells;
}

function nucleonPosition(
  index: number,
  total: number
): [number, number, number] {
  if (total === 1) return [0, 0, 0];
  const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
  const layers = Math.ceil(Math.cbrt(total));
  const r = 0.45 * Math.cbrt((index + 1) / total) * layers;
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ];
}

function BuilderScene({
  protons,
  neutrons,
  electrons,
}: {
  protons: number;
  neutrons: number;
  electrons: number;
}) {
  const totalNucleons = protons + neutrons;

  const nucleons = useMemo(() => {
    const items: {
      type: "proton" | "neutron";
      pos: [number, number, number];
    }[] = [];
    for (let i = 0; i < protons; i++) {
      items.push({ type: "proton", pos: nucleonPosition(i, totalNucleons) });
    }
    for (let i = 0; i < neutrons; i++) {
      items.push({
        type: "neutron",
        pos: nucleonPosition(protons + i, totalNucleons),
      });
    }
    return items;
  }, [protons, neutrons, totalNucleons]);

  const electronShells = useMemo(
    () => distributeElectrons(electrons),
    [electrons]
  );

  const maxShellRadius = 1.2 + electronShells.length * 1.4;
  const cameraZ = Math.max(6, maxShellRadius * 2);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, -3, 3]} intensity={0.5} color="#8B9A6B" />

      {nucleons.map((n, i) => (
        <NucleonParticle
          key={`n-${i}-${n.type}`}
          position={n.pos}
          type={n.type}
          showQuarks={totalNucleons <= 4}
        />
      ))}

      {electronShells.map((count, shellIdx) => {
        const radius = 1.8 + shellIdx * 1.4;
        return (
          <ElectronOrbit
            key={`shell-${shellIdx}`}
            radius={radius}
            electronCount={count}
            shellIndex={shellIdx}
            speed={1.2 - shellIdx * 0.2}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={cameraZ * 2}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <Stars
        radius={50}
        depth={30}
        count={800}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />
    </>
  );
}

interface ParticleControlProps {
  label: string;
  count: number;
  available: number;
  color: string;
  onAdd: () => void;
  onRemove: () => void;
}

function ParticleControl({
  label,
  count,
  available,
  color,
  onAdd,
  onRemove,
}: ParticleControlProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onRemove}
        disabled={count <= 0}
        className={cn(
          "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
          count > 0
            ? "bg-white/10 text-white/80 hover:bg-white/20"
            : "bg-white/5 text-white/20 cursor-not-allowed"
        )}
      >
        <Minus size={14} />
      </button>

      <div className="flex items-center gap-1.5 min-w-[80px]">
        <div className={cn("w-3 h-3 rounded-full", color)} />
        <span className="text-xs text-white/70 flex-1">{label}</span>
        <span className="text-sm font-mono font-bold text-white tabular-nums">
          {count}
        </span>
      </div>

      <button
        onClick={onAdd}
        disabled={available <= 0}
        className={cn(
          "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
          available > 0
            ? "bg-white/10 text-white/80 hover:bg-white/20"
            : "bg-white/5 text-white/20 cursor-not-allowed"
        )}
      >
        <Plus size={14} />
      </button>

      <span className="text-[10px] text-white/30 tabular-nums w-8">
        ({available})
      </span>
    </div>
  );
}

export default function NucleiBuilder({
  inventory,
  onInventoryChange,
  onAtomBuilt,
}: NucleiBuilderProps) {
  const [placed, setPlaced] = useState({
    protons: 0,
    neutrons: 0,
    electrons: 0,
  });
  const [result, setResult] = useState<NucleusResult | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const addParticle = useCallback(
    (type: "protons" | "neutrons" | "electrons") => {
      const invKey =
        type === "protons"
          ? "protons"
          : type === "neutrons"
          ? "neutrons"
          : "electrons";
      if (inventory[invKey] <= 0) return;
      setPlaced((p) => ({ ...p, [type]: p[type] + 1 }));
      onInventoryChange({ ...inventory, [invKey]: inventory[invKey] - 1 });
      setResult(null);
    },
    [inventory, onInventoryChange]
  );

  const removeParticle = useCallback(
    (type: "protons" | "neutrons" | "electrons") => {
      if (placed[type] <= 0) return;
      const invKey =
        type === "protons"
          ? "protons"
          : type === "neutrons"
          ? "neutrons"
          : "electrons";
      setPlaced((p) => ({ ...p, [type]: p[type] - 1 }));
      onInventoryChange({ ...inventory, [invKey]: inventory[invKey] + 1 });
      setResult(null);
    },
    [placed, inventory, onInventoryChange]
  );

  function handleReset() {
    onInventoryChange({
      ...inventory,
      protons: inventory.protons + placed.protons,
      neutrons: inventory.neutrons + placed.neutrons,
      electrons: inventory.electrons + placed.electrons,
    });
    setPlaced({ protons: 0, neutrons: 0, electrons: 0 });
    setResult(null);
    setShowCelebration(false);
  }

  function handleConfirm() {
    const res = validateNucleus(
      placed.protons,
      placed.neutrons,
      placed.electrons
    );
    setResult(res);
    if (res.valid) {
      setShowCelebration(true);
      onAtomBuilt?.(res);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }

  const hasParticles =
    placed.protons > 0 || placed.neutrons > 0 || placed.electrons > 0;

  return (
    <div className="rounded-2xl overflow-hidden bg-[#1a1a2e] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#8B9A6B]" />
          <h3 className="font-serif font-bold text-white text-sm">Nuclei</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/50">
            {placed.protons}p &middot; {placed.neutrons}n &middot;{" "}
            {placed.electrons}e
          </span>
          <span className="font-serif font-bold text-lg text-white/80">
            {result?.valid ? result.element!.symbol : "???"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* 3D Scene */}
        <div className="flex-1 min-h-[280px]">
          <Canvas
            camera={{ position: [0, 2, 8], fov: 50 }}
            style={{ background: "transparent" }}
            gl={{ alpha: true }}
          >
            <BuilderScene
              protons={placed.protons}
              neutrons={placed.neutrons}
              electrons={placed.electrons}
            />
          </Canvas>
        </div>

        {/* Controls panel */}
        <div className="w-48 border-l border-white/10 px-3 py-3 flex flex-col gap-3">
          <ParticleControl
            label="Protons"
            count={placed.protons}
            available={inventory.protons}
            color="bg-orange-400"
            onAdd={() => addParticle("protons")}
            onRemove={() => removeParticle("protons")}
          />
          <ParticleControl
            label="Neutrons"
            count={placed.neutrons}
            available={inventory.neutrons}
            color="bg-gray-400"
            onAdd={() => addParticle("neutrons")}
            onRemove={() => removeParticle("neutrons")}
          />
          <ParticleControl
            label="Electrons"
            count={placed.electrons}
            available={inventory.electrons}
            color="bg-yellow-400"
            onAdd={() => addParticle("electrons")}
            onRemove={() => removeParticle("electrons")}
          />

          <div className="border-t border-white/10 pt-3 mt-auto space-y-2">
            <button
              onClick={handleConfirm}
              disabled={!hasParticles}
              className={cn(
                "w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors",
                hasParticles
                  ? "bg-[#8B9A6B] text-white hover:bg-[#7a8a5c]"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              <Check size={13} />
              Confirm
            </button>
            <button
              onClick={handleReset}
              disabled={!hasParticles}
              className={cn(
                "w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors",
                hasParticles
                  ? "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/80"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div
          className={cn(
            "px-4 py-3 border-t border-white/10 flex items-center gap-3",
            result.valid ? "bg-[#8B9A6B]/20" : "bg-red-500/10"
          )}
        >
          {result.valid ? (
            <>
              {showCelebration && (
                <span className="text-lg animate-bounce">🎉</span>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold text-white">
                  {result.element!.name} discovered!
                </p>
                <p className="text-[11px] text-white/60">
                  {result.isotopeName} &mdash; {result.element!.symbol} (Z=
                  {result.element!.atomicNumber})
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#8B9A6B] flex items-center justify-center">
                <span className="font-serif font-bold text-white text-lg">
                  {result.element!.symbol}
                </span>
              </div>
            </>
          ) : (
            <>
              <X size={16} className="text-red-400 shrink-0" />
              <p className="text-xs text-red-300">{result.error}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
