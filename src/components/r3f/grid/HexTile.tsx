import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { GRID_CONFIG } from "../../../config/grid.config";
import { mx_bilerp_1 } from "three/src/nodes/materialx/lib/mx_noise.js";

// ── Types ─────────────────────────────────────────────────────────────────────

export type TileState =
  | "default"
  | "hover"
  | "path"
  | "pathStart"
  | "pathEnd"
  | "adjacent"
  | "selected";

interface HexTileProps {
  x: number;
  z: number;
  state?: TileState;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerEnter?: (e: ThreeEvent<PointerEvent>) => void;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const HEX_SEGMENTS = 6;
// 30° rotation converts flat-top CylinderGeometry to pointy-top
const HEX_ROTATION_Y = Math.PI / 6;

const COLORS: Record<TileState, THREE.Color> = {
  default: new THREE.Color(GRID_CONFIG.tileColor),
  hover: new THREE.Color(GRID_CONFIG.tileColorHover),
  path: new THREE.Color(GRID_CONFIG.tileColorPath),
  pathStart: new THREE.Color(GRID_CONFIG.tileColorStart),
  pathEnd: new THREE.Color(GRID_CONFIG.tileColorEnd),
  adjacent: new THREE.Color(GRID_CONFIG.tileColorAdjacent),
  selected: new THREE.Color(GRID_CONFIG.tileColorSelected),
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function HexTile({
  x,
  z,
  state = "default",
  onPointerDown,
  onPointerEnter,
  onClick,
}: HexTileProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const currentScale = useRef(GRID_CONFIG.tileScale);
  const [hovered, setHovered] = useState(false);

  // const effectiveState = useMemo<TileState>(() => {
  //   if (hovered && (state === "default" || state === "adjacent"))
  //     return "hover";
  //   return state;
  // }, [hovered, state]);

  // const effectiveState = useMemo<TileState>(() => {
  //   if ((hovered || state === "pathEnd") && state !== "selected")
  //     return "hover";
  //   return state;
  // }, [hovered, state]);

  const effectiveState = useMemo<TileState>(() => {
    if (hovered && state === "pathEnd") return "hover";
    return state;
  }, [hovered, state]);

  const shouldScaleUp = hovered || state === "pathEnd";

  // Lerp material color toward target each frame
  const currentColor = useRef(new THREE.Color(GRID_CONFIG.tileColor));
  useFrame((_, delta) => {
    if (!materialRef.current) return;
    currentColor.current.lerp(COLORS[effectiveState], Math.min(1, delta * 8));
    if (state === "pathEnd") {
      currentColor.current.copy(COLORS["pathEnd"]);
    }
    materialRef.current.color.copy(currentColor.current);
  });

  // Gentle vertical bob for adjacent tiles
  // const bobPhase = useRef(Math.random() * Math.PI * 2);

  // useFrame(({ clock }) => {
  //   if (!meshRef.current) return;
  //   // if (state === "adjacent") {
  //   //   meshRef.current.position.y =
  //   //     Math.sin(clock.elapsedTime * 2 + bobPhase.current) * 0.04;
  //   //   const s = 1 + Math.sin(clock.elapsedTime * 2 + bobPhase.current) * 0.63;
  //   //   meshRef.current.scale.set(
  //   //     s * GRID_CONFIG.tileScale,
  //   //     1,
  //   //     s * GRID_CONFIG.tileScale,
  //   //   );
  //   // } else {
  //   //   meshRef.current.position.y = 0;
  //   //   meshRef.current.scale.set(
  //   //     GRID_CONFIG.tileScale,
  //   //     1,
  //   //     GRID_CONFIG.tileScale,
  //   //   );
  //   // }
  //   // Scale lerp
  //   const targetScale =
  //     effectiveState === "hover"
  //       ? GRID_CONFIG.tileScale * 1.12
  //       : GRID_CONFIG.tileScale;
  //   currentScale.current +=
  //     (targetScale - currentScale.current) *
  //     Math.min(1, clock.getDelta() * 10);
  //   meshRef.current.scale.set(currentScale.current, 1, currentScale.current);
  // });

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const targetScale =
      effectiveState === "hover"
        ? GRID_CONFIG.tileScale * 3.12
        : GRID_CONFIG.tileScale;
    currentScale.current +=
      (targetScale - currentScale.current) * Math.min(1, delta * 10);
    meshRef.current.scale.set(
      1.0, //currentScale.current,
      currentScale.current * 3,
      1.0, //currentScale.current,
    );
    //console.log("currentScale:", currentScale.current);
  });

  return (
    <mesh
      ref={meshRef}
      position={[x, 0, z]}
      rotation={[0, HEX_ROTATION_Y, 0]}
      scale={[GRID_CONFIG.tileScale, 1, GRID_CONFIG.tileScale]}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown?.(e);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        onPointerEnter?.(e);
      }}
      onPointerLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (state === "adjacent") onClick?.(e);
      }}
      castShadow
      receiveShadow
    >
      {/* <cylinderGeometry
        args={[
          GRID_CONFIG.tileRadius,
          GRID_CONFIG.tileRadius,
          GRID_CONFIG.tileDepth,
          HEX_SEGMENTS,
        ]}
      /> */}
      <cylinderGeometry
        args={[
          GRID_CONFIG.tileGeomRadius,
          GRID_CONFIG.tileGeomRadius,
          GRID_CONFIG.tileDepth,
          HEX_SEGMENTS,
        ]}
      />
      <meshStandardMaterial
        ref={materialRef}
        roughness={0.55}
        metalness={0.05}
      />
    </mesh>
  );
}
