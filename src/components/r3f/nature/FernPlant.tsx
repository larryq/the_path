import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface FernPlantProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function FernPlantModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: FernPlantProps) {
  const { scene } = useGLTF("/models/fern_plant_fixed.glb");
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

export default function FernPlant(props: FernPlantProps) {
  return (
    <Suspense fallback={null}>
      <FernPlantModel {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/fern_plant_fixed.glb");
