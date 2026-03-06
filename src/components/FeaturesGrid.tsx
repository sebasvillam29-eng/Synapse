import { useState, useEffect, useRef } from "react";
import { Layers, RefreshCw, BarChart3, FileText, Zap, Clock, Check, X } from "lucide-react";
import { useLang } from "@/hooks/useLang";

/* ─── Mini interactive demos (only rendered when hovered) ─── */

const FlashcardDemo = () => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="mt-5">
      <div className="perspective-1000 w-full h-[120px] cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className="relative w-full h-full preserve-3d transition-all duration-500" style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
          <div className="absolute inset-0 backface-hidden rounded-xl flex items-center justify-center p-4" style={{ backgroundColor: "rgba(124,92,191,0.12)", border: "1px solid rgba(124,92,191,0.25)" }}>
            <p className="text-sm text-white text-center font-medium">What is the powerhouse of the cell?</p>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl flex flex-col items-center justify-center p-4 gap-2" style={{ backgroundColor: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)" }}>
            <p className="text-sm text-white text-center font-semibold">Mitochondria</p>
            <p className="text-[11px] text-center" style={{ color: "rgba(232,232,240,0.45)" }}>It produces ATP through cellular respiration</p>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-center mt-2" style={{ color: "rgba(232,232,240,0.3)" }}>Click to flip</p>
    </div>
  );
};

const QuizDemo = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const options = [
    { text: "Nucleus", correct: false },
    { text: "Mitochondria", correct: true },
    { text: "Ribosome", correct: false },
  ];
  return (
    <div className="mt-5 space-y-2">
      <p className="text-xs font-medium text-white mb-2">Where does ATP production occur?</p>
      {options.map((o, i) => {
        let bg = "rgba(255,255,255,0.04)";
        let border = "rgba(255,255,255,0.08)";
        if (selected !== null) {
          if (o.correct) { bg = "rgba(45,212,191,0.12)"; border = "rgba(45,212,191,0.3)"; }
          else if (selected === i) { bg = "rgba(239,68,68,0.12)"; border = "rgba(239,68,68,0.3)"; }
        }
        return (
          <button key={i} onClick={() => selected === null && setSelected(i)} className="w-full text-left px-3 py-2 rounded-lg text-xs text-white flex items-center justify-between transition-all duration-300" style={{ backgroundColor: bg, border: `1px solid ${border}` }}>
            <span>{o.text}</span>
            {selected !== null && o.correct && <Check size={12} style={{ color: "#2dd4bf" }} />}
            {selected !== null && selected === i && !o.correct && <X size={12} style={{ color: "#ef4444" }} />}
          </button>
        );
      })}
      {selected !== null && <button onClick={() => setSelected(null)} className="text-[10px]" style={{ color: "rgba(232,232,240,0.4)" }}>Reset</button>}
    </div>
  );
};

const ProgressDemo = () => (
  <div className="mt-5 space-y-3">
    {[{ subj: "Biology", pct: 87, color: "#9d7fe0" }, { subj: "Chemistry", pct: 62, color: "#2dd4bf" }, { subj: "Physics", pct: 45, color: "#d4702d" }].map((s, i) => (
      <div key={i}>
        <div className="flex justify-between text-[11px] mb-1"><span className="text-white">{s.subj}</span><span style={{ color: s.color }}>{s.pct}%</span></div>
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
        </div>
      </div>
    ))}
  </div>
);

const ImportDemo = () => (
  <div className="mt-5 space-y-2">
    {[{ name: "Lecture_Notes.pdf", size: "2.4 MB" }, { name: "Chapter_7.docx", size: "890 KB" }].map((f, i) => (
      <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <FileText size={14} style={{ color: "#9d7fe0" }} />
        <span className="text-xs text-white flex-1">{f.name}</span>
        <span className="text-[10px]" style={{ color: "rgba(232,232,240,0.3)" }}>{f.size}</span>
        <Check size={12} style={{ color: "#2dd4bf" }} />
      </div>
    ))}
  </div>
);

