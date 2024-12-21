import { Form } from "@/components/ui/form";
import { useBookingForm } from "@/components/booking/hooks/useBookingForm";
import { useBookingSteps } from "@/components/booking/hooks/useBookingSteps";
import { useBookingSubmit } from "@/components/booking/hooks/useBookingSubmit";
import { BookingSteps } from "@/components/BookingSteps";
import { BookingFormContent } from "@/components/booking/BookingFormContent";
import { BookingFormActions } from "@/components/booking/BookingFormActions";
import { useEffect } from "react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const BookingForm = () => {
  const { session } = useAuthSession();
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

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (session?.user) {
        try {
          const { data: lastBooking, error } = await supabase
            .from('bookings')
            .select('user_name, user_phone')
            .eq('user_id', session.user.id)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (error) {
            console.error('Error fetching user data:', error);
            return;
          }

          // Set email from session
          form.setValue('email', session.user.email || '');
          
          // Set name and phone if available from last booking
          if (lastBooking) {
            form.setValue('fullName', lastBooking.user_name);
            form.setValue('phone', lastBooking.user_phone);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger vos informations",
            variant: "destructive",
          });
        }
      }
    };

    loadUserData();
  }, [session, form]);

  const steps = useBookingSteps(currentStep);
  const { handleSubmit: submitBooking } = useBookingSubmit(
    form, 
    groupSize, 
    duration, 
    calculatedPrice, 
    setIsSubmitting
  );

  const validateStep = (step: number) => {
    const requiredFields = {
      1: ['email', 'fullName', 'phone'],
      2: ['date', 'timeSlot'],
      3: ['groupSize', 'duration'],
      4: []
    }[step];

    if (!requiredFields) return true;

    const isValid = requiredFields.every(field => {
      const value = form.getValues(field);
      if (!value) {
        form.setError(field, {
          type: 'required',
          message: 'Ce champ est requis'
        });
        return false;
      }
      return true;
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

  const onSubmit = async (data: any) => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Set test mode based on environment
    form.setValue('isTestMode', import.meta.env.VITE_STRIPE_MODE === 'test');
    
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