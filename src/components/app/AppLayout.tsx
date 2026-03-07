import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Breadcrumbs from "./Breadcrumbs";

const fullScreenRoutes = ["/app/flashcards", "/app/quiz"];

const AppLayout = () => {
  const location = useLocation();
  const isFullScreen = fullScreenRoutes.some((r) => location.pathname.startsWith(r));

  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-background text-foreground animate-fade-in">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto flex flex-col">
        <Breadcrumbs />
        <div className="animate-fade-in flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
