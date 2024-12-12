import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useBookingEmail } from "./useBookingEmail";
import { useBookingNotifications } from "./useBookingNotifications";
import { Booking } from "./useBookings";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { sendEmail } = useBookingEmail();
  const { notifySuccess, notifyError } = useBookingNotifications();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<void> => {
      console.log('Début de la mutation pour la réservation:', bookingId);
      
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select('*')
        .single();

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
        throw updateError;
      }

      if (!updatedBooking) {
        throw new Error('Réservation non trouvée');
      }

      try {
        await sendEmail(updatedBooking);
        console.log('Email envoyé avec succès');
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
        // On continue même si l'email échoue
      }

      // Mettre à jour le cache immédiatement
      queryClient.setQueryData(['bookings'], (oldData: Booking[] | undefined) => {
        if (!oldData) return [updatedBooking];
        return oldData.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
      });
    },
    onSuccess: () => {
      // Invalider les requêtes pour forcer un re-fetch
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      notifySuccess();
    },
    onError: (error: Error) => {
      console.error('Erreur mutation:', error);
      notifyError(error);
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<void> => {
    try {
      await mutation.mutateAsync({ bookingId, newStatus });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  };

  return { updateBookingStatus };
};