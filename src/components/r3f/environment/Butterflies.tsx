import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seededRandom } from "../../../utils/seededRandom";
import { useGridStore } from "../../../stores/useGridStore";
import vertexShader from "./ButterflyShader/vertex.glsl";
import fragmentShader from "./ButterflyShader/fragment.glsl";

// ── Wing geometry builders ────────────────────────────────────────────────────

function buildUpperWing(side: number): THREE.BufferGeometry {
  const N = 32;
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];

  for (let i = 0; i <= N; i++) {
    const t = i / N,
      mt = 1 - t;
    upper.push([
      3 * mt * mt * t * (side * 0.2) +
        3 * mt * t * t * (side * 0.8) +
        t * t * t * (side * 0.9),
      3 * mt * mt * t * 0.3 + 3 * mt * t * t * 0.5 + t * t * t * 0.1,
    ]);
  }
  for (let i = 0; i <= N; i++) {
    const t = i / N,
      mt = 1 - t;
    lower.push([
      mt * mt * mt * (side * 0.9) +
        3 * mt * mt * t * (side * 0.85) +
        3 * mt * t * t * (side * 0.5),
      mt * mt * mt * 0.1 + 3 * mt * mt * t * -0.15 + 3 * mt * t * t * -0.3,
    ]);
  }

  const outline = [...upper, ...lower];
  const verts: number[] = [];
  for (let i = 0; i < outline.length - 1; i++) {
    verts.push(0, 0, 0);
    verts.push(outline[i][0], outline[i][1], 0);
    verts.push(outline[i + 1][0], outline[i + 1][1], 0);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.computeVertexNormals();
  return geo;
}

function buildLowerWing(side: number): THREE.BufferGeometry {
  const N = 32;
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];

  for (let i = 0; i <= N; i++) {
    const t = i / N,
      mt = 1 - t;
    upper.push([
      3 * mt * mt * t * (side * 0.15) +
        3 * mt * t * t * (side * 0.55) +
        t * t * t * (side * 0.5),
      3 * mt * mt * t * -0.1 + 3 * mt * t * t * -0.45 + t * t * t * -0.6,
    ]);
  }
  for (let i = 0; i <= N; i++) {
    const t = i / N,
      mt = 1 - t;
    lower.push([
      mt * mt * mt * (side * 0.5) +
        3 * mt * mt * t * (side * 0.35) +
        3 * mt * t * t * (side * 0.1),
      mt * mt * mt * -0.6 + 3 * mt * mt * t * -0.65 + 3 * mt * t * t * -0.35,
    ]);
  }

  const outline = [...upper, ...lower];
  const verts: number[] = [];
  for (let i = 0; i < outline.length - 1; i++) {
    verts.push(0, 0, 0);
    verts.push(outline[i][0], outline[i][1], 0);
    verts.push(outline[i + 1][0], outline[i + 1][1], 0);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.computeVertexNormals();
  return geo;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface SingleButterflyProps {
  center: [number, number, number]; // group center in world space
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number; // starting angle
  height: number; // absolute Y position
  bobAmount: number;
  bobSpeed: number;
  bobPhase: number;
  phase: number; // flap phase offset
  flapSpeed: number;
  tiltAngle: number;
  wingMaterial: THREE.ShaderMaterial;
  scale?: number;
}

// ── Pre-built shared geometries ───────────────────────────────────────────────
// Built once outside the component — all butterflies share the same geometry
const upperWingGeoL = buildUpperWing(-1);
const upperWingGeoR = buildUpperWing(1);
const lowerWingGeoL = buildLowerWing(-1);
const lowerWingGeoR = buildLowerWing(1);

const bodyGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.45, 6);
const bodyMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a10,
  roughness: 0.8,
});

