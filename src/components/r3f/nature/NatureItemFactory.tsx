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
import StagStatue from "./StagStatue";
import BushWithPurpleFlowers from "./BushWithPurpleFlowers";
import FoxStatue from "./FoxStatue";
import DistantPine from "./DistantTree1";
import DistantTree2 from "./DistantTree2";
import DistantTree1 from "./DistantTree1";
import DistantTree3 from "./DistantTree3";
import DistantTree4 from "./DistantTree4";
import DistantTree5 from "./DistantTree5";
import DistantTree6 from "./DistantTree6";

interface NatureItemFactoryProps {
  itemId: string;
  position: [number, number, number];
  scale?: number;
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

export default function NatureItemFactory({
  itemId,
  position,
  scale = 1,
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
      return <PineTree position={position} scale={scale == 1 ? 0.5 : scale} />;
    case "distant_tree_1":
      return (
        <DistantTree1 position={position} scale={scale == 1 ? 0.4 : scale} />
      );
    case "distant_tree_2":
      return (
        <DistantTree2 position={position} scale={scale == 1 ? 0.8 : scale} />
      );
    case "distant_tree_3":
      return (
        <DistantTree3 position={position} scale={scale == 1 ? 0.8 : scale} />
      );
    case "distant_tree_4":
      return (
        <DistantTree4 position={position} scale={scale == 1 ? 0.8 : scale} />
      );
    case "distant_tree_5":
      return (
        <DistantTree5 position={position} scale={scale == 1 ? 0.8 : scale} />
      );
    case "distant_tree_6":
      return (
        <DistantTree6 position={position} scale={scale == 1 ? 0.8 : scale} />
      );
    case "deciduous":
    case "willow":
      return (
        <WillowTree position={position} scale={scale == 1 ? 0.3 : scale} />
      );
    case "stag_statue":
      return <StagStatue position={position} scale={0.5} />;
    case "fox_statue":
      return <FoxStatue position={position} scale={0.5} />;
    case "purple_flower_bush":
      return (
        <BushWithPurpleFlowers
          position={[position[0], position[1] - 0.3, position[2]]}
          scale={0.5}
        />
      );

    case "flowers_red":
      return (
        <RedFlowers position={position} scale={scale == 1 ? 0.5 : scale} />
      );
    case "flowers_blue":
      return <PurpleFlowers position={position} scale={scale} />;
    case "flowers_green":
      return (
        <Suspense fallback={null}>
          <GreenFlowers position={position} scale={scale == 1 ? 0.29 : scale} />
        </Suspense>
      );
    case "flowers_yellow":
      return (
        <YellowFlowers position={position} scale={scale == 1 ? 0.5 : scale} />
      );
    case "ferns":
      return <FernPlant position={position} scale={scale} />;
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
