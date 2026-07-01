import { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import vertexShader from "./WaterShader/vertex.glsl";
import fragmentShader from "./WaterShader/fragment.glsl";

interface FountainProps {
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: [number, number, number];
  randomRotation?: boolean;
  // Water color uniforms
  waterColorShallow?: THREE.ColorRepresentation;
  waterColorDeep?: THREE.ColorRepresentation;
  rippleColor?: THREE.ColorRepresentation;
  // Water behavior uniforms
  opacity?: number;
  rippleFrequency?: number;
  rippleSpeed?: number;
  rippleHeight?: number;
  noiseStrength?: number;
  foamStrength?: number;
}

function FountainModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  randomRotation = false, // false for fountain — we want consistent orientation
  waterColorShallow = "#a8d8f0",
  waterColorDeep = "#2a6090",
  rippleColor = "#cce8f8",
  opacity = 0.82,
  rippleFrequency = 12.0,
  rippleSpeed = 2.0,
  rippleHeight = 0.012,
  noiseStrength = 0.008,
  foamStrength = 0.6,
}: FountainProps) {
  const { scene, nodes } = useGLTF("/models/water_fountain_fixed.glb");
  const randomY = useRef(randomRotation ? Math.random() * Math.PI * 2 : 0);

  const finalRotation: [number, number, number] = [
    rotation[0],
    rotation[1] + randomY.current,
    rotation[2],
  ];

  // Water shader uniforms — shared between both water planes
  const waterUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaterColorShallow: { value: new THREE.Color(waterColorShallow) },
      uWaterColorDeep: { value: new THREE.Color(waterColorDeep) },
      uRippleColor: { value: new THREE.Color(rippleColor) },
      uOpacity: { value: opacity },
      uRippleFrequency: { value: rippleFrequency },
      uRippleSpeed: { value: rippleSpeed },
      uRippleHeight: { value: rippleHeight },
      uNoiseStrength: { value: noiseStrength },
      uFoamStrength: { value: foamStrength },
      uLightDirection: { value: new THREE.Vector3(0.5, 1.0, 0.3).normalize() },
    }),
    [
      waterColorShallow,
      waterColorDeep,
      rippleColor,
      opacity,
      rippleFrequency,
      rippleSpeed,
      rippleHeight,
      noiseStrength,
      foamStrength,
    ],
  );

  // Separate uniforms for Water1 so each can have independent uTime if needed
  const waterUniforms2 = useMemo(
    () => ({
      ...waterUniforms,
      uTime: { value: 0 },
      // Slightly different phase for the second water plane
      uRippleFrequency: { value: rippleFrequency * 0.85 },
      uRippleSpeed: { value: rippleSpeed * 1.1 },
    }),
    [waterUniforms, rippleFrequency, rippleSpeed],
  );

  const waterMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: waterUniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [waterUniforms],
  );

  const waterMaterial2 = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: waterUniforms2,
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [waterUniforms2],
  );

  // Advance time each frame
  useFrame(({ clock }) => {
    waterUniforms.uTime.value = clock.getElapsedTime();
    waterUniforms2.uTime.value = clock.getElapsedTime();
  });

  // Clone the scene so multiple fountains don't share transforms
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Apply water shader to the two named water planes
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name === "Water1") {
          child.material = waterMaterial;
        } else if (child.name === "Water2") {
          child.material = waterMaterial2;
        }
      }
    });

    return clone;
  }, [scene, waterMaterial, waterMaterial2]);

  return (
    <group position={position} rotation={finalRotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default function Fountain(props: FountainProps) {
  return (
    <Suspense fallback={null}>
      <FountainModel {...props} />
    </Suspense>
  );
}

useGLTF.preload("/models/water_fountain_fixed.glb");
