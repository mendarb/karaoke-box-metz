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
import { HeroSection } from "@/components/home/HeroSection";

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
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="w-full lg:w-2/3">
                <BookingForm />
              </div>
              
              {/* Image column - hidden on mobile */}
              <div className="hidden lg:block w-1/3 sticky top-8">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png"
                    alt="Karaoké Box"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <HeroSection />
            <AuthModal 
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              defaultMode="login"
            />
          </>
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