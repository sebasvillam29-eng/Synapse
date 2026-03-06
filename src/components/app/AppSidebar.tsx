import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, Library, MessageSquare, Settings, Zap,
  ChevronLeft, ChevronRight, Crown
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app" },
  { icon: Library, label: "Library", path: "/app/library" },
  { icon: MessageSquare, label: "AI Tutor", path: "/app/chat" },
  { icon: Settings, label: "Settings", path: "/app/settings" },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const w = collapsed ? "w-[60px]" : "w-[240px]";

  return (
    <aside className={`${w} h-screen sticky top-0 flex flex-col bg-sidebar-background border-r border-sidebar-border transition-all duration-300 ease-in-out shrink-0`}>
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-3 h-16 border-b border-sidebar-border">
        <Link to="/app" className="flex items-center gap-2 overflow-hidden">
          <Zap className="w-6 h-6 text-primary shrink-0" />
          {!collapsed && <span className="text-foreground font-bold text-lg whitespace-nowrap">Synapse</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path || (item.path === "/app" && location.pathname === "/app");
          const content = (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group relative ${
                active
                  ? "bg-accent text-accent-foreground border-l-2 border-primary ml-0"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:translate-x-[2px]"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${active ? "text-primary" : ""}`} />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={200}>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return content;
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-primary-foreground"
            style={{ background: "linear-gradient(135deg, hsl(262 83% 58%), hsl(173 80% 40%))" }}>
            SG
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Sebastian G.</p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs px-1.5 py-0.5 rounded bg-accent text-accent-foreground">Free</span>
                <Link to="/app/settings" className="text-xs text-primary hover:underline flex items-center gap-0.5">
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
