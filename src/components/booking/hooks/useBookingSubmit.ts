import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useUserState } from "@/hooks/useUserState";
import { UseFormReturn } from "react-hook-form";

export const useBookingSubmit = (
  form: UseFormReturn<any>,
  groupSize: string,
  duration: string,
  calculatedPrice: number,
  setIsSubmitting: (value: boolean) => void
) => {
  const { user } = useUserState();

  const handleSubmit = async (data: any) => {
    if (!user?.id) {
      console.error('❌ No user ID available:', { user });
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer une réservation",
        variant: "destructive",
      });
      return;
    }

    // Get the duration from the form's duration field
    const bookingDuration = data.duration || duration;

    console.log('🔍 Vérification données réservation:', {
      date: data.date,
      timeSlot: data.timeSlot,
      duration: bookingDuration,
      groupSize,
      calculatedPrice
    });

    // Validate required fields
    if (!data.date || !data.timeSlot || !bookingDuration || !groupSize || !calculatedPrice) {
      console.error('❌ Champs requis manquants:', { 
        date: data.date,
        timeSlot: data.timeSlot,
        duration: bookingDuration,
        groupSize,
        calculatedPrice
      });
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('🎯 Début du processus de réservation:', {
        email: user.email,
        date: data.date,
        timeSlot: data.timeSlot,
        duration: bookingDuration,
        groupSize,
        calculatedPrice,
        finalPrice: data.finalPrice,
        userId: user.id,
        userObject: user
      });

      setIsSubmitting(true);

      const formattedDate = format(new Date(data.date), 'yyyy-MM-dd');

      // Vérifier la disponibilité du créneau
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
      const endHour = startHour + parseInt(bookingDuration);

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

      console.log('📝 Appel de la fonction create-booking avec ID utilisateur:', user.id);

      // S'assurer que nous avons un prix valide
      const finalPrice = data.finalPrice || calculatedPrice;
      if (!finalPrice || finalPrice <= 0) {
        throw new Error('Prix invalide');
      }
      console.log('💰 Prix final:', finalPrice);

      // Appeler la fonction Edge pour créer la réservation
      const { data: response, error } = await supabase.functions.invoke(
        'create-booking',
        {
          body: {
            email: user.email,
            fullName: data.fullName || user.user_metadata?.full_name,
            phone: data.phone || user.user_metadata?.phone,
            date: formattedDate,
            timeSlot: data.timeSlot,
            duration: bookingDuration,
            groupSize,
            price: finalPrice,
            message: data.message,
            isTestMode: data.isTestMode || false,
            userId: user.id,
            promoCode: data.promoCode,
            promoCodeId: data.promoCodeId,
            discountAmount: data.discountAmount
          }
        }
      );

      if (error) throw error;

      if (!response?.url) {
        console.error('❌ Pas d\'URL de paiement retournée:', response);
        throw new Error('Pas d\'URL de paiement retournée');
      }

      console.log('✅ Réservation créée et lien de paiement généré:', {
        checkoutUrl: response.url,
        userId: user.id,
        price: finalPrice,
        duration: bookingDuration,
        responseData: response
      });

      // Rediriger vers la page de paiement Stripe
      window.location.href = response.url;

    } catch (error: any) {
      console.error('❌ Erreur lors de la réservation:', error);
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