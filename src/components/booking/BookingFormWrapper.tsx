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
    setCurrentStep,
    calculatedPrice,
    isSubmitting,
    setIsSubmitting,
    availableHours,
    handlePriceCalculated,
    handleAvailabilityChange,
    handlePrevious,
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

  const validateStep = (step: number) => {
    const requiredFields: { [key: number]: Array<keyof BookingFormValues> } = {
      1: ['email', 'fullName', 'phone'],
      2: ['date', 'timeSlot'],
      3: ['groupSize', 'duration'],
      4: []
    };

    const fields = requiredFields[step];
    if (!fields) return true;

    let isValid = true;
    const errors: string[] = [];

    fields.forEach(field => {
      const value = form.getValues(field);
      if (!value) {
        form.setError(field, {
          type: 'required',
          message: 'Ce champ est requis'
        });
        isValid = false;
        errors.push(field);
      }
    });

    if (!isValid) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
    }

    return isValid;
  };

  const onSubmit = async (data: BookingFormValues) => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 4) {
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

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={isMobile ? "booking-form-mobile pb-32" : "space-y-6"}
      >
        <div className={isMobile ? "booking-steps-mobile" : ""}>
          <BookingSteps steps={steps} currentStep={currentStep} />
        </div>
        
        <div className={isMobile ? "booking-content-mobile" : "min-h-[300px]"}>
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

        <div className={isMobile ? "booking-actions-mobile" : ""}>
          <BookingFormActions
            currentStep={currentStep}
            isSubmitting={isSubmitting}
            onPrevious={handlePrevious}
          />
        </div>
      </form>
    </Form>
  );
};