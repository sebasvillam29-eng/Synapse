import { useState, useEffect, useRef } from "react";
import { useLang } from "@/hooks/useLang";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AiTutorShowcase = () => {
  const { t } = useLang();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Set initial greeting based on lang
  useEffect(() => {
    setMessages([{ role: "assistant", content: t("tutor.greeting") }]);
  }, [t("tutor.greeting")]);

  const scrollBottom = () => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(scrollBottom, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor-chat", {
        body: { messages: newMsgs.map((m) => ({ role: m.role, content: m.content })) },
      });
      if (error) throw error;
      setMessages([...newMsgs, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const chips = [t("tutor.chip1"), t("tutor.chip2"), t("tutor.chip3"), t("tutor.chip4")];

  const renderMd = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\n- /g, "<br/>• ")
      .replace(/\n/g, "<br/>");

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="tutor" className="scroll-reveal" ref={ref} style={{ backgroundColor: "#0f0f18", padding: "100px 24px" }}>
      <div className="max-w-[740px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.14em] uppercase mb-4" style={{ color: "#9d7fe0" }}>{t("tutor.label")}</p>
          <h2 className="font-serif-display" style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>
            <span className="text-white">{t("tutor.title1")}</span>
            <span className="text-gradient">{t("tutor.titleGrad")}</span>
          </h2>
          <p className="text-[15px] mt-3" style={{ color: "rgba(232,232,240,0.45)" }}>{t("tutor.sub")}</p>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {chips.map((c, i) => (
            <button
              key={i}
              onClick={() => sendMessage(c)}
              className="px-4 py-2 rounded-full text-sm transition-all duration-300"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                backgroundColor: "#12121e",
                color: "rgba(232,232,240,0.55)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(124,92,191,0.4)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "rgba(232,232,240,0.55)";
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Chat card */}
        <div
          className="rounded-[20px] overflow-hidden"
          style={{
            backgroundColor: "#12121e",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, #7c5cbf, #2563eb)" }}
            >
              🧠
            </div>
            <div>
              <p className="text-[15px] font-bold text-white">{t("tutor.name")}</p>
              <p className="text-xs flex items-center gap-1.5" style={{ color: "#2dd4bf" }}>
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#2dd4bf" }} />
                {t("tutor.online")}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex flex-col gap-4 overflow-y-auto px-5 py-5" style={{ height: "340px" }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                {m.role === "assistant" && (
                  <div className="flex gap-2.5 max-w-[85%]">
                    <div
                      className="w-8 h-8 rounded-[10px] flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, #7c5cbf, #2563eb)" }}
                    >
                      🧠
                    </div>
                    <div
                      className="px-4 py-3 text-sm leading-relaxed"
                      style={{
                        backgroundColor: "#16162a",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "4px 16px 16px 16px",
                        color: "rgba(232,232,240,0.85)",
                      }}
                      dangerouslySetInnerHTML={{ __html: renderMd(m.content) }}
                    />
                  </div>
                )}
                {m.role === "user" && (
                  <div
                    className="px-4 py-3 text-sm text-white max-w-[80%]"
                    style={{
                      backgroundColor: "rgba(124,92,191,0.25)",
                      border: "1px solid rgba(124,92,191,0.3)",
                      borderRadius: "16px 4px 16px 16px",
                    }}
                  >
                    {m.content}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg, #7c5cbf, #2563eb)" }}>🧠</div>
                <div className="px-4 py-3 flex gap-1.5" style={{ backgroundColor: "#16162a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px 16px 16px 16px" }}>
                  <span className="w-2 h-2 rounded-full ai-dot-1" style={{ backgroundColor: "#9d7fe0" }} />
                  <span className="w-2 h-2 rounded-full ai-dot-2" style={{ backgroundColor: "#9d7fe0" }} />
                  <span className="w-2 h-2 rounded-full ai-dot-3" style={{ backgroundColor: "#9d7fe0" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2.5 px-4 py-3.5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder={t("tutor.placeholder")}
              className="flex-1 bg-transparent text-sm text-white outline-none px-4 py-2.5 rounded-[10px] transition-all duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(124,92,191,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="px-[18px] py-[11px] rounded-xl text-white text-sm font-medium transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #7c5cbf, #9d7fe0)",
                opacity: !input.trim() || loading ? 0.4 : 1,
              }}
            >
              {t("tutor.send")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiTutorShowcase;
