import { Form } from "@/components/ui/form";
import { useBookingForm } from "./hooks/useBookingForm";
import { useBookingSteps } from "./hooks/useBookingSteps";
import { useBookingSubmit } from "./hooks/useBookingSubmit";
import { BookingSteps } from "@/components/BookingSteps";
import { BookingFormContent } from "./BookingFormContent";
import { BookingFormActions } from "./BookingFormActions";
import { useBookingMode } from "./hooks/useBookingMode";
import { useBookingOverlap } from "@/hooks/useBookingOverlap";
import { toast } from "@/hooks/use-toast";
import { BookingFormValues } from "./types/bookingFormTypes";

export const BookingFormWrapper = () => {
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
    availableHours,
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
    handleNextStep,
  } = useBookingForm();

  const steps = useBookingSteps(currentStep);
  const { isTestMode } = useBookingMode();
  const { handleSubmit: submitBooking } = useBookingSubmit(
    form, 
    groupSize, 
    duration, 
    calculatedPrice, 
    setIsSubmitting
  );
  const { checkOverlap } = useBookingOverlap();

  const onSubmit = async (data: BookingFormValues) => {
    if (currentStep < steps.length) {
      handleNextStep();
      return;
    }
    
    const hasOverlap = await checkOverlap(data.date, data.timeSlot, duration);
    if (hasOverlap) {
      return;
    }

    await submitBooking({ ...data, isTestMode });
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