import { Form } from "@/components/ui/form";
import { useBookingForm } from "./hooks/useBookingForm";
import { useBookingSteps } from "./hooks/useBookingSteps";
import { BookingSteps } from "../BookingSteps";
import { BookingFormContent } from "./BookingFormContent";
import { BookingFormActions } from "./form-actions/BookingFormActions";
import { useRealtimeBookings } from "@/hooks/useRealtimeBookings";

export const BookingForm = () => {
  const {
    form,
    groupSize,
    setGroupSize,
    duration,
    setDuration,
    currentStep,
    setCurrentStep,
    calculatedPrice,
    isSubmitting,
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
    availableHours,
    onSubmit,
  } = useBookingForm();

  const steps = useBookingSteps(currentStep);

  // Activer les mises à jour en temps réel
  useRealtimeBookings();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <BookingSteps steps={steps} currentStep={currentStep} />
        
        <div className="min-h-[300px]">
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

        <BookingFormActions
          currentStep={currentStep}
          isSubmitting={isSubmitting}
          onPrevious={handlePrevious}
        />
      </form>
    </Form>
  );
};