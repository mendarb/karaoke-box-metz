import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "./components/routing/AppRoutes";
import { initGA4 } from "./lib/analytics/ga4";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    initGA4();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="min-h-screen">
          <AppRoutes />
          <Toaster />
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;