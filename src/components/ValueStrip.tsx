import { Clock, TrendingUp, Smartphone } from "lucide-react";

const items = [
  { icon: <Clock className="w-5 h-5 text-primary" />, text: "Save hours of study time" },
  { icon: <TrendingUp className="w-5 h-5 text-secondary" />, text: "Retain more from every session" },
  { icon: <Smartphone className="w-5 h-5 text-primary" />, text: "Study anywhere, anytime" },
];

const ValueStrip = () => (
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

export default ValueStrip;
