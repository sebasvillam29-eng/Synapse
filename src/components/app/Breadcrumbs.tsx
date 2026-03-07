import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  path?: string;
}

const routeMap: Record<string, Crumb[]> = {
  "/app/library": [{ label: "Library" }],
  "/app/chat": [{ label: "AI Tutor" }],
  "/app/settings": [{ label: "Settings" }],
};

const Breadcrumbs = () => {
  const location = useLocation();
  const path = location.pathname;

  // Dashboard — no breadcrumbs
  if (path === "/app") return null;

  let crumbs: Crumb[] = [];

  if (routeMap[path]) {
    crumbs = routeMap[path];
  } else if (path.startsWith("/app/workspace/")) {
    crumbs = [
      { label: "Library", path: "/app/library" },
      { label: "Biology Ch.4" },
    ];
  }

  if (crumbs.length === 0) return null;

  return (
    <div className="px-6 py-2 flex items-center gap-1.5 text-sm border-b border-border bg-background/50">
      <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors">
        Home
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
          {crumb.path ? (
            <Link to={crumb.path} className="text-muted-foreground hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
