import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Booking } from "./useBookings";
import { useBookingEmail } from "./useBookingEmail";
import { useBookingCache } from "./useBookingCache";
import { useBookingNotifications } from "./useBookingNotifications";

// Fonction utilitaire pour vérifier l'existence d'une réservation
const getBooking = async (bookingId: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .select()
    .eq('id', bookingId)
    .single();

  if (error) {
    console.error('Erreur lors de la vérification de la réservation:', error);
    throw new Error(`Réservation introuvable: ${error.message}`);
  }

  if (!data) {
    throw new Error('Réservation introuvable');
  }

  return data;
};

// Fonction utilitaire pour mettre à jour une réservation
const updateBooking = async (bookingId: string, newStatus: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Erreur lors de la mise à jour:', error);
    throw error;
  }

  if (!data) {
    throw new Error('La mise à jour a échoué - aucune donnée retournée');
  }

  return data;
};

export const useBookingMutations = () => {
  const queryClient = useQueryClient();
  const { sendEmail } = useBookingEmail();
  const { notifySuccess, notifyError } = useBookingNotifications();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<Booking> => {
      console.log('Début de la mutation pour la réservation:', bookingId);
      
      // Vérifier la session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('Pas de session trouvée');
        throw new Error('Session expirée');
      }

      // Vérifier l'existence de la réservation
      const existingBooking = await getBooking(bookingId);
      console.log('Réservation trouvée:', existingBooking);

      // Mettre à jour la réservation
      const updatedBooking = await updateBooking(bookingId, newStatus);
      console.log('Mise à jour réussie:', updatedBooking);

      // Envoyer l'email après la mise à jour réussie
      try {
        await sendEmail(updatedBooking);
        console.log('Email envoyé avec succès');
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        // On ne throw pas l'erreur ici car la mise à jour a réussi
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