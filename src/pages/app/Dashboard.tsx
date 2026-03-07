import { useCountUp } from "@/hooks/useCountUp";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const recentSets = [
  { emoji: "🧬", title: "Biology Ch.4 — Photosynthesis", meta: "12 flashcards · 1 quiz · 2h ago", mastery: 73, tags: ["Flashcards", "Quiz", "Summary"], needsReview: false },
  { emoji: "⚖️", title: "Contract Law — Week 3", meta: "8 flashcards · 1 quiz · 5h ago", mastery: 45, tags: ["Flashcards", "Quiz"], needsReview: true },
  { emoji: "⚙️", title: "Thermodynamics", meta: "15 flashcards · 2 quizzes · 1d ago", mastery: 91, tags: ["Flashcards", "Quiz", "Summary"], needsReview: false },
];

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
        <p className="text-muted-foreground text-[15px] mt-1">
          You have 3 study sets.{" "}
          <span style={{ color: "rgba(251,191,36,0.8)" }}>Contract Law needs attention.</span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
        <StatCard icon="📄" label="Notes processed" value={12} />
        <StatCard icon="🃏" label="Flashcards created" value={86} badge="+12 this week" />
        <StatCard icon="✅" label="Avg quiz score" value={74} suffix="%" sub="↑ improving" subColor="rgba(45,212,191,0.85)" />
        <StatCard icon="🕐" label="Last active" staticValue="2h ago" sub="Contract Law needs review" subColor="rgba(251,191,36,0.7)" />
      </div>

      {/* Study Set Cards */}
      <div className="mt-12 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
        {recentSets.length === 0 ? (
          <OnboardingStepper />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent study sets</h2>
              <Link to="/app/library" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-3.5">
              {recentSets.map((set, i) => (
                <StudySetCard key={i} set={set} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-10 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
        <div className="flex flex-wrap gap-2.5">
          <button
            className="flex items-center gap-2 text-sm transition-all duration-200"
            style={{
              padding: "11px 22px",
              borderRadius: 10,
              border: "1.5px dashed rgba(124,92,191,0.35)",
              background: "rgba(124,92,191,0.04)",
              color: "#9d7fe0",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,92,191,0.1)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(124,92,191,0.04)")}
          >
            📄 Upload PDF
          </button>
          <button
            className="flex items-center gap-2 text-sm text-muted-foreground transition-all duration-200 hover:text-foreground"
            style={{
              padding: "11px 22px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            📋 Paste Notes
          </button>
          <Link
            to="/app/chat"
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              padding: "11px 22px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #7c5cbf, #5b3fa8)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(124,92,191,0.3)",
            }}
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
    <div
      className="transition-all duration-300"
      style={{
        background: "#111120",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "18px 20px",
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[14px]">{icon}</span>
        <span className="text-[12px] text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-[28px] text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
          {staticValue ?? `${count}${suffix || ""}`}
        </p>
        {badge && (
          <span
            className="text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "rgba(45,212,191,0.1)",
              border: "1px solid rgba(45,212,191,0.3)",
              color: "rgba(45,212,191,0.9)",
            }}
          >
            {badge}
          </span>
        )}
      </div>
      {sub && (
        <p className="text-[12px] mt-1" style={{ color: subColor }}>{sub}</p>
      )}
    </div>
  );
};

/* ── Study Set Card ── */
const StudySetCard = ({ set, index }: { set: typeof recentSets[0]; index: number }) => {
  const ringColor = set.mastery > 80 ? "#2dd4bf" : set.mastery > 55 ? "#9d7fe0" : "rgba(251,191,36,0.85)";

  return (
    <Link
      to={`/app/workspace/${index + 1}`}
      className="group relative transition-all duration-300 hover:-translate-y-[2px]"
      style={{
        display: "block",
        background: "#111120",
        borderRadius: 14,
        padding: 20,
        border: set.needsReview ? "1px solid rgba(251,191,36,0.2)" : "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={e => { if (!set.needsReview) e.currentTarget.style.borderColor = "rgba(124,92,191,0.4)"; }}
      onMouseLeave={e => { if (!set.needsReview) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
    >
      {set.needsReview && (
        <span
          className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            color: "rgba(251,191,36,0.9)",
          }}
        >
          📌 REVIEW
        </span>
      )}

      {/* Top row: emoji + ring */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 flex items-center justify-center text-xl shrink-0"
          style={{ borderRadius: 10, background: "rgba(124,92,191,0.1)" }}
        >
          {set.emoji}
        </div>
        <ProgressRing value={set.mastery} color={ringColor} />
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-semibold text-foreground leading-[1.35] mb-1.5">{set.title}</h3>

      {/* Meta */}
      <p className="text-[12px] text-muted-foreground mb-3">{set.meta}</p>

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap">
        {set.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-2 py-0.5 rounded-full text-muted-foreground"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
};

/* ── Progress Ring ── */
const ProgressRing = ({ value, color }: { value: number; color: string }) => {
  const r = 20;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="w-[48px] h-[48px] relative shrink-0">
      <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={r} fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">{value}%</span>
    </div>
  );
};

/* ── Onboarding Stepper (shown when 0 study sets) ── */
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
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {step.num}
              </div>
              <span className={`text-xs font-medium ${step.active ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
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
