import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/services/checkoutService";

export const useBookingSubmit = (
  form: UseFormReturn<any>,
  groupSize: string,
  duration: string,
  calculatedPrice: number,
  setIsSubmitting: (value: boolean) => void
) => {
  const handleSubmit = async (data: any) => {
    try {
      console.log('🎯 Starting booking submission process:', {
        email: data.email,
        date: data.date,
        isTestMode: data.isTestMode
      });

      setIsSubmitting(true);

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session check:', session);
      
      if (!session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation",
          variant: "destructive",
        });
        return;
      }

      // Generate checkout URL with explicit test mode parameter
      const checkoutUrl = await createCheckoutSession({
        userId: session.user.id,
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
        isTestMode: form.getValues('isTestMode') || false,
        promoCodeId: form.getValues('promoCodeId'),
        promoCode: form.getValues('promoCode'),
      });

      console.log('✅ Checkout URL generated:', {
        url: checkoutUrl,
        isTestMode: form.getValues('isTestMode') || false
      });
      
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