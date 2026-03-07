import { useState, useEffect, useRef } from "react";
import {
  MessageSquare, Send, Plus, Trash2, ThumbsUp, ThumbsDown,
  Copy, RefreshCw, BookOpen, ExternalLink, Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: { icon: string; label: string }[];
}

const suggestions = [
  "Explain the Calvin cycle step by step",
  "What are the key differences between DNA and RNA?",
  "Summarize the causes of World War I",
  "How does supply and demand affect prices?",
  "Explain Newton's three laws of motion",
  "What is the difference between mitosis and meiosis?",
];

const mockChats = [
  { id: 1, title: "Photosynthesis review", time: "2h ago" },
  { id: 2, title: "Organic Chem help", time: "1d ago" },
  { id: 3, title: "History essay prep", time: "3d ago" },
];

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-tutor-chat", {
        body: { messages: updatedMessages.map(m => ({ role: m.role, content: m.content })) },
      });

      if (error) throw error;

      const reply = data?.reply ?? "Sorry, something went wrong. Try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error("AI chat error:", e);
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Something went wrong. Try again." }]);
    } finally {
      setTyping(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const renderMarkdown = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-muted text-primary text-xs font-mono">$1</code>')
      .replace(/\n/g, "<br/>")
      .replace(/(\d+)\. /g, '<br/><span class="text-primary font-semibold">$1.</span> ');

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Chat history sidebar */}
      <div className="w-[250px] border-r border-border flex flex-col shrink-0">
        <div className="p-4">
          <button
            onClick={() => { setMessages([]); setActiveChat(null); }}
            className="w-full px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/30 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-auto px-2 space-y-1">
          {mockChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-300 group flex items-center justify-between ${
                activeChat === chat.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{chat.title}</p>
                <p className="text-xs text-muted-foreground">{chat.time}</p>
              </div>
              <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-6">
          {messages.length === 0 && !typing ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">How can I help you study?</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm -mt-2">
                I've read your study sets. Ask me anything about them.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-left p-3 rounded-xl border border-border bg-card text-sm text-foreground hover:border-primary/30 hover:-translate-y-[2px] transition-all duration-300 active:scale-[0.97] animate-fade-in"
                    style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                  onMouseEnter={() => msg.role === "ai" && setHoveredMsg(i)}
                  onMouseLeave={() => setHoveredMsg(null)}
                >
                  <div className={`max-w-[80%] ${msg.role === "user" ? "" : ""}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border rounded-bl-md"
                    }`}>
                      {msg.role === "ai" ? (
                        <div className="text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                      ) : (
                        msg.content
                      )}
                    </div>

                    {/* Sources */}
                    {msg.sources && (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> Sources
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((s, si) => (
                            <div key={si} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/50 border border-border text-xs text-foreground animate-scale-in"
                              style={{ animationDelay: `${si * 100}ms`, animationFillMode: "both" }}>
                              {s.icon} {s.label} <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action row */}
                    {msg.role === "ai" && hoveredMsg === i && (
                      <div className="flex gap-2 mt-2 animate-fade-in">
                        {[ThumbsUp, ThumbsDown, Copy, RefreshCw].map((Icon, ai) => (
                          <button key={ai} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-300">
                            <Icon className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start animate-fade-in">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-card border border-border">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary ai-dot-1" />
                      <span className="w-2 h-2 rounded-full bg-primary ai-dot-2" />
                      <span className="w-2 h-2 rounded-full bg-primary ai-dot-3" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="max-w-2xl mx-auto flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Ask about your notes..."
              rows={1}
              className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:border-primary/50 transition-colors"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={() => sendMessage(input)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                input.trim() ? "bg-primary text-primary-foreground glow-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
