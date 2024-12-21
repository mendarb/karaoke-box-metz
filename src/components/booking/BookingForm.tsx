import { Form } from "@/components/ui/form";
import { useBookingForm } from "./hooks/useBookingForm";
import { useBookingSteps } from "./hooks/useBookingSteps";
import { useBookingSubmit } from "./hooks/useBookingSubmit";
import { BookingSteps } from "../BookingSteps";
import { BookingFormContent } from "./BookingFormContent";
import { BookingFormActions } from "./BookingFormActions";
import { useBookingOverlap } from "@/hooks/useBookingOverlap";
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
    setIsSubmitting,
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
    availableHours,
  } = useBookingForm();

  const steps = useBookingSteps(currentStep);
  const { handleSubmit: submitBooking } = useBookingSubmit(
    form, 
    groupSize, 
    duration, 
    calculatedPrice, 
    setIsSubmitting
  );
  const { checkOverlap } = useBookingOverlap();

  // Activer les mises à jour en temps réel
  useRealtimeBookings();

  const onSubmit = async (data: any) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Vérifier les chevauchements avant de soumettre
    const hasOverlap = await checkOverlap(data.date, data.timeSlot, duration);
    if (hasOverlap) {
      return;
    }

    await submitBooking(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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