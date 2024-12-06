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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Vous devez être connecté pour effectuer cette action');
        }

        const isAdmin = session.user.email === 'mendar.bouchali@gmail.com';
        if (!isAdmin) {
          throw new Error('Permission refusée');
        }

        const { data, error } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId)
          .select('*')
          .maybeSingle();

        if (error) {
          console.error('Error updating booking:', error);
          throw error;
        }

        if (!data) {
          throw new Error('Réservation non trouvée');
        }

        console.log('Successfully updated booking:', data);
        return data;

      } catch (error: any) {
        console.error('Error in updateBookingStatus:', error);
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