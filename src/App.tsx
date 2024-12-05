import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { Calendar } from "./pages/Calendar";
import { Settings } from "./pages/Settings";
import { AuthModal } from "./components/auth/AuthModal";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          throw error;
        }
        
        if (!session) {
          console.log("No session found, keeping auth modal open");
          setIsAuthOpen(true);
        } else {
          console.log("Session found, closing auth modal");
          setIsAuthOpen(false);
        }
      } catch (error: any) {
        console.error("Session check failed:", error);
        toast({
          title: "Erreur de session",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
        setIsAuthOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        console.log("Auth state changed: no session");
        setIsAuthOpen(true);
      } else {
        console.log("Auth state changed: session found");
        setIsAuthOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
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
            <Route 
              path="/admin" 
              element={
                isAuthOpen ? <Navigate to="/login" replace /> : <AdminDashboard />
              } 
            />
            <Route 
              path="/admin/calendar" 
              element={
                isAuthOpen ? <Navigate to="/login" replace /> : <Calendar />
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                isAuthOpen ? <Navigate to="/login" replace /> : <Settings />
              } 
            />
            <Route 
              path="/login" 
              element={
                <>
                  <AuthModal 
                    isOpen={isAuthOpen} 
                    onClose={() => {
                      setIsAuthOpen(false);
                      window.location.href = '/';
                    }} 
                  />
                  {!isAuthOpen && <Navigate to="/" replace />}
                </>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;