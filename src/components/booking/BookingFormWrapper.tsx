import { Form } from "@/components/ui/form";
import { useBookingSteps } from "./hooks/useBookingSteps";
import { BookingSteps } from "@/components/BookingSteps";
import { BookingFormContent } from "./BookingFormContent";
import { BookingFormActions } from "./BookingFormActions";
import { useBookingFormManager } from "./form/BookingFormManager";
import { useIsMobile } from "@/hooks/use-mobile";

export const BookingFormWrapper = () => {
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
    availableHours,
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
    handleSubmit,
  } = useBookingFormManager();

  const steps = useBookingSteps(currentStep);
  const canProceed = currentStep === 1 ? !!form.getValues('location') : true;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className={isMobile ? "booking-steps-mobile" : ""}>
          <BookingSteps steps={steps} currentStep={currentStep} />
        </div>
        
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
            onLocationSelect={(location) => {
              form.setValue('location', location);
              form.trigger('location');
            }}
          />
        </div>

        {currentStep !== 1 && (
          <BookingFormActions
            currentStep={currentStep}
            isSubmitting={isSubmitting}
            onPrevious={handlePrevious}
            canProceed={canProceed}
          />
        )}
      </form>
    </Form>
  );
};