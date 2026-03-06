import { Check } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const PricingSection = () => {
  const { t } = useLang();

  const plans = [
    {
      name: t("price.free"),
      price: "$0",
      period: t("price.forever"),
      highlight: false,
      features: [t("price.f1"), t("price.f2"), t("price.f3"), t("price.f4")],
      cta: t("price.getStartedFree"),
    },
    {
      name: t("price.pro"),
      price: "$8",
      period: t("price.month"),
      highlight: true,
      features: [t("price.p1"), t("price.p2"), t("price.p3"), t("price.p4"), t("price.p5"), t("price.p6")],
      cta: t("price.upgradePro"),
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-muted/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("price.title1")} <span className="text-gradient">{t("price.title2")}</span>
          </h2>
          <p className="text-muted-foreground">{t("price.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-8 flex flex-col hover:-translate-y-1 transition-all duration-300 ${
                p.highlight ? "border-primary/40 bg-card glow-primary relative" : "border-border bg-card"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                  {t("price.mostPopular")}
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground mb-1">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-foreground">{p.price}</span>
                <span className="text-muted-foreground text-sm">{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                    <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] ${
                  p.highlight ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-foreground border border-border hover:bg-muted/80"
                }`}
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
