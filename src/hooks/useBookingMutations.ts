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
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<Booking> => {
      console.log('Début de la mise à jour pour la réservation:', bookingId);
      
      // D'abord, vérifions si la réservation existe
      const { data: existingBooking, error: checkError } = await supabase
        .from('bookings')
        .select()
        .eq('id', bookingId)
        .single();

      if (checkError) {
        console.error('Erreur lors de la vérification:', checkError);
        throw checkError;
      }

      if (!existingBooking) {
        throw new Error('Réservation non trouvée');
      }

      // Ensuite, effectuons la mise à jour
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
        throw updateError;
      }

      if (!updatedBooking) {
        throw new Error('Erreur lors de la mise à jour');
      }

      try {
        await sendEmail(updatedBooking);
        console.log('Email envoyé avec succès');
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
      }

      return updatedBooking;
    },
    onSuccess: (updatedBooking) => {
      // Mettre à jour le cache
      queryClient.setQueryData(['bookings'], (oldData: Booking[] | undefined) => {
        if (!oldData) return [updatedBooking];
        return oldData.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
      });
      
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