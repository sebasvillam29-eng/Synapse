import { useEffect, useRef } from "react";
import { useLang } from "@/hooks/useLang";

const features = [
  { emoji: "🃏", gradFrom: "#5b3fa8", gradTo: "#7c5cbf", titleKey: "feat.1.title", descKey: "feat.1.desc", badgeKey: "feat.1.badge" },
  { emoji: "🔄", gradFrom: "#1e7a6e", gradTo: "#2dd4bf", titleKey: "feat.2.title", descKey: "feat.2.desc", badgeKey: "feat.2.badge" },
  { emoji: "📊", gradFrom: "#8b4513", gradTo: "#d4702d", titleKey: "feat.3.title", descKey: "feat.3.desc", badgeKey: "feat.3.badge" },
  { emoji: "📄", gradFrom: "#5b3fa8", gradTo: "#7c5cbf", titleKey: "feat.4.title", descKey: "feat.4.desc", badgeKey: "feat.4.badge" },
  { emoji: "⚡", gradFrom: "#1e7a6e", gradTo: "#2dd4bf", titleKey: "feat.5.title", descKey: "feat.5.desc", badgeKey: "feat.5.badge" },
  { emoji: "⏱", gradFrom: "#8b4513", gradTo: "#d4702d", titleKey: "feat.6.title", descKey: "feat.6.desc", badgeKey: "feat.6.badge" },
];

const FeaturesGrid = () => {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="features" className="px-6 scroll-reveal" ref={ref} style={{ backgroundColor: "#0f0f18", padding: "100px 24px" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.12em] uppercase mb-4" style={{ color: "rgba(232,232,240,0.4)" }}>{t("feat.label")}</p>
          <h2 className="font-serif-display" style={{ fontSize: "clamp(36px, 4vw, 52px)" }}>
            <span className="text-white">{t("feat.title")}</span>
            <span className="text-gradient">{t("feat.titleGrad")}</span>
          </h2>
        </div>

        {/* Grid */}
        <div
          className="rounded-[20px] overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="grid md:grid-cols-3" style={{ gap: "1px" }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative overflow-hidden transition-colors duration-300 cursor-pointer"
                style={{ backgroundColor: "#12121e", padding: "32px 28px" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a1a2e")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#12121e")}
              >
                {/* Shine effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
                    animation: "card-shine 0.8s ease forwards",
                    animationPlayState: "paused",
                  }}
                />

                {/* Icon */}
                <div
                  className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-xl mb-5"
                  style={{ background: `linear-gradient(135deg, ${f.gradFrom}, ${f.gradTo})` }}
                >
                  {f.emoji}
                </div>

                <h3 className="text-[18px] font-bold text-white mb-3">{t(f.titleKey)}</h3>
                <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(232,232,240,0.45)" }}>{t(f.descKey)}</p>

                {/* Hover badge */}
                <div
                  className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  style={{ backgroundColor: "rgba(124,92,191,0.15)", border: "1px solid rgba(124,92,191,0.3)", color: "#9d7fe0" }}
                >
                  {t(f.badgeKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
