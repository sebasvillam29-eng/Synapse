import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#7c5cbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 20V8M16 8L11 13M16 8L21 13" />
    <path d="M6 22V25C6 26.1 6.9 27 8 27H24C25.1 27 26 26.1 26 25V22" />
  </svg>
);

const Hero = () => {
  const { t } = useLang();
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [outputsShown, setOutputsShown] = useState(0);
  const [cycle, setCycle] = useState(0);

  // Master timer: cycles phases
  useEffect(() => {
    setPhase(0);
    setProgress(0);
    setStatusIdx(0);
    setOutputsShown(0);

    const t1 = setTimeout(() => setPhase(1), 1000);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setPhase(3), 5000);
    const t4 = setTimeout(() => setCycle((c) => c + 1), 8000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [cycle]);

  // Progress bar for phase 2
  useEffect(() => {
    if (phase !== 2) return;
    setProgress(0);
    const start = Date.now();
    const dur = 2500;
    let raf: number;
    const frame = () => {
      const pct = Math.min(100, ((Date.now() - start) / dur) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Status cycling for phase 2
  useEffect(() => {
    if (phase !== 2) return;
    setStatusIdx(0);
    const i = setInterval(() => setStatusIdx((s) => (s + 1) % 4), 700);
    return () => clearInterval(i);
  }, [phase]);

  // Output staggered reveal for phase 3
  useEffect(() => {
    if (phase !== 3) return;
    setOutputsShown(0);
    const timers = [0, 120, 240, 360].map((d, i) =>
      setTimeout(() => setOutputsShown(i + 1), d)
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  const statuses = [t("hero.status1"), t("hero.status2"), t("hero.status3"), t("hero.status4")];
  const outputs = [
    { emoji: "📄", text: t("hero.out1"), color: "#9d7fe0" },
    { emoji: "🃏", text: t("hero.out2"), color: "#2dd4bf" },
    { emoji: "📝", text: t("hero.out3"), color: "#9d7fe0" },
    { emoji: "🎓", text: t("hero.out4"), color: "#2dd4bf" },
  ];

  return (
    <section className="relative pt-[120px] pb-20 px-6 overflow-hidden" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: "rgba(124,92,191,0.08)" }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: "rgba(45,212,191,0.06)" }} />

      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-[13px] mb-8 animate-fade-in" style={{ border: "1px solid rgba(124,92,191,0.35)", backgroundColor: "rgba(124,92,191,0.1)", color: "#9d7fe0" }}>
            {t("hero.badge")}
          </div>

          <h1 className="font-serif-display mb-6" style={{ fontSize: "clamp(42px, 5vw, 65px)", lineHeight: 1.05 }}>
            <span className="block text-white animate-fade-in">{t("hero.h1.1")}</span>
            <span className="block text-white animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>{t("hero.h1.2")}</span>
            <span className="block text-gradient animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>{t("hero.h1.3")}</span>
            <span className="block text-gradient animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>{t("hero.h1.4")}</span>
          </h1>

          <p className="text-[16px] mb-8 max-w-[480px] animate-fade-in" style={{ color: "rgba(232,232,240,0.45)", lineHeight: 1.75, animationDelay: "0.4s", animationFillMode: "both" }}>
            {t("hero.sub")}
          </p>

          <div className="flex flex-wrap gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
            <a href="#tutor" className="px-6 py-[13px] rounded-xl text-white text-sm font-medium transition-all duration-300 hover:opacity-90 active:scale-[0.97]" style={{ background: "linear-gradient(135deg, #7c5cbf, #9d7fe0)", boxShadow: "0 4px 24px rgba(124,92,191,0.35)" }}>
              {t("hero.cta1")}
            </a>
            <a href="#process" className="px-6 py-[13px] rounded-xl text-white text-sm font-medium transition-all duration-300 hover:opacity-80" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
              {t("hero.cta2")}
            </a>
          </div>

          <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
            <Lock size={13} style={{ color: "rgba(232,232,240,0.3)" }} />
            <span style={{ color: "rgba(232,232,240,0.3)", fontSize: "13px" }}>{t("hero.trust")}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative animate-fade-in" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
          <div className="animate-float flex items-start gap-3">
            <div className="flex-1 rounded-2xl overflow-hidden" style={{ backgroundColor: "#13131f", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,92,191,0.15)" }}>
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: "#1a1a2e", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28C840" }} />
                </div>
                <span className="text-xs ml-2 font-mono" style={{ color: "rgba(232,232,240,0.35)" }}>{t("hero.workspace")}</span>
              </div>

              <div className="p-5 min-h-[260px]">
                {phase === 0 && (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-xl py-12 animate-fade-in" style={{ border: "2px dashed rgba(124,92,191,0.4)", backgroundColor: "rgba(124,92,191,0.04)" }}>
                    <UploadIcon />
                    <span className="text-sm" style={{ color: "rgba(232,232,240,0.45)" }}>{t("hero.drop")}</span>
                  </div>
                )}
                {phase === 1 && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2"><span className="text-lg">📄</span><span className="text-sm text-white">Biology_Ch4_Photosynthesis.pdf</span></div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs" style={{ backgroundColor: "rgba(124,92,191,0.15)", color: "#9d7fe0" }}>📄 {t("hero.pdfDetected")}</div>
                  </div>
                )}
                {phase === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2"><span className="text-lg">📄</span><span className="text-sm text-white">Biology_Ch4_Photosynthesis.pdf</span></div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #9d7fe0, #2dd4bf)", transition: "none" }} />
                    </div>
                    <span key={statusIdx} className="text-xs block animate-fade-in" style={{ color: "rgba(232,232,240,0.45)" }}>{statuses[statusIdx]}</span>
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full ai-dot-1" style={{ backgroundColor: "#9d7fe0" }} />
                      <span className="w-1.5 h-1.5 rounded-full ai-dot-2" style={{ backgroundColor: "#9d7fe0" }} />
                      <span className="w-1.5 h-1.5 rounded-full ai-dot-3" style={{ backgroundColor: "#9d7fe0" }} />
                    </div>
                  </div>
                )}
                {phase === 3 && (
                  <div className="space-y-2.5">
                    {outputs.map((o, i) => (
                      <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px]" style={{ backgroundColor: "rgba(124,92,191,0.08)", border: "1px solid rgba(124,92,191,0.2)", opacity: i < outputsShown ? 1 : 0, transform: i < outputsShown ? "translateY(0)" : "translateY(8px)", transition: "all 0.3s ease" }}>
                        <span className="text-base">{o.emoji}</span>
                        <span className="text-sm text-white flex-1">{o.text}</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: o.color }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dots */}
            <div className="hidden lg:flex flex-col items-center gap-2 pt-20">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-full" style={{ width: i === 2 ? "8px" : "6px", height: i === 2 ? "8px" : "6px", backgroundColor: i === 2 ? "#9d7fe0" : "rgba(255,255,255,0.12)", transform: i === 2 ? "scale(1.3)" : "scale(1)", transition: "all 0.4s ease" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
