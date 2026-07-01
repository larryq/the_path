uniform float uTime;
uniform float uRippleHeight;
uniform float uRippleFrequency;
uniform float uRippleSpeed;
uniform float uNoiseStrength;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

// 2D hash noise
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

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += amplitude * noise2D(p);
    p *= 2.1;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vUv = uv;

  vec3 pos = position;

  // Distance from center of plane for radial ripples
  float dist = length(pos.xz);

  // Primary radial ripple — sine wave radiating outward from center
  float ripple = sin(dist * uRippleFrequency - uTime * uRippleSpeed) * uRippleHeight;

  // Dampen ripples toward the edges so they don't pop at the boundary
  float edgeDamp = 1.0 - smoothstep(0.3, 0.5, dist);
  ripple *= edgeDamp;

  // Organic noise layer on top
  float noiseVal = fbm(pos.xz * 2.5 + uTime * 0.4) * uNoiseStrength;

  // Secondary smaller ripples at different frequency/speed
  float ripple2 = sin(dist * uRippleFrequency * 1.7 - uTime * uRippleSpeed * 1.3 + 1.2) 
                  * uRippleHeight * 0.4 * edgeDamp;

  pos.y += ripple + ripple2 + noiseVal;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
