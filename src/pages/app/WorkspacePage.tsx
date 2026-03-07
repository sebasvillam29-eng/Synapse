import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight, ChevronLeft, Edit3, RefreshCw, Copy, Download,
  Check, X, Upload, Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type ToolId = "summary" | "flashcards" | "quiz" | "exam" | "mindmap";

interface SummarySection { heading: string; body: string; }
interface FlashcardData { question: string; answer: string; why: string; }
interface QuizQuestion { question: string; options: string[]; correct_index: number; explanation: string; }

const toolItems: { id: ToolId; emoji: string; title: string; sub: string }[] = [
  { id: "summary", emoji: "📄", title: "Summary", sub: "Key concepts" },
  { id: "flashcards", emoji: "🃏", title: "Flashcards", sub: "Cards" },
  { id: "quiz", emoji: "✅", title: "Quick Quiz", sub: "5 questions" },
  { id: "exam", emoji: "🎓", title: "Full Exam", sub: "20 questions" },
  { id: "mindmap", emoji: "🗺️", title: "Mind Map", sub: "Visual map" },
];

const WorkspacePage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTool, setActiveTool] = useState<ToolId>("summary");
  const [toolKey, setToolKey] = useState(0);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("Loading...");
  const [notesText, setNotesText] = useState("");
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [hasNotes, setHasNotes] = useState(false);
  const [saved, setSaved] = useState(true);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");

  // Content state
  const [summarySections, setSummarySections] = useState<SummarySection[] | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardData[] | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [generating, setGenerating] = useState<ToolId | null>(null);

  // Word count & reading time
  const wordCount = notesText.split(/\s+/).filter(Boolean).length;
  const readingMin = Math.max(1, Math.ceil(wordCount / 200));

  // Load session
  useEffect(() => {
    if (!id || id === "new") {
      setTitle("New Session");
      setSessionLoaded(true);
      return;
    }

    const load = async () => {
      const { data: session } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (session) {
        setTitle(session.title);
        setNotesText(session.notes_text || "");
        setHasNotes(!!(session.notes_text && session.notes_text.trim()));
      }
      setSessionLoaded(true);

      // Load existing content
      if (session) {
        // Summary
        const { data: summaries } = await supabase
          .from("summaries")
          .select("content")
          .eq("session_id", session.id)
          .maybeSingle();
        if (summaries?.content) {
          try { setSummarySections(JSON.parse(summaries.content)); } catch {}
        }

        // Flashcards
        const { data: sets } = await supabase
          .from("flashcard_sets")
          .select("id")
          .eq("session_id", session.id)
          .limit(1);
        if (sets && sets.length > 0) {
          const { data: cards } = await supabase
            .from("flashcards")
            .select("question, answer")
            .eq("set_id", sets[0].id);
          if (cards && cards.length > 0) {
            setFlashcards(cards.map(c => {
              const parts = c.answer.split("\n---\n");
              return { question: c.question, answer: parts[0], why: parts[1] || "" };
            }));
          }
        }

        // Quiz
        const { data: quizzes } = await supabase
          .from("quizzes")
          .select("id")
          .eq("session_id", session.id)
          .limit(1);
        if (quizzes && quizzes.length > 0) {
          const { data: qs } = await supabase
            .from("quiz_questions")
            .select("question, options, correct_answer")
            .eq("quiz_id", quizzes[0].id);
          if (qs && qs.length > 0) {
            setQuizQuestions(qs.map(q => {
              const opts = (q.options as string[]) || [];
              return {
                question: q.question,
                options: opts,
                correct_index: opts.indexOf(q.correct_answer),
                explanation: "",
              };
            }));
          }
        }
      }
    };
    load();
  }, [id]);

  // Save title
  const saveTitle = useCallback(async () => {
    setEditing(false);
    if (!id || id === "new") return;
    setSaved(false);
    await supabase.from("study_sessions").update({ title }).eq("id", id);
    setSaved(true);
  }, [id, title]);

  // Save notes (paste)
  const handlePasteSubmit = useCallback(async () => {
    if (!pasteText.trim()) return;
    setSaved(false);

    let sessionId = id;
    if (!sessionId || sessionId === "new") {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast({ title: "Please log in", variant: "destructive" }); return; }
      const { data: newSession } = await supabase
        .from("study_sessions")
        .insert({ user_id: user.id, title: title === "New Session" ? "Untitled Session" : title, notes_text: pasteText })
        .select()
        .single();
      if (newSession) {
        sessionId = newSession.id;
        window.history.replaceState(null, "", `/app/workspace/${sessionId}`);
      }
    } else {
      await supabase.from("study_sessions").update({ notes_text: pasteText }).eq("id", sessionId);
    }

    setNotesText(pasteText);
    setHasNotes(true);
    setPasteMode(false);
    setSaved(true);
    toast({ title: "Notes saved!" });
  }, [id, title, pasteText]);

  // Generate content
  const generateContent = useCallback(async (type: "summary" | "flashcards" | "quiz") => {
    const sessionId = id;
    if (!sessionId || sessionId === "new" || !hasNotes) {
      toast({ title: "Upload or paste notes first", variant: "destructive" });
      return;
    }

    setGenerating(type);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { session_id: sessionId, type },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const result = data.data;
      if (type === "summary") setSummarySections(result.sections);
      else if (type === "flashcards") setFlashcards(result.cards);
      else if (type === "quiz") {
        setQuizQuestions(result.questions);
      }

      toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} generated!` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Generation failed", description: e.message || "Please try again", variant: "destructive" });
    } finally {
      setGenerating(null);
    }
  }, [id, hasNotes]);

  const selectTool = useCallback((toolId: ToolId) => {
    setActiveTool(toolId);
    setToolKey(k => k + 1);
  }, []);

  const activeLabel = toolItems.find(t => t.id === activeTool)?.title ?? "";

  // Dynamic sidebar sub labels
  const sidebarItems = toolItems.map(t => ({
    ...t,
    sub: t.id === "flashcards" && flashcards ? `${flashcards.length} cards` :
         t.id === "quiz" && quizQuestions ? `${quizQuestions.length} questions` :
         t.id === "summary" && summarySections ? `${summarySections.length} sections` :
         t.sub,
  }));

  if (!sessionLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Tool Sidebar ── */}
      <div className="shrink-0 flex flex-col" style={{ width: 200, background: "#0d0d16", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <span className="text-[14px]">📄</span>
            <span className="text-[13px] font-semibold text-foreground truncate">{title}</span>
          </div>
          {hasNotes && (
            <p className="text-[11px] text-muted-foreground mt-1" style={{ paddingLeft: 24 }}>
              ~{wordCount} words · {readingMin} min
            </p>
          )}
        </div>

        <div style={{ padding: "12px 8px" }} className="flex flex-col gap-0.5 flex-1">
          <p className="text-muted-foreground font-semibold mb-1" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", padding: "4px 8px" }}>
            Study Tools
          </p>
          {sidebarItems.map(t => {
            const active = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => selectTool(t.id)}
                className="w-full text-left flex items-center gap-2.5 transition-all duration-150"
                style={{
                  padding: "10px 12px", borderRadius: 10,
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
        <div className="shrink-0 flex items-center justify-between" style={{ height: 52, padding: "0 32px", background: "#0d0d16", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 text-sm">
            <Link to="/app/library" className="text-muted-foreground hover:text-foreground transition-colors">Library</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            {editing ? (
              <input autoFocus value={title} onChange={e => setTitle(e.target.value)} onBlur={saveTitle} onKeyDown={e => e.key === "Enter" && saveTitle()} className="bg-transparent text-muted-foreground outline-none border-b border-primary text-sm" />
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
        {hasNotes && (
          <div className="shrink-0 text-[12px] text-muted-foreground" style={{ padding: "7px 24px", background: "rgba(255,255,255,0.015)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            ~{wordCount} words &nbsp;·&nbsp; Estimated study time:{" "}
            <span style={{ color: "rgba(157,127,224,0.7)" }}>{readingMin} min</span>
          </div>
        )}

        {/* Content */}
        <div key={toolKey} className="flex-1 overflow-y-auto animate-fade-in" style={{ padding: "40px 48px" }}>
          {/* If no notes, show upload prompt */}
          {!hasNotes ? (
            <NoNotesPrompt pasteMode={pasteMode} setPasteMode={setPasteMode} pasteText={pasteText} setPasteText={setPasteText} onSubmit={handlePasteSubmit} />
          ) : (
            <>
              {activeTool === "summary" && (
                <SummaryContent title={title} sections={summarySections} generating={generating === "summary"} onGenerate={() => generateContent("summary")} />
              )}
              {activeTool === "flashcards" && (
                <FlashcardsContent cards={flashcards} generating={generating === "flashcards"} onGenerate={() => generateContent("flashcards")} />
              )}
              {activeTool === "quiz" && (
                <QuizContent questions={quizQuestions} generating={generating === "quiz"} onGenerate={() => generateContent("quiz")} />
              )}
              {activeTool === "exam" && <ExamContent />}
              {activeTool === "mindmap" && <MindMapContent />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ NO NOTES PROMPT ═══════════════ */
const NoNotesPrompt = ({ pasteMode, setPasteMode, pasteText, setPasteText, onSubmit }: {
  pasteMode: boolean; setPasteMode: (v: boolean) => void; pasteText: string; setPasteText: (v: string) => void; onSubmit: () => void;
}) => (
  <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
    {!pasteMode ? (
      <>
        <Upload className="w-12 h-12 mb-4" style={{ color: "rgba(124,92,191,0.6)" }} />
        <h2 className="text-lg font-semibold text-foreground mb-2">Add your study material</h2>
        <p className="text-[14px] text-muted-foreground mb-6">Paste your notes below to generate summaries, flashcards, and quizzes with AI.</p>
        <button
          onClick={() => setPasteMode(true)}
          className="text-[14px] font-semibold text-white transition-all hover:opacity-90"
          style={{ padding: "12px 28px", borderRadius: 10, background: "linear-gradient(135deg, #7c5cbf, #5b3fa8)", boxShadow: "0 4px 16px rgba(124,92,191,0.3)" }}
        >
          Paste your notes →
        </button>
      </>
    ) : (
      <div className="w-full text-left">
        <h2 className="text-lg font-semibold text-foreground mb-3">Paste your notes</h2>
        <textarea
          autoFocus
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          placeholder="Paste your study notes here..."
          className="w-full h-64 p-4 rounded-xl text-sm text-foreground bg-card border border-border resize-none focus:outline-none focus:border-primary/50"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={() => setPasteMode(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button
            onClick={onSubmit}
            disabled={!pasteText.trim()}
            className="text-sm font-semibold text-white px-6 py-2.5 rounded-lg disabled:opacity-40 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c5cbf, #5b3fa8)" }}
          >
            Save notes
          </button>
        </div>
      </div>
    )}
  </div>
);

/* ═══════════════ GENERATE BUTTON ═══════════════ */
const GenerateButton = ({ label, generating, onGenerate }: { label: string; generating: boolean; onGenerate: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <p className="text-muted-foreground text-[14px] mb-4">No {label} generated yet for this session.</p>
    <button
      onClick={onGenerate}
      disabled={generating}
      className="flex items-center gap-2 text-[14px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
      style={{ padding: "12px 28px", borderRadius: 10, background: "linear-gradient(135deg, #7c5cbf, #5b3fa8)", boxShadow: "0 4px 16px rgba(124,92,191,0.3)" }}
    >
      {generating && <Loader2 className="w-4 h-4 animate-spin" />}
      {generating ? "Generating..." : `Generate ${label} →`}
    </button>
  </div>
);

/* ═══════════════ SUMMARY ═══════════════ */
const SummaryContent = ({ title, sections, generating, onGenerate }: {
  title: string; sections: SummarySection[] | null; generating: boolean; onGenerate: () => void;
}) => {
  if (!sections) return <GenerateButton label="summary" generating={generating} onGenerate={onGenerate} />;

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold uppercase" style={{ color: "#9d7fe0", letterSpacing: "0.06em" }}>AI Summary</span>
        <div className="flex gap-2">
          {[{ icon: Copy, label: "Copy", action: () => {
            navigator.clipboard.writeText(sections.map(s => `${s.heading}\n${s.body}`).join("\n\n"));
            toast({ title: "Copied to clipboard" });
          }}, { icon: Download, label: "Download" }].map(b => (
            <button key={b.label} onClick={b.action} className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors" style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <b.icon className="w-3.5 h-3.5" /> {b.label}
            </button>
          ))}
          <button onClick={onGenerate} disabled={generating} className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors" style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Regenerate
          </button>
        </div>
      </div>

      <h1 className="text-[28px] text-foreground mb-4" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>{title}</h1>

      <div className="flex gap-2 mb-10 flex-wrap">
        {[`${sections.length} sections`, `~${Math.ceil(sections.length * 1.5)} min read`].map(t => (
          <span key={t} className="text-[12px] rounded-full" style={{ padding: "4px 12px", background: "rgba(124,92,191,0.08)", border: "1px solid rgba(124,92,191,0.2)", color: "rgba(157,127,224,0.8)" }}>{t}</span>
        ))}
      </div>

      {sections.map((s, i) => (
        <div key={i} className="mb-9" style={{ paddingLeft: 20, borderLeft: "2px solid rgba(124,92,191,0.2)" }}>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="shrink-0 flex items-center justify-center text-[11px] font-bold" style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(124,92,191,0.15)", border: "1px solid rgba(124,92,191,0.3)", color: "#9d7fe0" }}>{i + 1}</span>
            <h3 className="text-[15px] font-bold text-foreground">{s.heading}</h3>
          </div>
          <p className="text-[15px]" style={{ lineHeight: 1.85, color: "rgba(232,232,240,0.72)", paddingLeft: 34 }}>{s.body}</p>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════ FLASHCARDS ═══════════════ */
const FlashcardsContent = ({ cards, generating, onGenerate }: {
  cards: FlashcardData[] | null; generating: boolean; onGenerate: () => void;
}) => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const flip = useCallback(() => setFlipped(f => !f), []);
  const prev = useCallback(() => { setFlipped(false); setIdx(i => Math.max(0, i - 1)); }, []);
  const next = useCallback(() => { setFlipped(false); setIdx(i => Math.min((cards?.length ?? 1) - 1, i + 1)); }, [cards?.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); flip(); }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flip, prev, next]);

  if (!cards) return <GenerateButton label="flashcards" generating={generating} onGenerate={onGenerate} />;

  const card = cards[idx];
  const progress = ((idx + 1) / cards.length) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 mb-4">
        <p className="text-[13px] text-muted-foreground">Card {idx + 1} of {cards.length} · Click to flip</p>
        <button onClick={onGenerate} disabled={generating} className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
          {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} Regenerate
        </button>
      </div>

      <div className="w-full max-w-[480px] h-[3px] rounded-full mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7c5cbf, #2dd4bf)" }} />
      </div>

      <div className="w-full max-w-[480px] cursor-pointer mb-6" style={{ height: 220, perspective: 800 }} onClick={flip}>
        <div className="relative w-full h-full transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "" }}>
          <div className="absolute inset-0 flex flex-col justify-center p-6" style={{ backfaceVisibility: "hidden", borderRadius: 14, background: "rgba(124,92,191,0.07)", border: "1px solid rgba(124,92,191,0.25)" }}>
            <span className="text-[11px] font-bold uppercase mb-3" style={{ color: "#9d7fe0", letterSpacing: "0.06em" }}>Question</span>
            <p className="text-[20px] text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>{card.question}</p>
            <p className="text-[12px] mt-auto" style={{ color: "rgba(232,232,240,0.25)" }}>tap to reveal →</p>
          </div>
          <div className="absolute inset-0 flex flex-col p-6 overflow-y-auto" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 14, background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.2)" }}>
            <span className="text-[11px] font-bold uppercase mb-2" style={{ color: "#2dd4bf", letterSpacing: "0.06em" }}>Answer</span>
            <p className="text-[15px] text-foreground" style={{ lineHeight: 1.75 }}>{card.answer}</p>
            {card.why && (
              <>
                <div className="my-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                <span className="text-[11px] font-bold uppercase mb-1" style={{ color: "#2dd4bf", letterSpacing: "0.06em" }}>Why this matters</span>
                <p className="text-[13px] text-muted-foreground">{card.why}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button onClick={prev} disabled={idx === 0} className="flex items-center justify-center transition-colors disabled:opacity-30" style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button onClick={next} disabled={idx === cards.length - 1} className="flex items-center justify-center transition-colors disabled:opacity-30" style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <p className="text-[12px]" style={{ color: "rgba(232,232,240,0.2)" }}>← → arrow keys · Space to flip</p>
    </div>
  );
};

/* ═══════════════ QUIZ ═══════════════ */
const QuizContent = ({ questions, generating, onGenerate }: {
  questions: QuizQuestion[] | null; generating: boolean; onGenerate: () => void;
}) => {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  if (!questions) return <GenerateButton label="quiz" generating={generating} onGenerate={onGenerate} />;

  const current = questions[qIdx];
  const answered = selected !== null;
  const isCorrect = selected === current.correct_index;
  const progress = ((qIdx + 1) / questions.length) * 100;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    if (i === current.correct_index) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(q => q + 1);
      setSelected(null);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[24px] text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>Quick Quiz</h1>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-muted-foreground">{score}/{questions.length} correct</span>
          <button onClick={onGenerate} disabled={generating} className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
            {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} New quiz
          </button>
        </div>
      </div>

      <div className="w-full h-[3px] rounded-full mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7c5cbf, #2dd4bf)" }} />
      </div>

      <span className="inline-block text-[12px] font-semibold rounded-full mb-3" style={{ padding: "4px 12px", background: "rgba(124,92,191,0.12)", color: "#9d7fe0" }}>
        Question {qIdx + 1} of {questions.length}
      </span>
      <p className="text-[20px] text-foreground mb-6" style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 1.5 }}>{current.question}</p>

      <div className="flex flex-col gap-2.5 mb-4">
        {current.options.map((opt, i) => {
          let bg = "rgba(255,255,255,0.03)";
          let border = "rgba(255,255,255,0.08)";
          let color = "#e8e8f0";
          if (answered) {
            if (i === current.correct_index) { bg = "rgba(45,212,191,0.1)"; border = "rgba(45,212,191,0.4)"; color = "#2dd4bf"; }
            else if (i === selected) { bg = "rgba(239,68,68,0.1)"; border = "rgba(239,68,68,0.4)"; color = "#ef4444"; }
            else { color = "rgba(232,232,240,0.3)"; }
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} disabled={answered} className="w-full text-left flex items-center justify-between text-[14px] transition-all duration-200" style={{ padding: "14px 18px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color }}>
              {opt}
              {answered && i === current.correct_index && <Check className="w-4 h-4" style={{ color: "#2dd4bf" }} />}
              {answered && i === selected && i !== current.correct_index && <X className="w-4 h-4" style={{ color: "#ef4444" }} />}
            </button>
          );
        })}
      </div>

      {answered && current.explanation && (
        <div className="animate-fade-in mb-6" style={{ borderLeft: `3px solid ${isCorrect ? "#2dd4bf" : "#ef4444"}`, background: "rgba(255,255,255,0.03)", padding: "14px 18px", borderRadius: 10, marginTop: 16 }}>
          <p className="text-[12px] font-bold mb-1" style={{ color: isCorrect ? "#2dd4bf" : "#ef4444" }}>
            {isCorrect ? "✓ Correct — here's why:" : "✗ Incorrect — here's why:"}
          </p>
          <p className="text-[14px]" style={{ color: "rgba(232,232,240,0.7)", lineHeight: 1.7 }}>{current.explanation}</p>
        </div>
      )}

      {answered && qIdx < questions.length - 1 && (
        <button onClick={handleNext} className="animate-fade-in text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90" style={{ padding: "11px 28px", borderRadius: 10, background: "linear-gradient(135deg, #7c5cbf, #5b3fa8)", boxShadow: "0 4px 16px rgba(124,92,191,0.3)" }}>
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
    <button className="text-[15px] font-semibold text-white transition-all hover:opacity-90" style={{ padding: "14px 32px", borderRadius: 10, background: "linear-gradient(135deg, #7c5cbf, #5b3fa8)", boxShadow: "0 4px 20px rgba(124,92,191,0.3)" }}>
      Begin Exam →
    </button>
  </div>
);

/* ═══════════════ MIND MAP ═══════════════ */
const MindMapContent = () => {
  const center = { x: 250, y: 150 };
  const branches = [
    { x: 80, y: 50, label: "Topic 1" },
    { x: 420, y: 50, label: "Topic 2" },
    { x: 60, y: 250, label: "Topic 3" },
    { x: 440, y: 250, label: "Topic 4" },
    { x: 250, y: 280, label: "Topic 5" },
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
        <div className="absolute px-4 py-2 rounded-xl text-sm font-bold animate-scale-in" style={{ left: center.x - 45, top: center.y - 16, background: "rgba(124,92,191,0.2)", border: "1px solid rgba(124,92,191,0.4)", color: "#9d7fe0" }}>
          Central
        </div>
        {branches.map((b, i) => (
          <div key={i} className="absolute px-3 py-1.5 rounded-lg text-xs font-medium text-foreground animate-scale-in" style={{ left: b.x - 35, top: b.y - 12, animationDelay: `${(i + 1) * 100}ms`, animationFillMode: "both", background: "#111120", border: "1px solid rgba(255,255,255,0.08)" }}>
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspacePage;
