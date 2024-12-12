import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useBookingEmail } from "./useBookingEmail";
import { useBookingNotifications } from "./useBookingNotifications";
import { Booking } from "./useBookings";

export const useBookingMutations = () => {
  const { sendEmail } = useBookingEmail();
  const { notifySuccess, notifyError } = useBookingNotifications();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<Booking> => {
      console.log('Début de la mise à jour pour la réservation:', bookingId);
      
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Réservation non trouvée');
      }

      try {
        await sendEmail(data);
        console.log('Email envoyé avec succès');
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
      }

      return data;
    },
    onSuccess: () => {
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