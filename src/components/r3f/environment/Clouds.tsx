// src/components/r3f/environment/Clouds.tsx
// Decorative clouds using Drei's Cloud component.
// Positioned high enough to never interfere with the scene.

import { Cloud, Clouds as DreiClouds } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── Cloud configuration ───────────────────────────────────────────────────────
// Each entry places one cloud cluster.
// position — [x, y, z] in world space
// scale    — overall size multiplier
// opacity  — 0=invisible, 1=fully opaque. Keep below 0.7 for natural look
// speed    — how fast the cloud animates internally
// segments — number of puff segments (more = fluffier, heavier)
// color    — cloud color, slightly warm white looks more natural than pure white

const CLOUD_CONFIGS = [
  {
    position: [-40, 35, -60] as [number, number, number],
    scale: 8,
    opacity: 0.55,
    speed: 0.1,
    segments: 20,
    color: "#f0f4f0",
  },
  {
    position: [60, 40, -50] as [number, number, number],
    scale: 3,
    opacity: 0.5,
    speed: 0.08,
    segments: 24,
    color: "#f4f4f2",
  },
  {
    position: [-20, 45, -80] as [number, number, number],
    scale: 3,
    opacity: 0.45,
    speed: 0.12,
    segments: 28,
    color: "#eef2ee",
  },
  {
    position: [30, 38, 70] as [number, number, number],
    scale: 4,
    opacity: 0.52,
    speed: 0.09,
    segments: 22,
    color: "#f2f4f0",
  },
  {
    position: [-70, 42, 20] as [number, number, number],
    scale: 3,
    opacity: 0.48,
    speed: 0.11,
    segments: 26,
    color: "#f0f2f0",
  },
  {
    position: [80, 36, -20] as [number, number, number],
    scale: 7,
    opacity: 0.58,
    speed: 0.13,
    segments: 18,
    color: "#f4f2f0",
  },
  {
    position: [-50, 50, 50] as [number, number, number],
    scale: 4,
    opacity: 0.42,
    speed: 0.07,
    segments: 30,
    color: "#eef0ee",
  },
];

export default function Clouds() {
  // const cloudsRef = useRef<THREE.Group>(null);

  // useFrame(() => {
  //   if (!cloudsRef.current) return;
  //   cloudsRef.current.traverse((child) => {
  //     child.frustumCulled = false;
  //   });
  // });

  return (
    <DreiClouds frustumCulled={false}>
      {CLOUD_CONFIGS.map((config, i) => (
        <Cloud
          key={i}
          position={config.position}
          scale={config.scale}
          opacity={config.opacity}
          speed={config.speed}
          segments={config.segments}
          color={config.color}
          frustumCulled={true}
        />
      ))}
    </DreiClouds>
  );
}
