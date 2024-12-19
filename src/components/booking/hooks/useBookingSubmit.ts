import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useBookingSettings } from "../date-time/hooks/useBookingSettings";

export const useBookingSubmit = (
  form: UseFormReturn<any>,
  groupSize: string,
  duration: string,
  calculatedPrice: number,
  setIsSubmitting: (value: boolean) => void
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: settings } = useBookingSettings();

  const handleSubmit = async (data: any) => {
    try {
      console.log('🚀 Starting booking submission process', { data });
      setIsSubmitting(true);
      
      // Vérifier si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session check:', { session });
      
      if (!session) {
        console.error('❌ No active session found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer une réservation",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Session active:', session.user.email);

      const isTestMode = settings?.isTestMode || false;
      console.log('Mode test activé:', isTestMode);

      // Créer la réservation avec statut pending
      const bookingData = {
        user_id: session.user.id,
        date: data.date,
        time_slot: data.timeSlot,
        duration: duration,
        group_size: groupSize,
        status: 'pending',
        price: calculatedPrice,
        message: data.message || null,
        user_email: data.email,
        user_name: data.fullName,
        user_phone: data.phone,
        payment_status: 'unpaid',
        is_test_booking: isTestMode,
        promo_code_id: form.getValues('promoCodeId'),
      };

      console.log('📝 Creating booking with data:', bookingData);

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (bookingError) {
        console.error('❌ Error creating booking:', bookingError);
        throw bookingError;
      }

      console.log('✅ Booking created successfully:', booking);

      // Créer la session de paiement
      console.log('💳 Creating payment session...');
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: {
          ...bookingData,
          bookingId: booking.id,
          finalPrice: form.getValues('finalPrice') || calculatedPrice,
        }
      });

      if (checkoutError) {
        console.error('❌ Error creating checkout:', checkoutError);
        toast({
          title: "Réservation créée",
          description: "Votre réservation a été créée mais le paiement n'a pas pu être initialisé. Vous recevrez un email avec un lien de paiement.",
          variant: "default",
        });
        navigate('/success?booking_id=' + booking.id);
        return;
      }

      if (!checkoutData?.url) {
        console.error('❌ Payment URL not received');
        toast({
          title: "Réservation créée",
          description: "Votre réservation a été créée mais le paiement n'a pas pu être initialisé. Vous recevrez un email avec un lien de paiement.",
          variant: "default",
        });
        navigate('/success?booking_id=' + booking.id);
        return;
      }

      console.log('✅ Redirecting to:', checkoutData.url);
      window.location.href = checkoutData.url;

    } catch (error: any) {
      console.error('❌ Error in booking submission:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la réservation",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};