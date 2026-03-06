import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, BookOpen, ExternalLink, ThumbsUp, ThumbsDown, Copy, RefreshCw } from "lucide-react";
import { useLang } from "@/hooks/useLang";

const AiTutorShowcase = () => {
  const { t } = useLang();
  const [started, setStarted] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const answerRef = useRef<HTMLDivElement>(null);

  const fullAnswer = t("tutor.answer");
  const question = t("tutor.question");

  const startDemo = () => {
    setStarted(true);
    setTyping(true);
    setShowAnswer(false);
    setShowSources(false);
    setCharIndex(0);

    setTimeout(() => {
      setTyping(false);
      setShowAnswer(true);
    }, 1500);
  };

  // Typewriter effect
  useEffect(() => {
    if (showAnswer && charIndex < fullAnswer.length) {
      const timer = setTimeout(() => setCharIndex((i) => i + 3), 15);
      return () => clearTimeout(timer);
    }
    if (showAnswer && charIndex >= fullAnswer.length && !showSources) {
      setTimeout(() => setShowSources(true), 400);
    }
  }, [showAnswer, charIndex, fullAnswer.length, showSources]);

  // Auto-scroll
  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.scrollTop = answerRef.current.scrollHeight;
    }
  }, [charIndex]);

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
      .replace(/\n/g, "<br/>")
      .replace(/(\d+)\. /g, '<br/><span class="text-primary font-semibold">$1.</span> ');
  };

  const reset = () => {
    setStarted(false);
    setTyping(false);
    setShowAnswer(false);
    setShowSources(false);
    setCharIndex(0);
  };

  const sources = [
    { label: t("tutor.source1"), icon: "📖" },
    { label: t("tutor.source2"), icon: "📝" },
    { label: t("tutor.source3"), icon: "🎓" },
  ];

  return (
    <section className="py-24 px-6 bg-muted/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("tutor.title1")} <span className="text-gradient">{t("tutor.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("tutor.subtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden glow-primary">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Synapse AI Tutor</p>
              <p className="text-xs text-secondary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
                Online
              </p>
            </div>
          </div>

          {/* Chat body */}
          <div ref={answerRef} className="p-6 min-h-[400px] max-h-[500px] overflow-y-auto space-y-4">
            {!started && (
              <div className="flex flex-col items-center justify-center h-[350px] gap-6 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-center text-sm max-w-sm">
                  {t("tutor.subtitle")}
                </p>
                <button
                  onClick={startDemo}
                  className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
                >
                  {t("nav.tryDemo")}
                </button>
              </div>
            )}

            {started && (
              <>
                {/* User message */}
                <div className="flex justify-end animate-fade-in">
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md bg-primary text-primary-foreground text-sm">
                    {question}
                  </div>
                </div>

                {/* AI typing / answer */}
                <div className="flex justify-start animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
                  <div className="max-w-[85%]">
                    <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-muted/50 border border-border">
                      {typing && (
                        <div className="flex gap-1.5 py-2">
                          <span className="w-2 h-2 rounded-full bg-primary ai-dot-1" />
                          <span className="w-2 h-2 rounded-full bg-primary ai-dot-2" />
                          <span className="w-2 h-2 rounded-full bg-primary ai-dot-3" />
                        </div>
                      )}
                      {showAnswer && (
                        <div
                          className="text-sm text-foreground/90 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(fullAnswer.slice(0, charIndex)) }}
                        />
                      )}
                    </div>

                    {/* Sources */}
                    {showSources && (
                      <div className="mt-3 animate-fade-in">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3" />
                          {t("tutor.sources")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {sources.map((s, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/50 border border-border text-xs text-foreground hover:bg-accent transition-all duration-300 cursor-pointer animate-scale-in"
                              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
                            >
                              <span>{s.icon}</span>
                              {s.label}
                              <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </div>
                          ))}
                        </div>

                        {/* Action row */}
                        <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border/50">
                          {[
                            { icon: ThumbsUp, label: "Like" },
                            { icon: ThumbsDown, label: "Dislike" },
                            { icon: Copy, label: "Copy" },
                            { icon: RefreshCw, label: "Regenerate" },
                          ].map((action, i) => (
                            <button
                              key={i}
                              onClick={action.label === "Regenerate" ? reset : undefined}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
                              title={action.label}
                            >
                              <action.icon className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border px-4 py-3 flex items-center gap-3">
            <input
              type="text"
              placeholder={t("tutor.askPlaceholder")}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              readOnly
              onClick={!started ? startDemo : undefined}
            />
            <button
              className={`p-2 rounded-lg transition-all duration-300 ${
                started ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiTutorShowcase;
