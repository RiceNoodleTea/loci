"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import QuarkParticle from "./QuarkParticle";

interface NucleonParticleProps {
  position: [number, number, number];
  type: "proton" | "neutron";
  showQuarks?: boolean;
}

const NUCLEON_COLORS = {
  proton: "#E8A85D",
  neutron: "#A0A0A0",
} as const;

const QUARK_OFFSET = 0.18;

const QUARK_CONFIGS = {
  proton: [
    { type: "up" as const, pos: [0, QUARK_OFFSET, 0] as [number, number, number] },
    { type: "up" as const, pos: [-QUARK_OFFSET, -QUARK_OFFSET * 0.5, 0] as [number, number, number] },
    { type: "down" as const, pos: [QUARK_OFFSET, -QUARK_OFFSET * 0.5, 0] as [number, number, number] },
  ],
  neutron: [
    { type: "up" as const, pos: [0, QUARK_OFFSET, 0] as [number, number, number] },
    { type: "down" as const, pos: [-QUARK_OFFSET, -QUARK_OFFSET * 0.5, 0] as [number, number, number] },
    { type: "down" as const, pos: [QUARK_OFFSET, -QUARK_OFFSET * 0.5, 0] as [number, number, number] },
  ],
} as const;

export default function NucleonParticle({
  position,
  type,
  showQuarks = false,
}: NucleonParticleProps) {
  const meshRef = useRef<Mesh>(null);
  const color = NUCLEON_COLORS[type];

  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse =
      1 + Math.sin(state.clock.elapsedTime * 1.5 + position[0] * 2) * 0.04;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={showQuarks ? 0.35 : 0.85}
        />
      </mesh>

      {showQuarks &&
        QUARK_CONFIGS[type].map((q, i) => (
          <QuarkParticle key={i} position={q.pos} type={q.type} scale={0.8} />
        ))}
    </group>
  );
}
