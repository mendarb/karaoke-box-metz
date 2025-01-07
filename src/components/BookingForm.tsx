import { useState } from "react";
import { BookingFormWrapper } from "@/components/booking/BookingFormWrapper";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUserState } from "@/hooks/useUserState";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, CreditCard, CircleDollarSign } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center space-y-8 p-8 text-center max-w-2xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Réservez votre session karaoké</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Pour effectuer une réservation et profiter de notre box karaoké, vous devez être connecté à votre compte.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <Button 
            onClick={() => handleAuthClick('login')}
            size="lg"
            className="bg-violet-600 hover:bg-violet-700 h-14"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Se connecter
          </Button>

          <Button 
            onClick={() => handleAuthClick('signup')}
            variant="outline"
            size="lg"
            className="border-violet-200 hover:bg-violet-50 h-14"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Créer un compte
          </Button>
        </div>

        <div className="w-full max-w-lg pt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-medium">Moyens de paiement acceptés</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center p-6 border rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm">
              <CreditCard className="w-6 h-6 text-violet-600 mr-4" />
              <div className="text-left">
                <p className="text-base font-semibold text-gray-900">Paiement en 3x</p>
                <p className="text-sm text-gray-600">Sans frais avec Klarna</p>
              </div>
            </div>

            <div className="flex items-center p-6 border rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm">
              <CircleDollarSign className="w-6 h-6 text-[#00457C] mr-4" />
              <div className="text-left">
                <p className="text-base font-semibold text-gray-900">PayPal</p>
                <p className="text-sm text-gray-600">Paiement sécurisé</p>
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