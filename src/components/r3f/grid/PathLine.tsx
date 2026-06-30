import { useMemo } from "react";
import { Line } from "@react-three/drei";
import {
  AxialCoord,
  axialToWorld,
  GRID_CONFIG,
} from "../../../config/grid.config";

interface PathLineProps {
  path: AxialCoord[];
}

const LINE_Y = GRID_CONFIG.tileDepth / 2 + 0.5;

export default function PathLine({ path }: PathLineProps) {
  const points = useMemo(() => {
    if (path.length < 2) return null;
    return path.map(({ q, r }) => {
      const { x, z } = axialToWorld(q, r);
      return [x, LINE_Y, z] as [number, number, number];
    });
  }, [path]);

  if (!points) return null;

  return (
    <Line
      points={points}
      color="#f0d080"
      lineWidth={3}
      dashed={false}
      opacity={0.85}
      transparent
    />
  );
}
