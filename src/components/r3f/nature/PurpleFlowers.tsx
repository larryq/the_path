import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface PurpleFlowersProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function PurpleFlowersModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: PurpleFlowersProps) {
  const { scene } = useGLTF(
    "/models/purple_flowers_with_stem_quaternius_fixed2.glb",
  );
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

export default function PurpleFlowers(props: PurpleFlowersProps) {
  return (
    <Suspense fallback={null}>
      <PurpleFlowersModel {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/purple_flowers_with_stem_quaternius_fixed2.glb");
