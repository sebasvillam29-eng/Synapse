import { Upload, Sparkles, GraduationCap } from "lucide-react";

const steps = [
  { icon: <Upload className="w-6 h-6" />, title: "Upload your notes", desc: "Drag and drop any document, PDF, or typed notes." },
  { icon: <Sparkles className="w-6 h-6" />, title: "AI generates study tools", desc: "Summaries, flashcards and quizzes created in seconds." },
  { icon: <GraduationCap className="w-6 h-6" />, title: "Study & retain more", desc: "Interactive study sessions designed for long-term memory." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          How it <span className="text-gradient">works</span>
        </h2>
        <p className="text-muted-foreground">Three simple steps to smarter studying.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="relative text-center group">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:glow-primary transition-shadow">
              {s.icon}
            </div>
            <span className="absolute -top-2 -right-2 md:static md:mb-3 inline-block text-xs font-bold text-muted-foreground">
              0{i + 1}
            </span>
            <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
