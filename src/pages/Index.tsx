import { useState, Suspense, lazy } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUserState } from "@/hooks/useUserState";
import { CookieConsent } from "@/components/legal/cookie-consent/CookieConsent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { AnnouncementBanner } from "@/components/announcements/AnnouncementBanner";

const BookingSection = lazy(() => import("@/components/home/BookingSection"));
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
    <div className="min-h-screen flex flex-col bg-kbox-coral">
      <AnnouncementBanner />
      <main className="flex-grow container mx-auto pb-20 md:pb-0">
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-0 ${isMobile ? 'min-h-screen' : 'min-h-[500px]'}`}>
          {isMobile ? (
            <>
              <div className="md:col-span-2 bg-white min-h-screen">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full min-h-screen">
                    <LoadingSpinner />
                  </div>
                }>
                  <BookingSection 
                    user={user} 
                    onShowAuth={() => setShowAuthModal(true)} 
                  />
                </Suspense>
              </div>
              <div className="md:col-span-1">
                <HeroSection />
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-1">
                <HeroSection />
              </div>
              <div className="md:col-span-2 bg-white">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full min-h-[500px]">
                    <LoadingSpinner />
                  </div>
                }>
                  <BookingSection 
                    user={user} 
                    onShowAuth={() => setShowAuthModal(true)} 
                  />
                </Suspense>
              </div>
            </>
          )}
        </div>

        <div>
          <FeatureGrid />
        </div>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <CookieConsent />
    </div>
  );
};

export default Index;