import { useState } from "react";
import { BookingForm } from "@/components/BookingForm";
import { AuthModal } from "@/components/auth/AuthModal";
import { Navbar } from "@/components/navigation/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminDashboardButton } from "@/components/admin/AdminDashboardButton";
import { useUserState } from "@/hooks/useUserState";
import { LegalLinks } from "@/components/legal/LegalLinks";
import { CookieConsent } from "@/components/legal/CookieConsent";

const Index = () => {
  const isMobile = useIsMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAdmin, isLoading, sessionChecked } = useUserState();

  if (isLoading && !sessionChecked) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-violet-50 via-white to-violet-50">
      <Navbar />
      
      <main className="flex-grow py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {isAdmin && <AdminDashboardButton />}

          <div className="mb-8 sm:mb-10 animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Réservez votre box karaoké
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-lg">
              Indiquez vos préférences pour réserver votre cabine de karaoké privatif à Metz.
              Une expérience unique dans un cadre confortable et moderne.
            </p>
          </div>

          <div className={`bg-white/70 backdrop-blur-sm shadow-2xl rounded-3xl ${
            isMobile ? 'p-4' : 'p-6 sm:p-8'
          } border border-violet-100/50 transition-all duration-300 hover:shadow-violet-100/20`}>
            <BookingForm />
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 border-t bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations légales</h3>
              <LegalLinks />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-600">
                Pour toute question ou assistance, n'hésitez pas à nous contacter :
                <br />
                Email: contact@karaoke-cabin.fr
                <br />
                Tél: 01 23 45 67 89
              </p>
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