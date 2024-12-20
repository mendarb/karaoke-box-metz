import { Form } from "@/components/ui/form";
import { useBookingForm } from "./hooks/useBookingForm";
import { useBookingSteps } from "./hooks/useBookingSteps";
import { useBookingSubmit } from "./hooks/useBookingSubmit";
import { BookingSteps } from "../BookingSteps";
import { BookingFormContent } from "./BookingFormContent";
import { BookingFormActions } from "./BookingFormActions";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const BookingForm = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  } = useBookingForm();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session && currentStep === 1) {
        setCurrentStep(2);
      }
    };
    checkSession();
  }, [currentStep]);

  const steps = useBookingSteps(currentStep, isAuthenticated);
  const { handleSubmit: submitBooking } = useBookingSubmit(
    form, 
    groupSize, 
    duration, 
    calculatedPrice, 
    setIsSubmitting
  );

  const onSubmit = async (data: any) => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
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
            isAuthenticated={isAuthenticated}
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