// ─────────────────────────────────────────────────────────────────────────────
// NATURE ITEMS CONFIG
// This is the single source of truth for every placeable nature item.
// The dialog, factory, and pop-in system all derive from this array.
//
// To add a new item:  push a new entry here. Done.
// To remove an item: delete its entry here. Done.
//
// Field reference:
//   id          — unique string key, used in grid store and URL params
//   label       — human-readable name shown in the dialog
//   emoji       — icon shown in the dialog card (placeholder until GLB art arrives)
//   description — one-line flavor text for the dialog card
//   component   — (string) name of the R3F component in /nature/ folder
//   props       — default props forwarded to the component
//   windAffected — whether this item receives wind uniforms (leaves sway etc.)
//   windNode    — if GLB: which mesh node gets the wind shader
//   groundOffset — Y nudge in world units if GLB origin isn't ground-level (default 0)
//   category    — groups items in the dialog: 'tree' | 'plant' | 'water' | 'object'
// ─────────────────────────────────────────────────────────────────────────────

export const NATURE_ITEMS = [
  // ── Trees ────────────────────────────────────────────────────────────────
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

  // ── Plants ───────────────────────────────────────────────────────────────
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
  // {
  //   id: "berry_bush",
  //   label: "Berry Bush",
  //   emoji: "🫐",
  //   description: "Plump berries cluster on dark green leaves.",
  //   component: "BerryBush",
  //   props: {},
  //   windAffected: true,
  //   windNode: null,
  //   groundOffset: 0,
  //   category: "plant",
  // },
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

  // ── Objects ──────────────────────────────────────────────────────────────
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

  // ── Water ────────────────────────────────────────────────────────────────
  {
    id: "brook",
    label: "Bubbling Brook",
    emoji: "💧",
    description: "Clear water over smooth stones. Auto-connects to neighbors.",
    component: "Brook",
    props: { direction: 0 }, // 0-5 edge index; UI lets you pick
    windAffected: false,
    windNode: null,
    groundOffset: 0,
    category: "water",
  },
];

// Convenience lookup by id
export const NATURE_BY_ID = Object.fromEntries(
  NATURE_ITEMS.map((n) => [n.id, n]),
);

// Items grouped by category (for dialog tabs)
export const NATURE_BY_CATEGORY = NATURE_ITEMS.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {});

export const CATEGORIES = ["tree", "plant", "water", "object"];
