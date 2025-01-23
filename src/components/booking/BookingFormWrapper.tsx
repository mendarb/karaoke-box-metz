import { Form } from "@/components/ui/form";
import { useBookingSteps } from "./hooks/useBookingSteps";
import { BookingSteps } from "@/components/BookingSteps";
import { BookingFormContent } from "./BookingFormContent";
import { BookingFormActions } from "./BookingFormActions";
import { useBookingFormManager } from "./form/BookingFormManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";

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

  const validateCurrentStep = () => {
    const values = form.getValues();
    
    switch (currentStep) {
      case 1:
        if (!values.location) {
          toast({
            title: "Erreur",
            description: "Veuillez sélectionner une box",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!values.date || !values.timeSlot) {
          toast({
            title: "Erreur",
            description: "Veuillez sélectionner une date et un créneau horaire",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        if (!values.groupSize || !values.duration) {
          toast({
            title: "Erreur",
            description: "Veuillez sélectionner la taille du groupe et la durée",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const onSubmit = async (data: any) => {
    if (!validateCurrentStep()) {
      return;
    }
    await handleSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={isMobile ? "booking-steps-mobile" : ""}>
          <BookingSteps steps={steps} currentStep={currentStep} />
        </div>
        
        <div className="min-h-[300px]">
          <BookingFormContent
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

        <BookingFormActions
          currentStep={currentStep}
          isSubmitting={isSubmitting}
          onPrevious={handlePrevious}
          canProceed={true}
        />
      </form>
    </Form>
  );
};