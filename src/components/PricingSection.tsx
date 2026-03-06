import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    highlight: false,
    features: ["5 summaries per month", "Basic flashcards", "Limited quizzes", "Community support"],
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    price: "$8",
    period: "/month",
    highlight: true,
    features: ["Unlimited summaries", "Unlimited flashcards", "Unlimited quizzes", "Chat with your notes", "Priority AI processing", "Progress analytics"],
    cta: "Upgrade to Pro",
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-24 px-6 bg-muted/10">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Simple, honest <span className="text-gradient">pricing</span>
        </h2>
        <p className="text-muted-foreground">Start free. Upgrade when you're ready.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border p-8 flex flex-col ${
              p.highlight
                ? "border-primary/40 bg-card glow-primary relative"
                : "border-border bg-card"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                Most Popular
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
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 ${
                p.highlight
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border"
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

export default PricingSection;
