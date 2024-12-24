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

  const contactInfo = siteSettings?.contact_info || {
    email: 'contact@karaoke-cabin.fr',
    phone: '01 23 45 67 89',
    address: '1 rue du Karaoké, 57000 Metz'
  };

  const businessHours = siteSettings?.business_hours || {};
  
  const formatBusinessHours = (): BusinessHour[][] => {
    const days = {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche"
    };

    return Object.entries(businessHours)
      .map(([day, settings]: [string, any]): BusinessHour => ({
        day: days[day as keyof typeof days],
        hours: settings?.isOpen ? settings.hours : 'Fermé'
      }))
      .reduce((acc: BusinessHour[][], curr, idx) => {
        if (idx % 2 === 0) {
          acc.push([curr]);
        } else {
          acc[acc.length - 1].push(curr);
        }
        return acc;
      }, []);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50/50 via-white to-violet-50/50">
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      <main className="flex-grow container mx-auto py-4 sm:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-10 animate-fadeIn text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Votre Box Karaoké Privative à Metz
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vivez une expérience unique dans un cadre confortable et moderne. 
              Chantez vos chansons préférées en toute intimité !
            </p>
          </div>

          <div className="glass rounded-2xl shadow-sm p-4 sm:p-6 transition-all duration-300 hover:shadow-md mb-8 sm:mb-12">
            <BookingForm />
          </div>

          <div className="space-y-8 sm:space-y-12 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass p-5 rounded-xl transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex flex-col items-center text-center">
                  <Users className="w-10 h-10 text-violet-500 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Jusqu'à 10 personnes</h3>
                  <p className="text-gray-600 text-sm">Idéal pour vos soirées entre amis ou en famille</p>
                </div>
              </div>
              <div className="glass p-5 rounded-xl transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex flex-col items-center text-center">
                  <Music2 className="w-10 h-10 text-violet-500 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Large choix de titres</h3>
                  <p className="text-gray-600 text-sm">Des milliers de chansons disponibles</p>
                </div>
              </div>
              <div className="glass p-5 rounded-xl transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex flex-col items-center text-center">
                  <Calendar className="w-10 h-10 text-violet-500 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Réservation simple</h3>
                  <p className="text-gray-600 text-sm">Choisissez votre créneau en quelques clics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 glass border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-base font-semibold mb-3">Informations légales</h3>
              <LegalLinks />
            </div>
            <div>
              <h3 className="text-base font-semibold mb-3">Contact</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: {contactInfo.email}</p>
                <p>Tél: {contactInfo.phone}</p>
                <p>Adresse: {contactInfo.address}</p>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-3">Horaires</h3>
              <div className="grid grid-cols-1 gap-1">
                {formatBusinessHours().map((group, groupIdx) => (
                  <div key={groupIdx} className="grid grid-cols-2 gap-2">
                    {group.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-600">
                        <span className="font-medium">{item.day}:</span>{' '}
                        <span>{item.hours}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
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