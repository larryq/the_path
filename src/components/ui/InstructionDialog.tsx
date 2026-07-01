interface InstructionDialogProps {
  title: string;
  message: string;
  onClose: () => void;
}

export default function InstructionDialog({
  title,
  message,
  onClose,
}: InstructionDialogProps) {
  return (
    <div
      className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-auto"
      style={{ zIndex: 30, width: "min(500px, 90vw)" }}
    >
      <div
        className="flex flex-col gap-4"
        style={{
          // background: "rgba(15, 40, 25, 0.97)",
          background: "rgba(230, 245, 235, 0.97)",
          border: "1px solid rgba(126,203,161,0.35)",
          backdropFilter: "blur(16px)",
          borderRadius: "2px",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(126,203,161,0.1)",
          padding: "1rem",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div
            className="text-xs tracking-[0.35em] uppercase"
            style={{ color: "#2a6a3a", fontFamily: "'Raleway', sans-serif" }}
          >
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#4a8a5a",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            ✕
          </button>
        </div>

        {/* Message */}
        <p
          className="text-base leading-relaxed"
          style={{
            color: "#2a4a35",
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 300,
            whiteSpace: "pre-line",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
