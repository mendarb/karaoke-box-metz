import { UseFormReturn } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

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
        timeSlot: data.timeSlot,
        duration,
        groupSize,
        originalPrice: calculatedPrice,
        finalPrice: data.finalPrice,
        promoCode: data.promoCode,
        discountAmount: data.discountAmount,
        isTestMode: data.isTestMode
      });

      setIsSubmitting(true);

      const formattedDate = format(new Date(data.date), 'yyyy-MM-dd');

      // Vérifier une dernière fois la disponibilité du créneau
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', formattedDate)
        .neq('status', 'cancelled')
        .is('deleted_at', null);

      if (checkError) {
        throw checkError;
      }

      const startHour = parseInt(data.timeSlot);
      const endHour = startHour + parseInt(duration);

      const hasOverlap = existingBookings?.some(booking => {
        const bookingStart = parseInt(booking.time_slot);
        const bookingEnd = bookingStart + parseInt(booking.duration);
        return (
          (startHour >= bookingStart && startHour < bookingEnd) ||
          (endHour > bookingStart && endHour <= bookingEnd) ||
          (startHour <= bookingStart && endHour >= bookingEnd)
        );
      });

      if (hasOverlap) {
        toast({
          title: "Créneau indisponible",
          description: "Ce créneau vient d'être réservé. Veuillez en choisir un autre.",
          variant: "destructive",
        });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Utiliser le prix final si un code promo est appliqué
      const finalPrice = data.finalPrice || calculatedPrice;

      console.log('💰 Prix pour la réservation:', {
        originalPrice: calculatedPrice,
        finalPrice: finalPrice,
        promoCode: data.promoCode,
        discountAmount: data.discountAmount
      });

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          user_id: userId,
          user_email: data.email,
          user_name: data.fullName,
          user_phone: data.phone,
          date: formattedDate,
          time_slot: `${data.timeSlot.toString().padStart(2, '0')}:00`,
          duration,
          group_size: groupSize,
          price: finalPrice, // Utiliser le prix final
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

      console.log('✅ Booking created:', {
        bookingId: booking.id,
        finalPrice: finalPrice,
        promoDetails: {
          code: data.promoCode,
          discountAmount: data.discountAmount
        }
      });

      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-checkout',
        {
          body: {
            bookingId: booking.id,
            userId: userId,
            userEmail: data.email,
            date: formattedDate,
            timeSlot: `${data.timeSlot.toString().padStart(2, '0')}:00`,
            duration,
            groupSize,
            price: calculatedPrice,
            finalPrice: finalPrice,
            message: data.message,
            userName: data.fullName,
            userPhone: data.phone,
            isTestMode: data.isTestMode || false,
            promoCodeId: data.promoCodeId,
            promoCode: data.promoCode,
            discountAmount: data.discountAmount,
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
        finalPrice: finalPrice,
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