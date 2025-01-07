import { useState } from "react";
import { BookingFormWrapper } from "@/components/booking/BookingFormWrapper";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUserState } from "@/hooks/useUserState";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, PaypalLogo, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const BookingForm = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user } = useUserState();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center max-w-xl mx-auto">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Réservez votre session karaoké</h2>
          <p className="text-gray-600">
            Pour effectuer une réservation, vous devez être connecté à votre compte.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button 
            onClick={() => handleAuthClick('login')}
            className="bg-violet-600 hover:bg-violet-700 flex-1"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter
          </Button>

          <Button 
            onClick={() => handleAuthClick('signup')}
            variant="outline"
            className="border-violet-200 hover:bg-violet-50 flex-1"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Créer un compte
          </Button>
        </div>

        <div className="w-full max-w-md pt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Moyens de paiement acceptés</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center p-4 border rounded-lg bg-gray-50">
              <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Paiement en 3x</p>
                <p className="text-xs text-gray-500">Sans frais avec Klarna</p>
              </div>
            </div>

            <div className="flex items-center p-4 border rounded-lg bg-gray-50">
              <PaypalLogo className="w-5 h-5 text-[#00457C] mr-3" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">PayPal</p>
                <p className="text-xs text-gray-500">Paiement sécurisé</p>
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