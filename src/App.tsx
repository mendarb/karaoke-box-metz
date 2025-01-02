import { Suspense, lazy, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { initializeGoogleAnalytics, trackPageView } from "@/lib/analytics";

// Lazy load components with explicit loading states
const Toaster = lazy(() => import("@/components/ui/toaster").then(mod => ({ default: mod.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(mod => ({ default: mod.Toaster })));
const AppRoutes = lazy(() => import("@/components/routing/AppRoutes").then(mod => ({ default: mod.AppRoutes })));
const GoogleVerification = lazy(() => import("@/components/seo/GoogleVerification").then(mod => ({ default: mod.GoogleVerification })));
const SupportButton = lazy(() => import("@/components/support/SupportButton").then(mod => ({ default: mod.SupportButton })));

// Optimized QueryClient with faster initial load
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000, // Reduced stale time for faster initial load
      gcTime: 300000, // Reduced cache time
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
    // Initialize app with a shorter timeout
    const initApp = async () => {
      try {
        await Promise.race([
          initializeGoogleAnalytics(),
          new Promise(resolve => setTimeout(resolve, 2000)) // Timeout after 2s
        ]);
      } catch (error) {
        console.error('Error initializing:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initApp();
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Suspense fallback={<LoadingSpinner fullScreen />}>
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