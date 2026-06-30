import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface WillowTreeProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function WillowTreeModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: WillowTreeProps) {
  const { scene } = useGLTF("/models/willow_tree_fixed.glb");
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

export default function WillowTree(props: WillowTreeProps) {
  return (
    <Suspense fallback={null}>
      <WillowTreeModel {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/yellow_flowers_fixed.glb");
