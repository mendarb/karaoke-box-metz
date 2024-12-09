import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { DateTimeFields } from "./DateTimeFields";
import { GroupSizeAndDurationFields } from "./GroupSizeAndDurationFields";
import { AdditionalFields } from "./AdditionalFields";
import { BookingSteps, type BookingStep } from "../BookingSteps";
import { useBookingForm } from "./hooks/useBookingForm";
import { checkTimeSlotAvailability } from "./utils/bookingValidation";
import { supabase } from "@/lib/supabase";

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
    toast
  } = useBookingForm();

  const steps: BookingStep[] = [
    {
      id: 1,
      name: "Informations personnelles",
      description: "Vos coordonnées",
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      name: "Date et heure",
      description: "Choisissez votre créneau",
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      name: "Groupe et durée",
      description: "Taille du groupe et durée",
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      name: "Finalisation",
      description: "Informations complémentaires",
      completed: currentStep > 4,
      current: currentStep === 4,
    },
  ];

  const onSubmit = async (data: any) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Starting submission with data:', { ...data, groupSize, duration, calculatedPrice });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation.",
          variant: "destructive",
        });
        return;
      }

      const isAvailable = await checkTimeSlotAvailability(data.date, data.timeSlot, duration, toast);
      if (!isAvailable) {
        console.log('Time slot not available');
        return;
      }

      console.log('Creating checkout session...');
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: JSON.stringify({
          price: calculatedPrice,
          groupSize,
          duration,
          date: data.date,
          timeSlot: data.timeSlot,
          message: data.message,
          userEmail: data.email,
          userName: data.fullName,
          userPhone: data.phone,
        })
      });

      console.log('Checkout response:', { checkoutData, checkoutError });

      if (checkoutError) throw checkoutError;
      if (!checkoutData?.url) throw new Error("URL de paiement non reçue");

      window.location.href = checkoutData.url;
      
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoFields form={form} />;
      case 2:
        return <DateTimeFields 
          form={form} 
          onAvailabilityChange={handleAvailabilityChange}
        />;
      case 3:
        return (
          <GroupSizeAndDurationFields
            form={form}
            onGroupSizeChange={setGroupSize}
            onDurationChange={setDuration}
            onPriceCalculated={handlePriceCalculated}
            availableHours={4}
          />
        );
      case 4:
        return (
          <AdditionalFields 
            form={form} 
            calculatedPrice={calculatedPrice}
            groupSize={groupSize}
            duration={duration}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BookingSteps steps={steps} currentStep={currentStep} />
        
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between space-x-4 pb-20 sm:pb-0">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="w-full"
            >
              Précédent
            </Button>
          )}
          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={isSubmitting}
          >
            {currentStep === 4 ? (isSubmitting ? "Traitement..." : "Procéder au paiement") : "Suivant"}
          </Button>
        </div>
      </form>
    </Form>
  );
};