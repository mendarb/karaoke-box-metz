import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { useEffect, useState, Suspense } from "react";
import { initializeGoogleAnalytics, trackPageView } from "@/lib/analytics";
import { GoogleVerification } from "@/components/seo/GoogleVerification";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SupportButton } from "@/components/support/SupportButton";
import { Navbar } from "@/components/navigation/Navbar";
import { AuthModal } from "@/components/auth/AuthModal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
      gcTime: 3600000,
      refetchOnMount: false,
    },
  },
});

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const initGA = async () => {
      try {
        await initializeGoogleAnalytics();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de GA:', error);
      }
    };
    
    initGA();
    
    const minLoadingTime = 500;
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(loadingTimeout);
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <GoogleVerification />
              <div className="flex flex-col min-h-screen">
                <Navbar onShowAuth={() => setShowAuthModal(true)} />
                <div className="bg-kbox-coral text-white py-2 overflow-hidden whitespace-nowrap">
                  <div className="animate-[slideIn_20s_linear_infinite]">
                    <p className="inline-block">
                      🎉 Ouverture le 17 janvier ! Profitez de -10% sur votre réservation avec le code OUVERTURE 🎉
                    </p>
                  </div>
                </div>
                <main className="flex-grow">
                  <AppRoutes />
                </main>
              </div>
              <Toaster />
              <Sonner />
              <PageTracker />
              <SupportButton />
              <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
              />
            </Suspense>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;