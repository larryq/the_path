import { useMemo } from "react";
import * as THREE from "three";
import { WALK_CONFIG } from "../config/walk.config";

const GRASS_PATCH_SIZE = 64; // must match value in Grass.tsx

export function useTileDataTexture(
  pathCurve: THREE.CatmullRomCurve3 | null,
  pathWidth: number,
): THREE.CanvasTexture | null {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // White background — full grass, full undulation
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (pathCurve) {
      const points = pathCurve.getPoints(400);
      const drawPath = () => {
        ctx.beginPath();
        points.forEach((point, index) => {
          const x = (point.x / GRASS_PATCH_SIZE + 0.5) * canvas.width;
          const y = (point.z / GRASS_PATCH_SIZE + 0.5) * canvas.height;
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
      };
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = ((pathWidth * 2) / GRASS_PATCH_SIZE) * canvas.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // Hard core — guarantees path center is fully black
      ctx.filter = "none";
      drawPath();
      ctx.stroke();

      // Soft edges — wide blur for gradual terrain transition
      ctx.filter = "blur(32px)";
      drawPath();
      ctx.stroke();
      ctx.filter = "none";
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = true;
    return texture;
  }, [pathCurve, pathWidth]);
}
