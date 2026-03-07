import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import KbdHint from "@/components/app/KbdHint";

const mockCards = [
  { front: "What is the primary function of photosynthesis?", back: "To convert light energy into chemical energy (glucose) using CO₂ and water." },
  { front: "Where do the light-dependent reactions take place?", back: "In the thylakoid membranes of the chloroplasts." },
  { front: "What is photolysis?", back: "The splitting of water molecules by light energy, releasing O₂, H⁺ ions, and electrons." },
  { front: "What are the products of the Calvin Cycle?", back: "G3P (glyceraldehyde-3-phosphate), which is used to form glucose. It also regenerates RuBP." },
  { front: "What enzyme fixes CO₂ in the Calvin Cycle?", back: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase/oxygenase) — the most abundant enzyme on Earth." },
  { front: "What is the role of NADPH in photosynthesis?", back: "NADPH acts as an electron carrier, providing reducing power (high-energy electrons) to the Calvin Cycle." },
];

type Rating = "hard" | "okay" | "easy";

const FlashcardMode = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [exiting, setExiting] = useState(false);
  const [entering, setEntering] = useState(true);
  const done = index >= mockCards.length;
  const progress = (index / mockCards.length) * 100;

  // Initial enter animation
  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 50);
    return () => clearTimeout(t);
  }, []);

  const flip = useCallback(() => {
    if (!done && !exiting) setFlipped((f) => !f);
  }, [done, exiting]);

  const rate = useCallback((r: Rating) => {
    if (exiting) return;
    setRatings((prev) => [...prev, r]);
    setExiting(true);
    setTimeout(() => {
      setFlipped(false);
      setExiting(false);
      setEntering(true);
      setIndex((i) => i + 1);
      setTimeout(() => setEntering(false), 50);
    }, 350);
  }, [exiting]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done) return;
      if (e.code === "Space") { e.preventDefault(); flip(); }
      if (flipped && !exiting) {
        if (e.code === "ArrowLeft") rate("hard");
        if (e.code === "ArrowRight") rate("easy");
        if (e.code === "ArrowDown") rate("okay");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flip, rate, flipped, done, exiting]);

  if (done) return <CompletionScreen ratings={ratings} total={mockCards.length} />;

  const card = mockCards[index];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 3px gradient progress bar */}
      <div className="h-[3px] w-full bg-muted">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(173 80% 40%))",
          }}
        />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>
        <h2
          className="text-lg text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Biology Ch.4 — Photosynthesis
        </h2>
        <span className="text-sm text-muted-foreground">
          Card {index + 1} / {mockCards.length}
        </span>
      </div>

      {/* Giant flashcard */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div
          className="w-full max-w-[500px] h-[280px] cursor-pointer"
          style={{ perspective: "1000px" }}
          onClick={flip}
        >
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: `${flipped ? "rotateY(180deg)" : "rotateY(0)"} ${
                exiting ? "translateX(-120%)" : entering ? "translateX(120%)" : "translateX(0)"
              }`,
              opacity: exiting || entering ? 0 : 1,
              transition: exiting || entering
                ? "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
                : "transform 0.5s ease",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-2xl bg-card flex items-center justify-center p-10 text-center"
              style={{
                backfaceVisibility: "hidden",
                border: "1px solid rgba(124,92,191,0.3)",
              }}
            >
              <p
                className="text-[22px] text-foreground"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {card.front}
              </p>
            </div>
            {/* Back */}
            <div
              className="absolute inset-0 rounded-2xl bg-card flex items-center justify-center p-10 text-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                border: "1px solid hsl(173 80% 40% / 0.3)",
              }}
            >
              <p className="text-[15px] text-foreground/90 leading-relaxed font-normal">
                {card.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons */}
      <div
        className={`flex items-center justify-center gap-4 pb-4 transition-all duration-300 ${
          flipped && !exiting
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={() => rate("hard")}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "hsl(0 84% 60% / 0.1)",
            border: "1px solid hsl(0 84% 60% / 0.3)",
            color: "hsl(0 84% 60%)",
          }}
        >
          😓 Hard
        </button>
        <button
          onClick={() => rate("okay")}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "hsl(45 93% 47% / 0.1)",
            border: "1px solid hsl(45 93% 47% / 0.3)",
            color: "hsl(45 93% 47%)",
          }}
        >
          😐 Okay
        </button>
        <button
          onClick={() => rate("easy")}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "hsl(142 70% 45% / 0.1)",
            border: "1px solid hsl(142 70% 45% / 0.3)",
            color: "hsl(142 70% 45%)",
          }}
        >
          😊 Easy
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="text-center pb-6">
        <p className="text-[12px] text-muted-foreground">
          Space to flip &nbsp;·&nbsp; ← Hard &nbsp;·&nbsp; → Easy
        </p>
      </div>
    </div>
  );
};

/* ── Completion Screen ── */
const CompletionScreen = ({ ratings, total }: { ratings: Rating[]; total: number }) => {
  const navigate = useNavigate();
  const easy = ratings.filter((r) => r === "easy").length;
  const okay = ratings.filter((r) => r === "okay").length;
  const hard = ratings.filter((r) => r === "hard").length;
  const score = Math.round(((easy * 3 + okay * 2 + hard) / (total * 3)) * 100);

  const r = 50;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-fade-in space-y-6">
        {/* Bouncing emoji */}
        <div className="text-6xl animate-bounce">🎉</div>
        <h2
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Session Complete!
        </h2>

        {/* SVG Donut */}
        <div className="mx-auto w-32 h-32 relative">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="60" cy="60" r={r} fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-[1.5s] ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
            {score}%
          </span>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl p-3" style={{ backgroundColor: "hsl(142 70% 45% / 0.1)", border: "1px solid hsl(142 70% 45% / 0.25)" }}>
            <p className="text-lg font-bold" style={{ color: "hsl(142 70% 45%)" }}>{easy}</p>
            <p className="text-xs text-muted-foreground">Easy</p>
          </div>
          <div className="rounded-xl p-3" style={{ backgroundColor: "hsl(45 93% 47% / 0.1)", border: "1px solid hsl(45 93% 47% / 0.25)" }}>
            <p className="text-lg font-bold" style={{ color: "hsl(45 93% 47%)" }}>{okay}</p>
            <p className="text-xs text-muted-foreground">Okay</p>
          </div>
          <div className="rounded-xl p-3" style={{ backgroundColor: "hsl(0 84% 60% / 0.1)", border: "1px solid hsl(0 84% 60% / 0.25)" }}>
            <p className="text-lg font-bold" style={{ color: "hsl(0 84% 60%)" }}>{hard}</p>
            <p className="text-xs text-muted-foreground">Hard</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all"
          >
            Study Again
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted/30 transition-all"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardMode;
