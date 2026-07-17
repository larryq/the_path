// src/components/r3f/environment/NightSky.tsx

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWeatherStore } from "../../../stores/useWeatherStore";

const STAR_COUNT = 3000;
const STAR_RADIUS = 200;

export default function NightSky() {
  const pointsRef = useRef<THREE.Points>(null);
  const starGroupRef = useRef<THREE.Group>(null);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uOpacity: { value: 0.0 },
          uTime: { value: 0.0 },
        },
        vertexShader: `
    uniform float uTime;
    attribute float size;
    attribute float phase;
    varying float vBrightness;

    void main() {
      // Each star twinkles at its own rate and phase
      vBrightness = 0.99 + 0.4 * sin(uTime * 2.0 + phase);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (0.8 + 0.4 * sin(uTime * 0.1 + phase));
    }
  `,
        fragmentShader: `
    uniform float uOpacity;
    varying float vBrightness;

    void main() {
      // Circular point shape
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) discard;

      // Soft edge
      float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
      gl_FragColor = vec4(vec3(0.8, 0.85, 1.0) * vBrightness, alpha * uOpacity);
    }
  `,
        transparent: true,
        depthWrite: true,
        depthTest: true,
      }),
    [],
  );

  // Generate stars uniformly distributed on a sphere
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const phases = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Uniform distribution on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      //   positions[i * 3] = STAR_RADIUS * Math.sin(phi) * Math.cos(theta);
      //   positions[i * 3 + 1] = STAR_RADIUS * Math.sin(phi) * Math.sin(theta);
      //   positions[i * 3 + 2] = STAR_RADIUS * Math.cos(phi);
      positions[i * 3] = STAR_RADIUS * Math.sin(phi) * Math.cos(theta); // X
      positions[i * 3 + 1] = STAR_RADIUS * Math.cos(phi); // Y (up)
      positions[i * 3 + 2] = STAR_RADIUS * Math.sin(phi) * Math.sin(theta); // Z

      // Vary star sizes slightly for realism
      sizes[i] = 0.5 + Math.random() * 5.5;

      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    geo.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(0, 0, 0),
      STAR_RADIUS + 10,
    );

    // const mat = new THREE.PointsMaterial({
    //   color: 0xccd6f0, // cool blue-white
    //   size: 0.73,
    //   sizeAttenuation: true,
    //   // transparent: true,
    //   opacity: 0.0, // starts invisible, fades in
    //   depthWrite: true,
    //   depthTest: true,
    //   fog: false,
    // });

    return { geometry: geo, material: mat };
  }, []);

  // Fade stars in/out based on time of day
  useFrame(({ camera, clock }) => {
    if (!pointsRef.current) return;
    const { timeOfDay, lightingLerpProgress } = useWeatherStore.getState();
    if (starGroupRef.current) {
      starGroupRef.current.position.copy(camera.position);
    }
    // Stars visible at night, invisible during day
    const targetOpacity =
      timeOfDay === "night"
        ? lightingLerpProgress * 0.9 // fade in as night arrives
        : (1 - lightingLerpProgress) * 0.9; // fade out as day returns

    const mat = pointsRef.current.material as THREE.ShaderMaterial;
    mat.opacity += (targetOpacity - mat.opacity) * 0.05;
    mat.uniforms.uOpacity.value +=
      (targetOpacity - mat.uniforms.uOpacity.value) * 0.05;
    mat.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={true}
    />
  );
}
