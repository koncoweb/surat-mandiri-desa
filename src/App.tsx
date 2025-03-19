
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/layout";
import Dashboard from "./pages/Dashboard";
import Letters from "./pages/Letters";
import LetterDetail from "./pages/LetterDetail";
import CreateLetter from "./pages/CreateLetter";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsAuthChecking(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse bg-muted rounded-full h-12 w-12"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/" element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/letters" element={<Letters />} />
              <Route path="/letters/:id" element={<LetterDetail />} />
              <Route path="/create-letter" element={<CreateLetter />} />
              <Route path="/settings" element={<Settings />} />
              {/* Add more routes as needed */}
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
