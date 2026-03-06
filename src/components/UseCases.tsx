import { Stethoscope, Scale, Wrench, Languages } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const UseCases = () => {
  const { t } = useLang();
  const cases = [
    { icon: <Stethoscope className="w-6 h-6" />, title: t("use.premed.title"), desc: t("use.premed.desc"), color: "text-primary" },
    { icon: <Scale className="w-6 h-6" />, title: t("use.law.title"), desc: t("use.law.desc"), color: "text-secondary" },
    { icon: <Wrench className="w-6 h-6" />, title: t("use.eng.title"), desc: t("use.eng.desc"), color: "text-primary" },
    { icon: <Languages className="w-6 h-6" />, title: t("use.lang.title"), desc: t("use.lang.desc"), color: "text-secondary" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("use.title1")} <span className="text-gradient">{t("use.title2")}</span>
          </h2>
          <p className="text-muted-foreground">{t("use.subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6 flex gap-5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
            >
              <div className={`w-12 h-12 rounded-xl bg-muted/50 flex-shrink-0 flex items-center justify-center ${c.color}`}>
                {c.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
