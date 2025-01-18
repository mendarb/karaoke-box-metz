import { useBookingForm } from "../hooks/useBookingForm";
import { useBookingSubmit } from "../hooks/useBookingSubmit";
import { useBookingMode } from "../hooks/useBookingMode";
import { useBookingOverlap } from "@/hooks/useBookingOverlap";
import { useStepValidation } from "../validation/useStepValidation";
import { BookingFormValues } from "../types/bookingFormTypes";

export const useBookingFormManager = () => {
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

  const { isTestMode } = useBookingMode();
  const { handleSubmit: submitBooking } = useBookingSubmit(
    form,
    groupSize,
    duration,
    calculatedPrice,
    setIsSubmitting
  );
  const { checkOverlap } = useBookingOverlap();
  const { validateStep } = useStepValidation(form);

  const handleSubmit = async (data: BookingFormValues) => {
    console.log('Form submission attempt:', { currentStep, data });
    
    if (!validateStep(currentStep)) {
      console.log('Validation failed for step:', currentStep);
      return;
    }

    if (currentStep < 4) {
      console.log('Moving to next step:', currentStep + 1);
      setCurrentStep(currentStep + 1);
      return;
    }
    
    console.log('🔧 Payment mode:', isTestMode ? 'TEST' : 'LIVE', {
      isTestMode
    });
    
    form.setValue('isTestMode', isTestMode);
    
    const hasOverlap = await checkOverlap(data.date, data.timeSlot, duration);
    if (hasOverlap) {
      return;
    }

    await submitBooking({ ...data, isTestMode });
  };

  return {
    form,
    groupSize,
    setGroupSize,
    duration,
    setDuration,
    currentStep,
    setCurrentStep,
    calculatedPrice,
    isSubmitting,
    availableHours,
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
    handleSubmit,
  };
};