import { useState } from "react";
import { BookingForm } from "@/components/BookingForm";
import { AuthModal } from "@/components/auth/AuthModal";
import { Navbar } from "@/components/navigation/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AdminDashboardButton } from "@/components/admin/AdminDashboardButton";
import { useUserState } from "@/hooks/useUserState";

const Index = () => {
  const isMobile = useIsMobile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAdmin, isLoading, sessionChecked } = useUserState();

  // Show loading spinner only during initial load
  if (isLoading && !sessionChecked) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50">
      <Navbar />
      
      <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {isAdmin && <AdminDashboardButton />}

          <div className="mb-6 sm:mb-8 animate-fadeIn">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Réservez votre box karaoké
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-lg">
              Indiquez vos préférences pour réserver votre cabine de karaoké privatif à Metz.
            </p>
          </div>
          <div className={`bg-white/70 backdrop-blur-sm shadow-2xl rounded-3xl ${isMobile ? 'p-4' : 'p-6 sm:p-8'} border border-violet-100/50`}>
            <BookingForm />
          </div>
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