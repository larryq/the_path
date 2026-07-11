varying vec3 vPos;
varying vec3 vNormal;

uniform vec3 uWingColor;
uniform vec3 uSplotchColor;
uniform float uSplotchScale;
uniform float uSplotchMix;
uniform vec3 uLightDir;
uniform float uSide;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i), f), dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
    mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)), dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x),
    u.y
  ) * 0.5 + 0.5;
}

float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = vec2(vPos.x * uSide, vPos.y);
  float n = fbm(uv * uSplotchScale);
  float splotch = smoothstep(0.42, 0.62, n);
  float dist = length(vPos.xy);
  float border = smoothstep(0.3, 0.85, dist);
  float pattern = clamp(splotch * 0.7 + border * 0.5, 0.0, 1.0) * uSplotchMix;
  vec3 color = mix(uWingColor, uSplotchColor, pattern);
  float light = 0.45 + 0.55 * abs(dot(normalize(vNormal), normalize(uLightDir)));
  color *= light;
  gl_FragColor = vec4(color, 1.0);
}