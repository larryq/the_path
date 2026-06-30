import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface PathRibbonProps {
  geometry: THREE.BufferGeometry | null;
}

export default function PathRibbon({ geometry }: PathRibbonProps) {
  const [colorMap, normalMap, aoMap] = useTexture([
    "/textures/Ground037_1K-JPG_Color.jpg",
    "/textures/Ground037_1K-JPG_NormalGL.jpg",
    "/textures/Ground037_1K-JPG_AmbientOcclusion.jpg",
  ]);

  useMemo(() => {
    [colorMap, normalMap, aoMap].forEach((tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      // U doesn't repeat (0-1 across width), V repeats along length
      // The TILING_FACTOR in WalkScene already handles V repetition
      // so we just set repeat to 1,1 here
      tex.repeat.set(1, 1);
    });
  }, [colorMap, normalMap, aoMap]);

  if (!geometry) return null;

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.8, 0.8)}
        aoMap={aoMap}
        aoMapIntensity={0.9}
        roughness={0.85}
        metalness={0.0}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
}
