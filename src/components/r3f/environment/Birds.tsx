// src/components/r3f/environment/Birds.tsx
// Animated birds circling overhead — simple V-shaped wing geometry
// with flapping animation and lazy circular flight paths.

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Flock configuration ───────────────────────────────────────────────────────
// Each entry is one bird. Tune these to taste.
// radius  — how far from origin the bird circles (world units)
// height  — how high above ground (world units)
// speed   — radians per second around the circle
// phase   — starting angle offset (radians) — spreads birds out
// flapSpeed — wing flap frequency
// flapAmount — max wing angle in radians

const FLOCK = [
  {
    radius: 48,
    height: 22,
    speed: 0.18,
    phase: 0.0,
    flapSpeed: 2.8,
    flapAmount: 0.28,
  },
  {
    radius: 55,
    height: 26,
    speed: 0.14,
    phase: 1.2,
    flapSpeed: 2.4,
    flapAmount: 0.32,
  },
  {
    radius: 42,
    height: 19,
    speed: 0.22,
    phase: 2.5,
    flapSpeed: 3.1,
    flapAmount: 0.25,
  },
  {
    radius: 61,
    height: 30,
    speed: 0.12,
    phase: 3.8,
    flapSpeed: 2.2,
    flapAmount: 0.3,
  },
  {
    radius: 50,
    height: 24,
    speed: 0.16,
    phase: 5.0,
    flapSpeed: 2.9,
    flapAmount: 0.27,
  },
  {
    radius: 44,
    height: 20,
    speed: 0.2,
    phase: 0.8,
    flapSpeed: 3.3,
    flapAmount: 0.24,
  },
  {
    radius: 58,
    height: 28,
    speed: 0.13,
    phase: 4.2,
    flapSpeed: 2.6,
    flapAmount: 0.31,
  },
  {
    radius: 40,
    height: 12,
    speed: 0.13,
    phase: 4.2,
    flapSpeed: 2.6,
    flapAmount: 0.31,
  },
];

// Wing geometry dimensions
const WING_LENGTH = 0.9; // how long each wing is
const WING_WIDTH = 0.28; // chord width of the wing
const WING_THICK = 0.04; // thickness
const BODY_LENGTH = 0.5; // small body in the center
const BIRD_COLOR = "#1a1a18";

// ── Single bird component ─────────────────────────────────────────────────────
interface BirdConfig {
  radius: number;
  height: number;
  speed: number;
  phase: number;
  flapSpeed: number;
  flapAmount: number;
}

function Bird({
  radius,
  height,
  speed,
  phase,
  flapSpeed,
  flapAmount,
}: BirdConfig) {
  const groupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);

  // Track current angle in a ref — no re-renders needed
  const angleRef = useRef(phase);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !leftWingRef.current || !rightWingRef.current)
      return;

    // Advance angle
    angleRef.current += speed * delta;

    // Circular position with gentle vertical bob
    const a = angleRef.current;
    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;
    const y = height + Math.sin(a * 2.3 + phase) * 1.5;

    groupRef.current.position.set(x, y, z);

    // Face the direction of travel — tangent to the circle
    // Tangent at angle a is (-sin(a), 0, cos(a))
    groupRef.current.rotation.y = -a + Math.PI * 0.5;

    // Slight bank into the turn
    groupRef.current.rotation.z = -0.15;

    // Wing flap
    const flap = Math.sin(clock.elapsedTime * flapSpeed + phase) * flapAmount;
    leftWingRef.current.rotation.z = flap;
    rightWingRef.current.rotation.z = -flap;
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[BODY_LENGTH, WING_THICK, WING_WIDTH * 0.6]} />
        <meshBasicMaterial color={BIRD_COLOR} />
      </mesh>

      {/* Left wing */}
      <mesh ref={leftWingRef} position={[-WING_LENGTH * 0.5, 0, 0]}>
        <boxGeometry args={[WING_LENGTH, WING_THICK, WING_WIDTH]} />
        <meshBasicMaterial color={BIRD_COLOR} />
      </mesh>

      {/* Right wing */}
      <mesh ref={rightWingRef} position={[WING_LENGTH * 0.5, 0, 0]}>
        <boxGeometry args={[WING_LENGTH, WING_THICK, WING_WIDTH]} />
        <meshBasicMaterial color={BIRD_COLOR} />
      </mesh>
    </group>
  );
}

// ── Flock ─────────────────────────────────────────────────────────────────────
export default function Birds() {
  return (
    <>
      {FLOCK.map((config, i) => (
        <Bird key={i} {...config} />
      ))}
    </>
  );
}
