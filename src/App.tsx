import { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { initializeGoogleAnalytics, trackPageView } from "@/lib/analytics";

// Lazy load components
const Toaster = lazy(() => import("@/components/ui/toaster").then(mod => ({ default: mod.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(mod => ({ default: mod.Toaster })));
const AppRoutes = lazy(() => import("@/components/routing/AppRoutes").then(mod => ({ default: mod.AppRoutes })));
const GoogleVerification = lazy(() => import("@/components/seo/GoogleVerification").then(mod => ({ default: mod.GoogleVerification })));
const SupportButton = lazy(() => import("@/components/support/SupportButton").then(mod => ({ default: mod.SupportButton })));

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
  useEffect(() => {
    initializeGoogleAnalytics().catch(console.error);
  }, []);

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