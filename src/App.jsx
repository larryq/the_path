// ─────────────────────────────────────────────────────────────────────────────
// App
// Root component. Detects mobile, routes between phases, layers the UI
// over the R3F canvas.
//
// Layer order (bottom to top):
//   1. Scene (R3F Canvas) — always mounted after intro dissolve begins
//   2. BuildHUD — 2D overlay for the build phase
//   3. NatureDialog — modal, above HUD
//   4. IntroScreen — topmost, fades out on Get Started
// ─────────────────────────────────────────────────────────────────────────────

//import { useEffect, useState } from "react";
import { useAppStore } from "./stores/useAppStore";
import IntroScreen from "./components/ui/IntroScreen";
import BuildHUD from "./components/ui/BuildHUD";
import NatureDialog from "./components/ui/NatureDialog";
import Scene from "./components/r3f/Scene";
import { useIsMobile } from "./hooks/useIsMobile";
import WalkHUD from "./components/ui/WalkHUD";

export default function App() {
  const phase = useAppStore((s) => s.phase);
  const isDissolving = useAppStore((s) => s.isDissolving);
  const isMobile = useIsMobile();

  // Mount the Scene as soon as dissolve starts (so it's ready when visible)
  const showScene = phase !== "intro" || isDissolving;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {showScene && <Scene isMobile={isMobile} />}
      {phase === "build" && <BuildHUD />}
      {phase === "build" && <NatureDialog />}

      {phase === "walk" && <WalkHUD />}
      <IntroScreen />
    </div>
  );
}
