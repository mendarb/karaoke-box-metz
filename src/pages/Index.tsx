import { useState, Suspense, lazy } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUserState } from "@/hooks/useUserState";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { BookingForm } from "@/components/BookingForm";

const Footer = lazy(() => import("@/components/home/Footer"));

const Index = () => {
  const isMobile = useIsMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isLoading: userLoading, sessionChecked, user } = useUserState();

  const { data: siteSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
    },
  });

  if (userLoading && !sessionChecked || settingsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        {user ? (
          <div className="container mx-auto px-4 py-8">
            <BookingForm />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Réservez votre session karaoké
                </h1>
                <p className="text-gray-600">
                  Connectez-vous pour commencer votre réservation
                </p>
              </div>
              <AuthModal 
                isOpen={true}
                onClose={() => {}}
                defaultMode="login"
              />
            </div>
          </div>
        )}
      </main>

      <OnboardingModal />

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <CookieConsent />
    </div>
  );
};

export default Index;