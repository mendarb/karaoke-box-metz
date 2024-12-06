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
        // Vérifier la session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }

        // Vérifier si l'utilisateur est admin
        const userEmail = session.user.email;
        if (!userEmail || userEmail !== 'mendar.bouchali@gmail.com') {
          console.error('User not admin:', userEmail);
          throw new Error('Permission refusée');
        }

        // Vérifier d'abord si la réservation existe et est accessible
        const { data: existingBooking, error: fetchError } = await supabase
          .from('bookings')
          .select()
          .eq('id', bookingId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching booking:', fetchError);
          throw new Error('Erreur lors de la recherche de la réservation');
        }

        if (!existingBooking) {
          console.error('No booking found with id:', bookingId);
          throw new Error('Réservation non trouvée');
        }

        // Mettre à jour la réservation
        const { data: updatedBooking, error: updateError } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating booking:', updateError);
          throw new Error('Erreur lors de la mise à jour de la réservation');
        }

        console.log('Successfully updated booking:', updatedBooking);
        return updatedBooking;

      } catch (error: any) {
        console.error('Error in updateBookingStatus:', error);
        
        // Gérer la déconnexion si la session est expirée
        if (error.message.includes('Session expirée')) {
          await supabase.auth.signOut();
          window.location.reload();
        }
        
        throw error;
      }
    },
    onSuccess: (updatedBooking) => {
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