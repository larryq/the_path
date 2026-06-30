// ─────────────────────────────────────────────────────────────────────────────
// WALK CONFIG
// Everything about the first-person walk experience.
// These are the primary knobs you'll reach for when tuning the feel.
// ─────────────────────────────────────────────────────────────────────────────

export const WALK_CONFIG = {
  // ── Camera ───────────────────────────────────────────────────────────────
  // Eye height above the ground plane in world units.
  // Increase for a taller character feel, decrease for a low/crawling feel.
  cameraHeight: 1.6,

  // Field of view during the walk — wider = more immersive, narrower = cinematic.
  cameraFov: 75,

  // ── Movement ─────────────────────────────────────────────────────────────
  // Forward speed in world units per second.
  walkSpeed: 3.0,

  strafeSpeed: 1.5, // lateral drift units per second

  // How many world units left/right the camera can drift from the path centerline.
  // Beyond this the player is stopped.
  pathBoundaryWidth: 0.08,

  // ── Steering ─────────────────────────────────────────────────────────────
  // Radians per second added to yaw when left/right keys are held.
  steerSpeed: 1.2,

  // Maximum yaw offset from the forward direction in radians.
  // Math.PI/3 = 60° — you can look to your side but not fully behind.
  maxYaw: Math.PI / 3,

  maxPitch: 0.4, // ~23° up/down clamp

  // ── Pop-in animation ─────────────────────────────────────────────────────
  // Nintendo-style nature items scaling up as you walk past them.
  popInDuration: 0.5, // seconds for each item's scale/fade transition
  popInStagger: 0.12, // seconds between successive items along the path
  popInDelay: 1.2, // seconds after walk starts before first item pops

  // ── Lerp to walk start ───────────────────────────────────────────────────
  // Duration of the camera transition from build-phase overhead view
  // down to the walk start position.
  transitionDuration: 2.2, // seconds
};