function SingleButterfly({
  center,
  orbitRadius,
  orbitSpeed,
  orbitAngle,
  height,
  bobAmount,
  bobSpeed,
  bobPhase,
  phase,
  flapSpeed,
  tiltAngle,
  wingMaterial,
  scale = 0.38,
}: SingleButterflyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const leftGroupRef = useRef<THREE.Group>(null);
  const rightGroupRef = useRef<THREE.Group>(null);

  const angleRef = useRef(orbitAngle);

  const leftMaterial = useMemo(() => {
    const mat = wingMaterial.clone();
    mat.uniforms.uSide.value = -1.0;
    return mat;
  }, [wingMaterial]);

  useFrame(({ clock }, delta) => {
    if (
      !groupRef.current ||
      !innerGroupRef.current ||
      !leftGroupRef.current ||
      !rightGroupRef.current
    )
      return;

    const t = clock.getElapsedTime();

    // Advance orbit
    angleRef.current += orbitSpeed * delta;

    // Position
    const a = angleRef.current;
    const x = center[0] + Math.cos(a) * orbitRadius;
    const z = center[2] + Math.sin(a) * orbitRadius;
    const y = height + Math.sin(t * bobSpeed + bobPhase) * bobAmount;

    groupRef.current.position.set(x, y, z);

    // Heading — tangent to circle
    const nx = Math.sin(a) * orbitSpeed;
    const nz = -Math.cos(a) * orbitSpeed;
    if (Math.abs(nx) + Math.abs(nz) > 0.001) {
      groupRef.current.rotation.y = Math.atan2(nx, nz);
    }

    // Asymmetric flap
    const rawFlap = Math.sin(t * flapSpeed + phase);
    const flap = rawFlap > 0 ? rawFlap * 0.55 : rawFlap * 0.1;
    const dih = Math.abs(rawFlap) * 0.3;

    leftGroupRef.current.rotation.y = flap;
    rightGroupRef.current.rotation.y = -flap;
    leftGroupRef.current.rotation.z = dih;
    rightGroupRef.current.rotation.z = -dih;
  });

  return (
    <group ref={groupRef}>
      {/* Inner group handles tilt only */}
      <group
        ref={innerGroupRef}
        rotation={[-THREE.MathUtils.degToRad(tiltAngle), 0, 0]}
        scale={scale}
      >
        {/* Left wings */}
        <group ref={leftGroupRef}>
          <mesh geometry={upperWingGeoL} material={leftMaterial} />
          <mesh geometry={lowerWingGeoL} material={leftMaterial} />
        </group>

        {/* Right wings */}
        <group ref={rightGroupRef}>
          <mesh geometry={upperWingGeoR} material={wingMaterial} />
          <mesh geometry={lowerWingGeoR} material={wingMaterial} />
        </group>

        {/* Body */}
        <mesh
          geometry={bodyGeo}
          material={bodyMat}
          rotation={[0, 0, Math.PI / 2]}
        />

        {/* Antennae */}
        <AntennaLine side={-1} />
        <AntennaLine side={1} />
      </group>
    </group>
  );
}

// ── Antenna helper ────────────────────────────────────────────────────────────
function AntennaLine({ side }: { side: number }) {
  const geo = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(side * 0.08, 0.18, 0),
      new THREE.Vector3(side * 0.12, 0.22, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [side]);

  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color: 0x333320 }),
    [],
  );

  const line = useMemo(() => new THREE.Line(geo, mat), [geo, mat]);

  return <primitive object={line} />;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const BUTTERFLIES_PER_GROUP = 6;
const TILT_ANGLE = 60;
const FLAP_SPEED = 13.0;

// ── ButterflyGroup ────────────────────────────────────────────────────────────

interface ButterflyGroupProps {
  center: [number, number, number];
  wingColor: THREE.ColorRepresentation;
  splotchColor: THREE.ColorRepresentation;
  splotchScale?: number;
  splotchMix?: number;
  scale?: number;
  seed: number; // for deterministic placement within group
}

