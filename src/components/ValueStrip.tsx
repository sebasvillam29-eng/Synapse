import { Clock, TrendingUp, Smartphone } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const ValueStrip = () => {
  const { t } = useLang();
  const items = [
    { icon: <Clock className="w-5 h-5 text-primary" />, text: t("value.save") },
    { icon: <TrendingUp className="w-5 h-5 text-secondary" />, text: t("value.retain") },
    { icon: <Smartphone className="w-5 h-5 text-primary" />, text: t("value.anywhere") },
  ];

  return (
    <section className="py-12 border-y border-border bg-muted/20">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {item.icon}
            <span className="text-sm font-medium text-foreground">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValueStrip;
