import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Check, X } from "lucide-react";
import KbdHint from "@/components/app/KbdHint";

const mockQuestions = [
  { q: "What is the primary function of photosynthesis?", options: ["Cellular respiration", "Converting light energy to glucose", "Breaking down proteins", "Absorbing minerals"], correct: 1 },
  { q: "Where do light-dependent reactions occur?", options: ["Stroma", "Thylakoid membranes", "Cell wall", "Nucleus"], correct: 1 },
  { q: "What gas is released during photolysis?", options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], correct: 2 },
  { q: "Which enzyme fixes CO₂ in the Calvin Cycle?", options: ["ATP synthase", "RuBisCO", "Helicase", "Lipase"], correct: 1 },
  { q: "What are the energy carriers produced in light reactions?", options: ["DNA and RNA", "ATP and NADPH", "Glucose and fructose", "ADP and NAD+"], correct: 1 },
];

const QuizMode = () => {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(900); // 15:00
  const [sliding, setSliding] = useState(false);
  const [enterDir, setEnterDir] = useState(false);
  const done = qIndex >= mockQuestions.length;

  // Enter animation on mount
  useEffect(() => {
    setEnterDir(true);
    const t = setTimeout(() => setEnterDir(false), 50);
    return () => clearTimeout(t);
  }, []);

  // Countdown
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [done]);

  const next = useCallback(() => {
    setAnswers((a) => [...a, selected]);
    setSliding(true);
    setTimeout(() => {
      setSelected(null);
      setQIndex((i) => i + 1);
      setSliding(false);
      setEnterDir(true);
      setTimeout(() => setEnterDir(false), 50);
    }, 300);
  }, [selected]);

  if (done || timeLeft === 0) {
    const finalAnswers = done ? answers : [...answers, selected];
    return <ResultsScreen answers={finalAnswers} questions={mockQuestions} time={900 - timeLeft} />;
  }

  const question = mockQuestions[qIndex];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerColor =
    timeLeft <= 30 ? "text-destructive animate-pulse" :
    timeLeft <= 120 ? "text-yellow-500" :
    "text-foreground";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Biology Ch.4
        </button>
        <h2
          className="text-lg text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Biology — Photosynthesis Quiz
        </h2>
        <div className="flex flex-col items-end gap-0.5">
          <span className={`text-sm font-mono flex items-center gap-1.5 ${timerColor}`}>
            <Clock className="w-4 h-4" />
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">
            Q {qIndex + 1} / {mockQuestions.length}
          </span>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-start justify-center px-6 pt-16">
        <div
          className={`max-w-[600px] w-full transition-all duration-300 ${
            sliding ? "opacity-0 -translate-x-12" :
            enterDir ? "opacity-0 translate-x-12" :
            "opacity-100 translate-x-0"
          }`}
        >
          {/* Question badge */}
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              backgroundColor: "hsl(var(--primary) / 0.15)",
              color: "hsl(var(--primary))",
            }}
          >
            Question {qIndex + 1}
          </span>

          {/* Question text */}
          <h3
            className="text-[24px] text-foreground mb-6"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {question.q}
          </h3>

          {/* Answer buttons */}
          <div className="space-y-3 mt-6">
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.correct;
              const answered = selected !== null;

              let borderColor = "hsl(var(--border))";
              let bgColor = "transparent";
              let scale = "";
              let icon = null;

              if (answered) {
                if (isCorrect) {
                  borderColor = "hsl(173 80% 40%)";
                  bgColor = "hsl(173 80% 40% / 0.1)";
                  scale = "scale-[1.02]";
                  icon = <Check className="w-4 h-4 shrink-0" style={{ color: "hsl(173 80% 40%)" }} />;
                } else if (isSelected && !isCorrect) {
                  borderColor = "hsl(0 84% 60%)";
                  bgColor = "hsl(0 84% 60% / 0.1)";
                  icon = <X className="w-4 h-4 shrink-0" style={{ color: "hsl(0 84% 60%)" }} />;
                } else {
                  borderColor = "hsl(var(--border))";
                  bgColor = "transparent";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => !answered && setSelected(i)}
                  disabled={answered}
                  className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between gap-3 ${scale} ${
                    !answered ? "hover:border-primary/50 hover:bg-muted/20" : ""
                  }`}
                  style={{ border: `1px solid ${borderColor}`, backgroundColor: bgColor }}
                >
                  <span className="text-foreground">{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="flex items-center gap-2 mt-6 animate-fade-in">
              <button
                onClick={next}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all duration-300"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
              <KbdHint keys="Enter" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Results Screen ── */
const ResultsScreen = ({ answers, questions, time }: {
  answers: (number | null)[];
  questions: typeof mockQuestions;
  time: number;
}) => {
  const navigate = useNavigate();
  const correct = answers.filter((a, i) => a === questions[i]?.correct).length;
  const score = Math.round((correct / questions.length) * 100);
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
  const gradeColor =
    score >= 80 ? "hsl(173 80% 40%)" :
    score >= 60 ? "hsl(45 93% 47%)" :
    "hsl(0 84% 60%)";
  const mins = Math.floor(time / 60);
  const secs = time % 60;

  const r = 55;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {score > 80 && <Confetti />}

      <div className="max-w-md w-full text-center animate-fade-in space-y-6 relative z-10">
        <h2
          className="text-2xl text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Quiz Complete!
        </h2>

        {/* Score ring */}
        <div className="mx-auto w-36 h-36 relative">
          <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
            <circle cx="65" cy="65" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="65" cy="65" r={r} fill="none"
              stroke={gradeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={animated ? offset : circumference}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
            {score}%
          </span>
        </div>

        {/* Grade */}
        <div className="text-5xl font-extrabold" style={{ color: gradeColor }}>{grade}</div>

        <p className="text-sm text-muted-foreground">
          {correct}/{questions.length} correct · {mins}:{secs.toString().padStart(2, "0")}
        </p>

        {/* Callouts */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="rounded-xl p-3" style={{ backgroundColor: "hsl(173 80% 40% / 0.1)", border: "1px solid hsl(173 80% 40% / 0.25)" }}>
            <p className="text-xs text-muted-foreground mb-1">Strongest topic</p>
            <p className="text-sm font-medium text-foreground">Light reactions</p>
          </div>
          <div className="rounded-xl p-3" style={{ backgroundColor: "hsl(0 84% 60% / 0.1)", border: "1px solid hsl(0 84% 60% / 0.25)" }}>
            <p className="text-xs text-muted-foreground mb-1">Needs review</p>
            <p className="text-sm font-medium text-foreground">Calvin Cycle</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all"
          >
            Try Again
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

/* ── CSS Confetti ── */
const Confetti = () => {
  const colors = [
    "hsl(262 83% 58%)",
    "hsl(173 80% 40%)",
    "hsl(45 93% 47%)",
    "hsl(0 84% 60%)",
    "hsl(200 80% 55%)",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-sm"
          style={{
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            left: `${Math.random() * 100}%`,
            top: "-5%",
            backgroundColor: colors[i % colors.length],
            animation: `confetti-fall ${2.5 + Math.random() * 2}s linear ${Math.random() * 1.5}s infinite`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default QuizMode;
