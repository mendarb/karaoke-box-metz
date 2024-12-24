import { useState } from "react";
import { BookingFormWrapper } from "@/components/booking/BookingFormWrapper";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUserState } from "@/hooks/useUserState";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const BookingForm = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useUserState();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <h2 className="text-2xl font-semibold">Connectez-vous pour réserver</h2>
        <p className="text-gray-600">
          Pour effectuer une réservation, vous devez être connecté à votre compte.
        </p>
        <Button 
          onClick={() => setShowAuthModal(true)}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Se connecter / S'inscrire
        </Button>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return <BookingFormWrapper />;
};