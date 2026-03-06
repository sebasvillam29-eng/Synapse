import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

const mockQuestions = [
  { q: "Which type of isomers are non-superimposable mirror images?", options: ["Structural isomers", "Enantiomers", "Diastereomers", "Conformers"], correct: 1 },
  { q: "What rule system assigns R/S configuration?", options: ["IUPAC", "Cahn-Ingold-Prelog", "Fischer", "Newman"], correct: 1 },
  { q: "A meso compound is optically inactive because it has:", options: ["No chiral centers", "An internal plane of symmetry", "All R configuration", "Equal molecular weight"], correct: 1 },
  { q: "What instrument measures optical rotation?", options: ["Spectrometer", "Polarimeter", "Calorimeter", "Manometer"], correct: 1 },
  { q: "Diastereomers differ in:", options: ["Molecular formula", "Configuration at ALL stereocenters", "Configuration at SOME stereocenters", "Connectivity"], correct: 2 },
  { q: "Which molecule can exhibit chirality?", options: ["CH₄", "CHClBrF", "CO₂", "H₂O"], correct: 1 },
  { q: "Specific rotation depends on:", options: ["Temperature only", "Concentration and path length", "Pressure", "Volume"], correct: 1 },
  { q: "A racemic mixture has optical rotation of:", options: ["+50°", "-50°", "0°", "180°"], correct: 2 },
  { q: "In CIP priority rules, higher priority goes to:", options: ["Smaller atom", "Higher atomic number", "Lighter isotope", "Longer chain"], correct: 1 },
  { q: "E/Z isomerism applies to:", options: ["Chiral centers", "Double bonds", "Single bonds", "Triple bonds"], correct: 1 },
];

const QuizMode = () => {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min
  const [sliding, setSliding] = useState(false);
  const done = qIndex >= mockQuestions.length;

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
    }, 300);
  }, [selected]);

  if (done || timeLeft === 0) return <ResultsScreen answers={answers} questions={mockQuestions} time={300 - timeLeft} />;

  const question = mockQuestions[qIndex];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerColor = timeLeft <= 30 ? "text-destructive animate-pulse" : timeLeft <= 120 ? "text-yellow-500" : "text-muted-foreground";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link to="/app/library" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Exit
        </Link>
        <h2 className="text-sm font-semibold text-foreground">Stereochemistry Quiz</h2>
        <div className="flex items-center gap-4">
          <span className={`text-sm font-mono flex items-center gap-1 ${timerColor}`}>
            <Clock className="w-4 h-4" /> {mins}:{secs.toString().padStart(2, "0")}
          </span>
          <span className="text-sm text-muted-foreground">Q {qIndex + 1}/{mockQuestions.length}</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className={`max-w-xl w-full transition-all duration-300 ${sliding ? "opacity-0 -translate-x-12" : "opacity-100 translate-x-0"}`}>
          <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-4">
            Question {qIndex + 1}
          </span>
          <h3 className="text-xl font-semibold text-foreground mb-8">{question.q}</h3>

          <div className="space-y-3">
            {question.options.map((opt, i) => {
              let style = "border-border hover:border-primary/50 hover:bg-muted/30";
              if (selected !== null) {
                if (i === question.correct) style = "border-secondary bg-secondary/10 scale-[1.02]";
                else if (i === selected) style = "border-destructive bg-destructive/10";
                else style = "border-border opacity-50";
              }
              return (
                <button
                  key={i}
                  onClick={() => selected === null && setSelected(i)}
                  className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all duration-300 ${style}`}
                >
                  <span className="text-foreground">{opt}</span>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <button
              onClick={next}
              className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-all duration-300 animate-fade-in"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultsScreen = ({ answers, questions, time }: { answers: (number | null)[]; questions: typeof mockQuestions; time: number }) => {
  const correct = answers.filter((a, i) => a === questions[i]?.correct).length;
  const score = Math.round((correct / questions.length) * 100);
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
  const gradeColor = score >= 80 ? "text-secondary" : score >= 60 ? "text-yellow-500" : "text-destructive";
  const mins = Math.floor(time / 60);
  const secs = time % 60;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {score > 80 && <Confetti />}
      <div className="max-w-md w-full text-center animate-fade-in space-y-6 relative z-10">
        <h2 className="text-2xl font-bold text-foreground">Quiz Complete!</h2>

        {/* Score ring */}
        <div className="mx-auto w-28 h-28 relative">
          <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(222 30% 16%)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke={score >= 80 ? "hsl(173 80% 40%)" : score >= 60 ? "hsl(45 93% 47%)" : "hsl(0 84% 60%)"}
              strokeWidth="3" strokeDasharray={`${score * 0.942} 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">{score}%</span>
        </div>

        <div className={`text-5xl font-extrabold ${gradeColor}`}>{grade}</div>

        <p className="text-sm text-muted-foreground">{correct}/{questions.length} correct · {mins}:{secs.toString().padStart(2, "0")}</p>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="rounded-xl bg-secondary/10 border border-secondary/30 p-3">
            <p className="text-xs text-muted-foreground mb-1">Strongest</p>
            <p className="text-sm font-medium text-foreground">Chirality concepts</p>
          </div>
          <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3">
            <p className="text-xs text-muted-foreground mb-1">Needs Review</p>
            <p className="text-sm font-medium text-foreground">Optical rotation</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all duration-300">
            Try Again
          </button>
          <Link to="/app/library" className="px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted/30 transition-all duration-300">
            Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
};

const Confetti = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-5%`,
          backgroundColor: ["hsl(262 83% 58%)", "hsl(173 80% 40%)", "hsl(45 93% 47%)", "hsl(0 84% 60%)"][i % 4],
          animation: `confetti-fall ${2 + Math.random() * 2}s linear ${Math.random() * 2}s infinite`,
        }}
      />
    ))}
    <style>{`
      @keyframes confetti-fall {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `}</style>
  </div>
);

export default QuizMode;
