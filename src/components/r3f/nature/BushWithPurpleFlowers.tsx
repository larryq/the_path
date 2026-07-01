import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface BushWithPurpleFlowersProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function BushWithPurpleFlowersModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: BushWithPurpleFlowersProps) {
  const { scene } = useGLTF("/models/bush_with_purple_flowers_fixed.glb");
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

export default function BushWithPurpleFlowers(
  props: BushWithPurpleFlowersProps,
) {
  return (
    <Suspense fallback={null}>
      <BushWithPurpleFlowersModel {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/bush_with_purple_flowers_fixed.glb");
