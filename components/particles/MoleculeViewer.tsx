"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { Vector3, Quaternion, Euler } from "three";
import type { Molecule } from "@/lib/particles/types";

interface MoleculeViewerProps {
  molecule: Molecule;
}

const CATEGORY_SPHERE_COLORS: Record<string, string> = {
  nonmetal: "#5DBF5D",
  "noble gas": "#9B5DE5",
  "alkali metal": "#E85D5D",
  "alkaline earth metal": "#E8A85D",
  metalloid: "#5DB8B8",
  halogen: "#5DCFE8",
  "transition metal": "#E8C95D",
  "post-transition metal": "#7B68EE",
};

function getAtomColor(category: string): string {
  return CATEGORY_SPHERE_COLORS[category] ?? "#A0A0A0";
}

function layoutAtoms(atomCount: number): [number, number, number][] {
  if (atomCount === 1) return [[0, 0, 0]];

  if (atomCount === 2) {
    return [[-1.2, 0, 0], [1.2, 0, 0]];
  }

  if (atomCount === 3) {
    return [[0, 1, 0], [-1.2, -0.6, 0], [1.2, -0.6, 0]];
  }

  const positions: [number, number, number][] = [];
  const angleStep = (Math.PI * 2) / atomCount;
  const radius = atomCount * 0.5;
  for (let i = 0; i < atomCount; i++) {
    const angle = i * angleStep;
    positions.push([
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      (i % 2) * 0.4 - 0.2,
    ]);
  }
  return positions;
}

function computeBondTransform(
  start: [number, number, number],
  end: [number, number, number]
) {
  const startVec = new Vector3(...start);
  const endVec = new Vector3(...end);
  const mid = new Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const dir = new Vector3().subVectors(endVec, startVec);
  const len = dir.length();
  dir.normalize();

  const up = new Vector3(0, 1, 0);
  const cross = new Vector3().crossVectors(up, dir).normalize();
  const dot = Math.max(-1, Math.min(1, up.dot(dir)));
  const angle = Math.acos(dot);

  let euler: [number, number, number] = [0, 0, 0];
  if (cross.lengthSq() > 0.0001) {
    const q = new Quaternion().setFromAxisAngle(cross, angle);
    const rot = new Euler().setFromQuaternion(q);
    euler = [rot.x, rot.y, rot.z];
  } else if (dot < 0) {
    euler = [0, 0, Math.PI];
  }

  return {
    midpoint: [mid.x, mid.y, mid.z] as [number, number, number],
    length: len,
    euler,
  };
}

function BondCylinder({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const transform = useMemo(() => computeBondTransform(start, end), [start, end]);

  return (
    <mesh position={transform.midpoint} rotation={transform.euler}>
      <cylinderGeometry args={[0.06, 0.06, transform.length, 8]} />
      <meshStandardMaterial
        color="#8B9A6B"
        roughness={0.6}
        metalness={0.2}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function MoleculeScene({ molecule }: MoleculeViewerProps) {
  const { positions, bonds } = useMemo(() => {
    const pos = layoutAtoms(molecule.atoms.length);

    const bondPairs: { start: [number, number, number]; end: [number, number, number] }[] = [];
    for (let i = 0; i < molecule.atoms.length - 1; i++) {
      bondPairs.push({ start: pos[i], end: pos[i + 1] });
    }
    if (molecule.atoms.length > 2) {
      bondPairs.push({
        start: pos[molecule.atoms.length - 1],
        end: pos[0],
      });
    }

    return { positions: pos, bonds: bondPairs };
  }, [molecule.atoms]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, -3, 3]} intensity={0.4} color="#8B9A6B" />

      {molecule.atoms.map((atom, i) => {
        const color = getAtomColor(atom.element.category);
        const pos = positions[i];
        return (
          <group key={atom.id} position={pos}>
            <mesh>
              <sphereGeometry args={[0.5, 24, 24]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.2}
                roughness={0.4}
                metalness={0.15}
              />
            </mesh>
            <Html
              position={[0, 0.8, 0]}
              center
              style={{ pointerEvents: "none" }}
            >
              <span
                style={{
                  color: "#F5F1EB",
                  fontFamily: "serif",
                  fontWeight: "bold",
                  fontSize: "14px",
                  textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                  userSelect: "none",
                }}
              >
                {atom.element.symbol}
              </span>
            </Html>
          </group>
        );
      })}

      {bonds.map((bond, i) => (
        <BondCylinder key={i} start={bond.start} end={bond.end} />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={1}
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

export default function MoleculeViewer(props: MoleculeViewerProps) {
  return (
    <div className="min-h-[400px] rounded-2xl overflow-hidden bg-[#1a1a2e]">
      <Canvas
        camera={{ position: [0, 1, 8], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true }}
      >
        <MoleculeScene {...props} />
      </Canvas>
    </div>
  );
}
