uniform sampler2D tileDataTexture;
uniform float uHillHeight;
uniform float uNoiseScale;
uniform float uSafeMargin;
uniform float uPatchSize;
uniform float uTextureRepeat;

varying vec2 vUv;
varying vec3 vWorldPos;

// ── Noise — must match terrainHeight.ts exactly ───────────────────────────────

vec2 hash2(vec2 p) {
  float sx = sin(p.x * 127.1 + p.y * 311.7) * 43758.5453123;
  float sy = sin(p.x * 269.5 + p.y * 183.3) * 43758.5453123;
  return vec2(sx - floor(sx), sy - floor(sy));
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  vec2 g00 = hash2(i + vec2(0,0));
  vec2 g10 = hash2(i + vec2(1,0));
  vec2 g01 = hash2(i + vec2(0,1));
  vec2 g11 = hash2(i + vec2(1,1));

  float a = dot(g00, f - vec2(0,0));
  float b = dot(g10, f - vec2(1,0));
  float c = dot(g01, f - vec2(0,1));
  float d = dot(g11, f - vec2(1,1));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise2D(p);
    p *= 2.1;
    amplitude *= 0.5;
  }
  return value;
}

// ── Main ──────────────────────────────────────────────────────────────────────

void main() {
  vec4 worldPos4 = modelMatrix * vec4(position, 1.0);
  vec3 worldPos = worldPos4.xyz;

  // Sample tileDataTexture for path mask
  vec2 maskUV = vec2(
    worldPos.x / uPatchSize + 0.5,
    1.0 - (worldPos.z / uPatchSize + 0.5)
  );
  float mask = texture2D(tileDataTexture, maskUV).r;

  // Safe margin — only undulate well outside path
  float safeMask = smoothstep(uSafeMargin, 1.0, mask);

  // Terrain height
  float hill = fbm(worldPos.xz * uNoiseScale) * uHillHeight;
  worldPos.y += hill * safeMask;

  vUv      = uv * uTextureRepeat;
  vWorldPos = worldPos;

  gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
}