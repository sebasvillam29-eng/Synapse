import { Stethoscope, Scale, Wrench, Languages } from "lucide-react";

const cases = [
  { icon: <Stethoscope className="w-6 h-6" />, title: "Pre-Med Students", desc: "Turn dense biology and anatomy notes into bite-sized flashcards and quizzes.", color: "text-primary" },
  { icon: <Scale className="w-6 h-6" />, title: "Law Students", desc: "Summarize case briefs and statutes in seconds — spend more time analyzing.", color: "text-secondary" },
  { icon: <Wrench className="w-6 h-6" />, title: "Engineering Students", desc: "Generate practice problems from lecture notes and textbook chapters.", color: "text-primary" },
  { icon: <Languages className="w-6 h-6" />, title: "Language Learners", desc: "Create vocabulary flashcards automatically from reading passages.", color: "text-secondary" },
];

const UseCases = () => (
  <section className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Designed for <span className="text-gradient">every student</span>
        </h2>
        <p className="text-muted-foreground">No matter what you study, Synapse adapts to your material.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {cases.map((c, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 flex gap-5 hover:border-primary/20 transition-colors">
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

export default UseCases;
