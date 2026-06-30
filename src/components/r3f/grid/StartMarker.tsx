import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GRID_CONFIG } from "../../../config/grid.config";

interface StartMarkerProps {
  x: number;
  z: number;
}

const BASE_Y = GRID_CONFIG.tileDepth / 2 + 1.0;

export default function StartMarker({ x, z }: StartMarkerProps) {
  const flagRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(clock.elapsedTime * 3) * 0.15;
    }
  });

  return (
    <group position={[x, BASE_Y, z]}>
      {/* Pole */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>
      {/* Flag */}
      <mesh ref={flagRef} position={[0.2, 0.88, 0]}>
        <boxGeometry args={[0.4, 0.22, 0.02]} />
        <meshStandardMaterial
          color="#f0a050"
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
