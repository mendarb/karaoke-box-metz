import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Booking } from "./useBookings";
import { useBookingEmail } from "./useBookingEmail";
import { useBookingCache } from "./useBookingCache";
import { useBookingNotifications } from "./useBookingNotifications";

export const useBookingMutations = () => {
  const { sendEmail } = useBookingEmail();
  const { invalidateBookings } = useBookingCache();
  const { notifySuccess, notifyError } = useBookingNotifications();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<Booking> => {
      console.log('Début de la mutation pour la réservation:', bookingId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('Pas de session trouvée');
        throw new Error('Session expirée');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== "mendar.bouchali@gmail.com") {
        console.error('Utilisateur non admin:', user?.email);
        throw new Error('Accès refusé');
      }

      // Vérifions d'abord si la réservation existe
      const { data: bookings, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId);

      if (fetchError) {
        console.error('Erreur lors de la vérification de la réservation:', fetchError);
        throw fetchError;
      }

      if (!bookings || bookings.length === 0) {
        console.error('Réservation non trouvée:', bookingId);
        throw new Error('Réservation non trouvée ou inaccessible');
      }

      console.log('Réservation trouvée, procédons à la mise à jour');

      // Mise à jour de la réservation
      const { data: updatedBookings, error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select();

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
        throw updateError;
      }

      if (!updatedBookings || updatedBookings.length === 0) {
        console.error('Mise à jour échouée - réservation non trouvée:', bookingId);
        throw new Error('La mise à jour a échoué');
      }

      const updatedBooking = updatedBookings[0];
      console.log('Mise à jour réussie:', updatedBooking);
      
      await sendEmail(updatedBooking);
      return updatedBooking;
    },
    onSuccess: () => {
      invalidateBookings();
      notifySuccess();
    },
    onError: (error: Error) => {
      notifyError(error);
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<Booking> => {
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return { updateBookingStatus };
};