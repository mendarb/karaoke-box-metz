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
      console.log('Début de la mise à jour de la réservation:', { bookingId, newStatus });
      
      // Utilisation de la même approche que pour l'affichage des réservations
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        console.error('Pas de session trouvée');
        throw new Error('Session expirée');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== "mendar.bouchali@gmail.com") {
        console.error('Utilisateur non admin:', user?.email);
        throw new Error('Accès refusé');
      }

      // Mise à jour avec la même structure de requête
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      }

      if (!data) {
        console.error('Réservation non trouvée:', bookingId);
        throw new Error('Réservation non trouvée');
      }

      console.log('Réservation mise à jour avec succès:', data);
      await sendEmail(data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Mise à jour réussie, invalidation du cache');
      invalidateBookings();
      notifySuccess();
    },
    onError: (error: Error) => {
      console.error('Erreur de mutation:', error);
      notifyError(error);
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<Booking> => {
    console.log('Démarrage de la mise à jour du statut:', { bookingId, newStatus });
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return { updateBookingStatus };
};