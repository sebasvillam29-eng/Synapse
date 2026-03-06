import { ArrowRight, BookOpen, Brain, Layers } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground mb-8">
            <Brain className="w-4 h-4 text-primary" />
            AI-Powered Study Companion
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Turn your notes into{" "}
            <span className="text-gradient">summaries, flashcards and quizzes</span>{" "}
            with AI.
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Upload your notes and instantly generate study tools to learn faster. Built for students who want to study smarter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Start Studying Free
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#demo"
              className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted/50 transition-colors"
            >
              Try Demo
            </a>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="max-w-4xl mx-auto animate-float">
          <div className="rounded-2xl border border-border bg-card p-6 glow-primary">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-muted-foreground">Synapse Dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <DashCard icon={<BookOpen className="w-5 h-5 text-primary" />} label="Summaries" value="12 generated" />
              <DashCard icon={<Layers className="w-5 h-5 text-secondary" />} label="Flashcards" value="48 cards" />
              <DashCard icon={<Brain className="w-5 h-5 text-primary" />} label="Quizzes" value="6 completed" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DashCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-xl bg-muted/50 border border-border p-4">
    <div className="flex items-center gap-2 mb-2">{icon}<span className="text-sm font-medium text-foreground">{label}</span></div>
    <p className="text-xs text-muted-foreground">{value}</p>
  </div>
);

export default Hero;
