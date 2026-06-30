import { useMemo } from "react";
import { CatmullRomCurve3 } from "three";
import * as THREE from "three";
import { axialToWorld, AxialCoord } from "../config/grid.config";

interface UsePathSplineResult {
  pathPoints: { x: number; y: number; z: number }[];
  pathCurve: CatmullRomCurve3 | null;
  startPosition: THREE.Vector3 | null;
  startDirection: THREE.Vector3 | null;
}

export function usePathSpline(path: AxialCoord[] | null): UsePathSplineResult {
  const pathPoints = useMemo(() => {
    if (!path) return [];
    return path.map(({ q, r }) => {
      const { x, z } = axialToWorld(q, r);
      return { x, y: 0, z };
    });
  }, [path]);

  const pathCurve = useMemo(() => {
    if (pathPoints.length < 2) return null;
    const points = pathPoints.map(({ x, y, z }) => new THREE.Vector3(x, y, z));

    // Need more geometry for smoother curves.  Solution: add midpoints between each pair of points in the original path. This effectively doubles the number of points along the path, allowing the Catmull-Rom spline to create smoother curves that better follow the intended path, especially around corners. Without these midpoints, the curve would only pass through the original tile centers, resulting in sharper turns and a less natural-looking path.
    // Insert midpoints between each pair of tile centers.
    // Call the new geometry "densePoints". This creates a denser set of points along the path, which allows the Catmull-Rom spline to create smoother curves that better follow the intended path, especially around corners. Without these midpoints, the curve would only pass through the tile centers, resulting in sharper turns and a less natural-looking path.
    const densePoints: THREE.Vector3[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      densePoints.push(points[i]);
      densePoints.push(points[i].clone().lerp(points[i + 1], 0.5));
    }
    densePoints.push(points[points.length - 1]);

    //phantom points create a more natural curve that extends slightly beyond the start and end tiles
    const phantomStart = densePoints[0]
      .clone()
      .addScaledVector(
        densePoints[0].clone().sub(densePoints[1]).normalize(),
        1.0,
      );

    const last = densePoints.length - 1;
    const phantomEnd = densePoints[last].clone().addScaledVector(
      densePoints[last]
        .clone()
        .sub(densePoints[last - 1])
        .normalize(),
      1.0,
    );
    return new CatmullRomCurve3(
      [phantomStart, ...densePoints, phantomEnd],
      false,
      "centripetal",
      0.1,
    );
  }, [pathPoints]);

  // In usePathSpline, replace the t0 calculation with this:
  const startWorld =
    pathPoints.length > 0
      ? new THREE.Vector3(pathPoints[0].x, 0, pathPoints[0].z)
      : null;

  let startT = 0;
  if (startWorld && pathCurve) {
    let closestDist = Infinity;
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const pt = pathCurve.getPointAt(t);
      const dist = pt.distanceTo(startWorld);
      if (dist < closestDist) {
        closestDist = dist;
        startT = t;
      }
    }
  }

  return {
    pathPoints,
    pathCurve,
    startPosition: pathCurve ? pathCurve.getPointAt(startT) : null,
    startDirection: pathCurve ? pathCurve.getTangentAt(startT) : null,
  };
}
