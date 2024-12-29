import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { useEffect, useState } from "react";
import { initializeGoogleAnalytics, trackPageView } from "@/lib/analytics";
import { GoogleVerification } from "@/components/seo/GoogleVerification";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SupportButton } from "@/components/support/SupportButton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

// Composant pour suivre les changements de page
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeGoogleAnalytics();
    
    // Simuler un temps minimum de chargement pour éviter un flash
    const minLoadingTime = 1000; // 1 seconde minimum
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(loadingTimeout);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-kbox-coral">
        <div className="text-center">
          <LoadingSpinner className="w-12 h-12 mb-4" />
          <p className="text-white text-sm">Chargement de K.Box...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GoogleVerification />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTracker />
          <AppRoutes />
          <SupportButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
