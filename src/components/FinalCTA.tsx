import { ArrowRight } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const FinalCTA = () => {
  const { t } = useLang();
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="rounded-3xl border border-primary/20 bg-card p-12 sm:p-16 glow-primary relative overflow-hidden">
          <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-secondary/5 blur-[60px] pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative z-10">
            {t("cta.title1")} <span className="text-gradient">{t("cta.title2")}</span> {t("cta.title3")}
          </h2>
          <p className="text-muted-foreground mb-8 relative z-10">{t("cta.subtitle")}</p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] relative z-10"
          >
            {t("cta.button")}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
