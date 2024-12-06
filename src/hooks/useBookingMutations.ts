import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Booking } from "./useBookings";

export const useBookingMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string, newStatus: string }) => {
      console.log('Starting booking status update:', { bookingId, newStatus });
      
      try {
        // Vérifier la session et les permissions
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        const isAdmin = session.user.email === 'mendar.bouchali@gmail.com';
        if (!isAdmin) {
          throw new Error('Permission refusée');
        }

        // Vérifier d'abord si la réservation existe
        const { data: bookings, error: checkError } = await supabase
          .from('bookings')
          .select()
          .eq('id', bookingId);

        if (checkError) {
          console.error('Error checking booking:', checkError);
          throw new Error('Erreur lors de la vérification de la réservation');
        }

        if (!bookings || bookings.length === 0) {
          throw new Error('Réservation non trouvée');
        }

        // Si on arrive ici, la réservation existe, on peut la mettre à jour
        const { data: updatedBookings, error: updateError } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId)
          .select();

        if (updateError) {
          console.error('Error updating booking:', updateError);
          throw new Error('Erreur lors de la mise à jour de la réservation');
        }

        if (!updatedBookings || updatedBookings.length === 0) {
          throw new Error('Erreur lors de la mise à jour de la réservation');
        }

        console.log('Successfully updated booking:', updatedBookings[0]);
        return updatedBookings[0];

      } catch (error: any) {
        console.error('Error in updateBookingStatus:', error);
        // Si l'erreur est liée à la session, on force la déconnexion
        if (error.message.includes('Session expirée')) {
          await supabase.auth.signOut();
          window.location.reload(); // Recharger la page pour réinitialiser l'état
        }
        throw error;
      }
    },
    onSuccess: (updatedBooking) => {
      // Mettre à jour le cache optimistiquement
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [updatedBooking];
        return old.map(booking => 
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
      });

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Rafraîchir les données après la mutation
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    return updateBookingMutation.mutateAsync({ bookingId, newStatus });
  };

  return {
    updateBookingStatus,
  };
};