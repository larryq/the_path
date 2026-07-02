import { useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";

interface DistantTreeModel6Props {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
}

function DistantTreeModel6({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = true,
}: DistantTreeModel6Props) {
  const { scene } = useGLTF("/models/distant_tree_6.glb");
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

export default function DistantPine(props: DistantTreeModel6Props) {
  return (
    <Suspense fallback={null}>
      <DistantTreeModel6 {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/distant_tree_6.glb");
