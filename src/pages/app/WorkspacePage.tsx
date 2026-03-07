import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Upload, FileText, Layers, ClipboardCheck, GraduationCap, GitBranch,
  X, ChevronLeft, ChevronRight, Edit3, RefreshCw, Copy, Download,
} from "lucide-react";
import RemoveConfirmation from "@/components/app/RemoveConfirmation";

type PdfState = "empty" | "processing" | "loaded";
type ToolId = "summary" | "flashcards" | "quiz" | "exam" | "mindmap";

const processingTexts = ["Reading...", "Identifying concepts...", "Almost ready..."];

const toolCards: { id: ToolId; icon: any; title: string; desc: string }[] = [
  { id: "summary", icon: FileText, title: "Summary", desc: "Key concepts condensed" },
  { id: "flashcards", icon: Layers, title: "Flashcards", desc: "Q&A cards for review" },
  { id: "quiz", icon: ClipboardCheck, title: "Quick Quiz", desc: "5 multiple choice" },
  { id: "exam", icon: GraduationCap, title: "Full Exam", desc: "20 questions, timed" },
  { id: "mindmap", icon: GitBranch, title: "Mind Map", desc: "Visual concept map" },
];

const WorkspacePage = () => {
  const [pdfState, setPdfState] = useState<PdfState>("empty");
  const [progress, setProgress] = useState(0);
  const [textIdx, setTextIdx] = useState(0);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [toolLoading, setToolLoading] = useState(false);
  const [toolReady, setToolReady] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("Biology Ch.4");
  const [saved, setSaved] = useState(false);

  // Processing animation
  useEffect(() => {
    if (pdfState !== "processing") return;
    setProgress(0);
    setTextIdx(0);
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(((now - start) / 2500) * 100, 100);
      setProgress(p);
      if (p >= 100) { setPdfState("loaded"); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const ti = setInterval(() => setTextIdx((i) => (i + 1) % processingTexts.length), 700);
    return () => { cancelAnimationFrame(raf); clearInterval(ti); };
  }, [pdfState]);

  // Saved indicator
  useEffect(() => {
    const t = setTimeout(() => setSaved(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const selectTool = useCallback((id: ToolId) => {
    setActiveTool(id);
    setToolLoading(true);
    setToolReady(false);
    setTimeout(() => { setToolLoading(false); setToolReady(true); }, 1500);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Top breadcrumb bar */}
      <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/app/library" className="text-muted-foreground hover:text-foreground transition-colors">Library</Link>
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
          {editing ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
              className="bg-transparent text-foreground font-semibold outline-none border-b border-primary text-sm"
            />
          ) : (
            <button onClick={() => setEditing(true)} className="text-foreground font-semibold flex items-center gap-1 hover:text-primary transition-colors">
              {title} <Edit3 className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className={`w-3 h-3 ${!saved ? "animate-spin" : ""}`} />
          {saved ? "Saved" : "Saving..."}
        </div>
      </div>

      {/* Split panels */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT — PDF viewer 40% */}
        <div className="w-full md:w-[40%] border-b md:border-b-0 md:border-r border-border overflow-auto flex flex-col">
          {pdfState === "empty" && (
            <button
              onClick={() => setPdfState("processing")}
              className="flex-1 m-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 text-muted-foreground transition-all duration-300 hover:border-primary/60 hover:text-foreground hover:bg-primary/5"
              style={{ borderColor: "rgba(124,92,191,0.4)" }}
            >
              <Upload className="w-10 h-10" />
              <p className="text-sm font-medium">Drop your PDF here · up to 20MB</p>
            </button>
          )}

          {pdfState === "processing" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 animate-fade-in">
              <FileText className="w-10 h-10 text-primary" />
              <p className="text-sm font-medium text-foreground">Biology_Ch4.pdf</p>
              <div className="w-56 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-100"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg, hsl(var(--primary)), hsl(173 80% 40%))" }}
                />
              </div>
              <p key={textIdx} className="text-xs text-muted-foreground animate-fade-in">{processingTexts[textIdx]}</p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          )}

          {pdfState === "loaded" && (
            <div className="flex-1 flex flex-col animate-fade-in">
              {/* File bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Biology_Ch4.pdf</span>
                </div>
                <button onClick={() => setPdfState("empty")} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors">
                  <X className="w-3 h-3" /> Remove
                </button>
              </div>
              {/* Mock PDF page */}
              <div className="flex-1 p-4">
                <div className="bg-foreground/5 rounded-lg p-6 shadow-lg space-y-2.5 max-w-md mx-auto">
                  {Array.from({ length: 18 }, (_, i) => {
                    const isHighlighted = i === 3 || i === 8 || i === 14;
                    const isParagraphBreak = i === 5 || i === 11;
                    const widths = ["100%", "92%", "88%", "95%", "80%", "100%", "85%", "93%", "97%", "78%", "100%", "90%", "86%", "94%", "100%", "82%", "91%", "75%"];
                    return (
                      <div key={i}>
                        {isParagraphBreak && <div className="h-3" />}
                        <div
                          className={`h-2.5 rounded-sm ${isHighlighted ? "bg-primary/15" : "bg-muted-foreground/15"}`}
                          style={{ width: widths[i] }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <button className="p-1 text-muted-foreground hover:text-foreground"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs text-muted-foreground">Page 1 of 8</span>
                  <button className="p-1 text-muted-foreground hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ color: "hsl(173 80% 40%)", backgroundColor: "hsl(173 80% 40% / 0.1)" }}>
                  ✓ AI read all 8 pages
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — AI tools 60% */}
        <div className="w-full md:w-[60%] flex flex-col overflow-auto p-5">
          {/* Tool cards grid: 2+2+1 */}
          <div className="grid grid-cols-2 gap-3 mb-1">
            {toolCards.slice(0, 4).map((t) => (
              <ToolCard key={t.id} tool={t} active={activeTool === t.id} onClick={() => selectTool(t.id)} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 mb-5">
            <ToolCard tool={toolCards[4]} active={activeTool === "mindmap"} onClick={() => selectTool("mindmap")} />
          </div>

          {/* Output area */}
          <div className="flex-1 overflow-y-auto">
            {toolLoading && (
              <div className="flex items-center gap-3 py-8 justify-center animate-fade-in">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Generating...</span>
              </div>
            )}
            {toolReady && activeTool === "summary" && <SummaryOutput />}
            {toolReady && activeTool === "flashcards" && <FlashcardsOutput />}
            {toolReady && activeTool === "quiz" && <QuizOutput />}
            {toolReady && activeTool === "exam" && <ExamOutput />}
            {toolReady && activeTool === "mindmap" && <MindMapOutput />}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Tool Card ── */
const ToolCard = ({ tool, active, onClick }: { tool: typeof toolCards[0]; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
      active
        ? "bg-primary/15 border-primary shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] text-primary"
        : "bg-card border-border hover:border-primary/40 hover:-translate-y-[2px]"
    }`}
  >
    <tool.icon className={`w-5 h-5 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
    <p className="text-sm font-medium text-foreground">{tool.title}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
  </button>
);

/* ── Summary ── */
const SummaryOutput = () => (
  <div className="rounded-xl border border-border bg-card p-5 animate-fade-in space-y-4">
    <h3 className="font-semibold text-foreground">AI Summary</h3>
    <div className="space-y-3 text-sm text-foreground/80 leading-relaxed">
      <p><strong className="text-foreground">1. Photosynthesis Overview</strong><br />
        Photosynthesis is the process by which green plants convert light energy into chemical energy stored in glucose. It occurs primarily in the chloroplasts of mesophyll cells.</p>
      <p><strong className="text-foreground">2. Light-Dependent Reactions</strong><br />
        These reactions take place in the thylakoid membranes. Water molecules are split (photolysis), releasing oxygen. ATP and NADPH are produced as energy carriers.</p>
      <p><strong className="text-foreground">3. Calvin Cycle</strong><br />
        The Calvin Cycle occurs in the stroma. CO₂ is fixed by RuBisCO into G3P, which is used to synthesize glucose. It requires ATP and NADPH from light reactions.</p>
    </div>
    <div className="flex gap-2 pt-2">
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
        <Copy className="w-3 h-3" /> Copy
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
        <Download className="w-3 h-3" /> Download
      </button>
    </div>
  </div>
);

/* ── Flashcards with 3D flip ── */
const FlashcardsOutput = () => {
  const cards = [
    { q: "What is photosynthesis?", a: "The process by which plants convert light energy into chemical energy (glucose)." },
    { q: "Where do light reactions occur?", a: "In the thylakoid membranes of the chloroplasts." },
    { q: "What is photolysis?", a: "The splitting of water molecules by light, releasing O₂, H⁺, and electrons." },
    { q: "What enzyme fixes CO₂?", a: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase/oxygenase)." },
  ];
  return (
    <div className="animate-fade-in">
      <h3 className="font-semibold text-foreground mb-3">Flashcards</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((c, i) => <FlipCard key={i} question={c.q} answer={c.a} />)}
      </div>
    </div>
  );
};

const FlipCard = ({ question, answer }: { question: string; answer: string }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="h-40 cursor-pointer" style={{ perspective: "800px" }} onClick={() => setFlipped(!flipped)}>
      <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "" }}>
        <div className="absolute inset-0 rounded-xl border border-border bg-card p-4 flex flex-col justify-center" style={{ backfaceVisibility: "hidden" }}>
          <p className="text-xs text-muted-foreground mb-1">Question</p>
          <p className="text-sm font-medium text-foreground">{question}</p>
        </div>
        <div className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/10 p-4 flex flex-col justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <p className="text-xs text-primary mb-1">Answer</p>
          <p className="text-sm text-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
};

/* ── Quiz ── */
const QuizOutput = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = 2;
  const options = ["Mitochondria", "Cell wall", "Chloroplasts", "Nucleus"];
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Quick Quiz</h3>
        <span className="text-xs text-muted-foreground">Question 1 of 5</span>
      </div>
      <p className="text-sm text-foreground">Where does photosynthesis primarily take place?</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === correct;
          let cls = "border-border hover:border-primary/30";
          if (selected !== null) {
            if (isCorrect) cls = "border-green-500 bg-green-500/10 text-green-400";
            else if (isSelected && !isCorrect) cls = "border-red-500 bg-red-500/10 text-red-400";
          }
          return (
            <button
              key={i}
              disabled={selected !== null}
              onClick={() => setSelected(i)}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-all duration-200 ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="text-xs text-muted-foreground animate-fade-in">
          {selected === correct ? "✅ Correct!" : "❌ Incorrect. The answer is Chloroplasts."}
        </p>
      )}
    </div>
  );
};

/* ── Exam ── */
const ExamOutput = () => (
  <div className="rounded-xl border border-border bg-card p-5 animate-fade-in space-y-4">
    <h3 className="font-semibold text-foreground">Full Exam</h3>
    <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
      <li>20 multiple-choice questions</li>
      <li>30-minute time limit</li>
      <li>Covers chapters 1–4</li>
      <li>Results and explanations after submission</li>
    </ul>
    <button
      className="w-full py-3 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)]"
      style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(173 80% 40%))" }}
    >
      Begin Exam →
    </button>
  </div>
);

/* ── Mind Map ── */
const MindMapOutput = () => {
  const center = { x: 250, y: 150 };
  const branches = [
    { x: 80, y: 50, label: "Light Reactions" },
    { x: 420, y: 50, label: "Calvin Cycle" },
    { x: 60, y: 250, label: "Chloroplasts" },
    { x: 440, y: 250, label: "ATP & NADPH" },
    { x: 250, y: 280, label: "Glucose" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-fade-in">
      <h3 className="font-semibold text-foreground mb-4">Mind Map</h3>
      <div className="relative h-[320px] w-full overflow-hidden">
        <svg className="absolute inset-0 w-full h-full">
          {branches.map((b, i) => (
            <line key={i} x1={center.x} y1={center.y} x2={b.x} y2={b.y} stroke="hsl(var(--primary) / 0.25)" strokeWidth="2" />
          ))}
        </svg>
        {/* Center node */}
        <div
          className="absolute px-4 py-2 rounded-xl text-sm font-bold bg-primary/20 border border-primary/40 text-primary animate-scale-in"
          style={{ left: center.x - 65, top: center.y - 16 }}
        >
          Photosynthesis
        </div>
        {branches.map((b, i) => (
          <div
            key={i}
            className="absolute px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-foreground animate-scale-in"
            style={{ left: b.x - 45, top: b.y - 12, animationDelay: `${(i + 1) * 100}ms`, animationFillMode: "both" }}
          >
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspacePage;
