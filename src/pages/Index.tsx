import { useState } from "react";
import { BookingForm } from "@/components/BookingForm";
import { AuthModal } from "@/components/auth/AuthModal";
import { Navbar } from "@/components/navigation/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUserState } from "@/hooks/useUserState";
import { LegalLinks } from "@/components/legal/LegalLinks";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { Calendar, Music2, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const isMobile = useIsMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isLoading: userLoading, sessionChecked } = useUserState();

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

  const businessHours = {
    lundi: 'Fermé',
    mardi: 'Fermé',
    mercredi: '17h - 23h',
    jeudi: '17h - 23h',
    vendredi: '17h - 23h',
    samedi: '17h - 23h',
    dimanche: '17h - 23h'
  };

  return (
    <div className="min-h-screen flex flex-col bg-kbox-coral">
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      <main className="flex-grow container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Section gauche */}
          <div className="bg-white/10 p-8 flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Votre Box Karaoké Privatif à Metz
            </h1>
            <p className="text-white/90 mb-6">
              Partagez des moments uniques avec vos proches dans notre espace privatif et confortable.
            </p>
            <div className="inline-block bg-kbox-coral text-white px-6 py-3 w-fit border border-white">
              À partir de 10€ par pers. et par heure
            </div>
          </div>

          {/* Section droite */}
          <div className="bg-white p-8">
            <h2 className="text-2xl text-kbox-coral mb-4">
              Connectez-vous pour réserver
            </h2>
            <p className="text-gray-600 mb-6">
              Pour effectuer une réservation, vous devez être connecté à votre compte.
            </p>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-[#7E3AED] text-white px-6 py-3 hover:bg-[#6D28D9] transition-colors w-full md:w-auto"
            >
              Se connecter / S'inscrire
            </button>
          </div>
        </div>

        {/* Grille des caractéristiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="bg-[#7E3AED] p-8 text-center text-white">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Salle privative</h3>
            <p>Un espace rien que pour vous et vos proches</p>
          </div>
          <div className="bg-white p-8 text-center">
            <Music2 className="w-12 h-12 mx-auto mb-4 text-kbox-coral" />
            <h3 className="text-xl font-semibold mb-2 text-kbox-coral">Large choix</h3>
            <p className="text-gray-600">Des milliers de chansons disponibles</p>
          </div>
          <div className="bg-[#7E3AED] p-8 text-center text-white">
            <Calendar className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Horaires flexibles</h3>
            <p>Du mercredi au dimanche, de 17h à 23h</p>
          </div>
        </div>
      </main>

      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-4 text-kbox-coral">Informations légales</h3>
              <LegalLinks />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 text-kbox-coral">Contact</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: contact@karaoke-box-metz.fr</p>
                <p>Tél: 07 82 49 24 02</p>
                <p>Adresse: 12 Rue des Huiliers, 57000 Metz</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 text-kbox-coral">Horaires</h3>
              <div className="grid grid-cols-1 gap-1">
                {Object.entries(businessHours).map(([day, hours]) => (
                  <div key={day} className="text-sm text-gray-600">
                    <span className="capitalize">{day}:</span>{' '}
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} K.Box - Karaoké Privatif. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <CookieConsent />
    </div>
  );
};

export default Index;