import { useState, useEffect } from "react";

interface MindMapTopic { emoji: string; title: string; description: string; }

const defaultTopics: MindMapTopic[] = [
  { emoji: "🗺️", title: "Full document", description: "Map everything — all chapters and sections" },
  { emoji: "🌿", title: "Photosynthesis", description: "Light reactions, Calvin cycle, chlorophyll" },
  { emoji: "⚡", title: "Light-Dependent Reactions", description: "Thylakoid, photolysis, ATP/NADPH" },
  { emoji: "🔄", title: "Calvin Cycle", description: "RuBisCO, G3P, carbon fixation" },
  { emoji: "🎨", title: "Chlorophyll & Pigments", description: "Absorption spectrum, carotenoids" },
];

const mapNodes = [
  { x: 80, y: 60, label: "Light Reactions" },
  { x: 440, y: 60, label: "Calvin Cycle" },
  { x: 80, y: 260, label: "Chlorophyll" },
  { x: 440, y: 260, label: "ATP/NADPH" },
  { x: 260, y: 310, label: "Glucose" },
];

const ProBadge = () => (
  <span
    className="inline-flex items-center font-bold uppercase text-[10px] py-0.5 px-2"
    style={{
      background: "rgba(251,191,36,0.1)",
      border: "1px solid rgba(251,191,36,0.3)",
      color: "rgba(251,191,36,0.9)",
      letterSpacing: "0.05em",
      borderRadius: 100,
    }}
  >
    PRO
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground font-semibold mb-3" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.09em" }}>
    {children}
  </p>
);

