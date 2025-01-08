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
          <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
            {/* Colonne de gauche - Formulaire */}
            <div className="flex items-center justify-center p-4 md:p-8 lg:p-12">
              <div className="w-full max-w-md space-y-8">
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Réservez votre session karaoké
                  </h1>
                  <p className="text-gray-600 mb-8">
                    Connectez-vous pour vivre une expérience musicale unique
                  </p>
                </div>
                <AuthModal 
                  isOpen={true}
                  onClose={() => {}}
                  defaultMode="login"
                />
              </div>
            </div>

            {/* Colonne de droite - Image et texte */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0">
                <img 
                  src="/lovable-uploads/cfa63d4d-3758-45b6-8316-13d7d026d109.png"
                  alt="Karaoké Box"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
              </div>
              <div className="relative h-full flex flex-col justify-end p-8 lg:p-12 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Découvrez le Karaoké Box
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Une expérience unique dans un cadre intimiste et chaleureux. 
                  Chantez vos titres préférés en toute liberté !
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      🎤
                    </span>
                    <span>Plus de 30 000 titres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      🎵
                    </span>
                    <span>Son professionnel</span>
                  </div>
                </div>
              </div>
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