import { useState } from "react";
import { BookingFormWrapper } from "@/components/booking/BookingFormWrapper";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUserState } from "@/hooks/useUserState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { BookingAuthCard } from "./booking/auth/BookingAuthCard";

export const BookingForm = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useUserState();
  const isMobile = useIsMobile();

  const content = !user ? (
    <BookingAuthCard onShowAuthModal={() => setShowAuthModal(true)} />
  ) : (
    <BookingFormWrapper />
  );

  return (
    <>
      {isMobile ? (
        <div className="mobile-scroll-area">
          <ScrollArea className="h-full pb-safe">
            {content}
          </ScrollArea>
        </div>
      ) : (
        content
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};