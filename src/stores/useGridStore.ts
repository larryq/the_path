import { create } from "zustand";
import { getNeighbors, AxialCoord } from "../config/grid.config";
import { NATURE_ITEMS } from "../config/natureItems.config";

// ── Helpers ───────────────────────────────────────────────────────────────────

const tileKey = (q: number, r: number): string => `${q},${r}`;

const areAdjacent = (a: AxialCoord, b: AxialCoord): boolean => {
  const dq = b.q - a.q;
  const dr = b.r - a.r;
  return (
    Math.abs(dq) <= 1 &&
    Math.abs(dr) <= 1 &&
    Math.abs(dq + dr) <= 1 &&
    !(dq === 0 && dr === 0)
  );
};

const computeAdjacentTiles = (path: AxialCoord[]): AxialCoord[] => {
  const pathSet = new Set(path.map((t) => tileKey(t.q, t.r)));
  const adjacent = new Set<string>();

  path.forEach(({ q, r }) => {
    getNeighbors(q, r).forEach((n) => {
      const k = tileKey(n.q, n.r);
      if (!pathSet.has(k)) adjacent.add(k);
    });
  });

  return [...adjacent].map((k) => {
    const [q, r] = k.split(",").map(Number);
    return { q, r };
  });
};

// ── State shape ───────────────────────────────────────────────────────────────

interface GridState {
  path: AxialCoord[];
  pathSet: Set<string>;
  isDragging: boolean;
  pathCommitted: boolean;
  adjacentTiles: AxialCoord[];
  adjacentSet: Set<string>;
  placedNature: Record<string, string>; // "q,r" → nature item id
  dialogTile: AxialCoord | null;

  startDrag: (q: number, r: number) => void;
  extendPath: (q: number, r: number) => void;
  commitPath: () => void;
  openDialog: (q: number, r: number) => void;
  closeDialog: () => void;
  placeNature: (q: number, r: number, natureId: string) => void;
  resetGrid: () => void;
  fillInMissingNature: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useGridStore = create<GridState>((set, get) => ({
  path: [],
  pathSet: new Set(),
  isDragging: false,
  pathCommitted: false,
  adjacentTiles: [],
  adjacentSet: new Set(),
  placedNature: {},
  dialogTile: null,

  startDrag: (q, r) =>
    set({
      isDragging: true,
      pathCommitted: false,
      path: [{ q, r }],
      pathSet: new Set([tileKey(q, r)]),
      adjacentTiles: [],
      adjacentSet: new Set(),
      placedNature: {},
      dialogTile: null,
    }),

  extendPath: (q, r) => {
    const { path, pathSet, isDragging } = get();
    if (!isDragging) return;
    const k = tileKey(q, r);
    if (pathSet.has(k)) return;
    const last = path[path.length - 1];
    if (!areAdjacent(last, { q, r })) return;
    set({
      path: [...path, { q, r }],
      pathSet: new Set([...pathSet, k]),
    });
  },

  commitPath: () => {
    const { path } = get();
    if (path.length < 2) {
      set({ isDragging: false, path: [], pathSet: new Set() });
      return;
    }
    const adjacent = computeAdjacentTiles(path);
    set({
      isDragging: false,
      pathCommitted: true,
      adjacentTiles: adjacent,
      adjacentSet: new Set(adjacent.map((t) => tileKey(t.q, t.r))),
    });
  },

  openDialog: (q, r) => {
    if (!get().adjacentSet.has(tileKey(q, r))) return;
    set({ dialogTile: { q, r } });
  },

  closeDialog: () => set({ dialogTile: null }),

  placeNature: (q, r, natureId) =>
    set((s) => ({
      placedNature: { ...s.placedNature, [tileKey(q, r)]: natureId },
      dialogTile: null,
    })),

  fillInMissingNature: () => {
    const current = { ...get().placedNature };
    get().adjacentTiles.forEach(({ q, r }) => {
      const k = tileKey(q, r);
      if (!current[k]) {
        const item =
          NATURE_ITEMS[Math.floor(Math.random() * NATURE_ITEMS.length)];
        current[k] = item.id;
      }
    });
    set({ placedNature: current, dialogTile: null });
  },

  resetGrid: () =>
    set({
      path: [],
      pathSet: new Set(),
      isDragging: false,
      pathCommitted: false,
      adjacentTiles: [],
      adjacentSet: new Set(),
      placedNature: {},
      dialogTile: null,
    }),
}));
