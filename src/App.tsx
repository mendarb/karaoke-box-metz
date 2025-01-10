import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "./components/routing/AppRoutes";
import { initGA4 } from "./lib/analytics/ga4";
import { Navbar } from "./components/navigation/Navbar";
import { AuthModal } from "./components/auth/AuthModal";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    initGA4();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="min-h-screen flex flex-col">
          <Navbar onShowAuth={() => setShowAuthModal(true)} />
          <div className="flex-1 flex flex-col">
            <AppRoutes />
          </div>
          <Toaster />
          <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;