import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { sendBookingEmail } from "@/services/emailService";
import { Booking } from "./useBookings";

export const useBookingMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: string }): Promise<Booking> => {
      // Vérification de la session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        throw new Error('Vous devez être connecté');
      }

      // Vérification admin
      if (session.user.email !== 'mendar.bouchali@gmail.com') {
        throw new Error('Accès non autorisé');
      }

      // Mise à jour de la réservation
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Error updating booking:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Réservation non trouvée');
      }

      // Envoi de l'email de confirmation
      try {
        await sendBookingEmail(data);
      } catch (error) {
        console.error('Email error:', error);
        // On continue même si l'email échoue
      }

      return data;
    },
    onSuccess: (data) => {
      // Mise à jour du cache
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [data];
        return old.map(booking => 
          booking.id === data.id ? data : booking
        );
      });

      // Rafraîchissement des données
      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      toast({
        title: "Succès",
        description: "Statut de la réservation mis à jour",
      });
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string): Promise<Booking> => {
    return mutation.mutateAsync({ bookingId, newStatus });
  };

  return { updateBookingStatus };
};