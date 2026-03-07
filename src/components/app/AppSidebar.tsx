import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Library, MessageSquare, Settings,
  ChevronLeft, ChevronRight, Crown, Gem
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const mainNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app" },
  { icon: Library, label: "Library", path: "/app/library" },
  { icon: MessageSquare, label: "AI Tutor", path: "/app/chat" },
  { icon: null, label: "Full Exam", path: "/app/exam", emoji: "🎓", proBadge: true },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const w = collapsed ? "w-[60px]" : "w-[240px]";

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    if (path === "/app/library") {
      return location.pathname === "/app/library" ||
        location.pathname.startsWith("/app/workspace/") ||
        location.pathname.startsWith("/app/flashcards/") ||
        location.pathname.startsWith("/app/quiz/");
    }
    return location.pathname.startsWith(path);
  };

  const renderNavItem = (item: typeof mainNav[0]) => {
    const active = isActive(item.path);
    const link = (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-out relative ${
          active
            ? "bg-primary/10 text-primary border-l-2 border-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:translate-x-[2px]"
        }`}
      >
        {item.icon ? (
          <item.icon className={`w-5 h-5 shrink-0 ${active ? "text-primary" : ""}`} />
        ) : (
          <span className="w-5 h-5 shrink-0 flex items-center justify-center text-[15px]">{item.emoji}</span>
        )}
        {!collapsed && (
          <>
            <span className="whitespace-nowrap flex-1">{item.label}</span>
            {item.proBadge && (
              <span
                className="text-[9px] font-bold uppercase"
                style={{
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  color: "rgba(251,191,36,0.9)",
                  letterSpacing: "0.05em",
                  borderRadius: 100,
                  padding: "2px 6px",
                }}
              >
                PRO
              </span>
            )}
          </>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.path} delayDuration={100}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }
    return <div key={item.path}>{link}</div>;
  };

  const settingsActive = location.pathname === "/app/settings";
  const settingsLink = (
    <Link
      to="/app/settings"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-out ${
        settingsActive
          ? "bg-primary/10 text-primary border-l-2 border-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:translate-x-[2px]"
      }`}
    >
      <Settings className={`w-5 h-5 shrink-0 ${settingsActive ? "text-primary" : ""}`} />
      {!collapsed && <span>Settings</span>}
    </Link>
  );

  return (
    <aside className={`${w} h-screen sticky top-0 flex flex-col bg-sidebar-background border-r border-sidebar-border transition-all duration-[250ms] ease-in-out shrink-0`}>
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-3 h-16 border-b border-sidebar-border">
        <Link to="/app" className="flex items-center gap-2 overflow-hidden">
          <Gem className="w-6 h-6 text-primary shrink-0" />
          {!collapsed && <span className="text-foreground font-bold text-lg whitespace-nowrap">Synapse</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 flex flex-col">
        <div className="space-y-1">
          {mainNav.map(renderNavItem)}
        </div>

        {/* Settings pushed to bottom */}
        <div className="mt-auto">
          {collapsed ? (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>{settingsLink}</TooltipTrigger>
              <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                Settings
              </TooltipContent>
            </Tooltip>
          ) : settingsLink}
        </div>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-primary-foreground"
            style={{ background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(173 80% 40%))" }}
          >
            S
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Sebastian</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">Free plan</span>
                <Link to="/app/settings" className="text-[11px] text-primary hover:underline flex items-center gap-0.5">
                  <Crown className="w-3 h-3" /> Upgrade →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
