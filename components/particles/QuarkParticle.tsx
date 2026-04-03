"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

interface QuarkParticleProps {
  position: [number, number, number];
  type: "up" | "down";
  scale?: number;
}

const QUARK_COLORS = {
  up: "#E85D5D",
  down: "#5D8DE8",
} as const;

export default function QuarkParticle({
  position,
  type,
  scale = 1,
}: QuarkParticleProps) {
  const meshRef = useRef<Mesh>(null);
  const color = QUARK_COLORS[type];
  const initialY = position[1];

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      initialY + Math.sin(state.clock.elapsedTime * 2 + position[0] * 3) * 0.03;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}
