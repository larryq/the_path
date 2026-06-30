// ─────────────────────────────────────────────────────────────────────────────
// WALK CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export const WALK_CONFIG = {
  cameraHeight: 1.6,
  cameraFov: 75,
  walkSpeed: 3.0,
  pathBoundaryWidth: 3.0,
  pathRibbonWidth: 1.8,
  mouseSensitivity: 0.005,
  strafeSpeed: 1.5, // lateral drift units per second
  steerSpeed: 1.2,
  maxPitch: 0.5,
  maxYaw: Math.PI * 2,
  popInDuration: 0.5,
  popInStagger: 0.12,
  popInDelay: 1.2,
  transitionDuration: 2.2,
} as const;
