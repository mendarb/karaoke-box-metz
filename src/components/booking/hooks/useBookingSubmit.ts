import { UseFormReturn } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { createBooking } from "@/services/bookingService";
import { createCheckoutSession } from "@/services/checkoutService";

export const useBookingSubmit = (
  form: UseFormReturn<any>,
  groupSize: string,
  duration: string,
  calculatedPrice: number,
  setIsSubmitting: (value: boolean) => void
) => {
  const validateBookingData = (data: any) => {
    const requiredFields = ['email', 'fullName', 'phone', 'date', 'timeSlot', 'groupSize', 'duration'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      throw new Error(`Veuillez remplir tous les champs obligatoires`);
    }

    if (!calculatedPrice && calculatedPrice !== 0) {
      throw new Error('Le prix n\'a pas été calculé correctement');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      console.log('🚀 Starting booking submission process', { data });
      setIsSubmitting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session check:', { session });
      
      if (!session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation",
          variant: "destructive",
        });
        return;
      }

      validateBookingData(data);

      const booking = await createBooking({
        userId: session.user.id,
        date: data.date,
        timeSlot: data.timeSlot,
        duration,
        groupSize,
        price: calculatedPrice,
        message: data.message,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        isTestMode: false,
        promoCodeId: form.getValues('promoCodeId'),
      });

      console.log('✅ Booking created:', booking);

      const checkoutUrl = await createCheckoutSession({
        bookingId: booking.id,
        userEmail: data.email,
        date: data.date,
        timeSlot: data.timeSlot,
        duration,
        groupSize,
        price: calculatedPrice,
        finalPrice: form.getValues('finalPrice') || calculatedPrice,
        message: data.message,
        userName: data.fullName,
        userPhone: data.phone,
        isTestMode: false,
        promoCodeId: form.getValues('promoCodeId'),
        promoCode: form.getValues('promoCode'),
      });

      console.log('✅ Checkout URL generated:', checkoutUrl);
      window.location.href = checkoutUrl;

    } catch (error: any) {
      console.error('❌ Error in booking submission:', error);
      toast({
        title: "Erreur lors de la réservation",
        description: error.message || "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};