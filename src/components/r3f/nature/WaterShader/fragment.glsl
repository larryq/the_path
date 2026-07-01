uniform float uTime;
uniform vec3 uWaterColorShallow;
uniform vec3 uWaterColorDeep;
uniform vec3 uRippleColor;
uniform float uOpacity;
uniform float uRippleFrequency;
uniform float uRippleSpeed;
uniform float uFoamStrength;
uniform vec3 uLightDirection;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;

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

float saturateVal(float x) {
  return clamp(x, 0.0, 1.0);
}

void main() {
  // Distance from center for radial effects
  vec2 centered = vUv - 0.5;
  float dist = length(centered) * 2.0;

  // Ripple pattern in UV space for visual effect
  float ripplePattern = sin(dist * uRippleFrequency - uTime * uRippleSpeed);
  ripplePattern = ripplePattern * 0.5 + 0.5;  // remap to 0-1

  // Second ripple layer offset in time and frequency
  float ripplePattern2 = sin(dist * uRippleFrequency * 1.6 - uTime * uRippleSpeed * 1.4 + 0.8);
  ripplePattern2 = ripplePattern2 * 0.5 + 0.5;

  // Combine ripple patterns
  float ripples = mix(ripplePattern, ripplePattern2, 0.4);

  // Noise for organic variation
  float noiseVal = fbm(vUv * 4.0 + uTime * 0.25);
  noiseVal = noiseVal * 0.5 + 0.5;

  // Base water color — blend between shallow and deep based on distance from center
  vec3 waterColor = mix(uWaterColorShallow, uWaterColorDeep, dist * 0.7);

  // Add ripple color highlights
  waterColor = mix(waterColor, uRippleColor, ripples * 0.25);

  // Noise variation
  waterColor = mix(waterColor, uWaterColorShallow, noiseVal * 0.15);

  // Foam/white at ripple crests near center
  float foamMask = smoothstep(0.7, 0.95, ripples) * 
                   (1.0 - smoothstep(0.0, 0.4, dist)) * 
                   uFoamStrength;
  waterColor = mix(waterColor, vec3(0.9, 0.95, 1.0), foamMask);

  // Simple lighting
  vec3 normal = normalize(vNormal);
  float dotNL = saturateVal(dot(normal, normalize(uLightDirection)));
  float ambient = 0.5;
  float lighting = ambient + (1.0 - ambient) * dotNL;
  waterColor *= lighting;

  // Specular highlight
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 halfVec = normalize(normalize(uLightDirection) + viewDir);
  float spec = pow(saturateVal(dot(normal, halfVec)), 64.0);
  waterColor += vec3(spec * 0.4);

  // Edge fade for soft boundary
  float edgeFade = 1.0 - smoothstep(0.75, 1.0, dist);

  gl_FragColor = vec4(waterColor, uOpacity * edgeFade);
}
