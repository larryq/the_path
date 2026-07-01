import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface RedFlowersProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function RedFlowersModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: RedFlowersProps) {
  const { scene } = useGLTF("/models/red_flowers_fixed1.glb");
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

export default function RedFlowers(props: RedFlowersProps) {
  return (
    <Suspense fallback={null}>
      <RedFlowersModel {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/red_flowers_fixed1.glb");
