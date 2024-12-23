import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const useBookingSubmit = (
  form: UseFormReturn<any>,
  groupSize: string,
  duration: string,
  calculatedPrice: number,
  setIsSubmitting: (value: boolean) => void
) => {
  const handleSubmit = async (data: any) => {
    try {
      console.log('🎯 Starting checkout process:', {
        email: data.email,
        date: data.date,
        isTestMode: data.isTestMode
      });

      setIsSubmitting(true);

      // Générer le lien de paiement directement sans créer la réservation
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout',
        {
          body: {
            userId: data.userId,
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
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      if (!checkoutData.url) {
        throw new Error('No checkout URL returned');
      }

      console.log('✅ Checkout URL generated:', {
        url: checkoutData.url,
        isTestMode: form.getValues('isTestMode') || false
      });
      
      window.location.href = checkoutData.url;

    } catch (error: any) {
      console.error('❌ Error in checkout process:', error);
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