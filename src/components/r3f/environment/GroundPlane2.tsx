// src/components/r3f/environment/GroundPlane.tsx

import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import vertexShader from "./GroundShader/vertex.glsl";
import fragmentShader from "./GroundShader/fragment.glsl";

const PLANE_SIZE = 400;
const TEXTURE_REPEAT = 40;
const GRASS_PATCH_SIZE = 64; // must match useTileDataTexture hook

interface GroundPlaneProps {
  tileDataTexture: THREE.CanvasTexture | null;
  hillHeight?: number; // max displacement in world units
  noiseScale?: number; // frequency of hills — smaller = broader hills
  safeMargin?: number; // 0-1, how far from path before undulation starts
}

function GroundPlaneContent({
  tileDataTexture,
  hillHeight = 0.8,
  noiseScale = 0.025,
  safeMargin = 0.7,
}: GroundPlaneProps) {
  const [colorMap, normalMap, aoMap] = useTexture([
    "/textures/grass_path_3_diff_1k.jpg",
    "/textures/grass_path_3_nor_gl_1k.jpg",
    "/textures/grass_path_3_ao_1k.jpg",
  ]);

  // Configure texture wrapping
  useMemo(() => {
    [colorMap, normalMap, aoMap].forEach((tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
    });
  }, [colorMap, normalMap, aoMap]);

  const uniforms = useMemo(
    () => ({
      // Displacement
      tileDataTexture: { value: tileDataTexture },
      uHillHeight: { value: hillHeight },
      uNoiseScale: { value: noiseScale },
      uSafeMargin: { value: safeMargin },
      uPatchSize: { value: GRASS_PATCH_SIZE },

      // Textures
      uColorMap: { value: colorMap },
      uNormalMap: { value: normalMap },
      uAoMap: { value: aoMap },
      uAoIntensity: { value: 0.8 },
      uTextureRepeat: { value: TEXTURE_REPEAT },
      uColorTint: { value: new THREE.Color(0.95, 1.0, 0.9) },

      // Lighting — matches LightingRig day preset
      uLightDir: { value: new THREE.Vector3(-15, 12, 8).normalize() },
      uLightColor: { value: new THREE.Color(0xfff4e6) },
      uAmbientColor: { value: new THREE.Color(0.2, 0.25, 0.2) },
    }),
    [
      tileDataTexture,
      colorMap,
      normalMap,
      aoMap,
      hillHeight,
      noiseScale,
      safeMargin,
    ],
  );

  // Subdivided plane geometry — more segments = smoother hills
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE, 64, 64);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  return (
    <mesh
      geometry={geometry}
      position={[0, -0.05, 0]}
      receiveShadow
      renderOrder={1}
    >
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

export default function GroundPlane(props: GroundPlaneProps) {
  return <GroundPlaneContent {...props} />;
}
