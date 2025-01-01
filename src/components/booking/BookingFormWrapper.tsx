import { useState } from "react";
import { BookingFormContent } from "./BookingFormContent";
import { BookingFormActions } from "./BookingFormActions";
import { BookingFormLegal } from "./BookingFormLegal";
import { BookingSteps } from "./BookingSteps";
import { useBookingForm } from "./hooks/useBookingForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

export const BookingFormWrapper = () => {
  const [showLegal, setShowLegal] = useState(false);
  const { currentStep } = useBookingForm();
  const isMobile = useIsMobile();

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
      <BookingSteps currentStep={currentStep} />
      
      <div className="mt-8">
        <BookingFormContent />
      </div>

      <Dialog open={showLegal} onOpenChange={setShowLegal}>
        <DialogContent className={`
          sm:max-w-[600px]
          ${isMobile ? 'h-[90vh] p-0 rounded-t-xl rounded-b-none fixed bottom-0 mb-0' : ''}
        `}>
          <div className={`${isMobile ? 'p-4 overflow-y-auto h-full' : ''}`}>
            <BookingFormLegal onClose={() => setShowLegal(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <BookingFormActions onShowLegal={() => setShowLegal(true)} />
    </div>
  );
};