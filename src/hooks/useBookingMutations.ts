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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No session found');
        throw new Error('Session expirée');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== "mendar.bouchali@gmail.com") {
        console.error('Not admin user:', user?.email);
        throw new Error('Accès refusé');
      }

      console.log('Tentative de mise à jour de la réservation:', bookingId);

      // D'abord, vérifions si la réservation existe et est accessible
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .maybeSingle();

      if (fetchError) {
        console.error('Erreur lors de la vérification de la réservation:', fetchError);
        throw fetchError;
      }

      if (!existingBooking) {
        console.error('Réservation non trouvée:', bookingId);
        throw new Error('Réservation non trouvée ou inaccessible');
      }

      // Si la réservation existe, procédons à la mise à jour
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
        throw updateError;
      }
      
      if (!updatedBooking) {
        console.error('Mise à jour échouée - réservation non trouvée:', bookingId);
        throw new Error('La mise à jour a échoué');
      }

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