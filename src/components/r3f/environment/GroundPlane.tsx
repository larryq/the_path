import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const PLANE_SIZE = 400;
const TEXTURE_REPEAT = 320; // tune to taste

export default function GroundPlane() {
  const [colorMap, normalMap, aoMap] = useTexture([
    "/textures/grass_path_3_diff_1k.jpg",
    "/textures/grass_path_3_nor_gl_1k.jpg",
    "/textures/grass_path_3_ao_1k.jpg",
  ]);

  useMemo(() => {
    [colorMap, normalMap, aoMap].forEach((tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(TEXTURE_REPEAT, TEXTURE_REPEAT);
    });
  }, [colorMap, normalMap, aoMap]);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.05, 0]}
      receiveShadow
      renderOrder={1}
    >
      <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.5, 0.5)}
        aoMap={aoMap}
        aoMapIntensity={0.8}
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
}
