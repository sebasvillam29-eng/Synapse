import { useEffect, useRef } from "react";
import { useLang } from "@/hooks/useLang";

const HowItWorks = () => {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const steps = [
    { title: t("proc.1.title"), desc: t("proc.1.desc") },
    { title: t("proc.2.title"), desc: t("proc.2.desc") },
    { title: t("proc.3.title"), desc: t("proc.3.desc") },
    { title: t("proc.4.title"), desc: t("proc.4.desc") },
  ];

  return (
    <section id="process" className="scroll-reveal" ref={ref} style={{ backgroundColor: "#0a0a0f", padding: "100px 24px" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header — left aligned */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.12em] uppercase mb-3" style={{ color: "rgba(232,232,240,0.4)" }}>{t("proc.label")}</p>
          <h2 className="font-serif-display text-white" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>{t("proc.title")}</h2>
          <p className="text-[15px] mt-3" style={{ color: "rgba(232,232,240,0.45)" }}>{t("proc.sub")}</p>
        </div>

        {/* Grid — no animation, all visible */}
        <div className="grid md:grid-cols-4 relative">
          {steps.map((s, i) => (
            <div key={i} className="relative" style={{ padding: "40px 32px" }}>
              {/* Vertical divider */}
              {i > 0 && (
                <div className="hidden md:block absolute left-0 top-[20%] bottom-[20%]" style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.12)" }} />
              )}

              {/* Number circle */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                style={{ border: "2px solid #9d7fe0", backgroundColor: "rgba(124,92,191,0.15)" }}
              >
                <span className="text-[18px] font-bold" style={{ color: "#9d7fe0" }}>{i + 1}</span>
              </div>

              <h3 className="text-[20px] font-bold mb-3.5 text-white" style={{ lineHeight: 1.3 }}>{s.title}</h3>
              <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(232,232,240,0.45)" }}>{s.desc}</p>

              {i === 3 && (
                <a
                  href="#pricing"
                  className="inline-block mt-5 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-300 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #7c5cbf, #9d7fe0)" }}
                >
                  {t("proc.cta")}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
