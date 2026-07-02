import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { WALK_CONFIG } from "../../../config/walk.config";
import { usePathSpline } from "../../../hooks/usePathSpline";
import { useGridStore } from "../../../stores/useGridStore";

export default function WalkCamera() {
  const smoothedDeltaX = useRef(0);
  const smoothedDeltaY = useRef(0);
  const path = useGridStore((s) => s.path);
  const { pathCurve, startPosition, startDirection } = usePathSpline(path);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const baseQuaternion = useRef(new THREE.Quaternion());
  const yawOffset = useRef(0);
  const pitchOffset = useRef(0);
  const mouseDeltaX = useRef(0);
  const mouseDeltaY = useRef(0);
  const keys = useRef({ w: false, s: false, a: false, d: false });
  const { camera } = useThree();

  // Reusable vectors — allocated once, reused every frame to avoid GC pressure
  const moveDirection = useRef(new THREE.Vector3());
  const rightVector = useRef(new THREE.Vector3());
  const newPos = useRef(new THREE.Vector3());
  const yawQ = useRef(new THREE.Quaternion());
  const pitchQ = useRef(new THREE.Quaternion());
  const up = new THREE.Vector3(0, 1, 0);

  // ── Snap camera to path start ─────────────────────────────────────────────
  useEffect(() => {
    if (!startPosition || !startDirection || !pathCurve) return;

    // Position camera at eye height above path start
    const pos = startPosition.clone().setY(WALK_CONFIG.cameraHeight);
    camera.position.copy(pos);

    // Build base quaternion pointing down the path
    const lookTarget = startPosition
      .clone()
      .add(startDirection)
      .setY(WALK_CONFIG.cameraHeight);
    const m = new THREE.Matrix4().lookAt(pos, lookTarget, up);
    baseQuaternion.current.setFromRotationMatrix(m);

    // Reset offsets so we start fresh
    yawOffset.current = 0;
    pitchOffset.current = 0;
  }, [startPosition, startDirection, pathCurve, camera]);

  // ── Input listeners ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = document.querySelector("canvas");

    const onClick = () => {
      canvas?.requestPointerLock();
    };
    canvas?.addEventListener("click", onClick);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "ArrowUp") keys.current.w = true;
      if (e.key === "s" || e.key === "ArrowDown") keys.current.s = true;
      if (e.key === "a" || e.key === "ArrowLeft") keys.current.a = true;
      if (e.key === "d" || e.key === "ArrowRight") keys.current.d = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "ArrowUp") keys.current.w = false;
      if (e.key === "s" || e.key === "ArrowDown") keys.current.s = false;
      if (e.key === "a" || e.key === "ArrowLeft") keys.current.a = false;
      if (e.key === "d" || e.key === "ArrowRight") keys.current.d = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      mouseDeltaX.current = e.movementX;
      mouseDeltaY.current = e.movementY;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      canvas?.removeEventListener("click", onClick);
      document.exitPointerLock();
    };
  }, []);

  // ── Frame loop ────────────────────────────────────────────────────────────
  useFrame((state, delta) => {
    if (!pathCurve) return;

    const MOUSE_SMOOTHING = 0.07; // lower = smoother, higher = more responsive
    smoothedDeltaX.current +=
      (mouseDeltaX.current - smoothedDeltaX.current) * MOUSE_SMOOTHING;
    smoothedDeltaY.current +=
      (mouseDeltaY.current - smoothedDeltaY.current) * MOUSE_SMOOTHING;

    // 1. Update yaw and pitch from mouse
    yawOffset.current -= smoothedDeltaX.current * WALK_CONFIG.mouseSensitivity;
    pitchOffset.current -=
      smoothedDeltaY.current * WALK_CONFIG.mouseSensitivity;
    pitchOffset.current = Math.max(
      -WALK_CONFIG.maxPitch,
      Math.min(WALK_CONFIG.maxPitch, pitchOffset.current),
    );
    const TWO_PI = Math.PI * 2;
    yawOffset.current = ((yawOffset.current % TWO_PI) + TWO_PI) % TWO_PI;
    mouseDeltaX.current = 0;
    mouseDeltaY.current = 0;

    const baseFwd = new THREE.Vector3(0, 0, -1).applyQuaternion(
      baseQuaternion.current,
    );

    // Rotate baseFwd by yaw around world Y
    const yawedFwd = baseFwd.clone().applyAxisAngle(up, yawOffset.current);

    // Rotate by pitch around the right axis
    const right = new THREE.Vector3().crossVectors(yawedFwd, up).normalize();
    const finalFwd = yawedFwd
      .clone()
      .applyAxisAngle(right, -pitchOffset.current);

    // Build look target from camera position + finalFwd
    const lookTarget = state.camera.position.clone().add(finalFwd);
    state.camera.up.copy(up);
    state.camera.lookAt(lookTarget);

    // 4. Compute desired movement
    const speed = keys.current.w
      ? WALK_CONFIG.walkSpeed
      : keys.current.s
        ? -WALK_CONFIG.walkSpeed
        : 0;
    const strafe = keys.current.d
      ? WALK_CONFIG.strafeSpeed
      : keys.current.a
        ? -WALK_CONFIG.strafeSpeed
        : 0;

    const moveFwd = yawedFwd.clone();
    moveFwd.y = 0;
    moveFwd.normalize();

    newPos.current
      .copy(state.camera.position)
      .addScaledVector(moveFwd, speed * delta)
      .addScaledVector(right, strafe * delta);
    newPos.current.y = WALK_CONFIG.cameraHeight;

    // 5. Find closest point on spline, enforce boundary
    let closestT = 0;
    let closestDist = Infinity;
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const point = pathCurve.getPointAt(t);
      const dist = point.distanceTo(newPos.current);
      if (dist < closestDist) {
        closestDist = dist;
        closestT = t;
      }
    }

    const intendedMovement = newPos.current.clone().sub(state.camera.position);
    // if (closestDist > WALK_CONFIG.pathBoundaryWidth) {
    //   const closestPoint = pathCurve.getPointAt(closestT);
    //   const pushDir = newPos.current.clone().sub(closestPoint).normalize();
    //   newPos.current
    //     .copy(closestPoint)
    //     .addScaledVector(pushDir, WALK_CONFIG.pathBoundaryWidth);
    //   newPos.current.y = WALK_CONFIG.cameraHeight;
    //   const tangent = pathCurve.getTangentAt(closestT);
    //   const slideAmount = intendedMovement.dot(tangent); // Project intended movement onto tangent
    //   newPos.current.addScaledVector(tangent, slideAmount);
    // }

    // Check if newPos is valid on ANY part of the path
    let onAnyPath = false;
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const pt = pathCurve.getPointAt(t);
      pt.y = 0;
      if (pt.distanceTo(newPos.current) <= WALK_CONFIG.pathBoundaryWidth) {
        onAnyPath = true;
        break;
      }
    }

    if (!onAnyPath) {
      const closestPoint = pathCurve.getPointAt(closestT);
      const pushDir = newPos.current.clone().sub(closestPoint).normalize();
      newPos.current
        .copy(closestPoint)
        .addScaledVector(pushDir, WALK_CONFIG.pathBoundaryWidth);
      newPos.current.y = WALK_CONFIG.cameraHeight;

      const tangent = pathCurve.getTangentAt(closestT);
      const slideAmount = intendedMovement.dot(tangent);
      newPos.current.addScaledVector(tangent, slideAmount);
    }

    state.camera.position.copy(newPos.current);
    state.camera.up.copy(up);
    state.camera.lookAt(state.camera.position.clone().add(finalFwd));
  });

  return null;
}
