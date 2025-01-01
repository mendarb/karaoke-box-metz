import { useState } from "react";
import { BookingSteps } from "./BookingSteps";
import { BookingFormContent } from "./BookingFormContent";
import { BookingFormLegal } from "./BookingFormLegal";
import { BookingFormActions } from "./BookingFormActions";
import { useBookingForm } from "./hooks/useBookingForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBookingSteps } from "./hooks/useBookingSteps";

export const BookingFormWrapper = () => {
  const [showLegal, setShowLegal] = useState(false);
  const isMobile = useIsMobile();
  const {
    form,
    groupSize,
    setGroupSize,
    duration,
    setDuration,
    currentStep,
    calculatedPrice,
    isSubmitting,
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
    availableHours,
  } = useBookingForm();

  const { steps } = useBookingSteps();

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6">
      <BookingSteps steps={steps} currentStep={currentStep} />
      
      <div className="mt-8">
        <BookingFormContent
          currentStep={currentStep}
          form={form}
          groupSize={groupSize}
          duration={duration}
          calculatedPrice={calculatedPrice}
          onGroupSizeChange={setGroupSize}
          onDurationChange={setDuration}
          onPriceCalculated={handlePriceCalculated}
          onAvailabilityChange={handleAvailabilityChange}
          availableHours={availableHours}
        />
      </div>

      <Dialog open={showLegal} onOpenChange={setShowLegal}>
        <DialogContent className={`
          sm:max-w-[600px]
          ${isMobile ? 'max-h-[90vh] h-auto p-0 rounded-t-xl rounded-b-none fixed bottom-0 mb-0 overflow-hidden' : ''}
        `}>
          <div className={`${isMobile ? 'p-4 overflow-y-auto max-h-[calc(90vh-80px)]' : ''}`}>
            <BookingFormLegal form={form} />
          </div>
        </DialogContent>
      </Dialog>

      <BookingFormActions 
        currentStep={currentStep}
        isSubmitting={isSubmitting}
        onPrevious={handlePrevious}
      />
    </div>
  );
};