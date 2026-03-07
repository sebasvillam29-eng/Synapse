import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Filter = "all" | "flashcards" | "quizzes" | "summaries";

interface LibraryItem {
  id: string;
  title: string;
  created_at: string;
  has_flashcards: boolean;
  has_quiz: boolean;
  has_summary: boolean;
}

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
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: sessions } = await supabase
        .from("study_sessions")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!sessions) { setLoading(false); return; }

      const enriched: LibraryItem[] = [];
      for (const s of sessions) {
        const [fcRes, qzRes, sumRes] = await Promise.all([
          supabase.from("flashcard_sets").select("id").eq("session_id", s.id).limit(1),
          supabase.from("quizzes").select("id").eq("session_id", s.id).limit(1),
          supabase.from("summaries").select("id").eq("session_id", s.id).limit(1),
        ]);
        enriched.push({
          id: s.id,
          title: s.title,
          created_at: s.created_at,
          has_flashcards: (fcRes.data?.length || 0) > 0,
          has_quiz: (qzRes.data?.length || 0) > 0,
          has_summary: (sumRes.data?.length || 0) > 0,
        });
      }
      setItems(enriched);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = items.filter(item => {
    if (filter === "flashcards" && !item.has_flashcards) return false;
    if (filter === "quizzes" && !item.has_quiz) return false;
    if (filter === "summaries" && !item.has_summary) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">Library</h1>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 border border-border rounded-lg bg-card px-3 transition-all duration-300 ${focused ? "w-64 border-primary/50" : "w-48"}`}>
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-2 w-full" />
          </div>
          <Link to="/app/workspace/new" className="px-4 py-2 rounded-lg text-sm font-semibold text-primary-foreground glow-primary transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] flex items-center gap-1.5" style={{ background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(173 80% 40%))" }}>
            <Plus className="w-4 h-4" /> New
          </Link>
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-muted/30 border border-border w-fit">
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${filter === f.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-5 animate-fade-in">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="8" width="40" height="52" rx="4" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="hsl(var(--muted) / 0.3)" />
            <path d="M44 8v12h12" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="24" y1="30" x2="48" y2="30" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="37" x2="44" y2="37" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="44" x2="40" y2="44" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="2" strokeLinecap="round" />
            <path d="M62 18l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="hsl(var(--primary))" className="animate-pulse" />
            <path d="M54 42l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" fill="hsl(173 80% 40%)" className="animate-pulse" style={{ animationDelay: "500ms" }} />
          </svg>
          <h3 className="text-lg font-semibold text-foreground">Your library is empty</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs">Upload your first PDF or paste notes to get started. Takes 10 seconds.</p>
          <Link to="/app/workspace/new" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]" style={{ background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(173 80% 40%))" }}>Upload your first document →</Link>
          <p className="text-xs text-muted-foreground">or drag a file anywhere on this page</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const timeAgo = (() => {
              const diff = Date.now() - new Date(item.created_at).getTime();
              const mins = Math.floor(diff / 60000);
              if (mins < 60) return `${mins}m ago`;
              if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
              return `${Math.floor(mins / 1440)}d ago`;
            })();
            const tags: string[] = [];
            if (item.has_summary) tags.push("Summary");
            if (item.has_flashcards) tags.push("Flashcards");
            if (item.has_quiz) tags.push("Quiz");

            return (
              <Link
                to={`/app/workspace/${item.id}`}
                key={item.id}
                className="rounded-2xl border border-border bg-card overflow-hidden group hover:-translate-y-[2px] hover:shadow-lg hover:border-primary/20 transition-all duration-300 active:scale-[0.97] animate-fade-in"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="h-1 bg-primary" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📚</span>
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{timeAgo}</p>
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {tags.map(tag => (
                      <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full text-muted-foreground" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>{tag}</span>
                    ))}
                    {tags.length === 0 && <span className="text-[11px] text-muted-foreground">No content yet</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="text-xs text-primary hover:underline font-medium">Open →</button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
