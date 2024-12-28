import { useEffect } from "react";
import { AppRoutes } from "@/components/routing/AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { GoogleVerification } from "@/components/seo/GoogleVerification";
import { initializeGoogleAnalytics, trackPageView } from "@/lib/analytics";
import { useLocation } from "react-router-dom";

import "./App.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    initializeGoogleAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return (
    <>
      <GoogleVerification />
      <AppRoutes />
      <Toaster />
      <SonnerToaster position="bottom-right" />
      <CookieConsent />
    </>
  );
}

export default App;