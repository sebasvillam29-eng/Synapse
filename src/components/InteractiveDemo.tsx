import { useState } from "react";
import { BookOpen, Layers, Brain, ChevronLeft, ChevronRight, Check, X } from "lucide-react";

type Tab = "summaries" | "flashcards" | "quiz";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "summaries", label: "Summaries", icon: <BookOpen className="w-4 h-4" /> },
  { id: "flashcards", label: "Flashcards", icon: <Layers className="w-4 h-4" /> },
  { id: "quiz", label: "Quiz", icon: <Brain className="w-4 h-4" /> },
];

const flashcards = [
  { front: "What is photosynthesis?", back: "The process by which green plants use sunlight, water, and CO₂ to produce glucose and oxygen." },
  { front: "What is mitochondria?", back: "The organelle responsible for producing ATP — the energy currency of the cell." },
  { front: "What is osmosis?", back: "The movement of water molecules through a semi-permeable membrane from low to high solute concentration." },
];

const InteractiveDemo = () => {
  const [tab, setTab] = useState<Tab>("summaries");

  return (
    <section id="demo" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See it in <span className="text-gradient">action</span>
          </h2>
          <p className="text-muted-foreground">Try the interactive demo — no signup required.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden glow-primary">
          {/* Tab bar */}
          <div className="flex border-b border-border">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                  tab === t.id ? "text-primary border-b-2 border-primary bg-muted/30" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8 min-h-[320px]">
            {tab === "summaries" && <SummariesTab />}
            {tab === "flashcards" && <FlashcardsTab />}
            {tab === "quiz" && <QuizTab />}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Summaries ── */
const SummariesTab = () => {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const generate = () => {
    setState("loading");
    setTimeout(() => setState("done"), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Your Notes</p>
        <div className="rounded-xl bg-muted/40 border border-border p-4 text-sm text-foreground leading-relaxed">
          Photosynthesis is the process by which plants convert sunlight into energy. It occurs in the chloroplasts
          using chlorophyll. The process takes in carbon dioxide and water, and produces glucose and oxygen. Light-dependent
          reactions occur in the thylakoid membranes, while the Calvin cycle takes place in the stroma.
        </div>
      </div>

      {state === "idle" && (
        <button onClick={generate} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Generate Summary
        </button>
      )}

      {state === "loading" && (
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary ai-dot-1" />
            <span className="w-2 h-2 rounded-full bg-primary ai-dot-2" />
            <span className="w-2 h-2 rounded-full bg-primary ai-dot-3" />
          </div>
          <span className="text-sm text-muted-foreground">AI is generating your summary…</span>
        </div>
      )}

      {state === "done" && (
        <div>
          <p className="text-xs uppercase tracking-wider text-secondary mb-2">AI Summary</p>
          <div className="rounded-xl bg-secondary/10 border border-secondary/30 p-4 text-sm text-foreground leading-relaxed">
            <strong>Photosynthesis</strong> converts sunlight → glucose + O₂ in chloroplasts.
            Two stages: <em>light-dependent reactions</em> (thylakoids) capture light energy,
            and the <em>Calvin cycle</em> (stroma) fixes CO₂ into glucose.
          </div>
          <button onClick={() => setState("idle")} className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
            ↺ Reset
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Flashcards ── */
const FlashcardsTab = () => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const next = () => { setFlipped(false); setIndex((i) => (i + 1) % flashcards.length); };
  const prev = () => { setFlipped(false); setIndex((i) => (i - 1 + flashcards.length) % flashcards.length); };

  const card = flashcards[index];

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-xs text-muted-foreground">Card {index + 1} of {flashcards.length} — click to flip</p>

      <div className="perspective-1000 w-full max-w-md h-52 cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${flipped ? "rotate-y-180" : ""}`}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden rounded-2xl border border-primary/40 bg-muted/50 flex items-center justify-center p-8 text-center">
            <p className="text-lg font-semibold text-foreground">{card.front}</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-secondary/40 bg-secondary/10 flex items-center justify-center p-8 text-center">
            <p className="text-sm text-foreground leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={prev} className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button onClick={next} className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
};

/* ── Quiz ── */
const quizOptions = [
  { label: "A) Produce energy", correct: true },
  { label: "B) Store DNA", correct: false },
  { label: "C) Transport oxygen", correct: false },
  { label: "D) Digest proteins", correct: false },
];

const QuizTab = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Question 1</p>
        <p className="text-lg font-semibold text-foreground">What is the function of mitochondria?</p>
      </div>

      <div className="grid gap-3">
        {quizOptions.map((opt, i) => {
          const isSelected = selected === i;
          let style = "border-border hover:border-primary/50 hover:bg-muted/30";
          if (selected !== null) {
            if (opt.correct) style = "border-secondary bg-secondary/10";
            else if (isSelected) style = "border-destructive bg-destructive/10";
            else style = "border-border opacity-50";
          }
          return (
            <button
              key={i}
              onClick={() => selected === null && setSelected(i)}
              className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${style}`}
            >
              <span className="text-foreground">{opt.label}</span>
              {selected !== null && opt.correct && <Check className="w-4 h-4 text-secondary" />}
              {selected !== null && isSelected && !opt.correct && <X className="w-4 h-4 text-destructive" />}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium ${quizOptions[selected].correct ? "text-secondary" : "text-destructive"}`}>
            {quizOptions[selected].correct ? "Correct! 🎉" : "Incorrect — the answer is A."}
          </p>
          <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ↺ Try again
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveDemo;
