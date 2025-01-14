import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "./components/routing/AppRoutes";
import { Navbar } from "./components/navigation/Navbar";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import "./App.css";

const AuthModal = lazy(() => 
  import("./components/auth/AuthModal").then(module => ({
    default: module.AuthModal
  }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    // Préchargement des composants critiques
    const preloadCriticalComponents = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          import("./components/auth/AuthModal");
          import("./components/ui/dialog");
        });
      }
    };

    // Analytics avec délai pour ne pas bloquer le rendu initial
    const initAnalytics = async () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(async () => {
          const { initGA4 } = await import("./lib/analytics/ga4");
          initGA4();
        });
      }
    };

    preloadCriticalComponents();
    initAnalytics();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="min-h-screen">
          <Navbar onShowAuth={() => {
            const authModalElement = document.getElementById('auth-modal');
            if (authModalElement) {
              authModalElement.setAttribute('data-state', 'open');
            }
          }} />
          <AppRoutes />
          <Toaster />
          <Suspense fallback={<LoadingSpinner />}>
            <AuthModal />
          </Suspense>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;