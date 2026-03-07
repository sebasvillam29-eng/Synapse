import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight, ChevronLeft, Edit3, RefreshCw, Copy, Download,
  Check, X,
} from "lucide-react";

type ToolId = "summary" | "flashcards" | "quiz" | "exam" | "mindmap";

const toolItems: { id: ToolId; emoji: string; title: string; sub: string }[] = [
  { id: "summary", emoji: "📄", title: "Summary", sub: "Key concepts" },
  { id: "flashcards", emoji: "🃏", title: "Flashcards", sub: "24 cards" },
  { id: "quiz", emoji: "✅", title: "Quick Quiz", sub: "5 questions" },
  { id: "exam", emoji: "🎓", title: "Full Exam", sub: "20 questions" },
  { id: "mindmap", emoji: "🗺️", title: "Mind Map", sub: "Visual map" },
];

const WorkspacePage = () => {
  const [activeTool, setActiveTool] = useState<ToolId>("summary");
  const [toolKey, setToolKey] = useState(0);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("Biology Ch.4");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSaved(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const selectTool = useCallback((id: ToolId) => {
    setActiveTool(id);
    setToolKey(k => k + 1);
  }, []);

  const activeLabel = toolItems.find(t => t.id === activeTool)?.title ?? "";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Tool Sidebar ── */}
      <div
        className="shrink-0 flex flex-col"
        style={{ width: 200, background: "#0d0d16", borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Doc info */}
        <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <span className="text-[14px]">📄</span>
            <span className="text-[13px] font-semibold text-foreground truncate">{title}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1" style={{ paddingLeft: 24 }}>
            8 pages · 18 min
          </p>
        </div>

        {/* Tool nav */}
        <div style={{ padding: "12px 8px" }} className="flex flex-col gap-0.5 flex-1">
          <p
            className="text-muted-foreground font-semibold mb-1"
            style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 8px" }}
          >
            Study Tools
          </p>
          {toolItems.map(t => {
            const active = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => selectTool(t.id)}
                className="w-full text-left flex items-center gap-2.5 transition-all duration-150"
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  borderLeft: `2px solid ${active ? "#9d7fe0" : "transparent"}`,
                  background: active ? "rgba(124,92,191,0.15)" : "transparent",
                  color: active ? "#e8e8f0" : "rgba(232,232,240,0.55)",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span className="text-[16px] shrink-0">{t.emoji}</span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-tight">{t.title}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(232,232,240,0.4)" }}>{t.sub}</p>
                </div>
              </button>
            );
          })}

          {/* Mastery at bottom */}
          <div className="mt-auto" style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[11px] text-muted-foreground mb-2">Mastery</p>
            <div className="w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full" style={{ width: "34%", background: "linear-gradient(90deg, #7c5cbf, #2dd4bf)" }} />
            </div>
            <p className="text-[12px] mt-1.5" style={{ color: "rgba(157,127,224,0.7)" }}>34% — keep going</p>
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div
          className="shrink-0 flex items-center justify-between"
          style={{ height: 52, padding: "0 32px", background: "#0d0d16", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2 text-sm">
            <Link to="/app/library" className="text-muted-foreground hover:text-foreground transition-colors">Library</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            {editing ? (
              <input
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={() => setEditing(false)}
                onKeyDown={e => e.key === "Enter" && setEditing(false)}
                className="bg-transparent text-muted-foreground outline-none border-b border-primary text-sm"
              />
            ) : (
              <button onClick={() => setEditing(true)} className="text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
                {title} <Edit3 className="w-3 h-3" />
              </button>
            )}
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-foreground font-semibold">{activeLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            {saved ? <Check className="w-3 h-3" /> : <RefreshCw className="w-3 h-3 animate-spin" />}
            {saved ? "Saved" : "Saving..."}
          </div>
        </div>

        {/* Meta bar */}
        <div
          className="shrink-0 text-[12px] text-muted-foreground"
          style={{ padding: "7px 24px", background: "rgba(255,255,255,0.015)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          8 pages &nbsp;·&nbsp; ~2,400 words &nbsp;·&nbsp; Estimated study time:{" "}
          <span style={{ color: "rgba(157,127,224,0.7)" }}>18 min</span>
        </div>

        {/* Content */}
        <div key={toolKey} className="flex-1 overflow-y-auto animate-fade-in" style={{ padding: "40px 48px" }}>
          {activeTool === "summary" && <SummaryContent title={title} />}
          {activeTool === "flashcards" && <FlashcardsContent />}
          {activeTool === "quiz" && <QuizContent />}
          {activeTool === "exam" && <ExamContent />}
          {activeTool === "mindmap" && <MindMapContent />}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ SUMMARY ═══════════════ */
const SummaryContent = ({ title }: { title: string }) => {
  const sections = [
    { heading: "Photosynthesis Overview", body: "Photosynthesis is the process by which green plants convert light energy into chemical energy stored in glucose. It occurs primarily in the chloroplasts of mesophyll cells, using water and carbon dioxide as raw materials." },
    { heading: "Light-Dependent Reactions", body: "These reactions take place in the thylakoid membranes. Water molecules are split (photolysis), releasing oxygen as a by-product. ATP and NADPH are produced as energy carriers for the next stage." },
    { heading: "Calvin Cycle", body: "The Calvin Cycle occurs in the stroma. CO₂ is fixed by the enzyme RuBisCO into G3P, which is used to synthesize glucose. It requires ATP and NADPH from light-dependent reactions." },
    { heading: "Factors Affecting Rate", body: "Light intensity, CO₂ concentration, and temperature all affect the rate of photosynthesis. These factors interact, and the slowest one acts as the limiting factor." },
    { heading: "Significance", body: "Photosynthesis is the foundation of most food chains. It converts solar energy into chemical energy and produces the oxygen that aerobic organisms need to survive." },
  ];

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold uppercase" style={{ color: "#9d7fe0", letterSpacing: "0.06em" }}>
          AI Summary
        </span>
        <div className="flex gap-2">
          {[{ icon: Copy, label: "Copy" }, { icon: Download, label: "Download" }].map(b => (
            <button
              key={b.label}
              className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <b.icon className="w-3.5 h-3.5" /> {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-[28px] text-foreground mb-4" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>
        {title} — Photosynthesis
      </h1>

      {/* Tag pills */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {["5 sections", "~8 min read", "8 pages covered"].map(t => (
          <span
            key={t}
            className="text-[12px] rounded-full"
            style={{ padding: "4px 12px", background: "rgba(124,92,191,0.08)", border: "1px solid rgba(124,92,191,0.2)", color: "rgba(157,127,224,0.8)" }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Sections */}
      {sections.map((s, i) => (
        <div key={i} className="mb-9" style={{ paddingLeft: 20, borderLeft: "2px solid rgba(124,92,191,0.2)" }}>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span
              className="shrink-0 flex items-center justify-center text-[11px] font-bold"
              style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "rgba(124,92,191,0.15)", border: "1px solid rgba(124,92,191,0.3)", color: "#9d7fe0",
              }}
            >
              {i + 1}
            </span>
            <h3 className="text-[15px] font-bold text-foreground">{s.heading}</h3>
          </div>
          <p className="text-[15px]" style={{ lineHeight: 1.85, color: "rgba(232,232,240,0.72)", paddingLeft: 34 }}>
            {s.body}
          </p>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════ FLASHCARDS ═══════════════ */
const FlashcardsContent = () => {
  const cards = [
    { q: "What is photosynthesis?", a: "The process by which plants convert light energy into chemical energy (glucose).", why: "It's the foundation of nearly all food chains on Earth." },
    { q: "Where do light reactions occur?", a: "In the thylakoid membranes of the chloroplasts.", why: "Thylakoids contain pigments that absorb light energy." },
    { q: "What is photolysis?", a: "The splitting of water molecules by light, releasing O₂, H⁺, and electrons.", why: "Without photolysis, there would be no oxygen for aerobic life." },
    { q: "What enzyme fixes CO₂?", a: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase/oxygenase).", why: "RuBisCO is the most abundant protein on Earth." },
  ];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const flip = useCallback(() => setFlipped(f => !f), []);
  const prev = useCallback(() => { setFlipped(false); setIdx(i => Math.max(0, i - 1)); }, []);
  const next = useCallback(() => { setFlipped(false); setIdx(i => Math.min(cards.length - 1, i + 1)); }, [cards.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); flip(); }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flip, prev, next]);

  const card = cards[idx];
  const progress = ((idx + 1) / cards.length) * 100;

  return (
    <div className="flex flex-col items-center">
      <p className="text-[13px] text-muted-foreground mb-4">
        Card {idx + 1} of {cards.length} · Click to flip
      </p>

      {/* Progress */}
      <div className="w-full max-w-[480px] h-[3px] rounded-full mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7c5cbf, #2dd4bf)" }} />
      </div>

      {/* Flip card */}
      <div
        className="w-full max-w-[480px] cursor-pointer mb-6"
        style={{ height: 220, perspective: 800 }}
        onClick={flip}
      >
        <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "" }}>
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col justify-center p-6"
            style={{ backfaceVisibility: "hidden", borderRadius: 14, background: "rgba(124,92,191,0.07)", border: "1px solid rgba(124,92,191,0.25)" }}
          >
            <span className="text-[11px] font-bold uppercase mb-3" style={{ color: "#9d7fe0", letterSpacing: "0.06em" }}>Question</span>
            <p className="text-[20px] text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>{card.q}</p>
            <p className="text-[12px] mt-auto" style={{ color: "rgba(232,232,240,0.25)" }}>tap to reveal →</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col p-6 overflow-y-auto"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 14, background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.2)" }}
          >
            <span className="text-[11px] font-bold uppercase mb-2" style={{ color: "#2dd4bf", letterSpacing: "0.06em" }}>Answer</span>
            <p className="text-[15px] text-foreground" style={{ lineHeight: 1.75 }}>{card.a}</p>
            <div className="my-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
            <span className="text-[11px] font-bold uppercase mb-1" style={{ color: "#2dd4bf", letterSpacing: "0.06em" }}>Why this matters</span>
            <p className="text-[13px] text-muted-foreground">{card.why}</p>
          </div>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="flex items-center justify-center transition-colors disabled:opacity-30"
          style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={next}
          disabled={idx === cards.length - 1}
          className="flex items-center justify-center transition-colors disabled:opacity-30"
          style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <p className="text-[12px]" style={{ color: "rgba(232,232,240,0.2)" }}>
        ← → arrow keys · Space to flip
      </p>
    </div>
  );
};

/* ═══════════════ QUIZ ═══════════════ */
const QuizContent = () => {
  const questions = [
    { q: "Where does photosynthesis primarily take place?", options: ["Mitochondria", "Cell wall", "Chloroplasts", "Nucleus"], correct: 2, explanation: "Chloroplasts contain chlorophyll, the pigment that absorbs light energy needed for photosynthesis." },
    { q: "What is the by-product of photolysis?", options: ["Carbon dioxide", "Glucose", "Oxygen", "ATP"], correct: 2, explanation: "Photolysis splits water molecules, releasing oxygen gas as a by-product." },
    { q: "Which molecule fixes CO₂ in the Calvin Cycle?", options: ["ATP synthase", "NADPH", "RuBisCO", "Chlorophyll"], correct: 2, explanation: "RuBisCO catalyzes the first step of carbon fixation in the Calvin Cycle." },
    { q: "What are the products of light-dependent reactions?", options: ["Glucose and O₂", "ATP and NADPH", "CO₂ and H₂O", "G3P and RuBP"], correct: 1, explanation: "Light reactions produce ATP and NADPH, which power the Calvin Cycle." },
    { q: "What acts as a limiting factor?", options: ["The fastest variable", "The slowest variable", "Temperature only", "Light only"], correct: 1, explanation: "The factor in shortest supply limits the overall rate, regardless of other conditions." },
  ];

  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const current = questions[qIdx];
  const answered = selected !== null;
  const isCorrect = selected === current.correct;
  const progress = ((qIdx + 1) / questions.length) * 100;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (i === current.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(q => q + 1);
      setSelected(null);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && answered && qIdx < questions.length - 1) handleNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div style={{ maxWidth: 560 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[24px] text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>Quick Quiz</h1>
        <span className="text-[13px] text-muted-foreground">{score}/{questions.length} correct</span>
      </div>

      {/* Progress */}
      <div className="w-full h-[3px] rounded-full mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7c5cbf, #2dd4bf)" }} />
      </div>

      {/* Question */}
      <span
        className="inline-block text-[12px] font-semibold rounded-full mb-3"
        style={{ padding: "4px 12px", background: "rgba(124,92,191,0.12)", color: "#9d7fe0" }}
      >
        Question {qIdx + 1} of {questions.length}
      </span>
      <p className="text-[20px] text-foreground mb-6" style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.5 }}>
        {current.q}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-4">
        {current.options.map((opt, i) => {
          let bg = "rgba(255,255,255,0.03)";
          let border = "rgba(255,255,255,0.08)";
          let color = "#e8e8f0";

          if (answered) {
            if (i === current.correct) { bg = "rgba(45,212,191,0.1)"; border = "rgba(45,212,191,0.4)"; color = "#2dd4bf"; }
            else if (i === selected) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.4)"; color = "#ef4444"; }
            else { color = "rgba(232,232,240,0.3)"; }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className="w-full text-left flex items-center justify-between text-[14px] transition-all duration-200"
              style={{ padding: "14px 18px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color }}
            >
              {opt}
              {answered && i === current.correct && <Check className="w-4 h-4" style={{ color: "#2dd4bf" }} />}
              {answered && i === selected && i !== current.correct && <X className="w-4 h-4" style={{ color: "#ef4444" }} />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div
          className="animate-fade-in mb-6"
          style={{
            borderLeft: `3px solid ${isCorrect ? "#2dd4bf" : "#ef4444"}`,
            background: "rgba(255,255,255,0.03)",
            padding: "14px 18px",
            borderRadius: 10,
            marginTop: 16,
          }}
        >
          <p className="text-[12px] font-bold mb-1" style={{ color: isCorrect ? "#2dd4bf" : "#ef4444" }}>
            {isCorrect ? "✓ Correct — here's why:" : "✗ Incorrect — here's why:"}
          </p>
          <p className="text-[14px]" style={{ color: "rgba(232,232,240,0.7)", lineHeight: 1.7 }}>{current.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {answered && qIdx < questions.length - 1 && (
        <button
          onClick={handleNext}
          className="animate-fade-in text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{
            padding: "11px 28px",
            borderRadius: 10,
            background: "linear-gradient(135deg, #7c5cbf, #5b3fa8)",
            boxShadow: "0 4px 16px rgba(124,92,191,0.3)",
          }}
        >
          Next →
        </button>
      )}
    </div>
  );
};

/* ═══════════════ EXAM ═══════════════ */
const ExamContent = () => (
  <div style={{ maxWidth: 560 }} className="animate-fade-in">
    <h1 className="text-[24px] text-foreground mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Full Exam</h1>
    <p className="text-[14px] text-muted-foreground mb-6" style={{ lineHeight: 1.7 }}>
      20 multiple-choice questions · 30-minute time limit · Results and full answer breakdown after submission.
    </p>
    <button
      className="text-[15px] font-semibold text-white transition-all hover:opacity-90"
      style={{
        padding: "14px 32px",
        borderRadius: 10,
        background: "linear-gradient(135deg, #7c5cbf, #5b3fa8)",
        boxShadow: "0 4px 20px rgba(124,92,191,0.3)",
      }}
    >
      Begin Exam →
    </button>
  </div>
);

/* ═══════════════ MIND MAP ═══════════════ */
const MindMapContent = () => {
  const center = { x: 250, y: 150 };
  const branches = [
    { x: 80, y: 50, label: "Light Reactions" },
    { x: 420, y: 50, label: "Calvin Cycle" },
    { x: 60, y: 250, label: "Chloroplasts" },
    { x: 440, y: 250, label: "ATP & NADPH" },
    { x: 250, y: 280, label: "Glucose" },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-[24px] text-foreground mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>Mind Map</h1>
      <div className="relative h-[320px] w-full max-w-[520px] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {branches.map((b, i) => (
            <line key={i} x1={center.x} y1={center.y} x2={b.x} y2={b.y} stroke="rgba(124,92,191,0.25)" strokeWidth="2" />
          ))}
        </svg>
        <div
          className="absolute px-4 py-2 rounded-xl text-sm font-bold animate-scale-in"
          style={{ left: center.x - 65, top: center.y - 16, background: "rgba(124,92,191,0.2)", border: "1px solid rgba(124,92,191,0.4)", color: "#9d7fe0" }}
        >
          Photosynthesis
        </div>
        {branches.map((b, i) => (
          <div
            key={i}
            className="absolute px-3 py-1.5 rounded-lg text-xs font-medium text-foreground animate-scale-in"
            style={{ left: b.x - 45, top: b.y - 12, animationDelay: `${(i + 1) * 100}ms`, animationFillMode: "both", background: "#111120", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspacePage;
