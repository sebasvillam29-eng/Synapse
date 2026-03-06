import { Clock, TrendingUp, Smartphone } from "lucide-react";

const items = [
  { icon: <Clock className="w-5 h-5 text-primary" />, text: "Save hours of study time" },
  { icon: <TrendingUp className="w-5 h-5 text-secondary" />, text: "Retain more from every session" },
  { icon: <Smartphone className="w-5 h-5 text-primary" />, text: "Study anywhere, anytime" },
];

const logos = ["Logoipsum", "LOGO", "Logoipsum", "IPSUM", "Logo"];

const ValueStrip = () => (
  <section className="py-16 border-b border-border bg-background">
    <div className="max-w-5xl mx-auto px-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mb-12">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {item.icon}
            <span className="text-sm font-medium text-foreground">{item.text}</span>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mb-6 uppercase tracking-widest">
        Trusted by students from
      </p>
      <div className="flex items-center justify-center gap-12 opacity-40">
        {logos.map((name, i) => (
          <span key={i} className="text-lg font-bold text-muted-foreground tracking-wide">
            {name}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default ValueStrip;
