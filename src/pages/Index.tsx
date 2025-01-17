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
    <div className="min-h-screen flex flex-col bg-[#F1F1F1]">
      <AnnouncementBanner />
      <main className="flex-grow">
        <div className="bg-[#1A1F2C]">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {isMobile ? (
                <>
                  <div className="bg-white min-h-[600px] flex items-center justify-center p-8 order-1">
                    <Suspense fallback={<LoadingSpinner />}>
                      <BookingSection 
                        user={user} 
                        onShowAuth={() => setShowAuthModal(true)} 
                      />
                    </Suspense>
                  </div>
                  <div className="relative min-h-[600px] text-white order-2">
                    <HeroSection />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative min-h-[600px] text-white">
                    <HeroSection />
                  </div>
                  <div className="bg-white min-h-[600px] flex items-center justify-center p-8">
                    <Suspense fallback={<LoadingSpinner />}>
                      <BookingSection 
                        user={user} 
                        onShowAuth={() => setShowAuthModal(true)} 
                      />
                    </Suspense>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <FeatureGrid />
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