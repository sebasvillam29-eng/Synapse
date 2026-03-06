import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Upload, FileText, BookOpen, Layers, Brain, Map, MessageSquare,
  CheckCircle, Sparkles, X, ChevronRight, Send, Edit3, Save
} from "lucide-react";

type PdfState = "empty" | "uploading" | "loaded";
type Tool = "summary" | "flashcards" | "quiz" | "exam" | "mindmap";

const statusMessages = ["Reading document...", "Extracting key concepts...", "Building knowledge graph...", "Almost ready..."];

const tools: { id: Tool; icon: any; label: string }[] = [
  { id: "summary", icon: BookOpen, label: "Summary" },
  { id: "flashcards", icon: Layers, label: "Flashcards" },
  { id: "quiz", icon: Brain, label: "Quick Quiz" },
  { id: "exam", icon: FileText, label: "Full Exam" },
  { id: "mindmap", icon: Map, label: "Mind Map" },
];

const WorkspacePage = () => {
  const [pdfState, setPdfState] = useState<PdfState>("empty");
  const [statusIdx, setStatusIdx] = useState(0);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [toolLoading, setToolLoading] = useState(false);
  const [toolDone, setToolDone] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("Organic Chemistry — Ch. 4");

  // Upload simulation
  const startUpload = () => {
    setPdfState("uploading");
    setStatusIdx(0);
  };

  useEffect(() => {
    if (pdfState === "uploading") {
      const si = setInterval(() => setStatusIdx((i) => (i + 1) % statusMessages.length), 600);
      const done = setTimeout(() => { setPdfState("loaded"); clearInterval(si); }, 3000);
      return () => { clearInterval(si); clearTimeout(done); };
    }
  }, [pdfState]);

  const selectTool = (id: Tool) => {
    setActiveTool(id);
    setToolLoading(true);
    setToolDone(false);
    setTimeout(() => { setToolLoading(false); setToolDone(true); }, 1500);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="h-14 border-b border-border px-4 flex items-center justify-between shrink-0">
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
          <Save className="w-3 h-3" /> Auto-saved
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT — PDF viewer */}
        <div className="w-[40%] border-r border-border p-4 overflow-auto">
          {pdfState === "empty" && (
            <button
              onClick={startUpload}
              className="w-full h-full min-h-[400px] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-muted/10 transition-all duration-300"
            >
              <Upload className="w-10 h-10" />
              <p className="text-sm font-medium">Drop PDF here or click to upload</p>
            </button>
          )}

          {pdfState === "uploading" && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 animate-fade-in">
              <FileText className="w-10 h-10 text-primary" />
              <p className="text-sm font-medium text-foreground">Organic_Chemistry_Ch4.pdf</p>
              <div className="w-48 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full animate-pulse" style={{ width: "65%", background: "linear-gradient(90deg, hsl(262 83% 58%), hsl(173 80% 40%))" }} />
              </div>
              <p key={statusIdx} className="text-xs text-muted-foreground animate-fade-in">{statusMessages[statusIdx]}</p>
            </div>
          )}

          {pdfState === "loaded" && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/30 w-fit text-xs text-secondary">
                <CheckCircle className="w-3 h-3" /> AI read all 8 pages
              </div>
              {/* Mock PDF lines */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`h-3 rounded ${i % 4 === 1 ? "bg-primary/15 w-[85%]" : i % 3 === 0 ? "bg-muted/60 w-full" : "bg-muted/40 w-[90%]"}`} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Tools */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {tools.slice(0, 4).map((t) => (
              <button
                key={t.id}
                onClick={() => selectTool(t.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] ${
                  activeTool === t.id
                    ? "bg-primary/10 border-primary/40 glow-primary"
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <t.icon className={`w-5 h-5 mb-2 ${activeTool === t.id ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium text-foreground">{t.label}</p>
              </button>
            ))}
          </div>
          <button
            onClick={() => selectTool("mindmap")}
            className={`w-full p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.01] active:scale-[0.97] mb-6 ${
              activeTool === "mindmap" ? "bg-primary/10 border-primary/40 glow-primary" : "bg-card border-border hover:border-primary/30"
            }`}
          >
            <Map className={`w-5 h-5 mb-2 ${activeTool === "mindmap" ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm font-medium text-foreground">Mind Map</p>
          </button>

          {/* Output area */}
          {toolLoading && (
            <div className="flex items-center gap-3 py-8 justify-center animate-fade-in">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary ai-dot-1" />
                <span className="w-2 h-2 rounded-full bg-primary ai-dot-2" />
                <span className="w-2 h-2 rounded-full bg-primary ai-dot-3" />
              </div>
              <span className="text-sm text-muted-foreground">Generating...</span>
            </div>
          )}

          {toolDone && activeTool === "mindmap" && <MindMapOutput />}
          {toolDone && activeTool === "summary" && <SummaryOutput />}
          {toolDone && activeTool === "flashcards" && <FlashcardsOutput />}
          {toolDone && activeTool === "quiz" && <QuizOutput />}
          {toolDone && activeTool === "exam" && <ExamOutput />}

          {/* AI chat button */}
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 z-20"
            style={{ background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(173 80% 40%))" }}
          >
            <MessageSquare className="w-4 h-4" /> Ask AI about this doc 🤖
          </button>
        </div>

        {/* Chat panel */}
        <div className={`absolute top-0 right-0 h-full w-[300px] bg-card border-l border-border flex flex-col transition-transform duration-300 z-30 ${chatOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Ask AI</h3>
            <button onClick={() => setChatOpen(false)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center">
            <p className="text-xs text-muted-foreground text-center">Ask anything about this document...</p>
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <input className="flex-1 bg-muted/30 rounded-lg px-3 py-2 text-sm text-foreground outline-none border border-border focus:border-primary/50 transition-colors" placeholder="Type a question..." />
            <button className="p-2 rounded-lg bg-primary text-primary-foreground"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryOutput = () => (
  <div className="rounded-xl border border-border bg-card p-5 animate-fade-in space-y-3">
    <h3 className="font-semibold text-foreground text-sm">AI Summary</h3>
    <p className="text-sm text-foreground/80 leading-relaxed"><strong>Organic Chemistry Chapter 4</strong> covers stereochemistry — the study of the 3D arrangement of atoms. Key concepts include <em>chirality</em>, <em>enantiomers</em>, and <em>diastereomers</em>. R/S configuration is assigned using Cahn-Ingold-Prelog priority rules.</p>
  </div>
);

const FlashcardsOutput = () => (
  <div className="rounded-xl border border-border bg-card p-5 animate-fade-in space-y-2">
    <h3 className="font-semibold text-foreground text-sm mb-3">24 Flashcards Generated</h3>
    {["What is chirality?", "Define enantiomers", "R vs S configuration"].map((q, i) => (
      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border text-sm">
        <span className="text-foreground">{q}</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    ))}
    <Link to="/app/flashcards/1" className="block text-center text-sm text-primary hover:underline mt-2">Study all →</Link>
  </div>
);

const QuizOutput = () => (
  <div className="rounded-xl border border-border bg-card p-5 animate-fade-in space-y-2">
    <h3 className="font-semibold text-foreground text-sm mb-3">Quick Quiz — 5 Questions</h3>
    <Link to="/app/quiz/1" className="block w-full text-center py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Start Quiz →</Link>
  </div>
);

const ExamOutput = () => (
  <div className="rounded-xl border border-border bg-card p-5 animate-fade-in space-y-2">
    <h3 className="font-semibold text-foreground text-sm mb-3">Full Exam — 20 Questions, 30 min</h3>
    <Link to="/app/quiz/1" className="block w-full text-center py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">Start Exam →</Link>
  </div>
);

const MindMapOutput = () => {
  const nodes = [
    { x: 250, y: 150, label: "Stereochemistry", main: true },
    { x: 80, y: 60, label: "Chirality" },
    { x: 420, y: 60, label: "Enantiomers" },
    { x: 80, y: 240, label: "R/S Config" },
    { x: 420, y: 240, label: "Diastereomers" },
    { x: 250, y: 280, label: "Meso Compounds" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-fade-in">
      <h3 className="font-semibold text-foreground text-sm mb-4">Mind Map</h3>
      <div className="relative h-[320px] w-full">
        <svg className="absolute inset-0 w-full h-full">
          {nodes.slice(1).map((n, i) => (
            <line key={i} x1={nodes[0].x} y1={nodes[0].y} x2={n.x} y2={n.y}
              stroke="hsl(262 83% 58% / 0.3)" strokeWidth="2" />
          ))}
        </svg>
        {nodes.map((n, i) => (
          <div
            key={i}
            className={`absolute px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 animate-scale-in ${
              n.main ? "bg-primary/20 border-primary/40 text-primary" : "bg-card border-border text-foreground"
            }`}
            style={{
              left: n.x - 50, top: n.y - 14,
              animationDelay: `${i * 150}ms`, animationFillMode: "both"
            }}
          >
            {n.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspacePage;
