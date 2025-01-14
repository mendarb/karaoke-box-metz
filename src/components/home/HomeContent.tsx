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
    <>
      <HeroSection />
      <FeatureGrid />
      <BookingSection 
        user={user} 
        onShowAuth={() => setShowAuthModal(true)} 
      />
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};