// ─────────────────────────────────────────────────────────────────────────────
// NATURE ITEMS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export type NatureCategory = "tree" | "plant" | "water" | "object";

export interface NatureItem {
  id: string;
  label: string;
  emoji: string;
  description: string;
  component: string;
  props: Record<string, unknown>;
  windAffected: boolean;
  windNode: string | null;
  groundOffset: number;
  category: NatureCategory;
}

export const NATURE_ITEMS: NatureItem[] = [
  {
    id: "pine",
    label: "Pine Tree",
    emoji: "🌲",
    description: "A tall, pointed evergreen. Casts long shadows.",
    component: "PineTree",
    props: {},
    windAffected: true,
    windNode: "pine_leaves",
    groundOffset: 0,
    category: "tree",
  },
  {
    id: "deciduous",
    label: "Oak Tree",
    emoji: "🌳",
    description: "A broad, round-canopied oak. Ancient and sturdy.",
    component: "DeciduousTree",
    props: {},
    windAffected: true,
    windNode: "oak_leaves",
    groundOffset: 0,
    category: "tree",
  },
  {
    id: "willow",
    label: "Willow Tree",
    emoji: "🌿",
    description: "Trailing branches sweep gently in the breeze.",
    component: "WillowTree",
    props: {},
    windAffected: true,
    windNode: "willow_fronds",
    groundOffset: 0,
    category: "tree",
  },
  {
    id: "flowers_red",
    label: "Red Flowers",
    emoji: "🌺",
    description: "A bright scatter of red blooms.",
    component: "FlowerPatch",
    props: { color: "red" },
    windAffected: true,
    windNode: null,
    groundOffset: 0,
    category: "plant",
  },
  {
    id: "flowers_blue",
    label: "Blue Flowers",
    emoji: "💐",
    description: "Delicate blue wildflowers nodding in the wind.",
    component: "FlowerPatch",
    props: { color: "blue" },
    windAffected: true,
    windNode: null,
    groundOffset: 0,
    category: "plant",
  },
  {
    id: "flowers_green",
    label: "Green Flowers",
    emoji: "🌼",
    description: "Unusual chartreuse blooms — rare and striking.",
    component: "FlowerPatch",
    props: { color: "green" },
    windAffected: true,
    windNode: null,
    groundOffset: 0,
    category: "plant",
  },
  {
    id: "flowers_yellow",
    label: "Yellow Flowers",
    emoji: "�",
    description: "Bright and cheerful yellow blooms.",
    component: "FlowerPatch",
    props: { color: "yellow" },
    windAffected: true,
    windNode: null,
    groundOffset: 0,
    category: "plant",
  },
  {
    id: "ferns",
    label: "Fern Cluster",
    emoji: "🌿",
    description: "Dense ground ferns. Cool and shaded beneath.",
    component: "FernCluster",
    props: {},
    windAffected: true,
    windNode: null,
    groundOffset: 0,
    category: "plant",
  },
  {
    id: "mushrooms",
    label: "Mushroom Ring",
    emoji: "🍄",
    description: "A fairy ring of spotted mushrooms.",
    component: "MushroomRing",
    props: {},
    windAffected: false,
    windNode: null,
    groundOffset: 0,
    category: "plant",
  },
  {
    id: "berry_bush",
    label: "Berry Bush",
    emoji: "🫐",
    description: "Plump berries cluster on dark green leaves.",
    component: "BerryBush",
    props: {},
    windAffected: true,
    windNode: null,
    groundOffset: 0,
    category: "plant",
  },
  {
    id: "vine",
    label: "Vine",
    emoji: "🌿",
    description: "A winding vine covered in lush green leaves.",
    component: "Vine1",
    props: {},
    windAffected: false,
    windNode: null,
    groundOffset: 0,
    category: "plant",
  },
  {
    id: "hay_bale",
    label: "Hay Bale",
    emoji: "🌾",
    description: "A round bale of golden hay. Smells like summer.",
    component: "HayBale",
    props: {},
    windAffected: false,
    windNode: null,
    groundOffset: 0,
    category: "object",
  },
  {
    id: "boulders",
    label: "Boulders & Grass",
    emoji: "🪨",
    description: "Mossy granite boulders nestled in thick grass.",
    component: "BoulderGrass",
    props: {},
    windAffected: false,
    windNode: null,
    groundOffset: 0,
    category: "object",
  },
  {
    id: "brook",
    label: "Bubbling Brook",
    emoji: "💧",
    description: "Clear water over smooth stones. Auto-connects to neighbors.",
    component: "Brook",
    props: { direction: 0 },
    windAffected: false,
    windNode: null,
    groundOffset: 0,
    category: "water",
  },
  {
    id: "bush",
    label: "Bush",
    emoji: "🌿",
    description: "Just a regular bush.",
    component: "Bush",
    props: { direction: 0 },
    windAffected: true,
    windNode: null,
    groundOffset: 0,
    category: "tree",
  },
];

export const NATURE_BY_ID: Record<string, NatureItem> = Object.fromEntries(
  NATURE_ITEMS.map((n) => [n.id, n]),
);

export const NATURE_BY_CATEGORY: Record<NatureCategory, NatureItem[]> =
  NATURE_ITEMS.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<NatureCategory, NatureItem[]>,
  );

export const CATEGORIES: NatureCategory[] = [
  "tree",
  "plant",
  "water",
  "object",
];
