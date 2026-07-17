// src/components/ui/WalkHUD.tsx

import { useAppStore } from "../../stores/useAppStore";
import { useGridStore } from "../../stores/useGridStore";
import { useWeatherStore } from "../../stores/useWeatherStore";

export default function WalkHUD() {
  const startBuild = useAppStore((s) => s.startBuild);
  const resetGrid = useGridStore((s) => s.resetGrid);
  const timeOfDay = useWeatherStore((s) => s.timeOfDay);
  const toggleTimeOfDay = useWeatherStore((s) => s.toggleTimeOfDay);

  const handleReturnToBuild = () => {
    resetGrid();
    startBuild();
  };

  const isDay = timeOfDay === "day";

  return (
    <div className="fixed top-5 right-5 z-20 pointer-events-auto flex flex-col gap-2">
      {/* Day/Night toggle */}
      <button
        onClick={toggleTimeOfDay}
        className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase"
        style={{
          background: "rgba(10, 24, 16, 0.88)",
          border: "1px solid rgba(126,203,161,0.2)",
          backdropFilter: "blur(12px)",
          borderRadius: "2px",
          color: "var(--color-text-dim)",
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 300,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "rgba(126,203,161,0.5)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "rgba(126,203,161,0.2)")
        }
      >
        <span>{isDay ? "🌙" : "☀️"}</span>
        <span>{isDay ? "Switch to Night" : "Switch to Day"}</span>
      </button>

      {/* Return to build */}
      <button
        onClick={handleReturnToBuild}
        className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase"
        style={{
          background: "rgba(10, 24, 16, 0.88)",
          border: "1px solid rgba(126,203,161,0.2)",
          backdropFilter: "blur(12px)",
          borderRadius: "2px",
          color: "var(--color-text-dim)",
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 300,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "rgba(126,203,161,0.5)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "rgba(126,203,161,0.2)")
        }
      >
        <span>←</span>
        <span>Start Over</span>
      </button>
    </div>
  );
}
