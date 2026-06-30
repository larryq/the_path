// src/components/r3f/nature/BerryBush.tsx

import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface BerryBushProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function BerryBushModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: BerryBushProps) {
  const { scene } = useGLTF("/models/blueberries1_fixed.glb");

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

export default function BerryBush(props: BerryBushProps) {
  return (
    <Suspense fallback={null}>
      <BerryBushModel {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/blueberries1_fixed.glb");
