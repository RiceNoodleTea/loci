"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

interface ElectronOrbitProps {
  radius: number;
  electronCount: number;
  shellIndex: number;
  speed?: number;
}

const ELECTRON_COLOR = "#E8E85D";
const ORBIT_RING_COLOR = "#8B9A6B";

export default function ElectronOrbit({
  radius,
  electronCount,
  shellIndex,
  speed = 1,
}: ElectronOrbitProps) {
  const groupRef = useRef<Group>(null);

  const tiltX = (shellIndex * 60 * Math.PI) / 180;
  const tiltZ = (shellIndex * 25 * Math.PI) / 180;

  const electronAngles = useMemo(() => {
    const angles: number[] = [];
    for (let i = 0; i < electronCount; i++) {
      angles.push((i / electronCount) * Math.PI * 2);
    }
    return angles;
  }, [electronCount]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y =
      state.clock.elapsedTime * speed * (0.5 + shellIndex * 0.15);
  });

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 8, 64]} />
        <meshStandardMaterial
          color={ORBIT_RING_COLOR}
          transparent
          opacity={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Orbiting electrons */}
      <group ref={groupRef}>
        {electronAngles.map((angle, i) => {
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <mesh key={i} position={[x, 0, z]}>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial
                color={ELECTRON_COLOR}
                emissive={ELECTRON_COLOR}
                emissiveIntensity={0.8}
                roughness={0.2}
                metalness={0.3}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
