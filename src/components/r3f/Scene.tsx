import { Canvas } from "@react-three/fiber";
import { Sky, OrbitControls } from "@react-three/drei";
import { useAppStore } from "../../stores/useAppStore";
import { usePathDrag } from "../../hooks/usePathDrag";
import { GRID_CONFIG } from "../../config/grid.config";
import HexGrid from "./grid/HexGrid";
import LightingRig from "./environment/LightingRig";
import WalkScene from "./walk/WalkScene";
import WalkCamera from "./walk/WalkCamera";

const BUILD_CAMERA_POSITION: [number, number, number] = [
  0,
  GRID_CONFIG.cameraDistance * Math.sin(-GRID_CONFIG.cameraPitch),
  GRID_CONFIG.cameraDistance * Math.cos(-GRID_CONFIG.cameraPitch),
];

interface SceneProps {
  isMobile?: boolean;
}

function BuildPhaseContent({ isMobile }: { isMobile: boolean }) {
  const { onCanvasPointerUp } = usePathDrag();
  return (
    <group onPointerUp={onCanvasPointerUp}>
      <HexGrid isMobile={isMobile} />
    </group>
  );
}

export default function Scene({ isMobile = false }: SceneProps) {
  const phase = useAppStore((s) => s.phase);
  if (phase === "intro") return null;

  return (
    <Canvas
      shadows
      camera={{
        position: BUILD_CAMERA_POSITION,
        fov: GRID_CONFIG.cameraFov,
        near: 0.1,
        far: 150,
      }}
      gl={{ antialias: true, logarithmicDepthBuffer: false }}
      style={{ position: "absolute", inset: 0 }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Sky sunPosition={[100, 30, 100]} turbidity={8} rayleigh={2} />
      <LightingRig />
      <fog attach="fog" args={["#c8e8d8", 40, 100]} />

      {phase === "build" && <BuildPhaseContent isMobile={isMobile} />}
      {phase === "walk" && (
        <>
          <WalkScene /> <WalkCamera />
        </>
      )}

      {phase === "build" && (
        <OrbitControls
          enablePan={false}
          enableRotate={false}
          enableZoom={true}
          minDistance={20}
          maxDistance={60}
          target={[GRID_CONFIG.cameraTargetX, 0, GRID_CONFIG.cameraTargetZ]}
        />
      )}
    </Canvas>
  );
}
