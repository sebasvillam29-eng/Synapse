import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, BookOpen, Brain, Layers, MoreHorizontal } from "lucide-react";

type Filter = "all" | "flashcards" | "quizzes" | "summaries";

const mockItems = [
  { id: 1, emoji: "📚", title: "Organic Chemistry — Ch. 4", subject: "Chemistry", meta: "18 flashcards · 89% mastery", mastery: 89, type: "flashcards" as const, color: "hsl(262 83% 58%)" },
  { id: 2, emoji: "🧬", title: "Molecular Biology — Midterm", subject: "Biology", meta: "32 flashcards · 72% mastery", mastery: 72, type: "flashcards" as const, color: "hsl(173 80% 40%)" },
  { id: 3, emoji: "⚖️", title: "Constitutional Law — Week 6", subject: "Law", meta: "10 questions · 65% score", mastery: 65, type: "quizzes" as const, color: "hsl(45 93% 47%)" },
  { id: 4, emoji: "🔬", title: "Physics — Thermodynamics", subject: "Physics", meta: "Summary · 3 pages", mastery: 100, type: "summaries" as const, color: "hsl(262 83% 58%)" },
  { id: 5, emoji: "📐", title: "Calculus II — Integration", subject: "Math", meta: "24 flashcards · 54% mastery", mastery: 54, type: "flashcards" as const, color: "hsl(173 80% 40%)" },
  { id: 6, emoji: "🌍", title: "World History — Renaissance", subject: "History", meta: "Quiz · 80% score", mastery: 80, type: "quizzes" as const, color: "hsl(45 93% 47%)" },
];

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "flashcards", label: "Flashcards" },
  { id: "quizzes", label: "Quizzes" },
  { id: "summaries", label: "Summaries" },
];

const LibraryPage = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const filtered = mockItems.filter((item) => {
    if (filter !== "all" && item.type !== filter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">Library</h1>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 border border-border rounded-lg bg-card px-3 transition-all duration-300 ${focused ? "w-64 border-primary/50" : "w-48"}`}>
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-2 w-full"
            />
          </div>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold text-primary-foreground glow-primary transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] flex items-center gap-1.5"
            style={{ background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(173 80% 40%))" }}>
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/30 border border-border w-fit">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
              filter === f.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fade-in">
          {/* SVG Document with sparkle */}
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="8" width="40" height="52" rx="4" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="hsl(var(--muted) / 0.3)" />
            <path d="M44 8v12h12" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="24" y1="30" x2="48" y2="30" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="37" x2="44" y2="37" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="44" x2="40" y2="44" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="2" strokeLinecap="round" />
            {/* Sparkle */}
            <path d="M62 18l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="hsl(var(--primary))" className="animate-pulse" />
            <path d="M54 42l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" fill="hsl(173 80% 40%)" className="animate-pulse" style={{ animationDelay: "500ms" }} />
          </svg>
          <h3 className="text-lg font-semibold text-foreground">Your library is empty</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Upload your first PDF or paste notes to get started. Takes 10 seconds.
          </p>
          <Link
            to="/app/workspace/new"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(173 80% 40%))" }}
          >
            Upload your first document →
          </Link>
          <p className="text-xs text-muted-foreground">or drag a file anywhere on this page</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <Link
              to={`/app/workspace/${item.id}`}
              key={item.id}
              className="rounded-2xl border border-border bg-card overflow-hidden group hover:-translate-y-[2px] hover:shadow-lg hover:border-primary/20 transition-all duration-300 active:scale-[0.97] animate-fade-in"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div className="h-1" style={{ backgroundColor: item.color }} />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{item.emoji}</span>
                  <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{item.meta}</p>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-4">
                  <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${item.mastery}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button className="text-xs text-primary hover:underline font-medium">Study →</button>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Quiz</button>
                  </div>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
