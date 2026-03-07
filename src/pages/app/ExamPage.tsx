import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus } from "lucide-react";

const studySets = [
  { id: "bio4", emoji: "🧬", title: "Biology Ch.4 — Photosynthesis", meta: "12 flashcards · 1 quiz" },
  { id: "law3", emoji: "⚖️", title: "Contract Law — Week 3", meta: "8 flashcards · 1 quiz" },
  { id: "thermo", emoji: "⚙️", title: "Thermodynamics", meta: "15 flashcards · 2 quizzes" },
];

const questionTypes = [
  { emoji: "🔘", title: "Multiple Choice", desc: "4 options, one correct" },
  { emoji: "✏️", title: "Long Answer", desc: "Write out full explanations" },
  { emoji: "⚡", title: "Mixed", desc: "Combination of both types" },
];

const timeLimits = [10, 15, 20, 25, 30, 45, 60];

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

const ExamPage = () => {
  const navigate = useNavigate();
  const [selectedSet, setSelectedSet] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [questionCount, setQuestionCount] = useState(20);
  const [timeMinutes, setTimeMinutes] = useState(25);

  const ready = selectedSet !== null && selectedType !== null;

  const handleBegin = () => {
    if (!ready) return;
    navigate("/app/exam/session", {
      state: {
        studySetId: studySets[selectedSet!].id,
        questionType: questionTypes[selectedType!].title,
        questionCount,
        timeMinutes,
      },
    });
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 640, padding: "40px 48px" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400 }}>
          Full Exam <ProBadge />
        </h1>
        <p className="text-[14px] text-muted-foreground mt-2">Set up your exam exactly how you want it.</p>
      </div>

      {/* Step 1 — Study Set */}
      <SectionLabel>1 · Choose a study set</SectionLabel>
      <div className="flex flex-col gap-2">
        {studySets.map((set, i) => {
          const sel = selectedSet === i;
          return (
            <button
              key={i}
              onClick={() => setSelectedSet(i)}
              className="flex items-center gap-3 text-left transition-all duration-200"
              style={{
                padding: "14px 18px",
                background: sel ? "#16162a" : "#111120",
                border: `1px solid ${sel ? "rgba(124,92,191,0.5)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 12,
              }}
              onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = "rgba(124,92,191,0.3)"; } }}
              onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; } }}
            >
              <span style={{ fontSize: 20 }}>{set.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold" style={{ color: "#e8e8f0" }}>{set.title}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{set.meta}</p>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                border: `2px solid ${sel ? "#9d7fe0" : "rgba(232,232,240,0.3)"}`,
                background: sel ? "#9d7fe0" : "transparent",
                transition: "all 0.2s",
              }} />
            </button>
          );
        })}
      </div>

      {/* Step 2 — Question Type */}
      <div className="mt-7">
        <SectionLabel>2 · Question type</SectionLabel>
        <div className="grid grid-cols-3 gap-2.5">
          {questionTypes.map((qt, i) => {
            const sel = selectedType === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedType(i)}
                className="text-center transition-all duration-200"
                style={{
                  padding: "16px 14px",
                  background: sel ? "#16162a" : "#111120",
                  border: `1px solid ${sel ? "rgba(124,92,191,0.5)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 12,
                  boxShadow: sel ? "0 4px 16px rgba(124,92,191,0.12)" : "none",
                }}
              >
                <span style={{ fontSize: 20 }}>{qt.emoji}</span>
                <p className="text-[13px] font-semibold mt-2" style={{ color: "#e8e8f0" }}>{qt.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{qt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3 — Settings */}
      <div className="mt-7">
        <SectionLabel>3 · Exam settings</SectionLabel>
        <div style={{ background: "#111120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
          {/* Question count */}
          <div className="flex items-center justify-between" style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div>
              <p className="text-[14px] font-medium" style={{ color: "#e8e8f0" }}>Number of questions</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">How many questions in total</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuestionCount(c => Math.max(5, c - 5))}
                className="flex items-center justify-center transition-colors hover:border-primary/50"
                style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
              >
                <Minus className="w-3 h-3 text-muted-foreground" />
              </button>
              <span className="text-[18px] font-bold text-center" style={{ color: "#9d7fe0", minWidth: 32 }}>{questionCount}</span>
              <button
                onClick={() => setQuestionCount(c => Math.min(50, c + 5))}
                className="flex items-center justify-center transition-colors hover:border-primary/50"
                style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
              >
                <Plus className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Time limit */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium" style={{ color: "#e8e8f0" }}>Time limit</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">How long you have to finish</p>
            </div>
            <div className="flex items-center gap-1.5">
              {timeLimits.map(t => {
                const sel = timeMinutes === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTimeMinutes(t)}
                    className="transition-all duration-200 text-[12px]"
                    style={{
                      padding: "5px 10px",
                      borderRadius: 8,
                      border: `1px solid ${sel ? "rgba(124,92,191,0.5)" : "rgba(255,255,255,0.08)"}`,
                      background: sel ? "rgba(124,92,191,0.15)" : "rgba(255,255,255,0.03)",
                      color: sel ? "#9d7fe0" : "rgba(232,232,240,0.45)",
                      fontWeight: sel ? 600 : 400,
                    }}
                  >
                    {t}m
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      {ready && (
        <div
          className="animate-fade-in flex items-center gap-4 flex-wrap mt-6"
          style={{
            padding: "14px 18px",
            background: "rgba(124,92,191,0.06)",
            border: "1px solid rgba(124,92,191,0.2)",
            borderRadius: 12,
          }}
        >
          {[
            { icon: "📚", text: studySets[selectedSet!].title },
            { icon: "🔘", text: questionTypes[selectedType!].title },
            { icon: "❓", text: `${questionCount} questions` },
            { icon: "⏱", text: `${timeMinutes} min` },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[13px]" style={{ color: "rgba(232,232,240,0.7)" }}>
              <span>{item.icon}</span> {item.text}
              {i < 3 && <span className="ml-2" style={{ color: "rgba(232,232,240,0.2)" }}>·</span>}
            </span>
          ))}
        </div>
      )}

      {/* Begin button */}
      <button
        onClick={handleBegin}
        disabled={!ready}
        className="w-full text-[15px] font-semibold transition-all duration-[250ms]"
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 10,
          background: ready ? "linear-gradient(135deg, #7c5cbf, #5b3fa8)" : "rgba(255,255,255,0.05)",
          color: ready ? "#fff" : "rgba(232,232,240,0.25)",
          cursor: ready ? "pointer" : "not-allowed",
          boxShadow: ready ? "0 4px 20px rgba(124,92,191,0.3)" : "none",
        }}
      >
        {ready ? "Begin Exam →" : "Complete setup to continue"}
      </button>
    </div>
  );
};

export default ExamPage;
