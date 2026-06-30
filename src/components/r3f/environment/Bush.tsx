import * as THREE from "three";
import { useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import bushVertexShader from "./BushShader/vertex.glsl";
import bushFragmentShader from "./BushShader/fragment.glsl";

interface BushProps {
  position: [number, number, number];
  radius?: number;
  leafCount?: number;
  shadowColor?: THREE.ColorRepresentation;
  midColor?: THREE.ColorRepresentation;
  highlightColor?: THREE.ColorRepresentation;
  colorMultiplier?: THREE.ColorRepresentation;
}

export function Bush({
  position,
  radius = 1.0,
  leafCount = 115,
  shadowColor = new THREE.Color(0.01, 0.12, 0.01),
  midColor = new THREE.Color(0.0, 0.25, 0.015),
  highlightColor = new THREE.Color(0.25, 0.5, 0.007),
  colorMultiplier = new THREE.Color(0.73, 0.89, 0.62),
}: BushProps) {
  const { scene } = useGLTF("/models/bushEmitter.glb");
  //const alphaMap = useTexture("/textures/leave_alpha_map_256x256.png");
  //const alphaMap = useTexture("/textures/leaf_alpha_map_v2_256x256.png");
  const alphaMap = useTexture(
    "/textures/berry_cluster_alpha_map2_256x256 (1).png",
  );
  const samplerMesh = useMemo(() => {
    const emitterMesh = scene.children[0] as THREE.Mesh;
    emitterMesh.updateMatrixWorld(true);

    const geometry = emitterMesh.geometry.clone();
    geometry.applyMatrix4(emitterMesh.matrixWorld);
    const nonIndexed = geometry.toNonIndexed();

    return new THREE.Mesh(nonIndexed, new THREE.MeshBasicMaterial());
  }, [scene]);

  const material = useMemo(() => {
    const fogUniforms = THREE.UniformsUtils.merge([THREE.UniformsLib["fog"]]);

    return new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      fog: true,
      depthTest: true,
      uniforms: {
        ...fogUniforms,
        uTime: { value: 0.0 },
        uLightDirection: {
          value: new THREE.Vector3(0.5, 1.0, 0.3).normalize(),
        },
        uAlphaMap: { value: alphaMap },
        uShadowColor: { value: new THREE.Color(shadowColor) },
        uMidColor: { value: new THREE.Color(midColor) },
        uHighlightColor: { value: new THREE.Color(highlightColor) },
        uColorMultiplier: { value: new THREE.Color(colorMultiplier) },
        uBreezeSpeed: { value: 3.25 },
        uBreezeScale: { value: 6.2 },
        uBreezeStrength: { value: 2.5 },
        uSquallSpeed: { value: 4.02 },
        uSquallScale: { value: 4.3 },
        uSquallStrength: { value: 0.5 },
      },
      vertexShader: bushVertexShader,
      fragmentShader: bushFragmentShader,

      depthWrite: true,
      transparent: false,
      alphaTest: 0.8,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
  }, [alphaMap, shadowColor, midColor, highlightColor, colorMultiplier]);

  const instancedMesh = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.InstancedMesh(geometry, material, leafCount);

    const sampler = new MeshSurfaceSampler(samplerMesh).build();

    const dummy = new THREE.Object3D();
    const sampledPosition = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const bushOrigin = new THREE.Vector3(...position);

    const normals = new Float32Array(leafCount * 3);

    for (let i = 0; i < leafCount; i++) {
      sampler.sample(sampledPosition, normal);

      dummy.position
        .copy(sampledPosition)
        .multiplyScalar(radius)
        .add(bushOrigin);
      const s = Math.random() * 0.5 + 0.75;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);

      normals[i * 3 + 0] = normal.x;
      normals[i * 3 + 1] = normal.y;
      normals[i * 3 + 2] = normal.z;
    }

    geometry.setAttribute(
      "instanceNormal",
      new THREE.InstancedBufferAttribute(normals, 3),
    );

    mesh.instanceMatrix.needsUpdate = true;

    return mesh;
  }, [samplerMesh, leafCount, material, radius, position]);

  useEffect(() => {
    return () => {
      instancedMesh.geometry.dispose();
      material.dispose();
    };
  }, [instancedMesh, material]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return <primitive object={instancedMesh} renderOrder={0} />;
}
