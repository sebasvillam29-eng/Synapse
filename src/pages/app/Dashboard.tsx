import { useCountUp } from "@/hooks/useCountUp";
import { Link } from "react-router-dom";
import { FileText, Layers, Brain, Flame, Upload, ClipboardList, MessageSquare, TrendingUp } from "lucide-react";

const stats = [
  { label: "Notes processed", value: 12, icon: FileText, suffix: "", badge: null },
  { label: "Flashcards created", value: 86, icon: Layers, suffix: "", badge: "+12 this week" },
  { label: "Avg quiz score", value: 74, icon: Brain, suffix: "%", badge: "↑" },
  { label: "Day streak", value: 5, icon: Flame, suffix: "", isStreak: true },
];

const recentSets = [
  { emoji: "🧬", color: "hsl(142 60% 45%)", title: "Biology Ch.4 — Photosynthesis", meta: "12 flashcards · 1 quiz · 2h ago", mastery: 73, tags: ["Flashcards", "Quiz", "Summary"] },
  { emoji: "⚖️", color: "hsl(220 60% 50%)", title: "Contract Law — Week 3", meta: "8 flashcards · 1 quiz · 5h ago", mastery: 45, tags: ["Flashcards", "Quiz"] },
  { emoji: "⚙️", color: "hsl(25 80% 50%)", title: "Thermodynamics", meta: "15 flashcards · 2 quizzes · 1d ago", mastery: 91, tags: ["Flashcards", "Quiz", "Summary"] },
];

// Generate 28 columns × 4 rows streak data
const generateStreak = () => {
  const data: number[][] = [];
  for (let row = 0; row < 4; row++) {
    const week: number[] = [];
    for (let col = 0; col < 28; col++) {
      week.push(Math.random() < 0.6 ? Math.ceil(Math.random() * 3) : 0);
    }
    data.push(week);
  }
  return data;
};
const streakData = generateStreak();

const opacityMap: Record<number, string> = {
  0: "hsl(var(--muted))",
  1: "hsl(262 83% 58% / 0.2)",
  2: "hsl(262 83% 58% / 0.5)",
  3: "hsl(262 83% 58% / 0.85)",
};

const Dashboard = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Greeting */}
      <div className="animate-fade-in">
        <h1 className="text-[32px] text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
          {greeting}, Sebastian 👋
        </h1>
        <p className="text-muted-foreground text-[15px] mt-1">You have 3 study sets.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} delay={i * 80} />
        ))}
      </div>

      {/* Recent Study Sets */}
      <div className="mt-12 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent study sets</h2>
          <Link to="/app/library" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {recentSets.map((set, i) => (
            <Link
              to={`/app/workspace/${i + 1}`}
              key={i}
              className="rounded-2xl border border-border bg-card p-6 group hover:-translate-y-[3px] hover:shadow-[0_8px_30px_-10px_hsl(262_83%_58%/0.25)] transition-all duration-300 active:scale-[0.97]"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: set.color + "20" }}>
                  {set.emoji}
                </div>
                <h3 className="text-sm font-semibold text-foreground leading-tight flex-1 min-w-0">{set.title}</h3>
                <ProgressRing value={set.mastery} />
              </div>
              <p className="text-[13px] text-muted-foreground mb-3">{set.meta}</p>
              <div className="flex gap-2 flex-wrap">
                {set.tags.map((tag) => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Start Something New */}
      <div className="mt-12 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Start something new</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-primary/30 text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all duration-200">
            <Upload className="w-5 h-5" /> Upload PDF
          </button>
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200">
            <ClipboardList className="w-5 h-5" /> Paste Notes
          </button>
          <Link
            to="/app/chat"
            className="flex items-center justify-center gap-2 p-4 rounded-xl font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(173 80% 40%))" }}
          >
            <MessageSquare className="w-5 h-5" /> Ask AI Tutor →
          </Link>
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="mt-12 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Your study streak this month</h2>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex gap-[3px] justify-center">
            {Array.from({ length: 28 }, (_, col) => (
              <div key={col} className="flex flex-col gap-[3px]">
                {streakData.map((row, ri) => (
                  <div
                    key={ri}
                    className="w-[10px] h-[10px] rounded-sm"
                    style={{ backgroundColor: opacityMap[row[col]] }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ label, value, icon: Icon, suffix, badge, isStreak, delay }: {
  label: string; value: number; icon: any; suffix: string; badge?: string | null; isStreak?: boolean; delay: number;
}) => {
  const count = useCountUp(value, 1000);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 hover:-translate-y-[2px] hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 text-primary ${isStreak ? "animate-pulse" : ""}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-foreground">{count}{suffix}</p>
        {badge && badge === "↑" ? (
          <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: "hsl(142 70% 50%)" }}>
            <TrendingUp className="w-3 h-3" /> {badge}
          </span>
        ) : badge ? (
          <span className="text-[11px] px-1.5 py-0.5 rounded-full font-medium bg-secondary/20 text-secondary">{badge}</span>
        ) : null}
        {isStreak && <span className="text-lg animate-pulse">🔥</span>}
      </div>
    </div>
  );
};

/* ── Progress Ring ── */
const ProgressRing = ({ value }: { value: number }) => {
  const circumference = 2 * Math.PI * 24;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="w-[60px] h-[60px] relative shrink-0">
      <svg viewBox="0 0 56 56" className="w-[60px] h-[60px] -rotate-90">
        <circle cx="28" cy="28" r="24" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
        <circle
          cx="28" cy="28" r="24" fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">{value}%</span>
    </div>
  );
};

export default Dashboard;
