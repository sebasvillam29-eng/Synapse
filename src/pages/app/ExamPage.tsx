import { useState } from "react";
import { Check } from "lucide-react";

const studySets = [
  { emoji: "🧬", title: "Biology Ch.4 — Photosynthesis", meta: "12 flashcards · 1 quiz", mastery: 73 },
  { emoji: "⚖️", title: "Contract Law — Week 3", meta: "8 flashcards · 1 quiz", mastery: 45 },
  { emoji: "⚙️", title: "Thermodynamics", meta: "15 flashcards · 2 quizzes", mastery: 91 },
];

const examSettings = [
  { label: "Questions", value: "20 multiple choice" },
  { label: "Time limit", value: "25 minutes" },
  { label: "Order", value: "Randomized" },
  { label: "After exam", value: "Full answer breakdown" },
];

const ProBadge = ({ size = "sm" }: { size?: "sm" | "md" }) => (
  <span
    className={`inline-flex items-center font-bold uppercase ${size === "md" ? "text-[11px] py-1 px-2.5" : "text-[9px] py-0.5 px-1.5"}`}
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

const ProgressRing = ({ value }: { value: number }) => {
  const r = 17;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  const color = value > 80 ? "#2dd4bf" : value > 55 ? "#9d7fe0" : "rgba(251,191,36,0.85)";

  return (
    <div className="w-[42px] h-[42px] relative shrink-0">
      <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
        <circle cx="21" cy="21" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
        <circle cx="21" cy="21" r={r} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">{value}%</span>
    </div>
  );
};

const ExamPage = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="max-w-[680px] mx-auto" style={{ padding: "40px 48px" }}>
      {/* Header */}
      <div className="mb-9">
        <h1 className="text-[34px] text-foreground flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
          Full Exam <ProBadge size="md" />
        </h1>
        <p className="text-[15px] text-muted-foreground mt-2" style={{ lineHeight: 1.75 }}>
          Generate a timed, full-length exam from any of your study sets — 20 questions, randomized order, with a detailed score breakdown at the end.
        </p>
      </div>

      {/* Section 1 — Choose a study set */}
      <div>
        <p className="text-[12px] uppercase text-muted-foreground font-semibold mb-3.5" style={{ letterSpacing: "0.09em" }}>
          1. Choose a study set
        </p>
        <div className="flex flex-col gap-2.5">
          {studySets.map((set, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className="flex items-center gap-3.5 text-left transition-all duration-200"
                style={{
                  padding: "16px 20px",
                  background: isSelected ? "#16162a" : "#111120",
                  border: `1px solid ${isSelected ? "rgba(124,92,191,0.5)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 12,
                  boxShadow: isSelected ? "0 4px 20px rgba(124,92,191,0.12)" : "none",
                }}
                onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = "rgba(124,92,191,0.3)"; e.currentTarget.style.background = "#141424"; } }}
                onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "#111120"; } }}
              >
                <span className="text-[22px] shrink-0">{set.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-foreground">{set.title}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{set.meta}</p>
                </div>
                <ProgressRing value={set.mastery} />
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2 — Exam settings */}
      <div className="mt-9">
        <p className="text-[12px] uppercase text-muted-foreground font-semibold mb-3.5" style={{ letterSpacing: "0.09em" }}>
          2. Exam settings
        </p>
        <div style={{ background: "#111120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "22px 24px" }}>
          {examSettings.map((row, i) => (
            <div
              key={row.label}
              className="flex items-center justify-between"
              style={{
                padding: "10px 0",
                borderBottom: i < examSettings.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              <span className="text-[14px]" style={{ color: "rgba(232,232,240,0.45)" }}>{row.label}</span>
              <span className="text-[14px] font-medium text-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Begin button */}
      <button
        disabled={selected === null}
        className="w-full mt-6 text-[15px] font-semibold transition-all duration-[250ms]"
        style={{
          padding: 14,
          borderRadius: 10,
          background: selected !== null ? "linear-gradient(135deg,#7c5cbf,#5b3fa8)" : "rgba(255,255,255,0.05)",
          color: selected !== null ? "#fff" : "rgba(232,232,240,0.25)",
          cursor: selected !== null ? "pointer" : "default",
          boxShadow: selected !== null ? "0 4px 20px rgba(124,92,191,0.3)" : "none",
        }}
      >
        {selected !== null ? `Begin Exam — ${studySets[selected].title} →` : "Select a study set to begin"}
      </button>
    </div>
  );
};

export default ExamPage;
