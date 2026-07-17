// ─────────────────────────────────────────────────────────────────────────────
// LIGHTING CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export type TimeOfDay = "day" | "night";

export interface LightPreset {
  color: number;
  intensity: number;
  position: [number, number, number];
  castShadow?: boolean;
}

export interface SkyPreset {
  sunElevation: number;
  azimuth: number;
  turbidity: number;
  rayleigh: number;
  mieCoefficient: number;
  mieDirectionalG: number;
}

export interface FogPreset {
  color: string;
  near: number;
  far: number;
}

export interface LightingPreset {
  key: LightPreset;
  fill: LightPreset;
  ambient: Omit<LightPreset, "position" | "castShadow">;
  rim: LightPreset;
  sky: SkyPreset;
  fog: FogPreset;
  moon: Omit<LightPreset, "castShadow">;
}

export const LIGHTING_PRESETS: Record<TimeOfDay, LightingPreset> = {
  day: {
    key: {
      color: 0xfff4e6,
      intensity: 2.0,
      position: [-15, 12, 8],
      castShadow: true,
    },
    fill: {
      color: 0x87ceeb,
      intensity: 0.6,
      position: [10, 5, -6],
    },
    ambient: {
      color: 0xfff8f0,
      intensity: 0.4,
    },
    rim: {
      color: 0xffd7a3,
      intensity: 0.3,
      position: [5, 10, -12],
    },
    sky: {
      sunElevation: 0.3,
      azimuth: 0.25,
      turbidity: 8,
      rayleigh: 2,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
    },
    fog: {
      color: "#c8e8d8",
      near: 30,
      far: 80,
    },
    moon: {
      color: 0x000000, // invisible during day
      intensity: 0.0,
      position: [10, 15, -8] as [number, number, number],
    },
  },

  night: {
    key: {
      color: 0x3d5a7a,
      intensity: 1.25,
      position: [-10, 15, 5],
      castShadow: true,
    },
    fill: {
      color: 0x3d5a7a,
      intensity: 0.15,
      position: [10, 5, -6],
    },
    ambient: {
      color: 0x4a5568,
      intensity: 0.08,
    },
    rim: {
      color: 0x7a8faa,
      intensity: 0.1,
      position: [5, 10, -12],
    },
    sky: {
      sunElevation: -0.1,
      azimuth: 0.25,
      turbidity: 20,
      rayleigh: 0.5,
      mieCoefficient: 0.001,
      mieDirectionalG: 0.95,
    },
    fog: {
      color: "#0a1020",
      near: 15,
      far: 50,
    },
    moon: {
      color: 0xccd6f0, // cool blue-white moonlight
      intensity: 0.6,
      position: [10, 15, -8] as [number, number, number],
    },
  },
};

export const LIGHTING_LERP_DURATION = 3.0;
