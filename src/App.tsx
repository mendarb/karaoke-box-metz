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
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/calendar" element={<Calendar />} />
            <Route path="/admin/settings" element={<Settings />} />
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