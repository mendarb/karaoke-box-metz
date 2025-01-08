import { useState } from "react";
import { BookingFormWrapper } from "@/components/booking/BookingFormWrapper";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUserState } from "@/hooks/useUserState";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, CreditCard, CircleDollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

export const BookingForm = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user } = useUserState();
  const isMobile = useIsMobile();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-4 sm:p-8 text-center max-w-2xl mx-auto">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Réservez votre session karaoké</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
            Pour profiter de notre box karaoké, connectez-vous à votre compte ou créez-en un nouveau en quelques clics.
          </p>
        </div>

        <div className="w-full max-w-lg space-y-3 sm:space-y-4">
          <Button 
            onClick={() => handleAuthClick('login')}
            size={isMobile ? "default" : "lg"}
            className="w-full bg-violet-600 hover:bg-violet-700 h-12 sm:h-14 text-base"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Se connecter pour réserver
          </Button>

          <Button 
            onClick={() => handleAuthClick('signup')}
            variant="outline"
            size={isMobile ? "default" : "lg"}
            className="w-full border-violet-200 hover:bg-violet-50 h-12 sm:h-14 text-base"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Créer un compte pour réserver
          </Button>
        </div>

        <div className="w-full max-w-lg pt-6 sm:pt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-medium">Moyens de paiement acceptés</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="flex items-center p-4 sm:p-6 border rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm">
              <CreditCard className="w-6 h-6 text-violet-600 mr-4 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm sm:text-base font-semibold text-gray-900">Paiement en 3x</p>
                <p className="text-xs sm:text-sm text-gray-600">Sans frais avec Klarna</p>
              </div>
            </div>

            <div className="flex items-center p-4 sm:p-6 border rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm">
              <CircleDollarSign className="w-6 h-6 text-[#00457C] mr-4 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm sm:text-base font-semibold text-gray-900">PayPal</p>
                <p className="text-xs sm:text-sm text-gray-600">Paiement sécurisé</p>
              </div>
            </div>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          defaultMode={authMode}
        />
      </div>
    );
  }

  return <BookingFormWrapper />;
};