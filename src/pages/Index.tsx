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

interface BusinessHour {
  day: string;
  hours: string;
}

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
      
      const settingsMap = data.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});

      return settingsMap;
    },
  });

  if (userLoading && !sessionChecked || settingsLoading) {
    return <LoadingSpinner />;
  }

  const contactInfo = {
    email: 'contact@karaoke-box-metz.fr',
    phone: '07 82 49 24 02',
    address: '12 Rue des Huiliers, 57000 Metz'
  };

  const businessHours = {
    lundi: { isOpen: false, hours: 'Fermé' },
    mardi: { isOpen: false, hours: 'Fermé' },
    mercredi: { isOpen: true, hours: '17h - 23h' },
    jeudi: { isOpen: true, hours: '17h - 23h' },
    vendredi: { isOpen: true, hours: '17h - 23h' },
    samedi: { isOpen: true, hours: '17h - 23h' },
    dimanche: { isOpen: true, hours: '17h - 23h' }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-kbox-pink to-white">
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      <main className="flex-grow container mx-auto py-4 px-4 md:py-8 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col justify-center animate-fadeIn">
              <h1 className="text-xl md:text-3xl font-bold text-kbox-coral mb-2">
                Votre Box Karaoké Privatif à Metz
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Partagez des moments uniques avec vos proches dans notre espace privatif et confortable.
              </p>
              <div className="mt-4 inline-block bg-kbox-coral text-white px-6 py-2 w-fit">
                <span className="font-bold">À partir de 10€</span> par personne et par heure
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-white/20 p-4 md:p-6">
              <BookingForm />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Users className="w-8 h-8 text-kbox-coral" />,
                title: "Salle privative",
                description: "Un espace rien que pour vous et vos proches"
              },
              {
                icon: <Music2 className="w-8 h-8 text-kbox-coral" />,
                title: "Large choix",
                description: "Des milliers de chansons disponibles"
              },
              {
                icon: <Calendar className="w-8 h-8 text-kbox-coral" />,
                title: "Horaires flexibles",
                description: "Du mercredi au dimanche, de 17h à 23h"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm p-6 border border-white/20 shadow-sm transition-transform hover:translate-y-[-2px]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 bg-white/80 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Informations légales</h3>
              <LegalLinks />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Contact</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: {contactInfo.email}</p>
                <p>Tél: {contactInfo.phone}</p>
                <p>Adresse: {contactInfo.address}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Horaires</h3>
              <div className="grid grid-cols-1 gap-1">
                {Object.entries(businessHours).map(([day, info]) => (
                  <div key={day} className="text-sm text-gray-600">
                    <span className="font-medium capitalize">{day}:</span>{' '}
                    <span>{info.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
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