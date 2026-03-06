import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { X, Settings, ArrowLeft } from "lucide-react";

const mockCards = [
  { front: "What is chirality?", back: "A property where a molecule cannot be superimposed on its mirror image." },
  { front: "Define enantiomers", back: "Stereoisomers that are non-superimposable mirror images of each other." },
  { front: "What is the Cahn-Ingold-Prelog system?", back: "A set of rules to assign R or S configuration to chiral centers based on atomic number priority." },
  { front: "What are diastereomers?", back: "Stereoisomers that are NOT mirror images of each other." },
  { front: "Define a meso compound", back: "A compound with chiral centers but an internal plane of symmetry, making it optically inactive." },
  { front: "What is optical rotation?", back: "The rotation of plane-polarized light by a chiral substance, measured with a polarimeter." },
];

type Rating = "hard" | "okay" | "easy";

const FlashcardMode = () => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [exiting, setExiting] = useState(false);
  const [entering, setEntering] = useState(false);
  const done = index >= mockCards.length;
  const progress = (index / mockCards.length) * 100;

  const flip = useCallback(() => { if (!done && !exiting) setFlipped((f) => !f); }, [done, exiting]);

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
      if (flipped && e.code === "ArrowLeft") rate("hard");
      if (flipped && e.code === "ArrowRight") rate("easy");
      if (flipped && e.code === "ArrowDown") rate("okay");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flip, rate, flipped, done]);

  if (done) return <CompletionScreen ratings={ratings} total={mockCards.length} />;

  const card = mockCards[index];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="h-[3px] bg-muted w-full">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/app/library" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Exit
        </Link>
        <h2 className="text-sm font-semibold text-foreground">Organic Chemistry — Ch. 4</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Card {index + 1}/{mockCards.length}</span>
          <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Settings className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div
          className="perspective-1000 w-full max-w-lg h-72 cursor-pointer"
          onClick={flip}
        >
          <div
            className="relative w-full h-full preserve-3d"
            style={{
              transform: `${flipped ? "rotateY(180deg)" : "rotateY(0)"} ${
                exiting ? "translateX(-120%)" : entering ? "translateX(120%)" : "translateX(0)"
              }`,
              opacity: exiting || entering ? 0 : 1,
              transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div className="absolute inset-0 backface-hidden rounded-2xl border border-border bg-card flex items-center justify-center p-10 text-center glow-primary">
              <p className="text-xl font-semibold text-foreground">{card.front}</p>
            </div>
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-secondary/30 bg-card flex items-center justify-center p-10 text-center">
              <p className="text-base text-foreground/90 leading-relaxed">{card.back}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons (visible after flip) */}
      <div className={`flex items-center justify-center gap-4 pb-4 transition-all duration-300 ${flipped && !exiting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <button onClick={() => rate("hard")} className="px-6 py-2.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-all duration-300">
          😓 Hard
        </button>
        <button onClick={() => rate("okay")} className="px-6 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm font-semibold hover:bg-yellow-500/20 transition-all duration-300">
          😐 Okay
        </button>
        <button onClick={() => rate("easy")} className="px-6 py-2.5 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary text-sm font-semibold hover:bg-secondary/20 transition-all duration-300">
          😊 Easy
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="text-center pb-6">
        <p className="text-xs text-muted-foreground">Space to flip · ← Hard · ↓ Okay · → Easy</p>
      </div>
    </div>
  );
};

const CompletionScreen = ({ ratings, total }: { ratings: Rating[]; total: number }) => {
  const easy = ratings.filter((r) => r === "easy").length;
  const okay = ratings.filter((r) => r === "okay").length;
  const hard = ratings.filter((r) => r === "hard").length;
  const score = Math.round(((easy * 3 + okay * 2 + hard) / (total * 3)) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-fade-in space-y-6">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold text-foreground">Session Complete!</h2>

        {/* Score ring */}
        <div className="mx-auto w-24 h-24 relative">
          <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(222 30% 16%)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(262 83% 58%)" strokeWidth="3"
              strokeDasharray={`${score * 0.942} 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">{score}%</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-secondary/10 border border-secondary/30 p-3">
            <p className="text-lg font-bold text-secondary">{easy}</p>
            <p className="text-xs text-muted-foreground">Easy</p>
          </div>
          <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-3">
            <p className="text-lg font-bold text-yellow-500">{okay}</p>
            <p className="text-xs text-muted-foreground">Okay</p>
          </div>
          <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3">
            <p className="text-lg font-bold text-destructive">{hard}</p>
            <p className="text-xs text-muted-foreground">Hard</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all duration-300">
            Study Again
          </button>
          <Link to="/app/library" className="px-5 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted/30 transition-all duration-300">
            Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlashcardMode;
