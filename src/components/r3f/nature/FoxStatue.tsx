import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface FoxStatueProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function FoxStatueModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: FoxStatueProps) {
  const { scene } = useGLTF("/models/Fox_Statue_fixed.glb");
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

export default function FoxStatue(props: FoxStatueProps) {
  return (
    <Suspense fallback={null}>
      <FoxStatueModel {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/Fox_Statue_fixed.glb");
