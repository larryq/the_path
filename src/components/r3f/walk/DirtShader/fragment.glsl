varying vec3 vWorldPosition;
varying vec3 vNormal;

uniform float uNoiseScale;
uniform float uGrainScale;
uniform vec3 uDirtColorLight;
uniform vec3 uDirtColorDark;
uniform vec3 uPebbleColor;
uniform vec3 uLightDirection;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;

// Simple 2D hash-based noise — same family as the grass shader's noise()
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0));
  float b = dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Fractal brownian motion -- layered noise for richer variation
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise2D(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

float saturateVal(float x) {
  return clamp(x, 0.0, 1.0);
}

void main() {
  // Large-scale patches of lighter/darker dirt
  float patchNoise = fbm(vWorldPosition.xz * uNoiseScale);
  patchNoise = saturateVal(patchNoise * 0.5 + 0.5);

  vec3 baseColor = mix(uDirtColorDark, uDirtColorLight, patchNoise);

  // Fine grain / pebble detail at higher frequency
  float grainNoise = fbm(vWorldPosition.xz * uGrainScale);
  grainNoise = saturateVal(grainNoise * 0.5 + 0.5);

  float pebbleMask = smoothstep(0.62, 0.78, grainNoise);
  baseColor = mix(baseColor, uPebbleColor, pebbleMask * 0.35);

  // Subtle additional speckle for grittiness
  float speckle = fbm(vWorldPosition.xz * uGrainScale * 3.3 + 17.0);
  baseColor *= 1.0 - saturateVal(speckle) * 0.08;

  // Simple lambert lighting
  vec3 normal = normalize(vNormal);
  float dotNL = saturateVal(dot(normal, uLightDirection));
  vec3 lighting = uAmbientColor + uLightColor * dotNL;

  vec3 finalColor = baseColor * lighting;

  gl_FragColor = vec4(finalColor, 1.0);
}
