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

const Index = () => {
  const isMobile = useIsMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isLoading, sessionChecked } = useUserState();

  if (isLoading && !sessionChecked) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-white to-violet-50">
      <Navbar onShowAuth={() => setShowAuthModal(true)} />
      
      <main className="flex-grow container mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 sm:mb-16 animate-fadeIn text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Votre Box Karaoké Privative à Metz
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Vivez une expérience unique dans un cadre confortable et moderne. 
              Chantez vos chansons préférées en toute intimité !
            </p>

            {/* Features section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="glass p-6 rounded-xl">
                <div className="flex flex-col items-center">
                  <Users className="w-12 h-12 text-violet-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Jusqu'à 10 personnes</h3>
                  <p className="text-gray-600">Idéal pour vos soirées entre amis ou en famille</p>
                </div>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="flex flex-col items-center">
                  <Music2 className="w-12 h-12 text-violet-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Large choix de titres</h3>
                  <p className="text-gray-600">Des milliers de chansons disponibles</p>
                </div>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="flex flex-col items-center">
                  <Calendar className="w-12 h-12 text-violet-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Réservation simple</h3>
                  <p className="text-gray-600">Choisissez votre créneau en quelques clics</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-violet-100/20">
            <BookingForm />
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
                <p>Email: contact@karaoke-cabin.fr</p>
                <p>Tél: 01 23 45 67 89</p>
                <p>Adresse: 1 rue du Karaoké, 57000 Metz</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Horaires</h3>
              <div className="space-y-2 text-gray-600">
                <p>Du mercredi au dimanche</p>
                <p>14h00 - 22h00</p>
                <p className="text-sm italic mt-2">Fermé le lundi et mardi</p>
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