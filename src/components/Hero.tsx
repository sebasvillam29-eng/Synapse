import { ArrowRight, Brain, Sparkles, BookOpen, Layers } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-24 pb-0 overflow-hidden bg-[#0B0F1A]">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#6D28D9]/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] rounded-full bg-[#3B82F6]/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Urgency badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6D28D9]/30 bg-[#6D28D9]/10 text-sm text-[#C4B5FD]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Early access — Join 2,400+ students
          </div>
        </div>

        {/* Headline */}
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-white mb-6">
            The truly{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]">
              intelligent
            </span>
            <br />
            study companion.
          </h1>

          <p className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your notes and let AI transform them into summaries, flashcards, and quizzes — so you can actually learn.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="px-8 py-3.5 rounded-xl bg-[#7C3AED] text-white font-semibold hover:bg-[#6D28D9] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#7C3AED]/25"
            >
              Start Studying Free
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#demo"
              className="px-8 py-3.5 rounded-xl border border-[#334155] text-[#E2E8F0] font-semibold hover:bg-[#1E293B] transition-all duration-300"
            >
              See Plans
            </a>
          </div>
        </div>

        {/* Dashboard visual — centered like Limitless */}
        <div className="relative mt-16 max-w-5xl mx-auto">
          {/* Glow behind card */}
          <div className="absolute inset-0 -top-8 rounded-3xl bg-gradient-to-b from-[#7C3AED]/20 to-transparent blur-2xl pointer-events-none" />

          <div className="relative rounded-t-2xl border border-[#1E293B] border-b-0 bg-gradient-to-b from-[#111827] to-[#0B0F1A] p-8 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
              <div className="w-3 h-3 rounded-full bg-[#22C55E]/60" />
              <span className="ml-3 text-xs text-[#64748B] font-mono">synapse — dashboard</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard icon={<BookOpen className="w-5 h-5" />} label="Summaries" value="24" color="#7C3AED" />
              <StatCard icon={<Layers className="w-5 h-5" />} label="Flashcards" value="186" color="#3B82F6" />
              <StatCard icon={<Brain className="w-5 h-5" />} label="Quizzes" value="12" color="#7C3AED" />
              <StatCard icon={<Sparkles className="w-5 h-5" />} label="Streak" value="7🔥" color="#F59E0B" />
            </div>

            {/* Mock content rows */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-xl bg-[#1E293B]/50 border border-[#334155]/50 p-4">
                <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center text-lg">📚</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#E2E8F0]">Organic Chemistry — Chapter 4</div>
                  <div className="text-xs text-[#64748B]">18 flashcards · Quiz ready · 89% mastery</div>
                </div>
                <div className="w-10 h-10 relative">
                  <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#1E293B" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#7C3AED" strokeWidth="3"
                      strokeDasharray={`${89 * 0.942} 100`} strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-[#1E293B]/50 border border-[#334155]/50 p-4">
                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center text-lg">🧬</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#E2E8F0]">Molecular Biology — Midterm Review</div>
                  <div className="text-xs text-[#64748B]">32 flashcards · 2 quizzes · 72% mastery</div>
                </div>
                <div className="w-10 h-10 relative">
                  <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#1E293B" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#3B82F6" strokeWidth="3"
                      strokeDasharray={`${72 * 0.942} 100`} strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-[#1E293B]/50 border border-[#334155]/50 p-4 opacity-60">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center text-lg">⚖️</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#E2E8F0]">Constitutional Law — Week 6</div>
                  <div className="text-xs text-[#64748B]">8 flashcards · Summary generated · 45% mastery</div>
                </div>
                <div className="w-10 h-10 relative">
                  <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#1E293B" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#F59E0B" strokeWidth="3"
                      strokeDasharray={`${45 * 0.942} 100`} strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Fade to black at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B0F1A] to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
  <div className="rounded-xl border border-[#334155]/50 bg-[#1E293B]/40 p-4">
    <div className="flex items-center gap-2 mb-1">
      <span style={{ color }}>{icon}</span>
      <span className="text-xs text-[#64748B]">{label}</span>
    </div>
    <p className="text-xl font-bold text-[#E2E8F0]">{value}</p>
  </div>
);

export default Hero;
