// ─────────────────────────────────────────────────────────────────────────────
// GRID CONFIG
// All hex grid geometry and visual parameters live here.
// ─────────────────────────────────────────────────────────────────────────────

export const GRID_CONFIG = {
  cols: 25,
  rows: 25,
  tileRadius: 1.0,
  tileScale: 0.96,
  tileGeomRadius: 0.78,
  tileDepth: 0.3,

  tileColor: "#a8d8c8",
  tileColorHover: "#c8ead8",
  tileColorPath: "#f0d080",
  tileColorAdjacent: "#d4a8e0",
  tileColorSelected: "#2b2310",
  tileColorStart: "#f0a050",
  tileColorEnd: "#e06060",

  groundColor: "#1e2e28",

  cameraFov: 45,
  cameraDistance: 58,
  cameraPitch: -0.8,

  cameraTargetX: 4, // shift view left
  cameraTargetZ: 3,

  mobileBreakpoint: 768,
  mobileGridScale: 0.55,
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

/** Axial hex coordinate */
export interface AxialCoord {
  q: number;
  r: number;
}

/** A tile with both its axial coords and world-space position */
export interface TileData extends AxialCoord {
  x: number;
  z: number;
  col: number;
  row: number;
}

/** World-space bounds of the full grid */
export interface GridBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  cx: number;
  cz: number;
}

// ── Math helpers ──────────────────────────────────────────────────────────────

export function axialToWorld(
  q: number,
  r: number,
  radius = GRID_CONFIG.tileRadius,
): { x: number; z: number } {
  const x = radius * Math.sqrt(3) * (q + r / 2);
  const z = radius * (3 / 2) * r;
  return { x, z };
}

export function indexToAxial(
  col: number,
  row: number,
  cols = GRID_CONFIG.cols,
  rows = GRID_CONFIG.rows,
): AxialCoord {
  return {
    q: col - Math.floor(cols / 2),
    r: row - Math.floor(rows / 2),
  };
}

export function axialToIndex(
  q: number,
  r: number,
  cols = GRID_CONFIG.cols,
  rows = GRID_CONFIG.rows,
): { col: number; row: number } {
  return {
    col: q + Math.floor(cols / 2),
    row: r + Math.floor(rows / 2),
  };
}

export const HEX_DIRECTIONS: AxialCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function getNeighbors(q: number, r: number): AxialCoord[] {
  return HEX_DIRECTIONS.map(({ q: dq, r: dr }) => ({ q: q + dq, r: r + dr }));
}
