import { useState } from "react";
import { useGridStore } from "../../stores/useGridStore";
import {
  NATURE_ITEMS,
  CATEGORIES,
  NatureItem,
  NatureCategory,
} from "../../config/natureItems.config";

const CATEGORY_LABELS: Record<NatureCategory, string> = {
  tree: "Trees",
  plant: "Plants",
  water: "Water",
  object: "Objects",
};

export default function NatureDialog() {
  const { dialogTile, closeDialog, placeNature, fillInMissingNature } =
    useGridStore();
  const [activeCategory, setActiveCategory] = useState<NatureCategory>("tree");

  if (!dialogTile) return null;
  const { q, r } = dialogTile;
  const items = NATURE_ITEMS.filter((i) => i.category === activeCategory);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
      onClick={closeDialog}
    >
      <div
        className="relative flex flex-col"
        style={{
          background: "rgba(10,24,16,0.97)",
          border: "1px solid rgba(126,203,161,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          borderRadius: "2px",
          width: "min(480px, 90vw)",
          maxHeight: "70vh",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(126,203,161,0.1)" }}
        >
          <div
            className="text-xs tracking-[0.35em] uppercase"
            style={{
              color: "var(--color-accent)",
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            Choose Nature
          </div>
          <button
            onClick={closeDialog}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-dim)",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Category tabs */}
        <div
          className="flex"
          style={{ borderBottom: "1px solid rgba(126,203,161,0.1)" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-1 py-2.5 text-xs tracking-wider uppercase"
              style={{
                fontFamily: "'Raleway', sans-serif",
                background: "none",
                border: "none",
                cursor: "pointer",
                color:
                  activeCategory === cat ? "var(--color-accent)" : "#3a5a4a",
                borderBottom:
                  activeCategory === cat
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
                fontWeight: activeCategory === cat ? 500 : 300,
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Items */}
        <div
          className="grid gap-2 p-4 overflow-y-auto flex-1"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          }}
        >
          {items.map((item) => (
            <NatureCard
              key={item.id}
              item={item}
              onSelect={() => placeNature(q, r, item.id)}
            />
          ))}
        </div>

        {/* "Fill in the rest for me" button */}

        <div
          className="px-4 pb-4 pt-4"
          style={{ borderTop: "1px solid rgba(126,203,161,0.1)" }}
        >
          <button
            onClick={() => fillInMissingNature()}
            className="w-full px-4 py-2 rounded-md bg-blue-600 text-white font-medium 
               hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150"
          >
            Fill in the rest of the tiles for me
          </button>
        </div>
      </div>
    </div>
  );
}

function NatureCard({
  item,
  onSelect,
}: {
  item: NatureItem;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex flex-col items-center gap-2 p-3 transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(126,203,161,0.1)",
        borderRadius: "2px",
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{item.emoji}</span>
      <div
        className="text-xs font-medium"
        style={{
          color: "var(--color-text-light)",
          fontFamily: "'Raleway', sans-serif",
        }}
      >
        {item.label}
      </div>
    </button>
  );
}