const MindMapPage = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [step, setStep] = useState<"pick" | "map">("pick");
  const [visibleCount, setVisibleCount] = useState(0);

  const topics = defaultTopics;
  const totalNodes = mapNodes.length + 1;

  useEffect(() => {
    if (step !== "map") return;
    setVisibleCount(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= totalNodes + mapNodes.length) clearInterval(interval);
    }, 180);
    return () => clearInterval(interval);
  }, [step]);

  const handleGenerate = () => {
    if (selectedIdx === null) return;
    setStep("map");
  };

  const selectedTopic = selectedIdx !== null ? topics[selectedIdx] : null;

  if (step === "pick") {
    return (
      <div className="mx-auto animate-fade-in" style={{ maxWidth: 640, padding: "40px 48px" }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400 }}>
            Mind Map <ProBadge />
          </h1>
          <p className="text-[14px] text-muted-foreground mt-2">Choose what to map.</p>
        </div>

        {/* Step 1 — Topic */}
        <SectionLabel>1 · Choose a topic</SectionLabel>
        <div className="flex flex-col gap-2">
          {topics.map((t, i) => {
            const sel = selectedIdx === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className="w-full flex items-center gap-3 text-left transition-all duration-200"
                style={{
                  padding: "14px 18px",
                  background: sel ? "#16162a" : "#111120",
                  border: `1px solid ${sel ? "rgba(124,92,191,0.5)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 12,
                  boxShadow: sel ? "0 4px 16px rgba(124,92,191,0.1)" : "none",
                }}
                onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = "rgba(124,92,191,0.3)"; e.currentTarget.style.background = "#141424"; } }}
                onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "#111120"; } }}
              >
                <div className="flex items-center justify-center shrink-0" style={{ width: 40, height: 40 }}>
                  <span style={{ fontSize: 24 }}>{t.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold" style={{ color: "#e8e8f0" }}>{t.title}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{t.description}</p>
                </div>
                <div className="shrink-0 flex items-center justify-center" style={{ width: 20, height: 20 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    border: `2px solid ${sel ? "#9d7fe0" : "rgba(232,232,240,0.3)"}`,
                    background: sel ? "#9d7fe0" : "transparent",
                    transition: "all 0.2s",
                  }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={selectedIdx === null}
          className="w-full text-[15px] font-semibold transition-all duration-[250ms] mt-5"
          style={{
            padding: 14,
            borderRadius: 10,
            background: selectedIdx !== null ? "linear-gradient(135deg, #7c5cbf, #5b3fa8)" : "rgba(255,255,255,0.05)",
            color: selectedIdx !== null ? "#fff" : "rgba(232,232,240,0.25)",
            boxShadow: selectedIdx !== null ? "0 4px 16px rgba(124,92,191,0.3)" : "none",
            cursor: selectedIdx !== null ? "pointer" : "not-allowed",
          }}
        >
          {selectedIdx !== null ? `Generate map — ${topics[selectedIdx].title} →` : "Select a topic to continue"}
        </button>
      </div>
    );
  }

  // STEP 2 — MAP VIEW
  const centerX = 260, centerY = 160;
  const topicLabel = selectedTopic?.title ?? "Document";
  const nodeLabels = topicLabel === "Full document"
    ? ["Light Reactions", "Calvin Cycle", "Chlorophyll", "ATP/NADPH", "Glucose"]
    : mapNodes.map((_, i) => `Subtopic ${i + 1}`);

  const handleCopyText = () => {
    const lines = [`${topicLabel}`, ...nodeLabels.map(l => `  - ${l}`)];
    navigator.clipboard.writeText(lines.join("\n"));
  };

  return (
    <div className="mx-auto animate-fade-in" style={{ maxWidth: 640, padding: "40px 48px" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-foreground flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24 }}>
            {topicLabel} <ProBadge />
          </h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">{mapNodes.length + 1} nodes</p>
        </div>
        <button
          onClick={() => { setStep("pick"); setVisibleCount(0); }}
          className="text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
        >
          ← Change topic
        </button>
      </div>

      <svg
        viewBox="0 0 520 380"
        className="w-full"
        style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}
      >
        {mapNodes.map((b, i) => {
          const lineIdx = totalNodes + i;
          const visible = visibleCount > lineIdx;
          return (
            <line
              key={`l-${i}`}
              x1={centerX} y1={centerY} x2={b.x} y2={b.y}
              stroke="rgba(124,92,191,0.3)" strokeWidth="1.5" strokeDasharray="4 3"
              style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease" }}
            />
          );
        })}

        <g style={{
          opacity: visibleCount > 0 ? 1 : 0,
          transform: visibleCount > 0 ? "scale(1)" : "scale(0)",
          transformOrigin: `${centerX}px ${centerY}px`,
          transition: "all 0.35s ease",
        }}>
          <ellipse cx={centerX} cy={centerY} rx={70} ry={26} fill="rgba(124,92,191,0.25)" stroke="rgba(124,92,191,0.6)" strokeWidth="1.5" />
          <text x={centerX} y={centerY + 4} textAnchor="middle" fill="#c4a8ff" fontSize="12" fontWeight="600">
            {topicLabel.length > 16 ? topicLabel.slice(0, 14) + "…" : topicLabel}
          </text>
        </g>

        {mapNodes.map((b, i) => {
          const nodeIdx = i + 1;
          const visible = visibleCount > nodeIdx;
          return (
            <g key={`n-${i}`} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0)",
              transformOrigin: `${b.x}px ${b.y}px`,
              transition: "all 0.35s ease",
            }}>
              <ellipse cx={b.x} cy={b.y} rx={58} ry={20} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <text x={b.x} y={b.y + 4} textAnchor="middle" fill="rgba(232,232,240,0.75)" fontSize="11">{nodeLabels[i]}</text>
            </g>
          );
        })}
      </svg>

      <div className="flex items-center gap-2 mt-4">
        <button onClick={handleCopyText} className="text-[12px] text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5" style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          📋 Copy as text
        </button>
        <button className="text-[12px] text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5" style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          ⬇ Download PNG
        </button>
      </div>
    </div>
  );
};

export default MindMapPage;
