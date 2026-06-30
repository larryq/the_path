import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface BoulderProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function BoulderModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: BoulderProps) {
  const { scene } = useGLTF("/models/Rock2.glb");

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

export default function Boulder(props: BoulderProps) {
  return (
    <Suspense fallback={null}>
      <BoulderModel {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/Rock2.glb");
