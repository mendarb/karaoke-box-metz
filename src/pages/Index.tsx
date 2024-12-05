import { useState } from "react";
import { BookingForm } from "@/components/BookingForm";
import { AuthModal } from "@/components/auth/AuthModal";
import { BookingFormContainer } from "@/components/booking/BookingFormContainer";
import { BookingFormHeader } from "@/components/booking/BookingFormHeader";
import { BookingFormTitle } from "@/components/booking/BookingFormTitle";
import { BookingFormWrapper } from "@/components/booking/BookingFormWrapper";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <BookingFormContainer>
      <BookingFormHeader onAuthClick={() => setShowAuthModal(true)} />
      <BookingFormTitle />
      <BookingFormWrapper>
        <BookingForm />
      </BookingFormWrapper>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </BookingFormContainer>
  );
};

export default Index;