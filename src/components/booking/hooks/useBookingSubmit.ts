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
      console.log('🎯 Starting booking process:', {
        email: data.email,
        date: data.date,
        isTestMode: data.isTestMode
      });

      setIsSubmitting(true);

      // Créer d'abord la réservation
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          user_email: data.email,
          user_name: data.fullName,
          user_phone: data.phone,
          date: data.date,
          time_slot: data.timeSlot,
          duration,
          group_size: groupSize,
          price: calculatedPrice,
          message: data.message,
          status: 'pending',
          payment_status: 'awaiting_payment',
          is_test_booking: data.isTestMode || false,
          promo_code_id: data.promoCodeId,
        }])
        .select()
        .single();

      if (bookingError) {
        console.error('❌ Error creating booking:', bookingError);
        throw bookingError;
      }

      console.log('✅ Booking created:', booking);

      // Générer le lien de paiement avec l'ID de la réservation
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout',
        {
          body: {
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
            isTestMode: data.isTestMode || false,
            promoCodeId: data.promoCodeId,
            promoCode: data.promoCode,
          }
        }
      );

      if (checkoutError) {
        console.error('❌ Error generating checkout URL:', checkoutError);
        throw checkoutError;
      }

      if (!checkoutData.url) {
        throw new Error('No checkout URL returned');
      }

      console.log('✅ Checkout URL generated:', {
        url: checkoutData.url,
        bookingId: booking.id,
        isTestMode: data.isTestMode || false
      });
      
      window.location.href = checkoutData.url;

    } catch (error: any) {
      console.error('❌ Error in booking process:', error);
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