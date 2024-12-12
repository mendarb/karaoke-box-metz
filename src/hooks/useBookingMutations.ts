import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Booking } from "./useBookings";
import { useBookingEmail } from "./useBookingEmail";
import { useBookingNotifications } from "./useBookingNotifications";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { sendEmail } = useBookingEmail();
  const { notifySuccess, notifyError } = useBookingNotifications();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<void> => {
      console.log('Mise à jour de la réservation:', bookingId, 'vers', newStatus);
      
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Erreur mise à jour:', updateError);
        throw updateError;
      }

      // Récupérer la réservation mise à jour
      const { data: updatedBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError || !updatedBooking) {
        console.error('Erreur récupération:', fetchError);
        throw fetchError || new Error('Réservation non trouvée');
      }

      try {
        await sendEmail(updatedBooking);
        console.log('Email envoyé avec succès');
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
        // On continue même si l'email échoue
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      notifySuccess();
    },
    onError: (error: Error) => {
      console.error('Erreur mutation:', error);
      notifyError(error);
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return { updateBookingStatus };
};