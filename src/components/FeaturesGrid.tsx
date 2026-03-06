import { BookOpen, Layers, Brain, MessageSquare, LayoutDashboard, BarChart3 } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const FeaturesGrid = () => {
  const { t } = useLang();
  const features = [
    { icon: <BookOpen className="w-6 h-6" />, title: t("feat.summaries.title"), desc: t("feat.summaries.desc") },
    { icon: <Layers className="w-6 h-6" />, title: t("feat.flashcards.title"), desc: t("feat.flashcards.desc") },
    { icon: <Brain className="w-6 h-6" />, title: t("feat.quiz.title"), desc: t("feat.quiz.desc") },
    { icon: <MessageSquare className="w-6 h-6" />, title: t("feat.ask.title"), desc: t("feat.ask.desc") },
    { icon: <LayoutDashboard className="w-6 h-6" />, title: t("feat.dashboard.title"), desc: t("feat.dashboard.desc") },
    { icon: <BarChart3 className="w-6 h-6" />, title: t("feat.progress.title"), desc: t("feat.progress.desc") },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-muted/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("feat.title1")} <span className="text-gradient">{t("feat.title2")}</span>
          </h2>
          <p className="text-muted-foreground">{t("feat.subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6 group hover:border-primary/30 hover:glow-primary hover:-translate-y-1 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
