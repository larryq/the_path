import { useEffect } from "react";
import { useAppStore } from "../../stores/useAppStore";

export default function IntroScreen() {
  const { phase, isDissolving, beginDissolve, startBuild } = useAppStore();

  useEffect(() => {
    if (!isDissolving) return;
    const timer = setTimeout(() => startBuild(), 900);
    return () => clearTimeout(timer);
  }, [isDissolving, startBuild]);

  if (phase !== "intro") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 60%, #1a3a2a 0%, #0d1f15 60%, #060e0a 100%)",
        transition: "opacity 0.85s ease-in-out",
        opacity: isDissolving ? 0 : 1,
        pointerEvents: isDissolving ? "none" : "auto",
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-xl text-center">
        <div className="flex flex-col items-center gap-2">
          <div
            className="text-xs tracking-[0.4em] uppercase mb-1"
            style={{
              color: "var(--color-accent)",
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
            }}
          >
            a nature walk
          </div>
          <h1
            className="text-5xl md:text-6xl leading-tight"
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              color: "var(--color-text-light)",
              textShadow: "0 0 60px rgba(126,203,161,0.3)",
            }}
          >
            The Path
          </h1>
          <div
            className="w-16 h-px mt-2"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--color-accent), transparent)",
            }}
          />
        </div>

        <div
          className="flex flex-col gap-4 text-lg leading-relaxed"
          style={{
            color: "var(--color-text-dim)",
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 300,
          }}
        >
          <Row text="Click and drag across the hexagonal tiles to draw a winding path." />
          <Row text="Release to lock the path. Bordering tiles will glow pink — click to choose what grows there." />
          <Row text="Trees, flowers, brooks, boulders — make it yours. Empty tiles default to grass." />
          <Row text="Press Done and walk the path you made." />
        </div>

        <div
          className="text-med tracking-wide"
          style={{
            color: "#4a6a5a",
            fontFamily: "'Raleway', sans-serif",
          }}
        >
          Touch &amp; drag on mobile · WASD or arrow keys to walk, mouse to look
          around
        </div>

        <button
          onClick={beginDissolve}
          className="text-lg mt-2 px-12 py-6 tracking-[0.3em] uppercase transition-all duration-300"
          style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 500,
            color: "var(--color-forest-deep)",
            background:
              "linear-gradient(135deg, var(--color-accent) 0%, #5aad80 100%)",
            border: "none",
            cursor: "pointer",
            clipPath:
              "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            boxShadow: "0 0 40px rgba(126,203,161,0.25)",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

function Row({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 text-left">
      <span
        style={{
          color: "var(--color-accent)",
          flexShrink: 0,
          marginTop: "2px",
          fontSize: "0.6rem",
        }}
      >
        ✦
      </span>
      <span>{text}</span>
    </div>
  );
}
