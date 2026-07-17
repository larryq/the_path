import * as THREE from "three";

// src/utils/terrainHeight.ts
//
// The noise math (hash2, noise2D, fbm) must match GroundShader/vertex.glsl exactly.
// The constants below are passed as uniforms so they sync automatically.

export const TERRAIN_NOISE_SCALE = 0.925; // frequency of hills
export const TERRAIN_HILL_HEIGHT = 6.8; // max displacement in world units
export const TERRAIN_SAFE_MARGIN = 0.99; // 0-1, how far from path before hills start

// ── Hash function — matches GLSL hash2() ─────────────────────────────────────
function hash2(px: number, py: number): [number, number] {
  const sx = Math.sin(px * 127.1 + py * 311.7) * 43758.5453123;
  const sy = Math.sin(px * 269.5 + py * 183.3) * 43758.5453123;
  return [sx - Math.floor(sx), sy - Math.floor(sy)];
}

// ── Gradient noise — matches GLSL noise2D() ──────────────────────────────────
function noise2D(px: number, py: number): number {
  const ix = Math.floor(px),
    iy = Math.floor(py);
  const fx = px - ix,
    fy = py - iy;

  // Smoothstep
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  // Four corner gradients
  const [g00x, g00y] = hash2(ix, iy);
  const [g10x, g10y] = hash2(ix + 1, iy);
  const [g01x, g01y] = hash2(ix, iy + 1);
  const [g11x, g11y] = hash2(ix + 1, iy + 1);

  // Dot products
  const a = g00x * fx + g00y * fy;
  const b = g10x * (fx - 1) + g10y * fy;
  const c = g01x * fx + g01y * (fy - 1);
  const d = g11x * (fx - 1) + g11y * (fy - 1);

  // Bilinear interpolation
  return (1 - uy) * ((1 - ux) * a + ux * b) + uy * ((1 - ux) * c + ux * d);
}

// ── FBM — matches GLSL fbm() ──────────────────────────────────────────────────
function fbm(px: number, py: number): number {
  let value = 0;
  let amplitude = 0.5;
  for (let i = 0; i < 4; i++) {
    value += amplitude * noise2D(px, py);
    px *= 2.1;
    py *= 2.1;
    amplitude *= 0.5;
  }
  return value;
}

// ── Smoothstep — matches GLSL smoothstep() ───────────────────────────────────
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the terrain height at world position (x, z).
 * safeMask controls how much height is applied — 0.0 = flat, 1.0 = full height.
 * Pass safeMask=1.0 if you've already determined the position is off-path.
 */
export function getTerrainHeight(x: number, z: number, safeMask = 1.0): number {
  const hill =
    fbm(x * TERRAIN_NOISE_SCALE, z * TERRAIN_NOISE_SCALE) * TERRAIN_HILL_HEIGHT;
  return hill * safeMask;
}

/**
 * Computes how much terrain height to apply at a given world XZ position,
 * based on distance from the path spline. Returns 0 near path, 1 far away.
 */
// export function getTerrainSafeMask(
//   x: number,
//   z: number,
//   pathCurve: THREE.CatmullRomCurve3,
//   pathRibbonWidth: number,
// ): number {
//   const pos = new THREE.Vector3(x, 0, z);
//   let minDist = Infinity;

//   for (let i = 0; i <= 400; i++) {
//     const pt = pathCurve.getPointAt(i / 400);
//     const d = pt.distanceTo(pos);
//     if (d < minDist) minDist = d;
//   }

//   return smoothstep(pathRibbonWidth, pathRibbonWidth + 31.0, minDist);
// }

export function getTerrainSafeMask(
  x: number,
  z: number,
  pathCurve: THREE.CatmullRomCurve3,
  pathRibbonWidth: number,
): number {
  const pos = new THREE.Vector3(x, 0, z);
  let minDist = Infinity;

  for (let i = 0; i <= 400; i++) {
    const pt = pathCurve.getPointAt(i / 400);
    const d = pt.distanceTo(pos);
    if (d < minDist) minDist = d;
  }

  const FLAT_ZONE = pathRibbonWidth + 5.0;

  if (minDist < FLAT_ZONE) return 0.0;
  return smoothstep(FLAT_ZONE, FLAT_ZONE + 3.0, minDist);
}
