import { useState } from "react";
import { BookingForm } from "@/components/BookingForm";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => setShowAuthModal(true)}
            variant="outline"
            className="bg-white"
          >
            Se connecter
          </Button>
        </div>
        <div className="text-center mb-8 sm:mb-12 animate-fadeIn">
          <img 
            src="/lovable-uploads/59d9c366-5156-416c-a63a-8ab38e3fe556.png" 
            alt="Kara-OK Box Privatif"
            className="h-16 sm:h-24 mx-auto mb-6 sm:mb-8 drop-shadow-lg"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Réservez votre box karaoké
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto px-4">
            Réservez votre cabine de karaoké privatif à Metz. Indiquez vos préférences et nous confirmerons votre réservation sous 24 heures.
          </p>
        </div>
        <div className={`bg-white/70 backdrop-blur-sm shadow-2xl rounded-3xl ${isMobile ? 'p-4' : 'p-6 sm:p-8'} border border-violet-100/50`}>
          <BookingForm />
        </div>
      </div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Index;