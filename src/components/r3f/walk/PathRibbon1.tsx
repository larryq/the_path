import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from "./DirtShader/vertex.glsl";
import fragmentShader from "./DirtShader/fragment.glsl";

interface PathRibbonProps {
  geometry: THREE.BufferGeometry | null;
}

export default function PathRibbon({ geometry }: PathRibbonProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uNoiseScale: { value: 8.95 }, // larger = smaller patches, tune to taste
      uGrainScale: { value: 2.2 }, // fine grain frequency
      uDirtColorLight: { value: new THREE.Color("#a9844f") },
      uDirtColorDark: { value: new THREE.Color("#6e4f2c") },
      uPebbleColor: { value: new THREE.Color("#568c5a") },
      uLightDirection: { value: new THREE.Vector3(0.5, 1.0, 0.3).normalize() },
      uLightColor: { value: new THREE.Color("#fff4e6") },
      uAmbientColor: { value: new THREE.Color("#3a3228") },
    }),
    [],
  );

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} receiveShadow>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
