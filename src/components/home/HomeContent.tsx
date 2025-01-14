import { HeroSection } from "./HeroSection";
import { FeatureGrid } from "./FeatureGrid";
import BookingSection from "./BookingSection";
import Footer from "./Footer";
import { useState } from "react";
import { useUserState } from "@/hooks/useUserState";
import { AuthModal } from "@/components/auth/AuthModal";

export const HomeContent = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useUserState();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <div className="container mx-auto">
          <FeatureGrid />
        </div>
        <div className="flex-grow">
          <BookingSection 
            user={user} 
            onShowAuth={() => setShowAuthModal(true)} 
          />
        </div>
      </main>
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};