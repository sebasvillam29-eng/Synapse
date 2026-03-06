import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const HowItWorks = () => {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Auto-cycle
  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % 4), 3000);
    return () => clearInterval(timer);
  }, []);

  // Scroll reveal
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
    <section id="process" className="scroll-reveal relative" ref={ref} style={{ backgroundColor: "#0a0a0f", padding: "100px 24px" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header — left aligned */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.12em] uppercase mb-3" style={{ color: "rgba(232,232,240,0.4)" }}>{t("proc.label")}</p>
          <h2 className="font-serif-display text-white" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>{t("proc.title")}</h2>
          <p className="text-[15px] mt-3" style={{ color: "rgba(232,232,240,0.45)" }}>{t("proc.sub")}</p>
        </div>

        {/* Grid */}
        <div className="relative">
          <div className="grid md:grid-cols-4 relative">
            {steps.map((s, i) => (
              <div key={i} className="relative" style={{ padding: "40px 32px" }}>
                {/* Vertical divider */}
                {i > 0 && (
                  <div
                    className="hidden md:block absolute left-0 top-[20%] bottom-[20%]"
                    style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.12)" }}
                  />
                )}

                {/* Number circle */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-all duration-400"
                  style={{
                    border: `2px solid ${i === active ? "#9d7fe0" : "rgba(124,92,191,0.3)"}`,
                    backgroundColor: i === active ? "rgba(124,92,191,0.15)" : "transparent",
                    opacity: i === active ? 1 : 0.55,
                  }}
                >
                  <span
                    className="text-[18px] font-bold transition-colors duration-400"
                    style={{ color: i === active ? "#9d7fe0" : "rgba(232,232,240,0.4)" }}
                  >
                    {i + 1}
                  </span>
                </div>

                <h3
                  className="text-[20px] font-bold mb-3.5 transition-opacity duration-400"
                  style={{ color: "#fff", lineHeight: 1.3, opacity: i === active ? 1 : 0.55 }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-[14px] leading-[1.7] transition-opacity duration-400"
                  style={{ color: "rgba(232,232,240,0.45)", opacity: i === active ? 1 : 0.55 }}
                >
                  {s.desc}
                </p>

                {/* CTA on step 4 */}
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

          {/* Side nav dots */}
          <div className="hidden lg:flex flex-col items-center gap-2 absolute -right-12 top-1/2 -translate-y-1/2">
            <button onClick={() => setActive((a) => Math.max(0, a - 1))} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
              <ChevronUp size={14} style={{ color: "rgba(232,232,240,0.4)" }} />
            </button>
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all duration-400"
                style={{
                  width: i === active ? "10px" : "8px",
                  height: i === active ? "10px" : "8px",
                  backgroundColor: i === active ? "#9d7fe0" : "rgba(255,255,255,0.12)",
                  transform: i === active ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
            <button onClick={() => setActive((a) => Math.min(3, a + 1))} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
              <ChevronDown size={14} style={{ color: "rgba(232,232,240,0.4)" }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
