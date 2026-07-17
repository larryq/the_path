uniform sampler2D uColorMap;
uniform sampler2D uNormalMap;
uniform sampler2D uAoMap;
uniform float uAoIntensity;
uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;
uniform vec3 uColorTint;

varying vec2 vUv;
varying vec3 vWorldPos;

void main() {
  // Sample textures
  vec3 albedo = texture2D(uColorMap, vUv).rgb * uColorTint;
  vec3 aoSample = texture2D(uAoMap, vUv).rgb;
  vec3 normalSample = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;

  // Recompute geometric normal from position derivatives
  vec3 dx = dFdx(vWorldPos);
  vec3 dz = dFdy(vWorldPos);
  vec3 geoNormal = normalize(cross(dx, dz))  ;

  // Blend normal map with geometric normal
  // normalSample.rg perturbs the geometric normal in XZ
  vec3 normal = normalize(geoNormal + vec3(normalSample.r, 0.0, normalSample.g) * 0.5);

  // Lighting
  float dotNL = max(0.0, dot(normal, normalize(uLightDir)));
  vec3 lighting = uAmbientColor + uLightColor * dotNL;

  // AO
  float ao = mix(1.0, aoSample.r, uAoIntensity);

  vec3 color = albedo * lighting * ao;

  gl_FragColor = vec4(color, 1.0);
}