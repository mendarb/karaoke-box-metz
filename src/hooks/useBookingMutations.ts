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
      console.log('Tentative de mise à jour du statut:', { bookingId, newStatus });
      
      // Vérifier la session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session expirée');
      }

      // Mise à jour directe
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .order('created_at', { ascending: false })
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Aucune réservation mise à jour');
      }

      // Envoi de l'email
      try {
        await sendEmail(data);
        console.log('Email envoyé avec succès');
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      }

      return data;
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

  const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<Booking> => {
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return { updateBookingStatus };
};