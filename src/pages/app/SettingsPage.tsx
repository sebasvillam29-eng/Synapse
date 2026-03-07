import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Bell, Shield, Palette, LogOut, Check, Crown,
  ChevronRight, Moon, Sun, Monitor, Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Tab = "general" | "account" | "upgrade";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with the basics",
    features: [
      "50 AI flashcards / month",
      "3 document imports",
      "Basic quiz generator",
      "Community support",
    ],
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "/month",
    badge: true,
    description: "Everything you need to ace your exams",
    features: [
      "Unlimited flashcards & imports",
      "Full Exam mode (20+ questions)",
      "Mind Map generator",
      "Spaced repetition engine",
      "Advanced analytics",
      "Anki export",
      "Priority support",
    ],
    recommended: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$29",
    period: "/month",
    description: "Study better together",
    features: [
      "Everything in Pro",
      "Shared decks & notes",
      "Group progress dashboard",
      "Team admin controls",
      "Collaborative workspaces",
      "Dedicated support",
    ],
  },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground font-semibold mb-3" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.09em" }}>
    {children}
  </p>
);

const SettingRow = ({
  icon: Icon,
  label,
  description,
  children,
  border = true,
}: {
  icon?: typeof User;
  label: string;
  description?: string;
  children: React.ReactNode;
  border?: boolean;
}) => (
  <div
    className="flex items-center justify-between"
    style={{
      padding: "16px 0",
      borderBottom: border ? "1px solid rgba(255,255,255,0.05)" : "none",
    }}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground shrink-0" />}
      <div>
        <p className="text-[14px] font-medium" style={{ color: "#e8e8f0" }}>{label}</p>
        {description && <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className="relative transition-all duration-200"
    style={{
      width: 40,
      height: 22,
      borderRadius: 11,
      background: checked ? "rgba(124,92,191,0.5)" : "rgba(255,255,255,0.1)",
    }}
  >
    <div
      className="absolute top-[3px] rounded-full transition-all duration-200"
      style={{
        width: 16,
        height: 16,
        left: checked ? 21 : 3,
        background: checked ? "#9d7fe0" : "rgba(232,232,240,0.4)",
      }}
    />
  </button>
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "general", label: "General", icon: Palette },
    { id: "account", label: "Account", icon: User },
    { id: "upgrade", label: "Upgrade", icon: Crown },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out" });
    navigate("/");
  };

  return (
    <div className="mx-auto" style={{ maxWidth: 720, padding: "40px 48px" }}>
      {/* Header */}
      <h1 className="text-foreground mb-2" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400 }}>
        Settings
      </h1>
      <p className="text-[14px] text-muted-foreground mb-8">Manage your preferences and account.</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-8" style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3, border: "1px solid rgba(255,255,255,0.06)" }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 text-[13px] font-semibold transition-all duration-200 flex-1 justify-center"
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: active ? "rgba(124,92,191,0.15)" : "transparent",
                color: active ? "#e8e8f0" : "rgba(232,232,240,0.45)",
                border: active ? "1px solid rgba(124,92,191,0.3)" : "1px solid transparent",
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "upgrade" && (
                <span
                  className="text-[9px] font-bold uppercase"
                  style={{
                    background: "rgba(251,191,36,0.1)",
                    border: "1px solid rgba(251,191,36,0.3)",
                    color: "rgba(251,191,36,0.9)",
                    letterSpacing: "0.05em",
                    borderRadius: 100,
                    padding: "1px 5px",
                  }}
                >
                  PRO
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="animate-fade-in">
          <SectionLabel>Appearance</SectionLabel>
          <div style={{ background: "#111120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "4px 24px", marginBottom: 28 }}>
            <SettingRow icon={Palette} label="Theme" description="Choose your preferred appearance" border={false}>
              <div className="flex gap-1" style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 2 }}>
                {([
                  { id: "dark" as const, icon: Moon, label: "Dark" },
                  { id: "light" as const, icon: Sun, label: "Light" },
                  { id: "system" as const, icon: Monitor, label: "Auto" },
                ] as const).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="flex items-center gap-1.5 text-[12px] transition-all duration-200"
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      background: theme === t.id ? "rgba(124,92,191,0.2)" : "transparent",
                      color: theme === t.id ? "#9d7fe0" : "rgba(232,232,240,0.4)",
                      fontWeight: theme === t.id ? 600 : 400,
                    }}
                  >
                    <t.icon className="w-3 h-3" />
                    {t.label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </div>

          <SectionLabel>Notifications</SectionLabel>
          <div style={{ background: "#111120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "4px 24px", marginBottom: 28 }}>
            <SettingRow icon={Bell} label="Email notifications" description="Get notified about new features and updates">
              <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
            </SettingRow>
            <SettingRow icon={Bell} label="Study reminders" description="Daily reminders to keep your streak alive">
              <Toggle checked={studyReminders} onChange={setStudyReminders} />
            </SettingRow>
            <SettingRow icon={Bell} label="Weekly digest" description="Summary of your study progress each week" border={false}>
              <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} />
            </SettingRow>
          </div>

          <SectionLabel>Privacy</SectionLabel>
          <div style={{ background: "#111120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "4px 24px" }}>
            <SettingRow icon={Shield} label="Show progress publicly" description="Let others see your mastery stats" border={false}>
              <Toggle checked={showProgress} onChange={setShowProgress} />
            </SettingRow>
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === "account" && (
        <div className="animate-fade-in">
          <SectionLabel>Profile</SectionLabel>
          <div style={{ background: "#111120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
            <div className="flex items-center gap-4 mb-5" style={{ paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #7c5cbf, #2dd4bf)" }}
              >
                S
              </div>
              <div className="flex-1">
                <p className="text-[16px] font-semibold" style={{ color: "#e8e8f0" }}>Sebastian</p>
                <p className="text-[13px] text-muted-foreground">sebastian@email.com</p>
              </div>
              <button
                className="text-[12px] font-medium transition-colors hover:text-foreground"
                style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(232,232,240,0.5)" }}
              >
                Edit
              </button>
            </div>

            <SettingRow label="Display name" description="How others see you">
              <span className="text-[13px] text-muted-foreground">Sebastian</span>
            </SettingRow>
            <SettingRow label="Email" description="Your login email">
              <span className="text-[13px] text-muted-foreground">sebastian@email.com</span>
            </SettingRow>
            <SettingRow label="Plan" border={false}>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-muted-foreground">Free</span>
                <button
                  onClick={() => setActiveTab("upgrade")}
                  className="text-[11px] font-semibold flex items-center gap-1 transition-colors hover:opacity-80"
                  style={{ color: "#9d7fe0" }}
                >
                  <Crown className="w-3 h-3" /> Upgrade
                </button>
              </div>
            </SettingRow>
          </div>

          <SectionLabel>Data & Privacy</SectionLabel>
          <div style={{ background: "#111120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "4px 24px", marginBottom: 28 }}>
            <SettingRow label="Export data" description="Download all your study sets and progress" border={false}>
              <button
                className="text-[12px] font-medium transition-colors hover:text-foreground"
                style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(232,232,240,0.5)" }}
              >
                Export
              </button>
            </SettingRow>
          </div>

          <SectionLabel>Danger zone</SectionLabel>
          <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 14, padding: "4px 24px" }}>
            <SettingRow label="Log out" description="Sign out of your account">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[12px] font-medium transition-colors hover:opacity-80"
                style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
              >
                <LogOut className="w-3 h-3" /> Log out
              </button>
            </SettingRow>
            <SettingRow label="Delete account" description="Permanently delete all your data" border={false}>
              <button
                className="text-[12px] font-medium transition-colors hover:opacity-80"
                style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
              >
                Delete
              </button>
            </SettingRow>
          </div>
        </div>
      )}

      {/* Upgrade Tab */}
      {activeTab === "upgrade" && (
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3" style={{ padding: "6px 14px", borderRadius: 100, background: "rgba(124,92,191,0.08)", border: "1px solid rgba(124,92,191,0.2)" }}>
              <Zap className="w-3.5 h-3.5" style={{ color: "#9d7fe0" }} />
              <span className="text-[12px] font-semibold" style={{ color: "#9d7fe0" }}>Unlock your full potential</span>
            </div>
            <h2 className="text-foreground mb-2" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24 }}>Choose your plan</h2>
            <p className="text-[14px] text-muted-foreground">All plans include a 7-day free trial. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {plans.map(plan => (
              <div
                key={plan.id}
                className="flex flex-col transition-all duration-200"
                style={{
                  padding: "24px 20px",
                  borderRadius: 14,
                  background: plan.recommended ? "#16162a" : "#111120",
                  border: `1px solid ${plan.recommended ? "rgba(124,92,191,0.5)" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: plan.recommended ? "0 8px 32px rgba(124,92,191,0.15)" : "none",
                  position: "relative",
                }}
              >
                {plan.recommended && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase"
                    style={{
                      padding: "3px 12px",
                      borderRadius: 100,
                      background: "linear-gradient(135deg, #7c5cbf, #5b3fa8)",
                      color: "#fff",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Recommended
                  </div>
                )}

                <p className="text-[13px] font-semibold mb-1" style={{ color: plan.recommended ? "#c4a8ff" : "rgba(232,232,240,0.5)" }}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-0.5 mb-2">
                  <span className="text-[28px] font-bold" style={{ color: "#e8e8f0", fontFamily: "'Instrument Serif', serif" }}>{plan.price}</span>
                  <span className="text-[12px] text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-[12px] text-muted-foreground mb-5">{plan.description}</p>

                <div className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: plan.recommended ? "#2dd4bf" : "rgba(232,232,240,0.3)" }} />
                      <span className="text-[12px]" style={{ color: "rgba(232,232,240,0.65)", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full text-[13px] font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    background: plan.current
                      ? "rgba(255,255,255,0.05)"
                      : plan.recommended
                        ? "linear-gradient(135deg, #7c5cbf, #5b3fa8)"
                        : "rgba(255,255,255,0.06)",
                    color: plan.current
                      ? "rgba(232,232,240,0.3)"
                      : plan.recommended
                        ? "#fff"
                        : "rgba(232,232,240,0.7)",
                    border: plan.current || plan.recommended ? "none" : "1px solid rgba(255,255,255,0.1)",
                    cursor: plan.current ? "default" : "pointer",
                    boxShadow: plan.recommended ? "0 4px 16px rgba(124,92,191,0.3)" : "none",
                  }}
                  disabled={plan.current}
                >
                  {plan.current ? "Current plan" : plan.recommended ? "Start free trial →" : "Choose plan"}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-[12px] text-muted-foreground mt-6">
            Questions? <button className="underline hover:text-foreground transition-colors" style={{ color: "#9d7fe0" }}>Contact support</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
