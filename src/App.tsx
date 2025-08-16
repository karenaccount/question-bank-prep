import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { QuizProvider } from "@/contexts/QuizContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import QuizList from "./pages/QuizList";
import QuizDetail from "./pages/QuizDetail";
import WrongAnswersBook from "./pages/WrongAnswersBook";
import FavoritesQuizzes from "./pages/FavoritesQuizzes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <QuizProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/quiz-list" element={<QuizList />} />
              <Route path="/quiz/:id" element={<QuizDetail />} />
              <Route path="/wrong-answers" element={<WrongAnswersBook />} />
              <Route path="/favorites" element={<FavoritesQuizzes />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QuizProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
