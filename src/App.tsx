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

// Optimiser la configuration du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000, // Augmenter le staleTime à 30 secondes
      cacheTime: 3600000, // Cache d'une heure
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

  useEffect(() => {
    // Initialiser GA de manière asynchrone
    const initGA = async () => {
      try {
        await initializeGoogleAnalytics();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de GA:', error);
      }
    };
    
    initGA();
    
    // Réduire le temps de chargement minimum
    const minLoadingTime = 500; // Réduire à 500ms
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
      <BrowserRouter>
        <TooltipProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <GoogleVerification />
            <Toaster />
            <Sonner />
            <PageTracker />
            <AppRoutes />
            <SupportButton />
          </Suspense>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;