import vertexShader from "./GrassShader/grass-vertex-shader.glsl";
import fragmentShader from "./GrassShader/grass-fragment-shader.glsl";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { WALK_CONFIG } from "../../../config/walk.config";

const NUM_GRASS = 428 * 1024;
const GRASS_SEGMENTS = 6;
const GRASS_VERTICES = (GRASS_SEGMENTS + 1) * 2;
const GRASS_PATCH_SIZE = 64;
const GRASS_WIDTH = 0.04;
const GRASS_HEIGHT = 0.45;

interface GrassProps {
  pathCurve?: THREE.CatmullRomCurve3 | null;
  pathWidth?: number | 0;
}

export default function Grass({
  pathCurve,
  pathWidth = WALK_CONFIG.pathRibbonWidth,
}: GrassProps) {
  // pathCurve and pathWidth ignored for now, used later for tileDataTexture

  const [grass1, grass2] = useLoader(TextureLoader, [
    "/textures/grass1.png",
    "/textures/grass2.png",
  ]);
  const grassRef = useRef<THREE.Mesh>(null);
  const hasLogged = useRef(false);

  const grassGeometry = useMemo(() => {
    const VERTICES = (GRASS_SEGMENTS + 1) * 2;
    const indices = [];

    for (let i = 0; i < GRASS_SEGMENTS; i++) {
      const vi = i * 2;
      indices[i * 12 + 0] = vi + 0;
      indices[i * 12 + 1] = vi + 1;
      indices[i * 12 + 2] = vi + 2;
      indices[i * 12 + 3] = vi + 2;
      indices[i * 12 + 4] = vi + 1;
      indices[i * 12 + 5] = vi + 3;

      const fi = VERTICES + vi;
      indices[i * 12 + 6] = fi + 2;
      indices[i * 12 + 7] = fi + 1;
      indices[i * 12 + 8] = fi + 0;
      indices[i * 12 + 9] = fi + 3;
      indices[i * 12 + 10] = fi + 1;
      indices[i * 12 + 11] = fi + 2;
    }

    const geo = new THREE.InstancedBufferGeometry();
    geo.instanceCount = NUM_GRASS;
    geo.setIndex(indices);

    const totalVerts = GRASS_VERTICES * 2;
    const positions = new Float32Array(totalVerts * 3);

    // for (let i = 0; i < totalVerts; i++) {
    //   // Spread dummy positions across the patch area
    //   const t = i / totalVerts;
    //   positions[i * 3 + 0] = (t - 0.5) * GRASS_PATCH_SIZE * 2; // x
    //   positions[i * 3 + 1] = GRASS_HEIGHT; // y
    //   positions[i * 3 + 2] = (t - 0.5) * GRASS_PATCH_SIZE * 2; // z
    // }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    geo.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(0, 0, 0),
      1 + GRASS_PATCH_SIZE * 2,
    );
    return geo;
  }, []);

  const textureArrayUniform = useMemo(() => {
    if (!grass1 || !grass2) return null;

    const width = grass1.image.width;
    const height = grass1.image.height;
    const depth = 2;

    const data = new Uint8Array(width * height * 4 * depth);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // FIX: Guard against null context
    if (!ctx) {
      console.error("Could not create 2D canvas context");
      return null;
    }

    [grass1, grass2].forEach((texture, index) => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(texture.image, 0, 0);

      const imgData = ctx.getImageData(0, 0, width, height).data;
      const layerSize = width * height * 4;

      data.set(imgData, index * layerSize);
    });

    //Use DataArrayTexture instead of DataTexture2DArray-- it's  newer and has better support for mipmaps, which are crucial for texture filtering when the grass is viewed at various distances. DataTexture2DArray does not support mipmaps, which can lead to visual artifacts and poor performance when the grass is rendered
    const texArray = new THREE.DataArrayTexture(data, width, height, depth);
    texArray.format = THREE.RGBAFormat;
    texArray.type = THREE.UnsignedByteType;

    texArray.minFilter = THREE.LinearMipmapLinearFilter;
    texArray.magFilter = THREE.LinearFilter;
    texArray.wrapS = THREE.ClampToEdgeWrapping;
    texArray.wrapT = THREE.ClampToEdgeWrapping;
    texArray.generateMipmaps = true;
    texArray.needsUpdate = true;

    return texArray;
  }, [grass1, grass2]);

  const uniforms = useMemo(
    () => ({
      grassParams: {
        value: new THREE.Vector4(
          GRASS_SEGMENTS,
          GRASS_PATCH_SIZE,
          GRASS_WIDTH,
          GRASS_HEIGHT,
        ),
      },
      tileDataTexture: { value: null as THREE.Texture | null },
      grassDiffuse: { value: null as THREE.DataArrayTexture | null },
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  const grassMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        side: THREE.FrontSide,
        depthWrite: true,
        depthTest: true,
        // polygonOffset: true,
        // polygonOffsetFactor: -1,
        // polygonOffsetUnits: -4,
      }),
    [uniforms],
  );

  useEffect(() => {
    if (textureArrayUniform) {
      uniforms.grassDiffuse.value = textureArrayUniform;
    }
  }, [textureArrayUniform, uniforms]);

  useFrame(({ clock, size }) => {
    uniforms.time.value = clock.elapsedTime;
    uniforms.resolution.value.set(size.width, size.height);
    if (grassRef.current) {
      grassRef.current.updateMatrixWorld(true);
      if (grassRef.current) {
        grassRef.current.updateMatrixWorld(true);
        if (!hasLogged.current) {
          console.log(
            "grass matrixWorld:",
            grassRef.current.matrixWorld.elements,
          );
          console.log("grass position:", grassRef.current.position);
          hasLogged.current = true;
        }
      }
    }
  });

  const pathAlphaTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (pathCurve) {
      const points = pathCurve.getPoints(200);
      ctx.beginPath();
      points.forEach((point, index) => {
        const x = (point.x / GRASS_PATCH_SIZE + 0.5) * canvas.width;
        const y = (point.z / GRASS_PATCH_SIZE + 0.5) * canvas.height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = ((pathWidth * 2) / GRASS_PATCH_SIZE) * canvas.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.filter = "blur(8px)";
      ctx.stroke();

      // ctx.fillStyle = "#ffffff";
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      // // Draw a black horizontal bar across the middle
      // ctx.fillStyle = "#000000";
      // ctx.fillRect(0, canvas.height / 2 - 10, canvas.width, 20);

      // // Draw a black vertical bar down the middle
      // ctx.fillStyle = "#000000";
      // ctx.fillRect(canvas.width / 2 - 10, 0, 20, canvas.height);

      ctx.filter = "none";
    }

    const texture = new THREE.CanvasTexture(canvas);
    console.log("flipY:", texture.flipY);
    const link = document.createElement("a");
    link.download = "grass-mask.png";
    link.href = canvas.toDataURL("image/png");
    //link.click();

    return texture;
  }, [pathCurve, pathWidth]);

  useEffect(() => {
    if (pathAlphaTexture) {
      uniforms.tileDataTexture.value = pathAlphaTexture;
      console.log("tileDataTexture set:", pathAlphaTexture);
    }
  }, [pathAlphaTexture, uniforms]);

  return (
    <mesh
      geometry={grassGeometry}
      material={grassMaterial}
      position={[0, 2.8, 0]}
      renderOrder={0}
      frustumCulled={false}
      ref={grassRef}
    />
  );

  //   return (
  //     <mesh
  //       material={grassMaterial}
  //       position={[0, 0.0, 0]}
  //       rotation={[-Math.PI / 2, 0, 0]}
  //     >
  //       <planeGeometry args={[1000, 1000]} />
  //     </mesh>
  //   );
}
