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
        // First, check if the booking exists
        const { data: existingBooking, error: fetchError } = await supabase
          .from('bookings')
          .select()
          .eq('id', bookingId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching booking:', fetchError);
          throw new Error('Erreur lors de la vérification de la réservation');
        }

        if (!existingBooking) {
          throw new Error('Réservation non trouvée');
        }

        // If booking exists, proceed with update
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

        if (!updatedBooking) {
          throw new Error('La mise à jour a échoué');
        }

        console.log('Successfully updated booking:', updatedBooking);
        return updatedBooking;

      } catch (error: any) {
        console.error('Error in updateBookingStatus:', error);
        throw error;
      }
    },
    onSuccess: (updatedBooking) => {
      // Update the cache with the new booking data
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
      // Always refresh the bookings data after a mutation
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