import { useCountUp } from "@/hooks/useCountUp";
import { Link } from "react-router-dom";
import { BookOpen, Layers, Brain, Flame, Upload, FileText, MessageSquare } from "lucide-react";

const stats = [
  { label: "Notes Processed", value: 24, icon: BookOpen, suffix: "" },
  { label: "Flashcards Created", value: 186, icon: Layers, suffix: "" },
  { label: "Avg Quiz Score", value: 87, icon: Brain, suffix: "%" },
  { label: "Day Streak", value: 7, icon: Flame, suffix: "🔥" },
];

const recentSets = [
  { emoji: "📚", title: "Organic Chemistry — Ch. 4", meta: "18 flashcards · last studied 2h ago", mastery: 89, tags: ["Flashcards", "Quiz", "Summary"] },
  { emoji: "🧬", title: "Molecular Biology — Midterm", meta: "32 flashcards · last studied 5h ago", mastery: 72, tags: ["Flashcards", "Quiz"] },
  { emoji: "⚖️", title: "Constitutional Law — Week 6", meta: "8 flashcards · last studied 1d ago", mastery: 45, tags: ["Summary"] },
];

const streakWeeks = [
  [3, 2, 0, 1, 3, 2, 1],
  [0, 1, 2, 3, 1, 0, 2],
  [2, 3, 1, 2, 3, 3, 0],
  [1, 0, 2, 3, 0, 0, 0],
];

const Dashboard = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{greeting}, Sebastian 👋</h1>
        <p className="text-muted-foreground mt-1">You have {recentSets.length} study sets. Keep the streak going!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} delay={i * 100} />
        ))}
      </div>

      {/* Recent Sets */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Study Sets</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {recentSets.map((set, i) => (
            <Link
              to={`/app/workspace/${i + 1}`}
              key={i}
              className="rounded-2xl border border-border bg-card p-5 group hover:-translate-y-[3px] hover:glow-primary transition-all duration-300 active:scale-[0.97] animate-fade-in"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{set.emoji}</span>
                  <h3 className="text-sm font-semibold text-foreground">{set.title}</h3>
                </div>
                <ProgressRing value={set.mastery} />
              </div>
              <p className="text-xs text-muted-foreground mb-3">{set.meta}</p>
              <div className="flex gap-2 flex-wrap">
                {set.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]">
            <Upload className="w-5 h-5" /> Upload PDF
          </button>
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]">
            <FileText className="w-5 h-5" /> Paste Notes
          </button>
          <Link to="/app/chat" className="flex items-center justify-center gap-2 p-4 rounded-xl font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(173 80% 40%))" }}>
            <MessageSquare className="w-5 h-5" /> Ask AI Tutor
          </Link>
        </div>
      </div>

      {/* Streak Calendar */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Study Streak</h2>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex gap-1.5 justify-center">
            {streakWeeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1.5">
                {week.map((level, di) => (
                  <div
                    key={di}
                    className="w-4 h-4 rounded-sm transition-colors duration-300"
                    style={{
                      backgroundColor: level === 0 ? "hsl(222 30% 14%)" :
                        level === 1 ? "hsl(262 83% 58% / 0.25)" :
                        level === 2 ? "hsl(262 83% 58% / 0.5)" :
                        "hsl(262 83% 58% / 0.85)"
                    }}
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

const StatCard = ({ label, value, icon: Icon, suffix, delay }: { label: string; value: number; icon: any; suffix: string; delay: number }) => {
  const count = useCountUp(value, 1000);
  const isStreak = label.includes("Streak");

  return (
    <div
      className="rounded-xl border border-border bg-card p-5 animate-fade-in hover:-translate-y-[2px] hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 text-primary ${isStreak ? "animate-pulse" : ""}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{count}{suffix}</p>
    </div>
  );
};

const ProgressRing = ({ value }: { value: number }) => (
  <div className="w-10 h-10 relative shrink-0">
    <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
      <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(222 30% 16%)" strokeWidth="3" />
      <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(262 83% 58%)" strokeWidth="3"
        strokeDasharray={`${value * 0.942} 100`} strokeLinecap="round"
        className="transition-all duration-1000"
      />
    </svg>
    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">{value}%</span>
  </div>
);

export default Dashboard;