function ButterflyGroup({
  center,
  wingColor,
  splotchColor,
  splotchScale = 4.0,
  splotchMix = 0.6,
  scale,
  seed,
}: ButterflyGroupProps) {
  // One material per group — all butterflies share it for right wings
  // and clone it internally for left wings
  // One material per group — all butterflies share it for right wings
  // and clone it internally for left wings
  const wingMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uWingColor: { value: new THREE.Color(wingColor) },
          uSplotchColor: { value: new THREE.Color(splotchColor) },
          uSplotchScale: { value: splotchScale },
          uSplotchMix: { value: splotchMix },
          uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.3).normalize() },
          uSide: { value: 1.0 },
        },
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
      }),
    [wingColor, splotchColor, splotchScale, splotchMix],
  );

  // Generate per-butterfly parameters deterministically from seed
  const butterflies = useMemo(() => {
    const rand = seededRandom(seed);
    return Array.from({ length: BUTTERFLIES_PER_GROUP }, (_, i) => ({
      orbitRadius: 0.5 + rand() * 1.0,
      orbitSpeed: 0.2 + rand() * 0.3,
      orbitAngle: (i / BUTTERFLIES_PER_GROUP) * Math.PI * 2 + rand() * 0.3,
      height: center[1] + rand() * 0.8 - 0.4,
      bobAmount: 0.5 + rand() * 0.3,
      bobSpeed: 0.8 + rand() * 0.6,
      bobPhase: rand() * Math.PI * 2,
      phase: rand() * Math.PI * 2,
      flapSpeed: FLAP_SPEED + rand() * 0.8 - 0.4,
    }));
  }, [seed, center[0], center[1], center[2]]);

  return (
    <>
      {butterflies.map((b, i) => (
        <SingleButterfly
          key={i}
          center={center}
          orbitRadius={b.orbitRadius}
          orbitSpeed={b.orbitSpeed}
          orbitAngle={b.orbitAngle}
          height={b.height}
          bobAmount={b.bobAmount}
          bobSpeed={b.bobSpeed}
          bobPhase={b.bobPhase}
          phase={b.phase}
          flapSpeed={23.0}
          tiltAngle={TILT_ANGLE}
          wingMaterial={wingMaterial}
          scale={scale}
        />
      ))}
    </>
  );
}

// ── Default color sets per group ──────────────────────────────────────────────
const GROUP_DEFAULTS = [
  { wingColor: "#f5c842", splotchColor: "#1a0500" }, // yellow / dark brown
  { wingColor: "#5b9ef0", splotchColor: "#0a1a4a" }, // blue / dark blue
  { wingColor: "#e87038", splotchColor: "#1a0800" }, // orange / dark brown
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface ButterfliesProps {
  pathCurve: THREE.CatmullRomCurve3 | null;
  pathLength: number;
  group1WingColor?: THREE.ColorRepresentation;
  group1SplotchColor?: THREE.ColorRepresentation;
  group2WingColor?: THREE.ColorRepresentation;
  group2SplotchColor?: THREE.ColorRepresentation;
  group3WingColor?: THREE.ColorRepresentation;
  group3SplotchColor?: THREE.ColorRepresentation;
  scale?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Butterflies({
  pathCurve,
  pathLength,
  group1WingColor,
  group1SplotchColor,
  group2WingColor,
  group2SplotchColor,
  group3WingColor,
  group3SplotchColor,
  scale,
}: ButterfliesProps) {
  // Determine number of groups based on path length
  const groupCount = pathLength < 10 ? 1 : pathLength < 20 ? 2 : 3;

  // t values along spline for each group count
  const tValues: Record<number, number[]> = {
    1: [0.5],
    2: [0.33, 0.66],
    3: [0.25, 0.5, 0.75],
  };

  // Compute group center positions from spline
  const groupCenters = useMemo(() => {
    if (!pathCurve) return [];
    return tValues[groupCount].map((t) => {
      const pt = pathCurve.getPointAt(t);
      return [pt.x, 2.0, pt.z] as [number, number, number];
    });
  }, [pathCurve, groupCount]);

  // Color overrides — fall back to defaults
  const colors = [
    {
      wingColor: group1WingColor ?? GROUP_DEFAULTS[0].wingColor,
      splotchColor: group1SplotchColor ?? GROUP_DEFAULTS[0].splotchColor,
    },
    {
      wingColor: group2WingColor ?? GROUP_DEFAULTS[1].wingColor,
      splotchColor: group2SplotchColor ?? GROUP_DEFAULTS[1].splotchColor,
    },
    {
      wingColor: group3WingColor ?? GROUP_DEFAULTS[2].wingColor,
      splotchColor: group3SplotchColor ?? GROUP_DEFAULTS[2].splotchColor,
    },
  ];

  if (!pathCurve || groupCenters.length === 0) return null;

  return (
    <>
      {groupCenters.map((center, i) => (
        <ButterflyGroup
          key={i}
          center={center}
          wingColor={colors[i].wingColor}
          splotchColor={colors[i].splotchColor}
          seed={i * 100 + 42}
          scale={0.18}
        />
      ))}
    </>
  );
}
