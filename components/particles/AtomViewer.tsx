"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { Element, ParticleInventory } from "@/lib/particles/types";
import NucleonParticle from "./NucleonParticle";
import ElectronOrbit from "./ElectronOrbit";

interface AtomViewerProps {
  element: Element;
  inventory?: ParticleInventory;
  isComplete: boolean;
}

const SHELL_CAPACITIES = [2, 8, 18, 32];

function distributeElectrons(total: number): number[] {
  const shells: number[] = [];
  let remaining = total;
  for (const cap of SHELL_CAPACITIES) {
    if (remaining <= 0) break;
    const inShell = Math.min(remaining, cap);
    shells.push(inShell);
    remaining -= inShell;
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

function AtomScene({
  element,
  inventory,
  isComplete,
}: AtomViewerProps) {
  const nucleons = useMemo(() => {
    const items: { type: "proton" | "neutron"; pos: [number, number, number] }[] = [];
    const totalNucleons = element.protons + element.neutrons;

    for (let i = 0; i < element.protons; i++) {
      items.push({
        type: "proton",
        pos: nucleonPosition(i, totalNucleons),
      });
    }
    for (let i = 0; i < element.neutrons; i++) {
      items.push({
        type: "neutron",
        pos: nucleonPosition(element.protons + i, totalNucleons),
      });
    }

    return items;
  }, [element.protons, element.neutrons]);

  const electronShells = useMemo(
    () => distributeElectrons(element.electrons),
    [element.electrons]
  );

  const builtProtons = inventory?.protons ?? element.protons;
  const builtNeutrons = inventory?.neutrons ?? element.neutrons;
  const builtElectrons = inventory?.electrons ?? element.electrons;

  const builtElectronShells = useMemo(
    () => distributeElectrons(isComplete ? element.electrons : builtElectrons),
    [element.electrons, builtElectrons, isComplete]
  );

  const maxShellRadius = 1.2 + electronShells.length * 1.4;
  const cameraZ = Math.max(6, maxShellRadius * 2);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, -3, 3]} intensity={0.5} color="#8B9A6B" />

      {/* Built nucleons */}
      {nucleons.map((n, i) => {
        const isBeyondBuilt =
          !isComplete &&
          ((n.type === "proton" && i >= builtProtons) ||
            (n.type === "neutron" && i - element.protons >= builtNeutrons));

        if (isBeyondBuilt) {
          return (
            <mesh key={`ghost-${i}`} position={n.pos}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial
                color={n.type === "proton" ? "#E8A85D" : "#A0A0A0"}
                wireframe
                transparent
                opacity={0.15}
              />
            </mesh>
          );
        }

        return (
          <NucleonParticle
            key={`nucleon-${i}`}
            position={n.pos}
            type={n.type}
            showQuarks={element.atomicNumber <= 4}
          />
        );
      })}

      {/* Electron shells */}
      {electronShells.map((capacity, shellIdx) => {
        const radius = 1.8 + shellIdx * 1.4;
        const builtCount = builtElectronShells[shellIdx] ?? 0;

        if (!isComplete && builtCount === 0) {
          return (
            <group key={`ghost-shell-${shellIdx}`} rotation={[(shellIdx * 60 * Math.PI) / 180, 0, (shellIdx * 25 * Math.PI) / 180]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.02, 8, 64]} />
                <meshStandardMaterial
                  color="#8B9A6B"
                  wireframe
                  transparent
                  opacity={0.1}
                />
              </mesh>
            </group>
          );
        }

        return (
          <ElectronOrbit
            key={`shell-${shellIdx}`}
            radius={radius}
            electronCount={isComplete ? capacity : builtCount}
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
        count={1000}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />
    </>
  );
}

export default function AtomViewer(props: AtomViewerProps) {
  const electronShells = distributeElectrons(props.element.electrons);
  const maxShellRadius = 1.2 + electronShells.length * 1.4;
  const cameraZ = Math.max(6, maxShellRadius * 2);

  return (
    <div className="min-h-[400px] rounded-2xl overflow-hidden bg-[#1a1a2e]">
      <Canvas
        camera={{ position: [0, 2, cameraZ], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true }}
      >
        <AtomScene {...props} />
      </Canvas>
    </div>
  );
}
