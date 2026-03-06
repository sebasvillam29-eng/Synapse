import { useEffect, useRef } from "react";
import { useLang } from "@/hooks/useLang";

const CheckCircle = () => (
  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(45,212,191,0.15)" }}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>
);

const PricingSection = () => {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const plans = [
    {
      label: t("price.free.label"), price: t("price.free.price"), period: t("price.free.period"),
      sub: t("price.free.sub"), highlight: false,
      features: [t("price.free.f1"), t("price.free.f2"), t("price.free.f3"), t("price.free.f4")],
      cta: t("price.free.cta"),
    },
    {
      label: t("price.pro.label"), price: t("price.pro.price"), period: t("price.pro.period"),
      sub: t("price.pro.sub"), highlight: true, badge: t("price.pro.badge"),
      features: [t("price.pro.f1"), t("price.pro.f2"), t("price.pro.f3"), t("price.pro.f4"), t("price.pro.f5"), t("price.pro.f6")],
      cta: t("price.pro.cta"),
    },
    {
      label: t("price.team.label"), price: t("price.team.price"), period: t("price.team.period"),
      sub: t("price.team.sub"), highlight: false,
      features: [t("price.team.f1"), t("price.team.f2"), t("price.team.f3"), t("price.team.f4"), t("price.team.f5")],
      cta: t("price.team.cta"),
    },
  ];

  return (
    <section id="pricing" className="scroll-reveal" ref={ref} style={{ backgroundColor: "#0a0a0f", padding: "100px 24px" }}>
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.14em] uppercase mb-4" style={{ color: "#9d7fe0" }}>{t("price.label")}</p>
          <h2 className="font-serif-display" style={{ fontSize: "clamp(40px, 5vw, 60px)" }}>
            <span className="text-white">{t("price.title1")}</span>
            <span className="text-gradient">{t("price.titleGrad")}</span>
            <span className="text-white">{t("price.title2")}</span>
          </h2>
          <p className="text-[15px] mt-3" style={{ color: "rgba(232,232,240,0.45)" }}>{t("price.sub")}</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((p, i) => (
            <div
              key={i}
              className="relative rounded-[20px] flex flex-col"
              style={{
                backgroundColor: "#12121e",
                border: p.highlight ? "1px solid rgba(124,92,191,0.5)" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: p.highlight ? "0 0 60px rgba(124,92,191,0.15)" : "none",
                padding: "36px 32px",
                transform: p.highlight ? "scale(1.03)" : "scale(1)",
              }}
            >
              {/* Badge */}
              {p.highlight && p.badge && (
                <span
                  className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.08em] text-white"
                  style={{ background: "linear-gradient(135deg, #1e7a6e, #2dd4bf)" }}
                >
                  {p.badge}
                </span>
              )}

              <p className="text-[11px] tracking-[0.1em] uppercase mb-3" style={{ color: "rgba(232,232,240,0.4)" }}>{p.label}</p>

              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="font-serif-display" style={{ fontSize: "52px", color: p.highlight ? "#9d7fe0" : "#fff" }}>{p.price}</span>
                <span className="text-[14px]" style={{ color: "rgba(232,232,240,0.45)" }}>{p.period}</span>
              </div>

              <p className="text-[13px] mb-7" style={{ color: "rgba(232,232,240,0.4)" }}>{p.sub}</p>

              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-white">
                    <CheckCircle />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-[13px] rounded-xl text-sm font-medium transition-all duration-300 hover:opacity-90"
                style={{
                  background: p.highlight ? "linear-gradient(135deg, #7c5cbf, #9d7fe0)" : "transparent",
                  border: p.highlight ? "none" : "1px solid rgba(255,255,255,0.12)",
                  color: "#fff",
                }}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
