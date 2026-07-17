import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWeatherStore } from "../../../stores/useWeatherStore";
import {
  LIGHTING_PRESETS,
  LIGHTING_LERP_DURATION,
} from "../../../config/lighting.config";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function LightingRig() {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);
  const moonRef = useRef<THREE.DirectionalLight>(null);

  const colorA = useRef(new THREE.Color());
  const colorB = useRef(new THREE.Color());

  useFrame((_, delta) => {
    const { timeOfDay, lightingLerpProgress, setLightingLerpProgress } =
      useWeatherStore.getState();

    const newProgress = Math.min(
      1,
      lightingLerpProgress + delta / LIGHTING_LERP_DURATION,
    );
    if (newProgress !== lightingLerpProgress)
      setLightingLerpProgress(newProgress);

    const t = newProgress;
    const prevTime = timeOfDay === "day" ? "night" : "day";
    const prev = LIGHTING_PRESETS[prevTime];
    const curr = LIGHTING_PRESETS[timeOfDay];

    if (
      !keyRef.current ||
      !fillRef.current ||
      !ambientRef.current ||
      !rimRef.current
    )
      return;

    colorA.current.setHex(prev.key.color);
    colorB.current.setHex(curr.key.color);
    keyRef.current.color.lerpColors(colorA.current, colorB.current, t);
    keyRef.current.intensity = lerp(prev.key.intensity, curr.key.intensity, t);
    keyRef.current.position.set(...curr.key.position);

    colorA.current.setHex(prev.fill.color);
    colorB.current.setHex(curr.fill.color);
    fillRef.current.color.lerpColors(colorA.current, colorB.current, t);
    fillRef.current.intensity = lerp(
      prev.fill.intensity,
      curr.fill.intensity,
      t,
    );

    colorA.current.setHex(prev.ambient.color);
    colorB.current.setHex(curr.ambient.color);
    ambientRef.current.color.lerpColors(colorA.current, colorB.current, t);
    ambientRef.current.intensity = lerp(
      prev.ambient.intensity,
      curr.ambient.intensity,
      t,
    );

    colorA.current.setHex(prev.rim.color);
    colorB.current.setHex(curr.rim.color);
    rimRef.current.color.lerpColors(colorA.current, colorB.current, t);
    rimRef.current.intensity = lerp(prev.rim.intensity, curr.rim.intensity, t);

    if (moonRef.current) {
      colorA.current.setHex(prev.moon.color);
      colorB.current.setHex(curr.moon.color);
      moonRef.current.color.lerpColors(colorA.current, colorB.current, t);
      moonRef.current.intensity = lerp(
        prev.moon.intensity,
        curr.moon.intensity,
        t,
      );
    }
  });

  const d = LIGHTING_PRESETS.day;

  return (
    <>
      <directionalLight
        ref={keyRef}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={0.1}
        shadow-camera-far={80}
        shadow-bias={-0.0001}
        color={d.key.color}
        intensity={d.key.intensity}
        position={d.key.position}
      />
      {/* <directionalLight ref={fillRef}  color={d.fill.color}    intensity={d.fill.intensity}    position={d.fill.position} /> */}
      <ambientLight
        ref={ambientRef}
        color={d.ambient.color}
        intensity={d.ambient.intensity}
      />
      <directionalLight
        ref={rimRef}
        color={d.rim.color}
        intensity={d.rim.intensity}
        position={d.rim.position}
      />
      <directionalLight
        ref={moonRef}
        color={0x000000}
        intensity={0.0}
        position={[10, 15, -8]}
      />
    </>
  );
}
