import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface MushroomsProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function MushroomsModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: MushroomsProps) {
  const { scene } = useGLTF("/models/Forest_Mushroom_Scene_fixed.glb");
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

export default function Mushrooms(props: MushroomsProps) {
  return (
    <Suspense fallback={null}>
      <MushroomsModel {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/Forest_Mushroom_Scene_fixed.glb");
