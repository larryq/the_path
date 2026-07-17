// src/components/r3f/environment/SkyController.tsx

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import * as THREE from "three";
import { useWeatherStore } from "../../../stores/useWeatherStore";
import { LIGHTING_PRESETS } from "../../../config/lighting.config";

// Day sun position — high in sky
const DAY_SUN = new THREE.Vector3(100, 30, 100).normalize().multiplyScalar(100);

// Night sun position — below horizon
const NIGHT_SUN = new THREE.Vector3(100, -20, 100)
  .normalize()
  .multiplyScalar(100);

export default function SkyController() {
  const sunPositionRef = useRef(new THREE.Vector3().copy(DAY_SUN));
  const skyRef = useRef<any>(null);

  useFrame(() => {
    const { timeOfDay, lightingLerpProgress } = useWeatherStore.getState();

    const from = timeOfDay === "night" ? DAY_SUN : NIGHT_SUN;
    const to = timeOfDay === "night" ? NIGHT_SUN : DAY_SUN;

    sunPositionRef.current.lerpVectors(from, to, lightingLerpProgress);

    if (skyRef.current) {
      skyRef.current.material.uniforms.sunPosition.value.copy(
        sunPositionRef.current,
      );
    }
  });

  const dayPreset = LIGHTING_PRESETS.day.sky;
  const nightPreset = LIGHTING_PRESETS.night.sky;

  return (
    <Sky
      ref={skyRef}
      sunPosition={DAY_SUN.toArray() as [number, number, number]}
      turbidity={dayPreset.turbidity}
      rayleigh={dayPreset.rayleigh}
      mieCoefficient={dayPreset.mieCoefficient}
      mieDirectionalG={dayPreset.mieDirectionalG}
      renderOrder={0} // Render before other objects
    />
  );
}