const RepetitionDemo = () => (
  <div className="mt-5 flex items-end gap-1">
    {[1, 2, 4, 7, 14, 30].map((d, i) => (
      <div key={i} className="flex flex-col items-center gap-1 flex-1">
        <div className="w-full rounded-sm transition-all duration-500" style={{ height: `${12 + i * 8}px`, backgroundColor: i < 4 ? "#9d7fe0" : "rgba(124,92,191,0.25)" }} />
        <span className="text-[8px]" style={{ color: "rgba(232,232,240,0.3)" }}>D{d}</span>
      </div>
    ))}
  </div>
);

const ScheduleDemo = () => (
  <div className="mt-5 space-y-2">
    {[{ time: "9:00 AM", task: "Biology Flashcards", tag: "Review" }, { time: "2:00 PM", task: "Chem Quiz", tag: "Practice" }].map((s, i) => (
      <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <Clock size={12} style={{ color: "rgba(232,232,240,0.3)" }} />
        <span className="text-[10px]" style={{ color: "rgba(232,232,240,0.4)" }}>{s.time}</span>
        <span className="text-xs text-white flex-1">{s.task}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(124,92,191,0.15)", color: "#9d7fe0" }}>{s.tag}</span>
      </div>
    ))}
  </div>
);

/* ─── Feature card wrapper that shows demo on hover ─── */

const FeatureCard = ({ Icon, gradFrom, gradTo, titleKey, descKey, badgeKey, Demo, t }: any) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: hovered ? "#1a1a2e" : "#12121e", padding: "32px 28px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-5" style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
        <Icon size={22} className="text-white" />
      </div>

      <h3 className="text-[18px] font-bold text-white mb-3">{t(titleKey)}</h3>
      <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(232,232,240,0.45)" }}>{t(descKey)}</p>

      {/* Demo: only visible on hover with smooth transition */}
      <div
        className="transition-all duration-400 overflow-hidden"
        style={{
          maxHeight: hovered ? "300px" : "0px",
          opacity: hovered ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.3s ease",
        }}
      >
        {Demo && <Demo />}
      </div>

      {/* Hover badge */}
      <div
        className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-300"
        style={{
          backgroundColor: "rgba(124,92,191,0.15)",
          border: "1px solid rgba(124,92,191,0.3)",
          color: "#9d7fe0",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(6px)",
        }}
      >
        {t(badgeKey)}
      </div>
    </div>
  );
};

/* ─── Features data ─── */

const features = [
  { Icon: Layers, gradFrom: "#5b3fa8", gradTo: "#7c5cbf", titleKey: "feat.1.title", descKey: "feat.1.desc", badgeKey: "feat.1.badge", Demo: FlashcardDemo },
  { Icon: RefreshCw, gradFrom: "#1e7a6e", gradTo: "#2dd4bf", titleKey: "feat.2.title", descKey: "feat.2.desc", badgeKey: "feat.2.badge", Demo: RepetitionDemo },
  { Icon: BarChart3, gradFrom: "#8b4513", gradTo: "#d4702d", titleKey: "feat.3.title", descKey: "feat.3.desc", badgeKey: "feat.3.badge", Demo: ProgressDemo },
  { Icon: FileText, gradFrom: "#5b3fa8", gradTo: "#7c5cbf", titleKey: "feat.4.title", descKey: "feat.4.desc", badgeKey: "feat.4.badge", Demo: ImportDemo },
  { Icon: Zap, gradFrom: "#1e7a6e", gradTo: "#2dd4bf", titleKey: "feat.5.title", descKey: "feat.5.desc", badgeKey: "feat.5.badge", Demo: QuizDemo },
  { Icon: Clock, gradFrom: "#8b4513", gradTo: "#d4702d", titleKey: "feat.6.title", descKey: "feat.6.desc", badgeKey: "feat.6.badge", Demo: ScheduleDemo },
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
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.12em] uppercase mb-4" style={{ color: "rgba(232,232,240,0.4)" }}>{t("feat.label")}</p>
          <h2 className="font-serif-display" style={{ fontSize: "clamp(36px, 4vw, 52px)" }}>
            <span className="text-white">{t("feat.title")}</span>
            <span className="text-gradient">{t("feat.titleGrad")}</span>
          </h2>
        </div>

        <div className="rounded-[20px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.07)" }}>
          <div className="grid md:grid-cols-3" style={{ gap: "1px" }}>
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
