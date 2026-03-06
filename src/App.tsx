import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/app/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import LibraryPage from "./pages/app/LibraryPage";
import WorkspacePage from "./pages/app/WorkspacePage";
import FlashcardMode from "./pages/app/FlashcardMode";
import QuizMode from "./pages/app/QuizMode";
import ChatPage from "./pages/app/ChatPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="workspace/:id" element={<WorkspacePage />} />
            <Route path="flashcards/:id" element={<FlashcardMode />} />
            <Route path="quiz/:id" element={<QuizMode />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
