import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";

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
      <main className="flex-1 overflow-auto">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
