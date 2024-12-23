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
      
      const settingsMap = data.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});

      console.log('Site settings loaded:', settingsMap);
      return settingsMap;
    },
  });

  if (userLoading && !sessionChecked || settingsLoading) {
    return <LoadingSpinner />;
  }

  const contactInfo = siteSettings?.contact_info || {
    email: 'contact@karaoke-cabin.fr',
    phone: '01 23 45 67 89',
    address: '1 rue du Karaoké, 57000 Metz'
  };

  const businessHours = siteSettings?.business_hours || {
    description: 'Du mercredi au dimanche',
    hours: '14h00 - 22h00',
    closed: 'Fermé le lundi et mardi'
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-white to-violet-50">
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      <main className="flex-grow container mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 sm:mb-12 animate-fadeIn text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Votre Box Karaoké Privative à Metz
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vivez une expérience unique dans un cadre confortable et moderne. 
              Chantez vos chansons préférées en toute intimité !
            </p>
          </div>

          <div className="glass rounded-3xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-violet-100/20 mb-12">
            <BookingForm />
          </div>

          <div className="space-y-12 sm:space-y-16 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="glass p-6 rounded-xl transform transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <Users className="w-12 h-12 text-violet-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-3">Jusqu'à 10 personnes</h3>
                  <p className="text-gray-600">Idéal pour vos soirées entre amis ou en famille</p>
                </div>
              </div>
              <div className="glass p-6 rounded-xl transform transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <Music2 className="w-12 h-12 text-violet-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-3">Large choix de titres</h3>
                  <p className="text-gray-600">Des milliers de chansons disponibles</p>
                </div>
              </div>
              <div className="glass p-6 rounded-xl transform transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <Calendar className="w-12 h-12 text-violet-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-3">Réservation simple</h3>
                  <p className="text-gray-600">Choisissez votre créneau en quelques clics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 glass border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations légales</h3>
              <LegalLinks />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-600">
                <p>Email: {contactInfo.email}</p>
                <p>Tél: {contactInfo.phone}</p>
                <p>Adresse: {contactInfo.address}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Horaires</h3>
              <div className="space-y-2 text-gray-600">
                <p>{businessHours.description}</p>
                <p>{businessHours.hours}</p>
                <p className="text-sm italic mt-2">{businessHours.closed}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Karaoke Cabin. Tous droits réservés.
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