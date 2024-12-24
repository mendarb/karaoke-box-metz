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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      <main className="flex-grow container mx-auto py-4 px-4 md:py-8 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 md:mb-10 animate-fadeIn text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
              Votre Box Karaoké Privative à Metz
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Vivez une expérience unique dans un cadre confortable et moderne. 
              Chantez vos chansons préférées en toute intimité !
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
            <BookingForm />
          </div>

          <div className="space-y-6 md:space-y-8 py-4 md:py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Users className="w-8 h-8 text-violet-500" />,
                  title: "Jusqu'à 10 personnes",
                  description: "Idéal pour vos soirées entre amis ou en famille"
                },
                {
                  icon: <Music2 className="w-8 h-8 text-violet-500" />,
                  title: "Large choix de titres",
                  description: "Des milliers de chansons disponibles"
                },
                {
                  icon: <Calendar className="w-8 h-8 text-violet-500" />,
                  title: "Réservation simple",
                  description: "Choisissez votre créneau en quelques clics"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm transition-transform hover:translate-y-[-2px]"
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
        </div>
      </main>

      <footer className="mt-auto py-6 bg-white border-t border-gray-100">
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