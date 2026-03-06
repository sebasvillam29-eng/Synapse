import { BookOpen, Layers, Brain, MessageSquare, LayoutDashboard, BarChart3 } from "lucide-react";

const features = [
  { icon: <BookOpen className="w-6 h-6" />, title: "AI Summaries", desc: "Condense pages of notes into key concepts instantly." },
  { icon: <Layers className="w-6 h-6" />, title: "Flashcard Generator", desc: "Auto-create flashcards from any study material." },
  { icon: <Brain className="w-6 h-6" />, title: "AI Quiz Creator", desc: "Generate practice quizzes to test your knowledge." },
  { icon: <MessageSquare className="w-6 h-6" />, title: "Ask Your Notes", desc: "Chat with your notes and get instant answers." },
  { icon: <LayoutDashboard className="w-6 h-6" />, title: "Study Dashboard", desc: "Track all your study materials in one place." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Progress Tracking", desc: "Visualize your learning streaks and retention." },
];

const FeaturesGrid = () => (
  <section id="features" className="py-24 px-6 bg-muted/10">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Everything you need to <span className="text-gradient">study smarter</span>
        </h2>
        <p className="text-muted-foreground">Powerful AI tools designed for real learning.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-6 group hover:border-primary/30 hover:glow-primary transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
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

export default FeaturesGrid;
