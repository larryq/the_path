import { useGridStore } from "../../stores/useGridStore";
import { useAppStore } from "../../stores/useAppStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import InstructionDialog from "./InstructionDialog";
import { useEffect, useState } from "react";

export default function BuildHUD() {
  const {
    path,
    isDragging,
    pathCommitted,
    adjacentTiles,
    placedNature,
    resetGrid,
  } = useGridStore();
  const startWalk = useAppStore((s) => s.startWalk);
  const isMobile = useIsMobile();

  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const [showPathDialog, setShowPathDialog] = useState(false);

  // Dismiss welcome dialog when dragging starts
  useEffect(() => {
    if (isDragging) setShowWelcomeDialog(false);
  }, [isDragging]);

  // Show path dialog when path is committed
  useEffect(() => {
    if (pathCommitted) setShowPathDialog(true);
  }, [pathCommitted]);

  // Hide path dialog when grid is reset
  useEffect(() => {
    if (!pathCommitted) setShowPathDialog(false);
  }, [pathCommitted]);

  const placedCount = Object.keys(placedNature).length;
  const canWalk = pathCommitted && path.length >= 2;

  const welcomeMessage = isMobile
    ? "Welcome! Tap and hold on a tile, then drag to draw a path you would like to walk along. When done lift your finger. If you don't like the path just hit the reset button at the bottom."
    : "Welcome! Click and hold on a tile, then drag a path you would like to walk along. When done release the mouse button. If you don't like the path just hit the reset button at the bottom.";

  const pathMessage = isMobile
    ? "Tap each pink tile and choose what sort of nature you'd like there. To fill in the rest randomly, use the button at the bottom of the selection dialog.\nWhen done, press the 'Begin Walk' button to start."
    : "Click each pink tile and choose what sort of nature you'd like there. To fill in the rest randomly, use the button at the bottom of the selection dialog.\nWhen done, press the 'Begin Walk' button to start.";

  let hudState: "idle" | "dragging" | "placing" = "idle";
  if (isDragging) hudState = "dragging";
  else if (pathCommitted) hudState = "placing";

  return (
    <div className="fixed inset-0 z-20 pointer-events-none no-select">
      {/* Welcome dialog */}
      {showWelcomeDialog && (
        <InstructionDialog
          title="Welcome to The Path"
          message={welcomeMessage}
          onClose={() => setShowWelcomeDialog(false)}
        />
      )}

      {/* Path committed dialog */}
      {showPathDialog && (
        <InstructionDialog
          title="Choose Your Nature"
          message={pathMessage}
          onClose={() => setShowPathDialog(false)}
        />
      )}

      {/* Upper-right hint */}
      <div className="absolute top-5 right-5 pointer-events-auto">
        {hudState === "idle" && (
          <HintCard>
            <span className="text-lg mb-1">🌿</span>
            <p>Click and drag to draw your path</p>
          </HintCard>
        )}
        {hudState === "dragging" && (
          <HintCard accent>
            <span className="text-lg mb-1">✦</span>
            <p>
              {path.length} tile{path.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs mt-1 opacity-60">Release to lock</p>
          </HintCard>
        )}
        {hudState === "placing" && (
          <HintCard>
            <span className="text-lg mb-1">🌲</span>
            <p>
              Click a{" "}
              <span style={{ color: "var(--color-tile-adjacent)" }}>
                glowing tile
              </span>{" "}
              to place nature
            </p>
            <p className="text-xs mt-1 opacity-60">
              {placedCount} / {adjacentTiles.length} filled
            </p>
          </HintCard>
        )}
      </div>

      {/* Path-locked banner */}
      {pathCommitted && placedCount === 0 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div
            className="flex items-center gap-3 px-5 py-3"
            style={{
              background: "rgba(13,31,21,0.92)",
              border: "1px solid rgba(126,203,161,0.2)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <span
              className="text-xs tracking-widest uppercase"
              style={{
                color: "var(--color-text-dim)",
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              Path locked · {path.length} tiles
            </span>
            <div
              className="w-px h-4"
              style={{ background: "rgba(126,203,161,0.2)" }}
            />
            <button
              onClick={resetGrid}
              className="text-xs tracking-wider uppercase"
              style={{
                color: "var(--color-text-dim)",
                fontFamily: "'Raleway', sans-serif",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      {canWalk && (
        <div className="text-lg absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
          <GhostButton onClick={resetGrid}>↺ Reset</GhostButton>
          <PrimaryButton onClick={startWalk}>Done — Begin Walk →</PrimaryButton>
        </div>
      )}
    </div>
  );
}

function HintCard({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-start gap-1 p-4 max-w-[300px]"
      style={{
        background: "rgba(13,31,21,0.88)",
        border: `1px solid ${accent ? "rgba(240,208,128,0.3)" : "rgba(126,203,161,0.15)"}`,
        backdropFilter: "blur(12px)",
        borderRadius: "2px",
        color: "var(--color-text-dim)",
        fontSize: "0.78rem",
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 300,
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-4 text-lg tracking-[0.25em] uppercase"
      style={{
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 500,
        cursor: "pointer",
        border: "none",
        color: "var(--color-forest-deep)",
        background:
          "linear-gradient(135deg, var(--color-accent) 0%, #5aad80 100%)",
        clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-4 tracking-[0.25em] uppercase"
      style={{
        fontFamily: "'Raleway', sans-serif",
        fontWeight: 500,
        cursor: "pointer",
        background: "rgba(255,255,255,0.06)",
        color: "var(--color-text-dim)",
        borderRadius: "2px",
        outline: "1px solid rgba(255,255,255,0.1)",
        border: "none",
      }}
    >
      {children}
    </button>
  );
}
