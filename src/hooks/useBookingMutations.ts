import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Booking } from "./useBookings";
import { useBookingEmail } from "./useBookingEmail";
import { useBookingCache } from "./useBookingCache";
import { useBookingNotifications } from "./useBookingNotifications";

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { sendEmail } = useBookingEmail();
  const { notifySuccess, notifyError } = useBookingNotifications();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<Booking> => {
      console.log('Début de la mutation pour la réservation:', bookingId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('Pas de session trouvée');
        throw new Error('Session expirée');
      }

      // Vérification de l'existence de la réservation
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError || !existingBooking) {
        console.error('Erreur lors de la vérification de la réservation:', fetchError);
        throw new Error('Réservation introuvable');
      }

      console.log('Réservation trouvée:', existingBooking);

      // Mise à jour de la réservation
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
        console.error('Mise à jour échouée - pas de données retournées');
        throw new Error('La mise à jour a échoué');
      }

      console.log('Mise à jour réussie:', updatedBooking);

      // Envoi de l'email après la mise à jour réussie
      try {
        await sendEmail(updatedBooking);
        console.log('Email envoyé avec succès');
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      }

      return updatedBooking;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      notifySuccess();
    },
    onError: (error: Error) => {
      console.error('Erreur mutation:', error);
      notifyError(error);
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<Booking> => {
    console.log('Tentative de mise à jour du statut:', { bookingId, newStatus });
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return { updateBookingStatus };
};