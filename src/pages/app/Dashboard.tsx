import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCountUp } from "@/hooks/useCountUp";

interface StudySet {
  id: string;
  title: string;
  created_at: string;
  notes_text: string;
  flashcard_count: number;
  quiz_count: number;
  has_summary: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [totalFlashcards, setTotalFlashcards] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [lastActive, setLastActive] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user name
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "there";
      setUserName(name.split(" ")[0]);

      // Fetch sessions
      const { data: sessions } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!sessions || sessions.length === 0) {
        setStudySets([]);
        setLoading(false);
        return;
      }

      // Fetch related counts for each session
      const enriched: StudySet[] = [];
      for (const s of sessions) {
        const [fcRes, qzRes, sumRes] = await Promise.all([
          supabase.from("flashcard_sets").select("id").eq("session_id", s.id),
          supabase.from("quizzes").select("id, score, total_questions").eq("session_id", s.id),
          supabase.from("summaries").select("id").eq("session_id", s.id),
        ]);

        let fcCount = 0;
        if (fcRes.data && fcRes.data.length > 0) {
          const { count } = await supabase.from("flashcards").select("id", { count: "exact", head: true }).eq("set_id", fcRes.data[0].id);
          fcCount = count || 0;
        }

        enriched.push({
          id: s.id,
          title: s.title,
          created_at: s.created_at,
          notes_text: s.notes_text || "",
          flashcard_count: fcCount,
          quiz_count: qzRes.data?.length || 0,
          has_summary: (sumRes.data?.length || 0) > 0,
        });
      }

      setStudySets(enriched);

      // Stats
      const totalFc = enriched.reduce((acc, s) => acc + s.flashcard_count, 0);
      setTotalFlashcards(totalFc);

      // Average quiz score
      const { data: allQuizzes } = await supabase.from("quizzes").select("score, total_questions").eq("user_id", user.id).eq("completed", true);
      if (allQuizzes && allQuizzes.length > 0) {
        const avg = allQuizzes.reduce((acc, q) => acc + ((q.score || 0) / Math.max(q.total_questions || 1, 1)) * 100, 0) / allQuizzes.length;
        setAvgScore(Math.round(avg));
      }

      // Last active
      const latest = sessions[0];
      const diff = Date.now() - new Date(latest.created_at).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 60) setLastActive(`${mins}m ago`);
      else if (mins < 1440) setLastActive(`${Math.floor(mins / 60)}h ago`);
      else setLastActive(`${Math.floor(mins / 1440)}d ago`);

      setLoading(false);
    };
    load();
  }, []);

  const handleNewSession = async () => {
    navigate("/app/workspace/new");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Greeting */}
      <div className="animate-fade-in">
        <h1 className="text-[32px] text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
          {greeting}, {userName} 👋
        </h1>
        <p className="text-muted-foreground text-[15px] mt-1">
          {studySets.length === 0
            ? "Create your first study set to get started."
            : `You have ${studySets.length} study set${studySets.length !== 1 ? "s" : ""}.`}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
        <StatCard icon="📄" label="Study sets" value={studySets.length} />
        <StatCard icon="🃏" label="Flashcards created" value={totalFlashcards} />
        <StatCard icon="✅" label="Avg quiz score" value={avgScore} suffix="%" sub={avgScore > 0 ? "↑ improving" : "No quizzes yet"} subColor={avgScore > 0 ? "rgba(45,212,191,0.85)" : undefined} />
        <StatCard icon="🕐" label="Last active" staticValue={lastActive || "Now"} />
      </div>

      {/* Study Set Cards */}
      <div className="mt-12 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
        {studySets.length === 0 ? (
          <OnboardingStepper />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent study sets</h2>
              <Link to="/app/library" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-3.5">
              {studySets.slice(0, 6).map((set) => (
                <StudySetCard key={set.id} set={set} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-10 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleNewSession}
            className="flex items-center gap-2 text-sm transition-all duration-200"
            style={{ padding: "11px 22px", borderRadius: 10, border: "1.5px dashed rgba(124,92,191,0.35)", background: "rgba(124,92,191,0.04)", color: "#9d7fe0" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,92,191,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(124,92,191,0.04)")}
          >
            📄 Upload PDF
          </button>
          <button
            onClick={handleNewSession}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground"
            style={{ padding: "11px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
          >
            📋 Paste Notes
          </button>
          <Link
            to="/app/chat"
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{ padding: "11px 22px", borderRadius: 10, background: "linear-gradient(135deg, #7c5cbf, #5b3fa8)", color: "#fff", boxShadow: "0 4px 16px rgba(124,92,191,0.3)" }}
          >
            🤖 Ask AI Tutor →
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon, label, value, suffix, badge, staticValue, sub, subColor }: {
  icon: string; label: string; value?: number; suffix?: string; badge?: string; staticValue?: string; sub?: string; subColor?: string;
}) => {
  const count = useCountUp(value ?? 0, 1000);
  return (
    <div className="transition-all duration-300" style={{ background: "#111120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px" }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[14px]">{icon}</span>
        <span className="text-[12px] text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-[28px] text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
          {staticValue ?? `${count}${suffix || ""}`}
        </p>
        {badge && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.3)", color: "rgba(45,212,191,0.9)" }}>{badge}</span>
        )}
      </div>
      {sub && <p className="text-[12px] mt-1" style={{ color: subColor || "rgba(232,232,240,0.4)" }}>{sub}</p>}
    </div>
  );
};

/* ── Study Set Card ── */
const StudySetCard = ({ set }: { set: StudySet }) => {
  const tags: string[] = [];
  if (set.has_summary) tags.push("Summary");
  if (set.flashcard_count > 0) tags.push(`${set.flashcard_count} cards`);
  if (set.quiz_count > 0) tags.push(`${set.quiz_count} quiz${set.quiz_count > 1 ? "zes" : ""}`);

  const timeAgo = (() => {
    const diff = Date.now() - new Date(set.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  })();

  return (
    <Link
      to={`/app/workspace/${set.id}`}
      className="group relative transition-all duration-300 hover:-translate-y-[2px]"
      style={{ display: "block", background: "#111120", borderRadius: 14, padding: 20, border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,92,191,0.4)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 flex items-center justify-center text-xl shrink-0" style={{ borderRadius: 10, background: "rgba(124,92,191,0.1)" }}>📚</div>
      </div>
      <h3 className="text-[14px] font-semibold text-foreground leading-[1.35] mb-1.5">{set.title}</h3>
      <p className="text-[12px] text-muted-foreground mb-3">{timeAgo}</p>
      <div className="flex gap-1.5 flex-wrap">
        {tags.map(tag => (
          <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full text-muted-foreground" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>{tag}</span>
        ))}
        {tags.length === 0 && <span className="text-[11px] text-muted-foreground">No content generated yet</span>}
      </div>
    </Link>
  );
};

/* ── Onboarding Stepper ── */
const OnboardingStepper = () => {
  const steps = [
    { num: 1, label: "Upload", active: true },
    { num: 2, label: "Generate", active: false },
    { num: 3, label: "Study", active: false },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{step.num}</div>
              <span className={`text-xs font-medium ${step.active ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div className="w-12 h-[2px] bg-border -mt-5" />}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-5">Start with step 1 — upload any PDF or paste your notes.</p>
      <Link
        to="/app/workspace/new"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
        style={{ background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(173 80% 40%))" }}
      >
        Upload now <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default Dashboard;
