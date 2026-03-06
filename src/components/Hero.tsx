import { useState, useEffect } from "react";
import { ArrowRight, Brain, FileText, Sparkles, BookOpen, Layers, CheckCircle } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const phases = [
  { key: "phase1", icon: FileText, duration: 2000 },
  { key: "phase2", icon: Sparkles, duration: 3000 },
  { key: "phase3", icon: CheckCircle, duration: 3000 },
];

const Hero = () => {
  const { t } = useLang();
  const [phase, setPhase] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % 3);
      setStatusIdx(0);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Cycle status messages during phase 1 (processing)
  useEffect(() => {
    if (phase === 1) {
      const si = setInterval(() => setStatusIdx((i) => (i + 1) % 3), 800);
      return () => clearInterval(si);
    }
  }, [phase]);

  const statusMessages = [t("hero.analyzing"), t("hero.generating"), t("hero.optimizing")];

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground mb-8 animate-fade-in">
            <Brain className="w-4 h-4 text-primary" />
            {t("hero.badge")}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="block animate-fade-in">{t("hero.title1")}</span>
            <span className="block text-gradient animate-fade-in" style={{ animationDelay: "0.15s", animationFillMode: "both" }}>
              {t("hero.title2")}
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.45s", animationFillMode: "both" }}>
            <a
              href="#pricing"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("hero.cta1")}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#demo"
              className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("hero.cta2")}
            </a>
          </div>
        </div>

        {/* Animated PDF → Study Tools workflow */}
        <div className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 glow-primary">
            {/* Phase indicators */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
              {phases.map((p, i) => {
                const Icon = p.icon;
                const isActive = phase === i;
                const isDone = phase > i;
                return (
                  <div key={i} className="flex items-center gap-2 sm:gap-4">
                    <div
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-500 ${
                        isActive
                          ? "bg-primary/20 text-primary border border-primary/30 scale-105"
                          : isDone
                          ? "bg-secondary/20 text-secondary border border-secondary/30"
                          : "bg-muted/30 text-muted-foreground border border-border"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{t(`hero.${p.key}`)}</span>
                    </div>
                    {i < 2 && (
                      <div className={`w-8 sm:w-12 h-0.5 transition-colors duration-500 ${
                        phase > i ? "bg-secondary" : "bg-border"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Phase content */}
            <div className="min-h-[200px] relative">
              {/* Phase 0: Upload PDF */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                phase === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              }`}>
                <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-float">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-semibold mb-1">Organic_Chemistry_Ch4.pdf</p>
                    <p className="text-sm text-muted-foreground">24 pages · 12,400 words</p>
                  </div>
                  <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary animate-[loading_2s_ease-in-out_infinite]" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>

              {/* Phase 1: AI Processing */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                phase === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              }`}>
                <div className="rounded-xl border border-border bg-muted/20 p-8 flex flex-col items-center justify-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary ai-dot-1" />
                      <span className="w-2 h-2 rounded-full bg-primary ai-dot-2" />
                      <span className="w-2 h-2 rounded-full bg-primary ai-dot-3" />
                    </div>
                    <span key={statusIdx} className="text-sm text-muted-foreground animate-fade-in">
                      {statusMessages[statusIdx]}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-64 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-[shimmer_1.5s_linear_infinite]" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>

              {/* Phase 2: Results */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                phase === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: BookOpen, label: t("hero.summariesReady"), color: "primary", delay: "0ms" },
                    { icon: Layers, label: t("hero.flashcardsReady"), color: "secondary", delay: "150ms" },
                    { icon: Brain, label: t("hero.quizReady"), color: "primary", delay: "300ms" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-card p-5 flex flex-col items-center gap-3 text-center animate-scale-in"
                      style={{ animationDelay: item.delay, animationFillMode: "both" }}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center`}>
                        <item.icon className={`w-6 h-6 text-${item.color}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
