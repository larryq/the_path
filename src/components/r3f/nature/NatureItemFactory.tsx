// src/components/r3f/nature/NatureItemFactory.tsx
//water fountain at https://poly.pizza/m/2guUSHGDPZ
import { Suspense } from "react";
import { Bush } from "../environment/Bush";
import BerryBush from "./BerryBush";
import Vine1 from "./Vine1";
import HayBale from "./HayBale";
import Mushrooms from "./Mushrooms";
import Boulder from "./Boulder";
import PurpleFlowers from "./PurpleFlowers";
import YellowFlowers from "./YellowFlowers";
import RedFlowers from "./RedFlowers";
import WillowTree from "./WillowTree";
import PineTree from "./PineTree";
import FernPlant from "./FernPlant";
import Fountain from "./Fountain";
import GreenFlowers from "./GreenFlowers";

interface NatureItemFactoryProps {
  itemId: string;
  position: [number, number, number];
}

// Placeholder geometries for items without real components yet
function TreePlaceholder({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 2.0, 8]} />
        <meshStandardMaterial color="#5c3d1e" roughness={0.9} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[1.0, 2.5, 8]} />
        <meshStandardMaterial color="#2d5a1b" roughness={0.8} />
      </mesh>
    </group>
  );
}

function FlowerPlaceholder({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={[position[0], position[1] + 0.2, position[2]]}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

function MushroomPlaceholder({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#c0392b" roughness={0.7} />
      </mesh>
    </group>
  );
}

function HayBalePlaceholder({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <mesh
      position={[position[0], position[1] + 0.4, position[2]]}
      rotation={[0, 0, Math.PI / 2]}
    >
      <cylinderGeometry args={[0.5, 0.5, 0.9, 12]} />
      <meshStandardMaterial color="#c8a84b" roughness={0.9} />
    </mesh>
  );
}

function BoulderPlaceholder({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <mesh position={[position[0], position[1] + 0.3, position[2]]}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#7a7a72" roughness={0.95} />
    </mesh>
  );
}

function FernPlaceholder({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={[position[0], position[1] + 0.2, position[2]]}>
      <sphereGeometry args={[0.4, 8, 8]} />
      <meshStandardMaterial color="#1a5c1a" roughness={0.8} />
    </mesh>
  );
}

function BrookPlaceholder({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.8, 0.8]} />
      <meshStandardMaterial color="#2a6aad" roughness={0.1} metalness={0.3} />
    </mesh>
  );
}

export default function NatureItemFactory({
  itemId,
  position,
}: NatureItemFactoryProps) {
  switch (itemId) {
    case "bush":
      return (
        <Suspense fallback={null}>
          <Bush position={position} />
        </Suspense>
      );
    case "berry_bush":
      return (
        <Suspense fallback={null}>
          <BerryBush
            position={position}
            scale={2.25}
            rotation={[0.0, 0.8, 0.0]}
          />
        </Suspense>
      );
    case "pine":
      return <PineTree position={position} scale={0.5} />;
    case "deciduous":
    case "willow":
      return <WillowTree position={position} scale={0.3} />;

    case "flowers_red":
      return <RedFlowers position={position} scale={0.5} />;
    case "flowers_blue":
      return <PurpleFlowers position={position} />;
    case "flowers_green":
      return (
        <Suspense fallback={null}>
          <GreenFlowers position={position} scale={0.29} />
        </Suspense>
      );
    case "flowers_yellow":
      return <YellowFlowers position={position} scale={0.5} />;
    case "ferns":
      return <FernPlant position={position} />;
    case "mushrooms":
      return <Mushrooms position={[position[0], position[1], position[2]]} />;
    case "hay_bale":
      return (
        <HayBale position={position} scale={0.25} rotation={[0.0, 0.8, 0.0]} />
      );
    case "boulders":
      return <Boulder position={position} scale={1.25} />;
    case "brook":
      return <Fountain position={position} scale={0.5} />;
    case "vine":
      return <Vine1 position={position} scale={0.5} />;

    default:
      return null;
  }
}
