// src/components/r3f/nature/BerryBush.tsx

import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface Vine1Props {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function Vine1Model({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: Vine1Props) {
  const { scene } = useGLTF("/models/vine1_fixed.glb");

  const randomY = useRef(randomRotation ? Math.random() * Math.PI * 2 : 0);

  const finalRotation: [number, number, number] = [
    rotation[0],
    rotation[1] + randomY.current,
    rotation[2],
  ];
  return (
    <group position={position} rotation={finalRotation} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  );
}

export default function Vine1(props: Vine1Props) {
  return (
    <Suspense fallback={null}>
      <Vine1Model {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/vine1_fixed.glb");
