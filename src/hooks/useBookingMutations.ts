import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Booking } from "./useBookings";

export const useBookingMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
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

      // First, check if the booking exists and get its current data
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select()
        .eq('id', bookingId)
        .limit(1);

      if (fetchError) {
        console.error('Error fetching booking:', fetchError);
        throw new Error('Erreur lors de la récupération de la réservation');
      }

      if (!booking || booking.length === 0) {
        console.error('No booking found with ID:', bookingId);
        throw new Error('Réservation non trouvée');
      }

      // Perform the update
      const { data: updatedBookings, error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select();

      if (updateError) {
        console.error('Error updating booking:', updateError);
        throw updateError;
      }

      if (!updatedBookings || updatedBookings.length === 0) {
        throw new Error('La mise à jour a échoué');
      }

      const updatedBooking = updatedBookings[0];
      console.log('Successfully updated booking:', updatedBooking);

      // Update the cache
      queryClient.setQueryData(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [updatedBooking];
        return old.map(booking => 
          booking.id === bookingId ? updatedBooking : booking
        );
      });

      // Force a refetch to ensure consistency
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });

    } catch (error: any) {
      console.error('Error in updateBookingStatus:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour",
        variant: "destructive",
      });

      // Refresh data in case of error
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  };

  return {
    updateBookingStatus,
  };
};