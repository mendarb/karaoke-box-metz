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
        price: calculatedPrice,
        isTestMode: data.isTestMode
      });

      setIsSubmitting(true);

      // Formater la date au format ISO (YYYY-MM-DD)
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

      // Récupérer la session utilisateur si elle existe
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Créer d'abord la réservation
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
            userId: userId,
            userEmail: data.email,
            date: formattedDate,
            timeSlot: `${data.timeSlot.toString().padStart(2, '0')}:00`,
            duration,
            groupSize,
            price: calculatedPrice,
            finalPrice: calculatedPrice,
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