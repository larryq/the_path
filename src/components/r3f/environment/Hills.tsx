import { useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

// ── Hill placement config ─────────────────────────────────────────────────────
// angle = radians around origin, dist = world units from center
// radius = sphere radius (larger = wider hill)
// seed = controls distortion pattern (any integer)

const HILLS = [
  { angle: 0.3, dist: 95, radius: 28, seed: 1 },
  { angle: 1.1, dist: 110, radius: 22, seed: 2 },
  { angle: 2.0, dist: 85, radius: 35, seed: 3 },
  { angle: 2.8, dist: 120, radius: 18, seed: 4 },
  { angle: 4.2, dist: 90, radius: 25, seed: 5 },
  { angle: 5.1, dist: 105, radius: 30, seed: 6 },
];

// How far below ground the sphere center sits
// 0.55 = roughly 45% of sphere visible above y=0
const BURIAL_RATIO = 0.55;

// Distortion strength — how bumpy the surface is
const DISTORTION = 0.23;

// Texture repeat — low since hills are far away
const TEXTURE_REPEAT = 20;

// ── Simple seeded pseudo-random ───────────────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Single hill geometry with vertex distortion ───────────────────────────────
function makeHillGeometry(radius: number, seed: number): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(radius, 32, 32);
  const rand = seededRandom(seed);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Distortion strength reduces toward poles for smoother top
    const heightFactor = (y / radius + 1) * 0.5; // 0 at bottom, 1 at top
    const strength = radius * DISTORTION * (1.0 - heightFactor * 0.5);

    const dx = (rand() - 0.5) * strength;
    const dy = (rand() - 0.5) * strength * 0.5; // less vertical distortion
    const dz = (rand() - 0.5) * strength;

    pos.setXYZ(i, x + dx, y + dy, z + dz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();

  // Set up uv2 for AO map — copy from uv
  const uv = geo.attributes.uv;
  geo.setAttribute(
    "uv2",
    new THREE.BufferAttribute(new Float32Array(uv.array), 2),
  );

  return geo;
}

// ── Single hill mesh ──────────────────────────────────────────────────────────
interface HillProps {
  position: [number, number, number];
  radius: number;
  seed: number;
  colorMap: THREE.Texture;
  normalMap: THREE.Texture;
  aoMap: THREE.Texture;
}

function Hill({
  position,
  radius,
  seed,
  colorMap,
  normalMap,
  aoMap,
}: HillProps) {
  const geometry = useMemo(
    () => makeHillGeometry(radius, seed),
    [radius, seed],
  );

  return (
    <mesh geometry={geometry} position={position} receiveShadow castShadow>
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.8, 0.8)}
        aoMap={aoMap}
        aoMapIntensity={0.7}
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
}

// ── Hills container — loads textures once, places all hills ──────────────────
function HillsContent() {
  const [colorMap, normalMap, aoMap] = useTexture([
    "/textures/rocky_terrain_02_diff_1k.jpg",
    "/textures/rocky_terrain_02_nor_gl_1k.jpg",
    "/textures/rocky_terrain_02_ao_1k.jpg",
  ]);

  useMemo(() => {
    [colorMap, normalMap, aoMap].forEach((tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(TEXTURE_REPEAT, TEXTURE_REPEAT);
    });
  }, [colorMap, normalMap, aoMap]);

  return (
    <>
      {HILLS.map((h, i) => {
        const x = Math.cos(h.angle) * h.dist;
        const z = Math.sin(h.angle) * h.dist;
        const y = -h.radius * BURIAL_RATIO;

        return (
          <Hill
            key={i}
            position={[x, y, z]}
            radius={h.radius}
            seed={h.seed}
            colorMap={colorMap}
            normalMap={normalMap}
            aoMap={aoMap}
          />
        );
      })}
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function Hills() {
  return (
    <Suspense fallback={null}>
      <HillsContent />
    </Suspense>
  );
}
